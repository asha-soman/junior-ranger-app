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