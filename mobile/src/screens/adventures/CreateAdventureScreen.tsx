import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    Alert,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    TouchableWithoutFeedback,
    Keyboard,
    TouchableOpacity,
    ActivityIndicator,
} from 'react-native';
import { Button, TextInput } from 'react-native-paper';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

import { AuthStackParamList } from '../../navigation/AuthNavigator';
import { createAdventure } from '../../services/adventures/adventureService';
import { Cohort, getCohorts } from '../../services/cohorts/cohortService';
import { adventureStyles as styles } from '../../styles/AdventureStyles';

type Props = NativeStackScreenProps<AuthStackParamList, 'CreateAdventure'>;

export default function CreateAdventureScreen({ navigation, route }: Props) {
    const passedCohortId = route.params?.cohortId || '';

    const [cohorts, setCohorts] = useState<Cohort[]>([]);
    const [selectedCohortId, setSelectedCohortId] = useState(passedCohortId);
    const [selectedCohortName, setSelectedCohortName] = useState('');
    const [showCohortDropdown, setShowCohortDropdown] = useState(false);
    const [cohortLoading, setCohortLoading] = useState(false);
    const [cohortError, setCohortError] = useState('');

    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [taskInstructions, setTaskInstructions] = useState('');
    const [dueDate, setDueDate] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchCohorts();
    }, []);

    const fetchCohorts = async () => {
        try {
            setCohortLoading(true);
            setCohortError('');

            const data = await getCohorts();
            setCohorts(data);

            if (passedCohortId) {
                const matchedCohort = data.find((cohort) => cohort.id === passedCohortId);
                if (matchedCohort) {
                    setSelectedCohortName(matchedCohort.name);
                }
            }
        } catch (error) {
            console.log('Fetch cohorts error:', error);
            setCohortError('Unable to load cohorts.');
        } finally {
            setCohortLoading(false);
        }
    };

    const handleSelectCohort = (cohort: Cohort) => {
        setSelectedCohortId(cohort.id);
        setSelectedCohortName(cohort.name);
        setShowCohortDropdown(false);
    };

    const validate = () => {
        if (!selectedCohortId.trim()) {
            Alert.alert('Validation Error', 'Please select a cohort.');
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

            await createAdventure(selectedCohortId.trim(), {
                title: title.trim(),
                description: description.trim(),
                task_instructions: taskInstructions.trim(),
                due_date: dueDate.trim(),
            });

            Alert.alert('Success', 'Adventure created successfully.');

            navigation.navigate('AdventureList', {
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
                <Text style={styles.cardTitle}>Select Cohort</Text>

                {cohortLoading ? (
                    <ActivityIndicator size="small" />
                ) : (
                    <>
                        <TouchableOpacity
                            style={styles.dropdownBox}
                            onPress={() => setShowCohortDropdown(!showCohortDropdown)}
                        >
                            <Text
                                style={
                                    selectedCohortName
                                        ? styles.dropdownText
                                        : styles.dropdownPlaceholder
                                }
                            >
                                {selectedCohortName || 'Choose a cohort'}
                            </Text>
                        </TouchableOpacity>

                        {!!cohortError && (
                            <Text style={styles.dropdownError}>{cohortError}</Text>
                        )}

                        {showCohortDropdown && (
                            <View style={styles.dropdownList}>
                                {cohorts.length === 0 ? (
                                    <View style={styles.dropdownItem}>
                                        <Text style={styles.dropdownItemText}>
                                            No cohorts available
                                        </Text>
                                    </View>
                                ) : (
                                    cohorts.map((cohort) => (
                                        <TouchableOpacity
                                            key={cohort.id}
                                            style={styles.dropdownItem}
                                            onPress={() => handleSelectCohort(cohort)}
                                        >
                                            <Text style={styles.dropdownItemText}>{cohort.name}</Text>
                                        </TouchableOpacity>
                                    ))
                                )}
                            </View>
                        )}
                    </>
                )}

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