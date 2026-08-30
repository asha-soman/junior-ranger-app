import React from "react";

import {
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";

import {
    FeedItem,
} from "../../services/feed/feedService";

import ReactionBar from "./ReactionBar";

type Props = {
    item: FeedItem;
};

export default function EventCard({
    item,
}: Props) {
    const eventDate =
        item.start_time
            ? new Date(item.start_time)
            : null;

    const formattedDate =
        eventDate
            ? eventDate.toLocaleDateString(
                undefined,
                {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                },
            )
            : null;

    const formattedTime =
        eventDate
            ? eventDate.toLocaleTimeString(
                undefined,
                {
                    hour: "2-digit",
                    minute: "2-digit",
                },
            )
            : null;

    return (
        <View style={styles.card}>
            {/* HEADER */}
            <View style={styles.header}>
                <View style={styles.iconContainer}>
                    <Text style={styles.icon}>
                        🗓️
                    </Text>
                </View>

                <View style={styles.headerText}>
                    <Text style={styles.title}>
                        {item.title ?? "Event"}
                    </Text>

                    <Text style={styles.metaText}>
                        {item.cohort_name ??
                            "Junior Rangers"}
                    </Text>
                </View>

                <TouchableOpacity
                    style={styles.menuButton}
                    activeOpacity={0.7}
                >
                    <Ionicons
                        name="ellipsis-horizontal"
                        size={22}
                        color="#222222"
                    />
                </TouchableOpacity>
            </View>

            {/* CONTENT */}
            <View style={styles.content}>
                {item.content && (
                    <Text style={styles.description}>
                        {item.content}
                    </Text>
                )}

                {(formattedDate ||
                    formattedTime ||
                    item.location) && (
                        <View style={styles.eventInfoBox}>
                            {formattedDate && (
                                <View style={styles.infoRow}>
                                    <Ionicons
                                        name="calendar-outline"
                                        size={16}
                                        color="#C46D20"
                                    />

                                    <Text style={styles.infoText}>
                                        {formattedDate}
                                    </Text>
                                </View>
                            )}

                            {formattedTime && (
                                <View style={styles.infoRow}>
                                    <Ionicons
                                        name="time-outline"
                                        size={16}
                                        color="#C46D20"
                                    />

                                    <Text style={styles.infoText}>
                                        {formattedTime}
                                    </Text>
                                </View>
                            )}

                            {item.location && (
                                <View style={styles.infoRow}>
                                    <Ionicons
                                        name="location-outline"
                                        size={16}
                                        color="#C46D20"
                                    />

                                    <Text style={styles.infoText}>
                                        {item.location}
                                    </Text>
                                </View>
                            )}
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
        backgroundColor: "#FBE2C8",

        borderRadius: 15,

        marginBottom: 14,

        overflow: "hidden",

        borderWidth: 1,
        borderColor: "#F2C99F",
    },

    header: {
        flexDirection: "row",
        alignItems: "center",

        paddingHorizontal: 12,
        paddingVertical: 9,

        backgroundColor: "#F5CFAB",
    },

    iconContainer: {
        width: 34,
        height: 34,

        borderRadius: 17,

        justifyContent: "center",
        alignItems: "center",

        backgroundColor: "#FFF6ED",

        marginRight: 9,
    },

    icon: {
        fontSize: 20,
    },

    headerText: {
        flex: 1,
    },

    title: {
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

    description: {
        fontSize: 13,

        lineHeight: 18,

        color: "#222222",

        marginBottom: 10,
    },

    eventInfoBox: {
        backgroundColor: "#F8CEA5",

        borderRadius: 12,

        paddingHorizontal: 12,
        paddingVertical: 10,

        alignSelf: "flex-start",

        minWidth: 180,
    },

    infoRow: {
        flexDirection: "row",
        alignItems: "center",

        marginBottom: 5,
    },

    infoText: {
        fontSize: 11,

        fontWeight: "600",

        color: "#5A371F",

        marginLeft: 6,
    },
});