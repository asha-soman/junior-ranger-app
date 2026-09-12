import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Switch,
  ActivityIndicator,
  Alert,
  StyleSheet,
} from "react-native";

import apiClient from "@/src/services/api/client";

export default function SettingsScreen() {
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      setIsLoading(true);

      const response = await apiClient.get("/auth/profile");

      setTwoFactorEnabled(
        response.data.two_factor_enabled ?? false,
      );
    } catch (error: any) {
      const message =
        error?.response?.data?.message ||
        error?.message ||
        "Unable to load settings";

      Alert.alert("Error", message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleTwoFactorToggle = async (enabled: boolean) => {
    try {
      setIsUpdating(true);

      const response = await apiClient.patch("/auth/2fa", {
        enabled,
      });

      setTwoFactorEnabled(
        response.data.two_factor_enabled,
      );

      Alert.alert(
        "Success",
        enabled
          ? "Two-factor authentication has been enabled."
          : "Two-factor authentication has been disabled.",
      );
    } catch (error: any) {
      const message =
        error?.response?.data?.message ||
        error?.message ||
        "Unable to update two-factor authentication";

      Alert.alert("Error", message);
    } finally {
      setIsUpdating(false);
    }
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" />
        <Text style={styles.loadingText}>
          Loading settings...
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>
        Security
      </Text>

      <View style={styles.settingCard}>
        <View style={styles.settingTextContainer}>
          <Text style={styles.settingTitle}>
            Two-Factor Authentication
          </Text>

          <Text style={styles.settingDescription}>
            Require a verification code when signing in.
          </Text>

          <Text style={styles.statusText}>
            Status:{" "}
            {twoFactorEnabled
              ? "Enabled"
              : "Disabled"}
          </Text>
        </View>

        <Switch
          value={twoFactorEnabled}
          onValueChange={handleTwoFactorToggle}
          disabled={isUpdating}
        />
      </View>

      {isUpdating && (
        <View style={styles.updatingContainer}>
          <ActivityIndicator size="small" />

          <Text style={styles.updatingText}>
            Updating...
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F7F6",
    padding: 20,
  },

  loadingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },

  loadingText: {
    marginTop: 12,
    fontSize: 15,
  },

  sectionTitle: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 16,
    color: "#111111",
  },

  settingCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 18,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  settingTextContainer: {
    flex: 1,
    paddingRight: 16,
  },

  settingTitle: {
    fontSize: 17,
    fontWeight: "700",
    color: "#111111",
  },

  settingDescription: {
    fontSize: 14,
    color: "#667085",
    marginTop: 6,
  },

  statusText: {
    fontSize: 13,
    marginTop: 8,
    color: "#376E62",
    fontWeight: "600",
  },

  updatingContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 16,
  },

  updatingText: {
    marginLeft: 8,
    fontSize: 14,
  },
});