import React, {
    useCallback,
    useEffect,
    useMemo,
    useState,
} from "react";

import {
    ActivityIndicator,
    FlatList,
    RefreshControl,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";
import AnnouncementCard from "../../components/feed/AnnouncementCard";
import EventCard from "../../components/feed/EventCard";
import ClubActivityCard from "../../components/feed/ClubActivityCard";
import ActivityPostCard from "../../components/feed/ActivityPostCard";

import {
    useFocusEffect,
    useNavigation,
} from "@react-navigation/native";

import { NativeStackNavigationProp } from "@react-navigation/native-stack";

import {
    AuthStackParamList,
} from "../../navigation/AuthNavigator";

import {
    FeedItem,
    FeedItemType,
    getFeed,
} from "../../services/feed/feedService";

type NavigationProp = NativeStackNavigationProp<
    AuthStackParamList,
    "SocialFeed"
>;

type FilterType =
    | "all"
    | FeedItemType;

const filters: {
    label: string;
    value: FilterType;
}[] = [
        {
            label: "All",
            value: "all",
        },
        {
            label: "Announcements",
            value: "announcement",
        },
        {
            label: "Events",
            value: "event",
        },
        {
            label: "Club Activities",
            value: "club_activity",
        },
        {
            label: "Activities",
            value: "activity_post",
        },
    ];

export default function SocialFeedScreen() {
    const navigation = useNavigation<NavigationProp>();

    const [feed, setFeed] = useState<FeedItem[]>([]);
    const [loading, setLoading] = useState(true);

    const [refreshing, setRefreshing] =
        useState(false);

    const [selectedFilter, setSelectedFilter] =
        useState<FilterType>("all");

    const [error, setError] =
        useState<string | null>(null);

    const loadFeed = async (
        showLoading = true,
    ) => {
        try {
            if (showLoading) {
                setLoading(true);
            }

            setError(null);

            const data = await getFeed();

            setFeed(data);
        } catch (err: any) {
            console.error(
                "Unable to load feed:",
                err?.response?.data ?? err,
            );

            setError(
                err?.response?.data?.message ??
                "We couldn't load your feed.",
            );
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        loadFeed();
    }, []);

    // Reload feed after returning from Add Post
    useFocusEffect(
        useCallback(() => {
            loadFeed(false);
        }, []),
    );

    const handleRefresh = () => {
        setRefreshing(true);
        loadFeed(false);
    };

    const filteredFeed = useMemo(() => {
        if (selectedFilter === "all") {
            return feed;
        }

        return feed.filter(
            (item) => item.type === selectedFilter,
        );
    }, [feed, selectedFilter]);

    const getTypeLabel = (
        type: FeedItemType,
    ) => {
        switch (type) {
            case "announcement":
                return "Announcement";

            case "event":
                return "Event";

            case "club_activity":
                return "Club Activity";

            case "activity_post":
                return "Activity";

            default:
                return "Post";
        }
    };

    const renderFeedItem = ({
        item,
    }: {
        item: FeedItem;
    }) => {
        switch (item.type) {
            case "announcement":
                return (
                    <AnnouncementCard item={item} />
                );

            case "event":
                return (
                    <EventCard item={item} />
                );

            case "club_activity":
                return (
                    <ClubActivityCard item={item} />
                );

            case "activity_post":
                return (
                    <ActivityPostCard item={item} />
                );

            default:
                return null;
        }
    };

    const ListHeader = () => (
        <>
            <View style={styles.pageHeading}>
                <Text style={styles.title}>
                    Junior Ranger Feed
                </Text>

                <Text style={styles.subtitle}>
                    See what's happening in your club.
                </Text>
            </View>

            <View style={styles.cohortBanner}>
                <Ionicons
                    name="people-outline"
                    size={19}
                    color="#376E62"
                />

                <Text style={styles.cohortBannerText}>
                    Only posts from your club are shown
                </Text>
            </View>

            <FlatList
                data={filters}
                horizontal
                showsHorizontalScrollIndicator={false}
                keyExtractor={(item) => item.value}
                contentContainerStyle={
                    styles.filterContainer
                }
                renderItem={({ item }) => {
                    const selected =
                        selectedFilter === item.value;

                    return (
                        <TouchableOpacity
                            style={[
                                styles.filterButton,
                                selected &&
                                styles.selectedFilterButton,
                            ]}
                            onPress={() =>
                                setSelectedFilter(item.value)
                            }
                        >
                            <Text
                                style={[
                                    styles.filterText,
                                    selected &&
                                    styles.selectedFilterText,
                                ]}
                            >
                                {item.label}
                            </Text>
                        </TouchableOpacity>
                    );
                }}
            />

            <TouchableOpacity
                style={styles.sharePost}
                activeOpacity={0.85}
                onPress={() =>
                    navigation.navigate(
                        "ActivityPostForm",
                    )
                }
            >
                <View style={styles.shareAvatar}>
                    <Text style={styles.shareAvatarText}>
                        JR
                    </Text>
                </View>

                <Text style={styles.shareText}>
                    Share A Post
                </Text>

                <Ionicons
                    name="camera-outline"
                    size={24}
                    color="#376E62"
                />

                <View style={styles.addButton}>
                    <Ionicons
                        name="add"
                        size={24}
                        color="#FFFFFF"
                    />
                </View>
            </TouchableOpacity>

            <Text style={styles.sectionHeading}>
                Latest
            </Text>
        </>
    );

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator
                    size="large"
                    color="#376E62"
                />

                <Text style={styles.loadingText}>
                    Loading your feed...
                </Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <FlatList
                data={filteredFeed}
                keyExtractor={(item) =>
                    `${item.type}-${item.id}`
                }
                renderItem={renderFeedItem}
                ListHeaderComponent={ListHeader}
                contentContainerStyle={
                    styles.listContent
                }
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={handleRefresh}
                    />
                }
                ListEmptyComponent={
                    <View style={styles.emptyContainer}>
                        <Ionicons
                            name={
                                error
                                    ? "alert-circle-outline"
                                    : "leaf-outline"
                            }
                            size={42}
                            color="#376E62"
                        />

                        <Text style={styles.emptyTitle}>
                            {error
                                ? "Couldn't load the feed"
                                : "Nothing here yet"}
                        </Text>

                        <Text style={styles.emptyText}>
                            {error ??
                                (selectedFilter === "all"
                                    ? "Be the first to share an activity with your club!"
                                    : "There aren't any posts in this category yet.")}
                        </Text>

                        {error && (
                            <TouchableOpacity
                                style={styles.retryButton}
                                onPress={() =>
                                    loadFeed()
                                }
                            >
                                <Text
                                    style={
                                        styles.retryButtonText
                                    }
                                >
                                    Try Again
                                </Text>
                            </TouchableOpacity>
                        )}
                    </View>
                }
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#F6F7F5",
    },

    listContent: {
        padding: 16,
        paddingBottom: 50,
    },

    loadingContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#F6F7F5",
    },

    loadingText: {
        marginTop: 12,
        color: "#666",
    },

    pageHeading: {
        marginBottom: 14,
    },

    title: {
        fontSize: 25,
        fontWeight: "700",
        color: "#1B1B1B",
    },

    subtitle: {
        marginTop: 4,
        fontSize: 14,
        color: "#666",
    },

    cohortBanner: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#DDEDE8",
        paddingVertical: 10,
        paddingHorizontal: 14,
        borderRadius: 20,
        marginBottom: 14,
        gap: 7,
    },

    cohortBannerText: {
        fontSize: 13,
        fontWeight: "600",
        color: "#2E5F54",
    },

    filterContainer: {
        gap: 8,
        paddingBottom: 15,
    },

    filterButton: {
        borderWidth: 1,
        borderColor: "#B8B8B8",
        backgroundColor: "#FFFFFF",
        paddingHorizontal: 15,
        paddingVertical: 8,
        borderRadius: 20,
    },

    selectedFilterButton: {
        backgroundColor: "#376E62",
        borderColor: "#376E62",
    },

    filterText: {
        fontSize: 13,
        fontWeight: "600",
        color: "#444",
    },

    selectedFilterText: {
        color: "#FFFFFF",
    },

    sharePost: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#E3E3E3",
        paddingHorizontal: 12,
        paddingVertical: 10,
        borderRadius: 14,
        marginBottom: 22,
    },

    shareAvatar: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: "#FFFFFF",
        alignItems: "center",
        justifyContent: "center",
        marginRight: 10,
    },

    shareAvatarText: {
        fontSize: 11,
        fontWeight: "700",
        color: "#376E62",
    },

    shareText: {
        flex: 1,
        fontSize: 15,
        fontWeight: "700",
        color: "#222",
    },

    addButton: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: "#376E62",
        alignItems: "center",
        justifyContent: "center",
        marginLeft: 10,
    },

    sectionHeading: {
        fontSize: 18,
        fontWeight: "700",
        marginBottom: 12,
        color: "#222",
    },

    card: {
        backgroundColor: "#FFFFFF",
        borderRadius: 16,
        padding: 15,
        marginBottom: 14,
        borderWidth: 1,
        borderColor: "#E2E2E2",
    },

    cardHeader: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 12,
    },

    avatar: {
        width: 38,
        height: 38,
        borderRadius: 19,
        backgroundColor: "#E0EFEA",
        alignItems: "center",
        justifyContent: "center",
    },

    headerInformation: {
        flex: 1,
        marginLeft: 10,
    },

    author: {
        fontSize: 14,
        fontWeight: "700",
        color: "#222",
    },

    postType: {
        marginTop: 2,
        fontSize: 12,
        color: "#777",
    },

    cardTitle: {
        fontSize: 17,
        fontWeight: "700",
        color: "#222",
        marginBottom: 6,
    },

    cardContent: {
        fontSize: 14,
        lineHeight: 20,
        color: "#444",
        marginBottom: 12,
    },

    detailRow: {
        flexDirection: "row",
        alignItems: "center",
        marginTop: 5,
        gap: 6,
    },

    detailText: {
        fontSize: 13,
        color: "#555",
    },

    cardFooter: {
        flexDirection: "row",
        justifyContent: "space-between",
        borderTopWidth: 1,
        borderTopColor: "#EEEEEE",
        paddingTop: 10,
        marginTop: 12,
    },

    dateText: {
        fontSize: 12,
        color: "#888",
    },

    reactionSummary: {
        fontSize: 12,
        fontWeight: "600",
        color: "#376E62",
    },

    emptyContainer: {
        alignItems: "center",
        paddingVertical: 50,
        paddingHorizontal: 25,
    },

    emptyTitle: {
        marginTop: 12,
        fontSize: 17,
        fontWeight: "700",
        color: "#333",
    },

    emptyText: {
        marginTop: 6,
        textAlign: "center",
        lineHeight: 19,
        color: "#777",
    },

    retryButton: {
        marginTop: 16,
        backgroundColor: "#376E62",
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 18,
    },

    retryButtonText: {
        color: "#FFFFFF",
        fontWeight: "700",
    },
});