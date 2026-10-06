import { useState } from "react";
import { View, Alert, KeyboardAvoidingView, Platform, ScrollView, TouchableWithoutFeedback, Keyboard } from "react-native";
import { Button, HelperText, Text, TextInput } from "react-native-paper";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import { AuthStackParamList } from "../../navigation/AuthNavigator";
import { recoveryStyles, resetPasswordStyles, screenStyles } from "../../styles/loginStyles";
import { resetPassword } from "../../services/auth/authService";

type ResetPasswordErrors = {
  newPassword?: string;
  confirmPassword?: string;
};

type ResetPasswordNavigationProp =
  NativeStackNavigationProp<
    AuthStackParamList,
    "ResetPassword"
  >;

type ResetPasswordRouteProp =
  RouteProp<
    AuthStackParamList,
    "ResetPassword"
  >;

export default function ResetPasswordScreen() {
  const navigation =
    useNavigation<ResetPasswordNavigationProp>();

  const route =
    useRoute<ResetPasswordRouteProp>();

  const { resetToken } = route.params;

  const [newPassword, setNewPassword] =
    useState("");

  const [confirmPassword, setConfirmPassword] =
    useState("");

  const [showNewPassword, setShowNewPassword] =
    useState(false);

  const [
    showConfirmPassword,
    setShowConfirmPassword,
  ] = useState(false);

  const [errors, setErrors] =
    useState<ResetPasswordErrors>({});

  const [apiError, setApiError] =
    useState("");

  const [isLoading, setIsLoading] =
    useState(false);

  const validate = () => {
    const newErrors: ResetPasswordErrors = {};

    if (!newPassword.trim()) {
      newErrors.newPassword =
        "New password is required";
    } else if (
      newPassword.trim().length < 6
    ) {
      newErrors.newPassword =
        "Password must be at least 6 characters";
    }

    if (!confirmPassword.trim()) {
      newErrors.confirmPassword =
        "Please confirm your password";
    } else if (
      newPassword.trim() !==
      confirmPassword.trim()
    ) {
      newErrors.confirmPassword =
        "Passwords do not match";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleResetPassword = async () => {
    setApiError("");

    if (!validate()) {
      return;
    }

    try {
      setIsLoading(true);

      await resetPassword({
        resetToken,
        newPassword: newPassword.trim(),
        confirmPassword:
          confirmPassword.trim(),
      });

      Alert.alert(
        "Success",
        "Your password has been reset successfully.",
        [
          {
            text: "OK",
            onPress: () => {
              navigation.reset({
                index: 0,
                routes: [
                  {
                    name: "Welcome",
                  },
                ],
              });
            },
          },
        ],
      );
    } catch (error: any) {
      const message =
        error?.response?.data?.message ||
        error?.message ||
        "Could not reset password";

      setApiError(message);
    } finally {
      setIsLoading(false);
    }
  };

  const formContent = (
    <ScrollView
    contentContainerStyle={
      resetPasswordStyles.content
    }
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
    >
      <View style={resetPasswordStyles.formCard}>
        <Text style={resetPasswordStyles.title}>
          Create New Password
        </Text>

        <Text style={resetPasswordStyles.description}>
          Enter your new password below
        </Text>

        <TextInput
          mode="flat"
          value={newPassword}
          onChangeText={(value) => {
            setNewPassword(value);
            setErrors({});
            setApiError("");
          }}
          placeholder="New password"
          secureTextEntry={!showNewPassword}
          style={resetPasswordStyles.input}
          underlineColor="transparent"
          activeUnderlineColor="transparent"
          error={!!errors.newPassword}
          right={
            <TextInput.Icon
              icon={
                showNewPassword
                  ? "eye-off"
                  : "eye"
              }
              onPress={() =>
                setShowNewPassword(
                  !showNewPassword,
                )
              }
            />
          }
        />

        <HelperText
          type="error"
          visible={!!errors.newPassword}
          style={resetPasswordStyles.helper}
        >
          {errors.newPassword}
        </HelperText>

        <TextInput
          mode="flat"
          value={confirmPassword}
          onChangeText={(value) => {
            setConfirmPassword(value);
            setErrors({});
            setApiError("");
          }}
          placeholder="Confirm password"
          secureTextEntry={!showConfirmPassword}
          style={resetPasswordStyles.input}
          underlineColor="transparent"
          activeUnderlineColor="transparent"
          error={!!errors.confirmPassword}
          right={
            <TextInput.Icon
              icon={
                showConfirmPassword
                  ? "eye-off"
                  : "eye"
              }
              onPress={() =>
                setShowConfirmPassword(
                  !showConfirmPassword,
                )
              }
            />
          }
        />

        {errors.confirmPassword ? (
        <HelperText
            type="error"
            style={resetPasswordStyles.helper}
        >
            {errors.confirmPassword}
        </HelperText>
        ) : null}

        <HelperText
          type="error"
          visible={!!apiError}
        >
          {apiError}
        </HelperText>

        <Button
          mode="contained"
          onPress={handleResetPassword}
          loading={isLoading}
          disabled={isLoading}
          style={resetPasswordStyles.resetButton}
          contentStyle={resetPasswordStyles.buttonContent}
          labelStyle={resetPasswordStyles.resetButtonLabel}
        >
          Reset Password
        </Button>
      </View>
    </ScrollView>
  );

  return (
    <View style={screenStyles.container}>
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
          >
            {formContent}
          </TouchableWithoutFeedback>
        )}
      </KeyboardAvoidingView>
    </View>
  );
}