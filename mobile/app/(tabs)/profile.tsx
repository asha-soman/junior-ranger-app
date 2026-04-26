import { View, Text, Pressable } from "react-native";
import { useRouter } from "expo-router";

export default function Profile() {
  const router = useRouter();

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text style={{ fontSize: 22, marginBottom: 20 }}>
        Profile 👤
      </Text>

      <Pressable
        onPress={() => router.replace("/login")}
        style={{
          backgroundColor: "#D32F2F",
          padding: 12,
          borderRadius: 8,
        }}
      >
        <Text style={{ color: "white" }}>Logout</Text>
      </Pressable>
    </View>
  );
}