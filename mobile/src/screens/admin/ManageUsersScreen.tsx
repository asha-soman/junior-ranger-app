import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, ActivityIndicator, TouchableOpacity, TextInput, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AdminUser, getAdminUsers } from '../../services/admin/adminService';
import { adminStyles as styles } from '../../styles/AdminManagementStyles';

export default function ManageUsersScreen() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRole, setSelectedRole] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [errorMessage, setErrorMessage] = useState('');
  const [statusDropdownVisible, setStatusDropdownVisible] = useState(false);
  const [activeFilterSection, setActiveFilterSection] = useState<'search' | 'filters' | null>(null);
  const [searchName, setSearchName] = useState('');
  const [isFiltering, setIsFiltering] = useState(false);

  const loadUsers = async (role = 'all', status = 'all', name = '') => {
    try {
      setErrorMessage('');
      if (loading) {
        setLoading(true);
      } else {
        setIsFiltering(true);
      };

      const data = await getAdminUsers(role, status, name);
      setUsers(data);
    } catch (error: any) {
      setErrorMessage(
        error?.response?.data?.message ||
          error?.message ||
          'Could not load users.'
      );
    } finally {
      setLoading(false);
      setIsFiltering(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  useEffect(() => {
    if (activeFilterSection !== 'search') return;

    const timeoutId = setTimeout(() => {
        setSelectedRole('all');
        setSelectedStatus('all');
        loadUsers('all', 'all', searchName);
    }, 500);

    return () => clearTimeout(timeoutId);
    }, [searchName]);

  const openSearchSection = () => {
    setActiveFilterSection(
      activeFilterSection === 'search' ? null : 'search'
    );

    setSelectedRole('all');
    setSelectedStatus('all');
    loadUsers('all', 'all', '');
  };

  const openFilterSection = () => {
    setActiveFilterSection(
      activeFilterSection === 'filters' ? null : 'filters'
    );

    setSearchName('');
    loadUsers('all', 'all', '');
  };

  const handleSearchSubmit = () => {
    setSelectedRole('all');
    setSelectedStatus('all');
    loadUsers('all', 'all', searchName);
  };

  const handleRoleFilter = (role: string) => {
    setSelectedRole(role);
    loadUsers(role, selectedStatus, '');
  };

  const handleStatusFilter = (status: string) => {
    setSelectedStatus(status);
    loadUsers(selectedRole, status, '');
  };

  const formatRole = (role: string) => {
    if (role === 'junior_ranger') return 'Junior';
    return role.charAt(0).toUpperCase() + role.slice(1);
  };

  const formatStatus = (status: string) => {
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  const getStatusBadgeStyle = (status: string) => {
    if (status === 'approved') return styles.approvedBadge;
    if (status === 'pending') return styles.pendingBadge;
    return styles.rejectedBadge;
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
      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.topFilterButtonsRow}>
          <TouchableOpacity
            style={[
              styles.topFilterButton,
              activeFilterSection === 'search' &&
                styles.activeTopFilterButton,
            ]}
            onPress={openSearchSection}
          >
            <Text
              style={[
                styles.topFilterButtonText,
                activeFilterSection === 'search' &&
                  styles.activeTopFilterButtonText,
              ]}
            >
              Search by name
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.topFilterButton,
              activeFilterSection === 'filters' &&
                styles.activeTopFilterButton,
            ]}
            onPress={openFilterSection}
          >
            <Text
              style={[
                styles.topFilterButtonText,
                activeFilterSection === 'filters' &&
                  styles.activeTopFilterButtonText,
              ]}
            >
              Filter options
            </Text>
          </TouchableOpacity>
        </View>

        {activeFilterSection === 'search' && (
          <View>
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
                onChangeText={setSearchName}
                returnKeyType="search"
                onSubmitEditing={handleSearchSubmit}
              />
            </View>
          </View>
        )}

        {activeFilterSection === 'filters' && (
          <>
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
                      selectedRole === role &&
                        styles.activeFilterChipText,
                    ]}
                  >
                    {role === 'all' ? 'All' : formatRole(role)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={styles.sectionTitle}>Status</Text>

            <TouchableOpacity
              style={styles.dropdownButton}
              onPress={() => setStatusDropdownVisible(true)}
            >
              <Text style={styles.dropdownButtonText}>
                {selectedStatus === 'all'
                  ? 'All'
                  : formatStatus(selectedStatus)}
              </Text>
            </TouchableOpacity>

            <Modal
              visible={statusDropdownVisible}
              transparent
              animationType="fade"
            >
              <TouchableOpacity
                style={styles.modalOverlay}
                onPress={() => setStatusDropdownVisible(false)}
              >
                <View style={styles.dropdownMenu}>
                  {['all', 'approved', 'pending', 'rejected'].map(
                    (status) => (
                      <TouchableOpacity
                        key={status}
                        style={styles.dropdownOption}
                        onPress={() => {
                          handleStatusFilter(status);
                          setStatusDropdownVisible(false);
                        }}
                      >
                        <Text style={styles.dropdownOptionText}>
                          {status === 'all'
                            ? 'All'
                            : formatStatus(status)}
                        </Text>
                      </TouchableOpacity>
                    )
                  )}
                </View>
              </TouchableOpacity>
            </Modal>
          </>
        )}

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
                    getStatusBadgeStyle(user.approval_status),
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