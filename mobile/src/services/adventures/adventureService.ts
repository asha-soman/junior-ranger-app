import apiClient from '../api/client';

export type AdventureStatus =
  | 'draft'
  | 'published'
  | 'archived';

export interface Adventure {
  id: string;
  title: string;
  description: string;
  task_instructions: string;
  cohort_id: string;
  due_date: string;
  status: AdventureStatus;
  created_by_user_id: string;
  is_deleted: boolean;
  created_at: string;
  updated_at: string | null;
}

export interface CreateAdventurePayload {
  title: string;
  description: string;
  task_instructions: string;
  due_date: string;
}

export interface UpdateAdventurePayload {
  title?: string;
  description?: string;
  task_instructions?: string;
  due_date?: string;
  status?: AdventureStatus;
}

export interface AssignAdventurePayload {
  adventureId: string;
  cohortIds: string[];
}

export interface AdventureTask {
  id: string;
  adventure_id: string;
  title: string;
  description: string | null;
  xp_reward: number;
  task_order: number;
  is_deleted: boolean;
  created_at: string;
  updated_at: string | null;
}

export interface CreateAdventureTaskPayload {
  title: string;
  description?: string;
  xp_reward?: number;
  task_order?: number;
}

export interface UpdateAdventureTaskPayload {
  title?: string;
  description?: string;
  xp_reward?: number;
  task_order?: number;
}

export const getAllAdventures =
  async (): Promise<Adventure[]> => {
    const response =
      await apiClient.get('/adventures');

    return response.data;
  };

export const getAdventuresByCohort =
  async (
    cohortId: string,
  ): Promise<Adventure[]> => {
    const response =
      await apiClient.get(
        `/cohorts/${cohortId}/adventures`,
      );

    return response.data;
  };

export const createAdventure =
  async (
    cohortId: string,
    payload: CreateAdventurePayload,
  ): Promise<Adventure> => {
    const response =
      await apiClient.post(
        `/cohorts/${cohortId}/adventures`,
        payload,
      );

    return response.data.adventure;
  };

export const getAdventureById =
  async (
    adventureId: string,
  ): Promise<Adventure> => {
    const response =
      await apiClient.get(
        `/adventures/${adventureId}`,
      );

    return response.data;
  };

export const updateAdventure =
  async (
    adventureId: string,
    payload: UpdateAdventurePayload,
  ): Promise<Adventure> => {
    const response =
      await apiClient.patch(
        `/adventures/${adventureId}`,
        payload,
      );

    return response.data.adventure;
  };

export const assignAdventureToCohorts =
  async (
    payload: AssignAdventurePayload,
  ) => {
    const response =
      await apiClient.post(
        '/adventures/assign',
        payload,
      );

    return response.data;
  };

export const createAdventureTask =
  async (
    adventureId: string,
    payload: CreateAdventureTaskPayload,
  ): Promise<AdventureTask> => {
    const response =
      await apiClient.post(
        `/adventures/${adventureId}/tasks`,
        payload,
      );

    return response.data.task;
  };

export const getAdventureTasks =
  async (
    adventureId: string,
  ): Promise<AdventureTask[]> => {
    const response =
      await apiClient.get(
        `/adventures/${adventureId}/tasks`,
      );

    return response.data;
  };

export const updateAdventureTask =
  async (
    taskId: string,
    payload: UpdateAdventureTaskPayload,
  ): Promise<AdventureTask> => {
    const response =
      await apiClient.patch(
        `/adventure-tasks/${taskId}`,
        payload,
      );

    return response.data.task;
  };

export const deleteAdventureTask =
  async (
    taskId: string,
  ): Promise<void> => {
    await apiClient.delete(
      `/adventure-tasks/${taskId}`,
    );
  };