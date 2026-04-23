import apiClient from '../api/client'

export interface RangerSignupPayload {
    firstName: string;
    surname: string;
    email: string;
    phoneNumber: string;
    password: string;
}

export interface SignupResponse {
    message?: string;
    data?: any;
}

export const signupRanger = async (
    payload: RangerSignupPayload
): Promise<SignupResponse> => {
    const response = await apiClient.post('/auth/signup', payload);
    return response.data;
};