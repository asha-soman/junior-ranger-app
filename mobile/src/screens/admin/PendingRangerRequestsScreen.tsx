import React, { useEffect, useState } from 'react';
import { useFocusEffect, useRoute, RouteProp, useNavigation } from '@react-navigation/native';
import { View, Text, ScrollView, ActivityIndicator, TouchableOpacity, RefreshControl, TextInput } from 'react-native';
import { getPendingRangers, PendingRanger } from '../../services/admin/adminService';
import { adminStyles as styles } from '../../styles/AdminManagementStyles';
import { Ionicons } from "@expo/vector-icons";
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../../navigation/AuthNavigator';

type NavigationProp = NativeStackNavigationProp<AuthStackParamList, 'PendingRangerRequests'>;
type RouteProps = RouteProp<AuthStackParamList, 'PendingRangerRequests'>;

export default function PendingRangerRequestsScreen() {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<RouteProps>();
  const [rangers, setRangers] = useState<PendingRanger[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [searchName, setSearchName] = useState('');

  const loadPendingRangers = async (nameValue = searchName) => {
    try {
      setErrorMessage('');

      const data = await getPendingRangers(nameValue);

      setRangers(data);
    } catch (error: any) {
      const message =
        error?.response?.data?.message ||
        error?.message ||
        'Could not load pending ranger requests.';

      setErrorMessage(message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadPendingRangers();
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      loadPendingRangers(searchName);
    }, [searchName])
  );

  const handleSearchChange = (value: string) => {
    setSearchName(value);
    loadPendingRangers(value);
  };

  const handleRefresh = () => {
    setRefreshing(true);
    loadPendingRangers();
  };

  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: 'center' }]}>
        <ActivityIndicator size="large" color="#6F8F8B" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.content}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
          />
        }
      >

        <View style={styles.searchContainer}>
          <Ionicons
            name="search"
            size={22}
            color="#777"
            style={styles.searchIcon}
          />

          <TextInput
            style={styles.searchInput}
            placeholder="Search by name"
            placeholderTextColor="#777"
            value={searchName}
            onChangeText={handleSearchChange}
          />
        </View>

        {errorMessage ? (
          <Text style={styles.errorText}>{errorMessage}</Text>
        ) : rangers.length === 0 ? (
          <View style={styles.emptyCard}>
            <Text style={styles.emptyText}>
              There are no pending ranger requests
            </Text>
          </View>
        ) : (
          rangers.map((ranger) => (
            <TouchableOpacity
              key={ranger.id}
              style={styles.card}
              activeOpacity={0.8}
              onPress={() =>
                navigation.navigate('RangerRequestDetails', {
                  rangerId: ranger.id,
                })
              }
            >
              <View style={styles.cardHeader}>
                <Text
                  style={styles.manageUserName}
                  numberOfLines={2}
                >
                  {ranger.name || 'No name provided'}
                </Text>

                <View style={styles.pendingBadge}>
                  <Text style={styles.pendingBadgeText}>
                    {ranger.approval_status.charAt(0).toUpperCase() +
                      ranger.approval_status.slice(1)}
                  </Text>
                </View>
              </View>

              <Text style={styles.email}>
                {ranger.email}
              </Text>

              <View style={styles.row}>
                <Text style={styles.label}>
                  Role
                </Text>

                <Text style={styles.value}>
                  {ranger.role.charAt(0).toUpperCase() +
                    ranger.role.slice(1)}
                </Text>
              </View>

              <View style={styles.row}>
                <Text style={styles.label}>
                  Created
                </Text>

                <Text style={styles.value}>
                  {ranger.created_at
                    ? new Date(ranger.created_at)
                        .toLocaleDateString('en-GB')
                    : 'Not available'}
                </Text>
              </View>

            </TouchableOpacity>
          ))
        )}

      </ScrollView>
    </View>
  );
}