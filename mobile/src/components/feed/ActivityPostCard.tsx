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

export default function ActivityPostCard({
    item,
}: Props) {
    const formattedDate = item.created_at
        ? new Date(item.created_at).toLocaleDateString(
            undefined,
            {
                day: "numeric",
                month: "short",
            },
        )
        : "";

    return (
        <View style={styles.card}>
            {/* HEADER */}
            <View style={styles.header}>
                <View style={styles.avatar}>
                    <Ionicons
                        name="person"
                        size={22}
                        color="#4285C5"
                    />
                </View>

                <View style={styles.headerText}>
                    <Text style={styles.authorName}>
                        {item.author_name ??
                            "Junior Ranger"}
                    </Text>

                    <Text style={styles.metaText}>
                        {formattedDate
                            ? `${formattedDate} • Activity`
                            : "Activity"}
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
                    <Text style={styles.bodyText}>
                        {item.content}
                    </Text>
                )}

                {/*
          IMAGE AREA

          Only show a placeholder for now.
          Later this becomes an <Image />
          when cloud image upload is connected.
        */}

                {item.image_url ? (
                    <View style={styles.imagePlaceholder}>
                        <Ionicons
                            name="image-outline"
                            size={34}
                            color="#6C8BA5"
                        />

                        <Text style={styles.imagePlaceholderText}>
                            Activity Photo
                        </Text>
                    </View>
                ) : null}
            </View>

            {/* REACTIONS */}
            <ReactionBar item={item} />
        </View>
    );
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: "#D5EAF8",

        borderRadius: 15,

        marginBottom: 14,

        overflow: "hidden",

        borderWidth: 1,
        borderColor: "#B9D8EC",
    },

    header: {
        flexDirection: "row",
        alignItems: "center",

        paddingHorizontal: 12,
        paddingVertical: 9,

        backgroundColor: "#BDDDF2",
    },

    avatar: {
        width: 36,
        height: 36,

        borderRadius: 18,

        backgroundColor: "#EAF6FD",

        alignItems: "center",
        justifyContent: "center",

        marginRight: 9,
    },

    headerText: {
        flex: 1,
    },

    authorName: {
        fontSize: 14,
        fontWeight: "700",

        color: "#1C1C1C",
    },

    metaText: {
        fontSize: 10,

        color: "#4E6474",

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

        marginBottom: 10,
    },

    imagePlaceholder: {
        width: "100%",
        height: 135,

        borderRadius: 10,

        backgroundColor: "#D0DEE8",

        justifyContent: "center",
        alignItems: "center",

        marginTop: 4,
    },

    imagePlaceholderText: {
        marginTop: 5,

        fontSize: 10,
        fontWeight: "600",

        color: "#617789",
    },
});