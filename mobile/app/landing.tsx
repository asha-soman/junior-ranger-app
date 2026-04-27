import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  ImageBackground,
} from "react-native";
import { useRouter } from "expo-router";

export default function Landing() {
  const router = useRouter();

  return (
    <ImageBackground
      source={require("../assets/landing-bg.png")}
      style={styles.container}
      resizeMode="cover"
    >
      {/* Overlay content */}
      <View style={styles.content}>

        {/* Logo (optional) */}
        <Image
          source={require("../assets/logo.png")}
          style={styles.logo}
        />

        {/* Title */}
        <Text style={styles.title}>JUNIOR</Text>
        <Text style={styles.titleGreen}>RANGERS</Text>

        {/* Subtitle */}
        <Text style={styles.subtitle}>
          Explore. Protect. Learn.
        </Text>

        {/* Get Started */}
        <TouchableOpacity
          style={styles.primaryBtn}
          onPress={() => router.replace("/login")}
        >
          <Text style={styles.primaryText}>🌿 Get Started →</Text>
        </TouchableOpacity>

        {/* Login + Signup */}
        <View style={styles.row}>
          <TouchableOpacity
            style={styles.secondaryBtn}
            onPress={() => router.push("/login")}
          >
            <Text style={styles.secondaryText}>Login</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.secondaryBtnOutline}>
            <Text style={styles.secondaryOutlineText}>Sign Up</Text>
          </TouchableOpacity>
        </View>

      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  content: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
  },

  logo: {
    width: 120,
    height: 120,
    resizeMode: "contain",
    marginBottom: 10,
  },

  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#1b5e20",
  },

  titleGreen: {
    fontSize: 36,
    fontWeight: "bold",
    color: "#2e7d32",
  },

  subtitle: {
    marginTop: 10,
    fontSize: 16,
    color: "#2e7d32",
  },

  primaryBtn: {
    marginTop: 40,
    backgroundColor: "#1b5e20",
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 30,
    elevation: 3,
  },

  primaryText: {
    color: "white",
    fontSize: 18,
    fontWeight: "600",
  },

  row: {
    flexDirection: "row",
    marginTop: 20,
    gap: 10,
  },

  secondaryBtn: {
    backgroundColor: "#e8f5e9",
    paddingVertical: 10,
    paddingHorizontal: 25,
    borderRadius: 20,
  },

  secondaryBtnOutline: {
    borderWidth: 1,
    borderColor: "#2e7d32",
    paddingVertical: 10,
    paddingHorizontal: 25,
    borderRadius: 20,
  },

  secondaryText: {
    color: "#1b5e20",
  },

  secondaryOutlineText: {
    color: "#2e7d32",
  },
});