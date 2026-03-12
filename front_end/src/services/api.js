import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:8080/api',
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add a request interceptor to include auth tokens if needed in the future
api.interceptors.request.use(
    (config) => {
        // We can add token here from standard localStorage when auth is fully token-based
        const user = localStorage.getItem('currentUser');
        if (user) {
            try {
                const _parsed = JSON.parse(user);
                // If backend uses tokens: config.headers.Authorization = `Bearer ${_parsed.token}`;
            } catch (_e) {
                // Ignore parse error
            }
        }
        return config;
    },
    (error) => Promise.reject(error)
);

export default api;
