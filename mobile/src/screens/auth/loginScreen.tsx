import { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableWithoutFeedback,
  Keyboard,
  View,
} from "react-native";
import { HelperText } from "react-native-paper";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useNavigation } from "@react-navigation/native";

import LoginForm from "../../components/login/loginForm";
import { screenStyles } from "../../styles/loginStyles";
import { loginUser } from "../../services/auth/authService";
import { AuthStackParamList } from "../../navigation/AuthNavigator";
import { saveToken, getToken } from "../../utils/secureStore";
import apiClient from "@/src/services/api/client";

type LoginErrors = { email?: string; password?: string };

type LoginNavigationProp = NativeStackNavigationProp<AuthStackParamList, "Login">;

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

      const result = await loginUser({ email, password });

      await saveToken(result.access_token);

      // to be removed later, just checks if it returns the profile of the user after logging in with the proper token code
      const profileResponse = await apiClient.get('/auth/profile');
      console.log('Profile response:', profileResponse.data);

      // testing if token is getting saved or not
      console.log("Token saved successfully");

      const storedToken = await getToken();
      console.log("Stored token:", storedToken);

      if (profileResponse.data.role === "admin") {
        navigation.replace("AdminMenu");
      } else {
        navigation.replace("Verification", { email });
      }
    } 
      catch (error) {
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

  const loginContent = (
    <ScrollView
      contentContainerStyle={screenStyles.content}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
    >
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
        keyboardVerticalOffset={Platform.OS === "ios" ? 80 : 0}
      >
        {Platform.OS === "web" ? (
          loginContent
        ) : (
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            {loginContent}
          </TouchableWithoutFeedback>
        )}
      </KeyboardAvoidingView>
    </View>
  );
}