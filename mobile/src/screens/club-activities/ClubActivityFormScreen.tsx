import React, {
    useEffect,
    useState,
} from "react";

import {
    ActivityIndicator,
    Alert,
    Image,
    Platform,
    ScrollView,
    StyleSheet,
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

import * as ImagePicker from "expo-image-picker";

import { AuthStackParamList } from "../../navigation/AuthNavigator";

import {
    createClubActivity,
    getClubActivityById,
    updateClubActivity,
} from "../../services/clubActivities/clubActivityService";

import {
    getCohorts,
} from "../../services/cohorts/cohortService";

import {
    uploadImage,
} from "../../services/storage/storageService";


type NavigationProp =
    NativeStackNavigationProp<
        AuthStackParamList,
        "ClubActivityForm"
    >;


type RouteProps = RouteProp<
    AuthStackParamList,
    "ClubActivityForm"
>;


type CohortOption = {
    id: string;
    name: string;
};


export default function ClubActivityFormScreen() {

    const navigation =
        useNavigation<NavigationProp>();


    const route =
        useRoute<RouteProps>();


    const userRole =
        route.params?.userRole;


    const activityId =
        route.params?.activityId;


    const routeCohortId =
        route.params?.cohortId;


    const isEditMode =
        !!activityId;


    /* =====================================================
       FORM STATE
    ===================================================== */

    const [title, setTitle] =
        useState("");


    const [description, setDescription] =
        useState("");


    const [activityDate, setActivityDate] =
        useState("");


    const [cohorts, setCohorts] =
        useState<CohortOption[]>([]);


    const [
        selectedCohortId,
        setSelectedCohortId,
    ] = useState("");


    const [
        cohortMenuVisible,
        setCohortMenuVisible,
    ] = useState(false);


    /*
     * imageUri can contain either:
     *
     * 1. A local Expo URI:
     *    file:///...
     *
     * 2. An existing backend storage path:
     *    /storage/files/...
     *
     * Local files are uploaded when Save/Create
     * is pressed.
     */
    const [
        imageUri,
        setImageUri,
    ] = useState<string | null>(null);


    /*
     * Tracks whether the user selected a NEW
     * image during this form session.
     *
     * This prevents us from trying to upload
     * an existing /storage/files/... path again.
     */
    const [
        hasNewImage,
        setHasNewImage,
    ] = useState(false);


    const [loading, setLoading] =
        useState(true);


    const [saving, setSaving] =
        useState(false);


    /* =====================================================
       INITIAL LOAD
    ===================================================== */

    useEffect(() => {
        initialiseScreen();
    }, []);


    const initialiseScreen = async () => {

        try {

            setLoading(true);


            const cohortData =
                await getCohorts();


            const mappedCohorts =
                cohortData.map(
                    (cohort: any) => ({
                        id: cohort.id,
                        name: cohort.name,
                    }),
                );


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


            /*
             * EDIT MODE
             */
            if (
                isEditMode &&
                activityId
            ) {

                const activity =
                    await getClubActivityById(
                        activityId,
                    );


                setTitle(
                    activity.title,
                );


                setDescription(
                    activity.description ?? "",
                );


                setSelectedCohortId(
                    activity.cohort_id,
                );


                if (
                    activity.activity_date
                ) {

                    setActivityDate(
                        activity.activity_date
                            .split("T")[0],
                    );
                }


                /*
                 * Existing image.
                 *
                 * This should normally be:
                 * /storage/files/...
                 */
                if (activity.image_url) {

                    setImageUri(
                        activity.image_url,
                    );

                    setHasNewImage(false);
                }
            }

        } catch (err: any) {

            console.error(
                "Unable to initialise club activity form:",
                err?.response?.data ?? err,
            );


            showMessage(
                "Error",
                err?.response?.data?.message ||
                "Unable to load club activity form.",
            );

        } finally {

            setLoading(false);
        }
    };


    /* =====================================================
       MESSAGE
    ===================================================== */

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


    /* =====================================================
       IMAGE PICKER
    ===================================================== */

    const handlePickImage =
        async () => {

            try {

                const permissionResult =
                    await ImagePicker
                        .requestMediaLibraryPermissionsAsync();


                if (
                    !permissionResult.granted
                ) {

                    showMessage(
                        "Photo Permission Needed",
                        "Please allow access to your photos so you can add a club activity image.",
                    );

                    return;
                }


                const result =
                    await ImagePicker
                        .launchImageLibraryAsync({
                            mediaTypes: [
                                "images",
                            ],

                            allowsEditing: true,

                            aspect: [4, 3],

                            quality: 0.8,
                        });


                if (
                    !result.canceled &&
                    result.assets.length > 0
                ) {

                    const selectedImage =
                        result.assets[0];


                    setImageUri(
                        selectedImage.uri,
                    );


                    /*
                     * We now know imageUri refers to
                     * a local image that must be
                     * uploaded before saving.
                     */
                    setHasNewImage(true);
                }

            } catch (error) {

                console.error(
                    "Image picker error:",
                    error,
                );


                showMessage(
                    "Couldn't Open Photos",
                    "Something went wrong while opening your photo library.",
                );
            }
        };


    const handleRemoveImage = () => {

        setImageUri(null);

        /*
         * No new image needs uploading.
         *
         * Note:
         * The current backend update DTO does
         * not support null for image_url, so
         * removing an already-saved image from
         * the database will be handled separately
         * if required.
         */
        setHasNewImage(false);
    };


    /* =====================================================
       SAVE
    ===================================================== */

    const handleSave = async () => {

        const trimmedTitle =
            title.trim();


        const trimmedDescription =
            description.trim();


        const trimmedDate =
            activityDate.trim();


        /* -----------------------------
           VALIDATE TITLE
        ----------------------------- */

        if (!trimmedTitle) {

            showMessage(
                "Missing Title",
                "Please enter a club activity title.",
            );

            return;
        }


        /* -----------------------------
           VALIDATE COHORT
        ----------------------------- */

        if (!selectedCohortId) {

            showMessage(
                "Missing Cohort",
                "Please select a cohort.",
            );

            return;
        }


        /* -----------------------------
           VALIDATE DATE
        ----------------------------- */

        let formattedActivityDate:
            string | undefined;


        if (trimmedDate) {

            const datePattern =
                /^\d{4}-\d{2}-\d{2}$/;


            if (
                !datePattern.test(
                    trimmedDate,
                )
            ) {

                showMessage(
                    "Invalid Date",
                    "Please enter the activity date as YYYY-MM-DD.",
                );

                return;
            }


            const parsedDate =
                new Date(
                    `${trimmedDate}T00:00:00`,
                );


            if (
                Number.isNaN(
                    parsedDate.getTime(),
                )
            ) {

                showMessage(
                    "Invalid Date",
                    "Please enter a valid activity date.",
                );

                return;
            }


            formattedActivityDate =
                parsedDate.toISOString();
        }


        try {

            setSaving(true);


            /*
             * ==================================
             * IMAGE UPLOAD
             * ==================================
             *
             * Only upload when the user picked
             * a NEW local image.
             */

            let uploadedImageUrl:
                string | undefined;


            if (
                imageUri &&
                hasNewImage
            ) {

                uploadedImageUrl =
                    await uploadImage(
                        imageUri,
                    );


                console.log(
                    "Club activity image uploaded:",
                    uploadedImageUrl,
                );
            }


            /* ==================================
               EDIT MODE
            ================================== */

            if (
                isEditMode &&
                activityId
            ) {

                await updateClubActivity(
                    activityId,
                    {
                        title:
                            trimmedTitle,

                        description:
                            trimmedDescription,

                        ...(formattedActivityDate
                            ? {
                                activity_date:
                                    formattedActivityDate,
                            }
                            : {}),

                        ...(uploadedImageUrl
                            ? {
                                image_url:
                                    uploadedImageUrl,
                            }
                            : {}),
                    },
                );


                showMessage(
                    "Updated",
                    "Club activity updated successfully.",
                    true,
                );


                return;
            }


            /* ==================================
               CREATE MODE
            ================================== */

            await createClubActivity(
                {
                    title:
                        trimmedTitle,

                    description:
                        trimmedDescription,

                    cohort_id:
                        selectedCohortId,

                    ...(formattedActivityDate
                        ? {
                            activity_date:
                                formattedActivityDate,
                        }
                        : {}),

                    ...(uploadedImageUrl
                        ? {
                            image_url:
                                uploadedImageUrl,
                        }
                        : {}),
                },
            );


            showMessage(
                "Created",
                "Club activity created successfully.",
                true,
            );

        } catch (err: any) {

            console.error(
                "Unable to save club activity:",
                err?.response?.data ?? err,
            );


            showMessage(
                "Error",
                err?.response?.data?.message ||
                "Unable to save club activity.",
            );

        } finally {

            setSaving(false);
        }
    };


    /* =====================================================
       SELECTED COHORT
    ===================================================== */

    const selectedCohort =
        cohorts.find(
            (cohort) =>
                cohort.id ===
                selectedCohortId,
        );


    /* =====================================================
       LOADING
    ===================================================== */

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
                    Loading club activity...
                </Text>
            </View>
        );
    }


    /* =====================================================
       UI
    ===================================================== */

    return (
        <ScrollView
            style={styles.container}
            contentContainerStyle={
                styles.contentContainer
            }
            keyboardShouldPersistTaps="handled"
        >

            {/* Heading */}

            <Text style={styles.heading}>
                {isEditMode
                    ? "Edit Club Activity"
                    : "Create Club Activity"}
            </Text>


            <Text style={styles.subtitle}>
                Share activities and experiences
                with Junior Rangers in your cohort.
            </Text>


            {/* Title */}

            <View style={styles.fieldGroup}>

                <Text style={styles.label}>
                    Title *
                </Text>

                <TextInput
                    value={title}
                    onChangeText={setTitle}
                    placeholder="Enter activity title"
                    placeholderTextColor="#98A39F"
                    style={styles.input}
                    maxLength={255}
                />

            </View>


            {/* Description */}

            <View style={styles.fieldGroup}>

                <Text style={styles.label}>
                    Description
                </Text>

                <TextInput
                    value={description}
                    onChangeText={
                        setDescription
                    }
                    placeholder="Describe the club activity..."
                    placeholderTextColor="#98A39F"
                    style={[
                        styles.input,
                        styles.descriptionInput,
                    ]}
                    multiline
                    textAlignVertical="top"
                />

            </View>


            {/* Cohort */}

            <View style={styles.fieldGroup}>

                <Text style={styles.label}>
                    Cohort *
                </Text>


                <TouchableOpacity
                    style={[
                        styles.selector,

                        isEditMode &&
                        styles.disabledSelector,
                    ]}
                    activeOpacity={0.8}
                    disabled={isEditMode}
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
                            isEditMode
                                ? "lock-closed-outline"
                                : cohortMenuVisible
                                    ? "chevron-up"
                                    : "chevron-down"
                        }
                        size={20}
                        color="#2F6F61"
                    />

                </TouchableOpacity>


                {isEditMode && (

                    <Text
                        style={
                            styles.helperText
                        }
                    >
                        The cohort cannot be changed
                        after the activity is created.
                    </Text>

                )}


                {!isEditMode &&
                    cohortMenuVisible && (

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
                                            {cohort.name}
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


            {/* Activity Date */}

            <View style={styles.fieldGroup}>

                <Text style={styles.label}>
                    Activity Date
                </Text>


                <View
                    style={
                        styles.dateInputContainer
                    }
                >

                    <Ionicons
                        name="calendar-outline"
                        size={20}
                        color="#60736D"
                    />


                    <TextInput
                        value={activityDate}
                        onChangeText={
                            setActivityDate
                        }
                        placeholder="YYYY-MM-DD"
                        placeholderTextColor="#98A39F"
                        style={
                            styles.dateInput
                        }
                        autoCapitalize="none"
                    />

                </View>


                <Text
                    style={
                        styles.helperText
                    }
                >
                    Optional. Example: 2026-10-15
                </Text>

            </View>


            {/* Activity Image */}

            <View style={styles.fieldGroup}>

                <Text style={styles.label}>
                    Activity Image
                </Text>


                {imageUri ? (

                    <View
                        style={
                            styles.imageContainer
                        }
                    >

                        {/*
                         * Local images can be previewed
                         * directly.
                         *
                         * Existing /storage/files/...
                         * images require authenticated
                         * retrieval, which we'll wire
                         * into the reusable image
                         * component next.
                         */}

                        {hasNewImage ? (

                            <Image
                                source={{
                                    uri: imageUri,
                                }}
                                style={
                                    styles.imagePreview
                                }
                                resizeMode="cover"
                            />

                        ) : (

                            <View
                                style={
                                    styles.existingImagePlaceholder
                                }
                            >

                                <Ionicons
                                    name="image-outline"
                                    size={36}
                                    color="#759188"
                                />

                                <Text
                                    style={
                                        styles.existingImageTitle
                                    }
                                >
                                    Existing image attached
                                </Text>

                                <Text
                                    style={
                                        styles.existingImageText
                                    }
                                >
                                    Select Replace Image to
                                    upload a new photo.
                                </Text>

                            </View>

                        )}


                        <TouchableOpacity
                            style={
                                styles.removeImageButton
                            }
                            onPress={
                                handleRemoveImage
                            }
                        >
                            <Ionicons
                                name="close"
                                size={22}
                                color="#FFFFFF"
                            />
                        </TouchableOpacity>


                        <TouchableOpacity
                            style={
                                styles.replaceImageButton
                            }
                            onPress={
                                handlePickImage
                            }
                        >

                            <Ionicons
                                name="images-outline"
                                size={18}
                                color="#2F6F61"
                            />

                            <Text
                                style={
                                    styles.replaceImageText
                                }
                            >
                                Replace Image
                            </Text>

                        </TouchableOpacity>

                    </View>

                ) : (

                    <TouchableOpacity
                        style={
                            styles.imagePlaceholder
                        }
                        activeOpacity={0.8}
                        onPress={
                            handlePickImage
                        }
                    >

                        <Ionicons
                            name="image-outline"
                            size={36}
                            color="#759188"
                        />


                        <Text
                            style={
                                styles.imagePlaceholderTitle
                            }
                        >
                            Add Activity Image
                        </Text>


                        <Text
                            style={
                                styles.imagePlaceholderText
                            }
                        >
                            Choose a photo from your
                            device to share with
                            Junior Rangers.
                        </Text>

                    </TouchableOpacity>

                )}

            </View>


            {/* Save */}

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

                    <>
                        <ActivityIndicator
                            color="#FFFFFF"
                        />

                        <Text
                            style={
                                styles.saveButtonText
                            }
                        >
                            {hasNewImage
                                ? "Uploading & Saving..."
                                : "Saving..."}
                        </Text>
                    </>

                ) : (

                    <>
                        <Ionicons
                            name={
                                isEditMode
                                    ? "save-outline"
                                    : "add-circle-outline"
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
                                : "Create Activity"}
                        </Text>
                    </>

                )}

            </TouchableOpacity>


            <Text style={styles.roleInfo}>
                Managing as{" "}
                {userRole === "admin"
                    ? "Admin"
                    : "Ranger"}
            </Text>

        </ScrollView>
    );
}


