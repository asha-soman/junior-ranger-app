import {
    Platform,
} from "react-native";

import apiClient from "../api/client";


export type UploadImageResponse = {
    imageUrl: string;
};


function getFileName(
    uri: string,
): string {

    const cleanUri =
        uri.split("?")[0];

    const parts =
        cleanUri.split("/");

    return (
        parts[parts.length - 1] ||
        `image-${Date.now()}.jpg`
    );
}


function getMimeType(
    fileName: string,
): string {

    const extension =
        fileName
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

    const fileName =
        getFileName(imageUri);

    const mimeType =
        getMimeType(fileName);

    const formData =
        new FormData();


    /*
     * WEB
     *
     * Expo Image Picker returns a blob URL
     * on web.
     *
     * Convert that URL into an actual Blob
     * before adding it to FormData.
     */
    if (Platform.OS === "web") {

        const fileResponse =
            await fetch(imageUri);

        const blob =
            await fileResponse.blob();


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


    const response =
        await apiClient.post<UploadImageResponse>(
            "/storage/upload",
            formData,
        );


    return response.data.imageUrl;
}