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
  cohort_name?: string;
  created_by_user_id: string;

  is_deleted: boolean;
  created_at: string | null;
  updated_at: string | null;
}

export interface EventDetails {
  id: string;
  title: string;
  description: string | null;
  location: string | null;

  start_time: string;
  end_time: string;
  registration_deadline: string | null;

  capacity: number | null;
  status: EventStatus;

  cohort: {
    id: string;
    name: string;
  };

  organiser: {
    id: string;
    name: string | null;
    email: string;
    role: 'admin' | 'ranger';
  };

  registration: {
    registered_count: number;
    spots_available: number | null;
    registration_open: boolean;
    user_status:
      | 'registered'
      | 'cancelled'
      | null;
  };

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

export const getEvents = async (): Promise<EventItem[]> => {
  const response = await apiClient.get('/events');
  return response.data;
};

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

export const getEventDetails = async (
  eventId: string,
): Promise<EventDetails> => {
  const response = await apiClient.get(
    `/events/${eventId}/details`,
  );

  return response.data;
};

export const registerForEvent = async (
  eventId: string,
) => {
  const response =
    await apiClient.post(
      `/events/${eventId}/register`,
    );

  return response.data;
};

export const cancelEventRegistration = async (
  eventId: string,
) => {
  const response =
    await apiClient.patch(
      `/events/${eventId}/registration/cancel`,
    );

  return response.data;
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