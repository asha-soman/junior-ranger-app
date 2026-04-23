import { useState } from "react";
import { Pressable, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { HelperText, Text } from "react-native-paper";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useNavigation } from "@react-navigation/native";

import LoginForm from "../../components/login/loginForm";
import { screenStyles } from "../../styles/loginStyles";
import { loginUser } from "../../services/auth/authService";
import { AuthStackParamList } from "../../navigation/AuthNavigator";

type LoginErrors = { email?: string; password?: string };

type LoginNavigationProp = NativeStackNavigationProp<AuthStackParamList,"Login">;

export default function LoginScreen() {
  const navigation = useNavigation<LoginNavigationProp>();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<LoginErrors>({});
  const [apiError, setApiError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const validate = () => {
    const newErrors: LoginErrors = {};

    if (!email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Please enter a valid email";
    }

    if (!password.trim()) {
      newErrors.password = "Password is required";
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async () => {
    setApiError("");

    if (!validate()) return;

    try {
      setIsLoading(true);

      await loginUser({ email, password });

      navigation.navigate("Verification", { email });
    } catch (error) {
      if (error instanceof Error) {
        setApiError(error.message);
      } else {
        setApiError("Something went wrong during login");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = () => {
    navigation.navigate("ForgotPassword");
  };

  const handleGoBack = () => {
    if (navigation.canGoBack()) {
      navigation.goBack();
      return;
    }

    navigation.navigate("Welcome");
  };

  return (
    <View style={screenStyles.container}>
      <View style={screenStyles.content}>
        <View style={screenStyles.formCard}>
          <LoginForm
            email={email}
            password={password}
            errors={errors}
            isLoading={isLoading}
            onEmailChange={setEmail}
            onPasswordChange={setPassword}
            onSubmit={handleLogin}
            onForgotPassword={handleForgotPassword}
          />

          <HelperText type="error" visible={!!apiError}>
            {apiError}
          </HelperText>
        </View>
      </View>
    </View>
  );
}