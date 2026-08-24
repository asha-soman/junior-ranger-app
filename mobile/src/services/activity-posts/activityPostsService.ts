import apiClient from '../api/client';

export type ActivityPost = {
    id: string;
    content: string;
    image_url: string | null;
    cohort_id: string;
    created_by_user_id: string;
    created_at: string;
    updated_at: string | null;
};

export type CreateActivityPostPayload = {
    content: string;
    cohort_id: string;
    image_url?: string;
};

export async function createActivityPost(
    payload: CreateActivityPostPayload,
): Promise<ActivityPost> {
    const response = await apiClient.post(
        "/activity-posts",
        payload,
    );

    return response.data.post ?? response.data;
}