import React, { useEffect, useState } from 'react';
import { Modal, View, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform, Alert, Switch } from 'react-native';
import { Habit } from '../types/habit';
import { useHabits } from '../context/HabitsContext';

interface Props {
  visible: boolean;
  onClose: () => void;
  onSave: (habit: Habit) => void;
  habitToEdit?: Habit;
}

const HabitModal: React.FC<Props> = ({ visible, onClose, onSave, habitToEdit }) => {
  const [emoji, setEmoji] = useState('');
  const [name, setName] = useState('');
  const [goal, setGoal] = useState('1');
  const [isDream, setIsDream] = useState(false);
  const { removeHabit } = useHabits();

  useEffect(() => {
    if (habitToEdit) {
      setEmoji(habitToEdit.emoji);
      setName(habitToEdit.name);
      setGoal(habitToEdit.goal.toString());
      setIsDream(habitToEdit.type === 'dream');
    } else {
      setEmoji('');
      setName('');
      setGoal('1');
      setIsDream(false);
    }
  }, [habitToEdit, visible]);

  const handleSave = () => {
    if (!name.trim() || !emoji.trim()) return;
    const habit: Habit = {
      id: habitToEdit ? habitToEdit.id : Date.now().toString(),
      name: name.trim(),
      emoji: emoji.trim(),
      goal: Number(goal) || 1,
      type: isDream ? 'dream' : 'habit',
    };
    onSave(habit);
    onClose();
  };

  const handleDelete = () => {
    if (!habitToEdit) return;
    Alert.alert(
      'Eliminar hábito',
      '¿Estás seguro?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: () => {
            removeHabit(habitToEdit.id);
            onClose();
          },
        },
      ]
    );
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
    >
      <KeyboardAvoidingView
        style={styles.centered}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={styles.modal}>
          <Text style={styles.title}>{habitToEdit ? 'Editar Hábito' : 'Nuevo Hábito'}</Text>
          <TextInput
            style={styles.input}
            placeholder="Emoji"
            value={emoji}
            onChangeText={setEmoji}
            maxLength={2}
            autoFocus
          />
          <TextInput
            style={styles.input}
            placeholder="Nombre del hábito"
            value={name}
            onChangeText={setName}
          />
          <TextInput
            style={styles.input}
            placeholder="Repeticiones por día"
            value={goal}
            onChangeText={setGoal}
            keyboardType="numeric"
          />
          <View style={styles.toggleRow}>
            <Text style={styles.toggleLabel}>Este hábito es de tipo sueño</Text>
            <Switch value={isDream} onValueChange={setIsDream} />
          </View>
          <View style={styles.row}>
            <TouchableOpacity style={styles.saveBtn} onPress={handleSave} activeOpacity={0.8}>
              <Text style={styles.saveText}>Guardar</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.cancelBtn} onPress={onClose} activeOpacity={0.7}>
              <Text style={styles.cancelText}>Cancelar</Text>
            </TouchableOpacity>
          </View>
          {habitToEdit && (
            <TouchableOpacity style={styles.deleteBtn} onPress={handleDelete} activeOpacity={0.7}>
              <Text style={styles.deleteText}>🗑 Eliminar</Text>
            </TouchableOpacity>
          )}
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.18)',
  },
  modal: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 24,
    width: '88%',
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 8,
  },
  title: {
    color: '#111827',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 18,
    textAlign: 'center',
  },
  input: {
    backgroundColor: '#F3F4F6',
    color: '#111827',
    borderRadius: 8,
    padding: 10,
    marginBottom: 14,
    fontSize: 16,
  },
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
    justifyContent: 'space-between',
  },
  toggleLabel: {
    color: '#111827',
    fontSize: 15,
    marginRight: 8,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  saveBtn: {
    flex: 1,
    backgroundColor: '#111827',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
    marginRight: 6,
  },
  saveText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  cancelBtn: {
    flex: 1,
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
    marginLeft: 6,
  },
  cancelText: {
    color: '#111827',
    fontWeight: 'bold',
    fontSize: 16,
  },
  deleteBtn: {
    marginTop: 18,
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  deleteText: {
    color: '#EF4444',
    fontWeight: 'bold',
    fontSize: 16,
    textAlign: 'center',
  },
});

export default HabitModal; 