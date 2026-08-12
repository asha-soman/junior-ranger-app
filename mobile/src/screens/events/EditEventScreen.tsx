import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Platform, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { Button, TextInput } from 'react-native-paper';
import { DatePickerModal, TimePickerModal } from 'react-native-paper-dates';
import AppBottomTabBar from '../../components/navigation/AppBottomTabBar';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../../navigation/AuthNavigator';
import { EventItem, cancelEvent, deleteEvent, getEventById, publishEvent, updateEvent } from '../../services/events/eventService';
import { Cohort, getCohorts } from '../../services/cohorts/cohortService';
import { eventStyles as styles } from '../../styles/EventStyles';

type Props = NativeStackScreenProps<
  AuthStackParamList,
  'EditEvent'
>;

function splitDateTime(value: string) {
  const date = new Date(value);

  const pad = (number: number) =>
    String(number).padStart(2, '0');

  return {
    date:
      `${date.getFullYear()}-` +
      `${pad(date.getMonth() + 1)}-` +
      `${pad(date.getDate())}`,

    time:
      `${pad(date.getHours())}:` +
      `${pad(date.getMinutes())}`,
  };
}

function combineDateTime(
  date: string,
  time: string,
) {
  return new Date(`${date}T${time}:00`).toISOString();
}

