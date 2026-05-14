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
import { createAdventure } from '../../services/adventures/adventureService';
import { adventureStyles as styles } from '../../styles/AdventureStyles';

type Props = NativeStackScreenProps<AuthStackParamList, 'CreateAdventure'>;

export default function CreateAdventureScreen({ navigation, route }: Props) {
    const passedCohortId = route.params?.cohortId || '';

    const [cohortId, setCohortId] = useState(passedCohortId);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [taskInstructions, setTaskInstructions] = useState('');
    const [dueDate, setDueDate] = useState('');
    const [loading, setLoading] = useState(false);

    const validate = () => {
        if (!cohortId.trim()) {
            Alert.alert('Validation Error', 'Please enter a cohort ID.');
            return false;
        }

        if (!title.trim()) {
            Alert.alert('Validation Error', 'Please enter an adventure title.');
            return false;
        }

        if (!description.trim()) {
            Alert.alert('Validation Error', 'Please enter a description.');
            return false;
        }

        if (!taskInstructions.trim()) {
            Alert.alert('Validation Error', 'Please enter task instructions.');
            return false;
        }

        if (!dueDate.trim()) {
            Alert.alert('Validation Error', 'Please enter a due date.');
            return false;
        }

        return true;
    };

    const handleCreateAdventure = async () => {
        if (!validate()) return;

        try {
            setLoading(true);

            await createAdventure(cohortId.trim(), {
                title: title.trim(),
                description: description.trim(),
                task_instructions: taskInstructions.trim(),
                due_date: dueDate.trim(),
            });

            Alert.alert('Success', 'Adventure created successfully.');

            navigation.navigate('AdventureList', {
                cohortId: cohortId.trim(),
                userRole: 'ranger',
            });
        } catch (error: any) {
            const message =
                error?.response?.data?.message ||
                error?.message ||
                'Unable to create adventure.';

            Alert.alert('Create Adventure Failed', message);
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
                <Text style={styles.headerTitle}>Create Adventure</Text>
            </View>

            <View style={styles.formCard}>
                <TextInput
                    label="Cohort ID"
                    mode="outlined"
                    value={cohortId}
                    onChangeText={setCohortId}
                    style={styles.input}
                    autoCapitalize="none"
                />

                <TextInput
                    label="Adventure Title"
                    mode="outlined"
                    value={title}
                    onChangeText={setTitle}
                    style={styles.input}
                />

                <TextInput
                    label="Description"
                    mode="outlined"
                    value={description}
                    onChangeText={setDescription}
                    multiline
                    style={[styles.input, styles.textArea]}
                />

                <TextInput
                    label="Task Instructions"
                    mode="outlined"
                    value={taskInstructions}
                    onChangeText={setTaskInstructions}
                    multiline
                    style={[styles.input, styles.textArea]}
                />

                <TextInput
                    label="Due Date"
                    placeholder="YYYY-MM-DD"
                    mode="outlined"
                    value={dueDate}
                    onChangeText={setDueDate}
                    style={styles.input}
                />

                <Button
                    mode="contained"
                    onPress={handleCreateAdventure}
                    loading={loading}
                    disabled={loading}
                    style={styles.submitButton}
                >
                    Create Adventure
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