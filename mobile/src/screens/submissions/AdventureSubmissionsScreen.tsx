import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, FlatList } from 'react-native';
import { Button, Chip, Card } from 'react-native-paper';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

import { AuthStackParamList } from '../../navigation/AuthNavigator';
import {
    AdventureSubmission,
    getSubmissionsForAdventure,
} from '../../services/submissions/submissionService';
import { adventureStyles as styles } from '../../styles/AdventureStyles';

type Props = NativeStackScreenProps<AuthStackParamList, 'AdventureSubmissions'>;

export default function AdventureSubmissionsScreen({ navigation, route }: Props) {
    const { adventureId } = route.params;

    const [submissions, setSubmissions] = useState<AdventureSubmission[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchSubmissions();
    }, [adventureId]);

    const fetchSubmissions = async () => {
        try {
            setLoading(true);
            setError('');

            const data = await getSubmissionsForAdventure(adventureId);
            setSubmissions(data);
        } catch (err) {
            console.log('Fetch submissions error:', err);
            setError('Unable to load submissions.');
        } finally {
            setLoading(false);
        }
    };

    const renderSubmission = ({ item }: { item: AdventureSubmission }) => (
        <Card style={styles.submissionListCard} mode="elevated">
            <Card.Content>
                <Text style={styles.submissionUser}>
                    {item.junior_ranger_name || 'Junior Ranger'}
                </Text>

                <Text style={styles.submissionText}>{item.submission_text}</Text>

                {item.image_url ? (
                    <Text style={styles.imageUrlText}>Image URL: {item.image_url}</Text>
                ) : null}

                <Chip style={styles.statusChip} textStyle={styles.statusText}>
                    {item.status}
                </Chip>

                {item.feedback ? (
                    <>
                        <Text style={styles.detailsLabel}>Feedback</Text>
                        <Text style={styles.detailsText}>{item.feedback}</Text>
                    </>
                ) : null}

                <Button
                    mode="contained"
                    style={styles.reviewButton}
                    onPress={() =>
                        navigation.navigate('ReviewSubmission', {
                            submissionId: item.id,
                        })
                    }
                >
                    Review Submission
                </Button>
            </Card.Content>
        </Card>
    );

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Adventure Submissions</Text>
            </View>

            <View style={styles.content}>
                {loading && <ActivityIndicator size="large" style={styles.loader} />}

                {!!error && <Text style={styles.errorText}>{error}</Text>}

                {!loading && submissions.length === 0 && !error && (
                    <Text style={styles.emptyText}>No submissions yet.</Text>
                )}

                <FlatList
                    data={submissions}
                    keyExtractor={(item) => item.id}
                    renderItem={renderSubmission}
                    contentContainerStyle={{ paddingBottom: 20 }}
                />
            </View>
        </View>
    );
}