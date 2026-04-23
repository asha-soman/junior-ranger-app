import { useState } from "react";
import { Pressable, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { HelperText, Text } from "react-native-paper";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";

import VerificationForm from "../../components/login/verificationForm";
import { AuthStackParamList } from "../../navigation/AuthNavigator";
import { screenStyles, verificationStyles } from "../../styles/loginStyles";
import { verifyCode, resendCode } from "../../services/auth/authService";

type VerificationErrors = { code?: string };

type VerificationNavigationProp = NativeStackNavigationProp<AuthStackParamList,"Verification">;

type VerificationRouteProp = RouteProp<AuthStackParamList, "Verification">;

export default function VerificationScreen() {
  const navigation = useNavigation<VerificationNavigationProp>();
  const route = useRoute<VerificationRouteProp>();

  const email = route.params?.email ?? "";

  const [code, setCode] = useState("");
  const [errors, setErrors] = useState<VerificationErrors>({});
  const [apiError, setApiError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const validate = () => {
    const newErrors: VerificationErrors = {};

    if (!code.trim()) {
      newErrors.code = "Verification code is required";
    } else if (!/^\d{6}$/.test(code)) {
      newErrors.code = "Please enter a valid 6-digit code";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleConfirm = async () => {
    setApiError("");

    if (!validate()) return;

    try {
      setIsLoading(true);

      const result = await verifyCode({ email, code });

      await AsyncStorage.setItem("token", result.access_token);

      navigation.replace("Home");
    } catch (error) {
      if (error instanceof Error) {
        setApiError(error.message);
      } else {
        setApiError("Something went wrong during verification");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendCode = async () => {
    setApiError("");

    try {
      setIsLoading(true);

      const result = await resendCode({ email });
      console.log("Resend success:", result);

    } catch (error) {
      if (error instanceof Error) {
        setApiError(error.message);
      } else {
        setApiError("Could not resend code");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoBack = () => {
    if (navigation.canGoBack()) {
      navigation.goBack();
      return;
    }

    navigation.navigate("Login");
  };

  return (
    <View style={screenStyles.container}>
      <View style={screenStyles.content}>
        <View style={verificationStyles.formCard}>
          <Text style={verificationStyles.title}>Verification Code</Text>

          <Text style={verificationStyles.description}>
            Please enter the 6-digit code sent to the email address you provided
          </Text>

          <VerificationForm
            code={code}
            error={errors.code}
            isLoading={isLoading}
            onChangeCode={setCode}
            onConfirm={handleConfirm}
            onResendCode={handleResendCode}
          />

          <HelperText type="error" visible={!!apiError}>
            {apiError}
          </HelperText>
        </View>
      </View>
    </View>
  );
}