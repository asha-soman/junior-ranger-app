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

export interface LoginPayload {
  email: string;
  password: string;
}

export interface LoginResponse {
  access_token: string;
  user?: {
    id: string;
    email: string;
    role?: string;
  };
}

export const loginUser = async (
  payload: LoginPayload
): Promise<LoginResponse> => {
  const response = await apiClient.post("/auth/login", payload);
  return response.data;
};

export interface ForgotPasswordPayload {
  email: string;
}

export interface ForgotPasswordResponse {
  message: string;
}

export const forgotPassword = async (
  payload: ForgotPasswordPayload
): Promise<ForgotPasswordResponse> => {
  const response = await apiClient.post("/auth/forgot-password", payload);
  return response.data;
};

export interface VerifyCodePayload {
  email: string;
  code: string;
}

export interface VerifyCodeResponse {
  access_token: string;
  message?: string;
}

export const verifyCode = async (
  payload: VerifyCodePayload
): Promise<VerifyCodeResponse> => {
  const response = await apiClient.post("/auth/verify-code", payload);
  return response.data;
};

export interface ResendCodePayload {
  email: string;
}

export interface ResendCodeResponse {
  message: string;
}

export const resendCode = async (
  payload: ResendCodePayload
): Promise<ResendCodeResponse> => {
  const response = await apiClient.post("/auth/resend-code", payload);
  return response.data;
};