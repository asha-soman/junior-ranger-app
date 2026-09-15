import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, FlatList } from 'react-native';
import { Button, Chip, Card } from 'react-native-paper';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

import { AuthStackParamList } from '../../navigation/AuthNavigator';
import {
    AdventureSubmission,
    getSubmissionsForAdventurePaginated,
} from '../../services/submissions/submissionService';
import { adventureStyles as styles } from '../../styles/AdventureStyles';

type Props = NativeStackScreenProps<AuthStackParamList, 'AdventureSubmissions'>;

export default function AdventureSubmissionsScreen({ navigation, route }: Props) {
    const { adventureId } = route.params;

    const [submissions, setSubmissions] = useState<AdventureSubmission[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalSubmissions, setTotalSubmissions] = useState(0);

    const SUBMISSIONS_PER_PAGE = 6;

    useEffect(() => {
        fetchSubmissions();
    }, [adventureId]);

    const fetchSubmissions = async (page = 1) => {
    try {
        setLoading(true);
        setError('');

        const response = await getSubmissionsForAdventurePaginated(
            adventureId,
            page,
            SUBMISSIONS_PER_PAGE
        );

        setSubmissions(response.data);
        setCurrentPage(response.pagination.page);
        setTotalPages(response.pagination.totalPages);
        setTotalSubmissions(response.pagination.total);
    } catch (err) {
        console.log('Fetch submissions error:', err);
        setError('Unable to load submissions.');
    }

finally {
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
    ListFooterComponent={
        <View
            style={{
                paddingVertical: 20,
                alignItems: 'center',
            }}
        >
            <Text style={{ marginBottom: 10 }}>
                {totalSubmissions} submissions found
            </Text>

            <View
                style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: 10,
                }}
            >
                <Button
                    mode="outlined"
                    disabled={currentPage === 1 || loading}
                    onPress={() => fetchSubmissions(currentPage - 1)}
                >
                    Previous
                </Button>

                <Text>
                    {currentPage} / {totalPages}
                </Text>

                <Button
                    mode="contained"
                    disabled={currentPage === totalPages || loading}
                    onPress={() => fetchSubmissions(currentPage + 1)}
                >
                    Next
                </Button>
            </View>
        </View>
    }
/>
            </View>
        </View>
    );
}