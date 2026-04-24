import apiClient from '../api/client';

export interface RangerSignupPayload {
    email: string;
    name: string;
    password: string;
    role: 'ranger';
}

export interface SignupResponse {
    message?: string;
    user?: {
        id: string;
        email: string;
        name: string;
        role: 'ranger' | 'junior_ranger';
        avatar_url?: string | null;
        is_active?: boolean;
        approval_status?: string;
        created_at?: string;
        updated_at?: string;
    };
}

export const signupRanger = async (
    payload: RangerSignupPayload
): Promise<SignupResponse> => {
    const response = await apiClient.post('/auth/signup', payload);
    return response.data;
};