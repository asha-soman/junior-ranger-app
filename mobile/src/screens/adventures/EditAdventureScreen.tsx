import React, {
  useEffect,
  useState,
} from 'react';

import { Image } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { uploadImage } from "../../services/submissions/submissionService";
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
  TouchableOpacity,
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
  AdventureStatus,
  deleteAdventureTask,
  getAdventureById,
  getAdventureTasks,
  createAdventureTask,
  updateAdventure,
  updateAdventureTask,
} from '../../services/adventures/adventureService';

import {
  adventureStyles as styles,
} from '../../styles/AdventureStyles';

type Props = NativeStackScreenProps<
  AuthStackParamList,
  'EditAdventure'
>;

type EditableTask = {
  id?: string;
  title: string;
  description: string;
  xpReward: string;
};

export default function EditAdventureScreen({
  navigation,
  route,
}: Props) {
  const { adventureId } =
    route.params;

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
  const [imageUri, setImageUri] = useState<string | null>(null);

  const [
    status,
    setStatus,
  ] =
    useState<AdventureStatus>(
      'published',
    );

  const [
    tasks,
    setTasks,
  ] =
    useState<EditableTask[]>([]);

  const [
    deletedTaskIds,
    setDeletedTaskIds,
  ] =
    useState<string[]>([]);

  const [
    loading,
    setLoading,
  ] = useState(false);

  const [
    fetching,
    setFetching,
  ] = useState(false);

  useEffect(() => {
    fetchAdventure();
  }, [adventureId]);

  const fetchAdventure =
    async () => {
      try {
        setFetching(true);

        const [
          adventure,
          adventureTasks,
        ] = await Promise.all([
          getAdventureById(
            adventureId,
          ),

          getAdventureTasks(
            adventureId,
          ),
        ]);

        setTitle(
          adventure.title,
        );

        setDescription(
          adventure.description,
        );

        setTaskInstructions(
          adventure.task_instructions,
        );

        setDueDate(
          adventure.due_date
            ?.split('T')[0] ||
            '',
        );

        setStatus(
          adventure.status,
        );

        if (adventure.image_url) {
          setImageUri(
            adventure.image_url,
          );
        }

        setTasks(
          adventureTasks.map(
            (task) => ({
              id: task.id,

              title:
                task.title,

              description:
                task.description ||
                '',

              xpReward:
                String(
                  task.xp_reward,
                ),
            }),
          ),
        );

        setDeletedTaskIds([]);
      } catch (error: any) {
        Alert.alert(
          'Error',
          error?.response?.data
            ?.message ||
            'Unable to load adventure.',
        );
      } finally {
        setFetching(false);
      }
    };

  const handleTaskChange = (
    index: number,
    field:
      | 'title'
      | 'description'
      | 'xpReward',
    value: string,
  ) => {
    setTasks((current) =>
      current.map(
        (task, taskIndex) =>
          taskIndex === index
            ? {
                ...task,
                [field]:
                  value,
              }
            : task,
      ),
    );
  };

  const addTask = () => {
    setTasks((current) => [
      ...current,
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

    const taskToRemove =
      tasks[index];

    if (taskToRemove.id) {
      setDeletedTaskIds(
        (current) => [
          ...current,
          taskToRemove.id!,
        ],
      );
    }

    setTasks((current) =>
      current.filter(
        (_, taskIndex) =>
          taskIndex !== index,
      ),
    );
  };


  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permission Required", "Sorry, we need camera roll permissions to make this work!");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.8,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      setImageUri(result.assets[0].uri);
    }
  };

  const validate = () => {
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

    if (tasks.length === 0) {
      Alert.alert(
        'Validation Error',
        'Please add at least one adventure task.',
      );

      return false;
    }

    for (
      let index = 0;
      index < tasks.length;
      index += 1
    ) {
      const task =
        tasks[index];

      if (!task.title.trim()) {
        Alert.alert(
          'Validation Error',
          `Please enter a title for Task ${index + 1}.`,
        );

        return false;
      }

      const xpReward =
        Number(
          task.xpReward,
        );

      if (
        !Number.isInteger(
          xpReward,
        ) ||
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

  const handleUpdateAdventure =
    async () => {
      if (!validate()) {
        return;
      }

      try {
        setLoading(true);

        let uploadedImageUrl = undefined;
        if (imageUri && imageUri.startsWith('file://')) {
          uploadedImageUrl = await uploadImage(imageUri);
        }

        // Update main Adventure
        await updateAdventure(
          adventureId,
          {
            title:
              title.trim(),

            description:
              description.trim(),

            task_instructions:
              taskInstructions.trim(),

            due_date:
              dueDate.trim(),

            status,
            ...(uploadedImageUrl ? { image_url: uploadedImageUrl } : {}),
          },
        );

        // Soft-delete removed tasks
        for (
          const taskId of
          deletedTaskIds
        ) {
          await deleteAdventureTask(
            taskId,
          );
        }

        // Update existing tasks
        // or create new tasks
        for (
          let index = 0;
          index < tasks.length;
          index += 1
        ) {
          const task =
            tasks[index];

          const payload = {
            title:
              task.title.trim(),

            description:
              task.description.trim(),

            xp_reward:
              Number(
                task.xpReward,
              ),

            task_order:
              index + 1,
          };

          if (task.id) {
            await updateAdventureTask(
              task.id,
              payload,
            );
          } else {
            await createAdventureTask(
              adventureId,
              payload,
            );
          }
        }

        Alert.alert(
          'Success',
          'Adventure and tasks updated successfully.',
        );

        navigation.navigate(
          'AdventureDetails',
          {
            adventureId,
          },
        );
      } catch (error: any) {
        console.log(
          'Update adventure error:',
          error,
        );

        const message =
          error?.response?.data
            ?.message ||
          error?.message ||
          'Unable to update adventure.';

        Alert.alert(
          'Update Failed',
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
          Edit Adventure
        </Text>
      </View>

      {fetching ? (
        <ActivityIndicator
          size="large"
          style={styles.loader}
        />
      ) : (
        <View
          style={styles.formCard}
        >
          <TouchableOpacity onPress={pickImage} style={{ alignItems: "center", marginBottom: 15 }}>
            {imageUri ? (
              <Image source={{ uri: imageUri }} style={{ width: '100%', height: 150, borderRadius: 10 }} />
            ) : (
              <View style={{ width: '100%', height: 150, borderRadius: 10, backgroundColor: "#e1e1e1", justifyContent: "center", alignItems: "center" }}>
                <Text style={{ color: "#666" }}>Add/Change Adventure Image</Text>
              </View>
            )}
          </TouchableOpacity>

          <TextInput
            label="Adventure Title"
            mode="outlined"
            value={title}
            onChangeText={
              setTitle
            }
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
            onChangeText={
              setDueDate
            }
            style={styles.input}
          />

          <TextInput
            label="Status"
            mode="outlined"
            value={status}
            onChangeText={(
              value,
            ) =>
              setStatus(
                value as AdventureStatus,
              )
            }
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
              Edit existing tasks,
              change their XP rewards,
              remove tasks, or add new
              tasks.
            </Text>

            {tasks.map(
              (task, index) => (
                <View
                  key={
                    task.id ||
                    `new-${index}`
                  }
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

                    <Button
                      mode="text"
                      compact
                      disabled={
                        tasks.length ===
                        1
                      }
                      onPress={() =>
                        removeTask(
                          index,
                        )
                      }
                    >
                      Remove
                    </Button>
                  </View>

                  <TextInput
                    label="Task Title"
                    mode="outlined"
                    value={
                      task.title
                    }
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
              handleUpdateAdventure
            }
            loading={loading}
            disabled={loading}
            style={
              styles.submitButton
            }
          >
            Update Adventure & Tasks
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
      )}
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
      {Platform.OS ===
      'web' ? (
        formContent
      ) : (
        <TouchableWithoutFeedback
          onPress={
            Keyboard.dismiss
          }
        >
          {formContent}
        </TouchableWithoutFeedback>
      )}
    </KeyboardAvoidingView>
  );
}