import React, { useCallback, useState } from 'react';
import { ActivityIndicator, Alert, ScrollView, Text, View } from 'react-native';
import { Button, Chip } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../../navigation/AuthNavigator';
import { EventDetails, getEventDetails, registerForEvent, cancelEventRegistration } from '../../services/events/eventService';
import { eventDetailsStyles as styles } from '../../styles/EventDetailsStyles';
import AppBottomTabBar from '../../components/navigation/AppBottomTabBar';

type Props = NativeStackScreenProps<
  AuthStackParamList,
  'EventDetails'
>;

export default function EventDetailsScreen({
  navigation,
  route,
}: Props) {
  const {
    eventId,
    userRole,
  } = route.params;

  const [event, setEvent] =
    useState<EventDetails | null>(null);

  const [registrationLoading, setRegistrationLoading] =
    useState(false);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState('');

  const canManageEvents =
    userRole === 'admin' ||
    userRole === 'ranger';

  const loadEvent = async () => {
    try {
      setLoading(true);
      setError('');

      const data =
        await getEventDetails(eventId);

      setEvent(data);
    } catch (error: any) {
      console.log(
        'Event details loading error:',
        error,
      );

      if (
        error?.response?.status === 403
      ) {
        setError(
          'You do not have permission to view this event.',
        );
      } else if (
        error?.response?.status === 404
      ) {
        setError(
          'This event could not be found.',
        );
      } else {
        setError(
          error?.response?.data?.message ||
            'Unable to load event details.',
        );
      }
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadEvent();
    }, [eventId]),
  );

  const isMultiDayEvent = (
    startTime: string,
    endTime: string,
  ) => {
    const start = new Date(startTime);
    const end = new Date(endTime);

    return (
      start.getFullYear() !== end.getFullYear() ||
      start.getMonth() !== end.getMonth() ||
      start.getDate() !== end.getDate()
    );
  };

  const formatDate = (
    value: string,
  ) => {
    return new Date(
      value,
    ).toLocaleDateString(
      'en-AU',
      {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
      },
    );
  };

  const formatTime = (
    value: string,
  ) => {
    return new Date(
      value,
    ).toLocaleTimeString(
      'en-AU',
      {
        hour: '2-digit',
        minute: '2-digit',
      },
    );
  };

  const getStatusLabel = (
    status: EventDetails['status'],
  ) => {
    switch (status) {
      case 'draft':
        return 'Draft';

      case 'published':
        return 'Published';

      case 'cancelled':
        return 'Cancelled';

      case 'completed':
        return 'Completed';

      default:
        return status;
    }
  };

  const getRegistrationStatus = () => {
    if (!event) {
      return '';
    }

    if (
      event.registration.user_status ===
      'registered'
    ) {
      return 'You are registered for this event.';
    }

    if (
      event.registration.user_status ===
      'cancelled'
    ) {
      return 'Your registration was cancelled.';
    }

    return 'You are not registered for this event.';
  };

  const handleRegister = async () => {
    try {
      setRegistrationLoading(true);

      await registerForEvent(
        eventId,
      );

      await loadEvent();

      Alert.alert(
        'Registration Successful',
        'You are now registered for this event.',
      );
    } catch (error: any) {
                      Alert.alert(
        'Registration Failed',
        error?.response?.data?.message ||
          'Unable to register for this event.',
      );
    } finally {
      setRegistrationLoading(false);
    }
  };

const handleCancelRegistration =
  async () => {
    try {
      setRegistrationLoading(true);

      await cancelEventRegistration(
        eventId,
      );

      await loadEvent();

      Alert.alert(
        'Registration Cancelled',
        'Your event registration has been cancelled.',
      );
    } catch (error: any) {
      Alert.alert(
        'Cancellation Failed',
        error?.response?.data?.message ||
          'Unable to cancel your registration.',
      );
    } finally {
      setRegistrationLoading(false);
    }
  };

