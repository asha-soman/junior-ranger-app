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

export default function ClubActivityCard({
    item,
}: Props) {
    const activityDate = item.activity_date
        ? new Date(item.activity_date)
        : null;

    const formattedActivityDate = activityDate
        ? activityDate.toLocaleDateString(
            undefined,
            {
                day: "2-digit",
                month: "short",
                year: "numeric",
            },
        )
        : null;

    return (
        <View style={styles.card}>
            {/* HEADER */}
            <View style={styles.header}>
                <View style={styles.iconContainer}>
                    <Text style={styles.icon}>
                        ⭐
                    </Text>
                </View>

                <View style={styles.headerText}>
                    <Text style={styles.title}>
                        {item.title ??
                            "Club Activity"}
                    </Text>

                    <Text style={styles.metaText}>
                        {item.cohort_name ??
                            "Junior Rangers"}

                        {formattedActivityDate
                            ? ` • ${formattedActivityDate}`
                            : ""}
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

                {formattedActivityDate && (
                    <View style={styles.dateRow}>
                        <Ionicons
                            name="calendar-outline"
                            size={15}
                            color="#8A6A00"
                        />

                        <Text style={styles.dateText}>
                            {formattedActivityDate}
                        </Text>
                    </View>
                )}

                {/*
          IMAGE AREA

          We'll connect this to item.image_url
          after cloud image upload is ready.
        */}

                <View style={styles.imageGrid}>
                    <View style={styles.imagePlaceholder}>
                        <Ionicons
                            name="image-outline"
                            size={24}
                            color="#9C955E"
                        />
                    </View>

                    <View style={styles.imagePlaceholder}>
                        <Ionicons
                            name="image-outline"
                            size={24}
                            color="#9C955E"
                        />
                    </View>

                    <View style={styles.imagePlaceholder}>
                        <Ionicons
                            name="image-outline"
                            size={24}
                            color="#9C955E"
                        />
                    </View>
                </View>
            </View>

            {/* REACTIONS */}
            <ReactionBar item={item} />
        </View>
    );
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: "#FFF3BF",

        borderRadius: 15,

        marginBottom: 14,

        overflow: "hidden",

        borderWidth: 1,
        borderColor: "#E9D987",
    },

    header: {
        flexDirection: "row",
        alignItems: "center",

        paddingHorizontal: 12,
        paddingVertical: 9,

        backgroundColor: "#F5E49B",
    },

    iconContainer: {
        width: 34,
        height: 34,

        borderRadius: 17,

        justifyContent: "center",
        alignItems: "center",

        backgroundColor: "#FFFBE7",

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
        marginTop: 2,

        fontSize: 10,

        color: "#625B36",
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

        color: "#262626",

        marginBottom: 8,
    },

    dateRow: {
        flexDirection: "row",
        alignItems: "center",

        marginTop: 3,
        marginBottom: 10,
    },

    dateText: {
        marginLeft: 5,

        fontSize: 11,
        fontWeight: "600",

        color: "#6C5B1D",
    },

    imageGrid: {
        flexDirection: "row",

        gap: 8,

        marginTop: 5,
    },

    imagePlaceholder: {
        flex: 1,

        height: 80,

        backgroundColor: "#DEDDBD",

        borderRadius: 7,

        justifyContent: "center",
        alignItems: "center",
    },
});