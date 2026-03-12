package org.example.userservice.controller;

import lombok.RequiredArgsConstructor;
import org.example.userservice.dto.WatchHistoryDTO;
import org.example.userservice.service.UserService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users/{userId}/history")
@RequiredArgsConstructor
public class WatchHistoryController {

    private final UserService userService;

    @PostMapping("/{videoId}")
    public ResponseEntity<WatchHistoryDTO> recordWatchHistory(
            @PathVariable Long userId,
            @PathVariable Long videoId,
            @RequestParam Integer progressTime,
            @RequestParam Boolean completed) {
        return new ResponseEntity<>(userService.recordWatchHistory(userId, videoId, progressTime, completed),
                HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<WatchHistoryDTO>> getUserWatchHistory(@PathVariable Long userId) {
        return ResponseEntity.ok(userService.getUserWatchHistory(userId));
    }
}
