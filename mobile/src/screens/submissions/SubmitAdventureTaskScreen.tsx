import React, {
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

import {
  Alert,
  Animated,
  Dimensions,
  Image,
  ScrollView,
  Text,
  View,
} from 'react-native';

import {
  Button,
  TextInput,
} from 'react-native-paper';

import * as ImagePicker from 'expo-image-picker';

import {
  NativeStackScreenProps,
} from '@react-navigation/native-stack';

import {
  AuthStackParamList,
} from '../../navigation/AuthNavigator';

import {
  createTaskCompletion,
  uploadImage,
} from '../../services/submissions/submissionService';

import {
  adventureStyles as styles,
} from '../../styles/AdventureStyles';

type Props = NativeStackScreenProps<
  AuthStackParamList,
  'SubmitAdventureTask'
>;

/*
 * =========================================
 * CONFETTI
 * =========================================
 */

const CONFETTI_COUNT = 45;

const CONFETTI_COLORS = [
  '#F94144',
  '#F3722C',
  '#F8961E',
  '#F9C74F',
  '#90BE6D',
  '#43AA8B',
  '#4D96FF',
  '#9B5DE5',
  '#F15BB5',
];

type ConfettiPiece = {
  id: number;
  left: number;
  width: number;
  height: number;
  color: string;
  delay: number;
  duration: number;
  rotation: number;
};

function FallingConfetti() {
  const screenWidth =
    Dimensions.get('window').width;

  const screenHeight =
    Dimensions.get('window').height;

  const pieces =
    useMemo<ConfettiPiece[]>(
      () =>
        Array.from(
          {
            length:
              CONFETTI_COUNT,
          },
          (_, index) => ({
            id: index,

            left:
              Math.random() *
              Math.max(
                screenWidth - 20,
                1,
              ),

            width:
              7 +
              Math.random() * 7,

            height:
              10 +
              Math.random() * 9,

            color:
              CONFETTI_COLORS[
                Math.floor(
                  Math.random() *
                    CONFETTI_COLORS.length,
                )
              ],

            delay:
              Math.random() *
              1300,

            duration:
              2200 +
              Math.random() *
                1800,

            rotation:
              180 +
              Math.random() *
                540,
          }),
        ),
      [screenWidth],
    );

  const animatedValues =
    useRef(
      Array.from(
        {
          length:
            CONFETTI_COUNT,
        },
        () => new Animated.Value(0),
      ),
    ).current;

  useEffect(() => {
    const animations =
      animatedValues.map(
        (
          animatedValue,
          index,
        ) =>
          Animated.timing(
            animatedValue,
            {
              toValue: 1,

              duration:
                pieces[index]
                  .duration,

              delay:
                pieces[index]
                  .delay,

              useNativeDriver:
                false,
            },
          ),
      );

    Animated.parallel(
      animations,
    ).start();

    return () => {
      animatedValues.forEach(
        (value) =>
          value.stopAnimation(),
      );
    };
  }, []);

  return (
    <View
      pointerEvents="none"
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 100,
        overflow: 'hidden',
      }}
    >
      {pieces.map(
        (piece, index) => {
          const animatedValue =
            animatedValues[index];

          const translateY =
            animatedValue.interpolate(
              {
                inputRange: [
                  0,
                  1,
                ],

                outputRange: [
                  -30,
                  screenHeight +
                    80,
                ],
              },
            );

          const rotate =
            animatedValue.interpolate(
              {
                inputRange: [
                  0,
                  1,
                ],

                outputRange: [
                  '0deg',
                  `${piece.rotation}deg`,
                ],
              },
            );

          const translateX =
            animatedValue.interpolate(
              {
                inputRange: [
                  0,
                  0.5,
                  1,
                ],

                outputRange: [
                  0,
                  index % 2 === 0
                    ? 25
                    : -25,
                  index % 2 === 0
                    ? -15
                    : 15,
                ],
              },
            );

          return (
            <Animated.View
              key={piece.id}
              style={{
                position:
                  'absolute',

                top: 0,

                left:
                  piece.left,

                width:
                  piece.width,

                height:
                  piece.height,

                borderRadius: 2,

                backgroundColor:
                  piece.color,

                opacity:
                  animatedValue.interpolate(
                    {
                      inputRange: [
                        0,
                        0.85,
                        1,
                      ],

                      outputRange: [
                        1,
                        1,
                        0,
                      ],
                    },
                  ),

                transform: [
                  {
                    translateY,
                  },
                  {
                    translateX,
                  },
                  {
                    rotate,
                  },
                ],
              }}
            />
          );
        },
      )}
    </View>
  );
}

