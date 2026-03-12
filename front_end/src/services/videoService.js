import api from './api';

export const videoService = {
    getAllVideos: async () => {
        const response = await api.get('/videos');
        return response.data;
    },

    getVideoById: async (id) => {
        const response = await api.get(`/videos/${id}`);
        return response.data;
    },

    getVideosByType: async (type) => {
        const response = await api.get(`/videos/type/${type}`);
        return response.data;
    },

    getVideosByCategory: async (category) => {
        const response = await api.get(`/videos/category/${category}`);
        return response.data;
    },

    createVideo: async (videoData) => {
        const response = await api.post('/videos', videoData);
        return response.data;
    },

    updateVideo: async (id, videoData) => {
        const response = await api.put(`/videos/${id}`, videoData);
        return response.data;
    },

    deleteVideo: async (id) => {
        const response = await api.delete(`/videos/${id}`);
        return response.data;
    }
};
