import React, {
  useCallback,
  useState,
} from 'react';

import {
  ActivityIndicator,
  Image,
  ScrollView,
  Text,
  View,
} from 'react-native';

import { Button } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

import { AuthStackParamList } from '../../navigation/AuthNavigator';

import {
  getMyProfile,
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
    useState<GamificationProgress | null>(
      null,
    );

  const [badges, setBadges] =
    useState<EarnedBadge[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState('');

  const loadProfile = async () => {
    try {
      setLoading(true);
      setError('');

      const profileData =
        await getMyProfile();

      setProfile(profileData);

      // Gamification only applies to Junior Rangers
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

  return (
    <View style={styles.container}>
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={
          styles.content
        }
      >
        <View
          style={styles.profileCard}
        >
          <View
            style={
              styles.avatarContainer
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
                  name="person"
                  size={65}
                  color="#376E62"
                />
              </View>
            )}

            <Text
              style={styles.name}
            >
              {profile.name || 'User'}
            </Text>

            <Text
              style={styles.role}
            >
              {formatRole(
                profile.role,
              )}
            </Text>
          </View>

          <Text
            style={
              styles.sectionTitle
            }
          >
            Personal Details
          </Text>

          <View
            style={styles.fieldGroup}
          >
            <Text
              style={styles.infoLabel}
            >
              Name
            </Text>

            <View
              style={styles.infoBox}
            >
              <Text
                style={
                  styles.infoValue
                }
              >
                {profile.name ||
                  'Not provided'}
              </Text>
            </View>
          </View>

          <View
            style={styles.fieldGroup}
          >
            <Text
              style={styles.infoLabel}
            >
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

          <View
            style={styles.fieldGroup}
          >
            <Text
              style={styles.infoLabel}
            >
              Role
            </Text>

            <View
              style={styles.infoBox}
            >
              <Text
                style={
                  styles.infoValue
                }
              >
                {formatRole(
                  profile.role,
                )}
              </Text>
            </View>
          </View>

          {profile.cohort && (
            <>
              <Text
                style={
                  styles.sectionTitle
                }
              >
                Cohort Information
              </Text>

              <View
                style={
                  styles.fieldGroup
                }
              >
                <Text
                  style={
                    styles.infoLabel
                  }
                >
                  Cohort
                </Text>

                <View
                  style={
                    styles.infoBox
                  }
                >
                  <Text
                    style={
                      styles.infoValue
                    }
                  >
                    {
                      profile.cohort
                        .name
                    }
                  </Text>
                </View>
              </View>

              {profile.cohort
                .location && (
                <View
                  style={
                    styles.fieldGroup
                  }
                >
                  <Text
                    style={
                      styles.infoLabel
                    }
                  >
                    Location
                  </Text>

                  <View
                    style={
                      styles.infoBox
                    }
                  >
                    <Text
                      style={
                        styles.infoValue
                      }
                    >
                      {
                        profile.cohort
                          .location
                      }
                    </Text>
                  </View>
                </View>
              )}
            </>
          )}

          {profile.role ===
            'junior_ranger' &&
            progress && (
              <>
                <Text
                  style={
                    styles.sectionTitle
                  }
                >
                  My Progress
                </Text>

                <View
                  style={
                    styles.progressCard
                  }
                >
                  <View
                    style={
                      styles.levelRow
                    }
                  >
                    <View>
                      <Text
                        style={
                          styles.levelLabel
                        }
                      >
                        Level
                      </Text>

                      <Text
                        style={
                          styles.levelNumber
                        }
                      >
                        {
                          progress.current_level
                        }
                      </Text>
                    </View>

                    <View
                      style={
                        styles.xpContainer
                      }
                    >
                      <Text
                        style={
                          styles.totalXp
                        }
                      >
                        {
                          progress.total_xp
                        }{' '}
                        XP
                      </Text>

                      {progress.next_level_xp !==
                        null && (
                        <Text
                          style={
                            styles.nextLevelText
                          }
                        >
                          Next Level:{' '}
                          {
                            progress.next_level_xp
                          }{' '}
                          XP
                        </Text>
                      )}
                    </View>
                  </View>

                  {progress.next_level_xp !==
                    null && (
                    <>
                      <View
                        style={
                          styles.progressHeader
                        }
                      >
                        <Text
                          style={
                            styles.progressText
                          }
                        >
                          Progress to Level{' '}
                          {progress.current_level +
                            1}
                        </Text>

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

                      <Text
                        style={
                          styles.progressXpText
                        }
                      >
                        {
                          progress.xp_into_level
                        }{' '}
                        XP earned in this
                        level •{' '}
                        {
                          progress.xp_needed_for_next_level
                        }{' '}
                        XP remaining
                      </Text>
                    </>
                  )}
                </View>

                <Text
                  style={
                    styles.sectionTitle
                  }
                >
                  Achievements
                </Text>

                {badges.length ===
                0 ? (
                  <View
                    style={
                      styles.emptyBadgeCard
                    }
                  >
                    <Ionicons
                      name="ribbon-outline"
                      size={34}
                      color="#6F7775"
                    />

                    <Text
                      style={
                        styles.emptyBadgeText
                      }
                    >
                      Complete tasks to
                      unlock badges.
                    </Text>
                  </View>
                ) : (
                  badges.map(
                    (badge) => (
                      <View
                        key={
                          badge.id
                        }
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
                            name="ribbon"
                            size={28}
                            color="#376E62"
                          />
                        </View>

                        <View
                          style={
                            styles.badgeContent
                          }
                        >
                          <Text
                            style={
                              styles.badgeName
                            }
                          >
                            {
                              badge.name
                            }
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
                        </View>
                      </View>
                    ),
                  )
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