import { View, Text, TextInput, Pressable } from "react-native";
import { useRouter } from "expo-router";
import { login } from "./auth";

export default function Login() {
  const router = useRouter();
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        padding: 20,
        backgroundColor: "#F1F8E9",
      }}
    >
      <Text style={{ fontSize: 26, fontWeight: "bold", marginBottom: 20 }}>
        Login 🌿
      </Text>

      <TextInput
        placeholder="Email"
        style={{
          backgroundColor: "white",
          padding: 12,
          borderRadius: 8,
          marginBottom: 12,
        }}
      />

      <TextInput
        placeholder="Password"
        secureTextEntry
        style={{
          backgroundColor: "white",
          padding: 12,
          borderRadius: 8,
          marginBottom: 20,
        }}
      />

<Pressable
  onPress={() => {
    login(); // ✅ mark user as logged in
    router.replace("/"); // ✅ go to Home
  }}
  style={{
    backgroundColor: "#2E7D32",
    padding: 14,
    borderRadius: 8,
    alignItems: "center",
  }}
>
  <Text style={{ color: "white", fontSize: 16 }}>
    Login
  </Text>
</Pressable>
    </View>
  );
}