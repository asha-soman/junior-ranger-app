import React, {
  useCallback,
  useMemo,
  useState,
} from 'react';

import {
  View,
  Text,
  ActivityIndicator,
  FlatList,
  Alert,
  Image,
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

import * as FileSystem from 'expo-file-system/legacy';

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

import {
  getToken,
} from '@/src/utils/secureStore';

import apiClient from '../../services/api/client';

type Props =
  NativeStackScreenProps<
    AuthStackParamList,
    'AdventureSubmissions'
  >;

export default function AdventureSubmissionsScreen({
  route,
}: Props) {
  const { adventureId } = route.params;

  const [
    submissions,
    setSubmissions,
  ] = useState<
    AdventureTaskCompletion[]
  >([]);

  const [
    currentPage,
    setCurrentPage,
  ] = useState(1);

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

  /*
   * Stores the local cached URI for each
   * protected submission image.
   *
   * completion id -> local file URI
   */
  const [
    submissionImages,
    setSubmissionImages,
  ] = useState<
    Record<string, string>
  >({});

  const SUBMISSIONS_PER_PAGE = 6;

  const totalSubmissions =
    submissions.length;

  const totalPages = Math.max(
    1,
    Math.ceil(
      totalSubmissions /
        SUBMISSIONS_PER_PAGE,
    ),
  );

  const paginatedSubmissions =
    useMemo(() => {
      const startIndex =
        (currentPage - 1) *
        SUBMISSIONS_PER_PAGE;

      return submissions.slice(
        startIndex,
        startIndex +
          SUBMISSIONS_PER_PAGE,
      );
    }, [
      submissions,
      currentPage,
    ]);

  /*
   * =========================================
   * LOAD PROTECTED SUBMISSION IMAGES
   * =========================================
   *
   * The backend image endpoint is protected
   * by JwtAuthGuard.
   *
   * Instead of asking React Native <Image>
   * to authenticate directly, the image is
   * downloaded through Expo FileSystem with
   * the Ranger's JWT.
   *
   * The resulting local file is then shown
   * using the normal React Native Image
   * component.
   */

  const loadSubmissionImages =
    async (
      items:
        AdventureTaskCompletion[],
    ) => {
      try {
        const token =
          await getToken();

        if (!token) {
          console.log(
            'No authentication token available for submission images.',
          );

          return;
        }

        const baseURL =
          apiClient.defaults
            .baseURL ?? '';

        const imageItems =
          items.filter(
            (item) =>
              !!item.image_url,
          );

        const loadedImages: Record<
          string,
          string
        > = {};

        for (
          const item of imageItems
        ) {
          if (!item.image_url) {
            continue;
          }

          try {
            const absoluteUrl =
              item.image_url.startsWith(
                'http://',
              ) ||
              item.image_url.startsWith(
                'https://',
              )
                ? item.image_url
                : `${baseURL}${item.image_url}`;

            const extension =
              item.image_url
                .split('.')
                .pop()
                ?.split('?')[0] ||
              'jpg';

            const cacheDirectory =
              FileSystem.cacheDirectory;

            if (!cacheDirectory) {
              console.log(
                'Expo FileSystem cache directory is unavailable.',
              );

              continue;
            }

            const localUri =
              `${cacheDirectory}submission-${item.id}.${extension}`;

            console.log(
              'Downloading protected submission image:',
              absoluteUrl,
            );

            const result =
              await FileSystem.downloadAsync(
                absoluteUrl,
                localUri,
                {
                  headers: {
                    Authorization:
                      `Bearer ${token}`,
                  },
                },
              );

            console.log(
              'Submission image download status:',
              item.id,
              result.status,
            );

            if (
              result.status >= 200 &&
              result.status < 300
            ) {
              loadedImages[
                item.id
              ] = result.uri;
            } else {
              console.log(
                'Submission image download failed:',
                item.id,
                result.status,
              );
            }
          } catch (
            imageError
          ) {
            console.log(
              'Unable to download submission image:',
              item.id,
              imageError,
            );
          }
        }

        setSubmissionImages(
          loadedImages,
        );
      } catch (err) {
        console.log(
          'Unable to load submission images:',
          err,
        );
      }
    };

  /*
   * =========================================
   * FETCH SUBMISSIONS
   * =========================================
   */

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

        setCurrentPage(1);

        /*
         * Download any protected images
         * after the submissions have loaded.
         */
        await loadSubmissionImages(
          data,
        );
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

  /*
   * Refresh whenever Ranger opens or
   * returns to this screen.
   */

  useFocusEffect(
    useCallback(() => {
      fetchSubmissions();
    }, [adventureId]),
  );

  /*
   * =========================================
   * REVIEW TASK
   * =========================================
   */

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

    /*
     * Feedback is mandatory when
     * rejecting a submission.
     */
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

      /*
       * APPROVED
       */

      if (
        status === 'approved'
      ) {
        const xpAwarded =
          result.xp_awarded ??
          0;

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
      }

      /*
       * REJECTED
       */
      else {
        Alert.alert(
          'Task Rejected',
          'The Junior Ranger can review your feedback and make changes.',
        );
      }

      /*
       * Clear feedback field for this
       * submission.
       */

      setFeedbackById(
        (current) => ({
          ...current,

          [completionId]:
            '',
        }),
      );

      /*
       * Refresh submissions after review.
       */

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

        Array.isArray(
          message,
        )
          ? message.join(
              '\n',
            )
          : message,
      );
    } finally {
      setReviewingId(
        null,
      );
    }
  };

  /*
   * =========================================
   * RENDER SUBMISSION
   * =========================================
   */

  const renderSubmission = ({
    item,
  }: {
    item: AdventureTaskCompletion;
  }) => {
    const isReviewing =
      reviewingId ===
      item.id;

    const isPending =
      item.status ===
      'submitted';

    const localImageUri =
      submissionImages[
        item.id
      ];

    return (
      <Card
        style={
          styles.submissionListCard
        }
        mode="elevated"
      >
        <Card.Content>

          {/*
           * JUNIOR RANGER
           */}

          <Text
            style={
              styles.submissionUser
            }
          >
            {item.junior_ranger_name ||
              'Junior Ranger'}
          </Text>

          {/*
           * TASK
           */}

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
            {item.xp_reward}{' '}
            XP
          </Text>

          {/*
           * WRITTEN SUBMISSION
           */}

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

          {/*
           * =====================================
           * SUBMITTED IMAGE
           * =====================================
           */}

          {item.image_url ? (
            <View
              style={{
                marginTop: 14,
                marginBottom: 14,
              }}
            >
              <Text
                style={[
                  styles.detailsLabel,
                  {
                    marginBottom:
                      8,
                  },
                ]}
              >
                Submitted Image
              </Text>

              <View
                style={{
                  width: '100%',

                  borderWidth: 1,

                  borderColor:
                    '#D5E5E1',

                  borderRadius:
                    14,

                  overflow:
                    'hidden',

                  backgroundColor:
                    '#F2F7F5',
                }}
              >
                {localImageUri ? (
                  <Image
                    source={{
                      uri:
                        localImageUri,
                    }}
                    resizeMode="cover"
                    style={{
                      width:
                        '100%',

                      height:
                        230,

                      backgroundColor:
                        '#E8F1EE',
                    }}
                    onError={(
                      event,
                    ) => {
                      console.log(
                        'Local submission image display error:',
                        event
                          .nativeEvent
                          .error,
                      );
                    }}
                  />
                ) : (
                  <View
                    style={{
                      width:
                        '100%',

                      height:
                        230,

                      backgroundColor:
                        '#E8F1EE',

                      alignItems:
                        'center',

                      justifyContent:
                        'center',
                    }}
                  >
                    <ActivityIndicator
                      size="small"
                    />

                    <Text
                      style={{
                        marginTop:
                          8,

                        color:
                          '#687773',
                      }}
                    >
                      Loading
                      image...
                    </Text>
                  </View>
                )}
              </View>

              <View
                style={{
                  flexDirection:
                    'row',

                  alignItems:
                    'center',

                  marginTop: 8,
                }}
              >
                <Text
                  style={{
                    fontSize: 16,

                    marginRight:
                      6,
                  }}
                >
                  📷
                </Text>

                <Text
                  style={{
                    fontSize: 12,

                    color:
                      '#687773',
                  }}
                >
                  Photo submitted
                  by the Junior
                  Ranger
                </Text>
              </View>
            </View>
          ) : null}

          {/*
           * STATUS
           */}

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

          {/*
           * APPROVED
           */}

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

          {/*
           * REJECTED
           */}

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
                      marginTop:
                        6,
                    },
                  ]}
                >
                  Feedback:{' '}
                  {item.feedback}
                </Text>
              ) : null}
            </View>
          )}

          {/*
           * =====================================
           * PENDING REVIEW
           * =====================================
           */}

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
                    (
                      current,
                    ) => ({
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
                {/*
                 * APPROVE
                 */}

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

                {/*
                 * REJECT
                 */}

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

  /*
   * =========================================
   * SCREEN
   * =========================================
   */

  return (
    <View
      style={
        styles.container
      }
    >
      {/*
       * HEADER
       */}

      <View
        style={
          styles.header
        }
      >
        <Text
          style={
            styles.headerTitle
          }
        >
          Task Submissions
        </Text>
      </View>

      {/*
       * INITIAL LOADING
       */}

      {loading &&
      submissions.length ===
        0 ? (
        <ActivityIndicator
          size="large"
          style={
            styles.loader
          }
        />
      ) : null}

      {/*
       * ERROR
       */}

      {!!error && (
        <Text
          style={
            styles.errorText
          }
        >
          {error}
        </Text>
      )}

      {/*
       * EMPTY STATE
       */}

      {!loading &&
        submissions.length ===
          0 &&
        !error && (
          <Text
            style={
              styles.emptyText
            }
          >
            No task submissions
            yet.
          </Text>
        )}

      {/*
       * SUBMISSION LIST
       */}

      <FlatList
        data={
          paginatedSubmissions
        }
        keyExtractor={(
          item,
        ) => item.id}
        renderItem={
          renderSubmission
        }
        contentContainerStyle={{
          padding: 14,

          paddingBottom: 40,
        }}
        refreshing={
          loading
        }
        onRefresh={
          fetchSubmissions
        }
        ListFooterComponent={
          totalSubmissions >
          0 ? (
            <View
              style={{
                paddingVertical:
                  20,

                alignItems:
                  'center',
              }}
            >
              <Text
                style={{
                  marginBottom:
                    10,
                }}
              >
                {totalSubmissions}{' '}
                submissions found
              </Text>

              {/*
               * PAGINATION
               */}

              <View
                style={{
                  flexDirection:
                    'row',

                  alignItems:
                    'center',

                  gap: 10,
                }}
              >
                <Button
                  mode="outlined"
                  disabled={
                    currentPage ===
                      1 ||
                    loading
                  }
                  onPress={() =>
                    setCurrentPage(
                      (page) =>
                        Math.max(
                          1,

                          page -
                            1,
                        ),
                    )
                  }
                >
                  Previous
                </Button>

                <Text>
                  {currentPage}{' '}
                  /{' '}
                  {totalPages}
                </Text>

                <Button
                  mode="contained"
                  disabled={
                    currentPage ===
                      totalPages ||
                    loading
                  }
                  onPress={() =>
                    setCurrentPage(
                      (page) =>
                        Math.min(
                          totalPages,

                          page +
                            1,
                        ),
                    )
                  }
                >
                  Next
                </Button>
              </View>
            </View>
          ) : null
        }
      />
    </View>
  );
}