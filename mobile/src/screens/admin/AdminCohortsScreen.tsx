import React, { useEffect, useRef, useState, useCallback } from "react";
import {
  View,
  Text,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
  TextInput,
} from "react-native";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import AppBottomTabBar from '../../components/navigation/AppBottomTabBar';
import { Ionicons } from "@expo/vector-icons";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Cohort, getCohorts } from "../../services/cohorts/cohortService";
import { AuthStackParamList } from "../../navigation/AuthNavigator";
import { adminStyles as styles } from "../../styles/AdminManagementStyles";
import { RouteProp, useRoute } from "@react-navigation/native";

type NavigationProp = NativeStackNavigationProp<
  AuthStackParamList,
  "AdminCohorts"
>;
type RouteProps = RouteProp<AuthStackParamList, "AdminCohorts">;

export default function AdminCohortsScreen() {
  const navigation = useNavigation<NavigationProp>();
  const hasMounted = useRef(false);
  const [cohorts, setCohorts] = useState<Cohort[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFiltering, setIsFiltering] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [searchName, setSearchName] = useState("");
  const route = useRoute<RouteProps>();
  const userRole = route.params?.userRole ?? "admin";

  const loadCohorts = async () => {
    try {
      setErrorMessage("");

      if (loading) {
        setLoading(true);
      } else {
        setIsFiltering(true);
      }

      const data = await getCohorts();
      setCohorts(data);
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
        contentContainerStyle={styles.content}
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

        {userRole !== "junior_ranger" && (
          <TouchableOpacity
            style={{
              backgroundColor: "#376e62",
              paddingVertical: 14,
              borderRadius: 14,
              marginBottom: 16,
              alignItems: "center",
            }}
            onPress={() => navigation.navigate("CreateCohort")}
          >
            <Text
              style={{
                color: "#FFFFFF",
                fontSize: 16,
                fontWeight: "700",
              }}
            >
              + Create Cohort
            </Text>
          </TouchableOpacity>
        )}

        {errorMessage ? (
          <Text style={styles.errorText}>{errorMessage}</Text>
        ) : filteredCohorts.length === 0 ? (
          <View style={styles.emptyCard}>
            <Text style={styles.emptyText}>No cohorts found</Text>
          </View>
        ) : (
          filteredCohorts.map((cohort) => (
            <TouchableOpacity
              key={cohort.id}
              style={styles.cohortCard}
              activeOpacity={0.8}
              onPress={() =>
                navigation.navigate("AdminCohortDetails", {
                  cohortId: cohort.id,
                  userRole,
                })
              }
            >
              <Text style={styles.cohortName}>{cohort.name}</Text>

              <Text style={styles.cohortDescription}>
                {cohort.description || "No description provided"}
              </Text>

              <View style={styles.userInfoRow}>
                <Text style={styles.userInfoLabel}>Location</Text>

                <Text style={styles.userInfoValue}>
                  {cohort.location || "Not specified"}
                </Text>
              </View>

              <View style={styles.userInfoRow}>
                <Text style={styles.userInfoLabel}>Assigned Ranger</Text>

                <Text style={styles.userInfoValue}>
                  {cohort.assigned_ranger_name || "No ranger assigned"}
                </Text>
              </View>

              <View style={styles.memberCountBadge}>
                <Text style={styles.memberCountText}>
                  {cohort.member_count ?? 0} members
                </Text>
              </View>
            </TouchableOpacity>
          ))
        )}
      </ScrollView>
     <AppBottomTabBar role={userRole} activeTab="menu" />
    </View>
  );
}
