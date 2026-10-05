import React, {
    useEffect,
    useState,
} from "react";

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

    const [token, setToken] =
        useState<string | null>(null);

    const [webBlobUrl, setWebBlobUrl] =
        useState<string | null>(null);

    const [loading, setLoading] =
        useState(true);

    const [failed, setFailed] =
        useState(false);


    const baseUrl =
        Platform.OS === "web"
            ? process.env.EXPO_PUBLIC_WEB_API_URL
            : process.env.EXPO_PUBLIC_MOBILE_API_URL;


    const isProtectedStorageImage =
        imageUrl.startsWith(
            "/storage/files/",
        );


    const fullImageUrl =
        imageUrl.startsWith("http://") ||
            imageUrl.startsWith("https://")
            ? imageUrl
            : `${baseUrl}${imageUrl}`;


    useEffect(() => {

        let objectUrl:
            string | null = null;

        let cancelled = false;


        const loadImage = async () => {

            try {

                setLoading(true);
                setFailed(false);


                /*
                 * Public/full URLs don't require
                 * our JWT storage flow.
                 */
                if (
                    !isProtectedStorageImage
                ) {

                    if (!cancelled) {
                        setLoading(false);
                    }

                    return;
                }


                const storedToken =
                    await getToken();


                if (!storedToken) {

                    throw new Error(
                        "Authentication token is unavailable.",
                    );
                }


                if (cancelled) {
                    return;
                }


                setToken(storedToken);


                /*
                 * =================================
                 * WEB
                 * =================================
                 *
                 * Browser <Image> requests are not
                 * reliable for custom Authorization
                 * headers.
                 *
                 * Fetch the protected resource
                 * ourselves using the JWT, convert
                 * it to a Blob URL, then give that
                 * local Blob URL to <Image>.
                 */
                if (
                    Platform.OS === "web"
                ) {

                    const response =
                        await fetch(
                            fullImageUrl,
                            {
                                headers: {
                                    Authorization:
                                        `Bearer ${storedToken}`,
                                },
                            },
                        );


                    if (!response.ok) {

                        throw new Error(
                            `Image request failed with status ${response.status}`,
                        );
                    }


                    const blob =
                        await response.blob();


                    objectUrl =
                        URL.createObjectURL(
                            blob,
                        );


                    if (!cancelled) {

                        setWebBlobUrl(
                            objectUrl,
                        );
                    }
                }

            } catch (error) {

                console.error(
                    "Unable to load authenticated image:",
                    error,
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


            /*
             * Release browser memory when the
             * component unmounts or image changes.
             */
            if (
                objectUrl &&
                Platform.OS === "web"
            ) {

                URL.revokeObjectURL(
                    objectUrl,
                );
            }
        };

    }, [
        imageUrl,
        fullImageUrl,
        isProtectedStorageImage,
    ]);


    if (loading) {

        return (
            <View
                style={[
                    styles.placeholder,
                    style,
                ]}
            >
                <ActivityIndicator
                    color="#2F6F61"
                />
            </View>
        );
    }


    if (failed) {

        return (
            <View
                style={[
                    styles.placeholder,
                    style,
                ]}
            />
        );
    }


    /*
     * =================================
     * WEB PROTECTED IMAGE
     * =================================
     */
    if (
        Platform.OS === "web" &&
        isProtectedStorageImage
    ) {

        if (!webBlobUrl) {

            return (
                <View
                    style={[
                        styles.placeholder,
                        style,
                    ]}
                />
            );
        }


        return (
            <Image
                source={{
                    uri: webBlobUrl,
                }}
                style={style}
                resizeMode={resizeMode}
            />
        );
    }


    /*
     * =================================
     * ANDROID / IOS PROTECTED IMAGE
     * =================================
     *
     * Native React Native image requests
     * can include request headers.
     */
    if (
        isProtectedStorageImage
    ) {

        return (
            <Image
                source={{
                    uri: fullImageUrl,

                    headers: token
                        ? {
                            Authorization:
                                `Bearer ${token}`,
                        }
                        : undefined,
                }}
                style={style}
                resizeMode={resizeMode}
                onError={(event) => {

                    console.error(
                        "Unable to display authenticated image:",
                        event.nativeEvent,
                    );
                }}
            />
        );
    }


    /*
     * =================================
     * NORMAL PUBLIC/FULL URL
     * =================================
     */
    return (
        <Image
            source={{
                uri: fullImageUrl,
            }}
            style={style}
            resizeMode={resizeMode}
            onError={(event) => {

                console.error(
                    "Unable to display image:",
                    event.nativeEvent,
                );
            }}
        />
    );
}


const styles =
    StyleSheet.create({

        placeholder: {
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "#E7EFEC",
        },

    });