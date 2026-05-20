import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, ScrollView } from 'react-native';
import { Button, Chip } from 'react-native-paper';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

import { AuthStackParamList } from '../../navigation/AuthNavigator';
import {
    Adventure,
    getAdventureById,
} from '../../services/adventures/adventureService';
import apiClient from '../../services/api/client';
import { adventureStyles as styles } from '../../styles/AdventureStyles';

type Props = NativeStackScreenProps<AuthStackParamList, 'AdventureDetails'>;

type UserRole = 'admin' | 'ranger' | 'junior_ranger';

export default function AdventureDetailsScreen({ navigation, route }: Props) {
    const { adventureId } = route.params;

    const [adventure, setAdventure] = useState<Adventure | null>(null);
    const [userRole, setUserRole] = useState<UserRole | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchAdventureDetails();
        fetchProfile();
    }, [adventureId]);

    const fetchAdventureDetails = async () => {
        try {
            setLoading(true);
            setError('');

            const data = await getAdventureById(adventureId);
            setAdventure(data);
        } catch (err) {
            console.log('Fetch adventure details error:', err);
            setError('Unable to load adventure details.');
        } finally {
            setLoading(false);
        }
    };

    const fetchProfile = async () => {
        try {
            const response = await apiClient.get('/auth/profile');
            setUserRole(response.data.role);
        } catch (err) {
            console.log('Fetch profile error:', err);
        }
    };

    const canEditAdventure = userRole === 'ranger' || userRole === 'admin';
    const canViewSubmissions = userRole === 'ranger';
    const canSubmit = userRole === 'junior_ranger';

    if (loading) {
        return (
            <View style={styles.container}>
                <ActivityIndicator size="large" style={styles.loader} />
            </View>
        );
    }

    if (error || !adventure) {
        return (
            <View style={styles.container}>
                <Text style={styles.errorText}>
                    {error || 'Adventure details not found.'}
                </Text>
            </View>
        );
    }

    return (
        <ScrollView
            style={styles.container}
            contentContainerStyle={styles.content}
            showsVerticalScrollIndicator={false}
        >
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Adventure Details</Text>
            </View>

            <View style={styles.detailsCard}>
                <Text style={styles.detailsTitle}>{adventure.title}</Text>

                <Chip style={styles.statusChip} textStyle={styles.statusText}>
                    {adventure.status}
                </Chip>

                <Text style={styles.detailsLabel}>Description</Text>
                <Text style={styles.detailsText}>{adventure.description}</Text>

                <Text style={styles.detailsLabel}>Task Instructions</Text>
                <Text style={styles.detailsText}>{adventure.task_instructions}</Text>

                <Text style={styles.detailsLabel}>Due Date</Text>
                <Text style={styles.detailsText}>
                    {adventure.due_date
                        ? new Date(adventure.due_date).toDateString()
                        : 'No due date'}
                </Text>

                {canSubmit && (
                    <Button
                        mode="contained"
                        style={styles.editButton}
                        onPress={() =>
                            navigation.navigate('SubmitAdventure', {
                                adventureId: adventure.id,
                            })
                        }
                    >
                        Submit Adventure
                    </Button>
                )}

                {canViewSubmissions && (
                    <Button
                        mode="contained"
                        style={styles.editButton}
                        onPress={() =>
                            navigation.navigate('AdventureSubmissions', {
                                adventureId: adventure.id,
                            })
                        }
                    >
                        View Submissions
                    </Button>
                )}

                {canEditAdventure && (
                    <Button
                        mode="outlined"
                        style={styles.cancelButton}
                        onPress={() =>
                            navigation.navigate('EditAdventure', {
                                adventureId: adventure.id,
                            })
                        }
                    >
                        Edit Adventure
                    </Button>
                )}
            </View>
        </ScrollView>
    );
}