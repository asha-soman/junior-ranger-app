import React, {
    useCallback,
    useMemo,
    useState,
} from "react";

import {
    ActivityIndicator,
    Alert,
    FlatList,
    Platform,
    RefreshControl,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";

import {
    RouteProp,
    useFocusEffect,
    useNavigation,
    useRoute,
} from "@react-navigation/native";

import { NativeStackNavigationProp } from "@react-navigation/native-stack";

import {
    Announcement,
    archiveAnnouncement,
    deleteAnnouncement,
    getAnnouncements,
    publishAnnouncement,
} from "../../services/announcements/announcementService";

import { AuthStackParamList } from "../../navigation/AuthNavigator";

type NavigationProp =
    NativeStackNavigationProp<
        AuthStackParamList,
        "AnnouncementManagement"
    >;

type RouteProps = RouteProp<
    AuthStackParamList,
    "AnnouncementManagement"
>;

export default function AnnouncementManagementScreen() {
    const navigation =
        useNavigation<NavigationProp>();

    const route = useRoute<RouteProps>();

    const { userRole } = route.params;

    const [announcements, setAnnouncements] =
        useState<Announcement[]>([]);

    const [loading, setLoading] =
        useState(true);

    const [refreshing, setRefreshing] =
        useState(false);

    const [error, setError] =
        useState<string | null>(null);

    type StatusFilter =
        | "all"
        | "draft"
        | "published"
        | "archived";

    const [searchText, setSearchText] =
        useState("");

    const [statusFilter, setStatusFilter] =
        useState<StatusFilter>("all");

    const [highPriorityOnly, setHighPriorityOnly] =
        useState(false);

    const loadAnnouncements = async (
        showLoader = true,
    ) => {
        try {
            if (showLoader) {
                setLoading(true);
            }

            setError(null);

            const data =
                await getAnnouncements();

            setAnnouncements(data);
        } catch (err: any) {
            console.error(
                "Unable to load announcements:",
                err?.response?.data ?? err,
            );

            setError(
                err?.response?.data?.message ||
                "Unable to load announcements.",
            );
        } finally {
            if (showLoader) {
                setLoading(false);
            }
        }
    };

    useFocusEffect(
        useCallback(() => {
            loadAnnouncements();
        }, []),
    );

    const showMessage = (
        title: string,
        message: string,
    ) => {
        if (Platform.OS === "web") {
            window.alert(message);
            return;
        }

        Alert.alert(title, message);
    };

    const handlePublish = async (
        announcementId: string,
    ) => {
        try {
            await publishAnnouncement(
                announcementId,
            );

            showMessage(
                "Published",
                "Announcement published successfully.",
            );

            await loadAnnouncements(false);
        } catch (err: any) {
            console.error(
                "Unable to publish announcement:",
                err?.response?.data ?? err,
            );

            showMessage(
                "Error",
                err?.response?.data?.message ||
                "Unable to publish announcement.",
            );
        }
    };

    const handleArchive = async (
        announcementId: string,
    ) => {
        try {
            await archiveAnnouncement(
                announcementId,
            );

            showMessage(
                "Archived",
                "Announcement archived successfully.",
            );

            await loadAnnouncements(false);
        } catch (err: any) {
            console.error(
                "Unable to archive announcement:",
                err?.response?.data ?? err,
            );

            showMessage(
                "Error",
                err?.response?.data?.message ||
                "Unable to archive announcement.",
            );
        }
    };

    const confirmDelete = async (
        announcementId: string,
    ) => {
        try {
            await deleteAnnouncement(
                announcementId,
            );

            setAnnouncements(
                (current) =>
                    current.filter(
                        (item) =>
                            item.id !==
                            announcementId,
                    ),
            );

            showMessage(
                "Deleted",
                "Announcement deleted successfully.",
            );
        } catch (err: any) {
            console.error(
                "Unable to delete announcement:",
                err?.response?.data ?? err,
            );

            showMessage(
                "Error",
                err?.response?.data?.message ||
                "Unable to delete announcement.",
            );
        }
    };

    const handleDelete = (
        announcementId: string,
    ) => {
        if (Platform.OS === "web") {
            const confirmed =
                window.confirm(
                    "Are you sure you want to delete this announcement?",
                );

            if (confirmed) {
                confirmDelete(
                    announcementId,
                );
            }

            return;
        }

        Alert.alert(
            "Delete Announcement?",
            "Are you sure you want to delete this announcement?",
            [
                {
                    text: "Cancel",
                    style: "cancel",
                },
                {
                    text: "Delete",
                    style: "destructive",
                    onPress: () =>
                        confirmDelete(
                            announcementId,
                        ),
                },
            ],
        );
    };

    const handleRefresh = async () => {
        setRefreshing(true);

        await loadAnnouncements(false);

        setRefreshing(false);
    };

    const formatDate = (
        dateValue: string | null,
    ) => {
        if (!dateValue) {
            return "";
        }

        return new Date(
            dateValue,
        ).toLocaleDateString("en-AU", {
            day: "numeric",
            month: "short",
            year: "numeric",
        });
    };

    const filteredAnnouncements =
        useMemo(() => {
            let result =
                announcements;

            if (
                statusFilter !== "all"
            ) {
                result = result.filter(
                    (item) =>
                        item.status ===
                        statusFilter,
                );
            }

            if (highPriorityOnly) {
                result = result.filter(
                    (item) =>
                        item.priority ===
                        "high",
                );
            }

            const query =
                searchText
                    .trim()
                    .toLowerCase();

            if (!query) {
                return result;
            }

            return result.filter(
                (item) => {
                    const searchableText = [
                        item.title,
                        item.content,
                        item.cohort_name,
                        item.author_name,
                        item.status,
                        item.priority,
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
            announcements,
            searchText,
            statusFilter,
            highPriorityOnly,
        ]);

    const renderAnnouncement = ({
        item,
    }: {
        item: Announcement;
    }) => {
        const statusLabel =
            item.status.charAt(0).toUpperCase() +
            item.status.slice(1);

        return (
            <View style={styles.card}>
                <View style={styles.cardHeader}>
                    <View style={styles.titleContainer}>
                        {item.is_pinned && (
                            <Ionicons
                                name="pin"
                                size={18}
                                color="#C46D20"
                                style={{
                                    marginRight: 6,
                                }}
                            />
                        )}

                        <Text
                            style={styles.cardTitle}
                            numberOfLines={2}
                        >
                            {item.title}
                        </Text>
                    </View>

                    <Ionicons
                        name="chevron-forward"
                        size={22}
                        color="#60736D"
                    />
                </View>


                <Text
                    style={styles.cardContent}
                    numberOfLines={3}
                >
                    {item.content}
                </Text>

                <View style={styles.badgeRow}>
                    <View
                        style={[
                            styles.badge,
                            item.status ===
                                "published"
                                ? styles.publishedBadge
                                : item.status ===
                                    "archived"
                                    ? styles.archivedBadge
                                    : styles.draftBadge,
                        ]}
                    >
                        <Text
                            style={styles.badgeText}
                        >
                            {statusLabel}
                        </Text>
                    </View>

                    {item.priority ===
                        "high" && (
                            <View
                                style={[
                                    styles.badge,
                                    styles.priorityBadge,
                                ]}
                            >
                                <Ionicons
                                    name="alert-circle-outline"
                                    size={14}
                                    color="#9A3412"
                                />

                                <Text
                                    style={[
                                        styles.badgeText,
                                        {
                                            color:
                                                "#9A3412",
                                        },
                                    ]}
                                >
                                    High Priority
                                </Text>
                            </View>
                        )}
                </View>

                <View style={styles.metaSection}>
                    <View style={styles.metaRow}>
                        <Ionicons
                            name="people-outline"
                            size={16}
                            color="#60736D"
                        />

                        <Text style={styles.metaText}>
                            {item.cohort_name}
                        </Text>
                    </View>

                    <View style={styles.metaRow}>
                        <Ionicons
                            name="person-outline"
                            size={16}
                            color="#60736D"
                        />

                        <Text style={styles.metaText}>
                            {item.author_name}
                        </Text>
                    </View>

                    <View style={styles.metaRow}>
                        <Ionicons
                            name="calendar-outline"
                            size={16}
                            color="#60736D"
                        />

                        <Text style={styles.metaText}>
                            {formatDate(
                                item.created_at,
                            )}
                        </Text>
                    </View>
                </View>

                <View style={styles.actionRow}>
                    <TouchableOpacity
                        style={[
                            styles.actionButton,
                            styles.editButton,
                        ]}
                        onPress={() =>
                            navigation.navigate(
                                "AnnouncementForm",
                                {
                                    userRole,
                                    announcementId:
                                        item.id,
                                    cohortId:
                                        item.cohort_id,
                                },
                            )
                        }
                    >
                        <Ionicons
                            name="create-outline"
                            size={17}
                            color="#2F6F61"
                        />

                        <Text
                            style={
                                styles.editButtonText
                            }
                        >
                            Edit
                        </Text>
                    </TouchableOpacity>

                    {item.status ===
                        "draft" && (
                            <TouchableOpacity
                                style={[
                                    styles.actionButton,
                                    styles.publishButton,
                                ]}
                                onPress={() =>
                                    handlePublish(
                                        item.id,
                                    )
                                }
                            >
                                <Ionicons
                                    name="send-outline"
                                    size={17}
                                    color="#FFFFFF"
                                />

                                <Text
                                    style={
                                        styles.primaryActionText
                                    }
                                >
                                    Publish
                                </Text>
                            </TouchableOpacity>
                        )}

                    {item.status ===
                        "published" && (
                            <TouchableOpacity
                                style={[
                                    styles.actionButton,
                                    styles.archiveButton,
                                ]}
                                onPress={() =>
                                    handleArchive(
                                        item.id,
                                    )
                                }
                            >
                                <Ionicons
                                    name="archive-outline"
                                    size={17}
                                    color="#73510D"
                                />

                                <Text
                                    style={
                                        styles.archiveButtonText
                                    }
                                >
                                    Archive
                                </Text>
                            </TouchableOpacity>
                        )}

                    <TouchableOpacity
                        style={[
                            styles.actionButton,
                            styles.deleteButton,
                        ]}
                        onPress={() =>
                            handleDelete(
                                item.id,
                            )
                        }
                    >
                        <Ionicons
                            name="trash-outline"
                            size={17}
                            color="#B42318"
                        />

                        <Text
                            style={
                                styles.deleteButtonText
                            }
                        >
                            Delete
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    };

    if (loading) {
        return (
            <View
                style={styles.centerContainer}
            >
                <ActivityIndicator
                    size="large"
                    color="#2F6F61"
                />

                <Text
                    style={styles.loadingText}
                >
                    Loading announcements...
                </Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <FlatList
                data={filteredAnnouncements}
                keyExtractor={(item) =>
                    item.id
                }
                renderItem={
                    renderAnnouncement
                }
                contentContainerStyle={[
                    styles.listContent,
                    announcements.length ===
                    0 &&
                    styles.emptyListContent,
                ]}
                refreshControl={
                    <RefreshControl
                        refreshing={
                            refreshing
                        }
                        onRefresh={
                            handleRefresh
                        }
                    />
                }
                ListHeaderComponent={
                    <View>
                        <View style={styles.headerSection}>
                            <View style={styles.headerText}>
                                <Text style={styles.heading}>
                                    Announcements
                                </Text>

                                <Text style={styles.subtitle}>
                                    Create and manage announcements for your cohorts.
                                </Text>
                            </View>

                            <TouchableOpacity
                                style={styles.createButton}
                                activeOpacity={0.85}
                                onPress={() =>
                                    navigation.navigate(
                                        "AnnouncementForm",
                                        {
                                            userRole,
                                        },
                                    )
                                }
                            >
                                <Ionicons
                                    name="add"
                                    size={22}
                                    color="#FFFFFF"
                                />

                                <Text style={styles.createButtonText}>
                                    Create
                                </Text>
                            </TouchableOpacity>
                        </View>

                        <View style={styles.filterSection}>
                            <View style={styles.searchContainer}>
                                <Ionicons
                                    name="search-outline"
                                    size={20}
                                    color="#687C75"
                                />

                                <TextInput
                                    value={searchText}
                                    onChangeText={setSearchText}
                                    placeholder="Search announcements..."
                                    placeholderTextColor="#98A39F"
                                    style={styles.searchInput}
                                />

                                {!!searchText && (
                                    <TouchableOpacity
                                        onPress={() =>
                                            setSearchText("")
                                        }
                                    >
                                        <Ionicons
                                            name="close-circle"
                                            size={20}
                                            color="#87958F"
                                        />
                                    </TouchableOpacity>
                                )}
                            </View>

                            <View style={styles.filterRow}>
                                {(
                                    [
                                        "all",
                                        "published",
                                        "draft",
                                        "archived",
                                    ] as StatusFilter[]
                                ).map((filter) => (
                                    <TouchableOpacity
                                        key={filter}
                                        style={[
                                            styles.filterChip,
                                            statusFilter === filter &&
                                            styles.filterChipActive,
                                        ]}
                                        onPress={() =>
                                            setStatusFilter(filter)
                                        }
                                    >
                                        <Text
                                            style={[
                                                styles.filterChipText,
                                                statusFilter === filter &&
                                                styles.filterChipTextActive,
                                            ]}
                                        >
                                            {filter === "all"
                                                ? "All"
                                                : filter
                                                    .charAt(0)
                                                    .toUpperCase() +
                                                filter.slice(1)}
                                        </Text>
                                    </TouchableOpacity>
                                ))}

                                <TouchableOpacity
                                    style={[
                                        styles.priorityFilter,
                                        highPriorityOnly &&
                                        styles.priorityFilterActive,
                                    ]}
                                    onPress={() =>
                                        setHighPriorityOnly(
                                            (current) => !current,
                                        )
                                    }
                                >
                                    <Ionicons
                                        name="alert-circle-outline"
                                        size={17}
                                        color={
                                            highPriorityOnly
                                                ? "#FFFFFF"
                                                : "#9A3412"
                                        }
                                    />

                                    <Text
                                        style={[
                                            styles.priorityFilterText,
                                            highPriorityOnly &&
                                            styles.priorityFilterTextActive,
                                        ]}
                                    >
                                        High Priority
                                    </Text>
                                </TouchableOpacity>
                            </View>

                            <Text style={styles.resultCount}>
                                {filteredAnnouncements.length}{" "}
                                {filteredAnnouncements.length === 1
                                    ? "announcement"
                                    : "announcements"}
                            </Text>
                        </View>
                    </View>
                }

                ListEmptyComponent={
                    <View
                        style={
                            styles.emptyContainer
                        }
                    >
                        <Ionicons
                            name="megaphone-outline"
                            size={56}
                            color="#9AA8A3"
                        />

                        <Text style={styles.emptyTitle}>
                            {announcements.length === 0
                                ? "No announcements yet"
                                : "No matching announcements"}
                        </Text>

                        <Text style={styles.emptyText}>
                            {announcements.length === 0
                                ? "Create an announcement to share information with your cohort."
                                : "Try changing your search or filters."}
                        </Text>
                    </View>
                }
                ListFooterComponent={
                    error ? (
                        <View
                            style={
                                styles.errorContainer
                            }
                        >
                            <Text
                                style={
                                    styles.errorText
                                }
                            >
                                {error}
                            </Text>

                            <TouchableOpacity
                                onPress={() =>
                                    loadAnnouncements()
                                }
                            >
                                <Text
                                    style={
                                        styles.retryText
                                    }
                                >
                                    Try Again
                                </Text>
                            </TouchableOpacity>
                        </View>
                    ) : null
                }
            />
        </View>
    );
}

const styles =
    StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor:
                "#F5F8F7",
        },

        listContent: {
            padding: 16,
            paddingBottom: 40,
        },

        emptyListContent: {
            flexGrow: 1,
        },

        headerSection: {
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: 18,
        },

        headerText: {
            flex: 1,
            marginRight: 16,
        },

        heading: {
            fontSize: 26,
            fontWeight: "800",
            color: "#1D312B",
        },

        subtitle: {
            fontSize: 14,
            color: "#687C75",
            marginTop: 4,
            maxWidth: 230,
            lineHeight: 19,
        },

        createButton: {
            flexDirection: "row",
            alignItems: "center",
            backgroundColor:
                "#2F6F61",
            paddingHorizontal: 15,
            paddingVertical: 11,
            borderRadius: 10,
            gap: 5,
        },

        createButtonText: {
            color: "#FFFFFF",
            fontSize: 14,
            fontWeight: "700",
        },

        card: {
            backgroundColor:
                "#FFFFFF",
            borderRadius: 14,
            padding: 16,
            marginBottom: 14,

            shadowColor: "#000",
            shadowOpacity: 0.06,
            shadowRadius: 7,
            elevation: 2,

            borderWidth: 1,
            borderColor:
                "#E4ECE9",
        },

        cardHeader: {
            flexDirection: "row",
            alignItems: "center",
            justifyContent:
                "space-between",
        },

        titleContainer: {
            flex: 1,
            flexDirection: "row",
            alignItems: "center",
            marginRight: 10,
        },

        cardTitle: {
            flex: 1,
            fontSize: 18,
            fontWeight: "700",
            color: "#1F302B",
        },

        cardContent: {
            fontSize: 14,
            color: "#53645E",
            lineHeight: 20,
            marginTop: 10,
        },

        badgeRow: {
            flexDirection: "row",
            flexWrap: "wrap",
            gap: 8,
            marginTop: 13,
        },

        badge: {
            flexDirection: "row",
            alignItems: "center",
            borderRadius: 20,
            paddingHorizontal: 10,
            paddingVertical: 5,
            gap: 4,
        },

        publishedBadge: {
            backgroundColor:
                "#DDF2E8",
        },

        draftBadge: {
            backgroundColor:
                "#FFF1C9",
        },

        archivedBadge: {
            backgroundColor:
                "#E6E9E8",
        },

        priorityBadge: {
            backgroundColor:
                "#FEE2D5",
        },

        badgeText: {
            fontSize: 12,
            fontWeight: "700",
            color: "#345048",
        },

        metaSection: {
            marginTop: 14,
            paddingTop: 12,
            borderTopWidth: 1,
            borderTopColor:
                "#EDF2F0",
            gap: 7,
        },

        metaRow: {
            flexDirection: "row",
            alignItems: "center",
            gap: 7,
        },

        metaText: {
            fontSize: 13,
            color: "#687C75",
        },

        centerContainer: {
            flex: 1,
            alignItems: "center",
            justifyContent:
                "center",
            backgroundColor:
                "#F5F8F7",
        },

        loadingText: {
            marginTop: 12,
            fontSize: 14,
            color: "#687C75",
        },

        emptyContainer: {
            flex: 1,
            alignItems: "center",
            justifyContent:
                "center",
            paddingVertical: 70,
        },

        emptyTitle: {
            fontSize: 19,
            fontWeight: "700",
            color: "#344B44",
            marginTop: 14,
        },

        emptyText: {
            fontSize: 14,
            color: "#75847F",
            textAlign: "center",
            lineHeight: 20,
            marginTop: 6,
            maxWidth: 280,
        },

        errorContainer: {
            alignItems: "center",
            marginTop: 18,
            padding: 16,
        },

        errorText: {
            fontSize: 14,
            color: "#B42318",
            textAlign: "center",
        },

        retryText: {
            marginTop: 8,
            fontSize: 14,
            fontWeight: "700",
            color: "#2F6F61",
        },
        actionRow: {
            flexDirection: "row",
            flexWrap: "wrap",
            gap: 8,
            marginTop: 14,
        },

        actionButton: {
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            gap: 5,
            paddingHorizontal: 12,
            paddingVertical: 9,
            borderRadius: 9,
            borderWidth: 1,
        },

        editButton: {
            backgroundColor: "#FFFFFF",
            borderColor: "#2F6F61",
        },

        editButtonText: {
            color: "#2F6F61",
            fontSize: 13,
            fontWeight: "700",
        },

        publishButton: {
            backgroundColor: "#2F6F61",
            borderColor: "#2F6F61",
        },

        primaryActionText: {
            color: "#FFFFFF",
            fontSize: 13,
            fontWeight: "700",
        },

        archiveButton: {
            backgroundColor: "#FFF4D6",
            borderColor: "#E6C86E",
        },

        archiveButtonText: {
            color: "#73510D",
            fontSize: 13,
            fontWeight: "700",
        },

        deleteButton: {
            backgroundColor: "#FFF5F4",
            borderColor: "#F5C7C2",
        },

        deleteButtonText: {
            color: "#B42318",
            fontSize: 13,
            fontWeight: "700",
        },
        filterSection: {
            marginBottom: 20,
        },

        searchContainer: {
            flexDirection: "row",
            alignItems: "center",
            backgroundColor: "#FFFFFF",
            borderWidth: 1,
            borderColor: "#D8E3DF",
            borderRadius: 11,
            paddingHorizontal: 12,
            minHeight: 46,
            width: "100%",
        },

        searchInput: {
            flex: 1,
            marginLeft: 8,
            fontSize: 14,
            color: "#1F302B",
        },

        filterRow: {
            flexDirection: "row",
            flexWrap: "wrap",
            alignItems: "center",
            gap: 8,
            marginTop: 12,
        },

        filterChip: {
            paddingHorizontal: 13,
            paddingVertical: 8,
            borderRadius: 20,
            borderWidth: 1,
            borderColor: "#BED2CC",
            backgroundColor: "#FFFFFF",
        },

        filterChipActive: {
            backgroundColor: "#2F6F61",
            borderColor: "#2F6F61",
        },

        filterChipText: {
            fontSize: 13,
            fontWeight: "600",
            color: "#426057",
        },

        filterChipTextActive: {
            color: "#FFFFFF",
        },

        priorityFilter: {
            flexDirection: "row",
            alignItems: "center",
            gap: 6,
            paddingHorizontal: 13,
            paddingVertical: 8,
            borderRadius: 20,
            borderWidth: 1,
            borderColor: "#F0C6B2",
            backgroundColor: "#FFF7F2",
        },

        priorityFilterActive: {
            backgroundColor: "#9A3412",
            borderColor: "#9A3412",
        },

        priorityFilterText: {
            fontSize: 13,
            fontWeight: "700",
            color: "#9A3412",
        },

        priorityFilterTextActive: {
            color: "#FFFFFF",
        },

        resultCount: {
            fontSize: 12,
            color: "#71807B",
            marginTop: 10,
        },
    });