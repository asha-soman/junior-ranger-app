import React, { useState } from "react";

import {
    Alert,
    Platform,
    Pressable,
    StyleSheet,
    Text,
    View,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";

import {
    FeedItem,
} from "../../services/feed/feedService";

import ReactionBar from "./ReactionBar";

type Props = {
    item: FeedItem;

    isOwner?: boolean;

    onEdit?: () => void;

    onDelete?: () => void;
};

export default function ActivityPostCard({
    item,
    isOwner = false,
    onEdit,
    onDelete,
}: Props) {
    const [
        menuVisible,
        setMenuVisible,
    ] = useState(false);

    const formattedDate =
        item.created_at
            ? new Date(
                item.created_at,
            ).toLocaleDateString(
                undefined,
                {
                    day: "numeric",
                    month: "short",
                },
            )
            : "";

    /* =========================
       MENU
    ========================== */

    const handleMenuPress = () => {
        setMenuVisible(
            (previous) => !previous,
        );
    };

    const handleEdit = () => {
        setMenuVisible(false);

        onEdit?.();
    };

    const handleDelete = () => {
        setMenuVisible(false);

        // Expo Web
        if (Platform.OS === "web") {
            const confirmed = window.confirm(
                "Are you sure you want to delete this activity post?",
            );

            if (confirmed) {
                onDelete?.();
            }

            return;
        }

        // Android / iOS
        Alert.alert(
            "Delete Post?",
            "Are you sure you want to delete this activity post?",
            [
                {
                    text: "Cancel",
                    style: "cancel",
                },
                {
                    text: "Delete",
                    style: "destructive",
                    onPress: () => {
                        onDelete?.();
                    },
                },
            ],
        );
    };

    return (
        <View style={styles.card}>
            {/* =========================
          HEADER
      ========================== */}

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

                {/* =========================
            OWNER MENU BUTTON
        ========================== */}

                {isOwner && (
                    <View
                        style={
                            styles.menuContainer
                        }
                    >
                        <Pressable
                            style={({ pressed }) => [
                                styles.menuButton,

                                pressed &&
                                styles.menuButtonPressed,
                            ]}
                            onPress={
                                handleMenuPress
                            }
                            hitSlop={10}
                        >
                            <Ionicons
                                name="ellipsis-horizontal"
                                size={24}
                                color="#222222"
                            />
                        </Pressable>

                        {/* =========================
                DROPDOWN
            ========================== */}

                        {menuVisible && (
                            <View
                                style={
                                    styles.dropdownMenu
                                }
                            >
                                <Pressable
                                    style={({
                                        pressed,
                                    }) => [
                                            styles.dropdownItem,

                                            pressed &&
                                            styles.dropdownPressed,
                                        ]}
                                    onPress={
                                        handleEdit
                                    }
                                >
                                    <Ionicons
                                        name="create-outline"
                                        size={18}
                                        color="#333333"
                                    />

                                    <Text
                                        style={
                                            styles.dropdownText
                                        }
                                    >
                                        Edit Post
                                    </Text>
                                </Pressable>

                                <View
                                    style={
                                        styles.divider
                                    }
                                />

                                <Pressable
                                    style={({
                                        pressed,
                                    }) => [
                                            styles.dropdownItem,

                                            pressed &&
                                            styles.dropdownPressed,
                                        ]}
                                    onPress={
                                        handleDelete
                                    }
                                >
                                    <Ionicons
                                        name="trash-outline"
                                        size={18}
                                        color="#B3261E"
                                    />

                                    <Text
                                        style={
                                            styles.deleteText
                                        }
                                    >
                                        Delete Post
                                    </Text>
                                </Pressable>
                            </View>
                        )}
                    </View>
                )}
            </View>

            {/* =========================
          CONTENT
      ========================== */}

            <View style={styles.content}>
                {item.content && (
                    <Text
                        style={styles.bodyText}
                    >
                        {item.content}
                    </Text>
                )}

                {/* =========================
            IMAGE PLACEHOLDER

            Cloud image storage will
            be connected later.
        ========================== */}

                {item.image_url ? (
                    <View
                        style={
                            styles.imagePlaceholder
                        }
                    >
                        <Ionicons
                            name="image-outline"
                            size={34}
                            color="#6C8BA5"
                        />

                        <Text
                            style={
                                styles.imagePlaceholderText
                            }
                        >
                            Activity Photo
                        </Text>
                    </View>
                ) : null}
            </View>

            {/* =========================
          REACTIONS
      ========================== */}

            <ReactionBar item={item} />
        </View>
    );
}

const styles =
    StyleSheet.create({
        card: {
            backgroundColor:
                "#D5EAF8",

            borderRadius: 15,

            marginBottom: 14,

            /*
             * IMPORTANT:
             *
             * Do NOT use
             * overflow: "hidden"
             * here.
             *
             * The dropdown needs to
             * extend outside the header.
             */
            overflow: "visible",

            borderWidth: 1,
            borderColor: "#B9D8EC",

            position: "relative",

            zIndex: 1,
        },

        /* =========================
           HEADER
        ========================== */

        header: {
            flexDirection: "row",

            alignItems: "center",

            paddingHorizontal: 12,
            paddingVertical: 9,

            backgroundColor:
                "#BDDDF2",

            borderTopLeftRadius: 15,
            borderTopRightRadius: 15,

            /*
             * Allows our dropdown to
             * appear above the body.
             */
            position: "relative",

            zIndex: 20,
        },

        avatar: {
            width: 36,
            height: 36,

            borderRadius: 18,

            backgroundColor:
                "#EAF6FD",

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

        /* =========================
           MENU
        ========================== */

        menuContainer: {
            position: "relative",

            zIndex: 100,
        },

        menuButton: {
            width: 40,
            height: 40,

            borderRadius: 20,

            alignItems: "center",
            justifyContent: "center",
        },

        menuButtonPressed: {
            backgroundColor:
                "rgba(0,0,0,0.08)",
        },

        /* =========================
           DROPDOWN
        ========================== */

        dropdownMenu: {
            position: "absolute",

            top: 38,
            right: 0,

            width: 155,

            backgroundColor:
                "#FFFFFF",

            borderRadius: 10,

            paddingVertical: 5,

            borderWidth: 1,
            borderColor: "#DDDDDD",

            shadowColor: "#000000",

            shadowOffset: {
                width: 0,
                height: 3,
            },

            shadowOpacity: 0.18,

            shadowRadius: 5,

            elevation: 8,

            zIndex: 999,
        },

        dropdownItem: {
            flexDirection: "row",

            alignItems: "center",

            paddingHorizontal: 13,
            paddingVertical: 11,

            gap: 9,
        },

        dropdownPressed: {
            backgroundColor:
                "#F2F2F2",
        },

        dropdownText: {
            fontSize: 13,

            fontWeight: "600",

            color: "#333333",
        },

        deleteText: {
            fontSize: 13,

            fontWeight: "600",

            color: "#B3261E",
        },

        divider: {
            height: 1,

            backgroundColor:
                "#EEEEEE",

            marginHorizontal: 10,
        },

        /* =========================
           CONTENT
        ========================== */

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

        /* =========================
           IMAGE PLACEHOLDER
        ========================== */

        imagePlaceholder: {
            width: "100%",

            height: 135,

            borderRadius: 10,

            backgroundColor:
                "#D0DEE8",

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