package org.example.userservice.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "watch_histories")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class WatchHistory {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(nullable = false)
    private Long videoId; // Reference to Video Service ID

    private LocalDateTime watchedAt;

    private Integer progressTime; // elapsed time in seconds

    private Boolean completed;

    @PrePersist
    protected void onCreate() {
        watchedAt = LocalDateTime.now();
    }
}
