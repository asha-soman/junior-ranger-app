import React, { useCallback, useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { getUnreadCount } from "../../services/notifications/notificationService";
import { AuthStackParamList } from "../../navigation/AuthNavigator";

type NavigationProp = NativeStackNavigationProp<AuthStackParamList>;

type UserRole = "admin" | "ranger" | "junior_ranger";

type Props = {
  role: UserRole;
  activeTab?: "home" | "menu" | "notifications";
  unreadCountOverride?: number;
};

export default function AppBottomTabBar({ role, activeTab, unreadCountOverride }: Props) {
  const navigation = useNavigation<NavigationProp>();
  const insets = useSafeAreaInsets();
  const [unreadCount, setUnreadCount] = useState(0);

  useFocusEffect(
    useCallback(() => {
      let isActive = true;

      const loadUnreadCount = async () => {
        try {
          const result = await getUnreadCount();

          if (isActive) {
            setUnreadCount(result);
          }
        } catch (error) {
          console.error(
            "Failed to load unread notification count:",
            error
          );
        }
      };

      loadUnreadCount();

      return () => {
        isActive = false;
      };
    }, [])
  );

  const displayedUnreadCount = unreadCountOverride ?? unreadCount;

  const getMenuRoute = () => {
    if (role === "admin") return "AdminMenu";
    if (role === "ranger") return "RangerMenu";
    return "JuniorMenu";
  };

  const activeColor = "#1f6f5b";
  const inactiveColor = "#222";

  const handleMenuPress = () => {
    navigation.reset({
      index: 0,
      routes: [
        {
          name: getMenuRoute() as any,
        },
      ],
    });
  };

  return (
    <View
      style={{
        flexDirection: "row",
        justifyContent: "space-around",
        alignItems: "center",
        backgroundColor: "#FFFFFF",
        paddingTop: 10,
        paddingBottom: Math.max(insets.bottom, 12),
        borderTopWidth: 1,
        borderTopColor: "#E5E7EB",
      }}
    >
      <TouchableOpacity
        style={{ alignItems: "center", flex: 1 }}
        onPress={() => navigation.navigate(getMenuRoute() as any)}
      >
        <Ionicons
          name="home-outline"
          size={25}
          color={activeTab === "home" ? activeColor : inactiveColor}
        />
        <Text
          style={{
            fontSize: 12,
            color: activeTab === "home" ? activeColor : inactiveColor,
            fontWeight: activeTab === "home" ? "700" : "500",
            marginTop: 3,
          }}
        >
          Home
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={{
          alignItems: "center",
          flex: 1,
        }}
        onPress={handleMenuPress}
      >
        <View
          style={{
            backgroundColor: activeTab === "menu" ? "#E5F0E8" : "transparent",
            paddingHorizontal: 18,
            paddingVertical: 7,
            borderRadius: 18,
          }}
        >
          <Ionicons
            name="grid"
            size={25}
            color={activeTab === "menu" ? activeColor : inactiveColor}
          />
        </View>
        <Text
          style={{
            fontSize: 12,
            color: activeTab === "menu" ? activeColor : inactiveColor,
            fontWeight: activeTab === "menu" ? "700" : "500",
            marginTop: 3,
          }}
        >
          Menu
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={{ alignItems: "center", flex: 1 }}
        onPress={() =>
          navigation.navigate("Notifications", {
            userRole: role,
          })
        }
      >
      <View style={{ position: "relative" }}>
        <Ionicons
          name="notifications-outline"
          size={25}
          color={
            activeTab === "notifications"
              ? activeColor
              : inactiveColor
          }
        />

        {displayedUnreadCount > 0 && (
          <View
            style={{
              position: "absolute",
              top: -7,
              right: -10,
              minWidth: 18,
              height: 18,
              borderRadius: 9,
              backgroundColor: "#36889c",
              alignItems: "center",
              justifyContent: "center",
              paddingHorizontal: 4,
            }}
          >
            <Text
              style={{
                color: "#FFFFFF",
                fontSize: 10,
                fontWeight: "700",
              }}
            >
              {displayedUnreadCount > 99
                ? "99+"
                : displayedUnreadCount}
            </Text>
          </View>
        )}
      </View>
        <Text
          style={{
            fontSize: 12,
            color:
              activeTab === "notifications" ? activeColor : inactiveColor,
            fontWeight: activeTab === "notifications" ? "700" : "500",
            marginTop: 3,
          }}
        >
          Notifications
        </Text>
      </TouchableOpacity>
    </View>
  );
}