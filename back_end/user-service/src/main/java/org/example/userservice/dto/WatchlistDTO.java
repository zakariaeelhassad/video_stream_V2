package org.example.userservice.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class WatchlistDTO {
    private Long id;
    private Long userId;
    private Long videoId;
    private LocalDateTime addedAt;

    // Transformed video details retrieved via FeignClient
    private VideoDTO videoDetails;
}
