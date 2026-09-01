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
  ScrollView,
  Text,
  View,
} from 'react-native';

import {
  Button,
  TextInput,
} from 'react-native-paper';

import {
  NativeStackScreenProps,
} from '@react-navigation/native-stack';

import {
  AuthStackParamList,
} from '../../navigation/AuthNavigator';

import {
  createTaskCompletion,
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
  } = route.params;

  const [
    submissionText,
    setSubmissionText,
  ] = useState('');

  const [
    imageUrl,
    setImageUrl,
  ] = useState('');

  const [
    loading,
    setLoading,
  ] = useState(false);

  const [
    submitted,
    setSubmitted,
  ] = useState(false);

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

        await createTaskCompletion(
          taskId,
          {
            submission_text:
              submissionText.trim(),

            image_url:
              imageUrl.trim() ||
              undefined,
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
              Task Submitted
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
              Your task has
              been submitted
              successfully.
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
                Submitted Task
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
          Submit Task
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

        <Text
          style={
            styles.helperText
          }
        >
          Describe what you
          did to complete this
          task. Your Ranger
          will review your
          submission.
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

        <TextInput
          label="Image URL (optional)"
          mode="outlined"
          value={
            imageUrl
          }
          onChangeText={
            setImageUrl
          }
          autoCapitalize="none"
          autoCorrect={
            false
          }
          style={
            styles.input
          }
        />

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
          Submit Task
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