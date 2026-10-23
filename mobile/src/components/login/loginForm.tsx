import { useState } from "react";
import { Pressable, View } from "react-native";
import { Button, HelperText, Text, TextInput } from "react-native-paper";
import { formStyles } from "../../styles/loginStyles";

type LoginFormProps = {
  email: string;
  password: string;
  errors: {
    email?: string;
    password?: string;
  };
  isLoading: boolean;
  onEmailChange: (value: string) => void;
  onPasswordChange: (value: string) => void;
  onSubmit: () => void;
  onForgotPassword: () => void;
};

export default function LoginForm({
  email,
  password,
  errors,
  isLoading,
  onEmailChange,
  onPasswordChange,
  onSubmit,
  onForgotPassword,
}: LoginFormProps) {
  const [hidePassword, setHidePassword] = useState(true);

  return (
    <View>
      <Text style={formStyles.label}>Email</Text>
      <TextInput
        mode="flat"
        value={email}
        onChangeText={onEmailChange}
        placeholder="Enter your email"
        autoCapitalize="none"
        keyboardType="email-address"
        style={formStyles.input}
        underlineColor="transparent"
        activeUnderlineColor="transparent"
        error={!!errors.email}
        editable={!isLoading}
      />
      <HelperText type="error" visible={!!errors.email} style={formStyles.helper}>
        {errors.email}
      </HelperText>

      <Text style={[formStyles.label, formStyles.passwordLabel]}>
        Password
      </Text>
      <TextInput
        mode="flat"
        value={password}
        onChangeText={onPasswordChange}
        placeholder="Password"
        secureTextEntry={hidePassword}
        right={
          <TextInput.Icon
            icon={hidePassword ? "eye-off" : "eye"}
            onPress={() => setHidePassword(!hidePassword)}
          />
        }
        style={formStyles.input}
        underlineColor="transparent"
        activeUnderlineColor="transparent"
        error={!!errors.password}
        editable={!isLoading}
      />
      <HelperText type="error" visible={!!errors.password} style={formStyles.helper}>
        {errors.password}
      </HelperText>

      <Pressable onPress={onForgotPassword} disabled={isLoading}>
        <Text style={formStyles.forgotPassword}>Forgot password?</Text>
      </Pressable>

      <Button
        mode="contained"
        onPress={() => {
          if (!isLoading) onSubmit();
        }}
        style={formStyles.button}
        contentStyle={formStyles.buttonContent}
        labelStyle={formStyles.buttonLabel}
        loading={isLoading}
        disabled={isLoading}
      >
        Sign In
      </Button>
    </View>
  );
}