import apiClient from '../api/client';

export interface PendingRanger {
  id: string;
  name: string | null;
  email: string;
  role: 'ranger';
  is_active: boolean;
  approval_status: 'pending' | 'approved' | 'rejected';
  created_at: string | null;
}

export const getPendingRangers = async (name?: string): Promise<PendingRanger[]> => {
  const response = await apiClient.get('/admin/rangers/pending', {
    params: name?.trim() ? { name: name.trim() } : {},
  });
  return response.data;
};

export const getRangerRequestById = async (id: string): Promise<PendingRanger> => {
  const response = await apiClient.get(`/admin/rangers/${id}`);
  return response.data;
};

export const approveRanger = async (id: string): Promise<PendingRanger> => {
  const response = await apiClient.patch(`/admin/rangers/${id}/approve`);
  return response.data;
};

export const rejectRanger = async (id: string): Promise<PendingRanger> => {
  const response = await apiClient.patch(`/admin/rangers/${id}/reject`);
  return response.data;
};

export interface AdminUser {
  id: string;
  name: string | null;
  email: string;
  role: 'admin' | 'ranger' | 'junior_ranger';
  is_active: boolean;
  approval_status: 'pending' | 'approved' | 'rejected';
  created_at: string | null;
  cohort_name: string | null;
}

export const getAdminUsers = async (
  role?: string,
  status?: string
): Promise<AdminUser[]> => {
  const response = await apiClient.get('/admin/users', {
    params: {
      role: role && role !== 'all' ? role : undefined,
      status: status && status !== 'all' ? status : undefined,
    },
  });

  return response.data;
};

