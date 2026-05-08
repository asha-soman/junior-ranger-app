import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, ActivityIndicator, TouchableOpacity } from 'react-native';
import { AdminUser, getAdminUsers } from '../../services/admin/adminService';
import { adminStyles as styles } from '../../styles/AdminManagementStyles';

export default function ManageUsersScreen() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRole, setSelectedRole] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [errorMessage, setErrorMessage] = useState('');

  const loadUsers = async (role = selectedRole, status = selectedStatus) => {
    try {
      setErrorMessage('');
      setLoading(true);

      const data = await getAdminUsers(role, status);
      setUsers(data);
    } catch (error: any) {
      setErrorMessage(
        error?.response?.data?.message ||
          error?.message ||
          'Could not load users.'
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleRoleFilter = (role: string) => {
    setSelectedRole(role);
    loadUsers(role, selectedStatus);
  };

  const handleStatusFilter = (status: string) => {
    setSelectedStatus(status);
    loadUsers(selectedRole, status);
  };

  const formatRole = (role: string) => {
    if (role === 'junior_ranger') return 'Junior';
    return role.charAt(0).toUpperCase() + role.slice(1);
  };

  const formatStatus = (status: string) => {
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: 'center' }]}>
        <ActivityIndicator size="large" color="#376e62" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>

        <Text style={styles.sectionTitle}>Role</Text>

        <View style={styles.filterRow}>
          {['all', 'junior_ranger', 'ranger'].map((role) => (
            <TouchableOpacity
              key={role}
              style={[
                styles.filterChip,
                selectedRole === role && styles.activeFilterChip,
              ]}
              onPress={() => handleRoleFilter(role)}
            >
              <Text
                style={[
                  styles.filterChipText,
                  selectedRole === role && styles.activeFilterChipText,
                ]}
              >
                {role === 'all' ? 'All' : formatRole(role)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.sectionTitle}>Status</Text>

        <View style={styles.filterRow}>
          {['all', 'approved', 'pending', 'rejected'].map((status) => (
            <TouchableOpacity
              key={status}
              style={[
                styles.filterChip,
                selectedStatus === status && styles.activeFilterChip,
              ]}
              onPress={() => handleStatusFilter(status)}
            >
              <Text
                style={[
                  styles.filterChipText,
                  selectedStatus === status && styles.activeFilterChipText,
                ]}
              >
                {status === 'all' ? 'All' : formatStatus(status)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {errorMessage ? (
          <Text style={styles.errorText}>{errorMessage}</Text>
        ) : users.length === 0 ? (
          <View style={styles.emptyCard}>
            <Text style={styles.emptyText}>No users found</Text>
          </View>
        ) : (
          users.map((user) => (
            <View key={user.id} style={styles.userCard}>
              <View style={styles.userCardHeader}>
                <Text style={styles.userName}>
                  {user.name || 'No name provided'}
                </Text>

                <View
                  style={[
                    styles.userStatusBadge,
                    user.approval_status === 'approved'
                      ? styles.approvedBadge
                      : user.approval_status === 'pending'
                      ? styles.pendingBadge
                      : styles.rejectedBadge,
                ]}
                >
                  <Text style={styles.userStatusText}>
                    {formatStatus(user.approval_status)}
                  </Text>
                </View>
              </View>

              <Text style={styles.userEmail}>{user.email}</Text>

              <View style={styles.userInfoRow}>
                <Text style={styles.userInfoLabel}>Role</Text>
                <Text style={styles.userInfoValue}>
                  {formatRole(user.role)}
                </Text>
              </View>

              <View style={styles.userInfoRow}>
                <Text style={styles.userInfoLabel}>Cohort</Text>
                <Text style={styles.userInfoValue}>
                  {user.cohort_name || 'No cohort assigned'}
                </Text>
              </View>
            </View>
          ))
        )}
      </ScrollView>
    </View>
  );
}