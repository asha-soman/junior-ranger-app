import React, { useEffect, useState } from 'react';

import {
  ActivityIndicator,
  Alert,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';

import { Button, TextInput } from 'react-native-paper';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

import { AuthStackParamList } from '../../navigation/AuthNavigator';

import {
  Cohort,
  getCohorts,
} from '../../services/cohorts/cohortService';

import {
  createEvent,
} from '../../services/events/eventService';

import { eventStyles as styles } from '../../styles/EventStyles';

type Props = NativeStackScreenProps<
  AuthStackParamList,
  'CreateEvent'
>;

function combineDateAndTime(
  date: string,
  time: string,
): string {
  return new Date(`${date}T${time}:00`).toISOString();
}

export default function CreateEventScreen({
  navigation,
  route,
}: Props) {
  const passedCohortId = route.params?.cohortId || '';

  const [cohorts, setCohorts] = useState<Cohort[]>([]);
  const [selectedCohortId, setSelectedCohortId] =
    useState(passedCohortId);
  const [selectedCohortName, setSelectedCohortName] =
    useState('');

  const [showCohortDropdown, setShowCohortDropdown] =
    useState(false);

  const [cohortLoading, setCohortLoading] =
    useState(false);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');

  const [startDate, setStartDate] = useState('');
  const [startTime, setStartTime] = useState('');

  const [endDate, setEndDate] = useState('');
  const [endTime, setEndTime] = useState('');

  const [deadlineDate, setDeadlineDate] = useState('');
  const [deadlineTime, setDeadlineTime] = useState('');

  const [capacity, setCapacity] = useState('');

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadCohorts();
  }, []);

  const loadCohorts = async () => {
    try {
      setCohortLoading(true);

      const data = await getCohorts();
      setCohorts(data);

      if (passedCohortId) {
        const cohort = data.find(
          (item) => item.id === passedCohortId,
        );

        if (cohort) {
          setSelectedCohortName(cohort.name);
        }
      }
    } catch {
      Alert.alert(
        'Error',
        'Unable to load cohorts.',
      );
    } finally {
      setCohortLoading(false);
    }
  };

  const selectCohort = (cohort: Cohort) => {
    setSelectedCohortId(cohort.id);
    setSelectedCohortName(cohort.name);
    setShowCohortDropdown(false);
  };

  const validate = () => {
    if (!selectedCohortId) {
      Alert.alert(
        'Validation Error',
        'Please select a cohort.',
      );
      return false;
    }

    if (!title.trim()) {
      Alert.alert(
        'Validation Error',
        'Please enter an event title.',
      );
      return false;
    }

    if (!startDate || !startTime) {
      Alert.alert(
        'Validation Error',
        'Please enter the event start date and time.',
      );
      return false;
    }

    if (!endDate || !endTime) {
      Alert.alert(
        'Validation Error',
        'Please enter the event end date and time.',
      );
      return false;
    }

    if (
      capacity &&
      (!Number.isInteger(Number(capacity)) ||
        Number(capacity) < 1)
    ) {
      Alert.alert(
        'Validation Error',
        'Capacity must be a positive whole number.',
      );
      return false;
    }

    return true;
  };

  const handleCreate = async () => {
    if (!validate()) return;

    try {
      setLoading(true);

      const event = await createEvent({
        title: title.trim(),
        description: description.trim() || undefined,
        location: location.trim() || undefined,

        start_time: combineDateAndTime(
          startDate,
          startTime,
        ),

        end_time: combineDateAndTime(
          endDate,
          endTime,
        ),

        registration_deadline:
          deadlineDate && deadlineTime
            ? combineDateAndTime(
                deadlineDate,
                deadlineTime,
              )
            : undefined,

        capacity: capacity
          ? Number(capacity)
          : undefined,

        cohort_id: selectedCohortId,
      });

      Alert.alert(
        'Success',
        'Event created successfully as a draft.',
      );

      navigation.replace('EditEvent', {
        eventId: event.id,
      });
    } catch (error: any) {
      Alert.alert(
        'Create Event Failed',
        error?.response?.data?.message ||
          'Unable to create event.',
      );
    } finally {
      setLoading(false);
    }
  };

  const content = (
    <ScrollView
      contentContainerStyle={styles.content}
      keyboardShouldPersistTaps="handled"
    >
      <View style={styles.header}>
        <Text style={styles.headerTitle}>
          Create Event
        </Text>
      </View>

      <View style={styles.formCard}>
        <Text style={styles.sectionTitle}>
          Cohort
        </Text>

        {cohortLoading ? (
          <ActivityIndicator />
        ) : (
          <>
            <TouchableOpacity
              style={styles.dropdownBox}
              onPress={() =>
                setShowCohortDropdown(
                  !showCohortDropdown,
                )
              }
            >
              <Text
                style={
                  selectedCohortName
                    ? styles.dropdownText
                    : styles.dropdownPlaceholder
                }
              >
                {selectedCohortName ||
                  'Choose a cohort'}
              </Text>
            </TouchableOpacity>

            {showCohortDropdown && (
              <View style={styles.dropdownList}>
                {cohorts.map((cohort) => (
                  <TouchableOpacity
                    key={cohort.id}
                    style={styles.dropdownItem}
                    onPress={() =>
                      selectCohort(cohort)
                    }
                  >
                    <Text
                      style={
                        styles.dropdownItemText
                      }
                    >
                      {cohort.name}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </>
        )}

        <TextInput
          label="Event Title *"
          mode="outlined"
          value={title}
          onChangeText={setTitle}
          style={styles.input}
        />

        <TextInput
          label="Description"
          mode="outlined"
          value={description}
          onChangeText={setDescription}
          multiline
          style={[styles.input, styles.textArea]}
        />

        <TextInput
          label="Location"
          mode="outlined"
          value={location}
          onChangeText={setLocation}
          style={styles.input}
        />

        <Text style={styles.sectionTitle}>
          Start
        </Text>

        <View style={styles.row}>
          <TextInput
            label="Date *"
            placeholder="YYYY-MM-DD"
            mode="outlined"
            value={startDate}
            onChangeText={setStartDate}
            style={[styles.input, styles.rowInput]}
          />

          <TextInput
            label="Time *"
            placeholder="09:00"
            mode="outlined"
            value={startTime}
            onChangeText={setStartTime}
            style={[styles.input, styles.rowInput]}
          />
        </View>

        <Text style={styles.sectionTitle}>
          End
        </Text>

        <View style={styles.row}>
          <TextInput
            label="Date *"
            placeholder="YYYY-MM-DD"
            mode="outlined"
            value={endDate}
            onChangeText={setEndDate}
            style={[styles.input, styles.rowInput]}
          />

          <TextInput
            label="Time *"
            placeholder="12:00"
            mode="outlined"
            value={endTime}
            onChangeText={setEndTime}
            style={[styles.input, styles.rowInput]}
          />
        </View>

        <Text style={styles.sectionTitle}>
          Registration Deadline
        </Text>

        <View style={styles.row}>
          <TextInput
            label="Date"
            placeholder="YYYY-MM-DD"
            mode="outlined"
            value={deadlineDate}
            onChangeText={setDeadlineDate}
            style={[styles.input, styles.rowInput]}
          />

          <TextInput
            label="Time"
            placeholder="17:00"
            mode="outlined"
            value={deadlineTime}
            onChangeText={setDeadlineTime}
            style={[styles.input, styles.rowInput]}
          />
        </View>

        <TextInput
          label="Capacity"
          mode="outlined"
          keyboardType="numeric"
          value={capacity}
          onChangeText={setCapacity}
          style={styles.input}
        />

        <Button
          mode="contained"
          onPress={handleCreate}
          loading={loading}
          disabled={loading}
          style={styles.submitButton}
        >
          Create Event
        </Button>

        <Button
          mode="text"
          onPress={() => navigation.goBack()}
          style={styles.secondaryButton}
        >
          Cancel
        </Button>
      </View>
    </ScrollView>
  );

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={
        Platform.OS === 'ios'
          ? 'padding'
          : Platform.OS === 'android'
            ? 'height'
            : undefined
      }
    >
      {Platform.OS === 'web' ? (
        content
      ) : (
        <TouchableWithoutFeedback
          onPress={Keyboard.dismiss}
        >
          {content}
        </TouchableWithoutFeedback>
      )}
    </KeyboardAvoidingView>
  );
}