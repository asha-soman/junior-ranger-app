import { useState } from "react";
import { Pressable, View } from "react-native";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { HelperText, Text } from "react-native-paper";
import { screenStyles } from "../../styles/loginStyles";
import LoginForm from "../../components/login/loginForm";
import { loginUser } from "../../services/authService";

type LoginErrors = {
  email?: string;
  password?: string;
};

export default function LoginScreen() {
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

      const data = await loginUser(email, password);
      router.push("/verification");

      router.push({
        pathname: "/verification",
        params: { email },
      });
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
    router.push("/verification");
  };

  const handleGoBack = () => {
    if (router.canGoBack()) {
      router.back();
      return;
    }

    router.push("/");
  };

  return (
    <View style={screenStyles.container}>
      <View style={screenStyles.header}>
        <Pressable onPress={handleGoBack} style={screenStyles.backButton}>
          <Ionicons name="arrow-back-circle-outline" size={34} color="#222" />
        </Pressable>

        <Text style={screenStyles.headerTitle}>Sign In</Text>
      </View>

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