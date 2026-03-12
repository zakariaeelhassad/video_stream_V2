package org.example.videoservice.service;

import lombok.RequiredArgsConstructor;
import org.example.videoservice.dto.VideoDTO;
import org.example.videoservice.mapper.VideoMapper;
import org.example.videoservice.model.Category;
import org.example.videoservice.model.Type;
import org.example.videoservice.model.Video;
import org.example.videoservice.repository.VideoRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class VideoServiceImpl implements VideoService {

    private final VideoRepository videoRepository;
    private final VideoMapper videoMapper;

    @Override
    public VideoDTO createVideo(VideoDTO videoDTO) {
        Video video = videoMapper.toEntity(videoDTO);
        video.setId(null); // Ensure JPA always generates a fresh ID
        video = videoRepository.save(video);
        return videoMapper.toDTO(video);
    }

    @Override
    public VideoDTO updateVideo(Long id, VideoDTO videoDTO) {
        Video existingVideo = videoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Video not found with id " + id));

        existingVideo.setTitle(videoDTO.getTitle());
        existingVideo.setDescription(videoDTO.getDescription());
        existingVideo.setThumbnailUrl(videoDTO.getThumbnailUrl());
        existingVideo.setTrailerUrl(videoDTO.getTrailerUrl());
        existingVideo.setDuration(videoDTO.getDuration());
        existingVideo.setReleaseYear(videoDTO.getReleaseYear());
        existingVideo.setType(videoDTO.getType());
        existingVideo.setCategory(videoDTO.getCategory());
        existingVideo.setRating(videoDTO.getRating());
        existingVideo.setDirector(videoDTO.getDirector());
        existingVideo.setCastMembers(videoDTO.getCastMembers());

        return videoMapper.toDTO(videoRepository.save(existingVideo));
    }

    @Override
    public VideoDTO getVideoById(Long id) {
        return videoRepository.findById(id)
                .map(videoMapper::toDTO)
                .orElseThrow(() -> new RuntimeException("Video not found with id " + id));
    }

    @Override
    public List<VideoDTO> getAllVideos() {
        return videoRepository.findAll().stream()
                .map(videoMapper::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<VideoDTO> getVideosByType(Type type) {
        return videoRepository.findByType(type).stream()
                .map(videoMapper::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<VideoDTO> getVideosByCategory(Category category) {
        return videoRepository.findByCategory(category).stream()
                .map(videoMapper::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    public void deleteVideo(Long id) {
        if (!videoRepository.existsById(id)) {
            throw new RuntimeException("Video not found with id " + id);
        }
        videoRepository.deleteById(id);
    }
}
