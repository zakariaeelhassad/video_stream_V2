package org.example.userservice.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class VideoDTO {
    private Long id;
    private String title;
    private String thumbnailUrl;
    private String trailerUrl;
    private Integer duration;
    // other fields omitted for brevity, keeping only essential for display
}
