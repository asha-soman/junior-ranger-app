import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

import { AuthStackParamList } from "../../navigation/AuthNavigator";
import { adminStyles as styles } from "../../styles/AdminManagementStyles";

type NavigationProp = NativeStackNavigationProp<AuthStackParamList>;

type UserRole = "admin" | "ranger" | "junior_ranger";

type Props = {
  role: UserRole;
  activeTab?: "home" | "menu" | "notifications";
};

export default function AppBottomTabBar({ role, activeTab }: Props) {
  const navigation = useNavigation<NavigationProp>();
  const insets = useSafeAreaInsets();

  const activeColor = "#555353";
  const inactiveColor = "#131313";

  const getMenuRoute = () => {
    if (role === "admin") return "AdminMenu";
    if (role === "ranger") return "RangerMenu";
    return "JuniorMenu";
  };

  return (
    <View style={[styles.bottomTabContainer, { paddingBottom: insets.bottom - 4 }]}>
      <TouchableOpacity
        style={styles.bottomTabItem}
        onPress={() => navigation.navigate(getMenuRoute() as any)}
      >
        <Ionicons
          name="home"
          size={24}
          color={activeTab === "home" ? activeColor : inactiveColor}
        />
        <Text style={[styles.bottomTabText, activeTab === "home" && styles.activeBottomTabText]}>
          Home
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.bottomTabItem}
        onPress={() => navigation.navigate(getMenuRoute() as any)}
      >
        <Ionicons
          name="menu"
          size={26}
          color={activeTab === "menu" ? activeColor : inactiveColor}
        />
        <Text style={[styles.bottomTabText, activeTab === "menu" && styles.activeBottomTabText]}>
          Menu
        </Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.bottomTabItem}>
        <Ionicons
          name="notifications"
          size={24}
          color={activeTab === "notifications" ? activeColor : inactiveColor}
        />
        <Text
          style={[
            styles.bottomTabText,
            activeTab === "notifications" && styles.activeBottomTabText,
          ]}
        >
          Notifications
        </Text>
      </TouchableOpacity>
    </View>
  );
}