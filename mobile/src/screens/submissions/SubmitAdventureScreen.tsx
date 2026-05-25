import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    TouchableWithoutFeedback,
    Keyboard,
    ActivityIndicator,
    Image,
} from 'react-native';
import { Button, TextInput, Snackbar } from 'react-native-paper';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import * as ImagePicker from 'expo-image-picker';

import { AuthStackParamList } from '../../navigation/AuthNavigator';
import {
    createSubmission,
    getMySubmission,
    updateMySubmission,
} from '../../services/submissions/submissionService';
import { adventureStyles as styles } from '../../styles/AdventureStyles';

type Props = NativeStackScreenProps<AuthStackParamList, 'SubmitAdventure'>;

export default function SubmitAdventureScreen({ navigation, route }: Props) {
    const { adventureId } = route.params;

    const [submissionText, setSubmissionText] = useState('');
    const [imageUrl, setImageUrl] = useState('');
    const [existingSubmissionId, setExistingSubmissionId] = useState<string | null>(null);

    const [fetching, setFetching] = useState(false);
    const [loading, setLoading] = useState(false);

    const [snackbarVisible, setSnackbarVisible] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');

    useEffect(() => {
        fetchExistingSubmission();
    }, [adventureId]);

    const showMessage = (message: string) => {
        setSnackbarMessage(message);
        setSnackbarVisible(true);
    };

    const fetchExistingSubmission = async () => {
        try {
            setFetching(true);

            const existingSubmission = await getMySubmission(adventureId);

            if (existingSubmission) {
                setExistingSubmissionId(existingSubmission.id);
                setSubmissionText(existingSubmission.submission_text);
                setImageUrl(existingSubmission.image_url || '');
            }
        } catch (error) {
            console.log('Fetch existing submission error:', error);
        } finally {
            setFetching(false);
        }
    };

    const handlePickImage = async () => {
        const permissionResult =
            await ImagePicker.requestMediaLibraryPermissionsAsync();

        if (!permissionResult.granted) {
            showMessage('Permission is required to access your photos.');
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            quality: 0.7,
        });

        if (!result.canceled) {
            setImageUrl(result.assets[0].uri);
            showMessage('Image selected successfully.');
        }
    };

    const validate = () => {
        if (!submissionText.trim()) {
            showMessage('Please describe what you completed before submitting.');
            return false;
        }

        return true;
    };

    const handleSubmitAdventure = async () => {
        if (!validate()) return;

        try {
            setLoading(true);

            const payload = {
                submission_text: submissionText.trim(),
                image_url: imageUrl.trim() || undefined,
            };

            if (existingSubmissionId) {
                await updateMySubmission(existingSubmissionId, payload);
                showMessage('Adventure submission updated successfully.');
            } else {
                const submission = await createSubmission(adventureId, payload);
                setExistingSubmissionId(submission.id);
                showMessage('Adventure submitted successfully.');
            }

            setTimeout(() => {
                navigation.navigate('AdventureDetails', {
                    adventureId,
                });
            }, 800);
        } catch (error: any) {
            const statusCode = error?.response?.data?.statusCode;
            const backendMessage = error?.response?.data?.message;

            if (
                statusCode === 403 &&
                backendMessage === 'Approved submissions cannot be edited'
            ) {
                showMessage(
                    'This submission has already been approved and can no longer be edited.'
                );
                return;
            }

            showMessage(
                backendMessage || error?.message || 'Unable to submit adventure.'
            );
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
                <Text style={styles.headerTitle}>
                    {existingSubmissionId
                        ? 'Update Adventure Submission'
                        : 'Submit Adventure'}
                </Text>
            </View>

            <View style={styles.submissionCard}>
                {fetching ? (
                    <ActivityIndicator size="large" style={styles.loader} />
                ) : (
                    <>
                        <Text style={styles.detailsLabel}>What did you complete?</Text>
                        <Text style={styles.helperText}>
                            Write a short description of what you observed, completed, or learned.
                        </Text>

                        <TextInput
                            label="Submission Description"
                            mode="outlined"
                            value={submissionText}
                            onChangeText={setSubmissionText}
                            multiline
                            style={[styles.input, styles.textArea]}
                        />

                        <Text style={styles.detailsLabel}>Upload Image</Text>
                        <Text style={styles.helperText}>
                            Choose an image that shows your completed adventure activity.
                        </Text>

                        <Button
                            mode="outlined"
                            onPress={handlePickImage}
                            style={styles.cancelButton}
                        >
                            Choose Image
                        </Button>

                        {imageUrl ? (
                            <Image
                                source={{ uri: imageUrl }}
                                style={{
                                    width: '100%',
                                    height: 180,
                                    borderRadius: 12,
                                    marginTop: 12,
                                    marginBottom: 12,
                                }}
                                resizeMode="cover"
                            />
                        ) : null}

                        <Button
                            mode="contained"
                            onPress={handleSubmitAdventure}
                            loading={loading}
                            disabled={loading}
                            style={styles.submitButton}
                        >
                            {existingSubmissionId ? 'Update Submission' : 'Submit Adventure'}
                        </Button>

                        <Button
                            mode="text"
                            onPress={() => navigation.goBack()}
                            style={styles.cancelButton}
                        >
                            Cancel
                        </Button>
                    </>
                )}
            </View>

            <Snackbar
                visible={snackbarVisible}
                onDismiss={() => setSnackbarVisible(false)}
                duration={3000}
            >
                {snackbarMessage}
            </Snackbar>
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