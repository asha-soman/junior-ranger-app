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
import { Ionicons } from "@expo/vector-icons";

import { AuthStackParamList } from "../../navigation/AuthNavigator";
import {
  getCohortById,
  updateCohort,
} from "../../services/cohorts/cohortService";
import { adminStyles as styles } from "../../styles/AdminManagementStyles";
import AppBottomTabBar from "../../components/navigation/AppBottomTabBar";

type RouteProps = RouteProp<AuthStackParamList, "EditCohort">;

type NavigationProp = NativeStackNavigationProp<
  AuthStackParamList,
  "EditCohort"
>;

export default function EditCohortScreen() {
  const route = useRoute<RouteProps>();
  const navigation = useNavigation<NavigationProp>();
  const { cohortId, userRole } = route.params;

  const currentRole = userRole ?? "admin";

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

  const inputStyle = {
    backgroundColor: "#F7FAF8",
    borderWidth: 1,
    borderColor: "#DDEBE5",
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 13,
    fontSize: 15,
    color: "#222",
    marginTop: 8,
    marginBottom: 16,
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
        <View
          style={{
            backgroundColor: "#FFFFFF",
            borderRadius: 24,
            padding: 22,
            borderWidth: 1,
            borderColor: "#EFEFEF",
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 3 },
            shadowOpacity: 0.08,
            shadowRadius: 8,
            elevation: 3,
          }}
        >
          <View
            style={{
              alignSelf: "center",
              width: 68,
              height: 68,
              borderRadius: 34,
              backgroundColor: "#DFF0EA",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: 14,
            }}
          >
            <Ionicons name="create-outline" size={32} color="#2F6F61" />
          </View>

          <Text
            style={{
              fontSize: 24,
              fontWeight: "700",
              color: "#1F1F1F",
              textAlign: "center",
              marginBottom: 24,
            }}
          >
            Edit Cohort
          </Text>

          <Text style={styles.detailLabel}>Cohort Name</Text>
          <TextInput
            style={inputStyle}
            placeholder="Enter cohort name"
            placeholderTextColor="#7B8A84"
            value={name}
            onChangeText={setName}
          />

          <Text style={styles.detailLabel}>Description</Text>
          <TextInput
            style={[
              inputStyle,
              {
                height: 120,
                textAlignVertical: "top",
                lineHeight: 21,
              },
            ]}
            placeholder="Enter description"
            placeholderTextColor="#7B8A84"
            multiline
            value={description}
            onChangeText={setDescription}
          />

          <Text style={styles.detailLabel}>Location</Text>
          <TextInput
            style={inputStyle}
            placeholder="Enter location"
            placeholderTextColor="#7B8A84"
            value={location}
            onChangeText={setLocation}
          />

          <TouchableOpacity
            style={{
              backgroundColor: "#376e62",
              paddingVertical: 15,
              borderRadius: 18,
              marginTop: 8,
              alignItems: "center",
              justifyContent: "center",
              flexDirection: "row",
            }}
            onPress={handleUpdateCohort}
            disabled={saving}
          >
            {saving ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <>
                <Ionicons name="save-outline" size={20} color="#FFFFFF" />
                <Text
                  style={{
                    color: "#FFFFFF",
                    fontSize: 16,
                    fontWeight: "700",
                    marginLeft: 8,
                  }}
                >
                  Save Changes
                </Text>
              </>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>

      <AppBottomTabBar role={currentRole} activeTab="menu" />
    </View>
  );
}