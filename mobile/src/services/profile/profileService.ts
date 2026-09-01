import apiClient from '../api/client';

export type UserRole =
  | 'admin'
  | 'ranger'
  | 'junior_ranger';

export interface UserProfile {
  id: string;
  name: string | null;
  email: string;
  role: UserRole;
  avatar_url: string | null;

  cohort: {
    id: string;
    name: string;
    location: string | null;
  } | null;
}

export const getMyProfile = async (): Promise<UserProfile> => {
  const response = await apiClient.get('/users/me', {
    timeout: 3000,
  });

  return response.data;
};

export const updateMyProfile = async (
  name: string,
): Promise<UserProfile> => {
  const response = await apiClient.patch(
    '/users/me',
    { name },
    {
      timeout: 3000,
    },
  );

  return response.data;
};