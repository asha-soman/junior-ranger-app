
import React, { useEffect, useState } from "react";

import {
    ActivityIndicator,
    Image,
    ImageStyle,
    Platform,
    StyleProp,
    StyleSheet,
    View,
} from "react-native";

import { getToken } from "../../utils/secureStore";
import * as FileSystem from "expo-file-system/legacy";

type Props = {
    imageUrl: string;
    style?: StyleProp<ImageStyle>;
    resizeMode?:
        | "cover"
        | "contain"
        | "stretch"
        | "repeat"
        | "center";
};

export default function AuthenticatedImage({
    imageUrl,
    style,
    resizeMode = "cover",
}: Props) {

    const [displayUrl, setDisplayUrl] =
        useState<string | null>(null);

    const [loading, setLoading] = useState(true);
    const [failed, setFailed] = useState(false);

    const baseUrl =
        Platform.OS === "web"
            ? process.env.EXPO_PUBLIC_WEB_API_URL
            : process.env.EXPO_PUBLIC_MOBILE_API_URL;

    const isProtectedStorageImage =
        imageUrl.startsWith("/storage/files/");

    const fullImageUrl =
        imageUrl.startsWith("http://") ||
        imageUrl.startsWith("https://")
            ? imageUrl
            : `${baseUrl?.replace(/\/$/, "")}${imageUrl}`;

    useEffect(() => {
        let cancelled = false;
        let webObjectUrl: string | null = null;
        let localFileUri: string | null = null;

        const loadImage = async () => {
            setLoading(true);
            setFailed(false);
            setDisplayUrl(null);

            try {
                if (!isProtectedStorageImage) {
                    if (!cancelled) {
                        setDisplayUrl(fullImageUrl);
                    }
                    return;
                }

                const token = await getToken();

                if (!token) {
                    throw new Error(
                        "Authentication token is unavailable."
                    );
                }

                if (Platform.OS === "web") {
                    const response = await fetch(fullImageUrl, {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    });

                    if (!response.ok) {
                        throw new Error(
                            `Image request failed: ${response.status}`
                        );
                    }

                    const blob = await response.blob();
                    webObjectUrl = URL.createObjectURL(blob);

                    if (!cancelled) {
                        setDisplayUrl(webObjectUrl);
                    }

                } else {
                    // ANDROID / IOS
                    // Download the protected image with JWT.
                    const directory = FileSystem.cacheDirectory;

                    if (!directory) {
                        throw new Error(
                            "FileSystem cache directory unavailable."
                        );
                    }

                    const filename =
                        `protected-image-${Date.now()}-` +
                        `${Math.random().toString(36).slice(2)}.jpg`;

                    localFileUri = `${directory}${filename}`;

                    const result =
                        await FileSystem.downloadAsync(
                            fullImageUrl,
                            localFileUri,
                            {
                                headers: {
                                    Authorization: `Bearer ${token}`,
                                },
                            }
                        );

                    if (result.status !== 200) {
                        throw new Error(
                            `Image download failed: ${result.status}`
                        );
                    }

                    if (!cancelled) {
                        setDisplayUrl(result.uri);
                    }
                }

            } catch (error) {
                console.error(
                    "Unable to load authenticated image:",
                    error
                );

                if (!cancelled) {
                    setFailed(true);
                }

            } finally {
                if (!cancelled) {
                    setLoading(false);
                }
            }
        };

        loadImage();

        return () => {
            cancelled = true;

            if (webObjectUrl) {
                URL.revokeObjectURL(webObjectUrl);
            }

            if (localFileUri) {
                FileSystem.deleteAsync(localFileUri, {
                    idempotent: true,
                }).catch(() => {});
            }
        };
    }, [imageUrl, fullImageUrl, isProtectedStorageImage]);

    if (loading) {
        return (
            <View style={[styles.placeholder, style]}>
                <ActivityIndicator color="#2F6F61" />
            </View>
        );
    }

    if (failed || !displayUrl) {
        return (
            <View style={[styles.placeholder, style]} />
        );
    }

    return (
        <Image
            source={{ uri: displayUrl }}
            style={style}
            resizeMode={resizeMode}
            onError={(event) => {
                console.error(
                    "Unable to display image:",
                    event.nativeEvent
                );
                setFailed(true);
            }}
        />
    );
}

const styles = StyleSheet.create({
    placeholder: {
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#E7EFEC",
    },
});