/* =========================================================
   STYLES
========================================================= */

const styles = StyleSheet.create({

    container: {
        flex: 1,
        backgroundColor: "#F5F8F7",
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
        backgroundColor: "#FFFFFF",
        borderWidth: 1,
        borderColor: "#D8E3DF",
        borderRadius: 11,
        paddingHorizontal: 14,
        paddingVertical: 12,
        fontSize: 15,
        color: "#182A25",
    },


    descriptionInput: {
        minHeight: 120,
    },


    selector: {
        minHeight: 48,
        backgroundColor: "#FFFFFF",
        borderWidth: 1,
        borderColor: "#D8E3DF",
        borderRadius: 11,
        paddingHorizontal: 14,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    },


    disabledSelector: {
        backgroundColor: "#EDF2F0",
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
        backgroundColor: "#FFFFFF",
        borderWidth: 1,
        borderColor: "#D8E3DF",
        borderRadius: 11,
        overflow: "hidden",
    },


    dropdownItem: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: 14,
        paddingVertical: 13,
        borderBottomWidth: 1,
        borderBottomColor: "#EDF2F0",
    },


    dropdownText: {
        fontSize: 14,
        color: "#263D36",
    },


    helperText: {
        marginTop: 6,
        fontSize: 12,
        color: "#71807B",
        lineHeight: 17,
    },


    dateInputContainer: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#FFFFFF",
        borderWidth: 1,
        borderColor: "#D8E3DF",
        borderRadius: 11,
        paddingHorizontal: 14,
    },


    dateInput: {
        flex: 1,
        minHeight: 48,
        marginLeft: 9,
        fontSize: 15,
        color: "#182A25",
    },


    /* IMAGE */

    imagePlaceholder: {
        minHeight: 150,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#EDF4F1",
        borderWidth: 1,
        borderStyle: "dashed",
        borderColor: "#B8CCC5",
        borderRadius: 11,
        padding: 18,
    },


    imagePlaceholderTitle: {
        marginTop: 8,
        fontSize: 15,
        fontWeight: "700",
        color: "#36584E",
    },


    imagePlaceholderText: {
        marginTop: 5,
        maxWidth: 260,
        textAlign: "center",
        fontSize: 12,
        lineHeight: 17,
        color: "#71807B",
    },


    imageContainer: {
        position: "relative",
    },


    imagePreview: {
        width: "100%",
        height: 220,
        borderRadius: 11,
        backgroundColor: "#E4ECE9",
    },


    existingImagePlaceholder: {
        height: 180,
        borderRadius: 11,
        backgroundColor: "#EDF4F1",
        borderWidth: 1,
        borderColor: "#D8E3DF",
        alignItems: "center",
        justifyContent: "center",
        padding: 20,
    },


    existingImageTitle: {
        marginTop: 8,
        fontSize: 14,
        fontWeight: "700",
        color: "#36584E",
    },


    existingImageText: {
        marginTop: 5,
        maxWidth: 250,
        textAlign: "center",
        fontSize: 12,
        lineHeight: 17,
        color: "#71807B",
    },


    removeImageButton: {
        position: "absolute",
        top: 10,
        right: 10,
        width: 34,
        height: 34,
        borderRadius: 17,
        backgroundColor: "#333333",
        alignItems: "center",
        justifyContent: "center",
    },


    replaceImageButton: {
        marginTop: 10,
        minHeight: 44,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: "#B8CCC5",
        backgroundColor: "#FFFFFF",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: 7,
    },


    replaceImageText: {
        fontSize: 14,
        fontWeight: "700",
        color: "#2F6F61",
    },


    /* SAVE */

    saveButton: {
        minHeight: 50,
        backgroundColor: "#2F6F61",
        borderRadius: 11,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
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
        justifyContent: "center",
        backgroundColor: "#F5F8F7",
    },


    loadingText: {
        marginTop: 10,
        fontSize: 14,
        color: "#687C75",
    },

});