package org.example.userservice.mapper;

import org.example.userservice.dto.WatchHistoryDTO;
import org.example.userservice.model.WatchHistory;
import org.springframework.stereotype.Component;

@Component
public class WatchHistoryMapper {

    public WatchHistoryDTO toDTO(WatchHistory history) {
        if (history == null)
            return null;
        return WatchHistoryDTO.builder()
                .id(history.getId())
                .userId(history.getUser().getId())
                .videoId(history.getVideoId())
                .watchedAt(history.getWatchedAt())
                .progressTime(history.getProgressTime())
                .completed(history.getCompleted())
                .build();
    }
}
