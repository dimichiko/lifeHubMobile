import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  FlatList,
  LayoutAnimation,
  UIManager,
  Platform,
  Modal,
  TextInput,
  Alert,
  ScrollView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Plus, X } from 'lucide-react-native';

// Habilitar LayoutAnimation en Android
if (Platform.OS === 'android') {
  UIManager.setLayoutAnimationEnabledExperimental?.(true);
}

interface Habit {
  id: string;
  name: string;
  emoji: string;
  carpetaId?: string;
  repetitions?: number;
  weekProgress: boolean[];
}

interface Carpeta {
  id: string;
  name: string;
  color: string;
}

const COLORS = ['#EF4444', '#F59E0B', '#10B981', '#3B82F6', '#8B5CF6', '#EC4899', '#6B7280'];
const BG_DARK = '#0F0F0F';
const BG_CARD = '#1C1C1E';
const TEXT_LIGHT = '#F3F4F6';
const TEXT_SOFT = '#E5E7EB';
const PIXEL_EMPTY = '#232325';
const PIXEL_BORDER = '#232325';

// Regex para validar emojis
const EMOJI_REGEX = /\p{Extended_Pictographic}/u;

const HabitScreen = () => {
  const navigation = useNavigation();
  const [habits, setHabits] = useState<Habit[]>([]);
  const [carpetas, setCarpetas] = useState<Carpeta[]>([]);
  const [selectedCarpeta, setSelectedCarpeta] = useState('todos');
  const [showAddHabitModal, setShowAddHabitModal] = useState(false);
  const [showEditHabitModal, setShowEditHabitModal] = useState(false);
  const [showAddCarpetaModal, setShowAddCarpetaModal] = useState(false);
  const [editingHabit, setEditingHabit] = useState<Habit | null>(null);
  
  // Form states
  const [habitForm, setHabitForm] = useState({ emoji: '', name: '', carpetaId: '' });
  const [carpetaForm, setCarpetaForm] = useState({ name: '', color: COLORS[0] });

  useEffect(() => {
    loadData();
  }, []);

  // Auto-guardado cuando cambian habits o carpetas
  useEffect(() => {
    if (habits.length > 0 || habits.length === 0) {
      saveHabitsToStorage(habits);
    }
  }, [habits]);

  useEffect(() => {
    if (carpetas.length > 0 || carpetas.length === 0) {
      saveCarpetasToStorage(carpetas);
    }
  }, [carpetas]);

  const loadData = async () => {
    try {
      const habitsData = await AsyncStorage.getItem('habits');
      const carpetasData = await AsyncStorage.getItem('carpetas');
      
      if (habitsData) setHabits(JSON.parse(habitsData));
      if (carpetasData) setCarpetas(JSON.parse(carpetasData));
    } catch (error) {
      console.error('Error loading data:', error);
    }
  };

  const saveHabitsToStorage = async (newHabits: Habit[]) => {
    try {
      await AsyncStorage.setItem('habits', JSON.stringify(newHabits));
    } catch (error) {
      console.error('Error saving habits:', error);
    }
  };

  const saveCarpetasToStorage = async (newCarpetas: Carpeta[]) => {
    try {
      await AsyncStorage.setItem('carpetas', JSON.stringify(newCarpetas));
    } catch (error) {
      console.error('Error saving carpetas:', error);
    }
  };

  const saveHabits = (newHabits: Habit[]) => {
    setHabits(newHabits);
  };

  const saveCarpetas = (newCarpetas: Carpeta[]) => {
    setCarpetas(newCarpetas);
  };

  const validateEmoji = (emoji: string): boolean => {
    return EMOJI_REGEX.test(emoji.trim());
  };

  const toggleHabitDay = (habitId: string, dayIndex: number) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    
    const updatedHabits = habits.map(habit => {
      if (habit.id === habitId) {
        const newProgress = [...habit.weekProgress];
        newProgress[dayIndex] = !newProgress[dayIndex];
        return { ...habit, weekProgress: newProgress };
      }
      return habit;
    });
    
    saveHabits(updatedHabits);
  };

  const addHabit = () => {
    if (!habitForm.emoji.trim() || !habitForm.name.trim()) {
      Alert.alert('Error', 'Por favor completa todos los campos');
      return;
    }

    if (!validateEmoji(habitForm.emoji)) {
      Alert.alert('Error', 'Por favor ingresa un emoji válido');
      return;
    }

    const newHabit: Habit = {
      id: Date.now().toString(),
      emoji: habitForm.emoji.trim(),
      name: habitForm.name.trim(),
      carpetaId: habitForm.carpetaId || selectedCarpeta !== 'todos' ? selectedCarpeta : undefined,
      weekProgress: new Array(7).fill(false),
    };
    
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    saveHabits([...habits, newHabit]);
    setShowAddHabitModal(false);
    resetHabitForm();
  };

  const editHabit = () => {
    if (!editingHabit || !habitForm.emoji.trim() || !habitForm.name.trim()) {
      Alert.alert('Error', 'Por favor completa todos los campos');
      return;
    }

    if (!validateEmoji(habitForm.emoji)) {
      Alert.alert('Error', 'Por favor ingresa un emoji válido');
      return;
    }

    const updatedHabits = habits.map(habit => 
      habit.id === editingHabit.id 
        ? { 
            ...habit, 
            emoji: habitForm.emoji.trim(),
            name: habitForm.name.trim(),
            carpetaId: habitForm.carpetaId || undefined
          }
        : habit
    );
    
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    saveHabits(updatedHabits);
    setShowEditHabitModal(false);
    setEditingHabit(null);
    resetHabitForm();
  };

  const deleteHabit = (habit: Habit) => {
    Alert.alert(
      'Eliminar hábito',
      `¿Estás seguro de que quieres eliminar "${habit.name}"?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: () => {
            LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
            const updatedHabits = habits.filter(h => h.id !== habit.id);
            saveHabits(updatedHabits);
            setShowEditHabitModal(false);
            setEditingHabit(null);
            resetHabitForm();
          }
        }
      ]
    );
  };

  const addCarpeta = () => {
    if (!carpetaForm.name.trim()) {
      Alert.alert('Error', 'Por favor ingresa un nombre para la carpeta');
      return;
    }

    if (carpetas.some(c => c.name.toLowerCase() === carpetaForm.name.trim().toLowerCase())) {
      Alert.alert('Error', 'Ya existe una carpeta con ese nombre');
      return;
    }

    const newCarpeta: Carpeta = {
      id: Date.now().toString(),
      name: carpetaForm.name.trim(),
      color: carpetaForm.color,
    };
    
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    saveCarpetas([...carpetas, newCarpeta]);
    setShowAddCarpetaModal(false);
    resetCarpetaForm();
  };

  const deleteCarpeta = (carpeta: Carpeta) => {
    const habitsInCarpeta = habits.filter(h => h.carpetaId === carpeta.id);
    
    if (habitsInCarpeta.length > 0) {
      Alert.alert(
        'Carpeta con hábitos',
        `Esta carpeta contiene ${habitsInCarpeta.length} hábito(s). ¿Quieres eliminarla de todos modos?`,
        [
          { text: 'Cancelar', style: 'cancel' },
          {
            text: 'Eliminar',
            style: 'destructive',
            onPress: () => {
              LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
              const updatedCarpetas = carpetas.filter(c => c.id !== carpeta.id);
              const updatedHabits = habits.map(habit => 
                habit.carpetaId === carpeta.id 
                  ? { ...habit, carpetaId: undefined }
                  : habit
              );
              saveCarpetas(updatedCarpetas);
              saveHabits(updatedHabits);
            }
          }
        ]
      );
    } else {
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
      const updatedCarpetas = carpetas.filter(c => c.id !== carpeta.id);
      saveCarpetas(updatedCarpetas);
    }
  };

  const resetHabitForm = () => {
    setHabitForm({ emoji: '', name: '', carpetaId: '' });
  };

  const resetCarpetaForm = () => {
    setCarpetaForm({ name: '', color: COLORS[0] });
  };

  const openEditModal = (habit: Habit) => {
    setEditingHabit(habit);
    setHabitForm({
      emoji: habit.emoji,
      name: habit.name,
      carpetaId: habit.carpetaId || ''
    });
    setShowEditHabitModal(true);
  };

  const filteredHabits = selectedCarpeta === 'todos' 
    ? habits 
    : habits.filter(habit => habit.carpetaId === selectedCarpeta);

  const getDayStatus = (completed: boolean) => {
    return completed ? '🟩' : '⬛';
  };

  const renderCarpetaChip = ({ item }: { item: Carpeta | { id: string; name: string } }) => {
    const isActive = selectedCarpeta === item.id;
    const isAddButton = item.id === 'add';
    const isTodos = item.id === 'todos';
    if (isAddButton) {
      return (
        <TouchableOpacity
          style={[styles.carpetaChip, styles.addCarpetaChip]}
          onPress={() => setShowAddCarpetaModal(true)}
          activeOpacity={0.8}
        >
          <Text style={styles.addCarpetaText}>+ Añadir carpeta</Text>
        </TouchableOpacity>
      );
    }
    let chipStyle = [styles.carpetaChip, isActive ? styles.carpetaChipActive : styles.carpetaChipInactive];
    let textStyle = [styles.carpetaText, isActive ? styles.carpetaTextActive : styles.carpetaTextInactive];
    if (isActive && !isTodos && (item as Carpeta).color) {
      chipStyle.push({ backgroundColor: (item as Carpeta).color, borderColor: '#fff' });
    }
    return (
      <TouchableOpacity
        style={chipStyle}
        onPress={() => setSelectedCarpeta(item.id)}
        activeOpacity={0.8}
      >
        <Text style={textStyle}>{item.name}</Text>
      </TouchableOpacity>
    );
  };

  const renderHabitCard = ({ item }: { item: Habit }) => {
    const carpeta = carpetas.find(c => c.id === item.carpetaId);
    const color = carpeta?.color || COLORS[0];
    // Heatmap: 7 días x 2 semanas (ejemplo)
    const days = item.weekProgress;
    const rows = 2;
    const cols = 7;
    const grid = [];
    for (let r = 0; r < rows; r++) {
      const row = [];
      for (let c = 0; c < cols; c++) {
        const idx = r * cols + c;
        row.push(
          <View
            key={c}
            style={{
              width: 10, height: 10, borderRadius: 2, margin: 2,
              backgroundColor: days[idx] ? color : PIXEL_EMPTY,
              borderWidth: 1,
              borderColor: PIXEL_BORDER,
            }}
          />
        );
      }
      grid.push(<View key={r} style={{ flexDirection: 'row', marginBottom: 2 }}>{row}</View>);
    }
    return (
      <View style={styles.habitCard}>
        <View style={styles.habitCardHeader}>
          <View style={[styles.emojiCircle, { backgroundColor: color }]}> 
            <Text style={styles.habitEmoji}>{item.emoji}</Text>
          </View>
          <Text style={styles.habitName}>{item.name}</Text>
          <TouchableOpacity style={styles.cardActionBtn} onPress={() => openEditModal(item)}>
            <Text style={styles.cardActionIcon}>⋯</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.heatmapGrid}>{grid}</View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" backgroundColor="#000000" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Hábitos</Text>
        <View style={styles.headerSpacer} />
      </View>

      {/* Carpetas */}
      <View style={styles.carpetasSection}>
        <FlatList
          data={[
            { id: 'todos', name: 'Todos' },
            ...carpetas,
            { id: 'add', name: 'Añadir' }
          ]}
          renderItem={renderCarpetaChip}
          keyExtractor={item => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.carpetasList}
        />
      </View>

      {/* Lista de hábitos */}
      <View style={styles.habitsSection}>
        {filteredHabits.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>No hay hábitos aquí</Text>
            <Text style={styles.emptySubtext}>Toca + para crear tu primer hábito</Text>
          </View>
        ) : (
          <FlatList
            data={filteredHabits}
            renderItem={renderHabitCard}
            keyExtractor={item => item.id}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.habitsList}
          />
        )}
      </View>

      {/* Botón flotante */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => setShowAddHabitModal(true)}
        activeOpacity={0.8}
      >
        <Plus color="#fff" size={24} />
      </TouchableOpacity>

      {/* Modal Crear Hábito */}
      <Modal visible={showAddHabitModal} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modal}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Crear nuevo hábito</Text>
              <TouchableOpacity onPress={() => setShowAddHabitModal(false)}>
                <X color="#6B7280" size={24} />
              </TouchableOpacity>
            </View>
            
            <Text style={styles.inputLabel}>Emoji</Text>
            <TextInput
              style={[styles.input, styles.inputDark]}
              placeholder="Ej: ✅"
              placeholderTextColor={TEXT_SOFT}
              value={habitForm.emoji}
              onChangeText={(text) => setHabitForm({...habitForm, emoji: text})}
              maxLength={2}
            />
            
            <Text style={styles.inputLabel}>Nombre del hábito</Text>
            <TextInput
              style={[styles.input, styles.inputDark]}
              placeholder="Ej: Hacer ejercicio"
              placeholderTextColor={TEXT_SOFT}
              value={habitForm.name}
              onChangeText={(text) => setHabitForm({...habitForm, name: text})}
            />
            
            <Text style={styles.modalSubtitle}>Carpeta</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.carpetaSelector}>
              <TouchableOpacity
                style={[
                  styles.modalCarpetaChip,
                  !habitForm.carpetaId 
                    ? { backgroundColor: '#232325', borderColor: '#fff', borderWidth: 1 }
                    : { backgroundColor: '#18181B', borderColor: '#232325', borderWidth: 1 }
                ]}
                onPress={() => setHabitForm({...habitForm, carpetaId: ''})}
              >
                <Text style={[
                  styles.modalCarpetaText,
                  !habitForm.carpetaId ? { color: '#fff', fontWeight: '700' } : { color: TEXT_SOFT }
                ]}>
                  Sin carpeta
                </Text>
              </TouchableOpacity>
              {carpetas.map(carpeta => (
                <TouchableOpacity
                  key={carpeta.id}
                  style={[
                    styles.modalCarpetaChip,
                    habitForm.carpetaId === carpeta.id 
                      ? { backgroundColor: carpeta.color, borderColor: '#fff', borderWidth: 1 }
                      : { backgroundColor: '#18181B', borderColor: '#232325', borderWidth: 1 }
                  ]}
                  onPress={() => setHabitForm({...habitForm, carpetaId: carpeta.id})}
                >
                  <Text style={[
                    styles.modalCarpetaText,
                    habitForm.carpetaId === carpeta.id ? { color: '#fff', fontWeight: '700' } : { color: TEXT_SOFT }
                  ]}>
                    {carpeta.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
            
            <View style={styles.modalButtons}>
              <TouchableOpacity style={styles.cancelButton} onPress={() => setShowAddHabitModal(false)}>
                <Text style={styles.cancelButtonText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.saveButton} onPress={addHabit}>
                <Text style={styles.saveButtonText}>Crear</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Modal Editar Hábito */}
      <Modal visible={showEditHabitModal} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modal}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Editar hábito</Text>
              <TouchableOpacity onPress={() => setShowEditHabitModal(false)}>
                <X color="#6B7280" size={24} />
              </TouchableOpacity>
            </View>
            
            <TextInput
              style={styles.input}
              placeholder="Emoji (ej: ✅)"
              value={habitForm.emoji}
              onChangeText={(text) => setHabitForm({...habitForm, emoji: text})}
              maxLength={2}
            />
            
            <TextInput
              style={styles.input}
              placeholder="Nombre del hábito"
              value={habitForm.name}
              onChangeText={(text) => setHabitForm({...habitForm, name: text})}
            />
            
            <Text style={styles.modalSubtitle}>Carpeta (opcional)</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.carpetaSelector}>
              <TouchableOpacity
                style={[
                  styles.carpetaOption,
                  !habitForm.carpetaId && styles.carpetaOptionSelected
                ]}
                onPress={() => setHabitForm({...habitForm, carpetaId: ''})}
              >
                <Text style={[
                  styles.carpetaOptionText,
                  !habitForm.carpetaId && styles.carpetaOptionTextSelected
                ]}>
                  Sin carpeta
                </Text>
              </TouchableOpacity>
              {carpetas.map(carpeta => (
                <TouchableOpacity
                  key={carpeta.id}
                  style={[
                    styles.carpetaOption,
                    habitForm.carpetaId === carpeta.id && styles.carpetaOptionSelected,
                    { borderColor: carpeta.color }
                  ]}
                  onPress={() => setHabitForm({...habitForm, carpetaId: carpeta.id})}
                >
                  <Text style={[
                    styles.carpetaOptionText,
                    habitForm.carpetaId === carpeta.id && styles.carpetaOptionTextSelected
                  ]}>
                    {carpeta.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
            
            <View style={styles.modalButtons}>
              <TouchableOpacity 
                style={styles.deleteButton} 
                onPress={() => editingHabit && deleteHabit(editingHabit)}
              >
                <Text style={styles.deleteButtonText}>Eliminar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.saveButton} onPress={editHabit}>
                <Text style={styles.saveButtonText}>Guardar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Modal Crear Carpeta */}
      <Modal visible={showAddCarpetaModal} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modal}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Crear nueva carpeta</Text>
              <TouchableOpacity onPress={() => setShowAddCarpetaModal(false)}>
                <X color="#6B7280" size={24} />
              </TouchableOpacity>
            </View>
            
            <TextInput
              style={styles.input}
              placeholder="Nombre de la carpeta"
              value={carpetaForm.name}
              onChangeText={(text) => setCarpetaForm({...carpetaForm, name: text})}
            />
            
            <Text style={styles.modalSubtitle}>Color</Text>
            <View style={styles.colorSelector}>
              {COLORS.map(color => (
                <TouchableOpacity
                  key={color}
                  style={[
                    styles.colorOption,
                    { backgroundColor: color },
                    carpetaForm.color === color && styles.colorOptionSelected
                  ]}
                  onPress={() => setCarpetaForm({...carpetaForm, color})}
                />
              ))}
            </View>
            
            <View style={styles.modalButtons}>
              <TouchableOpacity style={styles.cancelButton} onPress={() => setShowAddCarpetaModal(false)}>
                <Text style={styles.cancelButtonText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.saveButton} onPress={addCarpeta}>
                <Text style={styles.saveButtonText}>Crear</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: BG_DARK,
  },
  header: {
    backgroundColor: BG_DARK,
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 20,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 8,
  },
  backButton: {
    padding: 8,
  },
  backIcon: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  headerTitle: {
    flex: 1,
    color: TEXT_LIGHT,
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  headerSpacer: {
    width: 40,
  },
  carpetasSection: {
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  carpetasList: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    gap: 8,
  },
  carpetaChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    minWidth: 60,
    alignItems: 'center',
    justifyContent: 'center',
  },
  carpetaText: {
    fontSize: 14,
    fontWeight: '500',
  },
  addCarpetaChip: {
    backgroundColor: '#232325',
    borderWidth: 1,
    borderColor: '#232325',
    borderStyle: 'dashed',
  },
  addCarpetaText: {
    fontSize: 14,
    color: TEXT_SOFT,
    fontWeight: '500',
  },
  habitsSection: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  habitsList: {
    paddingBottom: 100,
  },
  habitCard: {
    backgroundColor: BG_CARD,
    borderRadius: 18,
    padding: 20,
    marginBottom: 18,
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 2,
  },
  habitCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
  },
  emojiCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  habitEmoji: {
    fontSize: 22,
    color: '#fff',
  },
  habitName: {
    fontSize: 18,
    fontWeight: '600',
    color: TEXT_LIGHT,
    flex: 1,
  },
  cardActionBtn: {
    backgroundColor: 'rgba(30,30,30,0.5)',
    borderRadius: 16,
    padding: 6,
    marginLeft: 8,
  },
  cardActionIcon: {
    color: TEXT_SOFT,
    fontSize: 18,
    fontWeight: 'bold',
  },
  heatmapGrid: {
    marginTop: 2,
    marginBottom: 2,
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
  inputLabel: {
    fontSize: 15,
    color: TEXT_LIGHT,
    fontWeight: '600',
    marginBottom: 4,
    marginTop: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#232325',
    borderRadius: 12,
    paddingHorizontal: 12,
    fontSize: 16,
    marginBottom: 16,
    backgroundColor: BG_CARD,
    color: TEXT_LIGHT,
  },
  inputDark: {
    backgroundColor: BG_CARD,
    color: TEXT_LIGHT,
    borderColor: '#232325',
  },
  modalCarpetaChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    minWidth: 60,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#232325',
  },
  modalCarpetaText: {
    fontSize: 14,
    fontWeight: '500',
  },
  fab: {
    position: 'absolute',
    bottom: 30,
    right: 30,
    backgroundColor: '#000',
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 8,
  },
  fabIcon: {
    color: '#fff',
    fontSize: 28,
    fontWeight: 'bold',
  },
  modal: {
    backgroundColor: BG_CARD,
    borderRadius: 20,
    padding: 24,
    margin: 20,
    width: '90%',
    maxWidth: 400,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: TEXT_LIGHT,
  },
  modalSubtitle: {
    fontSize: 16,
    color: TEXT_SOFT,
    marginBottom: 12,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    backgroundColor: '#232325',
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: TEXT_SOFT,
  },
  saveButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    backgroundColor: '#000',
    alignItems: 'center',
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  deleteButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    backgroundColor: '#EF4444',
    alignItems: 'center',
  },
  deleteButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 18,
    color: TEXT_SOFT,
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#9CA3AF',
  },
  carpetaSelector: {
    marginBottom: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 12,
  },
  carpetaOption: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    minWidth: 60,
    alignItems: 'center',
    justifyContent: 'center',
  },
  carpetaOptionSelected: {
    backgroundColor: '#232325',
  },
  carpetaOptionText: {
    fontSize: 14,
    fontWeight: '500',
  },
  carpetaOptionTextSelected: {
    fontWeight: '700',
  },
  colorSelector: {
    marginBottom: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  colorOption: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 8,
  },
  colorOptionSelected: {
    backgroundColor: '#fff',
  },
  carpetaChipActive: {
    backgroundColor: '#fff',
    borderColor: '#fff',
  },
  carpetaChipInactive: {
    backgroundColor: '#18181B',
    borderColor: '#232325',
    borderWidth: 1,
  },
  carpetaTextActive: {
    color: BG_DARK,
    fontWeight: '600',
  },
  carpetaTextInactive: {
    color: TEXT_SOFT,
    fontWeight: '500',
  },
});

export default HabitScreen; 