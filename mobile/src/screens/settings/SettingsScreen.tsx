import React, { useEffect, useState } from "react";
import { View, Text, Switch, ActivityIndicator, Alert, StyleSheet } from "react-native";
import apiClient from "@/src/services/api/client";
import { getNotificationPreferences, updateNotificationPreferences } from "@/src/services/notifications/notificationService";

export default function SettingsScreen() {
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [eventUpdatesEnabled, setEventUpdatesEnabled] = useState(true);
  const [eventRemindersEnabled, setEventRemindersEnabled] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdatingTwoFactor, setIsUpdatingTwoFactor] = useState(false);
  const [isUpdatingEventUpdates, setIsUpdatingEventUpdates] = useState(false);
  const [isUpdatingEventReminders, setIsUpdatingEventReminders] = useState(false);
  
  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      setIsLoading(true);

  const [profileResponse, notificationPreferences] =
    await Promise.all([
      apiClient.get("/auth/profile"),
      getNotificationPreferences(),
    ]);

  setTwoFactorEnabled(
    profileResponse.data.two_factor_enabled ?? false,
  );

  setEventUpdatesEnabled(
    notificationPreferences.event_updates_enabled,
  );

  setEventRemindersEnabled(
    notificationPreferences.event_reminders_enabled,
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
      setIsUpdatingTwoFactor(true);

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
      setIsUpdatingTwoFactor(false);
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

  const handleEventUpdatesToggle = async (
    enabled: boolean,
  ) => {
    try {
      setIsUpdatingEventUpdates(true);

      const updatedPreferences =
        await updateNotificationPreferences({
          event_updates_enabled: enabled,
        });

      setEventUpdatesEnabled(
        updatedPreferences.event_updates_enabled,
      );
    } catch (error: any) {
      const message =
        error?.response?.data?.message ||
        error?.message ||
        "Unable to update notification preferences";

      Alert.alert("Error", message);
    } finally {
      setIsUpdatingEventUpdates(false);
    }
  };

  const handleEventRemindersToggle = async (
    enabled: boolean,
  ) => {
    try {
      setIsUpdatingEventReminders(true);

      const updatedPreferences =
        await updateNotificationPreferences({
          event_reminders_enabled: enabled,
        });

      setEventRemindersEnabled(
        updatedPreferences.event_reminders_enabled,
      );
    } catch (error: any) {
      const message =
        error?.response?.data?.message ||
        error?.message ||
        "Unable to update notification preferences";

      Alert.alert("Error", message);
    } finally {
      setIsUpdatingEventReminders(false);
    }
  };

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
          disabled={isUpdatingTwoFactor}
        />
      </View>

      <Text
        style={[
          styles.sectionTitle,
          styles.notificationSectionTitle,
        ]}
      >
        Notifications
      </Text>

      <Text style={styles.subsectionTitle}>
        Events
      </Text>

      <Text style={styles.importantNotificationText}>
        Event cancellation notifications cannot be disabled.
      </Text>

      <View style={styles.settingCard}>
        <View style={styles.settingTextContainer}>
          <Text style={styles.settingTitle}>
            Event Updates
          </Text>

          <Text style={styles.settingDescription}>
            Receive notifications when event details are changed.
          </Text>

          <Text style={styles.statusText}>
            Status:{" "}
            {eventUpdatesEnabled
              ? "Enabled"
              : "Disabled"}
          </Text>
        </View>

        <Switch
          value={eventUpdatesEnabled}
          onValueChange={handleEventUpdatesToggle}
          disabled={isUpdatingEventUpdates}
        />
      </View>

      <View
        style={[
          styles.settingCard,
          styles.notificationCard,
        ]}
      >
        <View style={styles.settingTextContainer}>
          <Text style={styles.settingTitle}>
            Event Reminders
          </Text>

          <Text style={styles.settingDescription}>
            Receive reminders for upcoming registered events.
          </Text>

          <Text style={styles.statusText}>
            Status:{" "}
            {eventRemindersEnabled
              ? "Enabled"
              : "Disabled"}
          </Text>
        </View>

        <Switch
          value={eventRemindersEnabled}
          onValueChange={handleEventRemindersToggle}
          disabled={isUpdatingEventReminders}
        />
      </View>       
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
    marginBottom: 14,
    color: "#111111",
  },

  subsectionTitle: {
    fontSize: 17,
    fontWeight: "700",
    color: "#32636c",
    marginBottom: 6,
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

  notificationSectionTitle: {
    marginTop: 28,
  },

  notificationCard: {
    marginTop: 12,
  },

  importantNotificationText: {
    fontSize: 13,
    lineHeight: 18,
    color: "#667085",
    marginBottom: 14,
  },
});