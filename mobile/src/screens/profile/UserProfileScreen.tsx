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

import {
  EarnedBadge,
  GamificationProgress,
  getMyBadges,
  getMyGamificationProgress,
} from '../../services/gamification/gamificationService';

import {
  userProfileStyles as styles,
} from '../../styles/UserProfileStyles';

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

  const [progress, setProgress] =
    useState<GamificationProgress | null>(null);

  const [badges, setBadges] =
    useState<EarnedBadge[]>([]);

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

  const [achievementsExpanded, setAchievementsExpanded] =
    useState(false);

  const [personalDetailsExpanded, setPersonalDetailsExpanded] =
    useState(false);

  const [cohortExpanded, setCohortExpanded] =
    useState(false);

  const loadProfile = async () => {
    try {
      setLoading(true);
      setError('');

      const profileData =
        await getMyProfile();

      setProfile(profileData);

      if (
        profileData.role ===
        'junior_ranger'
      ) {
        const [
          progressData,
          badgeData,
        ] = await Promise.all([
          getMyGamificationProgress(),
          getMyBadges(),
        ]);

        setProgress(progressData);
        setBadges(badgeData);
      } else {
        setProgress(null);
        setBadges([]);
      }
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
    setPersonalDetailsExpanded(true);
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

  const getLevelTitle = (
    level: number,
  ) => {
    if (level >= 5) {
      return 'Nature Champion';
    }

    if (level === 4) {
      return 'Wildlife Guardian';
    }

    if (level === 3) {
      return 'Adventure Explorer';
    }

    if (level === 2) {
      return 'Rising Ranger';
    }

    return 'Junior Explorer';
  };

  const getBadgeIcon = (
    criteriaType: string | null,
  ):
    | 'ribbon'
    | 'star'
    | 'checkmark-circle'
    | 'trophy' => {
    switch (criteriaType) {
      case 'xp':
        return 'star';

      case 'task_count':
        return 'checkmark-circle';

      case 'level':
        return 'trophy';

      default:
        return 'ribbon';
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <View
          style={
            styles.loaderContainer
          }
        >
          <ActivityIndicator
            size="large"
          />
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
          style={
            styles.errorContainer
          }
        >
          <Ionicons
            name="alert-circle-outline"
            size={50}
            color="#A33A3A"
          />

          <Text
            style={styles.errorText}
          >
            {error ||
              'Unable to load your profile.'}
          </Text>

          <Button
            mode="contained"
            onPress={loadProfile}
            style={
              styles.retryButton
            }
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

  const isJuniorRanger =
    profile.role ===
    'junior_ranger';

  return (
    <View style={styles.container}>
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={
          styles.content
        }
        showsVerticalScrollIndicator={
          false
        }
      >
        <View
          style={[
            styles.profileCard,
            isJuniorRanger &&
              styles.juniorProfileCard,
          ]}
        >
          <View
            style={
              styles.avatarContainer
            }
          >
            <View
              style={
                isJuniorRanger
                  ? styles.juniorAvatarRing
                  : undefined
              }
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
                    name={
                      isJuniorRanger
                        ? 'leaf'
                        : 'person'
                    }
                    size={
                      isJuniorRanger
                        ? 52
                        : 65
                    }
                    color="#376E62"
                  />
                </View>
              )}
            </View>

            {isJuniorRanger && (
              <View
                style={
                  styles.juniorRolePill
                }
              >
                <Ionicons
                  name="compass"
                  size={14}
                  color="#FFFFFF"
                />

                <Text
                  style={
                    styles.juniorRolePillText
                  }
                >
                  JUNIOR RANGER
                </Text>
              </View>
            )}

            <Text
              style={styles.name}
            >
              {profile.name || 'User'}
            </Text>

            {!isJuniorRanger && (
              <Text
                style={styles.role}
              >
                {formatRole(
                  profile.role,
                )}
              </Text>
            )}

            {isJuniorRanger &&
              progress && (
                <Text
                  style={
                    styles.levelNickname
                  }
                >
                  {getLevelTitle(
                    progress.current_level,
                  )}
                </Text>
              )}
          </View>

          {isJuniorRanger &&
            progress && (
              <>
                <View
                  style={
                    styles.gamificationHeroCard
                  }
                >
                  <View
                    style={
                      styles.levelBadgeCircle
                    }
                  >
                    <Text
                      style={
                        styles.levelBadgeSmall
                      }
                    >
                      LEVEL
                    </Text>

                    <Text
                      style={
                        styles.levelBadgeNumber
                      }
                    >
                      {
                        progress.current_level
                      }
                    </Text>
                  </View>

                  <View
                    style={
                      styles.gamificationHeroContent
                    }
                  >
                    <Text
                      style={
                        styles.gamificationHeroEyebrow
                      }
                    >
                      YOUR RANGER JOURNEY
                    </Text>

                    <Text
                      style={
                        styles.gamificationHeroTitle
                      }
                    >
                      {getLevelTitle(
                        progress.current_level,
                      )}
                    </Text>

                    <View
                      style={
                        styles.totalXpPill
                      }
                    >
                      <Ionicons
                        name="star"
                        size={16}
                        color="#D89B22"
                      />

                      <Text
                        style={
                          styles.totalXpPillText
                        }
                      >
                        {
                          progress.total_xp
                        }{' '}
                        Total XP
                      </Text>
                    </View>
                  </View>
                </View>

                {progress.next_level_xp !==
                  null && (
                  <View
                    style={
                      styles.progressCard
                    }
                  >
                    <View
                      style={
                        styles.progressHeader
                      }
                    >
                      <View>
                        <Text
                          style={
                            styles.progressSectionEyebrow
                          }
                        >
                          KEEP EXPLORING
                        </Text>

                        <Text
                          style={
                            styles.progressText
                          }
                        >
                          Progress to Level{' '}
                          {progress.current_level +
                            1}
                        </Text>
                      </View>

                      <View
                        style={
                          styles.progressPercentPill
                        }
                      >
                        <Text
                          style={
                            styles.progressPercent
                          }
                        >
                          {
                            progress.progress_percentage
                          }
                          %
                        </Text>
                      </View>
                    </View>

                    <View
                      style={
                        styles.progressBarBackground
                      }
                    >
                      <View
                        style={[
                          styles.progressBarFill,
                          {
                            width: `${progress.progress_percentage}%`,
                          },
                        ]}
                      />
                    </View>

                    <View
                      style={
                        styles.progressBottomRow
                      }
                    >
                      <View
                        style={
                          styles.progressMiniStat
                        }
                      >
                        <Ionicons
                          name="star-outline"
                          size={18}
                          color="#3D786B"
                        />

                        <View>
                          <Text
                            style={
                              styles.progressMiniValue
                            }
                          >
                            {
                              progress.xp_into_level
                            }{' '}
                            XP
                          </Text>

                          <Text
                            style={
                              styles.progressMiniLabel
                            }
                          >
                            earned this level
                          </Text>
                        </View>
                      </View>

                      <View
                        style={
                          styles.progressMiniDivider
                        }
                      />

                      <View
                        style={
                          styles.progressMiniStat
                        }
                      >
                        <Ionicons
                          name="flag-outline"
                          size={18}
                          color="#D89B22"
                        />

                        <View>
                          <Text
                            style={
                              styles.progressMiniValue
                            }
                          >
                            {
                              progress.xp_needed_for_next_level
                            }{' '}
                            XP
                          </Text>

                          <Text
                            style={
                              styles.progressMiniLabel
                            }
                          >
                            until next level
                          </Text>
                        </View>
                      </View>
                    </View>

                    <View
                      style={
                        styles.progressEncouragement
                      }
                    >
                      <Text
                        style={
                          styles.progressEncouragementText
                        }
                      >
                        Keep completing tasks to
                        earn XP and level up!
                      </Text>
                    </View>
                  </View>
                )}

                <TouchableOpacity
                  activeOpacity={0.85}
                  onPress={() =>
                    setAchievementsExpanded(
                      !achievementsExpanded,
                    )
                  }
                  style={{
                    backgroundColor: '#FFF9E8',
                    borderWidth: 1,
                    borderColor: '#F0DFA5',
                    borderRadius: 18,
                    padding: 16,
                    marginTop: 5,
                    marginBottom: achievementsExpanded ? 12 : 16,
                  }}
                >
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                    }}
                  >
                    <View
                      style={{
                        width: 50,
                        height: 50,
                        borderRadius: 16,
                        backgroundColor: '#3D786B',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginRight: 12,
                      }}
                    >
                      <Ionicons
                        name="trophy"
                        size={24}
                        color="#FFFFFF"
                      />
                    </View>

                    <View style={{ flex: 1 }}>
                      <Text
                        style={{
                          fontSize: 10,
                          fontWeight: '900',
                          letterSpacing: 1,
                          color: '#9A7A2D',
                          marginBottom: 2,
                        }}
                      >
                        REWARD COLLECTION
                      </Text>

                      <Text
                        style={{
                          fontSize: 18,
                          fontWeight: '900',
                          color: '#315F56',
                        }}
                      >
                        My Achievements
                      </Text>

                      <Text
                        style={{
                          marginTop: 4,
                          fontSize: 12,
                          color: '#7A7156',
                          fontWeight: '600',
                        }}
                      >
                        {badges.length} badge{badges.length === 1 ? '' : 's'} earned
                      </Text>
                    </View>

                    <View
                      style={{
                        minWidth: 40,
                        height: 40,
                        borderRadius: 20,
                        backgroundColor: '#FFF0B8',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginRight: 8,
                        paddingHorizontal: 8,
                      }}
                    >
                      <Text
                        style={{
                          color: '#946B13',
                          fontSize: 14,
                          fontWeight: '900',
                        }}
                      >
                        {badges.length}
                      </Text>
                    </View>

                    <Ionicons
                      name={
                        achievementsExpanded
                          ? 'chevron-up'
                          : 'chevron-forward'
                      }
                      size={22}
                      color="#7E6A31"
                    />
                  </View>

                  {!achievementsExpanded &&
                    badges.length > 0 && (
                      <View
                        style={{
                          flexDirection: 'row',
                          marginTop: 13,
                        }}
                      >
                        {badges
                          .slice(0, 3)
                          .map((badge, index) => (
                            <View
                              key={badge.id}
                              style={{
                                width: 36,
                                height: 36,
                                borderRadius: 18,
                                backgroundColor:
                                  index % 2 === 0
                                    ? '#DDF0EA'
                                    : '#E7F2EF',
                                borderWidth: 2,
                                borderColor: '#FFFFFF',
                                alignItems: 'center',
                                justifyContent: 'center',
                                marginLeft: index === 0 ? 0 : -7,
                              }}
                            >
                              <Ionicons
                                name={getBadgeIcon(
                                  badge.criteria_type,
                                )}
                                size={18}
                                color="#3D786B"
                              />
                            </View>
                          ))}

                        {badges.length > 3 && (
                          <View
                            style={{
                              width: 36,
                              height: 36,
                              borderRadius: 18,
                              backgroundColor: '#F2E7BE',
                              borderWidth: 2,
                              borderColor: '#FFFFFF',
                              alignItems: 'center',
                              justifyContent: 'center',
                              marginLeft: -7,
                            }}
                          >
                            <Text
                              style={{
                                fontSize: 11,
                                fontWeight: '900',
                                color: '#8C6C1E',
                              }}
                            >
                              +{badges.length - 3}
                            </Text>
                          </View>
                        )}
                      </View>
                    )}
                </TouchableOpacity>

                {achievementsExpanded && (
                  <>
                {badges.length ===
                0 ? (
                  <View
                    style={
                      styles.emptyBadgeCard
                    }
                  >
                    <View
                      style={
                        styles.emptyBadgeIcon
                      }
                    >
                      <Ionicons
                        name="ribbon-outline"
                        size={36}
                        color="#6F7775"
                      />
                    </View>

                    <Text
                      style={
                        styles.emptyBadgeTitle
                      }
                    >
                      Your badge collection
                      starts here!
                    </Text>

                    <Text
                      style={
                        styles.emptyBadgeText
                      }
                    >
                      Complete tasks, earn XP,
                      and level up to unlock
                      achievements.
                    </Text>
                  </View>
                ) : (
                  <View
                    style={
                      styles.badgeGrid
                    }
                  >
                    {badges.map(
                      (badge) => (
                        <View
                          key={badge.id}
                          style={
                            styles.badgeCard
                          }
                        >
                          <View
                            style={
                              styles.badgeIcon
                            }
                          >
                            <Ionicons
                              name={getBadgeIcon(
                                badge.criteria_type,
                              )}
                              size={30}
                              color="#FFFFFF"
                            />
                          </View>

                          <Text
                            style={
                              styles.badgeName
                            }
                          >
                            {badge.name}
                          </Text>

                          {badge.description && (
                            <Text
                              style={
                                styles.badgeDescription
                              }
                            >
                              {
                                badge.description
                              }
                            </Text>
                          )}

                          <View
                            style={
                              styles.earnedBadgePill
                            }
                          >
                            <Ionicons
                              name="checkmark-circle"
                              size={13}
                              color="#2F725B"
                            />

                            <Text
                              style={
                                styles.earnedBadgePillText
                              }
                            >
                              EARNED
                            </Text>
                          </View>
                        </View>
                      ),
                    )}
                  </View>
                )}

                <View
                  style={
                    styles.nextGoalCard
                  }
                >
                  <Ionicons
                    name="sparkles"
                    size={23}
                    color="#D89B22"
                  />

                  <View
                    style={{ flex: 1 }}
                  >
                    <Text
                      style={
                        styles.nextGoalTitle
                      }
                    >
                      Keep collecting!
                    </Text>

                    <Text
                      style={
                        styles.nextGoalText
                      }
                    >
                      More tasks and adventures
                      mean more XP, levels and
                      badges.
                    </Text>
                  </View>
                </View>

                  </>
                )}
              </>
            )}

          <TouchableOpacity
            activeOpacity={0.85}
            onPress={() =>
              setPersonalDetailsExpanded(
                !personalDetailsExpanded,
              )
            }
            style={{
              backgroundColor: '#F8FCFA',
              borderWidth: 1,
              borderColor: '#D9E9E4',
              borderRadius: 18,
              paddingHorizontal: 16,
              paddingVertical: 15,
              marginTop: 16,
              marginBottom: personalDetailsExpanded ? 12 : 10,
            }}
          >
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
              }}
            >
              <View
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 14,
                  backgroundColor: '#E2F1ED',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginRight: 12,
                }}
              >
                <Ionicons
                  name="person-outline"
                  size={22}
                  color="#3D786B"
                />
              </View>

              <View style={{ flex: 1 }}>
                <Text
                  style={{
                    fontSize: 10,
                    fontWeight: '800',
                    letterSpacing: 0.9,
                    color: '#84A39B',
                    marginBottom: 2,
                  }}
                >
                  PROFILE
                </Text>

                <Text
                  style={{
                    fontSize: 17,
                    fontWeight: '800',
                    color: '#315F56',
                  }}
                >
                  Personal Details
                </Text>

                {!personalDetailsExpanded && (
                  <Text
                    numberOfLines={1}
                    style={{
                      marginTop: 4,
                      fontSize: 12,
                      color: '#6E7C78',
                    }}
                  >
                    {profile.name || 'User'} • {profile.email}
                  </Text>
                )}
              </View>

              <Ionicons
                name={
                  personalDetailsExpanded
                    ? 'chevron-up'
                    : 'chevron-forward'
                }
                size={22}
                color="#3D786B"
              />
            </View>
          </TouchableOpacity>

          {personalDetailsExpanded && (
            <View>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: 14,
                }}
              >
                <View>
                  <Text
                    style={{
                      fontSize: 12,
                      color: '#78948D',
                      fontWeight: '700',
                      marginBottom: 2,
                    }}
                  >
                    ACCOUNT INFORMATION
                  </Text>

                  <Text
                    style={{
                      fontSize: 16,
                      color: '#315F56',
                      fontWeight: '800',
                    }}
                  >
                    Your personal information
                  </Text>
                </View>

                {!isEditing && (
                  <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={handleEditProfile}
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: 12,
                      backgroundColor: '#3D786B',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Ionicons
                      name="create-outline"
                      size={19}
                      color="#FFFFFF"
                    />
                  </TouchableOpacity>
                )}
              </View>

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

            <View
              style={styles.infoBox}
            >
              <Text
                style={
                  styles.infoValue
                }
              >
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



              {isEditing && (
                <View
                  style={{
                    flexDirection: 'row',
                    gap: 10,
                    marginTop: 6,
                    marginBottom: 4,
                  }}
                >
                  <TouchableOpacity
                    style={{
                      flex: 1,
                      backgroundColor: '#E8EEEB',
                      paddingVertical: 14,
                      borderRadius: 16,
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                    onPress={handleCancelEdit}
                    disabled={saving}
                  >
                    <Text
                      style={{
                        color: '#376E62',
                        fontSize: 15,
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
                      paddingVertical: 14,
                      borderRadius: 16,
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
                          size={19}
                          color="#FFFFFF"
                        />

                        <Text
                          style={{
                            color: '#FFFFFF',
                            fontSize: 15,
                            fontWeight: '700',
                            marginLeft: 7,
                          }}
                        >
                          Save
                        </Text>
                      </>
                    )}
                  </TouchableOpacity>
                </View>
              )}
            </View>
          )}

          {/* Cohort Information */}
          {profile.cohort && (
            <>
              <TouchableOpacity
                activeOpacity={0.85}
                onPress={() =>
                  setCohortExpanded(
                    !cohortExpanded,
                  )
                }
                style={{
                  backgroundColor: '#F1F8F6',
                  borderWidth: 1,
                  borderColor: '#D7E8E3',
                  borderRadius: 18,
                  paddingHorizontal: 16,
                  paddingVertical: 15,
                  marginTop: 10,
                  marginBottom: cohortExpanded ? 12 : 8,
                }}
              >
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                  }}
                >
                  <View
                    style={{
                      width: 44,
                      height: 44,
                      borderRadius: 14,
                      backgroundColor: '#DDEEE9',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginRight: 12,
                    }}
                  >
                    <Ionicons
                      name="people-outline"
                      size={22}
                      color="#3D786B"
                    />
                  </View>

                  <View style={{ flex: 1 }}>
                    <Text
                      style={{
                        fontSize: 10,
                        fontWeight: '800',
                        letterSpacing: 0.9,
                        color: '#7A9D95',
                        marginBottom: 2,
                      }}
                    >
                      MY GROUP
                    </Text>

                    <Text
                      style={{
                        fontSize: 17,
                        fontWeight: '800',
                        color: '#315F56',
                      }}
                    >
                      Cohort Information
                    </Text>

                    {!cohortExpanded && (
                      <Text
                        numberOfLines={1}
                        style={{
                          marginTop: 4,
                          fontSize: 12,
                          color: '#6D7D79',
                        }}
                      >
                        {profile.cohort.name}
                        {profile.cohort.location
                          ? ` • ${profile.cohort.location}`
                          : ''}
                      </Text>
                    )}
                  </View>

                  <Ionicons
                    name={
                      cohortExpanded
                        ? 'chevron-up'
                        : 'chevron-forward'
                    }
                    size={22}
                    color="#3D786B"
                  />
                </View>
              </TouchableOpacity>

              {cohortExpanded && (
                <View>

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

                </View>
              )}
            </>
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
