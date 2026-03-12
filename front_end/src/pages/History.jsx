import React, { useState, useEffect } from 'react';
import { videoService } from '../services/videoService';
import { useAuth } from '../hooks/useAuth';
import VideoCard from '../components/VideoCard';
import { Loader2 } from 'lucide-react';

const History = () => {
    const { user } = useAuth();
    const [videos, setVideos] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (user) {
            const fetchHistory = async () => {
                const historyIds = JSON.parse(localStorage.getItem(`history_${user.id}`)) || [];
                const allVideos = await videoService.getAllVideos();
                const historyVideos = historyIds.map(id => allVideos.find(v => v.id == id)).filter(Boolean);
                setVideos(historyVideos);
                setLoading(false);
            };
            fetchHistory();
        }
    }, [user]);

    if (loading) return <div className="flex justify-center p-8"><Loader2 className="animate-spin text-brand" /></div>;

    return (
        <div className="pb-8">
            <h1 className="text-3xl font-bold mb-6 text-text-primary">Watch History</h1>
            {videos.length > 0 ? (
                <div className="grid grid-cols-[repeat(auto-fill,minmax(220px,1fr))] gap-6">
                    {videos.map(video => (
                        <VideoCard key={video.id} video={video} />
                    ))}
                </div>
            ) : (
                <div className="text-center p-8 text-text-secondary">
                    <p>You haven't watched anything yet.</p>
                </div>
            )}
        </div>
    );
};

export default History;
