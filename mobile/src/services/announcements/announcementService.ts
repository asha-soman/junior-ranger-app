import apiClient from '../api/client';

export type AnnouncementStatus =
    | "draft"
    | "published"
    | "archived";

export type AnnouncementPriority =
    | "normal"
    | "high";

export type Announcement = {
    id: string;
    title: string;
    content: string;

    cohort_id: string;
    cohort_name: string;

    created_by_user_id: string;
    author_name: string;
    author_role: string;

    status: AnnouncementStatus;
    priority: AnnouncementPriority;
    is_pinned: boolean;

    published_at: string | null;
    created_at: string;
    updated_at: string | null;
};

export async function getAnnouncements(): Promise<Announcement[]> {
    const response = await apiClient.get("/announcements");

    return response.data;
}

export async function getAnnouncementById(
    announcementId: string,
): Promise<Announcement> {
    const response = await apiClient.get(
        `/announcements/${announcementId}/details`,
    );

    return response.data;
}

export type CreateAnnouncementPayload = {
    title: string;
    content: string;
    cohort_id: string;
    status?: "draft" | "published";
    priority?: "normal" | "high";
    is_pinned?: boolean;
};

export async function createAnnouncement(
    payload: CreateAnnouncementPayload,
) {
    const response = await apiClient.post(
        "/announcements",
        payload,
    );

    return response.data;
}

export type UpdateAnnouncementPayload = {
    title?: string;
    content?: string;
    cohort_id?: string;
    status?: "draft" | "published" | "archived";
    priority?: "normal" | "high";
    is_pinned?: boolean;
};

export async function updateAnnouncement(
    announcementId: string,
    payload: UpdateAnnouncementPayload,
) {
    const response = await apiClient.patch(
        `/announcements/${announcementId}`,
        payload,
    );

    return response.data;
}

export async function publishAnnouncement(
    announcementId: string,
) {
    const response = await apiClient.patch(
        `/announcements/${announcementId}/publish`,
    );

    return response.data;
}

export async function archiveAnnouncement(
    announcementId: string,
) {
    const response = await apiClient.patch(
        `/announcements/${announcementId}/archive`,
    );

    return response.data;
}

export async function deleteAnnouncement(
    announcementId: string,
) {
    const response = await apiClient.delete(
        `/announcements/${announcementId}`,
    );

    return response.data;
}