export default function EditEventScreen({
  navigation,
  route,
}: Props) {
  const { eventId } = route.params;

  const [event, setEvent] = useState<EventItem | null>(null);
  const [cohorts, setCohorts] = useState<Cohort[]>([]);
  const [selectedCohortId, setSelectedCohortId] = useState('');
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
  const [fetching, setFetching] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadEvent();
  }, [eventId]);

  const loadEvent = async () => {
    try {
      setFetching(true);
      setCohortLoading(true);

      const [data, cohortData] = await Promise.all([
        getEventById(eventId),
        getCohorts(),
      ]);

      setEvent(data);
      setCohorts(cohortData);

      setTitle(data.title);
      setDescription(data.description || '');
      setLocation(data.location || '');

      setSelectedCohortId(data.cohort_id);

      const currentCohort = cohortData.find(
        (cohort) => cohort.id === data.cohort_id,
      );

      setSelectedCohortName(
        currentCohort?.name || 'Current cohort',
      );

      const start = splitDateTime(data.start_time);
      setStartDate(start.date);
      setStartTime(start.time);

      const end = splitDateTime(data.end_time);
      setEndDate(end.date);
      setEndTime(end.time);

      if (data.registration_deadline) {
        const deadline = splitDateTime(
          data.registration_deadline,
        );

        setDeadlineDate(deadline.date);
        setDeadlineTime(deadline.time);
      }

      setCapacity(
        data.capacity !== null
          ? String(data.capacity)
          : '',
      );
    } catch (error: any) {
      Alert.alert(
        'Error',
        error?.response?.data?.message ||
          'Unable to load event.',
      );

      navigation.goBack();
    } finally {
      setFetching(false);
      setCohortLoading(false);
    }
  };

  const selectCohort = (cohort: Cohort) => {
    setSelectedCohortId(cohort.id);
    setSelectedCohortName(cohort.name);
    setShowCohortDropdown(false);
  };

  const handleSave = async () => {

    if (!selectedCohortId) {
      Alert.alert(
        'Validation Error',
        'Please select a cohort.',
      );
      return;
    }

    if (!title.trim()) {
      Alert.alert(
        'Validation Error',
        'Event title is required.',
      );
      return;
    }

    try {
      setSaving(true);

      await updateEvent(
        eventId,
        {
          title: title.trim(),
          description: description.trim(),
          location: location.trim(),

          start_time: combineDateTime(
            startDate,
            startTime,
          ),

          end_time: combineDateTime(
            endDate,
            endTime,
          ),

          registration_deadline:
            deadlineDate && deadlineTime
              ? combineDateTime(
                  deadlineDate,
                  deadlineTime,
                )
              : undefined,

          capacity: capacity
            ? Number(capacity)
            : undefined,

          cohort_id: selectedCohortId,
        },
      );

      Alert.alert(
        'Success',
        'Event updated successfully.',
      );

      navigation.goBack();
    } catch (error: any) {
      Alert.alert(
        'Update Failed',
        error?.response?.data?.message ||
          'Unable to update event.',
      );
    } finally {
      setSaving(false);
    }
  };

  const handlePublish = async () => {
    try {
      setSaving(true);

      await updateEvent(
        eventId,
        {
          title: title.trim(),
          description: description.trim(),
          location: location.trim(),

          start_time: combineDateTime(
            startDate,
            startTime,
          ),

          end_time: combineDateTime(
            endDate,
            endTime,
          ),

          registration_deadline:
            deadlineDate && deadlineTime
              ? combineDateTime(
                  deadlineDate,
                  deadlineTime,
                )
              : undefined,

          capacity: capacity
            ? Number(capacity)
            : undefined,

          cohort_id: selectedCohortId,
        },
      );

      await publishEvent(eventId);

    Alert.alert(
      'Success',
      event?.status === 'cancelled'
        ? 'Event published again successfully.'
        : 'Event published successfully.',
    );

      navigation.goBack();
    } catch (error: any) {
      Alert.alert(
        'Publish Failed',
        error?.response?.data?.message ||
          'Unable to publish event.',
      );
    } finally {
      setSaving(false);
    }
  };

  const performCancel = async () => {
    try {
      setSaving(true);

      await cancelEvent(eventId);

      Alert.alert(
        'Success',
        'Event cancelled successfully.',
      );

      navigation.goBack();
    } catch (error: any) {
      Alert.alert(
        'Cancel Failed',
        error?.response?.data?.message ||
          'Unable to cancel event.',
      );
    } finally {
      setSaving(false);
    }
  };

  const handleCancelEvent = () => {
    if (Platform.OS === 'web') {
      if (
        window.confirm(
          'Are you sure you want to cancel this event?',
        )
      ) {
        performCancel();
      }

      return;
    }

    Alert.alert(
      'Cancel Event',
      'Are you sure you want to cancel this event?',
      [
        {
          text: 'No',
          style: 'cancel',
        },
        {
          text: 'Yes',
          style: 'destructive',
          onPress: performCancel,
        },
      ],
    );
  };

  const performDelete = async () => {
    try {
      setSaving(true);

      await deleteEvent(eventId);

      Alert.alert(
        'Success',
        'Event deleted successfully.',
      );

      navigation.goBack();
    } catch (error: any) {
      Alert.alert(
        'Delete Failed',
        error?.response?.data?.message ||
          'Unable to delete event.',
      );
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = () => {
    if (Platform.OS === 'web') {
      if (
        window.confirm(
          'Are you sure you want to delete this event?',
        )
      ) {
        performDelete();
      }

      return;
    }

    Alert.alert(
      'Delete Event',
      'Are you sure you want to delete this event?',
      [
        {
          text: 'No',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: performDelete,
        },
      ],
    );
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

  if (fetching) {
    return (
      <ActivityIndicator
        size="large"
        style={styles.loader}
      />
    );
  }

  if (!event) {
    return null;
  }

  const formatTime = (hours: number, minutes: number) => {
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
  };

  const getTimeParts = (time: string) => {
    if (!time) { return { hours: 9, minutes: 0} }

    const [hours, minutes] = time.split(':').map(Number);
    return { hours, minutes};
  };


  return (
    <View style={{ flex: 1, backgroundColor: '#F4F4F4' }}>
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.formCard}>
          <Text style={styles.statusText}>
            Status: {event.status}
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
            label="Event Title"
            mode="outlined"
            value={title}
            onChangeText={setTitle}
            style={styles.input}
          />

          <TextInput
            label="Description"
            mode="outlined"
            multiline
            value={description}
            onChangeText={setDescription}
            style={[
              styles.input,
              styles.textArea,
            ]}
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
                label="Registration Date"
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
            onPress={handleSave}
            loading={saving}
            disabled={saving}
            style={styles.submitButton}
          >
            Save Changes
          </Button>

          {(event.status === 'draft' ||
            event.status === 'cancelled') && (
            <Button
              mode="contained"
              onPress={handlePublish}
              disabled={saving}
              style={styles.publishButton}
            >
              Publish Event
            </Button>
          )}

          {event.status === 'published' && (
            <Button
              mode="outlined"
              onPress={handleCancelEvent}
              disabled={saving}
              style={
                styles.cancelEventButton
              }
            >
              Cancel Event
            </Button>
          )}

          <Button
            mode="outlined"
            textColor="#9A3D3D"
            onPress={handleDelete}
            disabled={saving}
            style={styles.deleteButton}
          >
            Delete Event
          </Button>
        </View>
      </ScrollView>

      <AppBottomTabBar
        role={route.params?.userRole}
        activeTab="menu"
      />
    </View>
  );
}