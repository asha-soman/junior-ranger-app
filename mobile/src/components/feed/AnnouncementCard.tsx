import React from "react";

import {
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

import {
    Ionicons,
} from "@expo/vector-icons";

import {
    FeedItem,
} from "../../services/feed/feedService";

import ReactionBar from "./ReactionBar";

type Props = {
    item: FeedItem;
};

export default function AnnouncementCard({
    item,
}: Props) {
    const formattedDate =
        item.created_at
            ? new Date(
                item.created_at,
            ).toLocaleDateString()
            : "";

    return (
        <View style={styles.card}>
            {/* HEADER */}

            <View style={styles.header}>
                <View style={styles.iconContainer}>
                    <Text style={styles.icon}>
                        📣
                    </Text>
                </View>

                <View style={styles.headerText}>
                    <Text style={styles.headerTitle}>
                        {item.title ??
                            "Announcement"}
                    </Text>

                    <Text style={styles.metaText}>
                        {item.author_name ??
                            "Ranger"}

                        {formattedDate
                            ? ` • ${formattedDate}`
                            : ""}
                    </Text>
                </View>
            </View>

            {/* CONTENT */}

            <View style={styles.content}>
                {item.content && (
                    <Text style={styles.bodyText}>
                        {item.content}
                    </Text>
                )}

                {item.is_pinned && (
                    <View style={styles.pinnedRow}>
                        <Ionicons
                            name="pin"
                            size={13}
                            color="#376E62"
                        />

                        <Text style={styles.pinnedText}>
                            Pinned Announcement
                        </Text>
                    </View>
                )}
            </View>

            {/* REACTIONS */}

            <ReactionBar item={item} />
        </View>
    );
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: "#DCEEF2",

        borderRadius: 15,

        marginBottom: 14,

        overflow: "hidden",

        borderWidth: 1,
        borderColor: "#C5DFE4",
    },

    header: {
        flexDirection: "row",
        alignItems: "center",

        paddingHorizontal: 12,
        paddingVertical: 9,

        backgroundColor: "#CFE6EB",
    },

    iconContainer: {
        width: 34,
        height: 34,

        borderRadius: 17,

        justifyContent: "center",
        alignItems: "center",

        backgroundColor: "#FFFFFF",

        marginRight: 9,
    },

    icon: {
        fontSize: 20,
    },

    headerText: {
        flex: 1,
    },

    headerTitle: {
        fontSize: 14,
        fontWeight: "700",

        color: "#1C1C1C",
    },

    metaText: {
        fontSize: 10,

        color: "#555555",

        marginTop: 2,
    },

    menuButton: {
        padding: 5,
    },

    content: {
        paddingHorizontal: 14,
        paddingTop: 12,
        paddingBottom: 5,
    },

    bodyText: {
        fontSize: 13,

        lineHeight: 18,

        color: "#222222",
    },

    pinnedRow: {
        flexDirection: "row",
        alignItems: "center",

        marginTop: 8,
    },

    pinnedText: {
        marginLeft: 4,

        fontSize: 10,

        fontWeight: "600",

        color: "#376E62",
    },
});