import React from "react";
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

import { AuthStackParamList } from "../../navigation/AuthNavigator";

type NavigationProp = NativeStackNavigationProp<
    AuthStackParamList,
    "SocialFeed"
>;

export default function SocialFeedScreen() {
    const navigation = useNavigation<NavigationProp>();

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Junior Ranger Feed</Text>

            <View style={styles.cohortBanner}>
                <Ionicons
                    name="people-outline"
                    size={20}
                    color="#376E62"
                />

                <Text style={styles.cohortText}>
                    Cohort-specific feed
                </Text>
            </View>

            <TouchableOpacity
                style={styles.sharePost}
                activeOpacity={0.8}
                onPress={() =>
                    navigation.navigate("ActivityPostForm")
                }
            >
                <View style={styles.avatar}>
                    <Text style={styles.avatarText}>JR</Text>
                </View>

                <Text style={styles.shareText}>
                    Share A Post
                </Text>

                <Ionicons
                    name="camera-outline"
                    size={25}
                    color="#111"
                />

                <View style={styles.addButton}>
                    <Ionicons
                        name="add"
                        size={25}
                        color="#FFFFFF"
                    />
                </View>
            </TouchableOpacity>

            <Text style={styles.placeholder}>
                Feed posts will appear here.
            </Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#F7F7F7",
        padding: 16,
    },

    title: {
        fontSize: 22,
        fontWeight: "700",
        color: "#111",
        marginBottom: 14,
    },

    cohortBanner: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#DCEBE7",
        paddingVertical: 10,
        borderRadius: 18,
        marginBottom: 16,
        gap: 8,
    },

    cohortText: {
        fontSize: 14,
        fontWeight: "600",
        color: "#214E45",
    },

    sharePost: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#D0D0D0",
        borderRadius: 12,
        paddingHorizontal: 12,
        paddingVertical: 10,
    },

    avatar: {
        width: 34,
        height: 34,
        borderRadius: 17,
        backgroundColor: "#FFFFFF",
        justifyContent: "center",
        alignItems: "center",
        marginRight: 10,
    },

    avatarText: {
        fontSize: 12,
        fontWeight: "700",
    },

    shareText: {
        flex: 1,
        fontSize: 15,
        fontWeight: "700",
        color: "#111",
    },

    addButton: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: "#111",
        justifyContent: "center",
        alignItems: "center",
        marginLeft: 10,
    },

    placeholder: {
        marginTop: 30,
        textAlign: "center",
        color: "#777",
    },
});