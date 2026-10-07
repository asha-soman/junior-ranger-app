import { useState } from "react";
import { View, Alert, KeyboardAvoidingView, Platform, ScrollView, TouchableWithoutFeedback, Keyboard } from "react-native";
import { HelperText, Text } from "react-native-paper";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import VerificationForm from "../../components/login/verificationForm";
import { AuthStackParamList } from "../../navigation/AuthNavigator";
import { verificationStyles } from "../../styles/loginStyles";
import { forgotPassword, verifyResetCode } from "../../services/auth/authService";

type ResetCodeErrors = {
  code?: string;
};

type ResetCodeNavigationProp =
  NativeStackNavigationProp<
    AuthStackParamList,
    "ResetCode"
  >;

type ResetCodeRouteProp =
  RouteProp<
    AuthStackParamList,
    "ResetCode"
  >;

export default function ResetCodeScreen() {
  const navigation = useNavigation<ResetCodeNavigationProp>();
  const route = useRoute<ResetCodeRouteProp>();
  const email = route.params.email;
  const [code, setCode] = useState("");
  const [errors, setErrors] = useState<ResetCodeErrors>({});
  const [apiError, setApiError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const validate = () => {
    const newErrors: ResetCodeErrors = {};

    if (!code.trim()) {
      newErrors.code =
        "Reset code is required";
    } else if (!/^\d{6}$/.test(code)) {
      newErrors.code =
        "Please enter a valid 6-digit code";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleConfirm = async () => {
    setApiError("");

    if (!validate()) {
      return;
    }

    try {
      setIsLoading(true);

      const result = await verifyResetCode({
        email,
        code,
      });

      navigation.navigate("ResetPassword", {
        resetToken: result.reset_token,
      });
    } catch (error: any) {
      const message =
        error?.response?.data?.message ||
        error?.message ||
        "Could not verify password reset code";

      setApiError(message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendCode = async () => {
    setApiError("");

    try {
      setIsLoading(true);

      await forgotPassword({
        email,
      });

      Alert.alert(
        "Success",
        "A new password reset code has been sent.",
      );
    } catch (error: any) {
      const message =
        error?.response?.data?.message ||
        error?.message ||
        "Could not resend password reset code";

      setApiError(message);
    } finally {
      setIsLoading(false);
    }
  };

  const formContent = (
    <ScrollView
        contentContainerStyle={{
        flexGrow: 1,
        paddingHorizontal: 24,
        paddingTop: 90,
        paddingBottom: 24,
        }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
    >
        <View style={verificationStyles.formCard}>
        <Text style={verificationStyles.title}>
            Reset Password
        </Text>

        <Text
            style={verificationStyles.description}
        >
            Please enter the 6-digit password
            reset code sent to your email
            address
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

        {apiError ? (
            <HelperText type="error">
            {apiError}
            </HelperText>
        ) : null}
        </View>
    </ScrollView>
  );

  return (
    <View style={{ flex: 1 }}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={
            Platform.OS === "ios"
            ? "padding"
            : Platform.OS === "android"
                ? "height"
                : undefined
        }
        keyboardVerticalOffset={
            Platform.OS === "ios" ? 80 : 0
        }
        >
        {Platform.OS === "web" ? (
            formContent
        ) : (
            <TouchableWithoutFeedback
            onPress={Keyboard.dismiss}
            accessible={false}
            >
            {formContent}
            </TouchableWithoutFeedback>
        )}
        </KeyboardAvoidingView>
    </View>
    );
}