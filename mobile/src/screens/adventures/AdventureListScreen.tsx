import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, ActivityIndicator } from 'react-native';
import { Card, Button, Chip } from 'react-native-paper';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

import { AuthStackParamList } from '../../navigation/AuthNavigator';
import {
    Adventure,
    getAllAdventures,
} from '../../services/adventures/adventureService';
import { adventureStyles as styles } from '../../styles/AdventureStyles';


type Props = NativeStackScreenProps<AuthStackParamList, 'AdventureList'>;

export default function AdventureListScreen({ navigation, route }: Props) {
    const userRole = route.params?.userRole || "junior_ranger";

    const [adventures, setAdventures] = useState<Adventure[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const canCreateAdventure = userRole === 'ranger' || userRole === 'admin';

    console.log('AdventureList route params:', route.params);
    // console.log('cohortId:', cohortId);
    console.log('userRole:', userRole);

    useEffect(() => {
        fetchAdventures();
    }, []);

    const fetchAdventures = async () => {
        // if (!cohortId) return;

        try {
            setLoading(true);
            setError('');

            const data = await getAllAdventures();
            setAdventures(data);
        } catch (err) {
            console.log('Get all adventures error:', err);
            setError('Unable to load adventures. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const renderAdventure = ({ item }: { item: Adventure }) => (
        <Card
            style={styles.card}
            mode="elevated"
            onPress={() =>
                navigation.navigate('AdventureDetails', {
                    adventureId: item.id,
                })
            }
        >
            <Card.Content>
                <Text style={styles.cardTitle}>{item.title}</Text>

                <Text style={styles.cardDescription} numberOfLines={2}>
                    {item.description}
                </Text>

                <View style={styles.metaRow}>
                    <Text style={styles.dueDate}>
                        Due:{' '}
                        {item.due_date
                            ? new Date(item.due_date).toDateString()
                            : 'No due date'}
                    </Text>

                    <Chip style={styles.statusChip} textStyle={styles.statusText}>
                        {item.status}
                    </Chip>
                </View>
            </Card.Content>
        </Card>
    );

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>
                    {canCreateAdventure ? 'Manage Adventures' : 'My Adventures'}
                </Text>
            </View>

            <View style={styles.content}>
                {canCreateAdventure && (
                    <Button
                        mode="contained"
                        style={styles.createButton}
                        labelStyle={styles.createButtonLabel}
                        onPress={() => navigation.navigate('CreateAdventure', undefined)}
                    >
                        + Create Adventure
                    </Button>
                )}

                {/* {!cohortId && (
                    <Text style={styles.errorText}>
                        No cohort selected yet. Please select a cohort before creating or
                        viewing adventures.
                    </Text>
                )} */}

                {loading && <ActivityIndicator size="large" style={styles.loader} />}

                {!!error && <Text style={styles.errorText}>{error}</Text>}

                {!loading && adventures.length === 0 && !error && (
                    <Text style={styles.emptyText}>No adventures available yet.</Text>
                )}

                <FlatList
                    data={adventures}
                    keyExtractor={(item) => item.id}
                    renderItem={renderAdventure}
                    contentContainerStyle={{ paddingBottom: 20 }}
                />
            </View>
        </View>
    );
}