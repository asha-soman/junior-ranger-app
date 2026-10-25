import React, { useState } from "react";
import { Image } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { uploadImage } from "../../services/submissions/submissionService";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  ScrollView,
} from "react-native";
import {
  RouteProp,
  useNavigation,
  useRoute,
} from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

import { AuthStackParamList } from "../../navigation/AuthNavigator";
import { createCohort } from "../../services/cohorts/cohortService";
import { adminStyles as styles } from "../../styles/AdminManagementStyles";
import AppBottomTabBar from "../../components/navigation/AppBottomTabBar";

type NavigationProp = NativeStackNavigationProp<
  AuthStackParamList,
  "CreateCohort"
>;

type RouteProps = RouteProp<AuthStackParamList, "CreateCohort">;

export default function CreateCohortScreen() {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<RouteProps>();

  const userRole = route.params?.userRole ?? "admin";

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  
  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permission Required", "Sorry, we need camera roll permissions to make this work!");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.8,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      setImageUri(result.assets[0].uri);
    }
  };

  const handleCreateCohort = async () => {
    if (!name.trim() || !location.trim()) {
      Alert.alert("Validation Error", "Name and location are required");
      return;
    }

    try {
      setLoading(true);


      let uploadedImageUrl = undefined;
      if (imageUri) {
        uploadedImageUrl = await uploadImage(imageUri);
      }

      await createCohort({
        name: name.trim(),
        description: description.trim(),
        location: location.trim(),
        image_url: uploadedImageUrl,
      });


      Alert.alert("Success", "Cohort created successfully");
      navigation.goBack();
    } catch (error: any) {
      Alert.alert(
        "Error",
        error?.response?.data?.message ||
          error?.message ||
          "Failed to create cohort",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={[styles.content, { paddingBottom: 100 }]}
      >
        <View style={styles.detailCard}>
          <Text style={styles.detailTitleCentered}>Create Cohort</Text>

          
          <Text style={styles.detailLabel}>Cohort Image</Text>
          <TouchableOpacity onPress={pickImage} style={{ alignItems: "center", marginVertical: 10 }}>
            {imageUri ? (
              <Image source={{ uri: imageUri }} style={{ width: 100, height: 100, borderRadius: 50 }} />
            ) : (
              <View style={{ width: 100, height: 100, borderRadius: 50, backgroundColor: "#e1e1e1", justifyContent: "center", alignItems: "center" }}>
                <Text style={{ color: "#666" }}>Add Image</Text>
              </View>
            )}
          </TouchableOpacity>

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
            onPress={handleCreateCohort}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text
                style={{
                  color: "#FFFFFF",
                  fontSize: 16,
                  fontWeight: "700",
                }}
              >
                Create Cohort
              </Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>

      <AppBottomTabBar role={userRole} activeTab="menu" />
    </View>
  );
}