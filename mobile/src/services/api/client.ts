import axios from 'axios';
import { Platform } from 'react-native';

const apiClient = axios.create({
    baseURL:
        Platform.OS === 'web'
            ? process.env.EXPO_PUBLIC_WEB_API_URL
            : process.env.EXPO_PUBLIC_MOBILE_API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

export default apiClient;