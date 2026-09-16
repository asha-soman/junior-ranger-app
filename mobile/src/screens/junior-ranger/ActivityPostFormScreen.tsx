import React, {
    useEffect,
    useState,
} from "react";

import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    ActivityIndicator,
    Alert,
    Image,
    ScrollView,
    Platform,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";

import {
    useNavigation,
    useRoute,
    RouteProp,
} from "@react-navigation/native";

import { NativeStackNavigationProp } from "@react-navigation/native-stack";

import * as ImagePicker from "expo-image-picker";

import { AuthStackParamList } from "../../navigation/AuthNavigator";

import {
    Cohort,
    getCohorts,
} from "../../services/cohorts/cohortService";

import {
    createActivityPost,
    getActivityPostById,
    updateActivityPost,
} from "../../services/activity-posts/activityPostsService";

/* ========================================================
   NAVIGATION TYPES
======================================================== */

type NavigationProp =
    NativeStackNavigationProp<
        AuthStackParamList,
        "ActivityPostForm"
    >;

type ActivityPostFormRouteProp =
    RouteProp<
        AuthStackParamList,
        "ActivityPostForm"
    >;

/* ========================================================
   SCREEN
======================================================== */

export default function ActivityPostFormScreen() {
    const navigation =
        useNavigation<NavigationProp>();

    const route =
        useRoute<ActivityPostFormRouteProp>();

    /*
     * If postId exists:
     * EDIT MODE
     *
     * If postId doesn't exist:
     * CREATE MODE
     */
    const postId =
        route.params?.postId;

    const isEditMode = !!postId;

    /* ======================================================
       STATE
    ====================================================== */

    const [content, setContent] =
        useState("");

    const [cohort, setCohort] =
        useState<Cohort | null>(null);

    const [
        loadingCohort,
        setLoadingCohort,
    ] = useState(true);

    const [
        loadingPost,
        setLoadingPost,
    ] = useState(isEditMode);

    const [
        submitting,
        setSubmitting,
    ] = useState(false);

    /*
     * Local Expo image URI.
     *
     * We are still NOT sending this to
     * the backend until cloud image
     * upload is implemented.
     */
    const [
        imageUri,
        setImageUri,
    ] = useState<string | null>(null);

    /* ======================================================
       INITIAL LOAD
    ====================================================== */

    useEffect(() => {
        const initialiseScreen =
            async () => {
                await loadJuniorRangerCohort();

                if (
                    isEditMode &&
                    postId
                ) {
                    await loadExistingPost(
                        postId,
                    );
                }
            };

        initialiseScreen();
    }, [postId]);

    /* ======================================================
       LOAD COHORT
    ====================================================== */

    const loadJuniorRangerCohort =
        async () => {
            try {
                setLoadingCohort(true);

                const cohorts =
                    await getCohorts();

                if (
                    cohorts.length === 0
                ) {
                    Alert.alert(
                        "No Club Found",
                        "You need to join a club before sharing an activity.",
                    );

                    return;
                }

                setCohort(cohorts[0]);
            } catch (error: any) {
                console.error(
                    "Unable to load cohort:",
                    error?.response?.data ??
                    error,
                );

                Alert.alert(
                    "Unable to Load Club",
                    error?.response?.data
                        ?.message ||
                    error?.message ||
                    "We couldn't load your club.",
                );
            } finally {
                setLoadingCohort(false);
            }
        };

    /* ======================================================
       LOAD EXISTING POST
    ====================================================== */

    const loadExistingPost =
        async (
            id: string,
        ) => {
            try {
                setLoadingPost(true);

                const post =
                    await getActivityPostById(
                        id,
                    );

                console.log(
                    "Activity post loaded for editing:",
                    post,
                );

                /*
                 * Pre-fill existing content.
                 */
                setContent(
                    post.content ?? "",
                );

                /*
                 * IMPORTANT:
                 *
                 * Only use image_url here if it
                 * is a permanent URL.
                 *
                 * We are not uploading local Expo
                 * file:// URIs to the database.
                 */
                if (post.image_url) {
                    setImageUri(
                        post.image_url,
                    );
                }
            } catch (error: any) {
                console.error(
                    "Unable to load activity post:",
                    error?.response?.data ??
                    error,
                );

                Alert.alert(
                    "Unable to Load Post",
                    error?.response?.data
                        ?.message ||
                    error?.message ||
                    "We couldn't load this activity post.",
                    [
                        {
                            text: "Go Back",
                            onPress: () =>
                                navigation.goBack(),
                        },
                    ],
                );
            } finally {
                setLoadingPost(false);
            }
        };

    /* ======================================================
       IMAGE PICKER
    ====================================================== */

    const handlePickImage =
        async () => {
            try {
                const permissionResult =
                    await ImagePicker.requestMediaLibraryPermissionsAsync();

                if (
                    !permissionResult.granted
                ) {
                    Alert.alert(
                        "Photo Permission Needed",
                        "Please allow access to your photos so you can add an activity photo.",
                    );

                    return;
                }

                const result =
                    await ImagePicker.launchImageLibraryAsync(
                        {
                            mediaTypes: [
                                "images",
                            ],

                            allowsEditing: true,

                            aspect: [4, 3],

                            quality: 0.8,
                        },
                    );

                if (!result.canceled) {
                    setImageUri(
                        result.assets[0].uri,
                    );
                }
            } catch (error) {
                console.error(
                    "Image picker error:",
                    error,
                );

                Alert.alert(
                    "Couldn't Open Photos",
                    "Something went wrong while opening your photo library.",
                );
            }
        };

    /* ======================================================
       SUBMIT
    ====================================================== */
    const showSuccessAndReturn = (
        title: string,
        message: string,
    ) => {
        // Expo Web
        if (Platform.OS === "web") {
            window.alert(message);

            navigation.goBack();

            return;
        }

        // Android / iOS
        Alert.alert(
            title,
            message,
            [
                {
                    text: "OK",
                    onPress: () => {
                        navigation.goBack();
                    },
                },
            ],
        );
    };
    const handleSubmit =
        async () => {
            const trimmedContent =
                content.trim();

            /* -------------------------
               VALIDATE CONTENT
            ------------------------- */

            if (!trimmedContent) {
                Alert.alert(
                    "Tell us about your activity",
                    "Please write something before sharing your post.",
                );

                return;
            }

            /* -------------------------
               VALIDATE COHORT
            ------------------------- */

            if (!cohort) {
                Alert.alert(
                    "No Club Found",
                    "You need to belong to a club before sharing a post.",
                );

                return;
            }

            try {
                setSubmitting(true);

                /* =========================
                   EDIT MODE
                ========================== */

                if (
                    isEditMode &&
                    postId
                ) {
                    await updateActivityPost(
                        postId,
                        {
                            content:
                                trimmedContent,

                            /*
                             * Do NOT send imageUri.
                             *
                             * It may currently be:
                             *
                             * file:///...
                             *
                             * Cloud image upload will
                             * handle this later.
                             */
                        },
                    );

                    showSuccessAndReturn(
                        "Post Updated!",
                        "Your activity post has been updated.",
                    );

                    return;

                    return;
                }

                /* =========================
                   CREATE MODE
                ========================== */

                await createActivityPost({
                    content:
                        trimmedContent,

                    cohort_id:
                        cohort.id,

                    /*
                     * image_url will be added
                     * once cloud image upload
                     * is implemented.
                     */
                });

                showSuccessAndReturn(
                    "Post Shared!",
                    "Your activity has been shared with your club.",
                );
            } catch (error: any) {
                console.error(
                    isEditMode
                        ? "Update post failed:"
                        : "Create post failed:",
                    error?.response?.data ??
                    error,
                );

                Alert.alert(
                    isEditMode
                        ? "Couldn't Update Post"
                        : "Couldn't Share Post",

                    error?.response?.data
                        ?.message ||
                    error?.message ||
                    (isEditMode
                        ? "Something went wrong while updating your post."
                        : "Something went wrong while sharing your post."),
                );
            } finally {
                setSubmitting(false);
            }
        };

    /* ======================================================
       LOADING
    ====================================================== */

    if (
        loadingCohort ||
        loadingPost
    ) {
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
                    {isEditMode
                        ? "Loading your post..."
                        : "Loading your club..."}
                </Text>
            </View>
        );
    }

    /* ======================================================
       UI
    ====================================================== */

    return (
        <ScrollView
            style={styles.container}
            contentContainerStyle={
                styles.contentContainer
            }
            keyboardShouldPersistTaps="handled"
        >
            {/* =========================
          HEADING
      ========================== */}

            <Text
                style={styles.heading}
            >
                {isEditMode
                    ? "Edit Activity"
                    : "Share an Activity"}
            </Text>

            <Text
                style={styles.subtitle}
            >
                {isEditMode
                    ? "Update what you shared with your club."
                    : "Show your club what you've been up to!"}
            </Text>

            {/* =========================
          COHORT
      ========================== */}

            {cohort && (
                <View
                    style={
                        styles.cohortCard
                    }
                >
                    <Ionicons
                        name="people"
                        size={20}
                        color="#376E62"
                    />

                    <View
                        style={
                            styles.cohortInfo
                        }
                    >
                        <Text
                            style={
                                styles.cohortLabel
                            }
                        >
                            {isEditMode
                                ? "Shared with"
                                : "Sharing with"}
                        </Text>

                        <Text
                            style={
                                styles.cohortName
                            }
                        >
                            {cohort.name}
                        </Text>
                    </View>
                </View>
            )}

            {/* =========================
          CONTENT
      ========================== */}

            <Text
                style={styles.label}
            >
                What did you do today?
            </Text>

            <TextInput
                style={styles.textArea}
                placeholder="Tell us about your activity..."
                placeholderTextColor="#777"
                value={content}
                onChangeText={setContent}
                multiline
                maxLength={1000}
                textAlignVertical="top"
            />

            <Text
                style={
                    styles.characterCount
                }
            >
                {content.length}/1000
            </Text>

            {/* =========================
          PHOTO
      ========================== */}

            <Text
                style={styles.label}
            >
                Add a Photo
            </Text>

            {imageUri ? (
                <View
                    style={
                        styles.imageContainer
                    }
                >
                    <Image
                        source={{
                            uri: imageUri,
                        }}
                        style={
                            styles.imagePreview
                        }
                    />

                    <TouchableOpacity
                        style={
                            styles.removeImageButton
                        }
                        onPress={() =>
                            setImageUri(null)
                        }
                    >
                        <Ionicons
                            name="close"
                            size={22}
                            color="#FFFFFF"
                        />
                    </TouchableOpacity>
                </View>
            ) : (
                <TouchableOpacity
                    style={
                        styles.photoButton
                    }
                    onPress={
                        handlePickImage
                    }
                >
                    <Ionicons
                        name="camera-outline"
                        size={36}
                        color="#376E62"
                    />

                    <Text
                        style={
                            styles.photoButtonTitle
                        }
                    >
                        Add Photo
                    </Text>

                    <Text
                        style={
                            styles.photoButtonText
                        }
                    >
                        Share a photo from your
                        activity
                    </Text>
                </TouchableOpacity>
            )}

            {/* =========================
          SUBMIT
      ========================== */}

            <TouchableOpacity
                style={[
                    styles.shareButton,

                    submitting &&
                    styles.disabledButton,
                ]}
                disabled={submitting}
                onPress={handleSubmit}
                activeOpacity={0.85}
            >
                {submitting ? (
                    <ActivityIndicator
                        color="#FFFFFF"
                    />
                ) : (
                    <>
                        <Ionicons
                            name={
                                isEditMode
                                    ? "checkmark"
                                    : "send"
                            }
                            size={20}
                            color="#FFFFFF"
                        />

                        <Text
                            style={
                                styles.shareButtonText
                            }
                        >
                            {isEditMode
                                ? "Save Changes"
                                : "Share Post"}
                        </Text>
                    </>
                )}
            </TouchableOpacity>
        </ScrollView>
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
                "#F7F7F7",
        },

        contentContainer: {
            padding: 20,

            paddingBottom: 50,
        },

        loadingContainer: {
            flex: 1,

            justifyContent:
                "center",

            alignItems: "center",

            backgroundColor:
                "#F7F7F7",
        },

        loadingText: {
            marginTop: 12,

            color: "#555",
        },

        heading: {
            fontSize: 26,

            fontWeight: "700",

            color: "#1F1F1F",
        },

        subtitle: {
            marginTop: 6,

            marginBottom: 20,

            fontSize: 15,

            color: "#666",
        },

        cohortCard: {
            flexDirection: "row",

            alignItems: "center",

            backgroundColor:
                "#DFF0EA",

            borderRadius: 16,

            padding: 14,

            marginBottom: 24,
        },

        cohortInfo: {
            marginLeft: 10,
        },

        cohortLabel: {
            fontSize: 12,

            color: "#555",
        },

        cohortName: {
            marginTop: 2,

            fontSize: 16,

            fontWeight: "700",

            color: "#214C45",
        },

        label: {
            fontSize: 16,

            fontWeight: "700",

            color: "#222",

            marginBottom: 9,
        },

        textArea: {
            minHeight: 150,

            backgroundColor:
                "#FFFFFF",

            borderRadius: 16,

            borderWidth: 1,

            borderColor:
                "#D8D8D8",

            padding: 15,

            fontSize: 16,

            color: "#111",
        },

        characterCount: {
            alignSelf: "flex-end",

            marginTop: 6,

            marginBottom: 22,

            fontSize: 12,

            color: "#777",
        },

        photoButton: {
            height: 145,

            backgroundColor:
                "#FFFFFF",

            borderWidth: 1.5,

            borderStyle: "dashed",

            borderColor:
                "#9CBDB5",

            borderRadius: 16,

            justifyContent:
                "center",

            alignItems: "center",

            marginBottom: 28,
        },

        photoButtonTitle: {
            marginTop: 7,

            fontSize: 16,

            fontWeight: "700",

            color: "#376E62",
        },

        photoButtonText: {
            marginTop: 4,

            fontSize: 13,

            color: "#777",
        },

        imageContainer: {
            position: "relative",

            marginBottom: 28,
        },

        imagePreview: {
            width: "100%",

            height: 220,

            borderRadius: 16,
        },

        removeImageButton: {
            position: "absolute",

            top: 10,
            right: 10,

            width: 34,
            height: 34,

            borderRadius: 17,

            backgroundColor:
                "#333",

            alignItems: "center",

            justifyContent:
                "center",
        },

        shareButton: {
            minHeight: 54,

            borderRadius: 16,

            backgroundColor:
                "#376E62",

            flexDirection: "row",

            alignItems: "center",

            justifyContent:
                "center",

            gap: 9,
        },

        disabledButton: {
            opacity: 0.6,
        },

        shareButtonText: {
            color: "#FFFFFF",

            fontSize: 17,

            fontWeight: "700",
        },
    });