import apiClient from '../api/client';

export type SubmissionStatus =
  | 'submitted'
  | 'approved'
  | 'rejected';

export interface AdventureSubmission {
  id: string;
  adventure_id: string;
  cohort_id: string;
  junior_ranger_user_id: string;
  submission_text: string;
  image_url?: string | null;
  status: SubmissionStatus;
  feedback?: string | null;
  reviewed_by_ranger_id?: string | null;
  submitted_at: string;
  reviewed_at?: string | null;
  created_at: string;
  updated_at?: string | null;
  junior_ranger_name?: string;
  junior_ranger_email?: string;
}

export interface CreateSubmissionPayload {
  submission_text: string;
  image_url?: string;
}

export interface ReviewSubmissionPayload {
  status: 'approved' | 'rejected';
  feedback?: string;
}

/*
 * ==========================================
 * TASK COMPLETIONS
 * ==========================================
 */

export interface TaskCompletion {
  id: string;
  task_id: string;
  junior_ranger_user_id: string;
  submission_text: string | null;
  image_url: string | null;
  status:
    | 'submitted'
    | 'approved'
    | 'rejected';
  feedback: string | null;
  reviewed_by_ranger_id: string | null;
  submitted_at: string;
  reviewed_at: string | null;
  xp_awarded: boolean;
  created_at?: string;
  updated_at?: string | null;
}

export interface AdventureTaskCompletion
  extends TaskCompletion {
  task_title: string;
  task_description: string | null;
  xp_reward: number;
  task_order: number;

  junior_ranger_name: string | null;
  junior_ranger_email: string;
}

export interface CreateTaskCompletionPayload {
  submission_text?: string;
  image_url?: string;
}

export interface ReviewTaskCompletionPayload {
  status: 'approved' | 'rejected';
  feedback?: string;
}

/*
 * ==========================================
 * OLD WHOLE-ADVENTURE SUBMISSIONS
 * ==========================================
 */

export const createSubmission = async (
  adventureId: string,
  payload: CreateSubmissionPayload,
): Promise<AdventureSubmission> => {
  const response = await apiClient.post(
    `/adventures/${adventureId}/submissions`,
    payload,
  );

  return response.data.submission;
};

export const getSubmissionsForAdventure =
  async (
    adventureId: string,
  ): Promise<AdventureSubmission[]> => {
    const response = await apiClient.get(
      `/adventures/${adventureId}/submissions`,
    );

    return response.data;
  };

export const reviewSubmission = async (
  submissionId: string,
  payload: ReviewSubmissionPayload,
): Promise<AdventureSubmission> => {
  const response = await apiClient.patch(
    `/submissions/${submissionId}/review`,
    payload,
  );

  return response.data.submission;
};

export const getMySubmission = async (
  adventureId: string,
): Promise<AdventureSubmission | null> => {
  const response = await apiClient.get(
    `/adventures/${adventureId}/my-submission`,
  );

  return response.data.submission;
};

export const updateMySubmission = async (
  submissionId: string,
  payload: CreateSubmissionPayload,
): Promise<AdventureSubmission> => {
  const response = await apiClient.patch(
    `/submissions/${submissionId}`,
    payload,
  );

  return response.data.submission;
};

/*
 * ==========================================
 * TASK COMPLETION REQUESTS
 * ==========================================
 */

export const createTaskCompletion = async (
  taskId: string,
  payload: CreateTaskCompletionPayload,
): Promise<TaskCompletion> => {
  const response = await apiClient.post(
    `/tasks/${taskId}/completions`,
    payload,
  );

  return response.data.completion;
};

export const getTaskCompletions = async (
  taskId: string,
): Promise<TaskCompletion[]> => {
  const response = await apiClient.get(
    `/tasks/${taskId}/completions`,
  );

  return response.data;
};

export const getTaskCompletionsForAdventure =
  async (
    adventureId: string,
  ): Promise<AdventureTaskCompletion[]> => {
    const response = await apiClient.get(
      `/adventures/${adventureId}/task-completions`,
    );

    return response.data;
  };

export const reviewTaskCompletion = async (
  completionId: string,
  payload: ReviewTaskCompletionPayload,
) => {
  const response = await apiClient.patch(
    `/task-completions/${completionId}/review`,
    payload,
  );

  return response.data;
};