package org.example.userservice.service;

import lombok.RequiredArgsConstructor;
import org.example.userservice.client.VideoServiceClient;
import org.example.userservice.dto.UserDTO;
import org.example.userservice.dto.VideoDTO;
import org.example.userservice.dto.WatchHistoryDTO;
import org.example.userservice.dto.WatchlistDTO;
import org.example.userservice.mapper.UserMapper;
import org.example.userservice.mapper.WatchHistoryMapper;
import org.example.userservice.mapper.WatchlistMapper;
import org.example.userservice.model.User;
import org.example.userservice.model.WatchHistory;
import org.example.userservice.model.Watchlist;
import org.example.userservice.repository.UserRepository;
import org.example.userservice.repository.WatchHistoryRepository;
import org.example.userservice.repository.WatchlistRepository;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final WatchlistRepository watchlistRepository;
    private final WatchHistoryRepository watchHistoryRepository;

    // Mappers
    private final UserMapper userMapper;
    private final WatchlistMapper watchlistMapper;
    private final WatchHistoryMapper watchHistoryMapper;

    // Feign Client
    private final VideoServiceClient videoServiceClient;

    @Override
    public UserDTO createUser(UserDTO userDTO) {
        if (userRepository.findByUsername(userDTO.getUsername()).isPresent()) {
            throw new RuntimeException("Username already exists");
        }
        if (userRepository.findByEmail(userDTO.getEmail()).isPresent()) {
            throw new RuntimeException("Email already exists");
        }
        User user = userMapper.toEntity(userDTO);
        user.setPassword(userDTO.getPassword()); // Basic mapping for now
        return userMapper.toDTO(userRepository.save(user));
    }

    @Override
    public UserDTO getUserById(Long id) {
        return userRepository.findById(id).map(userMapper::toDTO)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    @Override
    public List<UserDTO> getAllUsers() {
        return userRepository.findAll().stream()
                .map(userMapper::toDTO).collect(Collectors.toList());
    }

    @Override
    public WatchlistDTO addVideoToWatchlist(Long userId, Long videoId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        // Check if video exists via FeignClient
        videoServiceClient.getVideoById(videoId);

        if (watchlistRepository.findByUserIdAndVideoId(userId, videoId).isPresent()) {
            throw new RuntimeException("Video already in watchlist");
        }
        Watchlist watchlist = Watchlist.builder()
                .user(user)
                .videoId(videoId)
                .build();
        WatchlistDTO dto = watchlistMapper.toDTO(watchlistRepository.save(watchlist));
        dto.setVideoDetails(videoServiceClient.getVideoById(videoId));
        return dto;
    }

    @Override
    public void removeVideoFromWatchlist(Long userId, Long videoId) {
        Watchlist watchlist = watchlistRepository.findByUserIdAndVideoId(userId, videoId)
                .orElseThrow(() -> new RuntimeException("Video not found in watchlist"));
        watchlistRepository.delete(watchlist);
    }

    @Override
    public List<WatchlistDTO> getUserWatchlist(Long userId) {
        return watchlistRepository.findByUserId(userId).stream()
                .map(w -> {
                    WatchlistDTO dto = watchlistMapper.toDTO(w);
                    try {
                        VideoDTO video = videoServiceClient.getVideoById(w.getVideoId());
                        dto.setVideoDetails(video);
                    } catch (Exception e) {
                        // Handle Feign client exception (e.g. video deleted) gracefully
                    }
                    return dto;
                }).collect(Collectors.toList());
    }

    @Override
    public WatchHistoryDTO recordWatchHistory(Long userId, Long videoId, Integer progressTime, Boolean completed) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        WatchHistory history = WatchHistory.builder()
                .user(user)
                .videoId(videoId)
                .progressTime(progressTime)
                .completed(completed)
                .build();

        WatchHistoryDTO dto = watchHistoryMapper.toDTO(watchHistoryRepository.save(history));
        try {
            dto.setVideoDetails(videoServiceClient.getVideoById(videoId));
        } catch (Exception e) {
        }

        return dto;
    }

    @Override
    public List<WatchHistoryDTO> getUserWatchHistory(Long userId) {
        return watchHistoryRepository.findByUserId(userId).stream()
                .map(h -> {
                    WatchHistoryDTO dto = watchHistoryMapper.toDTO(h);
                    try {
                        dto.setVideoDetails(videoServiceClient.getVideoById(h.getVideoId()));
                    } catch (Exception e) {
                    }
                    return dto;
                }).collect(Collectors.toList());
    }

    @Override
    public Map<String, Object> getUserViewingStatistics(Long userId) {
        List<WatchHistory> fullHistory = watchHistoryRepository.findByUserId(userId);
        long totalVideosWatched = fullHistory.stream().filter(h -> Boolean.TRUE.equals(h.getCompleted())).count();
        long totalWatchTimeSeconds = fullHistory.stream()
                .mapToLong(h -> h.getProgressTime() != null ? h.getProgressTime() : 0)
                .sum();

        Map<String, Object> stats = new HashMap<>();
        stats.put("totalCompletedVideos", totalVideosWatched);
        stats.put("totalWatchTimeMinutes", totalWatchTimeSeconds / 60);
        return stats;
    }
}
