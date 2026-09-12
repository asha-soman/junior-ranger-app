import React, {
  useEffect,
  useState,
} from 'react';

import {
  ActivityIndicator,
  FlatList,
  Text,
  View,
} from 'react-native';

import {
  Button,
  Card,
  Chip,
} from 'react-native-paper';

import { Ionicons } from '@expo/vector-icons';

import {
  NativeStackScreenProps,
} from '@react-navigation/native-stack';

import {
  AuthStackParamList,
} from '../../navigation/AuthNavigator';

import {
  Adventure,
  getAllAdventures,
} from '../../services/adventures/adventureService';

import {
  adventureStyles as styles,
} from '../../styles/AdventureStyles';

type Props = NativeStackScreenProps<
  AuthStackParamList,
  'AdventureList'
>;

export default function AdventureListScreen({
  navigation,
  route,
}: Props) {
  const userRole =
    route.params?.userRole ||
    'junior_ranger';

  const [
    adventures,
    setAdventures,
  ] = useState<Adventure[]>([]);

  const [
    loading,
    setLoading,
  ] = useState(false);

  const [
    error,
    setError,
  ] = useState('');

  const canCreateAdventure =
    userRole === 'ranger' ||
    userRole === 'admin';

  useEffect(() => {
    fetchAdventures();
  }, []);

  const fetchAdventures =
    async () => {
      try {
        setLoading(true);
        setError('');

        const data =
          await getAllAdventures();

        setAdventures(data);
      } catch (err) {
        console.log(
          'Get all adventures error:',
          err,
        );

        setError(
          'Unable to load adventures. Please try again.',
        );
      } finally {
        setLoading(false);
      }
    };

  const formatDueDate = (
    date?: string | null,
  ) => {
    if (!date) {
      return 'No due date';
    }

    return new Date(
      date,
    ).toLocaleDateString(
      'en-AU',
      {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      },
    );
  };

  const renderAdventure = ({
    item,
    index,
  }: {
    item: Adventure;
    index: number;
  }) => (
    <Card
      style={[
        styles.adventureListCard,
        !canCreateAdventure &&
          styles.juniorAdventureListCard,
      ]}
      mode="contained"
      onPress={() =>
        navigation.navigate(
          'AdventureDetails',
          {
            adventureId: item.id,
          },
        )
      }
    >
      <Card.Content>
        <View
          style={
            styles.adventureListCardTopRow
          }
        >
          <View
            style={
              styles.adventureListIcon
            }
          >
            <Ionicons
              name={
                canCreateAdventure
                  ? 'map-outline'
                  : index % 3 === 0
                    ? 'compass'
                    : index % 3 === 1
                      ? 'leaf'
                      : 'earth'
              }
              size={24}
              color="#FFFFFF"
            />
          </View>

          <View
            style={
              styles.adventureListCardTitleWrap
            }
          >
            <Text
              style={
                styles.adventureListCardTitle
              }
              numberOfLines={2}
            >
              {item.title}
            </Text>

            {!canCreateAdventure && (
              <Text
                style={
                  styles.adventureListEyebrow
                }
              >
                READY TO EXPLORE
              </Text>
            )}
          </View>

          <View
            style={
              styles.adventureListArrow
            }
          >
            <Ionicons
              name="chevron-forward"
              size={22}
              color="#3D786B"
            />
          </View>
        </View>

        <Text
          style={
            styles.adventureListDescription
          }
          numberOfLines={2}
        >
          {item.description}
        </Text>

        <View
          style={
            styles.adventureListDivider
          }
        />

        <View
          style={
            styles.adventureListMetaRow
          }
        >
          <View
            style={
              styles.adventureListDateWrap
            }
          >
            <View
              style={
                styles.adventureListMetaIcon
              }
            >
              <Ionicons
                name="calendar-outline"
                size={15}
                color="#39776C"
              />
            </View>

            <View>
              <Text
                style={
                  styles.adventureListMetaLabel
                }
              >
                Due
              </Text>

              <Text
                style={
                  styles.adventureListDate
                }
              >
                {formatDueDate(
                  item.due_date,
                )}
              </Text>
            </View>
          </View>

          <Chip
            style={
              styles.adventureListStatusChip
            }
            textStyle={
              styles.adventureListStatusText
            }
          >
            {item.status}
          </Chip>
        </View>
      </Card.Content>
    </Card>
  );

  return (
    <View
      style={styles.container}
    >
      <FlatList
        data={adventures}
        keyExtractor={(item) =>
          item.id
        }
        renderItem={
          renderAdventure
        }
        showsVerticalScrollIndicator={
          false
        }
        contentContainerStyle={
          styles.adventureListContent
        }
        ListHeaderComponent={
          <>
            {loading && (
              <ActivityIndicator
                size="large"
                style={styles.loader}
              />
            )}

            {!!error && (
              <Text
                style={
                  styles.errorText
                }
              >
                {error}
              </Text>
            )}

            {!loading &&
              adventures.length === 0 &&
              !error && (
                <View
                  style={
                    styles.adventureListEmptyCard
                  }
                >
                  <Ionicons
                    name="map-outline"
                    size={42}
                    color="#6B8D85"
                  />

                  <Text
                    style={
                      styles.adventureListEmptyTitle
                    }
                  >
                    No adventures yet
                  </Text>

                  <Text
                    style={
                      styles.adventureListEmptyText
                    }
                  >
                    {canCreateAdventure
                      ? 'Create your first adventure to get started.'
                      : 'Your Ranger will add adventures for you soon.'}
                  </Text>
                </View>
              )}

            {!loading &&
              adventures.length > 0 && (
                <View
                  style={
                    styles.adventureListSectionHeader
                  }
                >
                  <View>
                    <Text
                      style={
                        styles.adventureListSectionEyebrow
                      }
                    >
                      {canCreateAdventure
                        ? 'ALL ADVENTURES'
                        : 'YOUR JOURNEY'}
                    </Text>

                    <Text
                      style={
                        styles.adventureListSectionTitle
                      }
                    >
                      {canCreateAdventure
                        ? 'Adventure Library'
                        : 'Choose an Adventure'}
                    </Text>
                  </View>

                  <View
                    style={
                      styles.adventureListCountBadge
                    }
                  >
                    <Text
                      style={
                        styles.adventureListCountText
                      }
                    >
                      {
                        adventures.length
                      }
                    </Text>
                  </View>
                </View>
              )}

            {canCreateAdventure && (
              <Button
                mode="contained"
                icon="plus"
                style={
                  styles.adventureListCreateButton
                }
                contentStyle={{
                  minHeight: 48,
                }}
                labelStyle={{
                  fontWeight: '800',
                }}
                onPress={() =>
                  navigation.navigate(
                    'CreateAdventure',
                    undefined,
                  )
                }
              >
                Create Adventure
              </Button>
            )}
          </>
        }
      />
    </View>
  );
}
