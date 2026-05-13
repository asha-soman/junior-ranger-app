import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
} from "react-native";

import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

import { AuthStackParamList } from "../../navigation/AuthNavigator";
import { AdminUser, getAdminUsers } from "../../services/admin/adminService";
import { assignRangerToCohort } from "../../services/cohorts/cohortService";
import { adminStyles as styles } from "../../styles/AdminManagementStyles";

type RouteProps = RouteProp<AuthStackParamList, "AssignRanger">;

type NavigationProp = NativeStackNavigationProp<
  AuthStackParamList,
  "AssignRanger"
>;

export default function AssignRangerScreen() {
  const route = useRoute<RouteProps>();
  const navigation = useNavigation<NavigationProp>();
  const { cohortId, assignedRangerId } = route.params;

  const [rangers, setRangers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [assigningId, setAssigningId] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState("");

  const loadRangers = async () => {
    try {
      setErrorMessage("");
      const data = await getAdminUsers("ranger", "approved");
      const uniqueRangers = data.filter(
        (ranger, index, self) =>
          index === self.findIndex((item) => item.id === ranger.id),
      );

      setRangers(uniqueRangers);
    } catch (error: any) {
      setErrorMessage(
        error?.response?.data?.message ||
          error?.message ||
          "Could not load rangers.",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRangers();
  }, []);

  const handleAssignRanger = async (rangerId: string) => {
    try {
      setAssigningId(rangerId);

      await assignRangerToCohort(cohortId, rangerId);

      Alert.alert("Success", "Ranger assigned successfully");
      navigation.goBack();
    } catch (error: any) {
      Alert.alert(
        "Error",
        error?.response?.data?.message ||
          error?.message ||
          "Failed to assign ranger",
      );
    } finally {
      setAssigningId(null);
    }
  };

  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: "center" }]}>
        <ActivityIndicator size="large" color="#376e62" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.detailTitleCentered}>Select Ranger</Text>

        {errorMessage ? (
          <Text style={styles.errorText}>{errorMessage}</Text>
        ) : rangers.length === 0 ? (
          <View style={styles.emptyCard}>
            <Text style={styles.emptyText}>No approved rangers found</Text>
          </View>
        ) : (
          rangers.map((ranger) => (
            <View key={ranger.id} style={styles.userCard}>
              <Text style={styles.userName}>
                {ranger.name || "No name provided"}
              </Text>

              <Text style={styles.userEmail}>{ranger.email}</Text>

              <TouchableOpacity
                style={{
                  backgroundColor:
                    assignedRangerId === ranger.id ? "#9CA3AF" : "#376e62",
                  paddingVertical: 12,
                  borderRadius: 12,
                  marginTop: 14,
                  alignItems: "center",
                }}
                onPress={() => handleAssignRanger(ranger.id)}
                disabled={
                  assigningId === ranger.id || assignedRangerId === ranger.id
                }
              >
                {assigningId === ranger.id ? (
                  <ActivityIndicator color="#FFFFFF" />
                ) : (
                  <Text
                    style={{
                      color: "#FFFFFF",
                      fontSize: 15,
                      fontWeight: "700",
                    }}
                  >
                    {assignedRangerId === ranger.id
                      ? "Assigned"
                      : "Assign Ranger"}
                  </Text>
                )}
              </TouchableOpacity>
            </View>
          ))
        )}
      </ScrollView>
    </View>
  );
}
