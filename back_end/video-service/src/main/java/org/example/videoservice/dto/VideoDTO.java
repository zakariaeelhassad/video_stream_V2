package org.example.videoservice.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.example.videoservice.model.Category;
import org.example.videoservice.model.Type;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class VideoDTO {
    private Long id;
    private String title;
    private String description;
    private String thumbnailUrl;
    private String trailerUrl;
    private Integer duration;
    private Integer releaseYear;
    private Type type;
    private Category category;
    private Double rating;
    private String director;
    private String castMembers;
}
