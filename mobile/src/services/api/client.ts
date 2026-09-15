import axios from 'axios';
import { Platform } from 'react-native';
import { getToken } from '@/src/utils/secureStore';

const apiClient = axios.create({
    baseURL:
        Platform.OS === 'web'
            ? process.env.EXPO_PUBLIC_WEB_API_URL
            : process.env.EXPO_PUBLIC_MOBILE_API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

apiClient.interceptors.request.use(
    async (config) => {
        const token = await getToken();

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default apiClient;