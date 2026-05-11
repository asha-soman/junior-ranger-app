import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, ActivityIndicator } from 'react-native';
import { RouteProp, useRoute } from '@react-navigation/native';
import { AuthStackParamList } from '../../navigation/AuthNavigator';
import { AdminCohortDetails, getAdminCohortById } from '../../services/admin/adminService';
import { adminStyles as styles } from '../../styles/AdminManagementStyles';

type RouteProps = RouteProp<AuthStackParamList, 'AdminCohortDetails'>;

export default function AdminCohortDetailsScreen() {
  const route = useRoute<RouteProps>();
  const { cohortId } = route.params;

  const [cohort, setCohort] = useState<AdminCohortDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  const loadCohortDetails = async () => {
    try {
      setErrorMessage('');
      const data = await getAdminCohortById(cohortId);
      setCohort(data);
    } catch (error: any) {
      setErrorMessage(
        error?.response?.data?.message ||
          error?.message ||
          'Could not load cohort details.'
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCohortDetails();
  }, []);

  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: 'center' }]}>
        <ActivityIndicator size="large" color="#376e62" />
      </View>
    );
  }

  if (errorMessage || !cohort) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>{errorMessage}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.detailCard}>
          <Text style={styles.detailTitleCentered}>{cohort.name}</Text>

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Description</Text>
            <Text style={styles.detailValue}>
              {cohort.description || 'No description provided'}
            </Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Location</Text>
            <Text style={styles.detailValue}>
              {cohort.location || 'Not specified'}
            </Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Assigned Ranger</Text>
            <Text style={styles.detailValue}>
              {cohort.assigned_ranger_name || 'No ranger assigned'}
            </Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Member count</Text>
            <Text style={styles.detailValue}>
              {cohort.member_count}
            </Text>
          </View>
        </View>

        <Text style={styles.membersTitle}>Members</Text>

        {cohort.members.length === 0 ? (
          <View style={styles.emptyCard}>
            <Text style={styles.emptyText}>
              This cohort has no members
            </Text>
          </View>
        ) : (
          cohort.members.map((member) => (
            <View key={member.id} style={styles.userCard}>
              <Text style={styles.userName}>
                {member.user_name || 'No name provided'}
              </Text>

              <Text style={styles.userEmail}>
                {member.user_email || 'No email provided'}
              </Text>

              <View style={styles.userInfoRow}>
                <Text style={styles.userInfoLabel}>Role</Text>
                <Text style={styles.userInfoValue}>
                  {member.role.charAt(0).toUpperCase() +
                    member.role.slice(1)}
                </Text>
              </View>
            </View>
          ))
        )}
      </ScrollView>
    </View>
  );
}