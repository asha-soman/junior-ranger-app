import React, {
  useCallback,
  useState,
} from 'react';

import {
  View,
  Text,
  ActivityIndicator,
  FlatList,
  Alert,
} from 'react-native';

import {
  Button,
  Chip,
  Card,
  TextInput,
} from 'react-native-paper';

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
  AdventureTaskCompletion,
  getTaskCompletionsForAdventure,
  reviewTaskCompletion,
} from '../../services/submissions/submissionService';

import {
  adventureStyles as styles,
} from '../../styles/AdventureStyles';

type Props =
  NativeStackScreenProps<
    AuthStackParamList,
    'AdventureSubmissions'
  >;

export default function AdventureSubmissionsScreen({
  route,
}: Props) {
  const { adventureId } =
    route.params;

  const [
    submissions,
    setSubmissions,
  ] = useState<
    AdventureTaskCompletion[]
  >([]);

  const [
    loading,
    setLoading,
  ] = useState(false);

  const [
    error,
    setError,
  ] = useState('');

  const [
    feedbackById,
    setFeedbackById,
  ] = useState<
    Record<string, string>
  >({});

  const [
    reviewingId,
    setReviewingId,
  ] = useState<
    string | null
  >(null);

  const fetchSubmissions =
    async () => {
      try {
        setLoading(true);
        setError('');

        const data =
          await getTaskCompletionsForAdventure(
            adventureId,
          );

        setSubmissions(data);
      } catch (err: any) {
        console.log(
          'Fetch task submissions error:',
          err,
        );

        setError(
          err?.response?.data
            ?.message ||
            'Unable to load task submissions.',
        );
      } finally {
        setLoading(false);
      }
    };

  useFocusEffect(
    useCallback(() => {
      fetchSubmissions();
    }, [adventureId]),
  );

  const handleReview = async (
    completionId: string,
    status:
      | 'approved'
      | 'rejected',
  ) => {
    const feedback =
      feedbackById[
        completionId
      ]?.trim() || '';

    if (
      status === 'rejected' &&
      !feedback
    ) {
      Alert.alert(
        'Feedback Required',
        'Please provide feedback explaining why the task needs changes.',
      );

      return;
    }

    try {
      setReviewingId(
        completionId,
      );

      const result =
        await reviewTaskCompletion(
          completionId,
          {
            status,
            feedback:
              feedback ||
              undefined,
          },
        );

      if (
        status === 'approved'
      ) {
        const xpAwarded =
          result.xp_awarded ?? 0;

        let message =
          'Task approved successfully.';

        if (xpAwarded > 0) {
          message +=
            ` ${xpAwarded} XP was awarded.`;
        }

        if (
          result.level_changed
        ) {
          message +=
            ` Junior Ranger reached Level ${result.current_level}!`;
        }

        Alert.alert(
          'Task Approved',
          message,
        );
      } else {
        Alert.alert(
          'Task Rejected',
          'The Junior Ranger can review your feedback and make changes.',
        );
      }

      setFeedbackById(
        (current) => ({
          ...current,
          [completionId]: '',
        }),
      );

      await fetchSubmissions();
    } catch (err: any) {
      console.log(
        'Review task error:',
        err,
      );

      const message =
        err?.response?.data
          ?.message ||
        'Unable to review this task.';

      Alert.alert(
        'Review Failed',
        Array.isArray(message)
          ? message.join('\n')
          : message,
      );
    } finally {
      setReviewingId(null);
    }
  };

  const renderSubmission = ({
    item,
  }: {
    item: AdventureTaskCompletion;
  }) => {
    const isReviewing =
      reviewingId === item.id;

    const isPending =
      item.status ===
      'submitted';

    return (
      <Card
        style={
          styles.submissionListCard
        }
        mode="elevated"
      >
        <Card.Content>
          <Text
            style={
              styles.submissionUser
            }
          >
            {item.junior_ranger_name ||
              'Junior Ranger'}
          </Text>

          <Text
            style={
              styles.detailsLabel
            }
          >
            Task
          </Text>

          <Text
            style={
              styles.detailsText
            }
          >
            {item.task_title}
          </Text>

          <Text
            style={
              styles.taskXp
            }
          >
            {item.xp_reward} XP
          </Text>

          <Text
            style={
              styles.detailsLabel
            }
          >
            Submission
          </Text>

          <Text
            style={
              styles.submissionText
            }
          >
            {item.submission_text ||
              'No written response provided.'}
          </Text>

          {item.image_url ? (
            <>
              <Text
                style={
                  styles.detailsLabel
                }
              >
                Image
              </Text>

              <Text
                style={
                  styles.imageUrlText
                }
              >
                {item.image_url}
              </Text>
            </>
          ) : null}

          <View
            style={{
              marginTop: 8,
              marginBottom: 10,
              alignItems:
                'flex-start',
            }}
          >
            <Chip
              style={
                styles.statusChip
              }
              textStyle={
                styles.statusText
              }
            >
              {item.status}
            </Chip>
          </View>

          {item.status ===
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
                Approved
                {item.xp_awarded
                  ? ` • ${item.xp_reward} XP awarded`
                  : ''}
              </Text>
            </View>
          )}

          {item.status ===
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
                Rejected
              </Text>

              {item.feedback ? (
                <Text
                  style={[
                    styles.detailsText,
                    {
                      marginTop: 6,
                    },
                  ]}
                >
                  Feedback:{' '}
                  {item.feedback}
                </Text>
              ) : null}
            </View>
          )}

          {isPending && (
            <>
              <Text
                style={
                  styles.detailsLabel
                }
              >
                Ranger Feedback
              </Text>

              <TextInput
                label="Feedback (required when rejecting)"
                mode="outlined"
                multiline
                value={
                  feedbackById[
                    item.id
                  ] || ''
                }
                onChangeText={(
                  value,
                ) =>
                  setFeedbackById(
                    (current) => ({
                      ...current,
                      [item.id]:
                        value,
                    }),
                  )
                }
                style={[
                  styles.input,
                  styles.textArea,
                ]}
              />

              <View
                style={
                  styles.statusButtonRow
                }
              >
                <Button
                  mode="contained"
                  disabled={
                    isReviewing
                  }
                  loading={
                    isReviewing
                  }
                  onPress={() =>
                    handleReview(
                      item.id,
                      'approved',
                    )
                  }
                  style={
                    styles.approveButton
                  }
                >
                  Approve
                </Button>

                <Button
                  mode="contained"
                  disabled={
                    isReviewing
                  }
                  onPress={() =>
                    handleReview(
                      item.id,
                      'rejected',
                    )
                  }
                  style={
                    styles.rejectButton
                  }
                >
                  Reject
                </Button>
              </View>
            </>
          )}
        </Card.Content>
      </Card>
    );
  };

  return (
    <View
      style={styles.container}
    >
      <View style={styles.header}>
        <Text
          style={
            styles.headerTitle
          }
        >
          Task Submissions
        </Text>
      </View>

      {loading &&
      submissions.length ===
        0 ? (
        <ActivityIndicator
          size="large"
          style={styles.loader}
        />
      ) : null}

      {!!error && (
        <Text
          style={styles.errorText}
        >
          {error}
        </Text>
      )}

      {!loading &&
        submissions.length ===
          0 &&
        !error && (
          <Text
            style={styles.emptyText}
          >
            No task submissions
            yet.
          </Text>
        )}

      <FlatList
        data={submissions}
        keyExtractor={(item) =>
          item.id
        }
        renderItem={
          renderSubmission
        }
        contentContainerStyle={{
          padding: 14,
          paddingBottom: 40,
        }}
        refreshing={loading}
        onRefresh={
          fetchSubmissions
        }
      />
    </View>
  );
}