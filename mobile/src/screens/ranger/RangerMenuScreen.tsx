import React from "react";
import { View, Text, TouchableOpacity, ScrollView, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

import { AuthStackParamList } from "../../navigation/AuthNavigator";
import { adminStyles as styles } from "../../styles/AdminManagementStyles";
import AppBottomTabBar from "../../components/navigation/AppBottomTabBar";

type NavigationProp = NativeStackNavigationProp<
  AuthStackParamList,
  "RangerMenu"
>;

export default function RangerMenuScreen() {
  const navigation = useNavigation<NavigationProp>();

  return (
    <View style={styles.menuContainer}>
      <View style={styles.menuHeader}>
        <View style={styles.menuHeaderIcon}>
          <Ionicons name="people-circle" size={34} color="#FFFFFF" />
        </View>

        <Text style={styles.menuTitle}>Ranger Menu</Text>
      </View>

      <ScrollView
        contentContainerStyle={[styles.menuContent, { paddingBottom: 100 }]}
      >
        <TouchableOpacity
          style={[styles.menuOption, { justifyContent: "space-between" }]}
          onPress={() =>
            navigation.navigate("AdminCohorts", { userRole: "ranger" })
          }
        >
          <Image
            source={require("../../../assets/images/cohorts.png")}
            style={styles.menuImage}
          />

          <View
            style={{
              flex: 1,
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              paddingHorizontal: 12,
            }}
          >
            <Text
              style={{
                fontSize: 20,
                fontWeight: "700",
                color: "#111",
              }}
            >
              My Cohorts
            </Text>

            <Ionicons name="chevron-forward" size={28} color="#2F6F61" />
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.menuOption, { justifyContent: "space-between" }]}
        >
          <Image
            source={require("../../../assets/images/feed.png")}
            style={styles.menuImage}
          />

          <View
            style={{
              flex: 1,
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              paddingHorizontal: 12,
            }}
          >
            <Text
              style={{
                fontSize: 20,
                fontWeight: "700",
                color: "#111",
              }}
            >
              Feed
            </Text>

            <Ionicons name="chevron-forward" size={28} color="#2F6F61" />
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.menuOption, { justifyContent: "space-between" }]}
        >
          <Image
            source={require("../../../assets/images/announcements.png")}
            style={styles.menuImage}
          />

          <View
            style={{
              flex: 1,
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              paddingHorizontal: 12,
            }}
          >
            <Text
              style={{
                fontSize: 20,
                fontWeight: "700",
                color: "#111",
              }}
            >
              Notices & Events
            </Text>

            <Ionicons name="chevron-forward" size={28} color="#2F6F61" />
          </View>
        </TouchableOpacity>
      </ScrollView>

      <AppBottomTabBar role="ranger" activeTab="home" />
    </View>
  );
}
