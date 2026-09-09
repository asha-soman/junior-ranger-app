import React, { useEffect, useRef, useState, useCallback } from "react";
import {
  View,
  Text,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
  TextInput,
} from "react-native";
import {
  useNavigation,
  useFocusEffect,
  RouteProp,
  useRoute,
} from "@react-navigation/native";
import AppBottomTabBar from "../../components/navigation/AppBottomTabBar";
import { Ionicons } from "@expo/vector-icons";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Cohort, getCohorts, getCohortsPaginated, } from "../../services/cohorts/cohortService";
import { AuthStackParamList } from "../../navigation/AuthNavigator";
import { adminStyles as styles } from "../../styles/AdminManagementStyles";

type NavigationProp = NativeStackNavigationProp<
  AuthStackParamList,
  "AdminCohorts"
>;

type RouteProps = RouteProp<AuthStackParamList, "AdminCohorts">;

export default function AdminCohortsScreen() {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<RouteProps>();

  const hasMounted = useRef(false);

  const [cohorts, setCohorts] = useState<Cohort[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFiltering, setIsFiltering] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [searchName, setSearchName] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCohorts, setTotalCohorts] = useState(0);

  const COHORTS_PER_PAGE = 6;

  const userRole = route.params?.userRole ?? "admin";
  const canCreateCohort = userRole === "admin" || userRole === "ranger";

  const loadCohorts = async (page = 1) => {
  try {
    setErrorMessage("");

    if (loading) {
      setLoading(true);
    } else {
      setIsFiltering(true);
    }

    const result = await getCohortsPaginated(
      page,
      COHORTS_PER_PAGE,
    );

    setCohorts(result.cohorts);
    setCurrentPage(result.pagination.page);
    setTotalPages(result.pagination.totalPages);
    setTotalCohorts(result.pagination.total);
  } catch (error: any) {
    setErrorMessage(
      error?.response?.data?.message ||
        error?.message ||
        "Could not load cohorts.",
    );
  } finally {
    setLoading(false);
    setIsFiltering(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadCohorts();
    }, []),
  );

  useEffect(() => {
    if (!hasMounted.current) {
      hasMounted.current = true;
      return;
    }
  }, [searchName]);

  const filteredCohorts = cohorts.filter((cohort) =>
    cohort.name.toLowerCase().includes(searchName.toLowerCase().trim()),
  );

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
        contentContainerStyle={[
          styles.content,
          { paddingBottom: canCreateCohort ? 110 : 80 },
        ]}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.searchContainer}>
          <Ionicons
            name="search"
            size={22}
            color="#777"
            style={styles.searchIcon}
          />

          <TextInput
            style={styles.searchInput}
            placeholder="Search by cohort name"
            placeholderTextColor="#777"
            value={searchName}
            onChangeText={setSearchName}
          />
        </View>

        {errorMessage ? (
          <Text style={styles.errorText}>{errorMessage}</Text>
        ) : filteredCohorts.length === 0 ? (
          <View style={styles.emptyCard}>
            <Text style={styles.emptyText}>
              {userRole === 'junior_ranger' && searchName === ''
                ? "You haven't joined a club yet."
                : "No cohorts found"}
            </Text>
            {userRole === 'junior_ranger' && searchName === '' && (
              <TouchableOpacity
                style={[styles.actionButton, styles.approveButton, { marginTop: 20, paddingHorizontal: 24, paddingVertical: 10 }]}
                onPress={() => navigation.navigate("JoinCohort" as never)}
              >
                <Text style={styles.actionButtonText}>Join a Club</Text>
              </TouchableOpacity>
            )}
          </View>
        ) : (
          filteredCohorts.map((cohort) => (
            <TouchableOpacity
              key={cohort.id}
              activeOpacity={0.85}
              onPress={() =>
                navigation.navigate("AdminCohortDetails", {
                  cohortId: cohort.id,
                  userRole,
                })
              }
              style={{
                backgroundColor: "#FFFFFF",
                borderRadius: 22,
                padding: 18,
                marginBottom: 18,
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 3 },
                shadowOpacity: 0.08,
                shadowRadius: 8,
                elevation: 3,
                borderWidth: 1,
                borderColor: "#EFEFEF",
              }}
            >
              <View style={{ flexDirection: "row", alignItems: "flex-start" }}>
                <View
                  style={{
                    width: 74,
                    height: 74,
                    borderRadius: 37,
                    backgroundColor: "#DFF0EA",
                    alignItems: "center",
                    justifyContent: "center",
                    marginRight: 16,
                  }}
                >
                  <Ionicons name="leaf" size={34} color="#2F6F61" />
                </View>

                <View style={{ flex: 1 }}>
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                      alignItems: "flex-start",
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 20,
                        fontWeight: "700",
                        color: "#1F1F1F",
                        flex: 1,
                      }}
                    >
                      {cohort.name}
                    </Text>

                    <Ionicons name="ellipsis-vertical" size={22} color="#333" />
                  </View>

                  <Text
                    style={{
                      fontSize: 14,
                      color: "#555",
                      lineHeight: 21,
                      marginTop: 8,
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
                  marginVertical: 16,
                }}
              />

              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginBottom: 12,
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

                <Text style={{ fontSize: 15, color: "#222" }}>
                  {cohort.location || "Not specified"}
                </Text>
              </View>

              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginBottom: 16,
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

                <Text style={{ fontSize: 15, color: "#222" }}>
                  {cohort.assigned_ranger_name || "No ranger assigned"}
                </Text>
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
                  {cohort.member_count ?? 0}{" "}
                  {(cohort.member_count ?? 0) === 1 ? "member" : "members"}
                </Text>
              </View>
            </TouchableOpacity>
          ))
        )}
{!loading && filteredCohorts.length > 0 && (
  <Text
    style={{
      textAlign: "center",
      marginTop: 8,
      marginBottom: 12,
      fontWeight: "600",
      color: "#555",
    }}
  >
    {totalCohorts} cohorts found
  </Text>
)}

