import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Keyboard, KeyboardAvoidingView, Platform, ScrollView, Text, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native';
import { Button, TextInput } from 'react-native-paper';
import AppBottomTabBar from "../../components/navigation/AppBottomTabBar";
import { DatePickerModal, TimePickerModal} from 'react-native-paper-dates';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../../navigation/AuthNavigator';
import { Cohort, getCohorts } from '../../services/cohorts/cohortService';
import { createEvent, publishEvent } from '../../services/events/eventService';
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
  const [selectedCohortId, setSelectedCohortId] = useState(passedCohortId);
  const [selectedCohortName, setSelectedCohortName] = useState('');
  const [showCohortDropdown, setShowCohortDropdown] = useState(false);
  const [cohortLoading, setCohortLoading] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [startDate, setStartDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endDate, setEndDate] = useState('');
  const [endTime, setEndTime] = useState('');
  const [deadlineDate, setDeadlineDate] = useState('');
  const [deadlineTime, setDeadlineTime] = useState('');
  const [startDatePickerOpen, setStartDatePickerOpen] = useState(false);
  const [endDatePickerOpen, setEndDatePickerOpen] = useState(false);
  const [deadlineDatePickerOpen, setDeadlineDatePickerOpen] = useState(false);
  const [startTimePickerOpen, setStartTimePickerOpen] = useState(false);
  const [endTimePickerOpen, setEndTimePickerOpen] = useState(false);
  const [deadlineTimePickerOpen, setDeadlineTimePickerOpen] = useState(false);
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

  const createNewEvent = async (
    shouldPublish: boolean,
  ) => {
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

      if (shouldPublish) {
        await publishEvent(event.id);
      }

      Alert.alert(
        'Success',
        shouldPublish
          ? 'Event published successfully.'
          : 'Event saved as draft.',
      );

      navigation.goBack();
    } catch (error: any) {
      Alert.alert(
        'Event Creation Failed',
        error?.response?.data?.message ||
          'Unable to create event.',
      );
    } finally {
      setLoading(false);
    }
  };

  const formatDateForState = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
  };

  const dateStringToDate = (value: string) => {
    if (!value) {
      return new Date();
    }

    const [year, month, day] = value.split('-').map(Number);

    return new Date(year, month - 1, day);
  };

  const formatTime = (hours: number, minutes: number) => {
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
  };

  const getTimeParts = (time: string) => {
    if (!time) { return { hours: 9, minutes: 0} }

    const [hours, minutes] = time.split(':').map(Number);
    return { hours, minutes};
  };

  const content = (
    <View style={{ flex: 1, backgroundColor: '#F4F4F4' }}>
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

        <ScrollView
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
        >

          <View style={styles.formCard}>
            <Text style={styles.sectionTitle}>
              Event Details
            </Text>

            {cohortLoading ? (
              <ActivityIndicator />
            ) : (
              <>
                <View>
                  <TextInput
                    label="Cohort *"
                    mode="outlined"
                    value={selectedCohortName}
                    placeholder="Choose a cohort"
                    editable={false}
                    style={styles.input}
                    onPressIn={() => {
                      if (!showCohortDropdown) {
                        setShowCohortDropdown(true);
                      }
                    }}
                    right={
                      <TextInput.Icon
                        icon={
                          showCohortDropdown
                            ? "chevron-up"
                            : "chevron-down"
                        }
                        forceTextInputFocus={false}
                        onPress={() => {
                          setShowCohortDropdown(
                            (current) => !current
                          );
                        }}
                      />
                    }
                  />
                </View>

                {showCohortDropdown && (
                  <View style={styles.dropdownList}>
                    <ScrollView
                      nestedScrollEnabled
                      showsVerticalScrollIndicator={true}
                    >
                      {cohorts.map((cohort) => (
                        <TouchableOpacity
                          key={cohort.id}
                          style={styles.dropdownItem}
                          onPress={() => selectCohort(cohort)}
                        >
                          <Text style={styles.dropdownItemText}>
                            {cohort.name}
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </ScrollView>
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
              <TouchableOpacity
                onPress={() => setStartDatePickerOpen(true)}
                activeOpacity={0.8}
                style={styles.dateInput}
              >
                <TextInput
                  label="Start Date *"
                  mode="outlined"
                  value={startDate}
                  placeholder="Select date"
                  editable={false}
                  pointerEvents="none"
                  right={<TextInput.Icon icon="calendar" />}
                  style={styles.input}
                />
              </TouchableOpacity>

              <DatePickerModal
                locale="en"
                mode="single"
                visible={startDatePickerOpen}
                date={dateStringToDate(startDate)}
                onDismiss={() =>
                  setStartDatePickerOpen(false)
                }
                onConfirm={({ date }) => {
                  setStartDatePickerOpen(false);

                  if (date) {
                    setStartDate(
                      formatDateForState(date),
                    );
                  }
                }}
              />

              <TouchableOpacity
                onPress={() => setStartTimePickerOpen(true)}
                activeOpacity={0.8}
                style={styles.timeInput}
              >
                <TextInput
                  label="Time *"
                  value={startTime}
                  placeholder="Select time"
                  mode="outlined"
                  editable={false}
                  pointerEvents="none"
                  right={<TextInput.Icon icon="clock-outline" />}
                  style={styles.input}
                />
              </TouchableOpacity>

              <TimePickerModal
                visible={startTimePickerOpen}
                onDismiss={() => setStartTimePickerOpen(false)}
                onConfirm={({ hours, minutes }) => {
                  setStartTimePickerOpen(false);
                  setStartTime(formatTime(hours, minutes));
                }}
                hours={getTimeParts(startTime).hours}
                minutes={getTimeParts(startTime).minutes}
                locale="en"
              />
            </View>

            <Text style={styles.sectionTitle}>
              End
            </Text>

            <View style={styles.row}>
              <TouchableOpacity
                onPress={() => setEndDatePickerOpen(true)}
                activeOpacity={0.8}
                style={styles.dateInput}
              >
                <TextInput
                  label="End Date *"
                  mode="outlined"
                  value={endDate}
                  placeholder="Select date"
                  editable={false}
                  pointerEvents="none"
                  right={<TextInput.Icon icon="calendar" />}
                  style={styles.input}
                />
              </TouchableOpacity>

              <DatePickerModal
                locale="en"
                mode="single"
                visible={endDatePickerOpen}
                date={dateStringToDate(endDate)}
                onDismiss={() =>
                  setEndDatePickerOpen(false)
                }
                onConfirm={({ date }) => {
                  setEndDatePickerOpen(false);

                  if (date) {
                    setEndDate(
                      formatDateForState(date),
                    );
                  }
                }}
              />

              <TouchableOpacity
                onPress={() => setEndTimePickerOpen(true)}
                activeOpacity={0.8}
                style={styles.timeInput}
              >
                <TextInput
                  label="Time *"
                  value={endTime}
                  placeholder="Select time"
                  mode="outlined"
                  editable={false}
                  pointerEvents="none"
                  right={<TextInput.Icon icon="clock-outline" />}
                  style={styles.input}
                />
              </TouchableOpacity>

              <TimePickerModal
                visible={endTimePickerOpen}
                onDismiss={() => setEndTimePickerOpen(false)}
                onConfirm={({ hours, minutes }) => {
                  setEndTimePickerOpen(false);
                  setEndTime(formatTime(hours, minutes));
                }}
                hours={getTimeParts(endTime).hours}
                minutes={getTimeParts(endTime).minutes}
                locale="en"
              />
            </View>

            <Text style={styles.sectionTitle}>
              Registration Deadline
            </Text>

            <View style={styles.row}>
              <TouchableOpacity
                onPress={() =>
                  setDeadlineDatePickerOpen(true)
                }
                activeOpacity={0.8}
                style={styles.dateInput}
              >
                <TextInput
                  label="Deadline *"
                  mode="outlined"
                  value={deadlineDate}
                  placeholder="Select date"
                  editable={false}
                  pointerEvents="none"
                  right={<TextInput.Icon icon="calendar" />}
                  style={styles.input}
                />
              </TouchableOpacity>

              <DatePickerModal
                locale="en"
                mode="single"
                visible={deadlineDatePickerOpen}
                date={dateStringToDate(deadlineDate)}
                onDismiss={() =>
                  setDeadlineDatePickerOpen(false)
                }
                onConfirm={({ date }) => {
                  setDeadlineDatePickerOpen(false);

                  if (date) {
                    setDeadlineDate(
                      formatDateForState(date),
                    );
                  }
                }}
              />

              <TouchableOpacity
                onPress={() => setDeadlineTimePickerOpen(true)}
                activeOpacity={0.8}
                style={styles.timeInput}
              >
                <TextInput
                  label="Time *"
                  value={deadlineTime}
                  placeholder="Select time"
                  mode="outlined"
                  editable={false}
                  pointerEvents="none"
                  right={<TextInput.Icon icon="clock-outline" />}
                  style={styles.input}
                />
              </TouchableOpacity>

              <TimePickerModal
                visible={deadlineTimePickerOpen}
                onDismiss={() => setDeadlineTimePickerOpen(false)}
                onConfirm={({ hours, minutes }) => {
                  setDeadlineTimePickerOpen(false);
                  setDeadlineTime(formatTime(hours, minutes));
                }}
                hours={getTimeParts(deadlineTime).hours}
                minutes={getTimeParts(deadlineTime).minutes}
                locale="en"
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
              onPress={() => createNewEvent(false)}
              loading={loading}
              disabled={loading}
              style={styles.submitButton}
            >
              Save as Draft
            </Button>

            <Button
              mode="contained"
              onPress={() => createNewEvent(true)}
              disabled={loading}
              style={styles.publishButton}
            >
              Publish Event
            </Button>

          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      <AppBottomTabBar
        role={route.params?.userRole ?? 'ranger'}
        activeTab="menu"
      />
    </View>
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