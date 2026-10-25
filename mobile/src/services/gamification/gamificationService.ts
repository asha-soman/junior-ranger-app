import apiClient from '../api/client';

export type TaskProgressStatus =
  | 'not_started'
  | 'submitted'
  | 'approved'
  | 'rejected';

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

export interface GamificationNotification {
  id: string;
  user_id: string;
  type: string;
  title: string;
  message: string;
  is_read: boolean;
  created_at: string;
}

export interface AdventureProgressTask {
  id: string;
  title: string;
  task_order: number;
  xp_reward: number;

  status: TaskProgressStatus;

  /*
   * These values are null when the task
   * has never been submitted.
   *
   * They are especially useful when a
   * Ranger rejects a task because the
   * Junior Ranger needs to see:
   *
   * - their previous answer
   * - the Ranger's feedback
   */
  submission_text: string | null;
  image_url: string | null;
  feedback: string | null;
}

export interface AdventureProgress {
  adventure_id: string;
  adventure_title: string;

  total_tasks: number;
  approved_tasks: number;
  remaining_tasks: number;

  progress_percentage: number;

  tasks: AdventureProgressTask[];
}

/*
 * ==========================================
 * JUNIOR RANGER LEVEL PROGRESS
 * ==========================================
 */

export async function getMyGamificationProgress(): Promise<GamificationProgress> {
  const response =
    await apiClient.get<GamificationProgress>(
      '/gamification/me',
    );

  return response.data;
}

/*
 * ==========================================
 * JUNIOR RANGER BADGES
 * ==========================================
 */

export async function getMyBadges(): Promise<
  EarnedBadge[]
> {
  const response =
    await apiClient.get<EarnedBadge[]>(
      '/gamification/me/badges',
    );

  return response.data;
}

/*
 * ==========================================
 * JUNIOR RANGER NOTIFICATIONS
 * ==========================================
 */

export async function getMyNotifications(): Promise<
  GamificationNotification[]
> {
  const response =
    await apiClient.get<GamificationNotification[]>(
      '/gamification/me/notifications',
    );

  return response.data;
}

/*
 * ==========================================
 * ADVENTURE TASK PROGRESS
 * ==========================================
 */

export async function getAdventureProgress(
  adventureId: string,
): Promise<AdventureProgress> {
  const response =
    await apiClient.get<AdventureProgress>(
      `/gamification/adventures/${adventureId}/progress`,
    );

  return response.data;
}