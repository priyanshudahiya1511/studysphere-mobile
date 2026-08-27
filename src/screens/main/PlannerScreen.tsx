import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Pressable,
  SectionList,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import { Plus, Check, Circle, Trash2, Calendar } from 'lucide-react-native';
import { useTheme } from '../../context/ThemeContext';
import {
  getTasksService,
  createTaskService,
  updateTaskService,
  deleteTaskService,
} from '../../services/planner.services';
import { Task } from '../../types/planner.types';
import ReanimatedSwipeable from 'react-native-gesture-handler/ReanimatedSwipeable';
import DateTimePickerModal from 'react-native-modal-datetime-picker';

export default function PlannerScreen() {
  const { theme } = useTheme();

  const [dueDate, setDueDate] = useState<Date | null>(null);
  const [showPicker, setShowPicker] = useState(false);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [newTitle, setNewTitle] = useState('');
  const [adding, setAdding] = useState(false);

  const currDate = new Date();
  currDate.setHours(0, 0, 0, 0);

  const fetchTasks = useCallback(async () => {
    try {
      setError('');
      const data = await getTasksService();
      setTasks(data.tasks);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Could not load tasks');
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchTasks();
    }, [fetchTasks]),
  );

  const handleConfirmDate = (date: Date) => {
    setShowPicker(false);
    setDueDate(date);
  };

  const handleCancelDate = () => {
    setShowPicker(false);
  };

  const handleAdd = async () => {
    const title = newTitle.trim();
    if (!title || adding) return;
    setAdding(true);
    try {
      const data = await createTaskService(
        title,
        undefined,
        dueDate ? dueDate.toISOString() : null,
      );
      setTasks(prev => [data.task, ...prev]);
      setNewTitle('');
      setDueDate(null);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Could not add task');
    } finally {
      setAdding(false);
    }
  };

  const handleToggle = async (task: Task) => {
    const newStatus = task.status === 'completed' ? 'pending' : 'completed';
    setTasks(prev =>
      prev.map(t => (t._id === task._id ? { ...t, status: newStatus } : t)),
    );
    try {
      await updateTaskService(task._id, { status: newStatus });
    } catch {
      setTasks(prev =>
        prev.map(t => (t._id === task._id ? { ...t, status: task.status } : t)),
      );
    }
  };

  const handleDelete = async (id: string) => {
    const previous = tasks;
    setTasks(prev => prev.filter(t => t._id !== id));
    try {
      await deleteTaskService(id);
    } catch {
      setTasks(previous);
    }
  };

  const pending = tasks.filter(t => t.status === 'pending');
  const completed = tasks.filter(t => t.status === 'completed');
  const doneCount = completed.length;
  const totalCount = tasks.length;
  const progress = totalCount > 0 ? doneCount / totalCount : 0;

  const sections = [
    { title: 'To do', data: pending },
    { title: 'Completed', data: completed },
  ].filter(s => s.data.length > 0);

  const getDueInfo = (iso: string | null) => {
    if (!iso) return null;
    const due = new Date(iso);
    const today = new Date();
    due.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);
    const diffDays = Math.round(
      (due.getTime() - today.getTime()) / (1000 * 60 * 60 * 24),
    );
    const label = due.toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric',
    });
    if (diffDays < 0) {
      return {
        text: `Overdue · ${label}`,
        color: theme.error,
        accent: theme.error,
      };
    }
    if (diffDays === 0) {
      return { text: 'Due today', color: '#F5A623', accent: '#F5A623' };
    }
    return { text: `Due ${label}`, color: theme.textSecondary, accent: null };
  };

  const renderRightActions = (id: string) => (
    <Pressable
      onPress={() => handleDelete(id)}
      style={[styles.deleteAction, { backgroundColor: theme.error }]}
    >
      <Trash2 size={22} color={theme.white} />
    </Pressable>
  );

  const renderTask = ({ item }: { item: Task }) => {
    const done = item.status === 'completed';
    const dueInfo = !done ? getDueInfo(item.dueDate) : null;
    return (
      <ReanimatedSwipeable
        renderRightActions={() => renderRightActions(item._id)}
        overshootRight={false}
      >
        <View
          style={[
            styles.taskCard,
            { backgroundColor: theme.card, opacity: done ? 0.7 : 1 },
            dueInfo?.accent
              ? { borderLeftWidth: 3, borderLeftColor: dueInfo.accent }
              : null,
          ]}
        >
          <Pressable onPress={() => handleToggle(item)} hitSlop={8}>
            {done ? (
              <View
                style={[styles.checkCircle, { backgroundColor: theme.primary }]}
              >
                <Check size={14} color={theme.white} />
              </View>
            ) : (
              <Circle size={22} color={theme.textMuted} />
            )}
          </Pressable>

          <View style={styles.taskContent}>
            <Text
              style={[
                styles.taskTitle,
                {
                  color: done ? theme.textMuted : theme.textPrimary,
                  textDecorationLine: done ? 'line-through' : 'none',
                },
              ]}
            >
              {item.title}
            </Text>
            {dueInfo ? (
              <Text style={[styles.taskDate, { color: dueInfo.color }]}>
                {dueInfo.text}
              </Text>
            ) : null}
          </View>
        </View>
      </ReanimatedSwipeable>
    );
  };

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: theme.background }]}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={styles.header}>
          <View style={styles.headerRow}>
            <Text style={[styles.heading, { color: theme.textPrimary }]}>
              Planner
            </Text>
            {totalCount > 0 ? (
              <Text
                style={[styles.progressText, { color: theme.textSecondary }]}
              >
                {doneCount} of {totalCount} done
              </Text>
            ) : null}
          </View>
          {totalCount > 0 ? (
            <View
              style={[styles.progressTrack, { backgroundColor: theme.card }]}
            >
              <View
                style={[
                  styles.progressFill,
                  {
                    backgroundColor: theme.primary,
                    width: `${progress * 100}%`,
                  },
                ]}
              />
            </View>
          ) : null}
        </View>

        {loading ? (
          <View style={styles.centerBox}>
            <ActivityIndicator color={theme.primary} />
          </View>
        ) : (
          <SectionList
            sections={sections}
            keyExtractor={item => item._id}
            renderItem={renderTask}
            renderSectionHeader={({ section }) => (
              <Text style={[styles.sectionHeader, { color: theme.textMuted }]}>
                {section.title.toUpperCase()}
              </Text>
            )}
            contentContainerStyle={styles.listContent}
            stickySectionHeadersEnabled={false}
            ListEmptyComponent={
              <View style={styles.emptyBox}>
                <Text style={[styles.emptyText, { color: theme.textMuted }]}>
                  {error || 'No tasks yet. Add one below!'}
                </Text>
              </View>
            }
          />
        )}

        <View style={[styles.addBar, { borderTopColor: theme.border }]}>
          <Pressable
            onPress={() => setShowPicker(true)}
            style={[styles.calendarButton, { backgroundColor: theme.card }]}
          >
            <Calendar
              size={20}
              color={dueDate ? theme.primary : theme.textMuted}
            />
          </Pressable>

          <View style={styles.inputWrapper}>
            <TextInput
              style={[
                styles.addInput,
                { backgroundColor: theme.card, color: theme.textPrimary },
              ]}
              value={newTitle}
              onChangeText={setNewTitle}
              placeholder="Add a task..."
              placeholderTextColor={theme.textMuted}
              onSubmitEditing={handleAdd}
            />
            {dueDate ? (
              <Text
                onPress={() => setDueDate(null)}
                style={[styles.selectedDate, { color: theme.primary }]}
              >
                Due{' '}
                {dueDate.toLocaleDateString(undefined, {
                  month: 'short',
                  day: 'numeric',
                })}
              </Text>
            ) : null}
          </View>

          <Pressable
            onPress={handleAdd}
            disabled={!newTitle.trim() || adding}
            style={[
              styles.addButton,
              {
                backgroundColor: newTitle.trim() ? theme.primary : theme.border,
              },
            ]}
          >
            <Plus size={22} color={theme.white} />
          </Pressable>
        </View>

        {showPicker && (
          <DateTimePickerModal
            isVisible={showPicker}
            mode="date"
            date={dueDate || new Date()}
            minimumDate={currDate}
            onConfirm={handleConfirmDate}
            onCancel={handleCancelDate}
          />
        )}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  flex: { flex: 1 },
  header: { paddingHorizontal: 20, paddingTop: 12, paddingBottom: 12 },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
  },
  heading: { fontSize: 22, fontWeight: '600' },
  progressText: { fontSize: 13 },
  progressTrack: {
    height: 8,
    borderRadius: 4,
    marginTop: 12,
    overflow: 'hidden',
  },
  progressFill: { height: '100%', borderRadius: 4 },
  centerBox: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  listContent: { padding: 20, paddingTop: 8, flexGrow: 1 },
  sectionHeader: {
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 0.5,
    marginBottom: 10,
    marginTop: 8,
  },
  emptyBox: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 80,
  },
  emptyText: { fontSize: 14, textAlign: 'center' },
  taskCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderRadius: 12,
    marginBottom: 10,
    gap: 12,
  },
  checkCircle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
  },
  taskContent: { flex: 1 },
  taskTitle: { fontSize: 15 },
  taskDate: { fontSize: 12, marginTop: 2, fontWeight: '500' },
  addBar: {
    flexDirection: 'row',
    padding: 12,
    gap: 8,
    borderTopWidth: 1,
    alignItems: 'center',
  },
  addInput: {
    flex: 1,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 14,
  },
  addButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  deleteAction: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 72,
    borderRadius: 12,
    marginBottom: 10,
    marginLeft: 8,
  },
  calendarButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputWrapper: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  selectedDate: {
    fontSize: 11,
    marginTop: 14,
    marginLeft: 8,
    fontWeight: '500',
  },
});
