import apiClient from '../api/client';

export interface GamificationProgress {
  user_id: string;
  name: string | null;
  total_xp: number;
  current_level: number;
  xp_into_level: number;
  xp_needed_for_next_level: number;
  progress_percentage: number;
  next_level_xp: number | null;
}

export interface EarnedBadge {
  id: string;
  name: string;
  description: string | null;
  image_url: string | null;
  criteria_type: string | null;
  criteria_value: number | null;
  earned_at: string;
}

export type TaskProgressStatus =
  | 'not_started'
  | 'submitted'
  | 'approved'
  | 'rejected';

export interface AdventureTaskProgress {
  id: string;
  title: string;
  task_order: number;
  xp_reward: number;
  status: TaskProgressStatus;
}

export interface AdventureProgress {
  adventure_id: string;
  adventure_title: string;
  total_tasks: number;
  approved_tasks: number;
  remaining_tasks: number;
  progress_percentage: number;
  tasks: AdventureTaskProgress[];
}

export const getMyGamificationProgress =
  async (): Promise<GamificationProgress> => {
    const response = await apiClient.get(
      '/gamification/me',
      {
        timeout: 3000,
      },
    );

    return response.data;
  };

export const getMyBadges =
  async (): Promise<EarnedBadge[]> => {
    const response = await apiClient.get(
      '/gamification/me/badges',
      {
        timeout: 3000,
      },
    );

    return response.data;
  };

export const getAdventureProgress = async (
  adventureId: string,
): Promise<AdventureProgress> => {
  const response = await apiClient.get(
    `/gamification/adventures/${adventureId}/progress`,
    {
      timeout: 3000,
    },
  );

  return response.data;
};