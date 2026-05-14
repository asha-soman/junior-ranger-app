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
import { Ionicons } from "@expo/vector-icons";

import { AuthStackParamList } from "../../navigation/AuthNavigator";
import { AdminUser, getAdminUsers } from "../../services/admin/adminService";
import { assignRangerToCohort } from "../../services/cohorts/cohortService";
import { adminStyles as styles } from "../../styles/AdminManagementStyles";
import AppBottomTabBar from "../../components/navigation/AppBottomTabBar";

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
      <ScrollView
        contentContainerStyle={[styles.content, { paddingBottom: 110 }]}
      >
        <Text
          style={{
            fontSize: 24,
            fontWeight: "700",
            color: "#1F1F1F",
            textAlign: "center",
            marginBottom: 22,
          }}
        >
          Select Ranger
        </Text>

        {errorMessage ? (
          <Text style={styles.errorText}>{errorMessage}</Text>
        ) : rangers.length === 0 ? (
          <View style={styles.emptyCard}>
            <Text style={styles.emptyText}>No approved rangers found</Text>
          </View>
        ) : (
          rangers.map((ranger) => {
            const isAssigned = assignedRangerId === ranger.id;

            return (
              <View
                key={ranger.id}
                style={{
                  backgroundColor: "#FFFFFF",
                  borderRadius: 22,
                  padding: 18,
                  marginBottom: 16,
                  borderWidth: 1,
                  borderColor: "#EFEFEF",
                  shadowColor: "#000",
                  shadowOffset: { width: 0, height: 3 },
                  shadowOpacity: 0.08,
                  shadowRadius: 8,
                  elevation: 3,
                }}
              >
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <View
                    style={{
                      width: 52,
                      height: 52,
                      borderRadius: 26,
                      backgroundColor: "#DFF0EA",
                      alignItems: "center",
                      justifyContent: "center",
                      marginRight: 14,
                    }}
                  >
                    <Ionicons name="person" size={26} color="#2F6F61" />
                  </View>

                  <View style={{ flex: 1 }}>
                    <Text
                      style={{
                        fontSize: 18,
                        fontWeight: "700",
                        color: "#1F1F1F",
                      }}
                    >
                      {ranger.name || "No name provided"}
                    </Text>

                    <Text
                      style={{
                        fontSize: 14,
                        color: "#555",
                        marginTop: 4,
                      }}
                    >
                      {ranger.email}
                    </Text>
                  </View>
                </View>

                <TouchableOpacity
                  style={{
                    backgroundColor: isAssigned ? "#A7AFB8" : "#376e62",
                    paddingVertical: 13,
                    borderRadius: 18,
                    marginTop: 16,
                    alignItems: "center",
                    justifyContent: "center",
                    flexDirection: "row",
                  }}
                  onPress={() => handleAssignRanger(ranger.id)}
                  disabled={assigningId === ranger.id || isAssigned}
                >
                  {assigningId === ranger.id ? (
                    <ActivityIndicator color="#FFFFFF" />
                  ) : (
                    <>
                      <Ionicons
                        name={isAssigned ? "checkmark-circle" : "person-add"}
                        size={20}
                        color="#FFFFFF"
                      />
                      <Text
                        style={{
                          color: "#FFFFFF",
                          fontSize: 15,
                          fontWeight: "700",
                          marginLeft: 8,
                        }}
                      >
                        {isAssigned ? "Assigned" : "Assign Ranger"}
                      </Text>
                    </>
                  )}
                </TouchableOpacity>
              </View>
            );
          })
        )}
      </ScrollView>

      <AppBottomTabBar role="admin" activeTab="menu" />
    </View>
  );
}