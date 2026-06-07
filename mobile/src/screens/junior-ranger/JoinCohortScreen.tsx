import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Keyboard,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

import { AuthStackParamList } from "../../navigation/AuthNavigator";
import { adminStyles as styles } from "../../styles/AdminManagementStyles";
import {
  validateInviteCode,
  joinCohort,
} from "../../services/cohorts/cohortService";

type NavigationProp = NativeStackNavigationProp<
  AuthStackParamList,
  "JoinCohort"
>;

export default function JoinCohortScreen() {
  const navigation = useNavigation<NavigationProp>();

  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [validating, setValidating] = useState(false);
  const [cohort, setCohort] = useState<{
    id: string;
    name: string;
    description: string | null;
  } | null>(null);

  const handleValidate = async () => {
    if (code.length !== 8) {
      Alert.alert("Error", "Invite code must be exactly 8 characters.");
      return;
    }

    try {
      setValidating(true);

      const result = await validateInviteCode(code);
      setCohort(result.cohort);
      Keyboard.dismiss();
    } catch (error: any) {
      const message =
        error?.response?.data?.message ||
        "Invalid or expired invite code. Please try again.";

      Alert.alert("Validation Failed", message);
      setCohort(null);
      setCode("");
    } finally {
      setValidating(false);
    }
  };

  // const handleJoin = async () => {
  //   if (!cohort) return;

  //   try {
  //     setLoading(true);

  //     const result = await joinCohort(code);

  //     Alert.alert(
  //       "Welcome!",
  //       `You have successfully joined ${result.cohort.name}.`,
  //       [
  //         {
  //           text: "Great!",
  //           onPress: () => navigation.replace("JuniorMenu"),
  //         },
  //       ]
  //     );
  //   } catch (error: any) {
  //     const message =
  //       error?.response?.data?.message ||
  //       "Could not join the cohort. Please try again later.";

  //     Alert.alert("Join Failed", message);
  //   } finally {
  //     setLoading(false);
  //   }
  // };
  const handleJoin = async () => {
    if (!cohort) return;

    try {
      setLoading(true);

      console.log("Before join API");

      const result = await joinCohort(code);

      console.log("Join API success", result);

      navigation.replace("JuniorMenu");

      console.log("Navigation called");
    } catch (error) {
      console.log("Join error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1, backgroundColor: "#F4F4F4" }}
    >
      <ScrollView
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{
          flexGrow: 1,
          padding: 24,
          justifyContent: "center",
        }}
      >
        <View style={{ alignItems: "center", marginBottom: 40 }}>
          <Ionicons name="people-circle-outline" size={100} color="#376e62" />

          <Text
            style={{
              fontSize: 28,
              fontWeight: "bold",
              color: "#1E1E1E",
              marginTop: 16,
            }}
          >
            Join a Cohort
          </Text>

          <Text
            style={{
              fontSize: 16,
              color: "#555555",
              textAlign: "center",
              marginTop: 8,
            }}
          >
            Enter the invite code provided by your Ranger to join your group.
          </Text>
        </View>

        <View
          style={[
            styles.searchContainer,
            {
              marginBottom: 20,
              height: 60,
            },
          ]}
        >
          <TextInput
            style={[
              styles.searchInput,
              {
                fontSize: 20,
                textAlign: "center",
                letterSpacing: 4,
              },
            ]}
            placeholder="ENTER CODE"
            placeholderTextColor="#AAAAAA"
            value={code}
            onChangeText={(text) => {
              setCode(text.toUpperCase());
              setCohort(null);
            }}
            maxLength={8}
            autoCapitalize="characters"
            autoCorrect={false}
            editable={!validating && !loading}
          />
        </View>

        <TouchableOpacity
          style={[
            styles.actionButton,
            styles.approveButton,
            {
              height: 56,
              justifyContent: "center",
              opacity: validating || code.length !== 8 ? 0.6 : 1,
            },
          ]}
          onPress={handleValidate}
          disabled={validating || code.length !== 8}
        >
          {validating ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text style={styles.actionButtonText}>Validate Code</Text>
          )}
        </TouchableOpacity>

        {cohort && (
          <View
            style={[
              styles.detailCard,
              {
                marginTop: 30,
                padding: 24,
              },
            ]}
          >
            <Text style={[styles.detailLabel, { fontSize: 14 }]}>
              COHORT FOUND
            </Text>

            <Text style={[styles.detailTitle, { marginBottom: 8 }]}>
              {cohort.name}
            </Text>

            {cohort.description && (
              <Text
                style={[
                  styles.detailValue,
                  {
                    marginBottom: 24,
                    color: "#555555",
                  },
                ]}
              >
                {cohort.description}
              </Text>
            )}

            <TouchableOpacity
              style={[
                styles.actionButton,
                {
                  backgroundColor: "#376e62",
                  height: 56,
                  justifyContent: "center",
                  opacity: loading ? 0.6 : 1,
                },
              ]}
              onPress={handleJoin}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <Text style={styles.actionButtonText}>Confirm & Join</Text>
              )}
            </TouchableOpacity>
          </View>
        )}

        <TouchableOpacity
          style={{ marginTop: 20, alignSelf: "center" }}
          onPress={() => navigation.replace("JuniorMenu")}
        >
          <Text style={{ color: "#36889c", fontWeight: "600" }}>
            Skip for now
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}