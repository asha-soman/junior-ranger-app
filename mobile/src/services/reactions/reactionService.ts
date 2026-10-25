import apiClient from '../api/client';

export type ReactionTargetType =
    | "announcement"
    | "event"
    | "club_activity"
    | "activity_post";

export type ReactionType =
    | "clap"
    | "thumbs_up"
    | "star"
    | "smile"
    | "wow"
    | "okay";

export type ReactionRecord = {
    id: string;
    user_id: string;
    target_type: ReactionTargetType;
    target_id: string;
    reaction_type: ReactionType;
    created_at: string;
    updated_at: string | null;
};

export type SetReactionResponse = {
    message: string;
    reaction: ReactionRecord;
};

export async function setReaction(
    targetType: ReactionTargetType,
    targetId: string,
    reactionType: ReactionType,
): Promise<SetReactionResponse> {
    const response = await apiClient.post(
        "/reactions",
        {
            target_type: targetType,
            target_id: targetId,
            reaction_type: reactionType,
        },
    );

    return response.data;
}

export async function removeReaction(
    targetType: ReactionTargetType,
    targetId: string,
) {
    const response = await apiClient.delete(
        "/reactions",
        {
            data: {
                target_type: targetType,
                target_id: targetId,
            },
        },
    );

    return response.data;
}