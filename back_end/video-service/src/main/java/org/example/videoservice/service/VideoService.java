package org.example.videoservice.service;

import org.example.videoservice.dto.VideoDTO;
import org.example.videoservice.model.Category;
import org.example.videoservice.model.Type;

import java.util.List;

public interface VideoService {
    VideoDTO createVideo(VideoDTO videoDTO);

    VideoDTO updateVideo(Long id, VideoDTO videoDTO);

    VideoDTO getVideoById(Long id);

    List<VideoDTO> getAllVideos();

    List<VideoDTO> getVideosByType(Type type);

    List<VideoDTO> getVideosByCategory(Category category);

    void deleteVideo(Long id);
}
