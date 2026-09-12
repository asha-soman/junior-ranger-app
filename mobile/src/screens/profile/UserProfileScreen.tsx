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
    useState<GamificationProgress | null>(null);

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
                        earn XP and level up! 🌿
                      </Text>
                    </View>
                  </View>
                )}

                <View
                  style={
                    styles.achievementHeader
                  }
                >
                  <View
                    style={
                      styles.achievementTitleRow
                    }
                  >
                    <View
                      style={
                        styles.achievementHeaderIcon
                      }
                    >
                      <Ionicons
                        name="trophy"
                        size={22}
                        color="#FFFFFF"
                      />
                    </View>

                    <View>
                      <Text
                        style={
                          styles.achievementEyebrow
                        }
                      >
                        REWARDS
                      </Text>

                      <Text
                        style={
                          styles.achievementTitle
                        }
                      >
                        My Achievements
                      </Text>
                    </View>
                  </View>

                  <View
                    style={
                      styles.achievementCount
                    }
                  >
                    <Text
                      style={
                        styles.achievementCountText
                      }
                    >
                      {badges.length}
                    </Text>
                  </View>
                </View>

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
        </View>
      </ScrollView>

      <AppBottomTabBar
        role={profile.role}
        activeTab="menu"
      />
    </View>
  );
}