/*
 * =========================================
 * SUBMIT TASK SCREEN
 * =========================================
 */

export default function SubmitAdventureTaskScreen({
  navigation,
  route,
}: Props) {
  const {
    taskId,
    taskTitle,
    taskDescription,
    xpReward,
    previousSubmission,
    previousImageUrl,
    rangerFeedback,
    isResubmission = false,
  } = route.params;

  const [
    submissionText,
    setSubmissionText,
  ] = useState(
    previousSubmission ?? '',
  );

  /*
   * imageUri is only used for a NEW image
   * selected from the Junior Ranger's device.
   *
   * previousImageUrl is the already uploaded
   * image from a rejected task.
   */
  const [
    imageUri,
    setImageUri,
  ] = useState<string | null>(
    null,
  );

  const [
    loading,
    setLoading,
  ] = useState(false);

  const [
    submitted,
    setSubmitted,
  ] = useState(false);

  /*
   * =========================================
   * IMAGE PICKER
   * =========================================
   */

  const pickImage =
    async () => {
      try {
        const permissionResult =
          await ImagePicker
            .requestMediaLibraryPermissionsAsync();

        if (
          !permissionResult.granted
        ) {
          Alert.alert(
            'Permission required',
            'Please allow access to your photos so you can choose an image for this task.',
          );

          return;
        }

        const result =
          await ImagePicker
            .launchImageLibraryAsync({
              mediaTypes:
                ImagePicker
                  .MediaTypeOptions
                  .Images,

              allowsEditing: true,

              quality: 0.8,
            });

        if (
          !result.canceled &&
          result.assets.length > 0
        ) {
          setImageUri(
            result.assets[0].uri,
          );
        }
      } catch (error) {
        console.log(
          'Image picker error:',
          error,
        );

        Alert.alert(
          'Unable to choose image',
          'Something went wrong while selecting the image. Please try again.',
        );
      }
    };

  const removeNewImage = () => {
    setImageUri(null);
  };

  /*
   * =========================================
   * SUBMIT TASK
   * =========================================
   */

  const handleSubmit =
    async () => {
      if (
        !submissionText.trim()
      ) {
        Alert.alert(
          'Submission required',
          'Please enter details about how you completed this task.',
        );

        return;
      }

      try {
        setLoading(true);

        /*
         * If a NEW image was selected,
         * upload it to GCS first.
         *
         * uploadImage() returns:
         *
         * /storage/files/{filename}
         *
         * If this is a resubmission and
         * no new image was selected,
         * keep the previous image URL.
         */
        let finalImageUrl:
          | string
          | undefined;

        if (imageUri) {
          finalImageUrl =
            await uploadImage(
              imageUri,
            );
        } else if (
          isResubmission &&
          previousImageUrl
        ) {
          finalImageUrl =
            previousImageUrl;
        }

        await createTaskCompletion(
          taskId,
          {
            submission_text:
              submissionText.trim(),

            image_url:
              finalImageUrl,
          },
        );

        /*
         * Once backend confirms success,
         * display our own success screen.
         *
         * The FallingConfetti component
         * will mount automatically and
         * start its animation.
         */
        setSubmitted(true);
      } catch (error: any) {
        console.log(
          'Task submission error:',
          error,
        );

        const message =
          error?.response?.data
            ?.message ||
          'Something went wrong while submitting the task.';

        Alert.alert(
          'Unable to submit task',
          Array.isArray(
            message,
          )
            ? message.join(
                '\n',
              )
            : message,
        );
      } finally {
        setLoading(false);
      }
    };

  /*
   * =========================================
   * SUCCESS SCREEN
   * =========================================
   */

  if (submitted) {
    return (
      <View
        style={[
          styles.container,
          {
            position:
              'relative',

            overflow:
              'hidden',
          },
        ]}
      >
        {/* COLOURED PAPER FALLING */}

        <FallingConfetti />

        <ScrollView
          contentContainerStyle={{
            flexGrow: 1,
          }}
          showsVerticalScrollIndicator={
            false
          }
        >
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
              {isResubmission
                ? 'Task Resubmitted'
                : 'Task Submitted'}
            </Text>
          </View>

          <View
            style={{
              flex: 1,

              alignItems:
                'center',

              justifyContent:
                'center',

              paddingHorizontal:
                24,

              paddingVertical:
                60,
            }}
          >
            {/* SUCCESS ICON */}

            <View
              style={{
                width: 90,

                height: 90,

                borderRadius:
                  45,

                backgroundColor:
                  '#DDEFE8',

                alignItems:
                  'center',

                justifyContent:
                  'center',

                marginBottom:
                  24,
              }}
            >
              <Text
                style={{
                  fontSize: 48,

                  color:
                    '#3D786B',

                  fontWeight:
                    '700',
                }}
              >
                ✓
              </Text>
            </View>

            {/* CONGRATULATIONS */}

            <Text
              style={{
                fontSize: 28,

                fontWeight:
                  '700',

                color:
                  '#3D786B',

                textAlign:
                  'center',

                marginBottom:
                  12,
              }}
            >
              Congratulations!
            </Text>

            <Text
              style={{
                fontSize: 17,

                color:
                  '#444444',

                textAlign:
                  'center',

                lineHeight:
                  25,

                marginBottom:
                  28,
              }}
            >
              {isResubmission
                ? 'Great work! Your updated task has been sent back to your Ranger for review.'
                : 'Your task has been submitted successfully.'}
            </Text>

            {/* SUBMITTED TASK CARD */}

            <View
              style={{
                width:
                  '100%',

                maxWidth:
                  500,

                backgroundColor:
                  '#F7F9F8',

                borderWidth:
                  1,

                borderColor:
                  '#DDE7E4',

                borderRadius:
                  14,

                padding:
                  18,

                marginBottom:
                  28,
              }}
            >
              <Text
                style={{
                  fontSize:
                    12,

                  color:
                    '#777777',

                  marginBottom:
                    5,
                }}
              >
                {isResubmission
                  ? 'Resubmitted Task'
                  : 'Submitted Task'}
              </Text>

              <Text
                style={{
                  fontSize:
                    18,

                  fontWeight:
                    '700',

                  color:
                    '#1E1E1E',

                  marginBottom:
                    8,
                }}
              >
                {taskTitle}
              </Text>

              <Text
                style={{
                  fontSize:
                    14,

                  color:
                    '#3D786B',

                  fontWeight:
                    '600',
                }}
              >
                Waiting for
                Ranger review
              </Text>
            </View>

            {/* RETURN BUTTON */}

            <Button
              mode="contained"
              onPress={() =>
                navigation.goBack()
              }
              style={[
                styles.submitButton,
                {
                  width:
                    '100%',

                  maxWidth:
                    500,
                },
              ]}
            >
              Back to Adventure
            </Button>
          </View>
        </ScrollView>
      </View>
    );
  }

  /*
   * =========================================
   * NORMAL SUBMISSION SCREEN
   * =========================================
   */

  return (
    <ScrollView
      style={
        styles.container
      }
      contentContainerStyle={
        styles.content
      }
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={
        false
      }
    >
      <View
        style={styles.header}
      >
        <Text
          style={
            styles.headerTitle
          }
        >
          {isResubmission
            ? 'Resubmit Task'
            : 'Submit Task'}
        </Text>
      </View>

      <View
        style={
          styles.submissionCard
        }
      >
        <Text
          style={
            styles.taskSubmitTitle
          }
        >
          {taskTitle}
        </Text>

        {taskDescription ? (
          <View
            style={{
              backgroundColor:
                '#F2F8F6',

              borderWidth: 1,

              borderColor:
                '#D6E9E4',

              borderRadius: 14,

              padding: 14,

              marginTop: 10,

              marginBottom: 14,
            }}
          >
            <View
              style={{
                flexDirection:
                  'row',

                alignItems:
                  'center',

                marginBottom: 7,
              }}
            >
              <Text
                style={{
                  fontSize: 13,

                  fontWeight:
                    '800',

                  color:
                    '#3D786B',
                }}
              >
                Your Task
              </Text>

              <View
                style={{
                  marginLeft:
                    'auto',

                  backgroundColor:
                    '#FFF1BE',

                  borderRadius: 12,

                  paddingHorizontal:
                    9,

                  paddingVertical:
                    5,
                }}
              >
                <Text
                  style={{
                    fontSize: 11,

                    fontWeight:
                      '800',

                    color:
                      '#8C6718',
                  }}
                >
                  +{xpReward} XP
                </Text>
              </View>
            </View>

            <Text
              style={{
                fontSize: 14,

                lineHeight: 21,

                color:
                  '#4D5A56',
              }}
            >
              {taskDescription}
            </Text>
          </View>
        ) : (
          <Text
            style={
              styles.helperText
            }
          >
            Complete this task
            and describe what
            you did. Your Ranger
            will review your
            submission.
          </Text>
        )}

        {isResubmission &&
        rangerFeedback ? (
          <View
            style={{
              marginBottom: 20,

              padding: 16,

              borderRadius: 14,

              backgroundColor:
                '#FFF5EF',

              borderWidth: 1,

              borderColor:
                '#F1C8B7',
            }}
          >
            <View
              style={{
                flexDirection:
                  'row',

                alignItems:
                  'center',

                marginBottom: 8,
              }}
            >
              <Text
                style={{
                  fontSize: 18,
                  marginRight: 8,
                }}
              >
                🌱
              </Text>

              <Text
                style={{
                  fontSize: 16,

                  fontWeight:
                    '700',

                  color:
                    '#934E34',
                }}
              >
                Ranger's Feedback
              </Text>
            </View>

            <Text
              style={{
                fontSize: 14,

                lineHeight: 21,

                color:
                  '#5E514C',
              }}
            >
              {rangerFeedback}
            </Text>

            <Text
              style={{
                fontSize: 13,

                lineHeight: 19,

                color:
                  '#876B60',

                marginTop: 10,
              }}
            >
              Update your answer using
              this feedback and try
              again!
            </Text>
          </View>
        ) : null}

        <Text
          style={{
            fontSize: 14,

            fontWeight:
              '700',

            color:
              '#3D786B',

            marginBottom: 8,
          }}
        >
          Your Answer
        </Text>

        <TextInput
          label="Task submission"
          mode="outlined"
          multiline
          numberOfLines={5}
          value={
            submissionText
          }
          onChangeText={
            setSubmissionText
          }
          style={[
            styles.input,
            styles.textArea,
          ]}
        />

        {/*
         * =========================================
         * TASK IMAGE
         * =========================================
         */}

        <View
          style={{
            marginBottom: 16,
          }}
        >
          <Text
            style={{
              fontSize: 14,

              fontWeight:
                '700',

              color:
                '#3D786B',

              marginBottom: 8,
            }}
          >
            Task Image (optional)
          </Text>

          {/*
           * NEW IMAGE SELECTED
           */}

          {imageUri ? (
            <View
              style={{
                borderWidth: 1,

                borderColor:
                  '#C7DDD7',

                backgroundColor:
                  '#F7FCFA',

                borderRadius: 14,

                padding: 12,
              }}
            >
              <Image
                source={{
                  uri: imageUri,
                }}
                resizeMode="cover"
                style={{
                  width: '100%',

                  height: 220,

                  borderRadius: 12,

                  backgroundColor:
                    '#E8F1EE',
                }}
              />

              <Text
                style={{
                  fontSize: 12,

                  color:
                    '#4E6B64',

                  marginTop: 10,

                  marginBottom: 10,

                  textAlign:
                    'center',
                }}
              >
                This image will be
                uploaded with your
                task.
              </Text>

              <View
                style={{
                  flexDirection:
                    'row',

                  justifyContent:
                    'center',

                  flexWrap:
                    'wrap',

                  gap: 8,
                }}
              >
                <Button
                  mode="outlined"
                  icon="image-edit-outline"
                  onPress={
                    pickImage
                  }
                  disabled={
                    loading
                  }
                >
                  Change Image
                </Button>

                <Button
                  mode="text"
                  icon="delete-outline"
                  onPress={
                    removeNewImage
                  }
                  disabled={
                    loading
                  }
                  textColor="#A14F3D"
                >
                  Remove
                </Button>
              </View>
            </View>
          ) : isResubmission &&
            previousImageUrl ? (
            /*
             * EXISTING IMAGE FROM REJECTED SUBMISSION
             *
             * The stored image URL points to a protected
             * backend endpoint, so we do not try to render
             * the relative URL directly here.
             *
             * It is retained automatically unless the
             * Junior Ranger chooses a replacement.
             */
            <View
              style={{
                borderWidth: 1.5,

                borderColor:
                  '#A8CDC4',

                backgroundColor:
                  '#F2F8F6',

                borderRadius: 14,

                paddingVertical: 20,

                paddingHorizontal: 16,

                alignItems:
                  'center',

                justifyContent:
                  'center',
              }}
            >
              <Text
                style={{
                  fontSize: 32,

                  marginBottom: 8,
                }}
              >
                🖼️
              </Text>

              <Text
                style={{
                  fontSize: 15,

                  fontWeight:
                    '700',

                  color:
                    '#376E62',

                  marginBottom: 5,

                  textAlign:
                    'center',
                }}
              >
                Previous image attached
              </Text>

              <Text
                style={{
                  fontSize: 12,

                  color:
                    '#6F7775',

                  lineHeight: 18,

                  textAlign:
                    'center',

                  marginBottom: 14,
                }}
              >
                Your previous image will
                stay attached unless you
                choose a new one.
              </Text>

              <Button
                mode="outlined"
                icon="image-edit-outline"
                onPress={
                  pickImage
                }
                disabled={
                  loading
                }
              >
                Replace Image
              </Button>
            </View>
          ) : (
            /*
             * NO IMAGE SELECTED
             */

            <View
              style={{
                borderWidth: 1.5,

                borderStyle:
                  'dashed',

                borderColor:
                  '#A8CDC4',

                backgroundColor:
                  '#F7FCFA',

                borderRadius: 14,

                paddingVertical: 22,

                paddingHorizontal: 16,

                alignItems:
                  'center',

                justifyContent:
                  'center',
              }}
            >
              <Text
                style={{
                  fontSize: 32,

                  marginBottom: 8,
                }}
              >
                📷
              </Text>

              <Text
                style={{
                  fontSize: 15,

                  fontWeight:
                    '700',

                  color:
                    '#376E62',

                  marginBottom: 4,

                  textAlign:
                    'center',
                }}
              >
                Add a photo
              </Text>

              <Text
                style={{
                  fontSize: 12,

                  color:
                    '#6F7775',

                  lineHeight: 18,

                  textAlign:
                    'center',

                  marginBottom: 12,
                }}
              >
                Choose a photo that
                shows how you completed
                this task.
              </Text>

              <Button
                mode="outlined"
                icon="image-outline"
                onPress={
                  pickImage
                }
                disabled={
                  loading
                }
              >
                Choose Image
              </Button>
            </View>
          )}
        </View>

        <Button
          mode="contained"
          loading={
            loading
          }
          disabled={
            loading
          }
          onPress={
            handleSubmit
          }
          style={
            styles.submitButton
          }
        >
          {isResubmission
            ? 'Resubmit Task'
            : 'Submit Task'}
        </Button>

        <Button
          mode="text"
          disabled={
            loading
          }
          onPress={() =>
            navigation.goBack()
          }
          style={
            styles.cancelButton
          }
        >
          Cancel
        </Button>
      </View>
    </ScrollView>
  );
}