import React, { useCallback, useState } from 'react';
import { ActivityIndicator, FlatList, RefreshControl, Text, TouchableOpacity, View } from 'react-native';
import { Button, Card, Chip } from 'react-native-paper';
import { useFocusEffect } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../../navigation/AuthNavigator';
import { EventItem, getEvents } from '../../services/events/eventService';
import { eventsHubStyles as styles } from '../../styles/EventsHubStyles';

type Props = NativeStackScreenProps<
  AuthStackParamList,
  'EventsHub'
>;

export default function EventsHubScreen({
  navigation,
  route,
}: Props) {
  const userRole =
    route.params?.userRole ?? 'junior_ranger';

  const [events, setEvents] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');

  const canManageEvents =
    userRole === 'admin' || userRole === 'ranger';

  const loadEvents = async (
    isRefresh = false,
  ) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      setError('');

      const data = await getEvents();

      setEvents(data);
    } catch (err) {
      console.log('Get events error:', err);

      setError(
        'Unable to load events. Please try again.',
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadEvents();
    }, []),
  );

  const formatDate = (value: string) => {
    return new Date(value).toLocaleDateString(
      'en-AU',
      {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      },
    );
  };

  const formatTime = (value: string) => {
    return new Date(value).toLocaleTimeString(
      'en-AU',
      {
        hour: '2-digit',
        minute: '2-digit',
      },
    );
  };

  const getStatusLabel = (
    status: EventItem['status'],
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

  const renderEvent = ({
    item,
  }: {
    item: EventItem;
  }) => {
    const cardContent = (
      <Card.Content>
        <View style={styles.cardHeader}>
          <Text style={styles.cardTitle}>
            {item.title}
          </Text>

          {canManageEvents && (
            <Chip compact>
              {getStatusLabel(item.status)}
            </Chip>
          )}
        </View>

        {!!item.description && (
          <Text
            style={styles.description}
            numberOfLines={3}
          >
            {item.description}
          </Text>
        )}

        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>
            Cohort:
          </Text>

          <Text style={styles.infoText}>
            {item.cohort_name ??
              'Not available'}
          </Text>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>
            Date:
          </Text>

          <Text style={styles.infoText}>
            {formatDate(item.start_time)}
          </Text>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>
            Time:
          </Text>

          <Text style={styles.infoText}>
            {formatTime(item.start_time)}
            {' - '}
            {formatTime(item.end_time)}
          </Text>
        </View>

        {!!item.location && (
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>
              Location:
            </Text>

            <Text style={styles.infoText}>
              {item.location}
            </Text>
          </View>
        )}

        {item.capacity !== null && (
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>
              Capacity:
            </Text>

            <Text style={styles.infoText}>
              {item.capacity}
            </Text>
          </View>
        )}

        {!!item.registration_deadline && (
          <View style={styles.deadlineContainer}>
            <Text style={styles.deadlineText}>
              Registration closes:{' '}
              {formatDate(
                item.registration_deadline,
              )}{' '}
              at{' '}
              {formatTime(
                item.registration_deadline,
              )}
            </Text>
          </View>
        )}

        {canManageEvents && (
          <Text style={styles.manageHint}>
            Tap to view event details
          </Text>
        )}
      </Card.Content>
    );

    return (
      <Card
        style={styles.card}
        mode="elevated"
        onPress={() =>
          navigation.navigate(
            'EventDetails',
            {
              eventId: item.id,
              userRole,
            },
          )
        }
      >
        {cardContent}
      </Card>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        {canManageEvents && (
          <Button
            mode="contained"
            icon="plus"
            style={styles.createButton}
            contentStyle={
              styles.createButtonContent
            }
            onPress={() =>
              navigation.navigate(
                'CreateEvent',
                {
                  userRole,
                },
              )
            }
          >
            Create a New Event
          </Button>
        )}

        {loading && (
          <ActivityIndicator
            size="large"
            style={styles.loader}
          />
        )}

        {!!error && (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>
              {error}
            </Text>

            <Button
              mode="outlined"
              onPress={() => loadEvents()}
            >
              Try Again
            </Button>
          </View>
        )}

        {!loading &&
          !error &&
          events.length === 0 && (
            <Text style={styles.emptyText}>
              No events available at the
              moment.
            </Text>
          )}

        {!loading && !error && (
          <FlatList
            data={events}
            keyExtractor={(item) => item.id}
            renderItem={renderEvent}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={
              styles.listContent
            }
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={() =>
                  loadEvents(true)
                }
              />
            }
          />
        )}
      </View>
    </View>
  );
}