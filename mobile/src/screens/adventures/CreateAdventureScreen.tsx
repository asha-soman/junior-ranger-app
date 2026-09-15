import React, {
  useEffect,
  useState,
} from 'react';

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

import {
  Button,
  TextInput,
} from 'react-native-paper';

import {
  NativeStackScreenProps,
} from '@react-navigation/native-stack';

import {
  AuthStackParamList,
} from '../../navigation/AuthNavigator';

import {
  createAdventure,
  createAdventureTask,
} from '../../services/adventures/adventureService';

import {
  Cohort,
  getCohorts,
} from '../../services/cohorts/cohortService';

import {
  adventureStyles as styles,
} from '../../styles/AdventureStyles';

type Props = NativeStackScreenProps<
  AuthStackParamList,
  'CreateAdventure'
>;

type AdventureTaskForm = {
  title: string;
  description: string;
  xpReward: string;
};

export default function CreateAdventureScreen({
  navigation,
  route,
}: Props) {
  const passedCohortId =
    route.params?.cohortId || '';

  const [
    cohorts,
    setCohorts,
  ] = useState<Cohort[]>([]);

  const [
    selectedCohortId,
    setSelectedCohortId,
  ] = useState(
    passedCohortId,
  );

  const [
    selectedCohortName,
    setSelectedCohortName,
  ] = useState('');

  const [
    showCohortDropdown,
    setShowCohortDropdown,
  ] = useState(false);

  const [
    cohortLoading,
    setCohortLoading,
  ] = useState(false);

  const [
    cohortError,
    setCohortError,
  ] = useState('');

  const [
    title,
    setTitle,
  ] = useState('');

  const [
    description,
    setDescription,
  ] = useState('');

  const [
    taskInstructions,
    setTaskInstructions,
  ] = useState('');

  const [
    dueDate,
    setDueDate,
  ] = useState('');

  const [
    tasks,
    setTasks,
  ] = useState<AdventureTaskForm[]>([
    {
      title: '',
      description: '',
      xpReward: '25',
    },
  ]);

  const [
    loading,
    setLoading,
  ] = useState(false);

  useEffect(() => {
    fetchCohorts();
  }, []);

  const fetchCohorts = async () => {
    try {
      setCohortLoading(true);
      setCohortError('');

      const data =
        await getCohorts();

      setCohorts(data);

      if (passedCohortId) {
        const matchedCohort =
          data.find(
            (cohort) =>
              cohort.id ===
              passedCohortId,
          );

        if (matchedCohort) {
          setSelectedCohortName(
            matchedCohort.name,
          );
        }
      }
    } catch (error) {
      console.log(
        'Fetch cohorts error:',
        error,
      );

      setCohortError(
        'Unable to load cohorts.',
      );
    } finally {
      setCohortLoading(false);
    }
  };

  const handleSelectCohort = (
    cohort: Cohort,
  ) => {
    setSelectedCohortId(
      cohort.id,
    );

    setSelectedCohortName(
      cohort.name,
    );

    setShowCohortDropdown(
      false,
    );
  };

  const handleTaskChange = (
    index: number,
    field:
      | 'title'
      | 'description'
      | 'xpReward',
    value: string,
  ) => {
    setTasks((currentTasks) =>
      currentTasks.map(
        (task, taskIndex) =>
          taskIndex === index
            ? {
                ...task,
                [field]: value,
              }
            : task,
      ),
    );
  };

  const addTask = () => {
    setTasks((currentTasks) => [
      ...currentTasks,
      {
        title: '',
        description: '',
        xpReward: '25',
      },
    ]);
  };

  const removeTask = (
    index: number,
  ) => {
    if (tasks.length === 1) {
      Alert.alert(
        'Task Required',
        'An adventure must contain at least one task.',
      );

      return;
    }

    setTasks((currentTasks) =>
      currentTasks.filter(
        (_, taskIndex) =>
          taskIndex !== index,
      ),
    );
  };

  const validate = () => {
    if (
      !selectedCohortId.trim()
    ) {
      Alert.alert(
        'Validation Error',
        'Please select a cohort.',
      );

      return false;
    }

    if (!title.trim()) {
      Alert.alert(
        'Validation Error',
        'Please enter an adventure title.',
      );

      return false;
    }

    if (!description.trim()) {
      Alert.alert(
        'Validation Error',
        'Please enter a description.',
      );

      return false;
    }

    if (
      !taskInstructions.trim()
    ) {
      Alert.alert(
        'Validation Error',
        'Please enter task instructions.',
      );

      return false;
    }

    if (!dueDate.trim()) {
      Alert.alert(
        'Validation Error',
        'Please enter a due date.',
      );

      return false;
    }

    for (
      let index = 0;
      index < tasks.length;
      index += 1
    ) {
      const task = tasks[index];

      if (!task.title.trim()) {
        Alert.alert(
          'Validation Error',
          `Please enter a title for Task ${index + 1}.`,
        );

        return false;
      }

      const xpReward = Number(
        task.xpReward,
      );

      if (
        !Number.isInteger(xpReward) ||
        xpReward < 0
      ) {
        Alert.alert(
          'Validation Error',
          `Please enter a valid XP reward for Task ${index + 1}.`,
        );

        return false;
      }
    }

    return true;
  };

  const handleCreateAdventure =
    async () => {
      if (!validate()) return;

      try {
        setLoading(true);

        const adventure =
          await createAdventure(
            selectedCohortId.trim(),
            {
              title: title.trim(),

              description:
                description.trim(),

              task_instructions:
                taskInstructions.trim(),

              due_date:
                dueDate.trim(),
            },
          );

        for (
          let index = 0;
          index < tasks.length;
          index += 1
        ) {
          const task =
            tasks[index];

          await createAdventureTask(
            adventure.id,
            {
              title:
                task.title.trim(),

              description:
                task.description.trim() ||
                undefined,

              xp_reward:
                Number(
                  task.xpReward,
                ),

              task_order:
                index + 1,
            },
          );
        }

        Alert.alert(
          'Success',
          'Adventure and tasks created successfully.',
        );

        navigation.navigate(
          'AdventureList',
          {
            userRole: 'ranger',
          },
        );
      } catch (error: any) {
        console.log(
          'Create adventure error:',
          error,
        );

        const message =
          error?.response?.data
            ?.message ||
          error?.message ||
          'Unable to create adventure.';

        Alert.alert(
          'Create Adventure Failed',
          Array.isArray(message)
            ? message.join('\n')
            : message,
        );
      } finally {
        setLoading(false);
      }
    };

  const formContent = (
    <ScrollView
      contentContainerStyle={
        styles.content
      }
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={
        false
      }
    >
      <View style={styles.header}>
        <Text
          style={styles.headerTitle}
        >
          Create Adventure
        </Text>
      </View>

      <View
        style={styles.formCard}
      >
        <Text
          style={styles.cardTitle}
        >
          Select Cohort
        </Text>

        {cohortLoading ? (
          <ActivityIndicator
            size="small"
          />
        ) : (
          <>
            <TouchableOpacity
              style={
                styles.dropdownBox
              }
              onPress={() =>
                setShowCohortDropdown(
                  !showCohortDropdown,
                )
              }
            >
              <Text
                style={
                  selectedCohortName
                    ? styles.dropdownText
                    : styles.dropdownPlaceholder
                }
              >
                {selectedCohortName ||
                  'Choose a cohort'}
              </Text>
            </TouchableOpacity>

            {!!cohortError && (
              <Text
                style={
                  styles.dropdownError
                }
              >
                {cohortError}
              </Text>
            )}

            {showCohortDropdown && (
              <View
                style={
                  styles.dropdownList
                }
              >
                {cohorts.length ===
                0 ? (
                  <View
                    style={
                      styles.dropdownItem
                    }
                  >
                    <Text
                      style={
                        styles.dropdownItemText
                      }
                    >
                      No cohorts
                      available
                    </Text>
                  </View>
                ) : (
                  cohorts.map(
                    (cohort) => (
                      <TouchableOpacity
                        key={
                          cohort.id
                        }
                        style={
                          styles.dropdownItem
                        }
                        onPress={() =>
                          handleSelectCohort(
                            cohort,
                          )
                        }
                      >
                        <Text
                          style={
                            styles.dropdownItemText
                          }
                        >
                          {
                            cohort.name
                          }
                        </Text>
                      </TouchableOpacity>
                    ),
                  )
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
          onChangeText={
            setDescription
          }
          multiline
          style={[
            styles.input,
            styles.textArea,
          ]}
        />

        <TextInput
          label="Task Instructions"
          mode="outlined"
          value={
            taskInstructions
          }
          onChangeText={
            setTaskInstructions
          }
          multiline
          style={[
            styles.input,
            styles.textArea,
          ]}
        />

        <TextInput
          label="Due Date"
          placeholder="YYYY-MM-DD"
          mode="outlined"
          value={dueDate}
          onChangeText={setDueDate}
          style={styles.input}
        />

        <View
          style={
            styles.taskFormSection
          }
        >
          <Text
            style={
              styles.taskSectionTitle
            }
          >
            Adventure Tasks
          </Text>

          <Text
            style={
              styles.taskSectionHelper
            }
          >
            Add the tasks Junior
            Rangers need to complete.
            XP will be awarded when
            the Ranger approves each
            task.
          </Text>

          {tasks.map(
            (task, index) => (
              <View
                key={index}
                style={
                  styles.taskFormCard
                }
              >
                <View
                  style={
                    styles.taskFormHeader
                  }
                >
                  <Text
                    style={
                      styles.taskFormTitle
                    }
                  >
                    Task {index + 1}
                  </Text>

                  {tasks.length >
                    1 && (
                    <Button
                      mode="text"
                      compact
                      onPress={() =>
                        removeTask(
                          index,
                        )
                      }
                    >
                      Remove
                    </Button>
                  )}
                </View>

                <TextInput
                  label="Task Title"
                  mode="outlined"
                  value={task.title}
                  onChangeText={(
                    value,
                  ) =>
                    handleTaskChange(
                      index,
                      'title',
                      value,
                    )
                  }
                  style={
                    styles.input
                  }
                />

                <TextInput
                  label="Task Description"
                  mode="outlined"
                  value={
                    task.description
                  }
                  onChangeText={(
                    value,
                  ) =>
                    handleTaskChange(
                      index,
                      'description',
                      value,
                    )
                  }
                  multiline
                  style={[
                    styles.input,
                    styles.taskDescriptionInput,
                  ]}
                />

                <TextInput
                  label="XP Reward"
                  mode="outlined"
                  value={
                    task.xpReward
                  }
                  onChangeText={(
                    value,
                  ) =>
                    handleTaskChange(
                      index,
                      'xpReward',
                      value.replace(
                        /[^0-9]/g,
                        '',
                      ),
                    )
                  }
                  keyboardType="numeric"
                  style={
                    styles.input
                  }
                />
              </View>
            ),
          )}

          <Button
            mode="outlined"
            onPress={addTask}
            style={
              styles.addTaskButton
            }
          >
            + Add Another Task
          </Button>
        </View>

        <Button
          mode="contained"
          onPress={
            handleCreateAdventure
          }
          loading={loading}
          disabled={loading}
          style={
            styles.submitButton
          }
        >
          Create Adventure
        </Button>

        <Button
          mode="text"
          disabled={loading}
          onPress={() =>
            navigation.goBack()
          }
          style={
            styles.cancelButton
          }
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
          : Platform.OS ===
              'android'
            ? 'height'
            : undefined
      }
    >
      {Platform.OS === 'web' ? (
        formContent
      ) : (
        <TouchableWithoutFeedback
          onPress={Keyboard.dismiss}
        >
          {formContent}
        </TouchableWithoutFeedback>
      )}
    </KeyboardAvoidingView>
  );
}