import api from './api';

const CURRENT_USER_KEY = 'currentUser';

export const authService = {
    register: async (userData) => {
        const response = await api.post('/users', {
            username: userData.username,
            email: userData.email,
            password: userData.password
        });

        const newUser = response.data;
        localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(newUser));
        return newUser;
    },

    /**
     * Login by fetching all users and matching credentials.
     * NOTE: This is a client-side simulation because the backend has no dedicated
     * POST /api/auth/login endpoint. When a real /auth/login endpoint is ready,
     * replace this with: await api.post('/auth/login', { email, password })
     */
    login: async (email, password) => {
        let users = [];
        try {
            const response = await api.get('/users');
            users = response.data;
        } catch (err) {
            throw new Error('Could not connect to the server. Please try again.');
        }

        const user = users.find(
            (u) => u.email === email && u.password === password
        );

        if (!user) {
            throw new Error('Invalid email or password.');
        }

        localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
        return user;
    },

    logout: () => {
        localStorage.removeItem(CURRENT_USER_KEY);
    },

    getCurrentUser: () => {
        const userStr = localStorage.getItem(CURRENT_USER_KEY);
        if (userStr) {
            try {
                return JSON.parse(userStr);
            } catch (_e) {
                return null;
            }
        }
        return null;
    },

    updateProfile: async (userId, updates) => {
        const currentUser = authService.getCurrentUser();
        if (currentUser && currentUser.id === userId) {
            const updatedUser = { ...currentUser, ...updates };
            localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(updatedUser));
            return updatedUser;
        }
        throw new Error('Profile update failed');
    }
};
