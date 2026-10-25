import React from "react";
import {
  ActivityIndicator,
  StyleProp,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { UploadStatus } from "../../hooks/useImageUpload";

interface ImageUploadFeedbackProps {
  status: UploadStatus;
  progress: number;
  error: string | null;
  onRetry?: () => void;
  onCancel?: () => void;
  style?: StyleProp<ViewStyle>;
}

export default function ImageUploadFeedback({
  status,
  progress,
  error,
  onRetry,
  onCancel,
  style,
}: ImageUploadFeedbackProps) {
  if (status === "idle") {
    return null;
  }

  if (status === "uploading") {
    const clampedProgress = Math.min(100, Math.max(0, progress));

    return (
      <View style={[styles.container, styles.uploadingContainer, style]}>
        <View style={styles.headerRow}>
          <ActivityIndicator size="small" color="#3D786B" />
          <Text style={styles.uploadingText}>
            Uploading image... {clampedProgress}%
          </Text>
        </View>

        {/* Progress Bar Track */}
        <View style={styles.progressBarTrack}>
          <View
            style={[styles.progressBarFill, { width: `${clampedProgress}%` }]}
          />
        </View>
      </View>
    );
  }

  if (status === "error") {
    return (
      <View style={[styles.container, styles.errorContainer, style]}>
        <View style={styles.errorHeaderRow}>
          <Ionicons
            name="alert-circle"
            size={20}
            color="#C0392B"
            style={styles.errorIcon}
          />
          <Text style={styles.errorTitle}>Upload Failed</Text>
        </View>

        <Text style={styles.errorMessage}>
          {error || "Unable to upload image. Please check your connection."}
        </Text>

        <View style={styles.actionRow}>
          {onRetry && (
            <TouchableOpacity
              style={styles.retryButton}
              onPress={onRetry}
              activeOpacity={0.8}
            >
              <Ionicons name="reload" size={16} color="#FFFFFF" />
              <Text style={styles.retryButtonText}>Retry Upload</Text>
            </TouchableOpacity>
          )}

          {onCancel && (
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={onCancel}
              activeOpacity={0.8}
            >
              <Text style={styles.cancelButtonText}>Remove Image</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    );
  }

  if (status === "success") {
    return (
      <View style={[styles.container, styles.successContainer, style]}>
        <Ionicons name="checkmark-circle" size={18} color="#27AE60" />
        <Text style={styles.successText}>Image uploaded successfully</Text>
      </View>
    );
  }

  return null;
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    borderRadius: 10,
    padding: 12,
    marginVertical: 8,
  },
  uploadingContainer: {
    backgroundColor: "#F2F9F7",
    borderWidth: 1,
    borderColor: "#C7DDD7",
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  uploadingText: {
    marginLeft: 8,
    fontSize: 13,
    fontWeight: "600",
    color: "#2C5B51",
  },
  progressBarTrack: {
    height: 6,
    backgroundColor: "#DFECE8",
    borderRadius: 3,
    overflow: "hidden",
    width: "100%",
  },
  progressBarFill: {
    height: "100%",
    backgroundColor: "#3D786B",
    borderRadius: 3,
  },
  errorContainer: {
    backgroundColor: "#FDF4F2",
    borderWidth: 1,
    borderColor: "#F5C6CB",
  },
  errorHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  errorIcon: {
    marginRight: 6,
  },
  errorTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#C0392B",
  },
  errorMessage: {
    fontSize: 12,
    color: "#6E2B24",
    lineHeight: 17,
    marginBottom: 10,
    marginLeft: 26,
  },
  actionRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginLeft: 26,
  },
  retryButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#3D786B",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
    gap: 6,
  },
  retryButtonText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "600",
  },
  cancelButton: {
    paddingVertical: 6,
    paddingHorizontal: 10,
  },
  cancelButtonText: {
    color: "#7F8C8D",
    fontSize: 12,
    fontWeight: "500",
  },
  successContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F2FAF5",
    borderWidth: 1,
    borderColor: "#C3E6CB",
    gap: 6,
  },
  successText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#1E7E34",
  },
});
