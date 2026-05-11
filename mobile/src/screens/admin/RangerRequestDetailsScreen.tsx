import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, ActivityIndicator, TouchableOpacity, Alert } from 'react-native';
import AdminBottomTabBar from '../../components/admin/AdminBottomTabBar';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { AuthStackParamList } from '../../navigation/AuthNavigator';
import { approveRanger, getRangerRequestById, PendingRanger, rejectRanger } from '../../services/admin/adminService';
import { adminStyles as styles } from '../../styles/AdminManagementStyles';

type RouteProps = RouteProp<AuthStackParamList, 'RangerRequestDetails'>;
type NavigationProp = NativeStackNavigationProp<AuthStackParamList, 'RangerRequestDetails'>;

export default function RangerRequestDetailsScreen() {
  const route = useRoute<RouteProps>();
  const navigation = useNavigation<NavigationProp>();

  const { rangerId } = route.params;

  const [ranger, setRanger] = useState<PendingRanger | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const loadRangerDetails = async () => {
    try {
      setErrorMessage('');
      const data = await getRangerRequestById(rangerId);
      setRanger(data);
    } catch (error: any) {
      setErrorMessage(
        error?.response?.data?.message ||
          error?.message ||
          'Could not load ranger request details.'
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRangerDetails();
  }, []);

  const handleApprove = async () => {
    try {
      setActionLoading(true);
      await approveRanger(rangerId);

      Alert.alert('Success', 'Ranger account approved successfully.', [
        {
          text: 'OK',
          onPress: () => navigation.reset({
            index: 1,
            routes: [{ name: 'AdminMenu' }, { name: 'PendingRangerRequests' }],
          }),
        },
      ]);
    } catch (error: any) {
      Alert.alert(
        'Error',
        error?.response?.data?.message ||
          error?.message ||
          'Could not approve ranger account.'
      );
    } finally {
      setActionLoading(false);
    }
  };

  const handleReject = async () => {
    try {
      setActionLoading(true);
      await rejectRanger(rangerId);

      Alert.alert('Success', 'Ranger account rejected successfully.', [
        {
          text: 'OK',
          onPress: () => navigation.reset({
            index: 1,
            routes: [{ name: 'AdminMenu' }, { name: 'PendingRangerRequests' }],
          }),
        },
      ]);
    } catch (error: any) {
      Alert.alert(
        'Error',
        error?.response?.data?.message ||
          error?.message ||
          'Could not reject ranger account.'
      );
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: 'center' }]}>
        <ActivityIndicator size="large" color="#376e62" />
      </View>
    );
  }

  if (errorMessage || !ranger) {
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
          <Text style={styles.detailTitleCentered}>
            {ranger.name || 'No name provided'}
          </Text>

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Email</Text>
            <Text style={styles.detailValue}>{ranger.email}</Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Role</Text>
            <Text style={styles.detailValue}>
              {ranger.role.charAt(0).toUpperCase() + ranger.role.slice(1)}
            </Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Account status</Text>
            <Text style={styles.detailValue}>
              {ranger.is_active ? 'Active' : 'Inactive'}
            </Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Approval status</Text>
            <Text style={styles.detailValue}>
              {ranger.approval_status.charAt(0).toUpperCase() +
                ranger.approval_status.slice(1)}
            </Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Created date</Text>
            <Text style={styles.detailValue}>
              {ranger.created_at
                ? new Date(ranger.created_at).toLocaleDateString('en-GB')
                : 'Not available'}
            </Text>
          </View>

          <View style={styles.buttonsRow}>
            <TouchableOpacity
                style={[styles.inlineButton, styles.approveButton]}
                onPress={handleApprove}
                disabled={actionLoading}
            >
                <Text style={styles.actionButtonText}>
                {actionLoading ? 'Processing...' : 'Approve'}
                </Text>
            </TouchableOpacity>

            <TouchableOpacity
                style={[styles.inlineButton, styles.rejectButton]}
                onPress={handleReject}
                disabled={actionLoading}
            >
                <Text style={styles.actionButtonText}>
                {actionLoading ? 'Processing...' : 'Reject'}
                </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
      <AdminBottomTabBar activeTab={undefined} />
    </View>
  );
}