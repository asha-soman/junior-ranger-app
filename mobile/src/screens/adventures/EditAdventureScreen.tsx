import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    Alert,
    ActivityIndicator,
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
    getAdventureById,
    updateAdventure,
    AdventureStatus,
} from '../../services/adventures/adventureService';
import { adventureStyles as styles } from '../../styles/AdventureStyles';

type Props = NativeStackScreenProps<AuthStackParamList, 'EditAdventure'>;

export default function EditAdventureScreen({ navigation, route }: Props) {
    const { adventureId } = route.params;

    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [taskInstructions, setTaskInstructions] = useState('');
    const [dueDate, setDueDate] = useState('');
    const [status, setStatus] = useState<AdventureStatus>('published');

    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(false);

    useEffect(() => {
        fetchAdventure();
    }, [adventureId]);

    const fetchAdventure = async () => {
        try {
            setFetching(true);

            const adventure = await getAdventureById(adventureId);

            setTitle(adventure.title);
            setDescription(adventure.description);
            setTaskInstructions(adventure.task_instructions);
            setDueDate(adventure.due_date?.split('T')[0] || '');
            setStatus(adventure.status);
        } catch (error: any) {
            Alert.alert(
                'Error',
                error?.response?.data?.message || 'Unable to load adventure.'
            );
        } finally {
            setFetching(false);
        }
    };

    const validate = () => {
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

    const handleUpdateAdventure = async () => {
        if (!validate()) return;

        try {
            setLoading(true);

            await updateAdventure(adventureId, {
                title: title.trim(),
                description: description.trim(),
                task_instructions: taskInstructions.trim(),
                due_date: dueDate.trim(),
                status,
            });

            Alert.alert('Success', 'Adventure updated successfully.');

            navigation.navigate('AdventureDetails', {
                adventureId,
            });
        } catch (error: any) {
            Alert.alert(
                'Update Failed',
                error?.response?.data?.message || 'Unable to update adventure.'
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
                <Text style={styles.headerTitle}>Edit Adventure</Text>
            </View>

            {fetching ? (
                <ActivityIndicator size="large" style={styles.loader} />
            ) : (
                <View style={styles.formCard}>
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

                    <TextInput
                        label="Status"
                        mode="outlined"
                        value={status}
                        onChangeText={(value) => setStatus(value as AdventureStatus)}
                        style={styles.input}
                    />

                    <Button
                        mode="contained"
                        onPress={handleUpdateAdventure}
                        loading={loading}
                        disabled={loading}
                        style={styles.submitButton}
                    >
                        Update Adventure
                    </Button>

                    <Button
                        mode="text"
                        onPress={() => navigation.goBack()}
                        style={styles.cancelButton}
                    >
                        Cancel
                    </Button>
                </View>
            )}
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