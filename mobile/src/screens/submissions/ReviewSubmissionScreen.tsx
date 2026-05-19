import React, { useState } from 'react';
import {
    View,
    Text,
    Alert,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    TouchableWithoutFeedback,
    Keyboard,
} from 'react-native';
import { Button, TextInput } from 'react-native-paper';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

import { AuthStackParamList } from '../../navigation/AuthNavigator';
import {
    reviewSubmission,
    SubmissionStatus,
} from '../../services/submissions/submissionService';
import { adventureStyles as styles } from '../../styles/AdventureStyles';

type Props = NativeStackScreenProps<AuthStackParamList, 'ReviewSubmission'>;

export default function ReviewSubmissionScreen({ navigation, route }: Props) {
    const { submissionId } = route.params;

    const [status, setStatus] = useState<SubmissionStatus>('approved');
    const [feedback, setFeedback] = useState('');
    const [loading, setLoading] = useState(false);

    const handleReview = async () => {
        try {
            setLoading(true);

            await reviewSubmission(submissionId, {
                status: status as 'approved' | 'rejected',
                feedback: feedback.trim() || undefined,
            });

            Alert.alert('Success', 'Submission reviewed successfully.');
            navigation.goBack();
        } catch (error: any) {
            const message =
                error?.response?.data?.message ||
                error?.message ||
                'Unable to review submission.';

            Alert.alert('Review Failed', message);
        } finally {
            setLoading(false);
        }
    };

    const formContent = (
        <ScrollView
            contentContainerStyle={styles.content}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
        >
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Review Submission</Text>
            </View>

            <View style={styles.reviewCard}>
                <Text style={styles.detailsLabel}>Choose Review Status</Text>

                <View style={styles.statusButtonRow}>
                    <Button
                        mode={status === 'approved' ? 'contained' : 'outlined'}
                        style={styles.approveButton}
                        onPress={() => setStatus('approved')}
                    >
                        Approve
                    </Button>

                    <Button
                        mode={status === 'rejected' ? 'contained' : 'outlined'}
                        style={styles.rejectButton}
                        onPress={() => setStatus('rejected')}
                    >
                        Reject
                    </Button>
                </View>

                <Text style={styles.selectedStatusText}>
                    Selected: {status.toUpperCase()}
                </Text>

                <TextInput
                    label="Feedback"
                    mode="outlined"
                    value={feedback}
                    onChangeText={setFeedback}
                    multiline
                    style={[styles.input, styles.textArea]}
                />

                <Button
                    mode="contained"
                    onPress={handleReview}
                    loading={loading}
                    disabled={loading}
                    style={styles.submitButton}
                >
                    Submit Review
                </Button>

                <Button
                    mode="text"
                    onPress={() => navigation.goBack()}
                    style={styles.cancelButton}
                >
                    Cancel
                </Button>
            </View>
        </ScrollView>
    );

    return (
        <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={
                Platform.OS === 'ios'
                    ? 'padding'
                    : Platform.OS === 'android'
                        ? 'height'
                        : undefined
            }
        >
            {Platform.OS === 'web' ? (
                formContent
            ) : (
                <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                    {formContent}
                </TouchableWithoutFeedback>
            )}
        </KeyboardAvoidingView>
    );
}