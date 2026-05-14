import apiClient from '../api/client';

export interface Cohort {
  id: string;
  name: string;
  description: string | null;
  location: string | null;
  created_by_ranger_id: string | null;
  assigned_ranger_id: string | null;
  created_at: string | null;
  updated_at: string | null;
  member_count?: number;
  assigned_ranger_name?: string | null;
  assigned_ranger_email?: string | null;
}

export interface CohortMember {
  id: string;
  name: string | null;
  email: string;
  role: 'admin' | 'ranger' | 'junior_ranger';
  cohort_role: 'ranger' | 'junior_ranger';
  joined_at: string | null;
}

export interface CreateCohortPayload {
  name: string;
  description?: string;
  location: string;
}

export interface UpdateCohortPayload {
  name?: string;
  description?: string;
  location?: string;
}

export const getCohorts = async (): Promise<Cohort[]> => {
  const response = await apiClient.get('/cohorts');
  return response.data.cohorts;
};

export const getCohortById = async (id: string): Promise<Cohort> => {
  const response = await apiClient.get(`/cohorts/${id}`);
  return response.data.cohort;
};

export const createCohort = async (
  payload: CreateCohortPayload,
): Promise<Cohort> => {
  const response = await apiClient.post('/cohorts', payload);
  return response.data.cohort;
};

export const updateCohort = async (
  id: string,
  payload: UpdateCohortPayload,
): Promise<Cohort> => {
  const response = await apiClient.patch(`/cohorts/${id}`, payload);
  return response.data.cohort;
};

export const getCohortMembers = async (
  id: string,
): Promise<CohortMember[]> => {
  const response = await apiClient.get(`/cohorts/${id}/members`);
  return response.data.members;
};

export const assignRangerToCohort = async (
  id: string,
  rangerId: string,
): Promise<Cohort> => {
  const response = await apiClient.patch(`/cohorts/${id}/assign-ranger`, {
    rangerId,
  });

  return response.data.cohort;
};