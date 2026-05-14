import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";

import {
  RouteProp,
  useRoute,
  useNavigation,
  useFocusEffect,
} from "@react-navigation/native";

import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Ionicons } from "@expo/vector-icons";

import AppBottomTabBar from "../../components/navigation/AppBottomTabBar";
import { AuthStackParamList } from "../../navigation/AuthNavigator";

import {
  Cohort,
  CohortMember,
  getCohortById,
  getCohortMembers,
} from "../../services/cohorts/cohortService";

import { adminStyles as styles } from "../../styles/AdminManagementStyles";

type RouteProps = RouteProp<AuthStackParamList, "AdminCohortDetails">;

type NavigationProp = NativeStackNavigationProp<
  AuthStackParamList,
  "AdminCohortDetails"
>;

export default function AdminCohortDetailsScreen() {
  const route = useRoute<RouteProps>();
  const navigation = useNavigation<NavigationProp>();

  const { cohortId } = route.params;
  const userRole = route.params?.userRole ?? "admin";

  const [cohort, setCohort] = useState<Cohort | null>(null);
  const [members, setMembers] = useState<CohortMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

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

  const memberCount = cohort.member_count ?? members.length;

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={[styles.content, { paddingBottom: 110 }]}
      >
        <View
          style={{
            backgroundColor: "#FFFFFF",
            borderRadius: 24,
            padding: 20,
            marginBottom: 22,
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
                width: 76,
                height: 76,
                borderRadius: 38,
                backgroundColor: "#DFF0EA",
                alignItems: "center",
                justifyContent: "center",
                marginRight: 16,
              }}
            >
              <Ionicons name="leaf" size={36} color="#2F6F61" />
            </View>

            <View style={{ flex: 1 }}>
              <Text
                style={{
                  fontSize: 23,
                  fontWeight: "700",
                  color: "#1F1F1F",
                  lineHeight: 29,
                }}
              >
                {cohort.name}
              </Text>

              <Text
                style={{
                  fontSize: 14,
                  color: "#5B5B5B",
                  marginTop: 6,
                  lineHeight: 20,
                }}
              >
                {cohort.description || "No description provided"}
              </Text>
            </View>
          </View>

          <View
            style={{
              height: 1,
              backgroundColor: "#E5E7EB",
              marginVertical: 18,
            }}
          />

          <View style={{ gap: 14 }}>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Ionicons name="location" size={22} color="#2F6F61" />
                <Text
                  style={{
                    fontSize: 15,
                    fontWeight: "700",
                    color: "#214C45",
                    marginLeft: 8,
                  }}
                >
                  Location
                </Text>
              </View>

              <Text style={{ fontSize: 15, color: "#222", flexShrink: 1 }}>
                {cohort.location || "Not specified"}
              </Text>
            </View>

            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Ionicons name="person-circle" size={22} color="#2F6F61" />
                <Text
                  style={{
                    fontSize: 15,
                    fontWeight: "700",
                    color: "#214C45",
                    marginLeft: 8,
                  }}
                >
                  Assigned Ranger
                </Text>
              </View>

              <Text style={{ fontSize: 15, color: "#222", flexShrink: 1 }}>
                {cohort.assigned_ranger_name || "No ranger assigned"}
              </Text>
            </View>
          </View>

          <View
            style={{
              alignSelf: "flex-start",
              backgroundColor: "#3B7C6D",
              borderRadius: 20,
              paddingHorizontal: 16,
              paddingVertical: 9,
              flexDirection: "row",
              alignItems: "center",
              marginTop: 20,
            }}
          >
            <Ionicons name="people-outline" size={17} color="#FFFFFF" />
            <Text
              style={{
                color: "#FFFFFF",
                fontSize: 15,
                fontWeight: "700",
                marginLeft: 6,
              }}
            >
              {memberCount} {memberCount === 1 ? "member" : "members"}
            </Text>
          </View>

          {userRole !== "junior_ranger" && (
            <View style={{ marginTop: 22 }}>
              <View style={{ flexDirection: "row", gap: 12 }}>
                <TouchableOpacity
                  style={{
                    flex: 1,
                    backgroundColor: "#E5F0E8",
                    borderRadius: 28,
                    paddingVertical: 16,
                    alignItems: "center",
                  }}
                  onPress={() =>
                    navigation.navigate("EditCohort", {
                      cohortId,
                      userRole,
                    })
                  }
                >
                  <Ionicons name="create-outline" size={24} color="#2F6F61" />
                  <Text
                    style={{
                      marginTop: 8,
                      fontWeight: "700",
                      color: "#214C45",
                    }}
                  >
                    Edit
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={{
                    flex: 1,
                    backgroundColor: "#E5F0E8",
                    borderRadius: 28,
                    paddingVertical: 16,
                    alignItems: "center",
                  }}
                  onPress={() =>
                    console.log("Generate invite code for cohort:", cohortId)
                  }
                >
                  <Ionicons name="ticket-outline" size={24} color="#2F6F61" />
                  <Text
                    style={{
                      marginTop: 8,
                      fontWeight: "700",
                      color: "#214C45",
                    }}
                  >
                    Invite
                  </Text>
                </TouchableOpacity>
              </View>

              {userRole === "admin" && (
                <TouchableOpacity
                  style={{
                    backgroundColor: "#DCEBE7",
                    borderRadius: 18,
                    paddingVertical: 16,
                    alignItems: "center",
                    marginTop: 12,
                  }}
                  onPress={() =>
                    navigation.navigate("AssignRanger", {
                      cohortId,
                      assignedRangerId: cohort.assigned_ranger_id,
                    })
                  }
                >
                  <Ionicons
                    name="person-add-outline"
                    size={24}
                    color="#2F6F61"
                  />
                  <Text
                    style={{
                      marginTop: 8,
                      fontWeight: "700",
                      color: "#214C45",
                    }}
                  >
                    Assign Ranger
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          )}
        </View>

        {userRole !== "junior_ranger" && (
          <>
            <Text
              style={{
                fontSize: 22,
                fontWeight: "700",
                color: "#1F1F1F",
                marginBottom: 14,
              }}
            >
              Members
            </Text>

            {members.length === 0 ? (
              <View style={styles.emptyCard}>
                <Text style={styles.emptyText}>This cohort has no members</Text>
              </View>
            ) : (
              members.map((member) => (
                <View
                  key={member.id}
                  style={{
                    backgroundColor: "#FFFFFF",
                    borderRadius: 20,
                    padding: 18,
                    marginBottom: 14,
                    borderWidth: 1,
                    borderColor: "#EFEFEF",
                    shadowColor: "#000",
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.06,
                    shadowRadius: 6,
                    elevation: 2,
                  }}
                >
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <View
                      style={{
                        width: 48,
                        height: 48,
                        borderRadius: 24,
                        backgroundColor: "#DFF0EA",
                        alignItems: "center",
                        justifyContent: "center",
                        marginRight: 14,
                      }}
                    >
                      <Ionicons name="person" size={24} color="#2F6F61" />
                    </View>

                    <View style={{ flex: 1 }}>
                      <Text
                        style={{
                          fontSize: 18,
                          fontWeight: "700",
                          color: "#1F1F1F",
                        }}
                      >
                        {member.name || "No name provided"}
                      </Text>

                      <Text
                        style={{
                          fontSize: 14,
                          color: "#555",
                          marginTop: 4,
                        }}
                      >
                        {member.email || "No email provided"}
                      </Text>
                    </View>
                  </View>

                  <View
                    style={{
                      height: 1,
                      backgroundColor: "#E5E7EB",
                      marginVertical: 14,
                    }}
                  />

                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 15,
                        fontWeight: "700",
                        color: "#214C45",
                      }}
                    >
                      Role
                    </Text>

                    <View
                      style={{
                        backgroundColor: "#E5F0E8",
                        borderRadius: 16,
                        paddingHorizontal: 12,
                        paddingVertical: 6,
                      }}
                    >
                      <Text
                        style={{
                          fontSize: 14,
                          fontWeight: "700",
                          color: "#2F6F61",
                        }}
                      >
                        {member.cohort_role.charAt(0).toUpperCase() +
                          member.cohort_role.slice(1)}
                      </Text>
                    </View>
                  </View>
                </View>
              ))
            )}
          </>
        )}
      </ScrollView>

      <AppBottomTabBar role={userRole} activeTab="menu" />
    </View>
  );
}
