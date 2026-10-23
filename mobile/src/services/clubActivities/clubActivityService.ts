import apiClient from '../api/client';

export type ClubActivity = {
    id: string;

    title: string;
    description: string | null;
    image_url: string | null;

    cohort_id: string;
    cohort_name: string;

    created_by_user_id: string;
    author_name: string;
    author_role: string;

    activity_date: string | null;

    created_at: string;
    updated_at: string | null;
};

export async function getClubActivities(): Promise<
    ClubActivity[]
> {
    const response = await apiClient.get(
        "/club-activities",
    );

    return response.data;
}

export async function getClubActivityById(
    activityId: string,
): Promise<ClubActivity> {
    const response = await apiClient.get(
        `/club-activities/${activityId}/details`,
    );

    return response.data;
}

export type CreateClubActivityPayload = {
    title: string;
    description?: string;
    image_url?: string;
    cohort_id: string;
    activity_date?: string;
};

export async function createClubActivity(
    payload: CreateClubActivityPayload,
) {
    const response = await apiClient.post(
        "/club-activities",
        payload,
    );

    return response.data;
}

export type UpdateClubActivityPayload = {
    title?: string;
    description?: string;
    image_url?: string;
    activity_date?: string;
};

export async function updateClubActivity(
    activityId: string,
    payload: UpdateClubActivityPayload,
) {
    const response = await apiClient.patch(
        `/club-activities/${activityId}`,
        payload,
    );

    return response.data;
}

export async function deleteClubActivity(
    activityId: string,
) {
    const response = await apiClient.delete(
        `/club-activities/${activityId}`,
    );

    return response.data;
}