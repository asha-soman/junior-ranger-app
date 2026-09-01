import React, { useState } from 'react';

import {
  Alert,
  ScrollView,
  Text,
  View,
  Dimensions,
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

  const handleSubmit = async () => {
    if (!submissionText.trim()) {
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
       * Instead of using Alert.alert()
       * for success, show our own
       * success screen.
       *
       * This works better on both
       * mobile and web.
       */
      setSubmitted(true);
    } catch (error: any) {
      console.log(
        'Task submission error:',
        error,
      );

      const message =
        error?.response?.data?.message ||
        'Something went wrong while submitting the task.';

      Alert.alert(
        'Unable to submit task',
        Array.isArray(message)
          ? message.join('\n')
          : message,
      );
    } finally {
      setLoading(false);
    }
  };

  /*
   * =========================================
   * SUCCESS SCREEN + CONFETTI
   * =========================================
   */

  if (submitted) {
    const screenWidth =
      Dimensions.get('window').width;

    return (
      <View
        style={[
          styles.container,
          {
            position: 'relative',
            overflow: 'hidden',
          },
        ]}
      >

        <ScrollView
          contentContainerStyle={{
            flexGrow: 1,
          }}
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
              Task Submitted
            </Text>
          </View>

          <View
            style={{
              flex: 1,
              alignItems: 'center',
              justifyContent: 'center',
              paddingHorizontal: 24,
              paddingVertical: 60,
            }}
          >
            {/* SUCCESS ICON */}

            <View
              style={{
                width: 90,
                height: 90,
                borderRadius: 45,
                backgroundColor:
                  '#DDEFE8',
                alignItems:
                  'center',
                justifyContent:
                  'center',
                marginBottom: 24,
              }}
            >
              <Text
                style={{
                  fontSize: 48,
                  color: '#3D786B',
                  fontWeight: '700',
                }}
              >
                ✓
              </Text>
            </View>

            {/* CONGRATULATIONS */}

            <Text
              style={{
                fontSize: 28,
                fontWeight: '700',
                color: '#3D786B',
                textAlign: 'center',
                marginBottom: 12,
              }}
            >
              Congratulations!
            </Text>

            <Text
              style={{
                fontSize: 17,
                color: '#444444',
                textAlign: 'center',
                lineHeight: 25,
                marginBottom: 28,
              }}
            >
              Your task has been submitted
              successfully.
            </Text>

            {/* TASK CARD */}

            <View
              style={{
                width: '100%',
                maxWidth: 500,
                backgroundColor:
                  '#F7F9F8',
                borderWidth: 1,
                borderColor:
                  '#DDE7E4',
                borderRadius: 14,
                padding: 18,
                marginBottom: 28,
              }}
            >
              <Text
                style={{
                  fontSize: 12,
                  color: '#777777',
                  marginBottom: 5,
                }}
              >
                Submitted Task
              </Text>

              <Text
                style={{
                  fontSize: 18,
                  fontWeight: '700',
                  color: '#1E1E1E',
                  marginBottom: 8,
                }}
              >
                {taskTitle}
              </Text>

              <Text
                style={{
                  fontSize: 14,
                  color: '#3D786B',
                  fontWeight: '600',
                }}
              >
                Waiting for Ranger review
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
                  width: '100%',
                  maxWidth: 500,
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
   * NORMAL TASK SUBMISSION SCREEN
   * =========================================
   */

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={
        styles.content
      }
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={
        false
      }
    >
      <View style={styles.header}>
        <Text
          style={styles.headerTitle}
        >
          Submit Task
        </Text>
      </View>

      <View
        style={styles.submissionCard}
      >
        <Text
          style={
            styles.taskSubmitTitle
          }
        >
          {taskTitle}
        </Text>

        <Text
          style={styles.helperText}
        >
          Describe what you did to
          complete this task. Your Ranger
          will review your submission.
        </Text>

        <TextInput
          label="Task submission"
          mode="outlined"
          multiline
          numberOfLines={5}
          value={submissionText}
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
          value={imageUrl}
          onChangeText={
            setImageUrl
          }
          autoCapitalize="none"
          autoCorrect={false}
          style={styles.input}
        />

        <Button
          mode="contained"
          loading={loading}
          disabled={loading}
          onPress={handleSubmit}
          style={
            styles.submitButton
          }
        >
          Submit Task
        </Button>

        <Button
          mode="text"
          disabled={loading}
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