const getRegistrationButtonLabel = () => {
  if (!event) return '';

  // Junior is already registered
  if (
    event.registration.user_status === 'registered'
  ) {
    return 'Cancel Registration';
  }

  // Event has reached maximum capacity
  if (
    event.capacity !== null &&
    event.registration.registered_count >= event.capacity
  ) {
    return 'Event Full';
  }

  // Registration deadline has passed
  if (
    event.registration_deadline &&
    new Date(event.registration_deadline) <= new Date()
  ) {
    return 'Registration Closed';
  }

  // Registration is available
  return 'Register for Event';
};

  if (loading) {
    return (
      <View style={styles.container}>
        <View
          style={
            styles.loaderContainer
          }
        >
          <ActivityIndicator
            size="large"
          />
        </View>

        <AppBottomTabBar
          role={userRole}
          activeTab="menu"
        />
      </View>
    );
  }

  if (error || !event) {
    return (
      <View style={styles.container}>
        <View
          style={
            styles.errorContainer
          }
        >
          <Ionicons
            name="alert-circle-outline"
            size={52}
            color="#A33A3A"
          />

          <Text
            style={styles.errorText}
          >
            {error ||
              'Unable to load event details.'}
          </Text>

          <Button
            mode="contained"
            onPress={loadEvent}
            style={styles.retryButton}
          >
            Try Again
          </Button>

          <Button
            mode="text"
            onPress={() =>
              navigation.goBack()
            }
          >
            Back to Events
          </Button>
        </View>

        <AppBottomTabBar
          role={userRole}
          activeTab="menu"
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={
          styles.content
        }
      >
        <View style={styles.card}>
          <View
            style={styles.titleRow}
          >
            <Text
              style={styles.title}
            >
              {event.title}
            </Text>

            <Chip compact>
              {getStatusLabel(
                event.status,
              )}
            </Chip>
          </View>

          {!!event.description && (
            <Text style={ styles.description }>
              {event.description}
            </Text>
          )}

          <Text style={ styles.sectionTitle }>
            Event Information
          </Text>

          {canManageEvents && (
            <View style={styles.fieldGroup}>
              <Text style={styles.label}>
                Cohort
              </Text>

              <View style={styles.infoBox}>
                <Text style={styles.value}>
                  {event.cohort.name}
                </Text>
              </View>
            </View>
          )}

          {isMultiDayEvent(event.start_time, event.end_time) ? (
            <>
              <View style={styles.fieldGroup}>
                <Text style={styles.label}>
                  Start Date
                </Text>

                <View style={styles.infoBox}>
                  <Text style={styles.value}>
                    {formatDate(event.start_time)}
                  </Text>
                </View>
              </View>

              <View style={styles.fieldGroup}>
                <Text style={styles.label}>
                  End Date
                </Text>

                <View style={styles.infoBox}>
                  <Text style={styles.value}>
                    {formatDate(event.end_time)}
                  </Text>
                </View>
              </View>
            </>
          ) : (
            <View style={styles.fieldGroup}>
              <Text style={styles.label}>
                Date
              </Text>

              <View style={styles.infoBox}>
                <Text style={styles.value}>
                  {formatDate(event.start_time)}
                </Text>
              </View>
            </View>
          )}

          <View
            style={
              styles.fieldGroup
            }
          >
            <Text
              style={styles.label}
            >
              Time
            </Text>

            <View
              style={styles.infoBox}
            >
              <Text
                style={styles.value}
              >
                {formatTime(
                  event.start_time,
                )}
                {' - '}
                {formatTime(
                  event.end_time,
                )}
              </Text>
            </View>
          </View>

          <View
            style={
              styles.fieldGroup
            }
          >
            <Text
              style={styles.label}
            >
              Location
            </Text>

            <View
              style={styles.infoBox}
            >
              <Text
                style={styles.value}
              >
                {event.location ||
                  'Not specified'}
              </Text>
            </View>
          </View>

          <Text
            style={
              styles.sectionTitle
            }
          >
            Organiser
          </Text>

          <View
            style={
              styles.fieldGroup
            }
          >
            <Text
              style={styles.label}
            >
              Name
            </Text>

            <View
              style={styles.infoBox}
            >
              <Text
                style={styles.value}
              >
                {event.organiser.name ||
                  'Not available'}
              </Text>
            </View>
          </View>

          <Text
            style={
              styles.sectionTitle
            }
          >
            Registration Information
          </Text>

          <View
            style={
              styles.registrationBox
            }
          >

            {!!event.registration_deadline && (
            <View>
              <Text style={styles.registrationLabel}>
                Deadline:
              </Text>

              <Text style={styles.registrationText}>
                {formatDate(event.registration_deadline)} at{' '}
                {formatTime(event.registration_deadline)}
              </Text>
            </View>
            )}

            <Text style={styles.registrationText}>
              <Text style={styles.registrationLabel}>
                Registered:</Text>{' '}
              {event.registration.registered_count}
            </Text>

            <Text style={styles.registrationText}>
              <Text style={styles.registrationLabel}>
                Spots available:
              </Text>{' '}
              {event.registration.spots_available ?? 'Unlimited'}
            </Text>

            <View style={styles.registrationStatusRow}>
              <Text style={styles.registrationLabel}>
                Registration Status:
              </Text>

              <Text
                style={
                  event.registration.registration_open
                    ? styles.registrationOpen
                    : styles.registrationClosed
                }
              >
                {event.registration.registration_open
                  ? 'Open'
                  : 'Closed'}
              </Text>
            </View>

            {userRole ===
              'junior_ranger' && (
              <Text
                style={
                  styles.registrationText
                }
              >
                {getRegistrationStatus()}
              </Text>
            )}
          </View>

          {userRole === 'junior_ranger' && (
            <>
              {event.registration.user_status === 'registered' ? (
                <Button
                  mode="outlined"
                  textColor="#A33A3A"
                  onPress={handleCancelRegistration}
                  loading={registrationLoading}
                  disabled={registrationLoading}
                  style={styles.cancelRegistrationButton}
                >
                  Cancel Registration
                </Button>
              ) : event.registration.registration_open ? (
                <Button
                  mode="contained"
                  textColor="#FFFFFF"
                  onPress={handleRegister}
                  loading={registrationLoading}
                  disabled={registrationLoading}
                  style={styles.registerButton}
                >
                  Register for Event
                </Button>
              ) : (
                <View style={styles.unavailableButton}>
                  <Text style={styles.unavailableButtonText}>
                    {getRegistrationButtonLabel()}
                  </Text>
                </View>
              )}
            </>
          )}

          {canManageEvents && (
            <Button
              mode="contained"
              buttonColor="#376e6e" 
              style={
                styles.manageButton
              }
              onPress={() =>
                navigation.navigate(
                  'EditEvent',
                  {
                    eventId:
                      event.id,
                    userRole,
                  },
                )
              }
            >
              Edit Event
            </Button>
          )}

          {canManageEvents && (
          <Button
            mode="contained"
            buttonColor="#326a87"
            textColor="#FFFFFF"
            style={[
              styles.manageButton,
              {marginTop: 12},
            ]}
            onPress={() =>
              navigation.navigate('AttendanceManagement', {
                eventId: event.id,
                userRole,
              })
            }
          >
            Manage Attendance
          </Button>
          )}

        </View>
      </ScrollView>

      <AppBottomTabBar
        role={userRole}
        activeTab="menu"
      />
    </View>
  );
}