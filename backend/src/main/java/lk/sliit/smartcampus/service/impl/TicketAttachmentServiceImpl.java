package lk.sliit.smartcampus.service.impl;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Set;
import java.util.UUID;
import lk.sliit.smartcampus.dto.response.TicketAttachmentResponse;
import lk.sliit.smartcampus.entity.Ticket;
import lk.sliit.smartcampus.entity.TicketAttachment;
import lk.sliit.smartcampus.exception.AttachmentLimitException;
import lk.sliit.smartcampus.exception.TicketNotFoundException;
import lk.sliit.smartcampus.mapper.TicketMapper;
import lk.sliit.smartcampus.repository.TicketAttachmentRepository;
import lk.sliit.smartcampus.repository.TicketRepository;
import lk.sliit.smartcampus.service.TicketAttachmentService;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

// this service handles uploading, downloading, and deleting image attachments
// each ticket can have a maximum of 3 images
// only image file types are allowed (png, jpeg, gif)
@Service
@Transactional
public class TicketAttachmentServiceImpl implements TicketAttachmentService {

  private static final int MAX_ATTACHMENTS = 3;
  private static final long MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
  private static final Set<String> ALLOWED_TYPES = Set.of(
      "image/png", "image/jpeg", "image/jpg", "image/gif");
  private static final String UPLOAD_DIR = "uploads/tickets";

  private final TicketAttachmentRepository attachmentRepository;
  private final TicketRepository ticketRepository;
  private final TicketMapper ticketMapper;

  public TicketAttachmentServiceImpl(
      TicketAttachmentRepository attachmentRepository,
      TicketRepository ticketRepository,
      TicketMapper ticketMapper) {
    this.attachmentRepository = attachmentRepository;
    this.ticketRepository = ticketRepository;
    this.ticketMapper = ticketMapper;
  }

  // upload an image attachment for a ticket
  // first we validate the file type and size, then check if max count is reached
  // the file is saved to disk and metadata is stored in the database
  @Override
  public TicketAttachmentResponse uploadAttachment(Long ticketId, MultipartFile file) {
    Ticket ticket = ticketRepository.findById(ticketId)
        .orElseThrow(() -> new TicketNotFoundException(ticketId));

    // check if attachment limit is reached
    long currentCount = attachmentRepository.countByTicket_TicketId(ticketId);
    if (currentCount >= MAX_ATTACHMENTS) {
      throw new AttachmentLimitException(
          "Maximum " + MAX_ATTACHMENTS + " attachments allowed per ticket");
    }

    // validate file type is an image
    String contentType = file.getContentType();
    if (contentType == null || !ALLOWED_TYPES.contains(contentType.toLowerCase())) {
      throw new AttachmentLimitException(
          "Only image files are allowed (PNG, JPEG, GIF)");
    }

    // validate file size
    if (file.getSize() > MAX_FILE_SIZE) {
      throw new AttachmentLimitException(
          "File size must be less than 5MB");
    }

    // generate a unique name and save the file to disk
    String originalName = file.getOriginalFilename() != null ? file.getOriginalFilename() : "image";
    String extension = originalName.contains(".")
        ? originalName.substring(originalName.lastIndexOf('.'))
        : ".png";
    String storedName = UUID.randomUUID() + extension;

    Path uploadPath = Paths.get(UPLOAD_DIR, String.valueOf(ticketId)).toAbsolutePath();
    try {
      Files.createDirectories(uploadPath);
      Path filePath = uploadPath.resolve(storedName);
      Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

      TicketAttachment attachment = TicketAttachment.builder()
          .ticket(ticket)
          .fileName(originalName)
          .storedName(storedName)
          .filePath(filePath.toString())
          .fileSize(file.getSize())
          .contentType(contentType)
          .createdAt(LocalDateTime.now())
          .build();

      TicketAttachment saved = attachmentRepository.save(attachment);
      return ticketMapper.toAttachmentResponse(saved);

    } catch (IOException e) {
      throw new RuntimeException("Failed to save attachment file: " + e.getMessage(), e);
    }
  }

  @Override
  @Transactional(readOnly = true)
  public List<TicketAttachmentResponse> getAttachmentsByTicket(Long ticketId) {
    return attachmentRepository.findByTicket_TicketId(ticketId).stream()
        .map(ticketMapper::toAttachmentResponse)
        .toList();
  }

  // download an attachment file by reading it from disk
  @Override
  @Transactional(readOnly = true)
  public Resource downloadAttachment(Long ticketId, Long attachmentId) {
    TicketAttachment attachment = attachmentRepository.findById(attachmentId)
        .orElseThrow(() -> new RuntimeException("Attachment not found: " + attachmentId));

    try {
      Path filePath = Paths.get(attachment.getFilePath());
      Resource resource = new UrlResource(filePath.toUri());
      if (resource.exists() && resource.isReadable()) {
        return resource;
      }
      throw new RuntimeException("File not found on disk: " + attachment.getFilePath());
    } catch (IOException e) {
      throw new RuntimeException("Failed to read attachment file: " + e.getMessage(), e);
    }
  }

  @Override
  @Transactional(readOnly = true)
  public String getContentType(Long attachmentId) {
    return attachmentRepository.findById(attachmentId)
        .map(TicketAttachment::getContentType)
        .orElse("application/octet-stream");
  }

  // delete an attachment from both disk and database
  @Override
  public void deleteAttachment(Long ticketId, Long attachmentId) {
    TicketAttachment attachment = attachmentRepository.findById(attachmentId)
        .orElseThrow(() -> new RuntimeException("Attachment not found: " + attachmentId));

    try {
      Path filePath = Paths.get(attachment.getFilePath());
      Files.deleteIfExists(filePath);
    } catch (IOException e) {
      // log warning but continue with database deletion
    }

    attachmentRepository.deleteById(attachmentId);
  }
}
