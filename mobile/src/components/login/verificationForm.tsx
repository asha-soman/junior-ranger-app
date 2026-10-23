import { View } from "react-native";
import { Button, HelperText, TextInput } from "react-native-paper";
import { verificationStyles } from "../../styles/loginStyles";

type VerificationFormProps = {
  code: string;
  error?: string;
  isLoading: boolean;
  onChangeCode: (value: string) => void;
  onConfirm: () => void;
  onResendCode: () => void;
};

export default function VerificationForm({
  code,
  error,
  isLoading,
  onChangeCode,
  onConfirm,
  onResendCode,
}: VerificationFormProps) {
  return (
    <View>

      <TextInput
        mode="flat"
        value={code}
        onChangeText={(value) => {
          const clean = value.replace(/[^0-9]/g, "").slice(0, 6);
          onChangeCode(clean);
        }}
        placeholder="Enter code"
        placeholderTextColor="#9e9e9e"
        keyboardType="number-pad"
        style={verificationStyles.singleInput}
        underlineColor="transparent"
        activeUnderlineColor="transparent"
        editable={!isLoading}
      />

      <HelperText
        type="error"
        visible={!!error}
        style={verificationStyles.helper}
      >
        {error}
      </HelperText>


      <View style={verificationStyles.buttonRow}>
        <Button
          mode="contained"
          onPress={onConfirm}
          style={verificationStyles.confirmButton}
          contentStyle={verificationStyles.buttonContent}
          labelStyle={verificationStyles.confirmButtonLabel}
          loading={isLoading}
          disabled={isLoading}
        >
          Confirm
        </Button>

        <Button
          mode="outlined"
          onPress={onResendCode}
          style={verificationStyles.resendButton}
          contentStyle={verificationStyles.buttonContent}
          labelStyle={verificationStyles.resendButtonLabel}
          disabled={isLoading}
        >
          Resend Code
        </Button>
      </View>
    </View>
  );
}