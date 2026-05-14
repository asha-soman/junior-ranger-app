import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  ScrollView,
} from "react-native";

import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

import { AuthStackParamList } from "../../navigation/AuthNavigator";
import {
  getCohortById,
  updateCohort,
} from "../../services/cohorts/cohortService";
import { adminStyles as styles } from "../../styles/AdminManagementStyles";

type RouteProps = RouteProp<AuthStackParamList, "EditCohort">;

type NavigationProp = NativeStackNavigationProp<
  AuthStackParamList,
  "EditCohort"
>;

export default function EditCohortScreen() {
  const route = useRoute<RouteProps>();
  const navigation = useNavigation<NavigationProp>();
  const { cohortId } = route.params;

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const loadCohort = async () => {
    try {
      const cohort = await getCohortById(cohortId);

      setName(cohort.name || "");
      setDescription(cohort.description || "");
      setLocation(cohort.location || "");
    } catch (error: any) {
      Alert.alert(
        "Error",
        error?.response?.data?.message ||
          error?.message ||
          "Failed to load cohort",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCohort();
  }, []);

  const handleUpdateCohort = async () => {
    if (!name.trim() || !location.trim()) {
      Alert.alert("Validation Error", "Name and location are required");
      return;
    }

    try {
      setSaving(true);

      await updateCohort(cohortId, {
        name: name.trim(),
        description: description.trim(),
        location: location.trim(),
      });

      Alert.alert("Success", "Cohort updated successfully");
      navigation.goBack();
    } catch (error: any) {
      Alert.alert(
        "Error",
        error?.response?.data?.message ||
          error?.message ||
          "Failed to update cohort",
      );
    } finally {
      setSaving(false);
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
        <View style={styles.detailCard}>
          <Text style={styles.detailTitleCentered}>Edit Cohort</Text>

          <Text style={styles.detailLabel}>Cohort Name</Text>

          <TextInput
            style={styles.searchInput}
            placeholder="Enter cohort name"
            value={name}
            onChangeText={setName}
          />

          <Text style={styles.detailLabel}>Description</Text>

          <TextInput
            style={[
              styles.searchInput,
              { height: 100, textAlignVertical: "top" },
            ]}
            placeholder="Enter description"
            multiline
            value={description}
            onChangeText={setDescription}
          />

          <Text style={styles.detailLabel}>Location</Text>

          <TextInput
            style={styles.searchInput}
            placeholder="Enter location"
            value={location}
            onChangeText={setLocation}
          />

          <TouchableOpacity
            style={{
              backgroundColor: "#376e62",
              paddingVertical: 14,
              borderRadius: 12,
              marginTop: 20,
              alignItems: "center",
              justifyContent: "center",
            }}
            onPress={handleUpdateCohort}
            disabled={saving}
          >
            {saving ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text
                style={{
                  color: "#FFFFFF",
                  fontSize: 16,
                  fontWeight: "700",
                }}
              >
                Save Changes
              </Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}