import apiClient from '../api/client';

export type ReactionCounts = {
    clap: number;
    thumbs_up: number;
    star: number;
    smile: number;
    wow: number;
    okay: number;
};

export type FeedItemType =
    | "announcement"
    | "event"
    | "club_activity"
    | "activity_post";

export type FeedItem = {
    id: string;
    type: FeedItemType;

    title: string | null;
    content: string | null;

    cohort_id: string;
    cohort_name?: string | null;

    image_url?: string | null;

    author_name?: string | null;
    author_role?: string | null;
    author_avatar_url?: string | null;

    created_by_user_id?: string | null;

    created_at: string | null;

    // Announcement
    priority?: "normal" | "high";
    is_pinned?: boolean;

    // Event
    location?: string | null;
    start_time?: string | null;
    end_time?: string | null;

    // Club Activity
    activity_date?: string | null;

    // Reactions
    reaction_counts?: ReactionCounts;
    user_reaction?: keyof ReactionCounts | null;
    total_reactions?: number;
};

export async function getFeed(): Promise<FeedItem[]> {
    const response = await apiClient.get("/feed");

    return response.data;
}