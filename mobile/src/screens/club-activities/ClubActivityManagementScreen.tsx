import React, {
    useCallback,
    useMemo,
    useState,
} from "react";

import {
    ActivityIndicator,
    Alert,
    FlatList,
    Image,
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
    ClubActivity,
    deleteClubActivity,
    getClubActivities,
} from "../../services/clubActivities/clubActivityService";

import { AuthStackParamList } from "../../navigation/AuthNavigator";


type NavigationProp =
    NativeStackNavigationProp<
        AuthStackParamList,
        "ClubActivityManagement"
    >;

type RouteProps = RouteProp<
    AuthStackParamList,
    "ClubActivityManagement"
>;


export default function ClubActivityManagementScreen() {
    const navigation =
        useNavigation<NavigationProp>();

    const route = useRoute<RouteProps>();

    const { userRole } = route.params;

    const [activities, setActivities] =
        useState<ClubActivity[]>([]);

    const [loading, setLoading] =
        useState(true);

    const [refreshing, setRefreshing] =
        useState(false);

    const [error, setError] =
        useState<string | null>(null);

    const [searchText, setSearchText] =
        useState("");


    const loadActivities = async (
        showLoader = true,
    ) => {
        try {
            if (showLoader) {
                setLoading(true);
            }

            setError(null);

            const data =
                await getClubActivities();

            setActivities(data);
        } catch (err: any) {
            console.error(
                "Unable to load club activities:",
                err?.response?.data ?? err,
            );

            setError(
                err?.response?.data?.message ||
                "Unable to load club activities.",
            );
        } finally {
            if (showLoader) {
                setLoading(false);
            }
        }
    };


    useFocusEffect(
        useCallback(() => {
            loadActivities();
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


    const confirmDelete = async (
        activityId: string,
    ) => {
        try {
            await deleteClubActivity(
                activityId,
            );

            setActivities(
                (current) =>
                    current.filter(
                        (item) =>
                            item.id !==
                            activityId,
                    ),
            );

            showMessage(
                "Deleted",
                "Club activity deleted successfully.",
            );
        } catch (err: any) {
            console.error(
                "Unable to delete club activity:",
                err?.response?.data ?? err,
            );

            showMessage(
                "Error",
                err?.response?.data?.message ||
                "Unable to delete club activity.",
            );
        }
    };


    const handleDelete = (
        activityId: string,
    ) => {
        if (Platform.OS === "web") {
            const confirmed =
                window.confirm(
                    "Are you sure you want to delete this club activity?",
                );

            if (confirmed) {
                confirmDelete(activityId);
            }

            return;
        }

        Alert.alert(
            "Delete Club Activity?",
            "Are you sure you want to delete this club activity?",
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
                            activityId,
                        ),
                },
            ],
        );
    };


    const handleRefresh = async () => {
        setRefreshing(true);

        await loadActivities(false);

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


    const filteredActivities =
        useMemo(() => {
            const query =
                searchText
                    .trim()
                    .toLowerCase();

            if (!query) {
                return activities;
            }

            return activities.filter(
                (item) => {
                    const searchableText = [
                        item.title,
                        item.description,
                        item.cohort_name,
                        item.author_name,
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
            activities,
            searchText,
        ]);


    const renderActivity = ({
        item,
    }: {
        item: ClubActivity;
    }) => {
        return (
            <View style={styles.card}>

                {item.image_url && (
                    <Image
                        source={{
                            uri: item.image_url,
                        }}
                        style={styles.activityImage}
                        resizeMode="cover"
                    />
                )}

                <View style={styles.cardBody}>
                    <View style={styles.cardHeader}>
                        <View
                            style={
                                styles.titleContainer
                            }
                        >
                            <Ionicons
                                name="leaf-outline"
                                size={20}
                                color="#2F6F61"
                                style={{
                                    marginRight: 7,
                                }}
                            />

                            <Text
                                style={
                                    styles.cardTitle
                                }
                                numberOfLines={2}
                            >
                                {item.title}
                            </Text>
                        </View>
                    </View>


                    {item.description && (
                        <Text
                            style={
                                styles.cardContent
                            }
                            numberOfLines={3}
                        >
                            {item.description}
                        </Text>
                    )}


                    <View
                        style={
                            styles.metaSection
                        }
                    >
                        <View
                            style={styles.metaRow}
                        >
                            <Ionicons
                                name="people-outline"
                                size={16}
                                color="#60736D"
                            />

                            <Text
                                style={
                                    styles.metaText
                                }
                            >
                                {item.cohort_name}
                            </Text>
                        </View>


                        <View
                            style={styles.metaRow}
                        >
                            <Ionicons
                                name="person-outline"
                                size={16}
                                color="#60736D"
                            />

                            <Text
                                style={
                                    styles.metaText
                                }
                            >
                                {item.author_name}
                            </Text>
                        </View>


                        {item.activity_date && (
                            <View
                                style={
                                    styles.metaRow
                                }
                            >
                                <Ionicons
                                    name="calendar-outline"
                                    size={16}
                                    color="#60736D"
                                />

                                <Text
                                    style={
                                        styles.metaText
                                    }
                                >
                                    Activity:{" "}
                                    {formatDate(
                                        item.activity_date,
                                    )}
                                </Text>
                            </View>
                        )}


                        <View
                            style={styles.metaRow}
                        >
                            <Ionicons
                                name="time-outline"
                                size={16}
                                color="#60736D"
                            />

                            <Text
                                style={
                                    styles.metaText
                                }
                            >
                                Created:{" "}
                                {formatDate(
                                    item.created_at,
                                )}
                            </Text>
                        </View>
                    </View>


                    <View
                        style={styles.actionRow}
                    >
                        <TouchableOpacity
                            style={[
                                styles.actionButton,
                                styles.editButton,
                            ]}
                            onPress={() =>
                                navigation.navigate(
                                    "ClubActivityForm",
                                    {
                                        userRole,
                                        activityId:
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
            </View>
        );
    };


    if (loading) {
        return (
            <View
                style={
                    styles.centerContainer
                }
            >
                <ActivityIndicator
                    size="large"
                    color="#2F6F61"
                />

                <Text
                    style={
                        styles.loadingText
                    }
                >
                    Loading club activities...
                </Text>
            </View>
        );
    }


    return (
        <View style={styles.container}>
            <FlatList
                data={filteredActivities}
                keyExtractor={(item) =>
                    item.id
                }
                renderItem={renderActivity}
                contentContainerStyle={[
                    styles.listContent,
                    activities.length ===
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
                        <View
                            style={
                                styles.headerSection
                            }
                        >
                            <View
                                style={
                                    styles.headerText
                                }
                            >
                                <Text
                                    style={
                                        styles.heading
                                    }
                                >
                                    Club Activities
                                </Text>

                                <Text
                                    style={
                                        styles.subtitle
                                    }
                                >
                                    Create and manage club activities for your cohorts.
                                </Text>
                            </View>

                            <TouchableOpacity
                                style={
                                    styles.createButton
                                }
                                activeOpacity={
                                    0.85
                                }
                                onPress={() =>
                                    navigation.navigate(
                                        "ClubActivityForm",
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

                                <Text
                                    style={
                                        styles.createButtonText
                                    }
                                >
                                    Create
                                </Text>
                            </TouchableOpacity>
                        </View>


                        <View
                            style={
                                styles.filterSection
                            }
                        >
                            <View
                                style={
                                    styles.searchContainer
                                }
                            >
                                <Ionicons
                                    name="search-outline"
                                    size={20}
                                    color="#687C75"
                                />

                                <TextInput
                                    value={
                                        searchText
                                    }
                                    onChangeText={
                                        setSearchText
                                    }
                                    placeholder="Search club activities..."
                                    placeholderTextColor="#98A39F"
                                    style={
                                        styles.searchInput
                                    }
                                />

                                {!!searchText && (
                                    <TouchableOpacity
                                        onPress={() =>
                                            setSearchText(
                                                "",
                                            )
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

                            <Text
                                style={
                                    styles.resultCount
                                }
                            >
                                {
                                    filteredActivities.length
                                }{" "}
                                {filteredActivities.length ===
                                    1
                                    ? "club activity"
                                    : "club activities"}
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
                            name="leaf-outline"
                            size={56}
                            color="#9AA8A3"
                        />

                        <Text
                            style={
                                styles.emptyTitle
                            }
                        >
                            {activities.length ===
                                0
                                ? "No club activities yet"
                                : "No matching club activities"}
                        </Text>

                        <Text
                            style={
                                styles.emptyText
                            }
                        >
                            {activities.length ===
                                0
                                ? "Create a club activity to share with your cohort."
                                : "Try changing your search."}
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
                                    loadActivities()
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


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#F5F8F7",
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
        backgroundColor: "#2F6F61",
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
        backgroundColor: "#FFFFFF",
        borderRadius: 14,
        marginBottom: 14,
        overflow: "hidden",

        shadowColor: "#000",
        shadowOpacity: 0.06,
        shadowRadius: 7,
        elevation: 2,

        borderWidth: 1,
        borderColor: "#E4ECE9",
    },

    activityImage: {
        width: "100%",
        height: 180,
        backgroundColor: "#E7EFEC",
    },

    cardBody: {
        padding: 16,
    },

    cardHeader: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
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

    metaSection: {
        marginTop: 14,
        paddingTop: 12,
        borderTopWidth: 1,
        borderTopColor: "#EDF2F0",
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

    deleteButton: {
        backgroundColor: "#FFF5F4",
        borderColor: "#F5C7C2",
    },

    deleteButtonText: {
        color: "#B42318",
        fontSize: 13,
        fontWeight: "700",
    },

    centerContainer: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#F5F8F7",
    },

    loadingText: {
        marginTop: 12,
        fontSize: 14,
        color: "#687C75",
    },

    emptyContainer: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
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

    resultCount: {
        fontSize: 12,
        color: "#71807B",
        marginTop: 10,
    },
});