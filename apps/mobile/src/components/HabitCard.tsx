import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, TextInput, LayoutAnimation, Platform, UIManager } from 'react-native';
import { Habit } from '../types/habit';
import { useHabits } from '../context/HabitsContext';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

interface Props {
  habit: Habit;
}

const getTodayIdx = () => {
  const d = new Date();
  return (d.getDay() + 6) % 7; // Lunes=0, Domingo=6
};

const colors = ['#222', '#FFD600', '#00FF8B'];

const HabitCard: React.FC<Props> = ({ habit }) => {
  const { progress, setCheck, dreamLogs, saveDream } = useHabits();
  const week = progress[habit.id] || Array(7).fill(0);
  const today = getTodayIdx();
  const [dreamModal, setDreamModal] = useState(false);
  const [dreamText, setDreamText] = useState('');

  const hasDream = dreamLogs[habit.id]?.[today];

  const handleCheck = (idx: number) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setCheck(habit.id, idx);
  };

  const handleDreamSave = () => {
    saveDream(habit.id, today, dreamText);
    setDreamModal(false);
    setDreamText('');
  };

  if (habit.type === 'dream') {
    return (
      <View style={styles.card}>
        <Text style={styles.emoji}>{habit.emoji}</Text>
        <Text style={styles.name}>{habit.name}</Text>
        <TouchableOpacity style={styles.dreamBtn} onPress={() => setDreamModal(true)}>
          <Text style={styles.dreamBtnText}>{hasDream ? '📓 Editar sueño' : 'Registrar sueño'}</Text>
        </TouchableOpacity>
        <Modal visible={dreamModal} animationType="slide" transparent>
          <View style={styles.dreamModalBg}>
            <View style={styles.dreamModalBox}>
              <Text style={styles.dreamModalTitle}>¿Cómo dormiste hoy?</Text>
              <TextInput
                style={styles.dreamInput}
                placeholder="Escribe tu sueño..."
                value={dreamText}
                onChangeText={setDreamText}
                multiline
                numberOfLines={3}
              />
              <View style={{ flexDirection: 'row', marginTop: 12 }}>
                <TouchableOpacity style={styles.saveDreamBtn} onPress={handleDreamSave}>
                  <Text style={styles.saveDreamText}>Guardar</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.cancelDreamBtn} onPress={() => setDreamModal(false)}>
                  <Text style={styles.cancelDreamText}>Cancelar</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
        {hasDream && <Text style={styles.dreamIcon}>📓</Text>}
      </View>
    );
  }

  return (
    <View style={styles.card}>
      <Text style={styles.emoji}>{habit.emoji}</Text>
      <Text style={styles.name}>{habit.name}</Text>
      <View style={styles.row}>
        {week.map((val, idx) => (
          <TouchableOpacity
            key={idx}
            style={[styles.square, { backgroundColor: colors[val] || '#222', borderWidth: idx === today ? 2 : 0, borderColor: '#00FF8B' }]}
            disabled={idx !== today}
            onPress={() => handleCheck(idx)}
          />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#1e1e1e',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
    position: 'relative',
  },
  emoji: { fontSize: 32, marginRight: 12 },
  name: { color: '#fff', fontSize: 18, flex: 1 },
  row: { flexDirection: 'row', gap: 6 },
  square: {
    width: 28,
    height: 28,
    borderRadius: 6,
    marginHorizontal: 2,
    backgroundColor: '#222',
  },
  dreamBtn: {
    backgroundColor: '#FFD600',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dreamBtnText: {
    color: '#222',
    fontWeight: 'bold',
    fontSize: 15,
  },
  dreamIcon: {
    position: 'absolute',
    right: 12,
    bottom: 12,
    fontSize: 22,
  },
  dreamModalBg: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.25)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dreamModalBox: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 24,
    width: '85%',
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 8,
  },
  dreamModalTitle: {
    color: '#111827',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  dreamInput: {
    backgroundColor: '#F3F4F6',
    color: '#111827',
    borderRadius: 8,
    padding: 10,
    minHeight: 60,
    fontSize: 15,
  },
  saveDreamBtn: {
    flex: 1,
    backgroundColor: '#111827',
    borderRadius: 8,
    padding: 10,
    alignItems: 'center',
    marginRight: 6,
  },
  saveDreamText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 15,
  },
  cancelDreamBtn: {
    flex: 1,
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    padding: 10,
    alignItems: 'center',
    marginLeft: 6,
  },
  cancelDreamText: {
    color: '#111827',
    fontWeight: 'bold',
    fontSize: 15,
  },
});

export default HabitCard; 