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
    "JuniorMenu"
>;

export default function JuniorMenuScreen() {
    const navigation = useNavigation<NavigationProp>();

    return (
        <View style={styles.menuContainer}>
            <View style={styles.menuHeader}>
                <View style={styles.menuHeaderIcon}>
                    <Ionicons name="leaf" size={34} color="#FFFFFF" />
                </View>

                <Text style={styles.menuTitle}>Junior Ranger Menu</Text>
            </View>

            <ScrollView contentContainerStyle={styles.menuContent}>
                <TouchableOpacity
                    style={[styles.menuOption, styles.menuOptionReverse]}
                    onPress={() =>
                        navigation.navigate("AdminCohorts", {
                            userRole: "junior_ranger",
                        })
                    }
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
            </ScrollView>
            <AppBottomTabBar role="junior_ranger" activeTab="home" />
        </View>
    );
}