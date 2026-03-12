import api from './api';

export const userService = {
    getUserById: async (id) => {
        const response = await api.get(`/users/${id}`);
        return response.data;
    },

    getAllUsers: async () => {
        const response = await api.get('/users');
        return response.data;
    },

    getUserStatistics: async (id) => {
        const response = await api.get(`/users/${id}/statistics`);
        return response.data;
    }
};
