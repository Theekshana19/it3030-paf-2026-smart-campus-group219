package lk.sliit.smartcampus.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import java.time.LocalDateTime;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "ResourceTags")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ResourceTag {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  @Column(name = "TagId")
  private Long tagId;

  @Column(name = "TagName", nullable = false, unique = true, length = 80)
  private String tagName;

  @Column(name = "TagColor", length = 30)
  private String tagColor;

  @Column(name = "Description", length = 300)
  private String description;

  @Column(name = "IsActive", nullable = false)
  private Boolean isActive;

  @Column(name = "CreatedAt", nullable = false, updatable = false)
  private LocalDateTime createdAt;

  @Column(name = "UpdatedAt", nullable = false)
  private LocalDateTime updatedAt;
}

