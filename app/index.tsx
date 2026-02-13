import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useMemo, useState } from 'react';
import {
  FlatList,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

type Task = {
  id: string;
  title: string;
  completed: boolean;
};

const TASKS_STORAGE_KEY = 'tasks';

export default function TodoScreen() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTaskTitle, setNewTaskTitle] = useState('');

  useEffect(() => {
    const loadTasks = async () => {
      try {
        const storedTasks = await AsyncStorage.getItem(TASKS_STORAGE_KEY);
        if (!storedTasks) {
          return;
        }

        const parsedTasks = JSON.parse(storedTasks) as Task[];
        if (Array.isArray(parsedTasks)) {
          setTasks(parsedTasks);
        }
      } catch {
        setTasks([]);
      }
    };

    loadTasks();
  }, []);

  const saveTasks = async (updatedTasks: Task[]) => {
    setTasks(updatedTasks);
    await AsyncStorage.setItem(TASKS_STORAGE_KEY, JSON.stringify(updatedTasks));
  };

  const addTask = async () => {
    const trimmedTitle = newTaskTitle.trim();
    if (!trimmedTitle) {
      return;
    }

    const task: Task = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      title: trimmedTitle,
      completed: false,
    };

    await saveTasks([...tasks, task]);
    setNewTaskTitle('');
  };

  const toggleTask = async (id: string) => {
    const updatedTasks = tasks.map((task) =>
      task.id === id ? { ...task, completed: !task.completed } : task,
    );

    await saveTasks(updatedTasks);
  };

  const deleteTask = async (id: string) => {
    const updatedTasks = tasks.filter((task) => task.id !== id);
    await saveTasks(updatedTasks);
  };

  const sortedTasks = useMemo(
    () => [...tasks].sort((a, b) => Number(a.completed) - Number(b.completed)),
    [tasks],
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.header}>Simple To-Do List</Text>

        <View style={styles.inputRow}>
          <TextInput
            placeholder="Add a task"
            value={newTaskTitle}
            onChangeText={setNewTaskTitle}
            style={styles.input}
            returnKeyType="done"
            onSubmitEditing={addTask}
          />
          <Pressable style={styles.addButton} onPress={addTask}>
            <Text style={styles.addButtonText}>Add</Text>
          </Pressable>
        </View>

        <FlatList
          data={sortedTasks}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={<Text style={styles.emptyText}>No tasks yet.</Text>}
          renderItem={({ item }) => (
            <View style={styles.taskRow}>
              <Pressable
                onPress={() => toggleTask(item.id)}
                style={[styles.checkbox, item.completed && styles.checkboxChecked]}>
                {item.completed ? <Text style={styles.checkMark}>✓</Text> : null}
              </Pressable>

              <Text style={[styles.taskTitle, item.completed && styles.taskTitleCompleted]}>
                {item.title}
              </Text>

              <Pressable onPress={() => deleteTask(item.id)} style={styles.deleteButton}>
                <Text style={styles.deleteText}>🗑</Text>
              </Pressable>
            </View>
          )}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f6f7fb',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  header: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 16,
    color: '#101828',
  },
  inputRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 14,
  },
  input: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingHorizontal: 14,
    height: 46,
    borderWidth: 1,
    borderColor: '#d0d5dd',
  },
  addButton: {
    backgroundColor: '#2563eb',
    borderRadius: 10,
    paddingHorizontal: 16,
    justifyContent: 'center',
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  listContent: {
    paddingBottom: 28,
    gap: 10,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 28,
    color: '#667085',
    fontSize: 15,
  },
  taskRow: {
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#eaecf0',
    paddingVertical: 12,
    paddingHorizontal: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#98a2b3',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxChecked: {
    backgroundColor: '#2563eb',
    borderColor: '#2563eb',
  },
  checkMark: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 14,
  },
  taskTitle: {
    flex: 1,
    color: '#1d2939',
    fontSize: 16,
  },
  taskTitleCompleted: {
    textDecorationLine: 'line-through',
    color: '#98a2b3',
  },
  deleteButton: {
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  deleteText: {
    fontSize: 18,
  },
});
