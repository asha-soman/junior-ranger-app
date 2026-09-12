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
    onViewEvent?: () => void;
};

export default function EventCard({
    item,
    onViewEvent,
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

                {/* VIEW EVENT BUTTON */}
                <TouchableOpacity
                    style={styles.viewEventButton}
                    onPress={onViewEvent}
                    activeOpacity={0.85}
                >
                    <Ionicons
                        name="calendar-outline"
                        size={18}
                        color="#FFFFFF"
                    />

                    <Text style={styles.viewEventButtonText}>
                        View Event & Register
                    </Text>

                    <Ionicons
                        name="chevron-forward"
                        size={18}
                        color="#FFFFFF"
                    />
                </TouchableOpacity>
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

    viewEventButton: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#C46D20",
        borderRadius: 10,
        paddingVertical: 11,
        paddingHorizontal: 14,
        marginTop: 14,
        marginBottom: 4,
        gap: 7,
    },

    viewEventButtonText: {
        fontSize: 13,
        fontWeight: "700",
        color: "#FFFFFF",
    },
});