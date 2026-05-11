import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { AuthStackParamList } from '../../navigation/AuthNavigator';
import { adminStyles as styles } from '../../styles/AdminManagementStyles';

type NavigationProp = NativeStackNavigationProp<AuthStackParamList, 'AdminMenu'>;

export default function AdminMenuScreen() {
  const navigation = useNavigation<NavigationProp>();

  return (
    <View style={styles.menuContainer}>
        <View style={styles.menuHeader}>
            <View style={styles.menuHeaderIcon}>
                <Ionicons name="person-circle" size={34} color="#FFFFFF" />
            </View>

            <Text style={styles.menuTitle}>Menu</Text>
        </View>

      <ScrollView contentContainerStyle={styles.menuContent}>
        <TouchableOpacity
          style={[styles.menuOption, styles.menuOptionReverse]}
          onPress={() => navigation.navigate('PendingRangerRequests')}
        >
          <Image source={require('../../../assets/images/pendingRequests.png')}
            style={styles.menuImage}
            />
          <Text style={[styles.menuOptionText, styles.menuOptionTextLeft]}>Pending Signup Requests</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.menuOption}
          onPress={() => navigation.navigate('ManageUsers')}
        >
          <Image source={require('../../../assets/images/users.png')}
            style={styles.menuImage}
            />
          <Text style={styles.menuOptionText}>Users</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.menuOption, styles.menuOptionReverse]}
          onPress={() => navigation.navigate('AdminCohorts')}
        >
          <Image source={require('../../../assets/images/cohorts.png')}
            style={styles.menuImage}
            />
          <Text style={[styles.menuOptionText, styles.menuOptionTextLeft]}>Cohorts</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuOption}>
          <Image source={require('../../../assets/images/feed.png')}
            style={styles.menuImage}
            />
          <Text style={styles.menuOptionText}>Feed</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.menuOption, styles.menuOptionReverse]}>
          <Image source={require('../../../assets/images/announcements.png')}
            style={styles.menuImage}
            />
          <Text style={[styles.menuOptionText, styles.menuOptionTextLeft]}>Notices & Events</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}