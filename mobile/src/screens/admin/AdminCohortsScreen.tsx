import React, { useEffect, useRef, useState } from 'react';
import { View, Text, ScrollView, ActivityIndicator, TouchableOpacity, TextInput } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AdminCohort, getAdminCohorts } from '../../services/admin/adminService';
import { AuthStackParamList } from '../../navigation/AuthNavigator';
import { adminStyles as styles } from '../../styles/AdminManagementStyles';

type NavigationProp = NativeStackNavigationProp<
  AuthStackParamList,
  'AdminCohorts'
>;

export default function AdminCohortsScreen() {
  const navigation = useNavigation<NavigationProp>();
  const hasMounted = useRef(false);
  const [cohorts, setCohorts] = useState<AdminCohort[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFiltering, setIsFiltering] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [searchName, setSearchName] = useState('');

  const loadCohorts = async (
    name = ''
  ) => {
    try {
      setErrorMessage('');

      if (loading) {
        setLoading(true);
      } else {
        setIsFiltering(true);
      }

      const data = await getAdminCohorts(name);

      setCohorts(data);
    } catch (error: any) {
      setErrorMessage(
        error?.response?.data?.message ||
          error?.message ||
          'Could not load cohorts.'
      );
    } finally {
      setLoading(false);
      setIsFiltering(false);
    }
  };

  useEffect(() => {
    loadCohorts();
  }, []);

  useEffect(() => {
    if (!hasMounted.current) {
      hasMounted.current = true;
      return;
    }
   
    const timeoutId = setTimeout(() => {
      loadCohorts(searchName);
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [searchName]);

  if (loading) {
    return (
      <View
        style={[
          styles.container,
          { justifyContent: 'center' },
        ]}
      >
        <ActivityIndicator
          size="large"
          color="#376e62"
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
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
            placeholder="Search by cohort name"
            placeholderTextColor="#777"
            value={searchName}
            onChangeText={setSearchName}
          />
        </View>

        {errorMessage ? (
          <Text style={styles.errorText}>
            {errorMessage}
          </Text>
        ) : cohorts.length === 0 ? (
          <View style={styles.emptyCard}>
            <Text style={styles.emptyText}>
              No cohorts found
            </Text>
          </View>
        ) : (
          cohorts.map((cohort) => (
            <TouchableOpacity
              key={cohort.id}
              style={styles.cohortCard}
              activeOpacity={0.8}
              onPress={() =>
                navigation.navigate(
                  'AdminCohortDetails',
                  {
                    cohortId: cohort.id,
                  }
                )
              }
            >
              <Text style={styles.cohortName}>
                {cohort.name}
              </Text>

              <Text style={styles.cohortDescription}>
                {cohort.description ||
                  'No description provided'}
              </Text>

              <View style={styles.userInfoRow}>
                <Text style={styles.userInfoLabel}>
                  Location
                </Text>

                <Text style={styles.userInfoValue}>
                  {cohort.location ||
                    'Not specified'}
                </Text>
              </View>

              <View style={styles.userInfoRow}>
                <Text style={styles.userInfoLabel}>
                  Assigned Ranger
                </Text>

                <Text style={styles.userInfoValue}>
                  {cohort.assigned_ranger_name ||
                    'No ranger assigned'}
                </Text>
              </View>

              <View style={styles.memberCountBadge}>
                <Text style={styles.memberCountText}>
                  {cohort.member_count} member
                  {cohort.member_count === 1
                    ? ''
                    : 's'}
                </Text>
              </View>
            </TouchableOpacity>
          ))
        )}
      </ScrollView>
    </View>
  );
}