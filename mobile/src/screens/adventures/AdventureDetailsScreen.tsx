import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, ScrollView } from 'react-native';
import { Button, Chip } from 'react-native-paper';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

import { AuthStackParamList } from '../../navigation/AuthNavigator';
import {
    Adventure,
    getAdventureById,
} from '../../services/adventures/adventureService';
import {
    AdventureSubmission,
    getMySubmission,
} from '../../services/submissions/submissionService';
import apiClient from '../../services/api/client';
import { adventureStyles as styles } from '../../styles/AdventureStyles';

type Props = NativeStackScreenProps<AuthStackParamList, 'AdventureDetails'>;

type UserRole = 'admin' | 'ranger' | 'junior_ranger';

export default function AdventureDetailsScreen({ navigation, route }: Props) {
    const { adventureId } = route.params;

    const [adventure, setAdventure] = useState<Adventure | null>(null);
    const [mySubmission, setMySubmission] = useState<AdventureSubmission | null>(
        null
    );
    const [userRole, setUserRole] = useState<UserRole | null>(null);
    const [loading, setLoading] = useState(false);
    const [submissionLoading, setSubmissionLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchAdventureDetails();
        fetchProfile();
    }, [adventureId]);

    useEffect(() => {
        if (userRole === 'junior_ranger') {
            fetchMySubmission();
        }
    }, [userRole, adventureId]);

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

    const fetchMySubmission = async () => {
        try {
            setSubmissionLoading(true);
            const submission = await getMySubmission(adventureId);
            setMySubmission(submission);
        } catch (err) {
            console.log('Fetch my submission error:', err);
        } finally {
            setSubmissionLoading(false);
        }
    };

    const canEditAdventure = userRole === 'ranger' || userRole === 'admin';
    const canViewSubmissions = userRole === 'ranger';
    const canSubmit = userRole === 'junior_ranger';

    const getSubmissionMessage = () => {
        if (!mySubmission) {
            return 'You have not submitted this adventure yet.';
        }

        if (mySubmission.status === 'submitted') {
            return 'Your submission has been submitted and is waiting for Ranger review.';
        }

        if (mySubmission.status === 'approved') {
            return 'Your submission has been approved. Great work!';
        }

        if (mySubmission.status === 'rejected') {
            return 'Your submission needs changes. Please check the feedback and update your submission.';
        }

        return '';
    };

    const getSubmitButtonLabel = () => {
        if (!mySubmission) return 'Submit Adventure';

        if (mySubmission.status === 'approved') return 'Submission Approved';

        return 'Update Submission';
    };

    const isSubmitButtonDisabled = mySubmission?.status === 'approved';

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
                    <View style={styles.submissionStatusCard}>
                        <Text style={styles.detailsLabel}>My Submission Status</Text>

                        {submissionLoading ? (
                            <ActivityIndicator size="small" />
                        ) : (
                            <>
                                <Chip style={styles.statusChip} textStyle={styles.statusText}>
                                    {mySubmission?.status || 'not submitted'}
                                </Chip>

                                <Text style={styles.statusMessage}>
                                    {getSubmissionMessage()}
                                </Text>

                                {mySubmission?.feedback ? (
                                    <View style={styles.feedbackBox}>
                                        <Text style={styles.detailsLabel}>Ranger Feedback</Text>
                                        <Text style={styles.detailsText}>
                                            {mySubmission.feedback}
                                        </Text>
                                    </View>
                                ) : null}

                                <Button
                                    mode="contained"
                                    style={styles.editButton}
                                    disabled={isSubmitButtonDisabled}
                                    onPress={() =>
                                        navigation.navigate('SubmitAdventure', {
                                            adventureId: adventure.id,
                                        })
                                    }
                                >
                                    {getSubmitButtonLabel()}
                                </Button>
                            </>
                        )}
                    </View>
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