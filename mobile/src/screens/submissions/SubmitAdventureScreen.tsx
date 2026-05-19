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
import { createSubmission } from '../../services/submissions/submissionService';
import { adventureStyles as styles } from '../../styles/AdventureStyles';

type Props = NativeStackScreenProps<AuthStackParamList, 'SubmitAdventure'>;

export default function SubmitAdventureScreen({ navigation, route }: Props) {
    const { adventureId } = route.params;

    const [submissionText, setSubmissionText] = useState('');
    const [imageUrl, setImageUrl] = useState('');
    const [loading, setLoading] = useState(false);

    const validate = () => {
        if (!submissionText.trim()) {
            Alert.alert('Validation Error', 'Please describe what you completed.');
            return false;
        }

        return true;
    };

    const handleSubmitAdventure = async () => {
        if (!validate()) return;

        try {
            setLoading(true);

            await createSubmission(adventureId, {
                submission_text: submissionText.trim(),
                image_url: imageUrl.trim() || undefined,
            });

            Alert.alert('Success', 'Adventure submitted successfully.');

            navigation.navigate('AdventureDetails', {
                adventureId,
            });
        } catch (error: any) {
            const message =
                error?.response?.data?.message ||
                error?.message ||
                'Unable to submit adventure.';

            Alert.alert('Submission Failed', message);
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
                <Text style={styles.headerTitle}>Submit Adventure</Text>
            </View>

            <View style={styles.submissionCard}>
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

                <Text style={styles.detailsLabel}>Image URL</Text>
                <Text style={styles.helperText}>
                    For now, paste an image link here. Later this can become a real image upload.
                </Text>

                <TextInput
                    label="Image URL"
                    mode="outlined"
                    value={imageUrl}
                    onChangeText={setImageUrl}
                    style={styles.input}
                    autoCapitalize="none"
                />

                <Button
                    mode="contained"
                    onPress={handleSubmitAdventure}
                    loading={loading}
                    disabled={loading}
                    style={styles.submitButton}
                >
                    Submit Adventure
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