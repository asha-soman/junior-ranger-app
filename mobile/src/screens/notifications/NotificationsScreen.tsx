import React, { useCallback, useState } from 'react';
import { ActivityIndicator, Alert, Pressable, RefreshControl, ScrollView, View } from 'react-native';
import { Card, Text } from 'react-native-paper';
import { useFocusEffect } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AppNotification, getMyNotifications, markAllNotificationsAsRead, markNotificationAsRead } from '@/src/services/notifications/notificationService';
import { AuthStackParamList } from '@/src/navigation/AuthNavigator';
import AppBottomTabBar from '@/src/components/navigation/AppBottomTabBar';
import { getEventDetails } from '@/src/services/events/eventService';
import NotificationsStyles from '@/src/styles/NotificationsStyles';

type Props = NativeStackScreenProps<
  AuthStackParamList,
  'Notifications'
>;

type NotificationFilter =
  | 'all'
  | 'unread'
  | 'read';

type NotificationGroup = {
  label: string;
  dateKey: string;
  notifications: AppNotification[];
};

export default function NotificationsScreen({
  route,
  navigation,
}: Props) {
  const { userRole } = route.params;

  const [notifications, setNotifications] =
    useState<AppNotification[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [refreshing, setRefreshing] =
    useState(false);

  const [filter, setFilter] =
    useState<NotificationFilter>('all');

  const loadNotifications = async () => {
    try {
      const data = await getMyNotifications();

      setNotifications(data);
    } catch (error) {
      console.error(
        'Failed to load notifications:',
        error,
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadNotifications();
    }, []),
  );

  const handleRefresh = async () => {
    setRefreshing(true);

    await loadNotifications();
  };

  const handleMarkAsRead = async (
    notification: AppNotification,
  ) => {
    if (notification.is_read) {
      return;
    }

    try {
      const updatedNotification =
        await markNotificationAsRead(
          notification.id,
        );

      setNotifications((current) =>
        current.map((item) =>
          item.id === updatedNotification.id
            ? updatedNotification
            : item,
        ),
      );
    } catch (error) {
      console.error(
        'Failed to mark notification as read:',
        error,
      );
    }
  };

  const handleMarkAllAsRead = async () => {
    const hasUnread = notifications.some(
      (notification) =>
        !notification.is_read,
    );

    if (!hasUnread) {
      return;
    }

    try {
      await markAllNotificationsAsRead();

      setNotifications((current) =>
        current.map((notification) => ({
          ...notification,
          is_read: true,
        })),
      );
    } catch (error) {
      console.error(
        'Failed to mark all notifications as read:',
        error,
      );
    }
  };

  const handleNotificationPress = async (
    notification: AppNotification,
  ) => {
    try {

        if (notification.type === 'event_cancelled') {
          return;
        }

        if (!notification.is_read) {
          const updatedNotification =
            await markNotificationAsRead(
              notification.id,
            );

        setNotifications((current) =>
          current.map((item) =>
            item.id === updatedNotification.id
             ? updatedNotification
             : item,
            ),
          );
        }

        if (!notification.event_id) {
          return;
        }

        try {
            await getEventDetails(
                notification.event_id,
            );
        } catch (error: any) {
          const status =
                error?.response?.status;

          const message =
                error?.response?.data?.message;

            if (
                status === 400 &&
                message ===
                'This event has been cancelled'
            ) {
                Alert.alert(
                'Event cancelled',
                'This event is no longer available.',
                );

                return;
            }

          throw error;
        }
            
          navigation.navigate('EventDetails', {
            eventId: notification.event_id,
            userRole,
          });
      } catch (error) {
        console.error(
          'Failed to open notification:',
        error,
        );

        Alert.alert(
            'Unable to open event',
            'The event information could not be loaded. Please try again.',
        );
      }
    };

  const getDateKey = (date: Date) => {
    return [
      date.getFullYear(),
      date.getMonth(),
      date.getDate(),
    ].join('-');
  };

  const getDateLabel = (date: Date) => {
    const today = new Date();

    const yesterday = new Date();
    yesterday.setDate(
      today.getDate() - 1,
    );

    if (
      getDateKey(date) ===
      getDateKey(today)
    ) {
      return 'Today';
    }

    if (
      getDateKey(date) ===
      getDateKey(yesterday)
    ) {
      return 'Yesterday';
    }

    return date.toLocaleDateString(
      undefined,
      {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      },
    );
  };

  const formatTime = (
    dateString: string,
  ) => {
    return new Date(
      dateString,
    ).toLocaleTimeString(undefined, {
      hour: 'numeric',
      minute: '2-digit',
    });
  };

  const filteredNotifications =
    notifications.filter(
      (notification) => {
        if (filter === 'unread') {
          return !notification.is_read;
        }

        if (filter === 'read') {
          return notification.is_read;
        }

        return true;
      },
    );

  const groupNotifications = (
    items: AppNotification[],
  ): NotificationGroup[] => {
    const groups: NotificationGroup[] =
      [];

    items.forEach((notification) => {
      const date = new Date(
        notification.created_at,
      );

      const dateKey = getDateKey(date);

      let group = groups.find(
        (item) =>
          item.dateKey === dateKey,
      );

      if (!group) {
        group = {
          dateKey,
          label: getDateLabel(date),
          notifications: [],
        };

        groups.push(group);
      }

      group.notifications.push(
        notification,
      );
    });

    return groups;
  };

  const groupedNotifications =
    groupNotifications(
      filteredNotifications,
    );

  const hasUnreadNotifications =
    notifications.some(
      (notification) =>
        !notification.is_read,
    );

  if (loading) {
    return (
      <View
        style={
          NotificationsStyles.screen
        }
      >
        <View
          style={
            NotificationsStyles.center
          }
        >
          <ActivityIndicator
            size="large"
          />
        </View>

        <AppBottomTabBar
          role={userRole}
          activeTab="notifications"
        />
      </View>
    );
  }

  const unreadCount = notifications.filter(
    (notification) => !notification.is_read
  ).length;

  return (
    <View
      style={NotificationsStyles.screen}
    >
      <ScrollView
        style={
          NotificationsStyles.container
        }
        contentContainerStyle={
          NotificationsStyles.content
        }
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
          />
        }
      >
        {/* FILTERS */}
        <View
          style={
            NotificationsStyles.filterRow
          }
        >
          {(
            [
              ['all', 'All'],
              ['read', 'Read'],
              ['unread', 'Unread'],
            ] as const
          ).map(([value, label]) => {
            const active =
              filter === value;

            return (
              <Pressable
                key={value}
                onPress={() =>
                  setFilter(value)
                }
                style={[
                  NotificationsStyles.filterButton,
                  active &&
                    NotificationsStyles.filterButtonActive,
                ]}
              >
                <Text
                  style={[
                    NotificationsStyles.filterText,
                    active &&
                      NotificationsStyles.filterTextActive,
                  ]}
                >
                  {label}
                </Text>
              </Pressable>
            );
          })}
        </View>

        {filter === 'unread' && (
        <View
            style={NotificationsStyles.actionsRow}
        >
            <Pressable
            disabled={!hasUnreadNotifications}
            onPress={handleMarkAllAsRead}
            style={[
                NotificationsStyles.markAllButton,
                !hasUnreadNotifications &&
                NotificationsStyles.markAllButtonDisabled,
            ]}
            >
            <Text
                style={
                NotificationsStyles.markAllButtonText
                }
            >
                Mark all as read
            </Text>
            </Pressable>
        </View>
        )}

        {/* EMPTY FILTER / EMPTY LIST */}
        {filteredNotifications.length ===
        0 ? (
          <View
            style={
              NotificationsStyles.emptyContent
            }
          >
            <Text
              style={
                NotificationsStyles.emptyTitle
              }
            >
              {filter === 'unread'
                ? 'No unread notifications'
                : filter === 'read'
                  ? 'No read notifications'
                  : 'No notifications yet'}
            </Text>

            <Text
              style={
                NotificationsStyles.emptyText
              }
            >
              {filter === 'all'
                ? 'Your notifications will appear here.'
                : 'There are no notifications in this category.'}
            </Text>
          </View>
        ) : (
          groupedNotifications.map(
            (group) => (
              <View
                key={group.dateKey}
                style={
                  NotificationsStyles.dateSection
                }
              >
                <Text
                  style={
                    NotificationsStyles.dateHeading
                  }
                >
                  {group.label}
                </Text>

                {group.notifications.map(
                  (notification) => (
                      <Card
                        key={notification.id}
                        mode="elevated"
                        style={[
                            NotificationsStyles.card,
                            !notification.is_read &&
                            NotificationsStyles.unreadCard,
                        ]}
                        onPress={
                          notification.type === 'event_cancelled'
                            ? undefined
                            : () =>
                                handleNotificationPress(notification)
                        }
                      >
                      <Card.Content
                        style={
                          NotificationsStyles.cardContent
                        }
                      >
                        {/* TITLE + TIME */}
                        <View
                          style={
                            NotificationsStyles.titleRow
                          }
                        >
                          <View
                            style={
                              NotificationsStyles.titleContainer
                            }
                          >
                            {!notification.is_read && (
                              <View/>
                            )}

                            <Text style={NotificationsStyles.title}>
                            {notification.title}
                            </Text>
                          </View>

                          <Text
                            style={
                              NotificationsStyles.time
                            }
                          >
                            {formatTime(
                              notification.created_at,
                            )}
                          </Text>
                        </View>

                        {/* MESSAGE */}
                        <Text
                          style={
                            NotificationsStyles.message
                          }
                        >
                          {
                            notification.message
                          }
                        </Text>

                        {/* MARK AS READ BADGE */}
                        {!notification.is_read && (
                          <View
                            style={
                              NotificationsStyles.cardActions
                            }
                          >
                            <Pressable
                                onPress={(event) => {
                                    event.stopPropagation();

                                    handleMarkAsRead(notification);
                                }}
                                style={
                                    NotificationsStyles.markReadBadge
                                }
                                >
                                <Text
                                    style={
                                    NotificationsStyles.markReadBadgeText
                                    }
                                >
                                    Mark as read
                                </Text>
                            </Pressable>
                          </View>
                        )}
                      </Card.Content>
                    </Card>
                  ),
                )}
              </View>
            ),
          )
        )}
      </ScrollView>

      <AppBottomTabBar
        role={userRole}
        activeTab="notifications"
        unreadCountOverride={unreadCount}
      />
    </View>
  );
}