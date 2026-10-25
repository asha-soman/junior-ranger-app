import { Platform } from "react-native";
import { getToken } from "../../utils/secureStore";

export type UploadImageResponse = {
  imageUrl: string;
};

export function formatUploadErrorMessage(error: any): string {
  const rawMessage = (
    error?.response?.data?.message ||
    error?.message ||
    String(error || "")
  ).toLowerCase();

  if (
    rawMessage.includes("network") ||
    rawMessage.includes("connection") ||
    rawMessage.includes("failed to fetch") ||
    rawMessage.includes("could not connect")
  ) {
    return "Network connection error. Please check your internet connection and try again.";
  }

  if (
    rawMessage.includes("size") ||
    rawMessage.includes("10485760") ||
    rawMessage.includes("too large") ||
    rawMessage.includes("10 mb") ||
    rawMessage.includes("10mb")
  ) {
    return "The selected image exceeds the maximum size limit of 10 MB. Please choose a smaller photo.";
  }

  if (
    rawMessage.includes("filetype") ||
    rawMessage.includes("unsupported") ||
    rawMessage.includes("expected type") ||
    rawMessage.includes("mimetype")
  ) {
    return "Unsupported image format. Please select a JPG, PNG, or WebP photo.";
  }

  if (rawMessage.includes("401") || rawMessage.includes("unauthorized")) {
    return "Your session has expired. Please log in again.";
  }

  if (rawMessage.includes("timeout")) {
    return "Upload timed out. Please tap Retry to try again.";
  }

  return error?.message || "Unable to upload image. Please tap Retry.";
}

export function getFileName(uri: string): string {
  const cleanUri = uri.split("?")[0];
  const parts = cleanUri.split("/");

  return parts[parts.length - 1] || `image-${Date.now()}.jpg`;
}

export function getMimeType(fileName: string): string {
  const extension = fileName.split(".").pop()?.toLowerCase();

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
  onProgress?: (progress: number) => void,
): Promise<string> {
  const fileName = getFileName(imageUri);
  const mimeType = getMimeType(fileName);
  const formData = new FormData();

  if (Platform.OS === "web") {
    const fileResponse = await fetch(imageUri);

    if (!fileResponse.ok) {
      throw new Error(`Failed to read selected image: ${fileResponse.status}`);
    }

    const blob = await fileResponse.blob();

    if (blob.size > 10 * 1024 * 1024) {
      throw new Error("Image exceeds maximum size limit (10 MB).");
    }

    formData.append("file", blob, fileName);
  } else {
    formData.append("file", {
      uri: imageUri,
      name: fileName,
      type: mimeType,
    } as any);
  }

  const baseUrl =
    Platform.OS === "web"
      ? process.env.EXPO_PUBLIC_WEB_API_URL
      : process.env.EXPO_PUBLIC_MOBILE_API_URL;

  if (!baseUrl) {
    throw new Error("Backend API URL is not configured");
  }

  const token = await getToken();
  const uploadUrl = `${baseUrl.replace(/\/$/, "")}/storage/upload`;

  return new Promise<string>((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("POST", uploadUrl);
    xhr.timeout = 60000;

    if (token) {
      xhr.setRequestHeader("Authorization", `Bearer ${token}`);
    }

    if (xhr.upload) {
      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable && event.total > 0) {
          const percentage = Math.min(
            100,
            Math.max(0, Math.round((event.loaded / event.total) * 100)),
          );
          onProgress?.(percentage);
        }
      };
    }

    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        try {
          const data: UploadImageResponse = JSON.parse(xhr.responseText);
          if (!data.imageUrl) {
            reject(new Error("Server did not return an image URL."));
            return;
          }
          onProgress?.(100);
          resolve(data.imageUrl);
        } catch {
          reject(new Error("Invalid response received from server."));
        }
      } else {
        let errorMsg = `Upload failed with status ${xhr.status}`;
        try {
          const parsed = JSON.parse(xhr.responseText);
          errorMsg = parsed.message || errorMsg;
        } catch {
          if (xhr.responseText) {
            errorMsg = xhr.responseText;
          }
        }
        reject(new Error(errorMsg));
      }
    };

    xhr.onerror = () => {
      reject(
        new Error(
          "Network connection error. Please check your internet connection.",
        ),
      );
    };

    xhr.ontimeout = () => {
      reject(new Error("Upload timed out. Please tap Retry."));
    };

    xhr.send(formData);
  });
}
