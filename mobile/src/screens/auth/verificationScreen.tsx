import { useState } from "react";
import { View, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { HelperText, Text } from "react-native-paper";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import {
  useNavigation,
  useRoute,
  RouteProp,
} from "@react-navigation/native";

import VerificationForm from "../../components/login/verificationForm";
import { AuthStackParamList } from "../../navigation/AuthNavigator";
import {
  screenStyles,
  verificationStyles,
} from "../../styles/loginStyles";

import {
  verifyCode,
  resendCode,
  verifyTwoFactorCode,
} from "../../services/auth/authService";

import { getCohorts } from "../../services/cohorts/cohortService";
import apiClient from "@/src/services/api/client";
import { saveToken } from "../../utils/secureStore";

type VerificationErrors = {
  code?: string;
};

type VerificationNavigationProp =
  NativeStackNavigationProp<
    AuthStackParamList,
    "Verification"
  >;

type VerificationRouteProp =
  RouteProp<
    AuthStackParamList,
    "Verification"
  >;

export default function VerificationScreen() {
  const navigation =
    useNavigation<VerificationNavigationProp>();

  const route =
    useRoute<VerificationRouteProp>();

  const email = route.params?.email ?? "";

  // Default flow is signup email verification.
  const mode = route.params?.mode ?? "email";

  const [code, setCode] = useState("");
  const [errors, setErrors] =
    useState<VerificationErrors>({});
  const [apiError, setApiError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const validate = () => {
    const newErrors: VerificationErrors = {};

    if (!code.trim()) {
      newErrors.code =
        "Verification code is required";
    } else if (!/^\d{6}$/.test(code)) {
      newErrors.code =
        "Please enter a valid 6-digit code";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const navigateAfterLogin = async () => {
    const profileResponse =
      await apiClient.get("/auth/profile");

    const role = profileResponse.data.role;

    if (role === "admin") {
      navigation.replace("AdminMenu");
      return;
    }

    if (role === "ranger") {
      navigation.replace("RangerMenu");
      return;
    }

    if (role === "junior_ranger") {
      try {
        const cohorts = await getCohorts();

        if (cohorts.length === 0) {
          navigation.replace("JoinCohort");
        } else {
          navigation.replace("JuniorMenu");
        }
      } catch {
        navigation.replace("JoinCohort");
      }

      return;
    }

    navigation.replace("Login");
  };

  const handleConfirm = async () => {
    setApiError("");

    if (!validate()) {
      return;
    }

    try {
      setIsLoading(true);

      // =====================================================
      // TWO-FACTOR AUTHENTICATION
      // =====================================================
      if (mode === "2fa") {
        const result =
          await verifyTwoFactorCode({
            email,
            code,
          });

        if (!result.access_token) {
          throw new Error(
            "Authentication token was not returned",
          );
        }

        // IMPORTANT:
        // Use the same SecureStore helper used by normal login.
        await saveToken(result.access_token);

        console.log(
          "2FA token saved successfully",
        );

        Alert.alert(
          "Success",
          "Two-factor authentication successful",
        );

        await navigateAfterLogin();

        return;
      }

      // =====================================================
      // SIGNUP EMAIL VERIFICATION
      // =====================================================
      await verifyCode({
        email,
        code,
      });

      Alert.alert(
        "Success",
        "Email verified successfully",
      );

      // After signup verification, return to login.
      navigation.replace("Login");
    } catch (error: any) {
      const message =
        error?.response?.data?.message ||
        error?.message ||
        "Something went wrong during verification";

      setApiError(message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendCode = async () => {
    setApiError("");

    try {
      setIsLoading(true);

      // For 2FA we do not want to use the signup
      // verification resend endpoint.
      if (mode === "2fa") {
        setApiError(
          "Please return to login to request a new 2FA code.",
        );
        return;
      }

      const result = await resendCode({
        email,
      });

      console.log(
        "Resend success:",
        result,
      );

      Alert.alert(
        "Success",
        "A new verification code has been sent.",
      );
    } catch (error: any) {
      const message =
        error?.response?.data?.message ||
        error?.message ||
        "Could not resend code";

      setApiError(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={verificationStyles.containerVerification}>
      <View style={verificationStyles.pageContent}>
        <View style={verificationStyles.formCard}>
          <Text
            style={verificationStyles.title}
          >
            {mode === "2fa"
              ? "Two-Factor Authentication"
              : "Verification Code"}
          </Text>

          <Text
            style={
              verificationStyles.description
            }
          >
            {mode === "2fa"
              ? "Please enter the 6-digit authentication code sent to your email address."
              : "Please enter the 6-digit code sent to the email address you provided."}
          </Text>

          <VerificationForm
            code={code}
            error={errors.code}
            isLoading={isLoading}
            onChangeCode={(value) => {
              setCode(value);
              setErrors({});
              setApiError("");
            }}
            onConfirm={handleConfirm}
            onResendCode={handleResendCode}
          />

          <HelperText
            type="error"
            visible={!!apiError}
          >
            {apiError}
          </HelperText>
        </View>
      </View>
    </View>
  );
}