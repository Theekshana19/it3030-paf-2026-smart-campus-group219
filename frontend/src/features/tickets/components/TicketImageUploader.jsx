import { useCallback, useRef } from 'react';
import { toast } from 'sonner';
import * as ticketsApi from '../api/ticketsApi.js';
import { getErrorMessage } from '../../../services/httpClient.js';
import Icon from '../../../components/common/Icon.jsx';

// this is the image uploader component that handles file selection
// it supports drag and drop and shows preview thumbnails
// maximum of 3 images can be uploaded per ticket
export default function TicketImageUploader({ ticketId, attachments, onUploaded }) {
  const fileInputRef = useRef(null);

  const handleFileSelect = useCallback(
    async (files) => {
      if (!ticketId) return;
      for (const file of files) {
        if (attachments.length >= 3) {
          toast.error('Maximum 3 images allowed per ticket');
          break;
        }
        try {
          await ticketsApi.uploadAttachment(ticketId, file);
          toast.success(`Uploaded ${file.name}`);
          onUploaded();
        } catch (e) {
          toast.error(getErrorMessage(e));
        }
      }
    },
    [ticketId, attachments, onUploaded]
  );

  const handleDelete = useCallback(
    async (attachmentId) => {
      try {
        await ticketsApi.deleteAttachment(ticketId, attachmentId);
        toast.success('Attachment removed');
        onUploaded();
      } catch (e) {
        toast.error(getErrorMessage(e));
      }
    },
    [ticketId, onUploaded]
  );

  return (
    <div className="bg-surface-container-lowest p-6 rounded-xl shadow-sm">
      <div className="flex items-center gap-3 mb-5">
        <span className="w-8 h-8 rounded-lg bg-secondary-container flex items-center justify-center text-secondary">
          <Icon name="photo_camera" className="text-xl" />
        </span>
        <h3 className="text-lg font-bold font-manrope">
          Attachments ({attachments.length}/3)
        </h3>
      </div>

      {/* show existing attachment thumbnails */}
      <div className="flex flex-wrap gap-3 mb-4">
        {attachments.map((att) => (
          <div key={att.attachmentId} className="relative group">
            <img
              src={`/api/tickets/${ticketId}/attachments/${att.attachmentId}`}
              alt={att.fileName}
              className="w-24 h-24 object-cover rounded-lg border border-surface-container-high"
            />
            <button
              type="button"
              onClick={() => handleDelete(att.attachmentId)}
              className="absolute -top-2 -right-2 w-6 h-6 bg-error text-on-error rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <Icon name="close" className="text-sm" />
            </button>
            <p className="text-xs text-on-surface-variant mt-1 truncate w-24">{att.fileName}</p>
          </div>
        ))}

        {/* add image button (only shown if less than 3 attachments) */}
        {attachments.length < 3 && ticketId && (
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="w-24 h-24 border-2 border-dashed border-surface-container-high rounded-lg flex flex-col items-center justify-center text-on-surface-variant hover:border-primary/40 hover:text-primary transition-colors"
          >
            <Icon name="add_photo_alternate" className="text-2xl" />
            <span className="text-xs mt-1 font-label">Add</span>
          </button>
        )}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/png,image/jpeg,image/gif"
        className="hidden"
        onChange={(e) => {
          if (e.target.files?.length) handleFileSelect(Array.from(e.target.files));
          e.target.value = '';
        }}
      />

      <p className="text-xs text-on-surface-variant font-body">
        Accepted formats: PNG, JPEG, GIF. Max size: 5MB per image.
      </p>
    </div>
  );
}
