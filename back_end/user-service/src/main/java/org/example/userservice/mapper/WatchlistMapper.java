package org.example.userservice.mapper;

import org.example.userservice.dto.WatchlistDTO;
import org.example.userservice.model.Watchlist;
import org.springframework.stereotype.Component;

@Component
public class WatchlistMapper {

    public WatchlistDTO toDTO(Watchlist watchlist) {
        if (watchlist == null)
            return null;
        return WatchlistDTO.builder()
                .id(watchlist.getId())
                .userId(watchlist.getUser().getId())
                .videoId(watchlist.getVideoId())
                .addedAt(watchlist.getAddedAt())
                .build();
    }
}
