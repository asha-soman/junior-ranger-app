import apiClient from '../api/client';

export type NotificationType =
  | 'level_up'
  | 'badge_unlocked'
  | 'event_registration'
  | 'event_registration_cancelled'
  | 'event_update'
  | 'event_cancelled'
  | 'event_reminder';

export interface AppNotification {
  id: string;
  user_id: string;
  event_id: string | null;
  type: NotificationType;
  title: string;
  message: string;
  is_read: boolean;
  created_at: string;
}

export interface NotificationPreferences {
  event_updates_enabled: boolean;
  event_reminders_enabled: boolean;
}

export interface UnreadCountResponse {
  count: number;
}

// GET /notifications/me
export async function getMyNotifications(): Promise<
  AppNotification[]
> {
  const response = await apiClient.get<AppNotification[]>(
    '/notifications/me',
  );

  return response.data;
}

// GET /notifications/unread-count
export async function getUnreadCount(): Promise<number> {
  const response =
    await apiClient.get<UnreadCountResponse>(
      '/notifications/unread-count',
    );

  return response.data.count;
}

// PATCH /notifications/:id/read
export async function markNotificationAsRead(
  notificationId: string,
): Promise<AppNotification> {
  const response =
    await apiClient.patch<AppNotification>(
      `/notifications/${notificationId}/read`,
    );

  return response.data;
}

// PATCH /notifications/read-all
export async function markAllNotificationsAsRead(): Promise<void> {
  await apiClient.patch(
    '/notifications/read-all',
  );
}

// GET /notifications/preferences
export async function getNotificationPreferences(): Promise<
  NotificationPreferences
> {
  const response =
    await apiClient.get<NotificationPreferences>(
      '/notifications/preferences',
    );

  return response.data;
}

// PATCH /notifications/preferences
export async function updateNotificationPreferences(
  preferences: Partial<NotificationPreferences>,
): Promise<NotificationPreferences> {
  const response =
    await apiClient.patch<NotificationPreferences>(
      '/notifications/preferences',
      preferences,
    );

  return response.data;
}