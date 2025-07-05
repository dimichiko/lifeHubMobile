import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, SafeAreaView } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { useHabits } from '../context/HabitsContext';

const days = ['L', 'M', 'X', 'J', 'V', 'S', 'D'];
const colors = ['#222', '#FFD600', '#00FF8B'];

const HabitDetailScreen = () => {
  const navigation = useNavigation();
  const route = useRoute<RouteProp<{ params: { habitId: string } }, 'params'>>();
  const { habitId } = route.params;
  const { habits, progress, carpetas, removeHabit } = useHabits();
  const habit = habits.find(h => h.id === habitId);
  const week = habit ? progress[habit.id] || Array(7).fill(0) : Array(7).fill(0);

  if (!habit) {
    return (
      <SafeAreaView style={styles.safe}><Text style={styles.empty}>Hábito no encontrado.</Text></SafeAreaView>
    );
  }

  // Calcular racha actual
  let streak = 0;
  for (let i = week.length - 1; i >= 0; i--) {
    if (week[i] > 0) streak++;
    else break;
  }

  const carpetasHabit = carpetas.filter(c => habit.carpetaIds?.includes(c.id));

  const handleDelete = () => {
    Alert.alert('Eliminar hábito', '¿Seguro que quieres eliminar este hábito?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Eliminar', style: 'destructive', onPress: () => {
          removeHabit(habit.id);
          navigation.goBack();
        }
      }
    ]);
  };

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.headerRow}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.closeBtn}>
          <Text style={styles.closeIcon}>❌</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.content}>
        <Text style={styles.title}>{habit.emoji} {habit.name}</Text>
        <View style={styles.progressRow}>
          {week.map((val, idx) => (
            <View key={idx} style={[styles.square, { backgroundColor: colors[val] || '#222' }] }>
              <Text style={styles.day}>{days[idx]}</Text>
            </View>
          ))}
        </View>
        <Text style={styles.streak}>Racha actual: {streak} día{streak === 1 ? '' : 's'} seguidos</Text>
        <Text style={styles.sectionTitle}>Carpetas:</Text>
        <View style={styles.carpetaRow}>
          {carpetasHabit.length === 0 ? (
            <Text style={styles.carpetaChipEmpty}>Sin carpeta</Text>
          ) : (
            carpetasHabit.map(c => (
              <View key={c.id} style={[styles.carpetaChip, { backgroundColor: c.color }]}>
                <Text style={styles.carpetaChipText}>{c.nombre}</Text>
              </View>
            ))
          )}
        </View>
      </View>
      <View style={styles.bottomBtns}>
        <TouchableOpacity style={styles.editBtn} onPress={() => navigation.navigate('HabitEdit' as never, { habitId } as never)}>
          <Text style={styles.editText}>Editar hábito</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.deleteBtn} onPress={handleDelete}>
          <Text style={styles.deleteText}>Eliminar hábito</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#F9FAFB' },
  headerRow: { flexDirection: 'row', alignItems: 'center', paddingTop: 24, paddingHorizontal: 16 },
  closeBtn: { padding: 6, borderRadius: 8 },
  closeIcon: { fontSize: 26, color: '#EF4444' },
  content: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 24 },
  title: { fontSize: 28, fontWeight: 'bold', color: '#111827', marginBottom: 24, textAlign: 'center' },
  progressRow: { flexDirection: 'row', justifyContent: 'center', marginBottom: 18 },
  square: { width: 36, height: 36, borderRadius: 8, marginHorizontal: 4, alignItems: 'center', justifyContent: 'center' },
  day: { color: '#fff', fontWeight: 'bold', fontSize: 13 },
  streak: { color: '#10B981', fontWeight: 'bold', fontSize: 16, marginBottom: 18, textAlign: 'center' },
  sectionTitle: { color: '#6B7280', fontSize: 15, marginBottom: 6, fontWeight: 'bold' },
  carpetaRow: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', marginBottom: 18 },
  carpetaChip: { borderRadius: 12, paddingVertical: 6, paddingHorizontal: 14, margin: 4 },
  carpetaChipText: { color: '#fff', fontWeight: 'bold', fontSize: 14 },
  carpetaChipEmpty: { color: '#9CA3AF', fontSize: 14, fontStyle: 'italic', margin: 4 },
  bottomBtns: { padding: 24 },
  editBtn: { backgroundColor: '#6366F1', borderRadius: 10, paddingVertical: 14, alignItems: 'center', marginBottom: 14 },
  editText: { color: '#fff', fontWeight: 'bold', fontSize: 17 },
  deleteBtn: { backgroundColor: '#F3F4F6', borderRadius: 10, paddingVertical: 14, alignItems: 'center' },
  deleteText: { color: '#EF4444', fontWeight: 'bold', fontSize: 17 },
  empty: { color: '#9CA3AF', fontSize: 16, textAlign: 'center', marginTop: 40 },
});

export default HabitDetailScreen; 