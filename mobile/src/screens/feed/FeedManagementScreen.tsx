import React from "react";

import {
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";

import {
    RouteProp,
    useNavigation,
    useRoute,
} from "@react-navigation/native";

import { NativeStackNavigationProp } from "@react-navigation/native-stack";

import { AuthStackParamList } from "../../navigation/AuthNavigator";

type NavigationProp =
    NativeStackNavigationProp<
        AuthStackParamList,
        "FeedManagement"
    >;

type RouteProps = RouteProp<
    AuthStackParamList,
    "FeedManagement"
>;

export default function FeedManagementScreen() {
    const navigation =
        useNavigation<NavigationProp>();

    const route =
        useRoute<RouteProps>();

    const { userRole } =
        route.params;

    const cards = [
        {
            title: "Announcements",
            description:
                "Create, publish and manage cohort announcements.",
            icon: "megaphone-outline" as const,
            onPress: () =>
                navigation.navigate(
                    "AnnouncementManagement",
                    {
                        userRole,
                    },
                ),
        },

        {
            title: "Club Activities",
            description:
                "Share and manage club activities for your cohorts.",
            icon: "people-outline" as const,
            onPress: () => {
                // We'll connect this next.
            },
        },

        {
            title: "View Social Feed",
            description:
                "Preview the combined social feed.",
            icon: "newspaper-outline" as const,
            onPress: () =>
                navigation.navigate(
                    "SocialFeed",
                    {
                        userRole,
                    },
                )
        },
    ];

    return (
        <ScrollView
            style={styles.container}
            contentContainerStyle={
                styles.content
            }
        >
            <Text style={styles.heading}>
                Feed Management
            </Text>

            <Text style={styles.subtitle}>
                Manage the content shared
                with Junior Rangers.
            </Text>

            <View style={styles.grid}>
                {cards.map(
                    (card) => (
                        <TouchableOpacity
                            key={card.title}
                            style={styles.card}
                            activeOpacity={0.85}
                            onPress={
                                card.onPress
                            }
                        >
                            <View
                                style={
                                    styles.iconContainer
                                }
                            >
                                <Ionicons
                                    name={
                                        card.icon
                                    }
                                    size={28}
                                    color="#2F6F61"
                                />
                            </View>

                            <View
                                style={
                                    styles.cardText
                                }
                            >
                                <Text
                                    style={
                                        styles.cardTitle
                                    }
                                >
                                    {card.title}
                                </Text>

                                <Text
                                    style={
                                        styles.cardDescription
                                    }
                                >
                                    {
                                        card.description
                                    }
                                </Text>
                            </View>

                            <Ionicons
                                name="chevron-forward"
                                size={22}
                                color="#75847F"
                            />
                        </TouchableOpacity>
                    ),
                )}
            </View>
        </ScrollView>
    );
}

const styles =
    StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor:
                "#F5F8F7",
        },

        content: {
            padding: 18,
            paddingBottom: 40,
        },

        heading: {
            fontSize: 26,
            fontWeight: "800",
            color: "#1D312B",
        },

        subtitle: {
            marginTop: 5,
            marginBottom: 24,
            fontSize: 14,
            lineHeight: 20,
            color: "#687C75",
        },

        grid: {
            gap: 14,
        },

        card: {
            flexDirection: "row",
            alignItems: "center",

            backgroundColor:
                "#FFFFFF",

            borderWidth: 1,
            borderColor:
                "#E1EAE7",

            borderRadius: 14,
            padding: 17,

            shadowColor: "#000",
            shadowOpacity: 0.05,
            shadowRadius: 6,
            elevation: 2,
        },

        iconContainer: {
            width: 50,
            height: 50,
            borderRadius: 25,

            alignItems: "center",
            justifyContent:
                "center",

            backgroundColor:
                "#E4F1ED",

            marginRight: 14,
        },

        cardText: {
            flex: 1,
            marginRight: 10,
        },

        cardTitle: {
            fontSize: 17,
            fontWeight: "700",
            color: "#21362F",
        },

        cardDescription: {
            marginTop: 4,
            fontSize: 13,
            lineHeight: 18,
            color: "#71807B",
        },
    });