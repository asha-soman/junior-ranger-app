import { Platform } from "react-native";
import apiClient from "../api/client";
import { getToken } from "@/src/utils/secureStore";

export type UploadImageResponse = {
    imageUrl: string;
};

function getFileName(uri: string): string {
    const cleanUri = uri.split("?")[0];
    const parts = cleanUri.split("/");

    return (
        parts[parts.length - 1] ||
        `image-${Date.now()}.jpg`
    );
}

function getMimeType(fileName: string): string {
    const extension = fileName
        .split(".")
        .pop()
        ?.toLowerCase();

    switch (extension) {
        case "png":
            return "image/png";

        case "webp":
            return "image/webp";

        case "jpeg":
        case "jpg":
        default:
            return "image/jpeg";
    }
}

export async function uploadImage(
    imageUri: string,
): Promise<string> {

    const fileName = getFileName(imageUri);
    const mimeType = getMimeType(fileName);
    const formData = new FormData();

    console.log("UPLOAD DEBUG:", {
        imageUri,
        fileName,
        mimeType,
        platform: Platform.OS,
    });

    /*
     * WEB
     *
     * Convert the image URI into a Blob
     * before adding it to FormData.
     */
    if (Platform.OS === "web") {

        const fileResponse = await fetch(imageUri);

        if (!fileResponse.ok) {
            throw new Error(
                `Failed to read image: ${fileResponse.status}`
            );
        }

        const blob = await fileResponse.blob();

        formData.append(
            "file",
            blob,
            fileName,
        );

    } else {

        /*
         * ANDROID / IOS
         *
         * React Native FormData accepts
         * uri/name/type objects.
         */
        formData.append(
            "file",
            {
                uri: imageUri,
                name: fileName,
                type: mimeType,
            } as any,
        );
    }

    /*
     * ANDROID
     *
     * Use fetch instead of Axios to test
     * whether Axios is causing the
     * multipart upload network error.
     */
    if (Platform.OS === "android") {

        const baseUrl =
            process.env.EXPO_PUBLIC_MOBILE_API_URL;

        if (!baseUrl) {
            throw new Error(
                "EXPO_PUBLIC_MOBILE_API_URL is not configured"
            );
        }

        const token = await getToken();

        const uploadUrl =
            `${baseUrl.replace(/\/$/, "")}/storage/upload`;

        console.log("ANDROID UPLOAD DEBUG:", {
            uploadUrl,
            imageUri,
            fileName,
            mimeType,
            hasToken: !!token,
        });

        try {

            const response = await fetch(uploadUrl, {
                method: "POST",
                headers: {
                    ...(token
                        ? { Authorization: `Bearer ${token}` }
                        : {}),
                },
                body: formData,
            });

            if (!response.ok) {

                const errorText = await response.text();

                console.error(
                    "ANDROID UPLOAD HTTP ERROR:",
                    response.status,
                    errorText,
                );

                throw new Error(
                    `Image upload failed: ${response.status} - ${errorText}`
                );
            }

            const data: UploadImageResponse =
                await response.json();

            console.log(
                "ANDROID IMAGE UPLOADED SUCCESSFULLY:",
                data.imageUrl,
            );

            return data.imageUrl;

        } catch (error) {

            console.error(
                "ANDROID IMAGE UPLOAD FAILED:",
                error,
            );

            throw error;
        }
    }

    /*
     * WEB / IOS
     *
     * Keep the existing Axios implementation.
     */
    const response =
        await apiClient.post<UploadImageResponse>(
            "/storage/upload",
            formData,
        );

    return response.data.imageUrl;
}