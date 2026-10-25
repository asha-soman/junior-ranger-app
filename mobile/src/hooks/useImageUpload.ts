import { useState, useCallback, useRef } from "react";
import {
  uploadImage,
  formatUploadErrorMessage,
} from "../services/storage/storageService";

export type UploadStatus = "idle" | "uploading" | "success" | "error";

export interface UseImageUploadReturn {
  status: UploadStatus;
  progress: number;
  error: string | null;
  uploadedUrl: string | null;
  selectedUri: string | null;
  isUploading: boolean;
  upload: (uri: string) => Promise<string>;
  retry: () => Promise<string | null>;
  reset: () => void;
  setSelectedUri: (uri: string | null) => void;
}

export function useImageUpload(): UseImageUploadReturn {
  const [status, setStatus] = useState<UploadStatus>("idle");
  const [progress, setProgress] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(null);
  const [selectedUri, setSelectedUri] = useState<string | null>(null);

  const lastUriRef = useRef<string | null>(null);

  const upload = useCallback(async (uri: string): Promise<string> => {
    lastUriRef.current = uri;
    setSelectedUri(uri);
    setStatus("uploading");
    setProgress(0);
    setError(null);

    try {
      const url = await uploadImage(uri, (pct) => {
        setProgress(pct);
      });

      setUploadedUrl(url);
      setStatus("success");
      setProgress(100);
      return url;
    } catch (err: any) {
      const friendlyMessage = formatUploadErrorMessage(err);
      setError(friendlyMessage);
      setStatus("error");
      throw err;
    }
  }, []);

  const retry = useCallback(async (): Promise<string | null> => {
    if (!lastUriRef.current) {
      return null;
    }
    return upload(lastUriRef.current);
  }, [upload]);

  const reset = useCallback(() => {
    setStatus("idle");
    setProgress(0);
    setError(null);
    setUploadedUrl(null);
    setSelectedUri(null);
    lastUriRef.current = null;
  }, []);

  return {
    status,
    progress,
    error,
    uploadedUrl,
    selectedUri,
    isUploading: status === "uploading",
    upload,
    retry,
    reset,
    setSelectedUri,
  };
}
