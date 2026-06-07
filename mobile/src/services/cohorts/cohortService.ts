import apiClient from "../api/client";

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
  role: "admin" | "ranger" | "junior_ranger";
  cohort_role: "ranger" | "junior_ranger";
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

export interface InviteCode {
  id: string;
  cohort_id: string;
  code: string;
  expiry_date: string;
  max_usage: number;
  used_count: number;
  active: boolean;
  created_at: string;
  created_by: string;
}

export interface GenerateInviteCodePayload {
  max_usage?: number;
  expiry_date?: string;
}

export interface ValidateInviteCodeResponse {
  message: string;
  cohort: {
    id: string;
    name: string;
    description: string | null;
  };
}

export const getCohorts = async (): Promise<Cohort[]> => {
  const response = await apiClient.get("/cohorts");
  return response.data.cohorts;
};

export const getCohortById = async (id: string): Promise<Cohort> => {
  const response = await apiClient.get(`/cohorts/${id}`);
  return response.data.cohort;
};

export const createCohort = async (
  payload: CreateCohortPayload,
): Promise<Cohort> => {
  const response = await apiClient.post("/cohorts", payload);
  return response.data.cohort;
};

export const updateCohort = async (
  id: string,
  payload: UpdateCohortPayload,
): Promise<Cohort> => {
  const response = await apiClient.patch(`/cohorts/${id}`, payload);
  return response.data.cohort;
};

export const getCohortMembers = async (id: string): Promise<CohortMember[]> => {
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

export const removeRangerFromCohort = async (
  id: string,
  rangerId: string,
): Promise<void> => {
  await apiClient.patch(`/cohorts/${id}/remove-ranger`, {
    rangerId,
  });
};

export const generateInviteCode = async (
  cohortId: string,
  payload: GenerateInviteCodePayload,
): Promise<InviteCode> => {
  const response = await apiClient.post(
    `/cohorts/${cohortId}/invite-codes`,
    payload,
  );
  return response.data.inviteCode;
};

export const validateInviteCode = async (
  code: string,
): Promise<ValidateInviteCodeResponse> => {
  const response = await apiClient.post("/invite-codes/validate", { code });
  return response.data;
};

export const joinCohort = async (
  code: string,
): Promise<{ message: string; cohort: any }> => {
  const response = await apiClient.post("/cohorts/join", { code });
  return response.data;
};
