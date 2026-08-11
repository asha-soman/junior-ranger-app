import apiClient from '../api/client';

export type EventStatus =
  | 'draft'
  | 'published'
  | 'cancelled'
  | 'completed';

export interface EventItem {
  id: string;
  title: string;
  description: string | null;
  location: string | null;

  start_time: string;
  end_time: string;
  registration_deadline: string | null;

  capacity: number | null;
  status: EventStatus;

  cohort_id: string;
  created_by_user_id: string;

  is_deleted: boolean;
  created_at: string | null;
  updated_at: string | null;
}

export interface CreateEventPayload {
  title: string;
  description?: string;
  location?: string;

  start_time: string;
  end_time: string;
  registration_deadline?: string;

  capacity?: number;
  cohort_id: string;
}

export interface UpdateEventPayload {
  title?: string;
  description?: string;
  location?: string;

  start_time?: string;
  end_time?: string;
  registration_deadline?: string;

  capacity?: number;
  cohort_id?: string;
}

export const createEvent = async (
  payload: CreateEventPayload,
): Promise<EventItem> => {
  const response = await apiClient.post('/events', payload);
  return response.data.event;
};

export const getEventById = async (
  eventId: string,
): Promise<EventItem> => {
  const response = await apiClient.get(`/events/${eventId}`);
  return response.data.event;
};

export const updateEvent = async (
  eventId: string,
  payload: UpdateEventPayload,
): Promise<EventItem> => {
  const response = await apiClient.patch(
    `/events/${eventId}`,
    payload,
  );

  return response.data.event;
};

export const publishEvent = async (
  eventId: string,
): Promise<EventItem> => {
  const response = await apiClient.patch(
    `/events/${eventId}/publish`,
  );

  return response.data.event;
};

export const cancelEvent = async (
  eventId: string,
): Promise<EventItem> => {
  const response = await apiClient.patch(
    `/events/${eventId}/cancel`,
  );

  return response.data.event;
};

export const deleteEvent = async (
  eventId: string,
): Promise<void> => {
  await apiClient.delete(`/events/${eventId}`);
};