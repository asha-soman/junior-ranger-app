import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Image,
  Modal,
  Pressable,
  Alert,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

import { AdminUser, getAdminUsers } from "../../services/admin/adminService";
import AppBottomTabBar from "../../components/navigation/AppBottomTabBar";
import { AuthStackParamList } from "../../navigation/AuthNavigator";
import { adminStyles as styles } from "../../styles/AdminManagementStyles";
import { removeToken } from "../../utils/secureStore";

type NavigationProp = NativeStackNavigationProp<AuthStackParamList, "AdminMenu">;

export default function AdminMenuScreen() {
  const navigation = useNavigation<NavigationProp>();
  const [usersPreview, setUsersPreview] = useState<AdminUser[]>([]);
  const [accountMenuVisible, setAccountMenuVisible] = useState(false);

  useEffect(() => {
    getAdminUsers()
      .then(setUsersPreview)
      .catch(() => { });
  }, []);

  const confirmLogout = async () => {
    await removeToken();
    navigation.replace("Welcome");
  };

  const handleLogout = () => {
    setAccountMenuVisible(false);

    if (Platform.OS === "web") {
      const confirmed = window.confirm("Are you sure you want to logout?");
      if (confirmed) confirmLogout();
      return;
    }

    Alert.alert("Logout", "Are you sure you want to logout?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Logout",
        style: "destructive",
        onPress: confirmLogout,
      },
    ]);
  };

  const showComingSoon = () => {
    setAccountMenuVisible(false);
    Alert.alert("Coming Soon", "Profile feature will be available soon.");
  };

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
      title: "Adventures",
      image: require("../../../assets/images/adventure.png"),
      onPress: () =>
        navigation.navigate("AdventureList", {
          userRole: "admin",
        }),
    },
    {
      title: "Feed",
      image: require("../../../assets/images/feed.png"),
      onPress: () => { },
    },
    {
      title: "Notices & Events",
      image: require("../../../assets/images/announcements.png"),
      onPress: () => { },
    },
  ];

  return (
    <View style={styles.menuContainer}>
      <Modal
        visible={accountMenuVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setAccountMenuVisible(false)}
      >
        <Pressable
          style={{
            flex: 1,
            backgroundColor: "rgba(0,0,0,0.25)",
          }}
          onPress={() => setAccountMenuVisible(false)}
        >
          <Pressable
            style={{
              width: 260,
              height: "100%",
              backgroundColor: "#FFFFFF",
              paddingTop: 52,
              paddingHorizontal: 20,
              shadowColor: "#000",
              shadowOpacity: 0.15,
              shadowRadius: 12,
              elevation: 8,
            }}
            onPress={(event) => event.stopPropagation()}
          >
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginBottom: 28,
              }}
            >
              <View
                style={{
                  width: 46,
                  height: 46,
                  borderRadius: 23,
                  backgroundColor: "#376e62",
                  alignItems: "center",
                  justifyContent: "center",
                  marginRight: 12,
                }}
              >
                <Ionicons name="person-circle" size={34} color="#FFFFFF" />
              </View>

              <View>
                <Text
                  style={{
                    fontSize: 18,
                    fontWeight: "700",
                    color: "#111",
                  }}
                >
                  Admin
                </Text>
                <Text
                  style={{
                    fontSize: 13,
                    color: "#667085",
                    marginTop: 2,
                  }}
                >
                  Account Menu
                </Text>
              </View>
            </View>

            <TouchableOpacity
              style={{
                flexDirection: "row",
                alignItems: "center",
                paddingVertical: 14,
                borderBottomWidth: 1,
                borderBottomColor: "#EEF2F1",
              }}
              onPress={showComingSoon}
            >
              <Ionicons name="person-outline" size={22} color="#2F6F61" />
              <Text
                style={{
                  fontSize: 16,
                  fontWeight: "600",
                  color: "#111",
                  marginLeft: 12,
                }}
              >
                Profile
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={{
                flexDirection: "row",
                alignItems: "center",
                paddingVertical: 14,
                borderBottomWidth: 1,
                borderBottomColor: "#EEF2F1",
              }}
              onPress={showComingSoon}
            >
              <Ionicons name="settings-outline" size={22} color="#2F6F61" />
              <Text
                style={{
                  fontSize: 16,
                  fontWeight: "600",
                  color: "#111",
                  marginLeft: 12,
                }}
              >
                Settings
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={{
                flexDirection: "row",
                alignItems: "center",
                paddingVertical: 14,
                marginTop: 8,
              }}
              onPress={handleLogout}
            >
              <Ionicons name="log-out-outline" size={22} color="#C0392B" />
              <Text
                style={{
                  fontSize: 16,
                  fontWeight: "700",
                  color: "#C0392B",
                  marginLeft: 12,
                }}
              >
                Logout
              </Text>
            </TouchableOpacity>
          </Pressable>
        </Pressable>
      </Modal>

      <View style={styles.menuHeader}>
        <TouchableOpacity
          style={styles.menuHeaderIcon}
          onPress={() => setAccountMenuVisible(true)}
          activeOpacity={0.8}
        >
          <Ionicons name="person-circle" size={34} color="#FFFFFF" />
        </TouchableOpacity>

        <Text style={styles.menuTitle}>Admin Dashboard</Text>
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

              <Ionicons name="chevron-forward" size={28} color="#2F6F61" />
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <AppBottomTabBar role="admin" activeTab="menu" />
    </View>
  );
}