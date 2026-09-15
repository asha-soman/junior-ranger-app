import { View } from "react-native";
import { Button, HelperText, Text, TextInput } from "react-native-paper";
import { recoveryStyles } from "../../styles/loginStyles";

type ForgotPasswordFormProps = {
  email: string;
  errors: {
    email?: string;
  };
  onEmailChange: (value: string) => void;
  onCancel: () => void;
  onSubmit: () => void;
};

export default function ForgotPasswordForm({
  email,
  errors,
  onEmailChange,
  onCancel,
  onSubmit,
}: ForgotPasswordFormProps) {
  return (
    <View>
      <Text style={recoveryStyles.label}>Email</Text>

      <TextInput
        mode="flat"
        value={email}
        onChangeText={onEmailChange}
        placeholder="Enter your email"
        autoCapitalize="none"
        keyboardType="email-address"
        style={recoveryStyles.input}
        underlineColor="transparent"
        activeUnderlineColor="transparent"
        error={!!errors.email}
      />

      <HelperText
        type="error"
        visible={!!errors.email}
        style={recoveryStyles.helper}
      >
        {errors.email}
      </HelperText>

      <View style={recoveryStyles.buttonRow}>
        <Button
          mode="contained"
          onPress={onSubmit}
          style={recoveryStyles.resetButton}
          contentStyle={recoveryStyles.buttonContent}
          labelStyle={recoveryStyles.resetButtonLabel}
        >
          Reset Password
        </Button>

        <Button
          mode="outlined"
          onPress={onCancel}
          style={recoveryStyles.cancelButton}
          contentStyle={recoveryStyles.buttonContent}
          labelStyle={recoveryStyles.cancelButtonLabel}
        >
          Cancel
        </Button>
      </View>
    </View>
  );
}