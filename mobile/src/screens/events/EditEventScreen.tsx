import React, { useEffect, useState } from 'react';

import {
  ActivityIndicator,
  Alert,
  Platform,
  ScrollView,
  Text,
  View,
} from 'react-native';

import { Button, TextInput } from 'react-native-paper';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

import { AuthStackParamList } from '../../navigation/AuthNavigator';

import {
  EventItem,
  cancelEvent,
  deleteEvent,
  getEventById,
  publishEvent,
  updateEvent,
} from '../../services/events/eventService';

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

  const [event, setEvent] =
    useState<EventItem | null>(null);

  const [title, setTitle] = useState('');
  const [description, setDescription] =
    useState('');
  const [location, setLocation] =
    useState('');

  const [startDate, setStartDate] =
    useState('');
  const [startTime, setStartTime] =
    useState('');

  const [endDate, setEndDate] =
    useState('');
  const [endTime, setEndTime] =
    useState('');

  const [deadlineDate, setDeadlineDate] =
    useState('');
  const [deadlineTime, setDeadlineTime] =
    useState('');

  const [capacity, setCapacity] =
    useState('');

  const [fetching, setFetching] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  useEffect(() => {
    loadEvent();
  }, [eventId]);

  const loadEvent = async () => {
    try {
      setFetching(true);

      const data = await getEventById(eventId);

      setEvent(data);

      setTitle(data.title);
      setDescription(data.description || '');
      setLocation(data.location || '');

      const start = splitDateTime(
        data.start_time,
      );

      setStartDate(start.date);
      setStartTime(start.time);

      const end = splitDateTime(
        data.end_time,
      );

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
        data.capacity
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
    }
  };

  const handleSave = async () => {
    if (!title.trim()) {
      Alert.alert(
        'Validation Error',
        'Event title is required.',
      );
      return;
    }

    try {
      setSaving(true);

      const updated = await updateEvent(
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
        },
      );

      setEvent(updated);

      Alert.alert(
        'Success',
        'Event updated successfully.',
      );
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
      const updated =
        await publishEvent(eventId);

      setEvent(updated);

      Alert.alert(
        'Success',
        'Event published successfully.',
      );
    } catch (error: any) {
      Alert.alert(
        'Publish Failed',
        error?.response?.data?.message ||
          'Unable to publish event.',
      );
    }
  };

  const performCancel = async () => {
    try {
      const updated =
        await cancelEvent(eventId);

      setEvent(updated);

      Alert.alert(
        'Success',
        'Event cancelled successfully.',
      );
    } catch (error: any) {
      Alert.alert(
        'Cancel Failed',
        error?.response?.data?.message ||
          'Unable to cancel event.',
      );
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

  return (
    <ScrollView
      contentContainerStyle={styles.content}
    >
      <View style={styles.header}>
        <Text style={styles.headerTitle}>
          Edit Event
        </Text>
      </View>

      <View style={styles.formCard}>
        <Text style={styles.statusText}>
          Status: {event.status}
        </Text>

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
          <TextInput
            label="Date"
            mode="outlined"
            value={startDate}
            onChangeText={setStartDate}
            style={[
              styles.input,
              styles.rowInput,
            ]}
          />

          <TextInput
            label="Time"
            mode="outlined"
            value={startTime}
            onChangeText={setStartTime}
            style={[
              styles.input,
              styles.rowInput,
            ]}
          />
        </View>

        <Text style={styles.sectionTitle}>
          End
        </Text>

        <View style={styles.row}>
          <TextInput
            label="Date"
            mode="outlined"
            value={endDate}
            onChangeText={setEndDate}
            style={[
              styles.input,
              styles.rowInput,
            ]}
          />

          <TextInput
            label="Time"
            mode="outlined"
            value={endTime}
            onChangeText={setEndTime}
            style={[
              styles.input,
              styles.rowInput,
            ]}
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

        {event.status === 'draft' && (
          <Button
            mode="contained"
            onPress={handlePublish}
            style={styles.publishButton}
          >
            Publish Event
          </Button>
        )}

        {event.status === 'published' && (
          <Button
            mode="outlined"
            onPress={handleCancelEvent}
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
          style={styles.deleteButton}
        >
          Delete Event
        </Button>
      </View>
    </ScrollView>
  );
}