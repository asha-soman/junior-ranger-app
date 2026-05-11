import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { AuthStackParamList } from '../../navigation/AuthNavigator';
import { adminStyles as styles } from '../../styles/AdminManagementStyles';

type NavigationProp = NativeStackNavigationProp<AuthStackParamList>;

type Props = {
  activeTab?: 'home' | 'menu' | 'notifications';
};

export default function AdminBottomTabBar({ activeTab = 'menu' }: Props) {
  const navigation = useNavigation<NavigationProp>();
  const insets = useSafeAreaInsets();
  return (
    <View style={[styles.bottomTabContainer, { paddingBottom: insets.bottom }]}>
      <TouchableOpacity
        style={styles.bottomTabItem}
        onPress={() => navigation.navigate('AdminMenu')}
      >
        <Ionicons name="home" size={24} color="#131313" />
        <Text style={styles.bottomTabText}>Home</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.bottomTabItem}
        onPress={() => navigation.navigate('AdminMenu')}
      >
        <Ionicons name="menu" size={26} color="#555353" />
        <Text style={[styles.bottomTabText, styles.activeBottomTabText]}>
          Menu
        </Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.bottomTabItem}>
        <Ionicons name="notifications" size={24} color="#131313" />
        <Text style={styles.bottomTabText}>Notifications</Text>
      </TouchableOpacity>
    </View>
  );
}