{!loading && totalPages > 1 && (
  <View
    style={{
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center",
      marginBottom: 20,
      gap: 12,
    }}
  >
    <TouchableOpacity
      disabled={currentPage === 1}
      onPress={() => loadCohorts(currentPage - 1)}
      style={{
        backgroundColor:
          currentPage === 1 ? "#CCCCCC" : "#376E62",
        paddingHorizontal: 18,
        paddingVertical: 10,
        borderRadius: 8,
      }}
    >
      <Text style={{ color: "white", fontWeight: "700" }}>
        Previous
      </Text>
    </TouchableOpacity>

    <Text style={{ fontWeight: "700" }}>
      {currentPage} / {totalPages}
    </Text>

    <TouchableOpacity
      disabled={currentPage === totalPages}
      onPress={() => loadCohorts(currentPage + 1)}
      style={{
        backgroundColor:
          currentPage === totalPages ? "#CCCCCC" : "#376E62",
        paddingHorizontal: 18,
        paddingVertical: 10,
        borderRadius: 8,
      }}
    >
      <Text style={{ color: "white", fontWeight: "700" }}>
        Next
      </Text>
    </TouchableOpacity>
  </View>
)}
      </ScrollView>

      {canCreateCohort && (
        <TouchableOpacity
          activeOpacity={0.85}
          style={{
            position: "absolute",
            right: 22,
            bottom: 105,
            width: 58,
            height: 58,
            borderRadius: 29,
            backgroundColor: "#376e62",
            alignItems: "center",
            justifyContent: "center",
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.25,
            shadowRadius: 6,
            elevation: 8,
            borderWidth: 4,
            borderColor: "#d9ebe5",
          }}
          onPress={() => navigation.navigate("CreateCohort", { userRole })}
        >
          <Ionicons name="add" size={32} color="#FFFFFF" />
        </TouchableOpacity>
      )}

      <AppBottomTabBar role={userRole} activeTab="menu" />
    </View>
  );
}
