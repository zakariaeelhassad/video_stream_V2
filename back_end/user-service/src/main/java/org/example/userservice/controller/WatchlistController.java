package org.example.userservice.controller;

import lombok.RequiredArgsConstructor;
import org.example.userservice.dto.WatchlistDTO;
import org.example.userservice.service.UserService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users/{userId}/watchlist")
@RequiredArgsConstructor
public class WatchlistController {

    private final UserService userService;

    @PostMapping("/{videoId}")
    public ResponseEntity<WatchlistDTO> addVideoToWatchlist(@PathVariable Long userId, @PathVariable Long videoId) {
        return new ResponseEntity<>(userService.addVideoToWatchlist(userId, videoId), HttpStatus.CREATED);
    }

    @DeleteMapping("/{videoId}")
    public ResponseEntity<Void> removeVideoFromWatchlist(@PathVariable Long userId, @PathVariable Long videoId) {
        userService.removeVideoFromWatchlist(userId, videoId);
        return ResponseEntity.noContent().build();
    }

    @GetMapping
    public ResponseEntity<List<WatchlistDTO>> getUserWatchlist(@PathVariable Long userId) {
        return ResponseEntity.ok(userService.getUserWatchlist(userId));
    }
}
