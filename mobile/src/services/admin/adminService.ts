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

export interface AdminUsersPagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface PaginatedAdminUsers {
  data: AdminUser[];
  pagination: AdminUsersPagination;
}

export const getAdminUsersPaginated = async (
  role = "all",
  status = "all",
  name = "",
  page = 1,
  limit = 20,
): Promise<PaginatedAdminUsers> => {
  const response = await apiClient.get("/admin/users", {
    params: {
      role: role !== "all" ? role : undefined,
      status: status !== "all" ? status : undefined,
      name: name.trim() ? name.trim() : undefined,
      page,
      limit,
    },
  });

  return response.data;
};

export const getAdminUsers = async (
  role?: string,
  status?: string,
  name?: string,
): Promise<AdminUser[]> => {
  const response = await getAdminUsersPaginated(
    role ?? "all",
    status ?? "all",
    name ?? "",
    1,
    100,
  );

  return response.data;
};

export interface AdminCohort {
  id: string;
  name: string;
  description: string | null;
  location: string | null;
  created_at: string | null;
  assigned_ranger_id: string | null;
  assigned_ranger_name: string | null;
  assigned_ranger_email: string | null;
  member_count: number;
}

export interface AdminCohortMember {
  id: string;
  user_id: string;
  role: string;
  user_name: string | null;
  user_email: string | null;
}

export interface AdminCohortDetails extends AdminCohort {
  members: AdminCohortMember[];
}

export const getAdminCohorts = async (name?: string): Promise<AdminCohort[]> => {
  const response = await apiClient.get('/admin/cohorts', {
    params: { name: name?.trim() ? name.trim() : undefined },
  });
  return response.data;
};

export const getAdminCohortById = async (
  id: string
): Promise<AdminCohortDetails> => {
  const response = await apiClient.get(`/admin/cohorts/${id}`);
  return response.data;
};



