import React, {
    useCallback,
    useEffect,
    useMemo,
    useState,
} from "react";

import {
    ActivityIndicator,
    Alert,
    FlatList,
    RefreshControl,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";

import {
    useFocusEffect,
    useNavigation,
} from "@react-navigation/native";

import { NativeStackNavigationProp } from "@react-navigation/native-stack";

import { AuthStackParamList } from "../../navigation/AuthNavigator";

import {
    FeedItem,
    FeedItemType,
    getFeed,
} from "../../services/feed/feedService";

import {
    deleteActivityPost,
} from "../../services/activity-posts/activityPostsService";

import {
    getCurrentUserProfile,
} from "../../services/auth/authService";

import AnnouncementCard from "../../components/feed/AnnouncementCard";
import EventCard from "../../components/feed/EventCard";
import ClubActivityCard from "../../components/feed/ClubActivityCard";
import ActivityPostCard from "../../components/feed/ActivityPostCard";

/* ========================================================
   TYPES
======================================================== */

type NavigationProp =
    NativeStackNavigationProp<
        AuthStackParamList,
        "SocialFeed"
    >;

type FilterType =
    | "all"
    | FeedItemType;

/* ========================================================
   FILTER OPTIONS
======================================================== */

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

/* ========================================================
   SCREEN
======================================================== */

export default function SocialFeedScreen() {
    const navigation =
        useNavigation<NavigationProp>();

    /* ======================================================
       STATE
    ====================================================== */

    const [feed, setFeed] =
        useState<FeedItem[]>([]);

    const [loading, setLoading] =
        useState(true);

    const [refreshing, setRefreshing] =
        useState(false);

    const [error, setError] =
        useState<string | null>(null);

    const [
        selectedFilter,
        setSelectedFilter,
    ] = useState<FilterType>("all");

    const [
        currentUserId,
        setCurrentUserId,
    ] = useState<string | null>(null);

    /*
     * Search text entered by
     * the Junior Ranger.
     */
    const [
        searchText,
        setSearchText,
    ] = useState("");

    /* ======================================================
       LOAD CURRENT USER
    ====================================================== */

    const loadCurrentUser =
        async () => {
            try {
                const profile =
                    await getCurrentUserProfile();

                console.log(
                    "Current user profile:",
                    profile,
                );

                setCurrentUserId(
                    profile.userId,
                );
            } catch (err: any) {
                console.error(
                    "Unable to load current user:",
                    err?.response?.data ??
                    err,
                );

                setCurrentUserId(
                    null,
                );
            }
        };

    /* ======================================================
       LOAD FEED
    ====================================================== */

    const loadFeed =
        async (
            showLoader = true,
        ) => {
            try {
                if (showLoader) {
                    setLoading(true);
                }

                setError(null);

                const result =
                    await getFeed();

                console.log(
                    "Feed response:",
                    result,
                );

                setFeed(result);
            } catch (err: any) {
                console.error(
                    "Unable to load feed:",
                    err?.response?.data ??
                    err,
                );

                setError(
                    err?.response?.data
                        ?.message ||
                    err?.message ||
                    "We couldn't load the feed.",
                );
            } finally {
                if (showLoader) {
                    setLoading(false);
                }
            }
        };

    /* ======================================================
       INITIAL LOAD
    ====================================================== */

    useEffect(() => {
        const initialiseScreen =
            async () => {
                await Promise.all([
                    loadCurrentUser(),
                    loadFeed(),
                ]);
            };

        initialiseScreen();
    }, []);

    /* ======================================================
       RELOAD WHEN RETURNING TO FEED
    ====================================================== */

    useFocusEffect(
        useCallback(() => {
            loadFeed(false);
        }, []),
    );

    /* ======================================================
       PULL TO REFRESH
    ====================================================== */

    const handleRefresh =
        async () => {
            try {
                setRefreshing(true);

                await loadFeed(false);
            } finally {
                setRefreshing(false);
            }
        };

    /* ======================================================
       DELETE ACTIVITY POST
    ====================================================== */

    const handleDeletePost =
        async (
            postId: string,
        ) => {
            try {
                console.log(
                    "Deleting activity post:",
                    postId,
                );

                await deleteActivityPost(
                    postId,
                );

                console.log(
                    "Activity post deleted:",
                    postId,
                );

                /*
                 * Remove it immediately
                 * from the local feed.
                 */
                setFeed(
                    (
                        currentFeed,
                    ) =>
                        currentFeed.filter(
                            (item) =>
                                !(
                                    item.type ===
                                    "activity_post" &&
                                    item.id ===
                                    postId
                                ),
                        ),
                );
            } catch (err: any) {
                console.error(
                    "Delete post failed:",
                    err?.response?.data ??
                    err,
                );

                Alert.alert(
                    "Couldn't Delete Post",
                    err?.response?.data
                        ?.message ||
                    err?.message ||
                    "Something went wrong while deleting your post.",
                );
            }
        };

    /* ======================================================
       FILTER + SEARCH
    ====================================================== */

    const filteredFeed =
        useMemo(() => {
            /*
             * Start with complete feed.
             */
            let result = feed;

            /* -------------------------
               CONTENT TYPE FILTER
            ------------------------- */

            if (
                selectedFilter !==
                "all"
            ) {
                result =
                    result.filter(
                        (item) =>
                            item.type ===
                            selectedFilter,
                    );
            }

            /* -------------------------
               KEYWORD SEARCH
            ------------------------- */

            const query =
                searchText
                    .trim()
                    .toLowerCase();

            /*
             * If nothing has been
             * typed, return normal
             * filtered feed.
             */
            if (!query) {
                return result;
            }

            return result.filter(
                (item) => {
                    /*
                     * These properties already
                     * exist in our FeedItem type.
                     *
                     * We deliberately DON'T use
                     * item.description here,
                     * because description is not
                     * currently declared on your
                     * FeedItem interface.
                     */
                    const searchableText = [
                        item.title,
                        item.content,
                        item.location,
                        item.author_name,

                        /*
                         * We also include type so
                         * searching words such as
                         * event or announcement can
                         * still return results.
                         */
                        item.type,
                    ]
                        .filter(
                            (
                                value,
                            ): value is string =>
                                typeof value ===
                                "string",
                        )
                        .join(" ")
                        .toLowerCase();

                    return searchableText.includes(
                        query,
                    );
                },
            );
        }, [
            feed,
            selectedFilter,
            searchText,
        ]);

    /* ======================================================
       CARD RENDERING
    ====================================================== */

    const renderFeedItem = ({
        item,
    }: {
        item: FeedItem;
    }) => {
        switch (item.type) {
            /* -------------------------
               ANNOUNCEMENT
            ------------------------- */

            case "announcement":
                return (
                    <AnnouncementCard
                        item={item}
                    />
                );

            /* -------------------------
               EVENT
            ------------------------- */

            case "event":
                return (
                    <EventCard
                        item={item}
                        onViewEvent={() =>
                            navigation.navigate(
                                "EventDetails",
                                {
                                    eventId: item.id,
                                    userRole: "junior_ranger",
                                },
                            )
                        }
                    />
                );

            /* -------------------------
               CLUB ACTIVITY
            ------------------------- */

            case "club_activity":
                return (
                    <ClubActivityCard
                        item={item}
                    />
                );

            /* -------------------------
               JUNIOR RANGER POST
            ------------------------- */

            case "activity_post": {
                const isOwner =
                    !!currentUserId &&
                    item.created_by_user_id ===
                    currentUserId;

                return (
                    <ActivityPostCard
                        item={item}
                        isOwner={
                            isOwner
                        }
                        onEdit={() =>
                            navigation.navigate(
                                "ActivityPostForm",
                                {
                                    postId:
                                        item.id,
                                },
                            )
                        }
                        onDelete={() =>
                            handleDeletePost(
                                item.id,
                            )
                        }
                    />
                );
            }

            default:
                return null;
        }
    };

    /* ======================================================
       INITIAL LOADING
    ====================================================== */

    if (loading) {
        return (
            <View
                style={
                    styles.loadingContainer
                }
            >
                <ActivityIndicator
                    size="large"
                    color="#376E62"
                />

                <Text
                    style={
                        styles.loadingText
                    }
                >
                    Loading your feed...
                </Text>
            </View>
        );
    }

    /* ======================================================
       ERROR
    ====================================================== */

    if (
        error &&
        feed.length === 0
    ) {
        return (
            <View
                style={
                    styles.errorContainer
                }
            >
                <Ionicons
                    name="cloud-offline-outline"
                    size={48}
                    color="#777777"
                />

                <Text
                    style={
                        styles.errorTitle
                    }
                >
                    Unable to Load Feed
                </Text>

                <Text
                    style={
                        styles.errorText
                    }
                >
                    {error}
                </Text>

                <TouchableOpacity
                    style={
                        styles.retryButton
                    }
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
            </View>
        );
    }

    /* ======================================================
       SCREEN
    ====================================================== */

    return (
        <View
            style={
                styles.container
            }
        >
            <FlatList
                data={filteredFeed}
                keyExtractor={(
                    item,
                ) =>
                    `${item.type}-${item.id}`
                }
                renderItem={
                    renderFeedItem
                }
                showsVerticalScrollIndicator={
                    false
                }
                keyboardShouldPersistTaps="handled"
                contentContainerStyle={
                    styles.listContent
                }
                refreshControl={
                    <RefreshControl
                        refreshing={
                            refreshing
                        }
                        onRefresh={
                            handleRefresh
                        }
                        tintColor="#376E62"
                    />
                }
                /* ==================================================
                   HEADER
                ================================================== */

                ListHeaderComponent={
                    <>
                        {/* -------------------------
                TITLE
            ------------------------- */}

                        <View
                            style={
                                styles.titleSection
                            }
                        >
                            <Text
                                style={
                                    styles.title
                                }
                            >
                                Social Feed
                            </Text>

                            <Text
                                style={
                                    styles.subtitle
                                }
                            >
                                See what's happening in
                                your club.
                            </Text>
                        </View>

                        {/* -------------------------
                SEARCH BAR
            ------------------------- */}

                        <View
                            style={
                                styles.searchContainer
                            }
                        >
                            <Ionicons
                                name="search-outline"
                                size={21}
                                color="#687C75"
                            />

                            <TextInput
                                style={
                                    styles.searchInput
                                }
                                placeholder="Search the feed..."
                                placeholderTextColor="#8B9692"
                                value={
                                    searchText
                                }
                                onChangeText={
                                    setSearchText
                                }
                                autoCapitalize="none"
                                autoCorrect={
                                    false
                                }
                                returnKeyType="search"
                            />

                            {searchText.length >
                                0 && (
                                    <TouchableOpacity
                                        style={
                                            styles.clearSearchButton
                                        }
                                        onPress={() =>
                                            setSearchText(
                                                "",
                                            )
                                        }
                                    >
                                        <Ionicons
                                            name="close-circle"
                                            size={21}
                                            color="#7B8883"
                                        />
                                    </TouchableOpacity>
                                )}
                        </View>

                        {/* -------------------------
                FILTERS
            ------------------------- */}

                        <View
                            style={
                                styles.filtersContainer
                            }
                        >
                            {filters.map(
                                (filter) => {
                                    const active =
                                        selectedFilter ===
                                        filter.value;

                                    return (
                                        <TouchableOpacity
                                            key={
                                                filter.value
                                            }
                                            style={[
                                                styles.filterButton,

                                                active &&
                                                styles.activeFilterButton,
                                            ]}
                                            onPress={() =>
                                                setSelectedFilter(
                                                    filter.value,
                                                )
                                            }
                                            activeOpacity={
                                                0.8
                                            }
                                        >
                                            <Text
                                                style={[
                                                    styles.filterText,

                                                    active &&
                                                    styles.activeFilterText,
                                                ]}
                                            >
                                                {
                                                    filter.label
                                                }
                                            </Text>
                                        </TouchableOpacity>
                                    );
                                },
                            )}
                        </View>

                        {/* -------------------------
                SHARE POST
            ------------------------- */}

                        <TouchableOpacity
                            style={
                                styles.sharePostCard
                            }
                            onPress={() =>
                                navigation.navigate(
                                    "ActivityPostForm",
                                )
                            }
                            activeOpacity={
                                0.85
                            }
                        >
                            <View
                                style={
                                    styles.sharePostIcon
                                }
                            >
                                <Ionicons
                                    name="add"
                                    size={27}
                                    color="#FFFFFF"
                                />
                            </View>

                            <View
                                style={
                                    styles.sharePostTextContainer
                                }
                            >
                                <Text
                                    style={
                                        styles.sharePostTitle
                                    }
                                >
                                    Share A Post
                                </Text>

                                <Text
                                    style={
                                        styles.sharePostSubtitle
                                    }
                                >
                                    Tell your club about an
                                    activity you've done.
                                </Text>
                            </View>

                            <Ionicons
                                name="chevron-forward"
                                size={22}
                                color="#376E62"
                            />
                        </TouchableOpacity>

                        {/* -------------------------
                SEARCH RESULT LABEL
            ------------------------- */}

                        {searchText.trim() !==
                            "" && (
                                <Text
                                    style={
                                        styles.searchResultText
                                    }
                                >
                                    {filteredFeed.length ===
                                        1
                                        ? `1 result for "${searchText.trim()}"`
                                        : `${filteredFeed.length} results for "${searchText.trim()}"`}
                                </Text>
                            )}
                    </>
                }

                /* ==================================================
                   EMPTY STATE
                ================================================== */

                ListEmptyComponent={
                    <View
                        style={
                            styles.emptyContainer
                        }
                    >
                        <Ionicons
                            name={
                                searchText.trim()
                                    ? "search-outline"
                                    : "leaf-outline"
                            }
                            size={44}
                            color="#8AA59D"
                        />

                        <Text
                            style={
                                styles.emptyTitle
                            }
                        >
                            {searchText.trim()
                                ? "No Results Found"
                                : "Nothing Here Yet"}
                        </Text>

                        <Text
                            style={
                                styles.emptyText
                            }
                        >
                            {searchText.trim()
                                ? `We couldn't find anything matching "${searchText.trim()}".`
                                : "Posts and activities from your club will appear here."}
                        </Text>

                        {searchText.trim() !==
                            "" && (
                                <TouchableOpacity
                                    style={
                                        styles.clearResultsButton
                                    }
                                    onPress={() =>
                                        setSearchText(
                                            "",
                                        )
                                    }
                                >
                                    <Text
                                        style={
                                            styles.clearResultsText
                                        }
                                    >
                                        Clear Search
                                    </Text>
                                </TouchableOpacity>
                            )}
                    </View>
                }
            />
        </View>
    );
}

/* ========================================================
   STYLES
======================================================== */

const styles =
    StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor:
                "#F6F7F5",
        },

        listContent: {
            paddingHorizontal: 16,
            paddingTop: 18,
            paddingBottom: 40,
        },

        /* -------------------------
           LOADING
        ------------------------- */

        loadingContainer: {
            flex: 1,
            justifyContent:
                "center",
            alignItems: "center",
            backgroundColor:
                "#F6F7F5",
        },

        loadingText: {
            marginTop: 12,
            fontSize: 14,
            color: "#666666",
        },

        /* -------------------------
           ERROR
        ------------------------- */

        errorContainer: {
            flex: 1,
            padding: 30,
            justifyContent:
                "center",
            alignItems: "center",
            backgroundColor:
                "#F6F7F5",
        },

        errorTitle: {
            marginTop: 14,
            fontSize: 20,
            fontWeight: "700",
            color: "#333333",
        },

        errorText: {
            marginTop: 8,
            fontSize: 14,
            lineHeight: 20,
            textAlign: "center",
            color: "#777777",
        },

        retryButton: {
            marginTop: 20,
            backgroundColor:
                "#376E62",
            paddingHorizontal: 22,
            paddingVertical: 12,
            borderRadius: 12,
        },

        retryButtonText: {
            color: "#FFFFFF",
            fontSize: 14,
            fontWeight: "700",
        },

        /* -------------------------
           TITLE
        ------------------------- */

        titleSection: {
            marginBottom: 16,
        },

        title: {
            fontSize: 27,
            fontWeight: "800",
            color: "#1F1F1F",
        },

        subtitle: {
            marginTop: 4,
            fontSize: 14,
            color: "#68716E",
        },

        /* -------------------------
           SEARCH
        ------------------------- */

        searchContainer: {
            minHeight: 50,
            flexDirection: "row",
            alignItems: "center",
            backgroundColor:
                "#FFFFFF",
            borderRadius: 15,
            borderWidth: 1,
            borderColor:
                "#D6E0DC",
            paddingHorizontal: 14,
            marginBottom: 15,
        },

        searchInput: {
            flex: 1,
            marginLeft: 9,
            paddingVertical: 11,
            fontSize: 15,
            color: "#1F1F1F",
        },

        clearSearchButton: {
            marginLeft: 5,
            padding: 4,
        },

        /* -------------------------
           FILTERS
        ------------------------- */

        filtersContainer: {
            flexDirection: "row",
            flexWrap: "wrap",
            gap: 8,
            marginBottom: 17,
        },

        filterButton: {
            paddingHorizontal: 13,
            paddingVertical: 8,
            borderRadius: 18,
            backgroundColor:
                "#E7ECEA",
        },

        activeFilterButton: {
            backgroundColor:
                "#376E62",
        },

        filterText: {
            fontSize: 12,
            fontWeight: "600",
            color: "#53605C",
        },

        activeFilterText: {
            color: "#FFFFFF",
        },

        /* -------------------------
           SHARE POST
        ------------------------- */

        sharePostCard: {
            flexDirection: "row",
            alignItems: "center",
            backgroundColor:
                "#E0EFEA",
            borderWidth: 1,
            borderColor:
                "#C2DED5",
            borderRadius: 16,
            padding: 14,
            marginBottom: 18,
        },

        sharePostIcon: {
            width: 43,
            height: 43,
            borderRadius: 22,
            backgroundColor:
                "#376E62",
            justifyContent:
                "center",
            alignItems: "center",
            marginRight: 12,
        },

        sharePostTextContainer: {
            flex: 1,
        },

        sharePostTitle: {
            fontSize: 15,
            fontWeight: "700",
            color: "#214C45",
        },

        sharePostSubtitle: {
            marginTop: 3,
            fontSize: 12,
            lineHeight: 16,
            color: "#60736D",
        },

        /* -------------------------
           SEARCH RESULT
        ------------------------- */

        searchResultText: {
            marginBottom: 12,
            fontSize: 12,
            fontWeight: "600",
            color: "#68716E",
        },

        /* -------------------------
           EMPTY STATE
        ------------------------- */

        emptyContainer: {
            paddingVertical: 50,
            paddingHorizontal: 25,
            alignItems: "center",
        },

        emptyTitle: {
            marginTop: 12,
            fontSize: 18,
            fontWeight: "700",
            color: "#3E4A46",
        },

        emptyText: {
            marginTop: 7,
            fontSize: 13,
            lineHeight: 19,
            color: "#78827F",
            textAlign: "center",
        },

        clearResultsButton: {
            marginTop: 17,
            backgroundColor:
                "#376E62",
            paddingHorizontal: 18,
            paddingVertical: 10,
            borderRadius: 10,
        },

        clearResultsText: {
            color: "#FFFFFF",
            fontSize: 13,
            fontWeight: "700",
        },
    });