const BASE_URL = "http://localhost:3000/auth";

export type LoginResponse = {
  access_token: string;
  user?: {
    id: string;
    email: string;
    role?: string;
  };
};

export type ForgotPasswordResponse = {
  message: string;
};

export const loginUser = async (
  email: string,
  password: string
): Promise<LoginResponse> => {
  const response = await fetch(`${BASE_URL}/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      Array.isArray(data.message) ? data.message[0] : data.message || "Login failed"
    );
  }

  return data;
};

export const forgotPassword = async (
  email: string
): Promise<ForgotPasswordResponse> => {
  const response = await fetch(`${BASE_URL}/forgotPassword`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      Array.isArray(data.message)
        ? data.message[0]
        : data.message || "Password recovery failed"
    );
  }

  return data;
};