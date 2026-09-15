import { useState } from "react";
import { View } from "react-native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useNavigation } from "@react-navigation/native";
import { HelperText, Text } from "react-native-paper";

import ForgotPasswordForm from "../../components/login/forgotPasswordForm";
import { AuthStackParamList } from "../../navigation/AuthNavigator";
import { forgotPassword } from "../../services/auth/authService";
import { recoveryStyles, screenStyles } from "../../styles/loginStyles";

type RecoveryErrors = { email?: string };

type ForgotPasswordNavigationProp = NativeStackNavigationProp<AuthStackParamList,"ForgotPassword">;

export default function ForgotPasswordScreen() {
  const navigation = useNavigation<ForgotPasswordNavigationProp>();

  const [email, setEmail] = useState("");
  const [errors, setErrors] = useState<RecoveryErrors>({});
  const [apiError, setApiError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const validate = () => {
    const newErrors: RecoveryErrors = {};

    if (!email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Please enter a valid email";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleResetPassword = async () => {
  setApiError("");

  if (!validate()) return;

  try {
    setIsLoading(true);

    const result = await forgotPassword({ email });
    console.log("Recovery success:", result);

  } catch (error) {
    if (error instanceof Error) {
      setApiError(error.message);
    } else {
      setApiError("Something went wrong");
    }
  } finally {
    setIsLoading(false);
  }
};

  const handleCancel = () => {
    navigation.navigate("Login");
  };

  return (
    <View style={screenStyles.container}>
      <View style={screenStyles.content}>
        <View style={recoveryStyles.formCard}>
          <ForgotPasswordForm
            email={email}
            errors={errors}
            onEmailChange={setEmail}
            onCancel={handleCancel}
            onSubmit={handleResetPassword}
          />

          <HelperText type="error" visible={!!apiError}>
            {apiError}
          </HelperText>
        </View>
      </View>
    </View>
  );
}