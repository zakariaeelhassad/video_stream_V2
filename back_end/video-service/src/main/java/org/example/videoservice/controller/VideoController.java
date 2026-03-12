package org.example.videoservice.controller;

import lombok.RequiredArgsConstructor;
import org.example.videoservice.dto.VideoDTO;
import org.example.videoservice.model.Category;
import org.example.videoservice.model.Type;
import org.example.videoservice.service.VideoService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/videos")
@RequiredArgsConstructor
public class VideoController {

    private final VideoService videoService;

    @PostMapping
    public ResponseEntity<VideoDTO> createVideo(@RequestBody VideoDTO videoDTO) {
        return new ResponseEntity<>(videoService.createVideo(videoDTO), HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<VideoDTO> updateVideo(@PathVariable Long id, @RequestBody VideoDTO videoDTO) {
        return ResponseEntity.ok(videoService.updateVideo(id, videoDTO));
    }

    @GetMapping("/{id}")
    public ResponseEntity<VideoDTO> getVideoById(@PathVariable Long id) {
        return ResponseEntity.ok(videoService.getVideoById(id));
    }

    @GetMapping
    public ResponseEntity<List<VideoDTO>> getAllVideos() {
        return ResponseEntity.ok(videoService.getAllVideos());
    }

    @GetMapping("/type/{type}")
    public ResponseEntity<List<VideoDTO>> getVideosByType(@PathVariable Type type) {
        return ResponseEntity.ok(videoService.getVideosByType(type));
    }

    @GetMapping("/category/{category}")
    public ResponseEntity<List<VideoDTO>> getVideosByCategory(@PathVariable Category category) {
        return ResponseEntity.ok(videoService.getVideosByCategory(category));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteVideo(@PathVariable Long id) {
        videoService.deleteVideo(id);
        return ResponseEntity.noContent().build();
    }
}
