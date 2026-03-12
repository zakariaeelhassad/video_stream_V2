package org.example.videoservice.repository;

import org.example.videoservice.model.Video;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface VideoRepository extends JpaRepository<Video, Long> {
    List<Video> findByType(org.example.videoservice.model.Type type);

    List<Video> findByCategory(org.example.videoservice.model.Category category);
}
