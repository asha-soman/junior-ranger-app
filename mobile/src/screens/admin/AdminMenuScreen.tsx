import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Image,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

import { AdminUser, getAdminUsers } from "../../services/admin/adminService";
import AppBottomTabBar from "../../components/navigation/AppBottomTabBar";
import { AuthStackParamList } from "../../navigation/AuthNavigator";
import { adminStyles as styles } from "../../styles/AdminManagementStyles";

type NavigationProp = NativeStackNavigationProp<AuthStackParamList, "AdminMenu">;

export default function AdminMenuScreen() {
  const navigation = useNavigation<NavigationProp>();
  const [usersPreview, setUsersPreview] = useState<AdminUser[]>([]);

  useEffect(() => {
    getAdminUsers()
      .then(setUsersPreview)
      .catch(() => {});
  }, []);

  const menuItems = [
    {
      title: "Pending Requests",
      image: require("../../../assets/images/pendingRequests.png"),
      onPress: () => navigation.navigate("PendingRangerRequests"),
    },
    {
      title: "Users",
      image: require("../../../assets/images/users.png"),
      onPress: () =>
        navigation.navigate("ManageUsers", { initialUsers: usersPreview }),
    },
    {
      title: "Cohorts",
      image: require("../../../assets/images/cohorts.png"),
      onPress: () => navigation.navigate("AdminCohorts", { userRole: "admin" }),
    },
    {
      title: "Feed",
      image: require("../../../assets/images/feed.png"),
      onPress: () => {},
    },
    {
      title: "Notices & Events",
      image: require("../../../assets/images/announcements.png"),
      onPress: () => {},
    },
  ];

  return (
    <View style={styles.menuContainer}>
      <View style={styles.menuHeader}>
        <View style={styles.menuHeaderIcon}>
          <Ionicons name="person-circle" size={34} color="#FFFFFF" />
        </View>

        <Text style={styles.menuTitle}>Admin Menu</Text>
      </View>

      <ScrollView
        contentContainerStyle={[styles.menuContent, { paddingBottom: 100 }]}
      >
        {menuItems.map((item) => (
          <TouchableOpacity
            key={item.title}
            activeOpacity={0.85}
            onPress={item.onPress}
            style={[
              styles.menuOption,
              {
                height: 135,
                backgroundColor: "#DCEBE7",
                justifyContent: "space-between",
              },
            ]}
          >
            <Image source={item.image} style={styles.menuImage} />

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
                  flexShrink: 1,
                }}
              >
                {item.title}
              </Text>

              <Ionicons
                name="chevron-forward"
                size={28}
                color="#2F6F61"
              />
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <AppBottomTabBar role="admin" activeTab="menu" />
    </View>
  );
}