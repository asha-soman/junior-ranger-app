import { View, Text, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";

export default function Home() {
  const router = useRouter();

  return (
    <View style={{ flex: 1, padding: 20 }}>
      
      <Text style={{ fontSize: 24 }}>🌿 Junior Ranger</Text>
      <Text>Welcome back, Ranger 👋</Text>

      {/* Activities */}
      <TouchableOpacity
        onPress={() => router.push("/activities")}
        style={{ backgroundColor: "#a5d6a7", padding: 20, marginTop: 20, borderRadius: 10 }}
      >
        <Text>🌱 Activities</Text>
      </TouchableOpacity>

      {/* Explore */}
      <TouchableOpacity
        onPress={() => router.push("/explore")}
        style={{ backgroundColor: "#81c784", padding: 20, marginTop: 10, borderRadius: 10 }}
      >
        <Text>📍 Explore Nature</Text>
      </TouchableOpacity>

      {/* Achievements */}
      <TouchableOpacity
        onPress={() => router.push("/achievements")}
        style={{ backgroundColor: "#66bb6a", padding: 20, marginTop: 10, borderRadius: 10 }}
      >
        <Text>🏆 Achievements</Text>
      </TouchableOpacity>

    </View>
  );
}