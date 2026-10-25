import React, {
    useEffect,
    useState,
} from "react";

import {
    ActivityIndicator,
    Alert,
    Platform,
    ScrollView,
    StyleSheet,
    Switch,
    Text,
    TextInput,
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

import {
    createAnnouncement,
    getAnnouncementById,
    updateAnnouncement,
} from "../../services/announcements/announcementService";

import {
    getCohorts,
} from "../../services/cohorts/cohortService";

type NavigationProp =
    NativeStackNavigationProp<
        AuthStackParamList,
        "AnnouncementForm"
    >;

type RouteProps = RouteProp<
    AuthStackParamList,
    "AnnouncementForm"
>;

type CohortOption = {
    id: string;
    name: string;
};

export default function AnnouncementFormScreen() {
    const navigation =
        useNavigation<NavigationProp>();

    const route =
        useRoute<RouteProps>();

    const userRole =
        route.params?.userRole;

    const announcementId =
        route.params?.announcementId;

    const routeCohortId =
        route.params?.cohortId;

    const isEditMode =
        !!announcementId;

    const [title, setTitle] =
        useState("");

    const [content, setContent] =
        useState("");

    const [cohorts, setCohorts] =
        useState<CohortOption[]>([]);

    const [selectedCohortId, setSelectedCohortId] =
        useState("");

    const [status, setStatus] =
        useState<"draft" | "published">(
            "published",
        );

    const [priority, setPriority] =
        useState<"normal" | "high">(
            "normal",
        );

    const [isPinned, setIsPinned] =
        useState(false);

    const [loading, setLoading] =
        useState(true);

    const [saving, setSaving] =
        useState(false);

    const [cohortMenuVisible, setCohortMenuVisible] =
        useState(false);

    useEffect(() => {
        initialiseScreen();
    }, []);

    const initialiseScreen = async () => {
        try {
            setLoading(true);

            const cohortData =
                await getCohorts();

            const mappedCohorts =
                cohortData.map((cohort: any) => ({
                    id: cohort.id,
                    name: cohort.name,
                }));

            setCohorts(mappedCohorts);

            if (routeCohortId) {
                setSelectedCohortId(
                    routeCohortId,
                );
            } else if (
                mappedCohorts.length === 1
            ) {
                setSelectedCohortId(
                    mappedCohorts[0].id,
                );
            }

            if (
                isEditMode &&
                announcementId
            ) {
                const announcement =
                    await getAnnouncementById(
                        announcementId,
                    );

                setTitle(
                    announcement.title,
                );

                setContent(
                    announcement.content,
                );

                setSelectedCohortId(
                    announcement.cohort_id,
                );

                if (
                    announcement.status ===
                    "draft" ||
                    announcement.status ===
                    "published"
                ) {
                    setStatus(
                        announcement.status,
                    );
                }

                setPriority(
                    announcement.priority,
                );

                setIsPinned(
                    announcement.is_pinned,
                );
            }
        } catch (err: any) {
            console.error(
                "Unable to initialise announcement form:",
                err?.response?.data ?? err,
            );

            showMessage(
                "Error",
                err?.response?.data?.message ||
                "Unable to load announcement form.",
            );
        } finally {
            setLoading(false);
        }
    };

    const showMessage = (
        title: string,
        message: string,
        goBack = false,
    ) => {
        if (Platform.OS === "web") {
            window.alert(message);

            if (goBack) {
                navigation.goBack();
            }

            return;
        }

        Alert.alert(
            title,
            message,
            [
                {
                    text: "OK",
                    onPress: () => {
                        if (goBack) {
                            navigation.goBack();
                        }
                    },
                },
            ],
        );
    };

    const handleSave = async () => {
        const trimmedTitle =
            title.trim();

        const trimmedContent =
            content.trim();

        if (!trimmedTitle) {
            showMessage(
                "Missing Title",
                "Please enter an announcement title.",
            );

            return;
        }

        if (!trimmedContent) {
            showMessage(
                "Missing Content",
                "Please enter announcement content.",
            );

            return;
        }

        if (!selectedCohortId) {
            showMessage(
                "Missing Cohort",
                "Please select a cohort.",
            );

            return;
        }

        try {
            setSaving(true);

            const payload = {
                title: trimmedTitle,
                content: trimmedContent,
                cohort_id:
                    selectedCohortId,
                status,
                priority,
                is_pinned:
                    isPinned,
            };

            if (
                isEditMode &&
                announcementId
            ) {
                await updateAnnouncement(
                    announcementId,
                    payload,
                );

                showMessage(
                    "Updated",
                    "Announcement updated successfully.",
                    true,
                );
            } else {
                await createAnnouncement(
                    payload,
                );

                showMessage(
                    "Created",
                    "Announcement created successfully.",
                    true,
                );
            }
        } catch (err: any) {
            console.error(
                "Unable to save announcement:",
                err?.response?.data ?? err,
            );

            showMessage(
                "Error",
                err?.response?.data?.message ||
                "Unable to save announcement.",
            );
        } finally {
            setSaving(false);
        }
    };

    const selectedCohort =
        cohorts.find(
            (cohort) =>
                cohort.id ===
                selectedCohortId,
        );

    if (loading) {
        return (
            <View
                style={
                    styles.loadingContainer
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
                    Loading announcement...
                </Text>
            </View>
        );
    }

    return (
        <ScrollView
            style={styles.container}
            contentContainerStyle={
                styles.contentContainer
            }
            keyboardShouldPersistTaps="handled"
        >
            <Text
                style={styles.heading}
            >
                {isEditMode
                    ? "Edit Announcement"
                    : "Create Announcement"}
            </Text>

            <Text
                style={styles.subtitle}
            >
                Share important updates
                with Junior Rangers in
                your cohort.
            </Text>

            <View
                style={styles.fieldGroup}
            >
                <Text
                    style={styles.label}
                >
                    Title
                </Text>

                <TextInput
                    value={title}
                    onChangeText={setTitle}
                    placeholder="Enter announcement title"
                    placeholderTextColor="#98A39F"
                    style={styles.input}
                    maxLength={255}
                />
            </View>

            <View
                style={styles.fieldGroup}
            >
                <Text
                    style={styles.label}
                >
                    Content
                </Text>

                <TextInput
                    value={content}
                    onChangeText={setContent}
                    placeholder="Write your announcement..."
                    placeholderTextColor="#98A39F"
                    style={[
                        styles.input,
                        styles.contentInput,
                    ]}
                    multiline
                    textAlignVertical="top"
                />
            </View>

            <View
                style={styles.fieldGroup}
            >
                <Text
                    style={styles.label}
                >
                    Cohort
                </Text>

                <TouchableOpacity
                    style={styles.selector}
                    activeOpacity={0.8}
                    onPress={() =>
                        setCohortMenuVisible(
                            (current) =>
                                !current,
                        )
                    }
                >
                    <Text
                        style={[
                            styles.selectorText,
                            !selectedCohort &&
                            styles.placeholderText,
                        ]}
                    >
                        {selectedCohort
                            ? selectedCohort.name
                            : "Select a cohort"}
                    </Text>

                    <Ionicons
                        name={
                            cohortMenuVisible
                                ? "chevron-up"
                                : "chevron-down"
                        }
                        size={20}
                        color="#2F6F61"
                    />
                </TouchableOpacity>

                {cohortMenuVisible && (
                    <View
                        style={
                            styles.dropdown
                        }
                    >
                        {cohorts.map(
                            (cohort) => (
                                <TouchableOpacity
                                    key={
                                        cohort.id
                                    }
                                    style={
                                        styles.dropdownItem
                                    }
                                    onPress={() => {
                                        setSelectedCohortId(
                                            cohort.id,
                                        );

                                        setCohortMenuVisible(
                                            false,
                                        );
                                    }}
                                >
                                    <Text
                                        style={
                                            styles.dropdownText
                                        }
                                    >
                                        {
                                            cohort.name
                                        }
                                    </Text>

                                    {selectedCohortId ===
                                        cohort.id && (
                                            <Ionicons
                                                name="checkmark"
                                                size={20}
                                                color="#2F6F61"
                                            />
                                        )}
                                </TouchableOpacity>
                            ),
                        )}
                    </View>
                )}
            </View>

            <View
                style={styles.fieldGroup}
            >
                <Text
                    style={styles.label}
                >
                    Status
                </Text>

                <View
                    style={
                        styles.optionRow
                    }
                >
                    <TouchableOpacity
                        style={[
                            styles.optionButton,
                            status ===
                            "draft" &&
                            styles.optionButtonActive,
                        ]}
                        onPress={() =>
                            setStatus(
                                "draft",
                            )
                        }
                    >
                        <Ionicons
                            name="document-outline"
                            size={18}
                            color={
                                status ===
                                    "draft"
                                    ? "#FFFFFF"
                                    : "#2F6F61"
                            }
                        />

                        <Text
                            style={[
                                styles.optionText,
                                status ===
                                "draft" &&
                                styles.optionTextActive,
                            ]}
                        >
                            Draft
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[
                            styles.optionButton,
                            status ===
                            "published" &&
                            styles.optionButtonActive,
                        ]}
                        onPress={() =>
                            setStatus(
                                "published",
                            )
                        }
                    >
                        <Ionicons
                            name="send-outline"
                            size={18}
                            color={
                                status ===
                                    "published"
                                    ? "#FFFFFF"
                                    : "#2F6F61"
                            }
                        />

                        <Text
                            style={[
                                styles.optionText,
                                status ===
                                "published" &&
                                styles.optionTextActive,
                            ]}
                        >
                            Published
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>

            <View
                style={styles.fieldGroup}
            >
                <Text
                    style={styles.label}
                >
                    Priority
                </Text>

                <View
                    style={
                        styles.optionRow
                    }
                >
                    <TouchableOpacity
                        style={[
                            styles.optionButton,
                            priority ===
                            "normal" &&
                            styles.optionButtonActive,
                        ]}
                        onPress={() =>
                            setPriority(
                                "normal",
                            )
                        }
                    >
                        <Ionicons
                            name="information-circle-outline"
                            size={18}
                            color={
                                priority ===
                                    "normal"
                                    ? "#FFFFFF"
                                    : "#2F6F61"
                            }
                        />

                        <Text
                            style={[
                                styles.optionText,
                                priority ===
                                "normal" &&
                                styles.optionTextActive,
                            ]}
                        >
                            Normal
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[
                            styles.optionButton,
                            priority ===
                            "high" &&
                            styles.optionButtonActive,
                        ]}
                        onPress={() =>
                            setPriority(
                                "high",
                            )
                        }
                    >
                        <Ionicons
                            name="alert-circle-outline"
                            size={18}
                            color={
                                priority ===
                                    "high"
                                    ? "#FFFFFF"
                                    : "#2F6F61"
                            }
                        />

                        <Text
                            style={[
                                styles.optionText,
                                priority ===
                                "high" &&
                                styles.optionTextActive,
                            ]}
                        >
                            High
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>

            <View
                style={styles.switchContainer}
            >
                <View
                    style={styles.switchText}
                >
                    <Text
                        style={
                            styles.label
                        }
                    >
                        Pin Announcement
                    </Text>

                    <Text
                        style={
                            styles.helperText
                        }
                    >
                        Pinned announcements
                        appear at the top of
                        the list.
                    </Text>
                </View>

                <Switch
                    value={isPinned}
                    onValueChange={
                        setIsPinned
                    }
                    trackColor={{
                        false:
                            "#D1D8D5",
                        true:
                            "#8BB9AD",
                    }}
                    thumbColor={
                        isPinned
                            ? "#2F6F61"
                            : "#F4F4F4"
                    }
                />
            </View>

            <TouchableOpacity
                style={[
                    styles.saveButton,
                    saving &&
                    styles.disabledButton,
                ]}
                activeOpacity={0.85}
                disabled={saving}
                onPress={handleSave}
            >
                {saving ? (
                    <ActivityIndicator
                        color="#FFFFFF"
                    />
                ) : (
                    <>
                        <Ionicons
                            name={
                                isEditMode
                                    ? "save-outline"
                                    : "megaphone-outline"
                            }
                            size={20}
                            color="#FFFFFF"
                        />

                        <Text
                            style={
                                styles.saveButtonText
                            }
                        >
                            {isEditMode
                                ? "Save Changes"
                                : status ===
                                    "draft"
                                    ? "Save Draft"
                                    : "Publish Announcement"}
                        </Text>
                    </>
                )}
            </TouchableOpacity>

            <Text
                style={
                    styles.roleInfo
                }
            >
                Managing as{" "}
                {userRole === "admin"
                    ? "Admin"
                    : "Ranger"}
            </Text>
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

        contentContainer: {
            padding: 18,
            paddingBottom: 50,
        },

        heading: {
            fontSize: 26,
            fontWeight: "800",
            color: "#1D312B",
        },

        subtitle: {
            fontSize: 14,
            color: "#687C75",
            lineHeight: 20,
            marginTop: 5,
            marginBottom: 24,
        },

        fieldGroup: {
            marginBottom: 20,
        },

        label: {
            fontSize: 15,
            fontWeight: "700",
            color: "#263D36",
            marginBottom: 8,
        },

        input: {
            backgroundColor:
                "#FFFFFF",
            borderWidth: 1,
            borderColor:
                "#D8E3DF",
            borderRadius: 11,
            paddingHorizontal: 14,
            paddingVertical: 12,
            fontSize: 15,
            color: "#182A25",
        },

        contentInput: {
            minHeight: 130,
        },

        selector: {
            minHeight: 48,
            backgroundColor:
                "#FFFFFF",
            borderWidth: 1,
            borderColor:
                "#D8E3DF",
            borderRadius: 11,
            paddingHorizontal: 14,
            flexDirection: "row",
            alignItems: "center",
            justifyContent:
                "space-between",
        },

        selectorText: {
            fontSize: 15,
            color: "#182A25",
        },

        placeholderText: {
            color: "#98A39F",
        },

        dropdown: {
            marginTop: 6,
            backgroundColor:
                "#FFFFFF",
            borderWidth: 1,
            borderColor:
                "#D8E3DF",
            borderRadius: 11,
            overflow: "hidden",
        },

        dropdownItem: {
            flexDirection: "row",
            alignItems: "center",
            justifyContent:
                "space-between",
            paddingHorizontal: 14,
            paddingVertical: 13,
            borderBottomWidth: 1,
            borderBottomColor:
                "#EDF2F0",
        },

        dropdownText: {
            fontSize: 14,
            color: "#263D36",
        },

        optionRow: {
            flexDirection: "row",
            gap: 10,
        },

        optionButton: {
            flex: 1,
            minHeight: 45,
            borderWidth: 1,
            borderColor:
                "#2F6F61",
            borderRadius: 10,
            flexDirection: "row",
            alignItems: "center",
            justifyContent:
                "center",
            gap: 7,
            backgroundColor:
                "#FFFFFF",
        },

        optionButtonActive: {
            backgroundColor:
                "#2F6F61",
        },

        optionText: {
            color: "#2F6F61",
            fontWeight: "700",
        },

        optionTextActive: {
            color: "#FFFFFF",
        },

        switchContainer: {
            flexDirection: "row",
            alignItems: "center",
            justifyContent:
                "space-between",
            backgroundColor:
                "#FFFFFF",
            borderWidth: 1,
            borderColor:
                "#D8E3DF",
            borderRadius: 11,
            padding: 15,
            marginBottom: 26,
        },

        switchText: {
            flex: 1,
            marginRight: 15,
        },

        helperText: {
            fontSize: 12,
            color: "#71807B",
            lineHeight: 17,
        },

        saveButton: {
            minHeight: 50,
            backgroundColor:
                "#2F6F61",
            borderRadius: 11,
            flexDirection: "row",
            alignItems: "center",
            justifyContent:
                "center",
            gap: 8,
        },

        saveButtonText: {
            color: "#FFFFFF",
            fontSize: 16,
            fontWeight: "700",
        },

        disabledButton: {
            opacity: 0.6,
        },

        roleInfo: {
            marginTop: 16,
            textAlign: "center",
            fontSize: 12,
            color: "#82908B",
        },

        loadingContainer: {
            flex: 1,
            alignItems: "center",
            justifyContent:
                "center",
            backgroundColor:
                "#F5F8F7",
        },

        loadingText: {
            marginTop: 10,
            fontSize: 14,
            color: "#687C75",
        },
    });