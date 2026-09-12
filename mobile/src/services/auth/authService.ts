import apiClient from '../api/client';

export interface RangerSignupPayload {
  email: string;
  name: string;
  password: string;
  role: 'ranger' | 'junior_ranger';
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

export interface LoginPayload {
  email: string;
  password: string;
}

export interface LoginResponse {
  message: string;
  access_token?: string;
  requires2FA?: boolean;
  email?: string;

  user?: {
    id: string;
    email: string;
    name: string | null;
    role: "admin" | "ranger" | "junior_ranger";
    avatar_url?: string | null;
    is_active: boolean;
    approval_status: string;
    created_at?: string;
    updated_at?: string;
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

export const verifyTwoFactorCode = async (data: {
  email: string;
  code: string;
}) => {
  try {
    const response = await apiClient.post(
      "/auth/verify-2fa",
      data,
    );

    return response.data;
  } catch (error: any) {
    const message =
      error?.response?.data?.message ||
      "Two-factor authentication failed";

    throw new Error(message);
  }
};

export interface CurrentUserProfile {
  userId: string;
  email: string;
  role: "admin" | "ranger" | "junior_ranger";
  two_factor_enabled: boolean;
}

export const getCurrentUserProfile =
  async (): Promise<CurrentUserProfile> => {
    const response =
      await apiClient.get("/auth/profile");

    return response.data;
  };