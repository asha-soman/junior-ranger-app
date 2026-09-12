import React, {
    useEffect,
    useState,
} from "react";

import {
    ActivityIndicator,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

import {
    FeedItem,
} from "../../services/feed/feedService";

import {
    ReactionType,
    removeReaction,
    setReaction,
} from "../../services/reactions/reactionService";

type Props = {
    item: FeedItem;

    onReactionChanged?: (
        itemId: string,
        reactionCounts: Record<
            ReactionType,
            number
        >,
        userReaction: ReactionType | null,
        total: number,
    ) => void;
};

type ReactionItem = {
    key: ReactionType;
    emoji: string;
};

const reactions: ReactionItem[] = [
    {
        key: "clap",
        emoji: "👏",
    },
    {
        key: "thumbs_up",
        emoji: "👍",
    },
    {
        key: "star",
        emoji: "⭐",
    },
    {
        key: "smile",
        emoji: "😄",
    },
    {
        key: "wow",
        emoji: "😮",
    },
    {
        key: "okay",
        emoji: "✅",
    },
];

const emptyCounts: Record<
    ReactionType,
    number
> = {
    clap: 0,
    thumbs_up: 0,
    star: 0,
    smile: 0,
    wow: 0,
    okay: 0,
};

export default function ReactionBar({
    item,
    onReactionChanged,
}: Props) {
    const [counts, setCounts] = useState<
        Record<ReactionType, number>
    >({
        ...emptyCounts,
        ...(item.reaction_counts ?? {}),
    });

    const [
        selectedReaction,
        setSelectedReaction,
    ] = useState<ReactionType | null>(
        item.user_reaction ?? null,
    );

    const [loadingReaction, setLoadingReaction] =
        useState<ReactionType | null>(null);

    useEffect(() => {
        setCounts({
            ...emptyCounts,
            ...(item.reaction_counts ?? {}),
        });

        setSelectedReaction(
            item.user_reaction ?? null,
        );
    }, [
        item.reaction_counts,
        item.user_reaction,
    ]);

    // const handleReaction = async (
    //     reactionType: ReactionType,
    // ) => {
    //     if (loadingReaction) {
    //         return;
    //     }

    //     try {
    //         setLoadingReaction(reactionType);

    //         let result;

    //         // Clicking the reaction the user
    //         // already selected removes it.
    //         if (
    //             selectedReaction === reactionType
    //         ) {
    //             result = await removeReaction(
    //                 item.type,
    //                 item.id,
    //             );
    //         } else {
    //             // Selecting a different reaction
    //             // creates or replaces the existing one.
    //             result = await setReaction(
    //                 item.type,
    //                 item.id,
    //                 reactionType,
    //             );
    //         }

    //         const newCounts = {
    //             ...emptyCounts,
    //             ...(result.reactions ?? {}),
    //         };

    //         setCounts(newCounts);

    //         setSelectedReaction(
    //             result.user_reaction ?? null,
    //         );

    //         onReactionChanged?.(
    //             item.id,
    //             newCounts,
    //             result.user_reaction ?? null,
    //             result.total ?? 0,
    //         );
    //     } catch (error: any) {
    //         console.error(
    //             "Reaction failed:",
    //             error?.response?.data ?? error,
    //         );
    //     } finally {
    //         setLoadingReaction(null);
    //     }
    // };
    const handleReaction = async (
        reactionType: ReactionType,
    ) => {
        if (loadingReaction) {
            return;
        }

        const previousCounts = { ...counts };
        const previousSelectedReaction =
            selectedReaction;

        /*
         * Build the new UI state BEFORE
         * waiting for the backend.
         */
        const newCounts = { ...counts };

        let newSelectedReaction:
            | ReactionType
            | null;

        // --------------------------------
        // User taps same reaction again
        // 👏 1 -> 👏 0
        // --------------------------------
        if (
            previousSelectedReaction ===
            reactionType
        ) {
            newCounts[reactionType] = Math.max(
                0,
                (newCounts[reactionType] ?? 0) - 1,
            );

            newSelectedReaction = null;
        }

        // --------------------------------
        // User chooses a new reaction
        // --------------------------------
        else {
            // If they already reacted,
            // decrease the previous reaction.
            if (previousSelectedReaction) {
                newCounts[
                    previousSelectedReaction
                ] = Math.max(
                    0,
                    (newCounts[
                        previousSelectedReaction
                    ] ?? 0) - 1,
                );
            }

            // Increase the new reaction.
            newCounts[reactionType] =
                (newCounts[reactionType] ?? 0) + 1;

            newSelectedReaction =
                reactionType;
        }

        /*
         * UPDATE SCREEN IMMEDIATELY
         */
        setCounts(newCounts);

        setSelectedReaction(
            newSelectedReaction,
        );

        setLoadingReaction(reactionType);

        const newTotal = Object.values(
            newCounts,
        ).reduce(
            (sum, count) => sum + count,
            0,
        );

        onReactionChanged?.(
            item.id,
            newCounts,
            newSelectedReaction,
            newTotal,
        );

        try {
            /*
             * NOW update backend.
             */
            if (
                previousSelectedReaction ===
                reactionType
            ) {
                await removeReaction(
                    item.type,
                    item.id,
                );
            } else {
                await setReaction(
                    item.type,
                    item.id,
                    reactionType,
                );
            }
        } catch (error: any) {
            console.error(
                "Reaction failed:",
                error?.response?.data ?? error,
            );

            /*
             * Backend failed:
             * restore previous UI state.
             */
            setCounts(previousCounts);

            setSelectedReaction(
                previousSelectedReaction,
            );
        } finally {
            setLoadingReaction(null);
        }
    };

    return (
        <View style={styles.container}>
            {reactions.map((reaction) => {
                const count =
                    counts[reaction.key] ?? 0;

                const selected =
                    selectedReaction ===
                    reaction.key;

                const loading =
                    loadingReaction ===
                    reaction.key;

                return (
                    <TouchableOpacity
                        key={reaction.key}
                        activeOpacity={0.7}
                        disabled={!!loadingReaction}
                        onPress={() =>
                            handleReaction(reaction.key)
                        }
                        style={[
                            styles.reaction,
                            selected &&
                            styles.selectedReaction,
                        ]}
                    >
                        {loading ? (
                            <>
                                <Text style={styles.emoji}>
                                    {reaction.emoji}
                                </Text>

                                <Text
                                    style={[
                                        styles.count,
                                        selected &&
                                        styles.selectedCount,
                                    ]}
                                >
                                    {count}
                                </Text>
                            </>
                        ) : (
                            <>
                                <Text style={styles.emoji}>
                                    {reaction.emoji}
                                </Text>

                                <Text
                                    style={[
                                        styles.count,
                                        selected &&
                                        styles.selectedCount,
                                    ]}
                                >
                                    {count}
                                </Text>
                            </>
                        )}
                    </TouchableOpacity>
                );
            })}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",

        marginTop: 10,
        paddingHorizontal: 12,
        paddingTop: 8,
        paddingBottom: 10,

        borderTopWidth: 1,
        borderTopColor:
            "rgba(0,0,0,0.06)",
    },

    reaction: {
        minWidth: 40,
        minHeight: 30,

        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",

        paddingHorizontal: 5,
        paddingVertical: 4,

        borderRadius: 15,
    },

    selectedReaction: {
        backgroundColor:
            "rgba(55,110,98,0.14)",
    },

    emoji: {
        fontSize: 16,
    },

    count: {
        marginLeft: 3,

        fontSize: 10,
        fontWeight: "600",

        color: "#555555",
    },

    selectedCount: {
        color: "#376E62",
        fontWeight: "700",
    },
});