import React, {
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';

import {
  ActivityIndicator,
  Animated,
  Dimensions,
  Easing,
  Modal,
  ScrollView,
  Text,
  View,
} from 'react-native';

import {
  Button,
  Chip,
} from 'react-native-paper';

import { Ionicons } from '@expo/vector-icons';

import {
  useFocusEffect,
} from '@react-navigation/native';

import {
  NativeStackScreenProps,
} from '@react-navigation/native-stack';

import {
  AuthStackParamList,
} from '../../navigation/AuthNavigator';

import {
  Adventure,
  AdventureTask,
  getAdventureById,
  getAdventureTasks,
} from '../../services/adventures/adventureService';

import {
  AdventureProgress,
  TaskProgressStatus,
  getAdventureProgress,
} from '../../services/gamification/gamificationService';

import apiClient from '../../services/api/client';

import {
  adventureStyles as styles,
} from '../../styles/AdventureStyles';

type Props = NativeStackScreenProps<
  AuthStackParamList,
  'AdventureDetails'
>;

type UserRole =
  | 'admin'
  | 'ranger'
  | 'junior_ranger';

type TaskIconName =
  React.ComponentProps<typeof Ionicons>['name'];

type TaskVisual = {
  icon: TaskIconName;
  iconColor: string;
  iconBackground: string;
  cardBackground: string;
  borderColor: string;
  statusBackground: string;
  statusColor: string;
  statusLabel: string;
};


const CONFETTI_COLORS = [
  '#F2C94C',
  '#EB7A67',
  '#55A99D',
  '#6EA8E6',
  '#A57BD4',
  '#F29F67',
  '#7CCB8A',
];

const CONFETTI_PIECES = [
  { left: 5, delay: 0, color: CONFETTI_COLORS[0] },
  { left: 11, delay: 180, color: CONFETTI_COLORS[1] },
  { left: 17, delay: 50, color: CONFETTI_COLORS[2] },
  { left: 24, delay: 300, color: CONFETTI_COLORS[3] },
  { left: 31, delay: 120, color: CONFETTI_COLORS[4] },
  { left: 38, delay: 420, color: CONFETTI_COLORS[5] },
  { left: 45, delay: 70, color: CONFETTI_COLORS[6] },
  { left: 52, delay: 260, color: CONFETTI_COLORS[0] },
  { left: 59, delay: 100, color: CONFETTI_COLORS[3] },
  { left: 66, delay: 380, color: CONFETTI_COLORS[1] },
  { left: 73, delay: 20, color: CONFETTI_COLORS[4] },
  { left: 80, delay: 220, color: CONFETTI_COLORS[2] },
  { left: 87, delay: 140, color: CONFETTI_COLORS[5] },
  { left: 94, delay: 340, color: CONFETTI_COLORS[6] },
];

function ConfettiPiece({
  left,
  delay,
  color,
}: {
  left: number;
  delay: number;
  color: string;
}) {
  const fall = useRef(
    new Animated.Value(-80),
  ).current;

  const rotate = useRef(
    new Animated.Value(0),
  ).current;

  useEffect(() => {
    fall.setValue(-80);
    rotate.setValue(0);

    Animated.parallel([
      Animated.timing(fall, {
        toValue:
          Dimensions.get('window').height +
          100,
        duration: 2600,
        delay,
        easing: Easing.out(
          Easing.quad,
        ),
        useNativeDriver: true,
      }),
      Animated.timing(rotate, {
        toValue: 1,
        duration: 2200,
        delay,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
    ]).start();
  }, [
    delay,
    fall,
    rotate,
  ]);

  const rotation =
    rotate.interpolate({
      inputRange: [0, 1],
      outputRange: [
        '0deg',
        '720deg',
      ],
    });

  return (
    <Animated.View
      pointerEvents="none"
      style={{
        position: 'absolute',
        left:
          (Dimensions.get('window')
            .width *
            left) /
          100,
        top: 0,
        width: 10,
        height: 18,
        borderRadius: 3,
        backgroundColor: color,
        transform: [
          {
            translateY: fall,
          },
          {
            rotate: rotation,
          },
        ],
      }}
    />
  );
}

export default function AdventureDetailsScreen({
  navigation,
  route,
}: Props) {
  const { adventureId } = route.params;

  const [
    adventure,
    setAdventure,
  ] = useState<Adventure | null>(null);

  const [
    adventureTasks,
    setAdventureTasks,
  ] = useState<AdventureTask[]>([]);

  const [
    adventureProgress,
    setAdventureProgress,
  ] =
    useState<AdventureProgress | null>(
      null,
    );

  const [
    userRole,
    setUserRole,
  ] =
    useState<UserRole | null>(null);

  const [
    loading,
    setLoading,
  ] = useState(false);

  const [
    progressLoading,
    setProgressLoading,
  ] = useState(false);

  const [
    taskLoading,
    setTaskLoading,
  ] = useState(false);

  const [
    error,
    setError,
  ] = useState('');

  const [
    userId,
    setUserId,
  ] = useState('');

  const [
    showCompletionCelebration,
    setShowCompletionCelebration,
  ] = useState(false);

  const hasShownCompletionCelebration =
    useRef(false);

  const fetchAdventureDetails =
    async () => {
      try {
        setLoading(true);
        setError('');

        const data =
          await getAdventureById(
            adventureId,
          );

        setAdventure(data);
      } catch (err) {
        console.log(
          'Fetch adventure details error:',
          err,
        );

        setError(
          'Unable to load adventure details.',
        );
      } finally {
        setLoading(false);
      }
    };

  const fetchProfile =
    async () => {
      try {
        const response =
          await apiClient.get(
            '/auth/profile',
          );

        setUserRole(
          response.data.role,
        );

        setUserId(
          response.data.userId,
        );
      } catch (err) {
        console.log(
          'Fetch profile error:',
          err,
        );
      }
    };

  const fetchAdventureProgress =
    async () => {
      try {
        setProgressLoading(true);

        const data =
          await getAdventureProgress(
            adventureId,
          );

        setAdventureProgress(data);
      } catch (err) {
        console.log(
          'Fetch adventure progress error:',
          err,
        );

        setAdventureProgress(null);
      } finally {
        setProgressLoading(false);
      }
    };

  const fetchAdventureTasks =
    async () => {
      try {
        setTaskLoading(true);

        const data =
          await getAdventureTasks(
            adventureId,
          );

        setAdventureTasks(data);
      } catch (err) {
        console.log(
          'Fetch adventure tasks error:',
          err,
        );

        setAdventureTasks([]);
      } finally {
        setTaskLoading(false);
      }
    };

  useEffect(() => {
    fetchAdventureDetails();
    fetchProfile();
  }, [adventureId]);

  useFocusEffect(
    useCallback(() => {
      fetchAdventureDetails();

      if (
        userRole ===
        'junior_ranger'
      ) {
        fetchAdventureProgress();
      }

      if (
        userRole === 'junior_ranger' ||
        userRole === 'ranger' ||
        userRole === 'admin'
      ) {
        fetchAdventureTasks();
      }
    }, [
      userRole,
      adventureId,
    ]),
  );

  const canEditAdventure =
    userRole === 'admin' ||
    (
      userRole === 'ranger' &&
      adventure
        ?.created_by_user_id ===
        userId
    );

  const canViewSubmissions =
    userRole === 'ranger';

  /*
   * =========================================
   * JUNIOR RANGER GAMIFICATION HELPERS
   * =========================================
   */

  const getTaskVisual = (
    status: TaskProgressStatus,
  ): TaskVisual => {
    switch (status) {
      case 'approved':
        return {
          icon: 'checkmark-circle',
          iconColor: '#2E7D5A',
          iconBackground: '#DDF3E7',
          cardBackground: '#F2FBF6',
          borderColor: '#B8E1C9',
          statusBackground: '#DDF3E7',
          statusColor: '#26734E',
          statusLabel: 'TASK COMPLETE!',
        };

      case 'submitted':
        return {
          icon: 'time',
          iconColor: '#B7791F',
          iconBackground: '#FFF1C9',
          cardBackground: '#FFF9EB',
          borderColor: '#F2D893',
          statusBackground: '#FFF1C9',
          statusColor: '#8A5A10',
          statusLabel: 'WAITING FOR RANGER',
        };

      case 'rejected':
        return {
          icon: 'refresh-circle',
          iconColor: '#C5633D',
          iconBackground: '#FDE5DC',
          cardBackground: '#FFF6F2',
          borderColor: '#F4C6B5',
          statusBackground: '#FDE5DC',
          statusColor: '#A94D2D',
          statusLabel: 'NEEDS CHANGES',
        };

      default:
        return {
          icon: 'compass-outline',
          iconColor: '#267C78',
          iconBackground: '#DDF2EF',
          cardBackground: '#F7FCFB',
          borderColor: '#C8E4DF',
          statusBackground: '#E8F5F3',
          statusColor: '#267C78',
          statusLabel: 'READY TO EXPLORE',
        };
    }
  };

  const getEncouragement = (
    percentage: number,
  ) => {
    if (percentage >= 100) {
      return 'Amazing work! You completed the whole adventure!';
    }

    if (percentage >= 75) {
      return 'Almost there! Keep going, Junior Ranger!';
    }

    if (percentage >= 50) {
      return 'You are halfway there! Keep exploring!';
    }

    if (percentage >= 25) {
      return 'Great start! Keep up the awesome work!';
    }

    return 'Your adventure is ready. Start your first task!';
  };

  /*
   * Calculate XP and progress before any
   * conditional return.
   *
   * This is important because the completion
   * useEffect below must run in the same hook
   * order on every render.
   */
  const totalAdventureXp =
    adventureProgress?.tasks.reduce(
      (total, task) =>
        total + task.xp_reward,
      0,
    ) ?? 0;

  const earnedAdventureXp =
    adventureProgress?.tasks.reduce(
      (total, task) =>
        task.status === 'approved'
          ? total + task.xp_reward
          : total,
      0,
    ) ?? 0;

  const progressPercentage =
    adventureProgress
      ?.progress_percentage ?? 0;

  useEffect(() => {
    if (
      userRole === 'junior_ranger' &&
      adventureProgress &&
      adventureProgress.total_tasks > 0 &&
      progressPercentage >= 100 &&
      !hasShownCompletionCelebration.current
    ) {
      hasShownCompletionCelebration.current =
        true;

      setShowCompletionCelebration(
        true,
      );
    }
  }, [
    userRole,
    adventureProgress,
    progressPercentage,
  ]);

  if (loading) {
    return (
      <View
        style={styles.container}
      >
        <ActivityIndicator
          size="large"
          style={styles.loader}
        />
      </View>
    );
  }

  if (error || !adventure) {
    return (
      <View
        style={styles.container}
      >
        <Text
          style={styles.errorText}
        >
          {error ||
            'Adventure details not found.'}
        </Text>
      </View>
    );
  }

  return (
    <>
      <Modal
        visible={
          showCompletionCelebration
        }
        transparent
        animationType="fade"
        onRequestClose={() =>
          setShowCompletionCelebration(
            false,
          )
        }
      >
        <View
          style={
            styles.completionOverlay
          }
        >
          {CONFETTI_PIECES.map(
            (piece, index) => (
              <ConfettiPiece
                key={`${piece.left}-${index}`}
                left={piece.left}
                delay={piece.delay}
                color={piece.color}
              />
            ),
          )}

          <View
            style={
              styles.completionCelebrationCard
            }
          >
            <View
              style={
                styles.completionTrophyCircle
              }
            >
              <Ionicons
                name="trophy"
                size={52}
                color="#D89B22"
              />
            </View>

            <Text
              style={
                styles.completionEyebrow
              }
            >
              ADVENTURE COMPLETE
            </Text>

            <Text
              style={
                styles.completionCelebrationTitle
              }
            >
              Amazing work,
              Junior Ranger!
            </Text>

            <Text
              style={
                styles.completionAdventureName
              }
            >
              {adventure.title}
            </Text>

            <Text
              style={
                styles.completionCelebrationText
              }
            >
              You completed all{' '}
              {
                adventureProgress
                  ?.total_tasks
              }{' '}
              task
              {adventureProgress
                ?.total_tasks === 1
                ? ''
                : 's'}{' '}
              in this adventure.
            </Text>

            <View
              style={
                styles.completionStatsRow
              }
            >
              <View
                style={
                  styles.completionStat
                }
              >
                <Ionicons
                  name="checkmark-circle"
                  size={24}
                  color="#3D786B"
                />

                <Text
                  style={
                    styles.completionStatValue
                  }
                >
                  {
                    adventureProgress
                      ?.total_tasks
                  }
                </Text>

                <Text
                  style={
                    styles.completionStatLabel
                  }
                >
                  Tasks
                </Text>
              </View>

              <View
                style={
                  styles.completionStatDivider
                }
              />

              <View
                style={
                  styles.completionStat
                }
              >
                <Ionicons
                  name="star"
                  size={24}
                  color="#D89B22"
                />

                <Text
                  style={
                    styles.completionStatValue
                  }
                >
                  {totalAdventureXp}
                </Text>

                <Text
                  style={
                    styles.completionStatLabel
                  }
                >
                  XP Earned
                </Text>
              </View>
            </View>

            <View
              style={
                styles.completionMessageBox
              }
            >
              <Text
                style={
                  styles.completionMessageText
                }
              >
                🌿 Explore. Learn.
                Protect. Keep going!
              </Text>
            </View>

            <Button
              mode="contained"
              onPress={() =>
                setShowCompletionCelebration(
                  false,
                )
              }
              style={
                styles.completionContinueButton
              }
              contentStyle={{
                minHeight: 48,
              }}
              labelStyle={{
                fontWeight: '800',
              }}
            >
              Awesome!
            </Button>
          </View>
        </View>
      </Modal>

      <ScrollView
      style={styles.container}
      contentContainerStyle={
        styles.content
      }
      showsVerticalScrollIndicator={
        false
      }
    >
      <View style={styles.header}>
        <Text
          style={styles.headerTitle}
        >
          Adventure Details
        </Text>
      </View>

      <View
        style={
          userRole === 'junior_ranger'
            ? styles.juniorDetailsShell
            : styles.detailsCard
        }
      >
        {userRole === 'junior_ranger' ? (
          <>
            {/* CHILD-FRIENDLY ADVENTURE HERO */}

            <View
              style={
                styles.juniorAdventureHero
              }
            >
              <View
                style={
                  styles.juniorAdventureDecorOne
                }
              />

              <View
                style={
                  styles.juniorAdventureDecorTwo
                }
              />

              <View
                style={
                  styles.juniorHeroTopRow
                }
              >
                <View
                  style={
                    styles.juniorPublishedPill
                  }
                >
                  <Ionicons
                    name="leaf"
                    size={14}
                    color="#2F7468"
                  />

                  <Text
                    style={
                      styles.juniorPublishedText
                    }
                  >
                    {adventure.status.toUpperCase()}
                  </Text>
                </View>

                <View
                  style={
                    styles.juniorHeroIcon
                  }
                >
                  <Ionicons
                    name="compass"
                    size={27}
                    color="#FFFFFF"
                  />
                </View>
              </View>

              <Text
                style={
                  styles.juniorHeroEyebrow
                }
              >
                EXPLORE • LEARN • PROTECT
              </Text>

              <Text
                style={
                  styles.juniorHeroTitle
                }
              >
                {adventure.title}
              </Text>

              <Text
                style={
                  styles.juniorHeroDescription
                }
              >
                {adventure.description}
              </Text>

              <View
                style={
                  styles.juniorInstructionBox
                }
              >
                <Ionicons
                  name="bulb-outline"
                  size={19}
                  color="#2E756B"
                />

                <Text
                  style={
                    styles.juniorInstructionText
                  }
                >
                  {adventure.task_instructions ||
                    'Complete the tasks below to finish your adventure.'}
                </Text>
              </View>
            </View>

            {/* QUICK ADVENTURE STATS */}

            <View
              style={
                styles.juniorAdventureStats
              }
            >
              <View
                style={
                  styles.juniorAdventureStat
                }
              >
                <View
                  style={[
                    styles.juniorStatIcon,
                    styles.juniorStatIconBlue,
                  ]}
                >
                  <Ionicons
                    name="calendar-outline"
                    size={21}
                    color="#347B86"
                  />
                </View>

                <Text
                  style={
                    styles.juniorStatLabel
                  }
                >
                  Due Date
                </Text>

                <Text
                  numberOfLines={2}
                  style={
                    styles.juniorStatValue
                  }
                >
                  {adventure.due_date
                    ? new Date(
                        adventure.due_date,
                      ).toLocaleDateString(
                        'en-AU',
                        {
                          day: 'numeric',
                          month: 'short',
                        },
                      )
                    : 'No date'}
                </Text>
              </View>

              <View
                style={
                  styles.juniorStatDivider
                }
              />

              <View
                style={
                  styles.juniorAdventureStat
                }
              >
                <View
                  style={[
                    styles.juniorStatIcon,
                    styles.juniorStatIconGold,
                  ]}
                >
                  <Ionicons
                    name="star"
                    size={21}
                    color="#D79218"
                  />
                </View>

                <Text
                  style={
                    styles.juniorStatLabel
                  }
                >
                  Total XP
                </Text>

                <Text
                  style={
                    styles.juniorStatValue
                  }
                >
                  {adventureProgress
                    ? `${totalAdventureXp} XP`
                    : '—'}
                </Text>
              </View>

              <View
                style={
                  styles.juniorStatDivider
                }
              />

              <View
                style={
                  styles.juniorAdventureStat
                }
              >
                <View
                  style={[
                    styles.juniorStatIcon,
                    styles.juniorStatIconGreen,
                  ]}
                >
                  <Ionicons
                    name="list"
                    size={21}
                    color="#327A68"
                  />
                </View>

                <Text
                  style={
                    styles.juniorStatLabel
                  }
                >
                  Total Tasks
                </Text>

                <Text
                  style={
                    styles.juniorStatValue
                  }
                >
                  {adventureProgress
                    ? `${adventureProgress.total_tasks}`
                    : '—'}
                </Text>
              </View>
            </View>
          </>
        ) : (
          <>
            <Text
              style={styles.detailsTitle}
            >
              {adventure.title}
            </Text>

            <Chip
              style={styles.statusChip}
              textStyle={
                styles.statusText
              }
            >
              {adventure.status}
            </Chip>

            <Text
              style={styles.detailsLabel}
            >
              Description
            </Text>

            <Text
              style={styles.detailsText}
            >
              {adventure.description}
            </Text>

            <Text
              style={styles.detailsLabel}
            >
              Task Instructions
            </Text>

            <Text
              style={styles.detailsText}
            >
              {adventure.task_instructions ||
                'Complete the tasks below.'}
            </Text>

            <Text
              style={styles.detailsLabel}
            >
              Due Date
            </Text>

            <Text
              style={styles.detailsText}
            >
              {adventure.due_date
                ? new Date(
                    adventure.due_date,
                  ).toDateString()
                : 'No due date'}
            </Text>
          </>
        )}

        {/* ===================================
            JUNIOR RANGER VIEW
        =================================== */}

        {userRole ===
          'junior_ranger' && (
          <View
            style={
              styles.adventureProgressSection
            }
          >
            {progressLoading ? (
              <ActivityIndicator
                size="small"
                style={
                  styles.progressLoader
                }
              />
            ) : adventureProgress ? (
              <>
                {/* ADVENTURE PROGRESS CARD */}

                <View
                  style={
                    styles.juniorProgressCard
                  }
                >
                  <View
                    style={
                      styles.juniorProgressTopRow
                    }
                  >
                    <View
                      style={
                        styles.juniorProgressIcon
                      }
                    >
                      <Ionicons
                        name="leaf"
                        size={24}
                        color="#267C78"
                      />
                    </View>

                    <View
                      style={{
                        flex: 1,
                      }}
                    >
                      <Text
                        style={
                          styles.juniorProgressEyebrow
                        }
                      >
                        YOUR ADVENTURE
                      </Text>

                      <Text
                        style={
                          styles.juniorProgressTitle
                        }
                      >
                        Adventure Progress
                      </Text>
                    </View>

                    <View
                      style={
                        styles.progressPercentBadge
                      }
                    >
                      <Text
                        style={
                          styles.progressPercentBadgeText
                        }
                      >
                        {
                          progressPercentage
                        }
                        %
                      </Text>
                    </View>
                  </View>

                  <View
                    style={
                      styles.juniorProgressBarBackground
                    }
                  >
                    <View
                      style={[
                        styles.juniorProgressBarFill,
                        {
                          width:
                            `${progressPercentage}%`,
                        },
                      ]}
                    />
                  </View>

                  <View
                    style={
                      styles.progressStatsRow
                    }
                  >
                    <View
                      style={
                        styles.progressStatItem
                      }
                    >
                      <Ionicons
                        name="checkmark-circle"
                        size={19}
                        color="#3D786B"
                      />

                      <View>
                        <Text
                          style={
                            styles.progressStatValue
                          }
                        >
                          {
                            adventureProgress.approved_tasks
                          }
                          /
                          {
                            adventureProgress.total_tasks
                          }
                        </Text>

                        <Text
                          style={
                            styles.progressStatLabel
                          }
                        >
                          Tasks
                        </Text>
                      </View>
                    </View>

                    <View
                      style={
                        styles.progressStatDivider
                      }
                    />

                    <View
                      style={
                        styles.progressStatItem
                      }
                    >
                      <Ionicons
                        name="star"
                        size={19}
                        color="#E5A72E"
                      />

                      <View>
                        <Text
                          style={
                            styles.progressStatValue
                          }
                        >
                          {
                            earnedAdventureXp
                          }
                          /
                          {
                            totalAdventureXp
                          }
                        </Text>

                        <Text
                          style={
                            styles.progressStatLabel
                          }
                        >
                          XP Earned
                        </Text>
                      </View>
                    </View>
                  </View>

                  <View
                    style={
                      styles.encouragementBox
                    }
                  >
                    <Text
                      style={
                        styles.encouragementText
                      }
                    >
                      {getEncouragement(
                        progressPercentage,
                      )}
                    </Text>
                  </View>
                </View>

                {/* 100% COMPLETE BANNER */}

                {progressPercentage >=
                  100 && (
                  <View
                    style={
                      styles.adventureCompleteBanner
                    }
                  >
                    <Ionicons
                      name="trophy"
                      size={30}
                      color="#E0A125"
                    />

                    <View
                      style={{
                        flex: 1,
                      }}
                    >
                      <Text
                        style={
                          styles.adventureCompleteTitle
                        }
                      >
                        Adventure Complete!
                      </Text>

                      <Text
                        style={
                          styles.adventureCompleteText
                        }
                      >
                        All tasks completed •{' '}
                        {totalAdventureXp} XP earned
                      </Text>
                    </View>

                    <Text
                      style={
                        styles.adventureCompleteEmoji
                      }
                    >
                      🎉
                    </Text>
                  </View>
                )}

                {/* TASKS HEADER */}

                <View
                  style={
                    styles.missionSectionHeader
                  }
                >
                  <View
                    style={
                      styles.missionHeadingRow
                    }
                  >
                    <View
                      style={
                        styles.missionHeadingIcon
                      }
                    >
                      <Ionicons
                        name="compass"
                        size={22}
                        color="#FFFFFF"
                      />
                    </View>

                    <View>
                      <Text
                        style={
                          styles.missionSectionEyebrow
                        }
                      >
                        KEEP EXPLORING
                      </Text>

                      <Text
                        style={
                          styles.missionSectionTitle
                        }
                      >
                        Your Tasks
                      </Text>
                    </View>
                  </View>

                  <View
                    style={
                      styles.missionCountBadge
                    }
                  >
                    <Text
                      style={
                        styles.missionCountText
                      }
                    >
                      {
                        adventureProgress
                          .tasks.length
                      }
                    </Text>
                  </View>
                </View>

                {adventureProgress
                  .tasks.length === 0 ? (
                  <Text
                    style={
                      styles.emptyTaskText
                    }
                  >
                    No tasks have
                    been added to this
                    adventure yet.
                  </Text>
                ) : (
                  adventureProgress.tasks.map(
                    (task, index) => {
                      const visual =
                        getTaskVisual(
                          task.status,
                        );

                      return (
                        <View
                          key={task.id}
                          style={[
                            styles.juniorMissionCard,
                            {
                              backgroundColor:
                                visual.cardBackground,

                              borderColor:
                                visual.borderColor,
                            },
                          ]}
                        >
                          {/* TASK NUMBER */}

                          <View
                            style={
                              styles.missionNumberBadge
                            }
                          >
                            <Text
                              style={
                                styles.missionNumberText
                              }
                            >
                              Task{' '}
                              {index + 1}
                            </Text>
                          </View>

                          <View
                            style={
                              styles.missionTopRow
                            }
                          >
                            <View
                              style={[
                                styles.missionIconContainer,
                                {
                                  backgroundColor:
                                    visual.iconBackground,
                                },
                              ]}
                            >
                              <Ionicons
                                name={
                                  visual.icon
                                }
                                size={28}
                                color={
                                  visual.iconColor
                                }
                              />
                            </View>

                            <View
                              style={
                                styles.missionInfo
                              }
                            >
                              <Text
                                style={
                                  styles.missionTitle
                                }
                              >
                                {
                                  task.title
                                }
                              </Text>

                              <View
                                style={
                                  styles.missionMetaRow
                                }
                              >
                                <View
                                  style={
                                    styles.xpRewardPill
                                  }
                                >
                                  <Ionicons
                                    name="star"
                                    size={14}
                                    color="#D99A22"
                                  />

                                  <Text
                                    style={
                                      styles.xpRewardText
                                    }
                                  >
                                    +
                                    {
                                      task.xp_reward
                                    }{' '}
                                    XP
                                  </Text>
                                </View>

                                <View
                                  style={[
                                    styles.missionStatusPill,
                                    {
                                      backgroundColor:
                                        visual.statusBackground,
                                    },
                                  ]}
                                >
                                  <Text
                                    style={[
                                      styles.missionStatusText,
                                      {
                                        color:
                                          visual.statusColor,
                                      },
                                    ]}
                                  >
                                    {
                                      visual.statusLabel
                                    }
                                  </Text>
                                </View>
                              </View>
                            </View>
                          </View>

                          {/* NOT STARTED */}

                          {task.status ===
                            'not_started' && (
                            <Button
                              mode="contained"
                              icon="compass-outline"
                              style={
                                styles.missionStartButton
                              }
                              contentStyle={
                                styles.missionStartButtonContent
                              }
                              labelStyle={
                                styles.missionStartButtonLabel
                              }
                              onPress={() =>
                                navigation.navigate(
                                  'SubmitAdventureTask',
                                  {
                                    taskId:
                                      task.id,

                                    taskTitle:
                                      task.title,

                                    taskDescription:
                                      adventureTasks.find(
                                        (item) =>
                                          item.id ===
                                          task.id,
                                      )
                                        ?.description ??
                                      '',

                                    xpReward:
                                      task.xp_reward,

                                    adventureId:
                                      adventure.id,
                                  },
                                )
                              }
                            >
                              Start Task
                            </Button>
                          )}

                          {/* SUBMITTED */}

                          {task.status ===
                            'submitted' && (
                            <View
                              style={
                                styles.missionWaitingBox
                              }
                            >
                              <Ionicons
                                name="time-outline"
                                size={19}
                                color="#9A691A"
                              />

                              <Text
                                style={
                                  styles.missionWaitingText
                                }
                              >
                                Your Ranger is
                                checking this
                                task.
                              </Text>
                            </View>
                          )}

                          {/* APPROVED */}

                          {task.status ===
                            'approved' && (
                            <View
                              style={
                                styles.missionApprovedBox
                              }
                            >
                              <Ionicons
                                name="sparkles"
                                size={19}
                                color="#2F7C55"
                              />

                              <Text
                                style={
                                  styles.missionApprovedText
                                }
                              >
                                Awesome! You
                                completed this
                                task.
                              </Text>
                            </View>
                          )}

                          {/* REJECTED */}

                          {task.status ===
                            'rejected' && (
                            <View
                              style={
                                styles.missionRejectedBox
                              }
                            >
                              <Ionicons
                                name="refresh"
                                size={19}
                                color="#A95434"
                              />

                              <Text
                                style={
                                  styles.missionRejectedText
                                }
                              >
                                Your Ranger has asked for some changes. Please review the feedback and try again.
                              </Text>
                            </View>
                          )}
                        </View>
                      );
                    },
                  )
                )}

                <View
                  style={
                    styles.juniorExploreFooter
                  }
                >
                  <View
                    style={
                      styles.juniorExploreFooterIcon
                    }
                  >
                    <Ionicons
                      name="earth"
                      size={24}
                      color="#2F786C"
                    />
                  </View>

                  <View
                    style={{
                      flex: 1,
                    }}
                  >
                    <Text
                      style={
                        styles.juniorExploreFooterTitle
                      }
                    >
                      Keep exploring, Junior Ranger!
                    </Text>

                    <Text
                      style={
                        styles.juniorExploreFooterText
                      }
                    >
                      Every task you complete helps you learn more about protecting our environment.
                    </Text>
                  </View>
                </View>
              </>
            ) : (
              <Text
                style={
                  styles.emptyTaskText
                }
              >
                Unable to load
                task progress.
              </Text>
            )}
          </View>
        )}

        {/* ===================================
            RANGER / ADMIN VIEW
            KEEP PROFESSIONAL
        =================================== */}

        {(userRole === 'ranger' ||
          userRole === 'admin') && (
          <View
            style={
              styles.adventureProgressSection
            }
          >
            <View
              style={
                styles.taskManagementHeader
              }
            >
              <Text
                style={
                  styles.sectionHeading
                }
              >
                Adventure Tasks
              </Text>

              <Text
                style={
                  styles.taskCountText
                }
              >
                {
                  adventureTasks.length
                }{' '}
                task
                {adventureTasks.length ===
                1
                  ? ''
                  : 's'}
              </Text>
            </View>

            {taskLoading ? (
              <ActivityIndicator
                size="small"
                style={
                  styles.progressLoader
                }
              />
            ) : adventureTasks.length ===
              0 ? (
              <Text
                style={
                  styles.emptyTaskText
                }
              >
                No tasks have been
                added to this
                adventure yet.
              </Text>
            ) : (
              adventureTasks.map(
                (task, index) => (
                  <View
                    key={task.id}
                    style={
                      styles.rangerTaskCard
                    }
                  >
                    <View
                      style={
                        styles.rangerTaskNumber
                      }
                    >
                      <Text
                        style={
                          styles.rangerTaskNumberText
                        }
                      >
                        {index + 1}
                      </Text>
                    </View>

                    <View
                      style={
                        styles.taskInfo
                      }
                    >
                      <Text
                        style={
                          styles.taskTitle
                        }
                      >
                        {task.title}
                      </Text>

                      {task.description ? (
                        <Text
                          style={
                            styles.rangerTaskDescription
                          }
                        >
                          {
                            task.description
                          }
                        </Text>
                      ) : null}

                      <Text
                        style={
                          styles.taskXp
                        }
                      >
                        {
                          task.xp_reward
                        }{' '}
                        XP
                      </Text>
                    </View>
                  </View>
                ),
              )
            )}
          </View>
        )}

        {canViewSubmissions && (
          <Button
            mode="contained"
            style={
              styles.editButton
            }
            onPress={() =>
              navigation.navigate(
                'AdventureSubmissions',
                {
                  adventureId:
                    adventure.id,
                },
              )
            }
          >
            View Submissions
          </Button>
        )}

        {canEditAdventure && (
          <Button
            mode="outlined"
            style={
              styles.cancelButton
            }
            onPress={() =>
              navigation.navigate(
                'EditAdventure',
                {
                  adventureId:
                    adventure.id,
                },
              )
            }
          >
            Edit Adventure & Tasks
          </Button>
        )}
      </View>
      </ScrollView>
    </>
  );
}