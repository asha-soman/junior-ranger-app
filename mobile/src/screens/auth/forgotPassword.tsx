import { useState } from "react";
import { View } from "react-native";
import { router } from "expo-router";
import { Text } from "react-native-paper";
import { screenStyles, recoveryStyles } from "../../styles/loginStyles";
import ForgotPasswordForm from "../../components/login/forgotPasswordForm";

type RecoveryErrors = {
  email?: string;
};

export default function ForgotPasswordScreen() {
  const [email, setEmail] = useState("");
  const [errors, setErrors] = useState<RecoveryErrors>({});

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

  const handleResetPassword = () => {
    if (!validate()) return;

// call backend endpoint here
    console.log("Password recovery requested for:", email);

  };

  const handleCancel = () => {
    router.push("/login");
  };

  return (
    <View style={screenStyles.container}>
      <View style={screenStyles.header}>
        <Text style={screenStyles.headerTitle}>Password Recovery</Text>
      </View>

      <View style={screenStyles.content}>
        <View style={recoveryStyles.formCard}>
          <ForgotPasswordForm
            email={email}
            errors={errors}
            onEmailChange={setEmail}
            onCancel={handleCancel}
            onSubmit={handleResetPassword}
          />
        </View>
      </View>
    </View>
  );
}