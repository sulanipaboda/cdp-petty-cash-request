import axios from 'axios';

const baseURL = import.meta.env.VITE_API_BASE_URL || '/api/v1';

const api = axios.create({
    baseURL,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    },
});

// Request interceptor for adding the auth token
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('access_token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor for handling common errors
api.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        if (error.response && error.response.status === 401) {
            // Clear local storage and potentially redirect to login
            // Using a simple event dispatch or direct standard reload could work
            // but for Redux, we usually handle this in the thunk or via a global event.
            // For now, just clear token.
            localStorage.removeItem('access_token');
            localStorage.removeItem('currentUser');
            // We can add logic to redirect to /login here if needed, e.g., window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export default api;
