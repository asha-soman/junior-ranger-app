import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Share,
} from "react-native";
import { RouteProp, useRoute, useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Ionicons } from "@expo/vector-icons";
import * as Clipboard from "expo-clipboard";
import { Snackbar } from "react-native-paper";

import { AuthStackParamList } from "../../navigation/AuthNavigator";
import { generateInviteCode, InviteCode } from "../../services/cohorts/cohortService";
import AppBottomTabBar from "../../components/navigation/AppBottomTabBar";

type RouteProps = RouteProp<AuthStackParamList, "GenerateInviteCode">;
type NavigationProp = NativeStackNavigationProp<AuthStackParamList, "GenerateInviteCode">;

export default function GenerateInviteCodeScreen() {
  const route = useRoute<RouteProps>();
  const navigation = useNavigation<NavigationProp>();
  const { cohortId } = route.params;

  const [inviteCode, setInviteCode] = useState<InviteCode | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  const showMessage = (msg: string) => {
    setSnackbarMessage(msg);
    setSnackbarVisible(true);
  };

  const fetchInviteCode = async () => {
    try {
      setLoading(true);
      setError("");
      // Default: 10 usage, 7 days expiry (handled by backend if not sent, but we can be explicit)
      const data = await generateInviteCode(cohortId, {
        max_usage: 10,
      });
      setInviteCode(data);
    } catch (err: any) {
      setError(err?.response?.data?.message || err?.message || "Failed to generate invite code.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInviteCode();
  }, [cohortId]);

  const copyToClipboard = async () => {
    if (inviteCode) {
      await Clipboard.setStringAsync(inviteCode.code);
      showMessage("Invite code copied to clipboard!");
    }
  };

  const shareCode = async () => {
    if (inviteCode) {
      try {
        await Share.share({
          message: `Join our cohort using this invite code: ${inviteCode.code}`,
        });
      } catch (error) {
        console.log("Error sharing:", error);
      }
    }
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#2F6F61" />
        <Text style={styles.loadingText}>Generating your code...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <View style={styles.errorCard}>
          <Ionicons name="alert-circle" size={48} color="#E53E3E" />
          <Text style={styles.errorTitle}>Error</Text>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={fetchInviteCode}>
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <View style={styles.header}>
          <View style={styles.iconContainer}>
            <Ionicons name="ticket" size={32} color="#2F6F61" />
          </View>
          <Text style={styles.title}>Your Invite Code</Text>
          <Text style={styles.subtitle}>
            Share this code with Junior Rangers so they can join this cohort.
          </Text>
        </View>

        {inviteCode && (
          <View style={styles.codeContainer}>
            <Text style={styles.codeText}>{inviteCode.code}</Text>
            <TouchableOpacity style={styles.copyIcon} onPress={copyToClipboard}>
              <Ionicons name="copy-outline" size={24} color="#2F6F61" />
            </TouchableOpacity>
          </View>
        )}

        <View style={styles.detailsContainer}>
          <View style={styles.detailRow}>
            <Ionicons name="calendar-outline" size={20} color="#5B5B5B" />
            <Text style={styles.detailLabel}>Expires on:</Text>
            <Text style={styles.detailValue}>
              {inviteCode ? new Date(inviteCode.expiry_date).toLocaleDateString() : "N/A"}
            </Text>
          </View>

          <View style={styles.detailRow}>
            <Ionicons name="people-outline" size={20} color="#5B5B5B" />
            <Text style={styles.detailLabel}>Max Usage:</Text>
            <Text style={styles.detailValue}>
              {inviteCode?.max_usage || 10} times
            </Text>
          </View>
        </View>

        <View style={styles.buttonRow}>
          <TouchableOpacity style={styles.shareButton} onPress={shareCode}>
            <Ionicons name="share-social-outline" size={20} color="#FFFFFF" />
            <Text style={styles.shareButtonText}>Share Code</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.doneButton} onPress={() => navigation.goBack()}>
            <Text style={styles.doneButtonText}>Done</Text>
          </TouchableOpacity>
        </View>
      </View>

      <Snackbar
        visible={snackbarVisible}
        onDismiss={() => setSnackbarVisible(false)}
        duration={2000}
      >
        {snackbarMessage}
      </Snackbar>

      <AppBottomTabBar role="ranger" activeTab="menu" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F7FAFC",
    padding: 20,
    justifyContent: "center",
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F7FAFC",
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: "#2F6F61",
    fontWeight: "600",
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    padding: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  header: {
    alignItems: "center",
    marginBottom: 32,
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "#DFF0EA",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1A202C",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: "#718096",
    textAlign: "center",
    lineHeight: 20,
  },
  codeContainer: {
    flexDirection: "row",
    backgroundColor: "#EDF2F7",
    borderRadius: 16,
    padding: 20,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 32,
    borderWidth: 2,
    borderColor: "#CBD5E0",
    borderStyle: "dashed",
  },
  codeText: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#2D3748",
    letterSpacing: 4,
    flex: 1,
    textAlign: "center",
  },
  copyIcon: {
    padding: 4,
  },
  detailsContainer: {
    marginBottom: 32,
    gap: 12,
  },
  detailRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  detailLabel: {
    fontSize: 15,
    color: "#4A5568",
    marginLeft: 8,
    flex: 1,
  },
  detailValue: {
    fontSize: 15,
    fontWeight: "600",
    color: "#2D3748",
  },
  buttonRow: {
    flexDirection: "row",
    gap: 12,
  },
  shareButton: {
    flex: 2,
    backgroundColor: "#2F6F61",
    borderRadius: 16,
    paddingVertical: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  shareButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  doneButton: {
    flex: 1,
    backgroundColor: "#E2E8F0",
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  doneButtonText: {
    color: "#4A5568",
    fontSize: 16,
    fontWeight: "bold",
  },
  errorCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    padding: 32,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  errorTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#1A202C",
    marginTop: 16,
    marginBottom: 8,
  },
  errorText: {
    fontSize: 15,
    color: "#718096",
    textAlign: "center",
    marginBottom: 24,
    lineHeight: 22,
  },
  retryButton: {
    backgroundColor: "#2F6F61",
    borderRadius: 12,
    paddingHorizontal: 32,
    paddingVertical: 12,
  },
  retryButtonText: {
    color: "#FFFFFF",
    fontWeight: "bold",
    fontSize: 16,
  },
});
