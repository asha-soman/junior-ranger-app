import { View, Text, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";

export default function Landing() {
  const router = useRouter();

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#e8f5e9",
      }}
    >
      <Text style={{ fontSize: 40, marginBottom: 10 }}>🌿</Text>

      <Text style={{ fontSize: 28, fontWeight: "bold" }}>
        Junior Ranger
      </Text>

      <Text style={{ marginTop: 10 }}>
        Explore • Learn • Protect Nature
      </Text>

      <TouchableOpacity
        onPress={() => router.replace("/login")}
        style={{
          marginTop: 40,
          backgroundColor: "#4caf50",
          padding: 15,
          borderRadius: 10,
        }}
      >
        <Text style={{ color: "white" }}>Get Started</Text>
      </TouchableOpacity>
    </View>
  );
}