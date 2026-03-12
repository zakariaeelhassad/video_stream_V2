package org.example.userservice.service;

import org.example.userservice.dto.UserDTO;
import org.example.userservice.dto.WatchHistoryDTO;
import org.example.userservice.dto.WatchlistDTO;

import java.util.List;
import java.util.Map;

public interface UserService {
    UserDTO createUser(UserDTO userDTO);

    UserDTO getUserById(Long id);

    List<UserDTO> getAllUsers();

    // Watchlist
    WatchlistDTO addVideoToWatchlist(Long userId, Long videoId);

    void removeVideoFromWatchlist(Long userId, Long videoId);

    List<WatchlistDTO> getUserWatchlist(Long userId);

    // Watch History
    WatchHistoryDTO recordWatchHistory(Long userId, Long videoId, Integer progressTime, Boolean completed);

    List<WatchHistoryDTO> getUserWatchHistory(Long userId);

    // Statistics
    Map<String, Object> getUserViewingStatistics(Long userId);
}
