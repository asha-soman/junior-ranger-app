import React, { useCallback, useState } from 'react';
import { ActivityIndicator, FlatList, Text, TextInput, View } from 'react-native';
import { Button } from 'react-native-paper';
import { useFocusEffect } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../../navigation/AuthNavigator';
import { AttendanceStatus, EventParticipant, getEventParticipants, updateEventAttendance } from '../../services/events/eventService';
import { attendanceManagementStyles as styles } from '../../styles/AttendanceManagementStyles';
import AppBottomTabBar from '../../components/navigation/AppBottomTabBar';
import { Ionicons } from '@expo/vector-icons';

type Props = NativeStackScreenProps<
  AuthStackParamList,
  'AttendanceManagement'
>;

export default function AttendanceManagementScreen({
  route,
}: Props) {
  const {
    eventId,
    userRole,
  } = route.params;

  const [participants, setParticipants] =
    useState<EventParticipant[]>([]);

  const [participantCount, setParticipantCount] =
    useState(0);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState('');

  const [savingId, setSavingId] =
    useState<string | null>(null);

  const [searchQuery, setSearchQuery] =
    useState('');

  const loadParticipants = async () => {
    try {
      setLoading(true);
      setError('');

      const data =
        await getEventParticipants(eventId);

      setParticipants(
        data.participants,
      );

      setParticipantCount(
        data.participant_count,
      );
    } catch (error: any) {
      setError(
        error?.response?.data?.message ||
          'Unable to load participants.',
      );
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
        loadParticipants();
    }, [eventId]),
    );

    // Attendance counts
    const presentCount = participants.filter(
    (participant) =>
        participant.attendance_status === 'present',
    ).length;

    const absentCount = participants.filter(
    (participant) =>
        participant.attendance_status === 'absent',
    ).length;

    const notMarkedCount = participants.filter(
    (participant) =>
        participant.attendance_status === 'not_marked',
    ).length;

    // Search participants by name
    const filteredParticipants =
    participants.filter((participant) => {
        const name =
        participant.junior_name?.toLowerCase() ?? '';

        return name.includes(
        searchQuery.trim().toLowerCase(),
        );
    });

    const handleStatusChange = async (
    participant: EventParticipant,
    status: AttendanceStatus,
  ) => {
    if (
      participant.attendance_status ===
      status
    ) {
      return;
    }

    try {
      setSavingId(
        participant.registration_id,
      );

      await updateEventAttendance(
        eventId,
        participant.registration_id,
        status,
      );

      setParticipants(
        (current) =>
          current.map((item) =>
            item.registration_id ===
            participant.registration_id
              ? {
                  ...item,
                  attendance_status:
                    status,
                  marked_at:
                    new Date().toISOString(),
                }
              : item,
          ),
      );
    } catch (error: any) {
      setError(
        error?.response?.data?.message ||
          'Unable to update attendance.',
      );
    } finally {
      setSavingId(null);
    }
  };

  const formatMarkedAt = (
    value: string | null,
  ) => {
    if (!value) {
      return null;
    }

    return new Date(
      value,
    ).toLocaleString(
      'en-AU',
      {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      },
    );
  };

  const renderParticipant = ({
    item,
  }: {
    item: EventParticipant;
  }) => {
    const saving =
      savingId ===
      item.registration_id;

    return (
      <View
        style={
          styles.participantCard
        }
      >
        <Text
          style={
            styles.participantName
          }
        >
          {item.junior_name ||
            'Junior Ranger'}
        </Text>

        <Text
          style={
            styles.participantEmail
          }
        >
          {item.junior_email}
        </Text>

        <Text
          style={styles.statusLabel}
        >
          Attendance Status
        </Text>

        <View
          style={styles.statusRow}
        >
          <Button
            mode="contained"
            disabled={saving}
            buttonColor={
                item.attendance_status === 'not_marked'
                ? '#6B7280'
                : '#EEF0F2'
            }
            textColor={
                item.attendance_status === 'not_marked'
                ? '#FFFFFF'
                : '#6B7280'
            }
            style={styles.statusButton}
            onPress={() =>
                handleStatusChange(
                item,
                'not_marked',
                )
            }
            >
            Not Marked
          </Button>

          <Button
            mode="contained"
            disabled={saving}
            buttonColor={
                item.attendance_status === 'present'
                ? '#3f7d7b'
                : '#EDF6F2'
            }
            textColor={
                item.attendance_status === 'present'
                ? '#FFFFFF'
                : '#659587'
            }
            style={styles.statusButton}
            onPress={() =>
                handleStatusChange(
                item,
                'present',
                )
            }
            >
            Present
          </Button>

          <Button
            mode="contained"
            disabled={saving}
            buttonColor={
                item.attendance_status === 'absent'
                ? '#B85450'
                : '#FBEFEE'
            }
            textColor={
                item.attendance_status === 'absent'
                ? '#FFFFFF'
                : '#C47A76'
            }
            style={styles.statusButton}
            onPress={() =>
                handleStatusChange(
                item,
                'absent',
                )
            }
            >
            Absent
         </Button>
        </View>

        {saving && (
          <ActivityIndicator
            size="small"
            style={{ marginTop: 10 }}
          />
        )}

        {!!item.marked_at &&
          !saving && (
            <Text
              style={
                styles.markedText
              }
            >
              Last updated:{' '}
              {formatMarkedAt(
                item.marked_at,
              )}
            </Text>
          )}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={{ flex: 1 }}>
        <FlatList
          data={filteredParticipants}
          keyExtractor={(item) =>
            item.registration_id
          }
          renderItem={renderParticipant}
          contentContainerStyle={
            styles.content
          }
          ListHeaderComponent={
            <>
            <View style={styles.summaryCard}>
                <Text style={styles.summaryTitle}>
                    Event Attendance
                </Text>

                <View style={styles.summaryRow}>
                    <Text style={styles.summaryLabel}>
                    Registered participants:
                    </Text>

                    <Text style={styles.summaryValue}>
                    {participantCount}
                    </Text>
                </View>

                <View style={styles.summaryRow}>
                    <Text style={styles.summaryLabel}>
                    Present:
                    </Text>

                    <Text style={styles.summaryValue}>
                    {presentCount}
                    </Text>
                </View>

                <View style={styles.summaryRow}>
                    <Text style={styles.summaryLabel}>
                    Absent:
                    </Text>

                    <Text style={styles.summaryValue}>
                    {absentCount}
                    </Text>
                </View>

                <View style={styles.summaryRow}>
                    <Text style={styles.summaryLabel}>
                    Not Marked:
                    </Text>

                    <Text style={styles.summaryValue}>
                    {notMarkedCount}
                    </Text>
                </View>
            </View>

            <View style={styles.searchContainer}>
                <Ionicons
                    name="search-outline"
                    size={22}
                    color="#667085"
                    style={styles.searchIcon}
                />

                <TextInput
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                    placeholder="Search by name"
                    placeholderTextColor="#8A8A8A"
                    style={styles.searchInput}
                />
            </View>

              {!!error && (
                <View
                  style={ styles.errorContainer}
                >
                  <Text style={ styles.errorText }>
                    {error}
                  </Text>

                  <Button
                    mode="outlined"
                    onPress={ loadParticipants }
                  >
                    Try Again
                  </Button>
                </View>
              )}
            </>
          }
          ListEmptyComponent={
            loading ? (
              <ActivityIndicator
                size="large"
                style={styles.loader}
              />
            ) : !error ? (
              <Text style={styles.emptyText}>
                {searchQuery.trim()
                  ? 'No participants match your search'
                  : 'No registered participants for this event'}
              </Text>
            ) : null
          }
        />
      </View>

      <AppBottomTabBar
        role={userRole}
        activeTab="menu"
      />
    </View>
  );
}