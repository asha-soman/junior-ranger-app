import React, { useEffect, useState, useCallback } from "react";
import { View, Text, ScrollView, ActivityIndicator } from "react-native";
import {
  RouteProp,
  useRoute,
  useNavigation,
  useFocusEffect,
} from "@react-navigation/native";
import AdminBottomTabBar from "../../components/admin/AdminBottomTabBar";
import { AuthStackParamList } from "../../navigation/AuthNavigator";
import {
  Cohort,
  CohortMember,
  getCohortById,
  getCohortMembers,
} from "../../services/cohorts/cohortService";
import { adminStyles as styles } from "../../styles/AdminManagementStyles";
import { TouchableOpacity } from "react-native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

type RouteProps = RouteProp<AuthStackParamList, "AdminCohortDetails">;
type NavigationProp = NativeStackNavigationProp<
  AuthStackParamList,
  "AdminCohortDetails"
>;

export default function AdminCohortDetailsScreen() {
  const route = useRoute<RouteProps>();
  const navigation = useNavigation<NavigationProp>();
  const { cohortId } = route.params;

  const [cohort, setCohort] = useState<Cohort | null>(null);
  const [members, setMembers] = useState<CohortMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const userRole = route.params?.userRole ?? "admin";

  const loadCohortDetails = async () => {
    try {
      setErrorMessage("");

      const cohortData = await getCohortById(cohortId);
      setCohort(cohortData);

      if (userRole === "admin" || userRole === "ranger") {
        const membersData = await getCohortMembers(cohortId);
        setMembers(membersData);
      } else {
        setMembers([]);
      }
    } catch (error: any) {
      setErrorMessage(
        error?.response?.data?.message ||
          error?.message ||
          "Could not load cohort details.",
      );
    } finally {
      setLoading(false);
    }
  };
  useFocusEffect(
    useCallback(() => {
      setLoading(true);
      loadCohortDetails();
    }, [cohortId]),
  );

  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: "center" }]}>
        <ActivityIndicator size="large" color="#376e62" />
      </View>
    );
  }

  if (errorMessage || !cohort) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>{errorMessage}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.detailCard}>
          <Text style={styles.detailTitleCentered}>{cohort.name}</Text>

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Description</Text>
            <Text style={styles.detailValue}>
              {cohort.description || "No description provided"}
            </Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Location</Text>
            <Text style={styles.detailValue}>
              {cohort.location || "Not specified"}
            </Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Assigned Ranger</Text>
            <Text style={styles.detailValue}>
              {cohort.assigned_ranger_name || "No ranger assigned"}
            </Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Member count</Text>
            <Text style={styles.detailValue}>
              {cohort.member_count ?? members.length}
            </Text>
          </View>
          {userRole !== "junior_ranger" && (
            <TouchableOpacity
              style={{
                backgroundColor: "#376e62",
                paddingVertical: 14,
                borderRadius: 12,
                marginTop: 20,
                alignItems: "center",
                justifyContent: "center",
              }}
              onPress={() =>
                navigation.navigate("EditCohort", {
                  cohortId,
                })
              }
            >
              <Text
                style={{
                  color: "#FFFFFF",
                  fontSize: 16,
                  fontWeight: "700",
                }}
              >
                Edit Cohort
              </Text>
            </TouchableOpacity>
          )}
          {userRole === "admin" && (
            <TouchableOpacity
              style={{
                backgroundColor: "#2f5f55",
                paddingVertical: 14,
                borderRadius: 12,
                marginTop: 12,
                alignItems: "center",
                justifyContent: "center",
              }}
              onPress={() =>
                navigation.navigate("AssignRanger", {
                  cohortId,
                  assignedRangerId: cohort.assigned_ranger_id,
                })
              }
            >
              <Text
                style={{
                  color: "#FFFFFF",
                  fontSize: 16,
                  fontWeight: "700",
                }}
              >
                Assign Ranger
              </Text>
            </TouchableOpacity>
          )}
        </View>

        {userRole !== "junior_ranger" && (
          <>
            <Text style={styles.membersTitle}>Members</Text>

            {members.length === 0 ? (
              <View style={styles.emptyCard}>
                <Text style={styles.emptyText}>This cohort has no members</Text>
              </View>
            ) : (
              members.map((member) => (
                <View key={member.id} style={styles.userCard}>
                  <Text style={styles.userName}>
                    {member.name || "No name provided"}
                  </Text>

                  <Text style={styles.userEmail}>
                    {member.email || "No email provided"}
                  </Text>

                  <View style={styles.userInfoRow}>
                    <Text style={styles.userInfoLabel}>Role</Text>
                    <Text style={styles.userInfoValue}>
                      {member.cohort_role.charAt(0).toUpperCase() +
                        member.cohort_role.slice(1)}
                    </Text>
                  </View>
                </View>
              ))
            )}
          </>
        )}
      </ScrollView>
      <AdminBottomTabBar activeTab={undefined} />
    </View>
  );
}
