import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { AuthStackParamList } from "../../navigation/AuthNavigator";
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { signupRanger } from "../../services/auth/authService";
import { RangerSignupScreenStyles as styles } from "@/src/styles/RangerSignupScreenStyles";

type Props = NativeStackScreenProps<AuthStackParamList, "RangerSignup">;

const RangerSignupScreen = ({ route, navigation }: Props) => {
  const selectedRole = route.params?.role ?? "ranger";

  const [firstName, setFirstName] = useState("");
  const [surname, setSurname] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [parentConsent, setParentConsent] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    navigation.setOptions({
      title:
        selectedRole === "junior_ranger"
          ? "Junior Ranger Sign Up"
          : "Ranger Sign Up",
    });
  }, [navigation, selectedRole]);

  const validateForm = () => {
    if (!firstName.trim()) {
      Alert.alert("Validation Error", "Please enter your first name.");
      return false;
    }

    if (!surname.trim()) {
      Alert.alert("Validation Error", "Please enter your surname.");
      return false;
    }

    if (!email.trim()) {
      Alert.alert("Validation Error", "Please enter your email.");
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email.trim())) {
      Alert.alert("Validation Error", "Please enter a valid email.");
      return false;
    }

    if (!phoneNumber.trim()) {
      Alert.alert("Validation Error", "Please enter your phone number.");
      return false;
    }

    if (!password.trim()) {
      Alert.alert("Validation Error", "Please enter your password.");
      return false;
    }

    if (password.trim().length < 6) {
      Alert.alert("Validation Error", "Password must be at least 6 characters.");
      return false;
    }

    if (selectedRole === "junior_ranger" && !parentConsent) {
      Alert.alert(
        "Consent Required",
        "Parental consent is required for Junior Rangers.",
      );
      return false;
    }

    if (!agreedToTerms) {
      Alert.alert(
        "Validation Error",
        "Please agree to the Terms and Conditions.",
      );
      return false;
    }

    return true;
  };

  const resetForm = () => {
    setFirstName("");
    setSurname("");
    setEmail("");
    setPhoneNumber("");
    setPassword("");
    setAgreedToTerms(false);
    setParentConsent(false);
  };

  const handleSignup = async () => {
    if (!validateForm()) return;

    const payload = {
      name: `${firstName.trim()} ${surname.trim()}`.trim(),
      email: email.trim().toLowerCase(),
      password: password.trim(),
      role: selectedRole,
    };

    try {
      setLoading(true);

      const result = await signupRanger(payload);

      Alert.alert("Success", "Account created successfully.");
        navigation.replace("Login");

        resetForm();
    } catch (error: any) {
      const message =
        error?.response?.data?.message ||
        error?.message ||
        "Something went wrong during signup.";

      Alert.alert("Signup Failed", message);
    } finally {
      setLoading(false);
    }
  };

  const renderCheckboxIcon = (checked: boolean) => {
    if (!checked) return null;

    return <Ionicons name="checkmark" size={16} color="#FFFFFF" />;
  };

  const formContent = (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View
        style={[
          styles.card,
          selectedRole === "junior_ranger"
            ? styles.juniorCard
            : styles.rangerCard,
        ]}
      >
        <Text style={styles.label}>Name</Text>
        <TextInput
          style={styles.input}
          placeholder="First Name"
          placeholderTextColor="#B0B0B0"
          value={firstName}
          onChangeText={setFirstName}
        />

        <Text style={styles.label}>Surname</Text>
        <TextInput
          style={styles.input}
          placeholder="Last Name"
          placeholderTextColor="#B0B0B0"
          value={surname}
          onChangeText={setSurname}
        />

        <Text style={styles.label}>Email</Text>
        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor="#B0B0B0"
          keyboardType="email-address"
          autoCapitalize="none"
          value={email}
          onChangeText={setEmail}
        />

        <Text style={styles.label}>Phone Number</Text>
        <TextInput
          style={styles.input}
          placeholder="Phone Number"
          placeholderTextColor="#B0B0B0"
          keyboardType="phone-pad"
          value={phoneNumber}
          onChangeText={setPhoneNumber}
        />

        <Text style={styles.label}>Password</Text>
        <TextInput
          style={styles.input}
          placeholder="Password"
          placeholderTextColor="#B0B0B0"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />

        <TouchableOpacity
          style={styles.button}
          onPress={handleSignup}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text style={styles.buttonText}>Create Account</Text>
          )}
        </TouchableOpacity>
      </View>

      {selectedRole === "junior_ranger" && (
        <TouchableOpacity
          style={styles.checkboxRow}
          onPress={() => setParentConsent((previous) => !previous)}
          activeOpacity={0.8}
        >
          <View
            style={[
              styles.checkbox,
              parentConsent && styles.checkboxChecked,
            ]}
          >
            {renderCheckboxIcon(parentConsent)}
          </View>

          <Text style={styles.termsText}>
            I am a parent/guardian and I give consent for this child to use the
            app.
          </Text>
        </TouchableOpacity>
      )}

      <TouchableOpacity
        style={styles.checkboxRow}
        onPress={() => setAgreedToTerms((previous) => !previous)}
        activeOpacity={0.8}
      >
        <View
          style={[
            styles.checkbox,
            agreedToTerms && styles.checkboxChecked,
          ]}
        >
          {renderCheckboxIcon(agreedToTerms)}
        </View>

        <Text style={styles.termsText}>
          I agree to the Terms and Conditions{"\n"}
          and the Privacy Policy
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 80 : 0}
    >
      {Platform.OS === "web" ? (
        formContent
      ) : (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          {formContent}
        </TouchableWithoutFeedback>
      )}
    </KeyboardAvoidingView>
  );
};

export default RangerSignupScreen;