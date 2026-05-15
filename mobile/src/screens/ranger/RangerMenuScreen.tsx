import React from "react";
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

import { AuthStackParamList } from "../../navigation/AuthNavigator";
import { adminStyles as styles } from "../../styles/AdminManagementStyles";
import AppBottomTabBar from '../../components/navigation/AppBottomTabBar';

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
                    <Ionicons
                        name="people-circle"
                        size={34}
                        color="#FFFFFF"
                    />
                </View>

                <Text style={styles.menuTitle}>Ranger Menu</Text>
            </View>

            <ScrollView contentContainerStyle={styles.menuContent}>
                <TouchableOpacity
                    style={[styles.menuOption, styles.menuOptionReverse]}
                    onPress={() => navigation.navigate("AdminCohorts", { userRole: "ranger" })}
                >
                    <Image
                        source={require("../../../assets/images/cohorts.png")}
                        style={styles.menuImage}
                    />

                    <Text
                        style={[
                            styles.menuOptionText,
                            styles.menuOptionTextLeft,
                        ]}
                    >
                        My Cohorts
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.menuOption}
                    onPress={() =>
                        navigation.navigate("AdventureList", {
                            userRole: "ranger",
                        })
                    }
                >
                    <Image
                        source={require("../../../assets/images/adventure.png")}
                        style={styles.menuImage}
                    />

                    <Text style={styles.menuOptionText}>Manage Adventures</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.menuOption}>
                    <Image
                        source={require("../../../assets/images/feed.png")}
                        style={styles.menuImage}
                    />

                    <Text style={styles.menuOptionText}>
                        Feed
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.menuOption, styles.menuOptionReverse]}
                >
                    <Image
                        source={require("../../../assets/images/announcements.png")}
                        style={styles.menuImage}
                    />

                    <Text
                        style={[
                            styles.menuOptionText,
                            styles.menuOptionTextLeft,
                        ]}
                    >
                        Notices & Events
                    </Text>
                </TouchableOpacity>
            </ScrollView>
            <AppBottomTabBar role="ranger" activeTab="home" />
        </View>
    );
}