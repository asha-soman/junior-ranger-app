import React, {
  useCallback,
  useEffect,
  useState,
} from 'react';

import {
  ActivityIndicator,
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

  const getTaskIcon = (
    status: TaskProgressStatus,
  ):
    | 'checkmark-circle'
    | 'time'
    | 'alert-circle'
    | 'ellipse-outline' => {
    switch (status) {
      case 'approved':
        return 'checkmark-circle';

      case 'submitted':
        return 'time';

      case 'rejected':
        return 'alert-circle';

      default:
        return 'ellipse-outline';
    }
  };

  const getTaskStatusLabel = (
    status: TaskProgressStatus,
  ) => {
    switch (status) {
      case 'approved':
        return 'Approved';

      case 'submitted':
        return 'Waiting for Ranger review';

      case 'rejected':
        return 'Needs changes';

      default:
        return 'Not started';
    }
  };

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
        style={styles.detailsCard}
      >
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

        {/* Junior Ranger view */}

        {userRole ===
          'junior_ranger' && (
          <View
            style={
              styles.adventureProgressSection
            }
          >
            <Text
              style={
                styles.sectionHeading
              }
            >
              Adventure Progress
            </Text>

            {progressLoading ? (
              <ActivityIndicator
                size="small"
                style={
                  styles.progressLoader
                }
              />
            ) : adventureProgress ? (
              <>
                <View
                  style={
                    styles.progressSummaryRow
                  }
                >
                  <Text
                    style={
                      styles.progressSummary
                    }
                  >
                    {
                      adventureProgress.approved_tasks
                    }{' '}
                    of{' '}
                    {
                      adventureProgress.total_tasks
                    }{' '}
                    tasks completed
                  </Text>

                  <Text
                    style={
                      styles.progressPercentage
                    }
                  >
                    {
                      adventureProgress.progress_percentage
                    }
                    %
                  </Text>
                </View>

                <View
                  style={
                    styles.adventureProgressBarBackground
                  }
                >
                  <View
                    style={[
                      styles.adventureProgressBarFill,
                      {
                        width:
                          `${adventureProgress.progress_percentage}%`,
                      },
                    ]}
                  />
                </View>

                <Text
                  style={
                    styles.sectionHeading
                  }
                >
                  Adventure Tasks
                </Text>

                {adventureProgress
                  .tasks.length === 0 ? (
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
                  adventureProgress.tasks.map(
                    (task) => (
                      <View
                        key={task.id}
                        style={
                          styles.taskCard
                        }
                      >
                        <View
                          style={
                            styles.taskTopRow
                          }
                        >
                          <View
                            style={
                              styles.taskIconContainer
                            }
                          >
                            <Ionicons
                              name={getTaskIcon(
                                task.status,
                              )}
                              size={25}
                              color="#3D786B"
                            />
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

                            <Text
                              style={
                                styles.taskStatus
                              }
                            >
                              {getTaskStatusLabel(
                                task.status,
                              )}
                            </Text>
                          </View>
                        </View>

                        {task.status ===
                          'not_started' && (
                          <Button
                            mode="contained"
                            style={
                              styles.taskSubmitButton
                            }
                            onPress={() =>
                              navigation.navigate(
                                'SubmitAdventureTask',
                                {
                                  taskId:
                                    task.id,
                                  taskTitle:
                                    task.title,
                                  adventureId:
                                    adventure.id,
                                },
                              )
                            }
                          >
                            Submit Task
                          </Button>
                        )}

                        {task.status ===
                          'submitted' && (
                          <View
                            style={
                              styles.taskWaitingBox
                            }
                          >
                            <Text
                              style={
                                styles.taskWaitingText
                              }
                            >
                              Your task is
                              waiting for Ranger
                              review.
                            </Text>
                          </View>
                        )}

                        {task.status ===
                          'approved' && (
                          <View
                            style={
                              styles.taskApprovedBox
                            }
                          >
                            <Text
                              style={
                                styles.taskApprovedText
                              }
                            >
                              Task completed
                            </Text>
                          </View>
                        )}

                        {task.status ===
                          'rejected' && (
                          <View
                            style={
                              styles.taskRejectedBox
                            }
                          >
                            <Text
                              style={
                                styles.taskRejectedText
                              }
                            >
                              This task needs
                              changes.
                            </Text>
                          </View>
                        )}
                      </View>
                    ),
                  )
                )}
              </>
            ) : (
              <Text
                style={
                  styles.emptyTaskText
                }
              >
                Unable to load task
                progress.
              </Text>
            )}
          </View>
        )}

        {/* Ranger/Admin view */}

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
  );
}