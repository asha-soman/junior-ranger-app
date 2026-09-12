import React, { useCallback, useState } from 'react';
import {
  ActivityIndicator,
  Image,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { Button } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../../navigation/AuthNavigator';
import {
  getMyProfile,
  updateMyProfile,
  UserProfile,
} from '../../services/profile/profileService';
import { userProfileStyles as styles } from '../../styles/UserProfileStyles';

import AppBottomTabBar from '../../components/navigation/AppBottomTabBar';

type Props = NativeStackScreenProps<
  AuthStackParamList,
  'UserProfile'
>;

export default function UserProfileScreen({
  route,
}: Props) {
  const [profile, setProfile] =
    useState<UserProfile | null>(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState('');

  const [isEditing, setIsEditing] =
    useState(false);

  const [editedName, setEditedName] =
    useState('');

  const [saving, setSaving] =
    useState(false);

  const [validationError, setValidationError] =
    useState('');

  const loadProfile = async () => {
    try {
      setLoading(true);
      setError('');

      const data = await getMyProfile();

      setProfile(data);
    } catch (error: any) {
      console.log(
        'Profile loading error:',
        error,
      );

      setError(
        error?.response?.data?.message ||
          'Unable to load your profile.',
      );
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadProfile();
    }, []),
  );

  const formatRole = (
    role: UserProfile['role'],
  ) => {
    switch (role) {
      case 'admin':
        return 'Administrator';

      case 'ranger':
        return 'Ranger';

      case 'junior_ranger':
        return 'Junior Ranger';

      default:
        return role;
    }
  };

  const handleEditProfile = () => {
    setEditedName(profile?.name || '');
    setValidationError('');
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setEditedName(profile?.name || '');
    setValidationError('');
    setIsEditing(false);
  };

  const handleSaveProfile = async () => {
    const trimmedName = editedName.trim();

    if (!trimmedName) {
      setValidationError('Name is required.');
      return;
    }

    try {
      setSaving(true);
      setValidationError('');

      const updatedProfile =
        await updateMyProfile(trimmedName);

      setProfile(updatedProfile);
      setIsEditing(false);
    } catch (error: any) {
      setValidationError(
        error?.response?.data?.message ||
          error?.message ||
          'Unable to update your profile.',
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <View
          style={styles.loaderContainer}
        >
          <ActivityIndicator size="large" />
        </View>

        <AppBottomTabBar
          role={
            route.params?.userRole ??
            'junior_ranger'
          }
          activeTab="menu"
        />
      </View>
    );
  }

  if (error || !profile) {
    return (
      <View style={styles.container}>
        <View
          style={styles.errorContainer}
        >
          <Ionicons
            name="alert-circle-outline"
            size={50}
            color="#A33A3A"
          />

          <Text style={styles.errorText}>
            {error ||
              'Unable to load your profile.'}
          </Text>

          <Button
            mode="contained"
            onPress={loadProfile}
            style={styles.retryButton}
          >
            Try Again
          </Button>
        </View>

        <AppBottomTabBar
          role={
            route.params?.userRole ??
            'junior_ranger'
          }
          activeTab="menu"
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={
          styles.content
        }
      >
        <View style={styles.profileCard}>
          {/* Profile picture and basic information */}
          <View
            style={styles.avatarContainer}
          >
            {profile.avatar_url ? (
              <Image
                source={{
                  uri: profile.avatar_url,
                }}
                style={styles.avatar}
              />
            ) : (
              <View
                style={
                  styles.avatarPlaceholder
                }
              >
                <Ionicons
                  name="person"
                  size={65}
                  color="#376E62"
                />
              </View>
            )}

            <Text style={styles.name}>
              {profile.name ||
                'User'}
            </Text>

            <Text style={styles.role}>
              {formatRole(profile.role)}
            </Text>
          </View>

          {/* Personal Details */}
          <Text style={styles.sectionTitle}>
            Personal Details
          </Text>

          <View style={styles.fieldGroup}>
            <Text style={styles.infoLabel}>
              Name
            </Text>

            {isEditing ? (
              <>
                <TextInput
                  style={{
                    backgroundColor: '#F7FAF8',
                    borderWidth: 1,
                    borderColor: validationError
                      ? '#A33A3A'
                      : '#DDEBE5',
                    borderRadius: 16,
                    paddingHorizontal: 16,
                    paddingVertical: 13,
                    fontSize: 15,
                    color: '#222',
                  }}
                  value={editedName}
                  onChangeText={(text) => {
                    setEditedName(text);
                    setValidationError('');
                  }}
                  placeholder="Enter your name"
                  placeholderTextColor="#7B8A84"
                  autoCapitalize="words"
                />

                {validationError ? (
                  <Text
                    style={{
                      color: '#A33A3A',
                      fontSize: 13,
                      marginTop: 6,
                    }}
                  >
                    {validationError}
                  </Text>
                ) : null}
              </>
            ) : (
              <View style={styles.infoBox}>
                <Text style={styles.infoValue}>
                  {profile.name ||
                    'Not provided'}
                </Text>
              </View>
            )}
          </View>

          <View style={styles.fieldGroup}>
            <Text style={styles.infoLabel}>
              Email
            </Text>

            <View style={styles.infoBox}>
              <Text style={styles.infoValue}>
                {profile.email}
              </Text>
            </View>
          </View>

          <View style={styles.fieldGroup}>
            <Text style={styles.infoLabel}>
              Role
            </Text>

            <View style={styles.infoBox}>
              <Text style={styles.infoValue}>
                {formatRole(profile.role)}
              </Text>
            </View>
          </View>

          {/* Cohort Information */}
          {profile.cohort && (
            <>
              <Text style={styles.sectionTitle}>
                Cohort Information
              </Text>

              <View style={styles.fieldGroup}>
                <Text style={styles.infoLabel}>
                  Cohort
                </Text>

                <View style={styles.infoBox}>
                  <Text style={styles.infoValue}>
                    {profile.cohort.name}
                  </Text>
                </View>
              </View>

              {profile.cohort.location && (
                <View style={styles.fieldGroup}>
                  <Text style={styles.infoLabel}>
                    Location
                  </Text>

                  <View style={styles.infoBox}>
                    <Text style={styles.infoValue}>
                      {profile.cohort.location}
                    </Text>
                  </View>
                </View>
              )}
            </>
          )}

          {/* Edit / Save / Cancel buttons */}
          {!isEditing ? (
            <TouchableOpacity
              style={{
                backgroundColor: '#376E62',
                paddingVertical: 15,
                borderRadius: 18,
                marginTop: 12,
                alignItems: 'center',
                justifyContent: 'center',
                flexDirection: 'row',
              }}
              onPress={handleEditProfile}
            >
              <Ionicons
                name="create-outline"
                size={20}
                color="#FFFFFF"
              />

              <Text
                style={{
                  color: '#FFFFFF',
                  fontSize: 16,
                  fontWeight: '700',
                  marginLeft: 8,
                }}
              >
                Edit Profile
              </Text>
            </TouchableOpacity>
          ) : (
            <View
              style={{
                flexDirection: 'row',
                gap: 10,
                marginTop: 12,
              }}
            >
              <TouchableOpacity
                style={{
                  flex: 1,
                  backgroundColor: '#E8EEEB',
                  paddingVertical: 15,
                  borderRadius: 18,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
                onPress={handleCancelEdit}
                disabled={saving}
              >
                <Text
                  style={{
                    color: '#376E62',
                    fontSize: 16,
                    fontWeight: '700',
                  }}
                >
                  Cancel
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={{
                  flex: 1,
                  backgroundColor: '#376E62',
                  paddingVertical: 15,
                  borderRadius: 18,
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexDirection: 'row',
                }}
                onPress={handleSaveProfile}
                disabled={saving}
              >
                {saving ? (
                  <ActivityIndicator color="#FFFFFF" />
                ) : (
                  <>
                    <Ionicons
                      name="save-outline"
                      size={20}
                      color="#FFFFFF"
                    />

                    <Text
                      style={{
                        color: '#FFFFFF',
                        fontSize: 16,
                        fontWeight: '700',
                        marginLeft: 8,
                      }}
                    >
                      Save Changes
                    </Text>
                  </>
                )}
              </TouchableOpacity>
            </View>
          )}
        </View>
      </ScrollView>

      <AppBottomTabBar
        role={profile.role}
        activeTab="menu"
      />
    </View>
  );
}