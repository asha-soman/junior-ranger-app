import axios from 'axios';
import { Platform } from 'react-native';
import { getToken } from '@/src/utils/secureStore';

const apiClient = axios.create({
    baseURL:
        Platform.OS === 'web'
            ? process.env.EXPO_PUBLIC_WEB_API_URL
            : process.env.EXPO_PUBLIC_MOBILE_API_URL,
});

apiClient.interceptors.request.use(
    async (config) => {
        const token = await getToken();

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        /*
         * IMPORTANT:
         *
         * Normal API requests use JSON.
         * FormData requests must NOT be forced to application/json.
         *
         * Axios/browser/native networking will generate the correct
         * multipart/form-data header and boundary for FormData.
         */
        if (config.data instanceof FormData) {
            delete config.headers['Content-Type'];
        } else {
            config.headers['Content-Type'] = 'application/json';
        }

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default apiClient;