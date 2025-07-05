import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  LayoutAnimation,
  UIManager,
  Platform,
  Alert,
  Modal,
  TextInput,
  Vibration,
  Animated,
  ScrollView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Settings } from 'lucide-react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { format, addDays, differenceInMinutes, parseISO } from 'date-fns';

// Habilitar LayoutAnimation en Android
if (Platform.OS === 'android') {
  UIManager.setLayoutAnimationEnabledExperimental?.(true);
}

type SleepEntry = {
  start: Date | null;
  end: Date | null;
  duration: number | null;
};

const SleepScreen = () => {
  const navigation = useNavigation();
  
  // Estado principal del historial
  const [sleepHistory, setSleepHistory] = useState<Record<string, SleepEntry>>({});
  const [sleepGoal, setSleepGoal] = useState(8);
  const [showGoalModal, setShowGoalModal] = useState(false);
  const [showSleepModal, setShowSleepModal] = useState(false);
  const [goalInput, setGoalInput] = useState('');

  // Estados para registro de sueño
  const [sleepStart, setSleepStart] = useState<Date | null>(null);
  const [sleepEnd, setSleepEnd] = useState<Date | null>(null);
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);

  // Estados para editar historial
  const [showPicker, setShowPicker] = useState(false);
  const [pickerType, setPickerType] = useState<'start' | 'end'>('start');
  const [pickerValue, setPickerValue] = useState(new Date());
  const [editingDateKey, setEditingDateKey] = useState<string | null>(null);

  // Animaciones
  const moonAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    loadSleepData();
  }, []);

  useEffect(() => {
    animateMoon();
  }, [sleepHistory, sleepGoal]);

  const loadSleepData = async () => {
    try {
      const sleepData = await AsyncStorage.getItem('sleepHistory');
      const goalData = await AsyncStorage.getItem('sleepGoal');
      
      if (sleepData) {
        const parsedData = JSON.parse(sleepData);
        // Convertir strings de fecha a objetos Date
        const convertedData: Record<string, SleepEntry> = {};
        Object.keys(parsedData).forEach(dateKey => {
          const entry = parsedData[dateKey];
          convertedData[dateKey] = {
            start: entry.start ? parseISO(entry.start) : null,
            end: entry.end ? parseISO(entry.end) : null,
            duration: entry.duration || null,
          };
        });
        setSleepHistory(convertedData);
      }
      
      if (goalData) {
        setSleepGoal(JSON.parse(goalData));
      }
    } catch (error) {
      console.error('Error loading sleep data:', error);
    }
  };

  const animateMoon = () => {
    // Animación de rotación suave de la luna
    Animated.loop(
      Animated.timing(moonAnim, {
        toValue: 1,
        duration: 3000,
        useNativeDriver: true,
      })
    ).start();

    // Animación de pulso si se cumple el objetivo
    const todayKey = format(new Date(), 'yyyy-MM-dd');
    const todayEntry = sleepHistory[todayKey];
    if (todayEntry?.duration && todayEntry.duration >= sleepGoal * 60) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.1,
            duration: 500,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
          }),
        ])
      ).start();
    } else {
      pulseAnim.setValue(1);
    }
  };

  // Función central para actualizar datos de sueño
  const updateSleepData = async (field: 'start' | 'end', value: Date) => {
    const key = format(new Date(), 'yyyy-MM-dd');
    const prev = sleepHistory[key] || { start: null, end: null, duration: null };
    const updated = { ...prev, [field]: value };

    console.log('updateSleepData:', { field, value, key, prev, updated });

    if (updated.start && updated.end) {
      let end = updated.end;
      if (end < updated.start) end = addDays(end, 1);
      const duration = differenceInMinutes(end, updated.start);
      
      console.log('Calculated duration:', duration, 'minutes');
      
      if (duration < 60) {
        Alert.alert("Error", "La duración del sueño debe ser al menos 1 hora");
        return;
      }
      updated.duration = duration;
    }

    const newHistory = { ...sleepHistory, [key]: updated };
    setSleepHistory(newHistory);
    
    try {
      await AsyncStorage.setItem('sleepHistory', JSON.stringify(newHistory));
      console.log('Saved to AsyncStorage:', newHistory[key]);
    } catch (error) {
      console.error('Error saving sleep data:', error);
    }
  };

  const openPicker = (type: 'start' | 'end', dateKey?: string) => {
    const key = dateKey || format(new Date(), 'yyyy-MM-dd');
    const entry = sleepHistory[key] || { start: null, end: null, duration: null };
    
    setPickerType(type);
    setEditingDateKey(key);
    
    // Establecer valor inicial del picker
    if (type === 'start' && entry.start) {
      setPickerValue(entry.start);
    } else if (type === 'end' && entry.end) {
      setPickerValue(entry.end);
    } else {
      setPickerValue(new Date());
    }
    
    setShowPicker(true);
  };

  const onPickerChange = async (event: any, selectedDate?: Date) => {
    setShowPicker(false);
    
    if (!selectedDate) return; // Cancelar sin hacer nada
    
    const key = editingDateKey || format(new Date(), 'yyyy-MM-dd');
    const entry = sleepHistory[key] || { start: null, end: null, duration: null };
    
    // Actualizar el campo correspondiente
    entry[pickerType] = selectedDate;
    
    // Calcular duración si ambos horarios existen
    if (entry.start && entry.end) {
      let end = entry.end;
      if (end < entry.start) {
        end = addDays(end, 1);
      }
      entry.duration = differenceInMinutes(end, entry.start);
      
      // Validar duración mínima
      if (entry.duration < 60) {
        Alert.alert('Error', 'La duración del sueño debe ser al menos 1 hora');
        return;
      }
    }
    
    // Actualizar estado con copia inmutable
    const newHistory = { ...sleepHistory, [key]: entry };
    setSleepHistory(newHistory);
    
    // Persistir en AsyncStorage
    try {
      await AsyncStorage.setItem('sleepHistory', JSON.stringify(newHistory));
      
      // Haptic feedback
      if (Platform.OS === 'ios') {
        Vibration.vibrate(50);
      } else {
        Vibration.vibrate(100);
      }
      
      // Mostrar notificación si cumple el objetivo
      if (entry.duration && entry.duration >= sleepGoal * 60) {
        Alert.alert('¡Excelente! 🌙', `¡Dormiste ${formatDuration(entry.duration)} hoy!`);
      }
    } catch (error) {
      console.error('Error saving sleep data:', error);
    }
  };

  const handleSaveSleep = async () => {
    if (!sleepStart || !sleepEnd) {
      Alert.alert('Error', 'Debes seleccionar hora de inicio y fin');
      return;
    }

    await updateSleepData('start', sleepStart);
    await updateSleepData('end', sleepEnd);
    
    // Limpiar estados del modal
    setSleepStart(null);
    setSleepEnd(null);
    setShowSleepModal(false);
    
    // Haptic feedback
    if (Platform.OS === 'ios') {
      Vibration.vibrate(50);
    } else {
      Vibration.vibrate(100);
    }
  };

  const formatDuration = (minutes: number): string => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    
    if (mins === 0) {
      return `${hours}h`;
    } else {
      return `${hours}h ${mins}min`;
    }
  };

  const formatTime = (date: Date): string => {
    return format(date, 'HH:mm');
  };

  const saveGoal = async () => {
    const newGoal = parseFloat(goalInput);
    
    if (isNaN(newGoal) || newGoal < 4 || newGoal > 12) {
      Alert.alert('Error', 'El objetivo debe estar entre 4 y 12 horas');
      return;
    }

    try {
      await AsyncStorage.setItem('sleepGoal', JSON.stringify(newGoal));
      setSleepGoal(newGoal);
      setShowGoalModal(false);
      setGoalInput('');
    } catch (error) {
      console.error('Error saving goal:', error);
    }
  };

  const getDayName = (dateString: string) => {
    const date = new Date(dateString);
    return format(date, 'EEE').toUpperCase();
  };

  const getMotivationalMessage = () => {
    const todayKey = format(new Date(), 'yyyy-MM-dd');
    const todayEntry = sleepHistory[todayKey];
    
    if (!todayEntry?.duration) {
      return { text: 'Registra cómo dormiste hoy', color: '#6B7280' };
    }
    
    const hours = todayEntry.duration / 60;
    const goalHours = sleepGoal;
    const remaining = goalHours - hours;
    
    if (hours >= goalHours) {
      return { text: '¡Dormiste suficiente! 🎉', color: '#10B981' };
    } else if (remaining <= 1) {
      return { text: `Te faltaron ${Math.round(remaining * 60)}min 😴`, color: '#F59E0B' };
    } else {
      return { text: `Te faltaron ${Math.round(remaining * 60)}min 😴`, color: '#A5B4FC' };
    }
  };

  const getWeeklyStats = () => {
    const entries = Object.values(sleepHistory);
    const daysWithDuration = entries.filter(entry => entry.duration);
    
    if (daysWithDuration.length === 0) return null;
    
    const totalMinutes = daysWithDuration.reduce((sum, entry) => sum + (entry.duration || 0), 0);
    const averageMinutes = Math.round(totalMinutes / daysWithDuration.length);
    const averageHours = Math.round((averageMinutes / 60) * 10) / 10;
    
    // Calcular racha de días consecutivos que cumplen la meta
    let streak = 0;
    const sortedDates = Object.keys(sleepHistory).sort();
    
    for (let i = sortedDates.length - 1; i >= 0; i--) {
      const entry = sleepHistory[sortedDates[i]];
      if (entry?.duration && entry.duration >= sleepGoal * 60) {
        streak++;
      } else {
        break;
      }
    }
    
    return { averageHours, streak };
  };

  const renderProgressBar = (minutes: number, goalHours: number) => {
    const goalMinutes = goalHours * 60;
    const progress = Math.min(minutes / goalMinutes, 1);
    const isCompleted = minutes >= goalMinutes;
    
    return (
      <View style={styles.progressBarContainer}>
        <View style={[
          styles.progressBar, 
          { 
            width: `${progress * 100}%`,
            backgroundColor: isCompleted ? '#3B82F6' : '#A5B4FC'
          }
        ]} />
      </View>
    );
  };

  const getWeeklyHistory = () => {
    const today = new Date();
    const weekDates = [];
    
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      weekDates.push(format(date, 'yyyy-MM-dd'));
    }
    
    return weekDates;
  };

  const weeklyStats = getWeeklyStats();
  const motivationalMessage = getMotivationalMessage();
  const todayKey = format(new Date(), 'yyyy-MM-dd');
  const todayEntry = sleepHistory[todayKey];

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" backgroundColor="#000000" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Dormir</Text>
        <TouchableOpacity style={styles.settingsButton} onPress={() => setShowGoalModal(true)}>
          <Settings color="#fff" size={24} />
        </TouchableOpacity>
      </View>

      {/* Contenido principal */}
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Contador diario con luna animada */}
        <View style={styles.counterSection}>
          <Animated.View 
            style={[
              styles.moonContainer,
              {
                transform: [
                  {
                    rotate: moonAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: ['0deg', '360deg'],
                    })
                  },
                  { scale: pulseAnim }
                ]
              }
            ]}
          >
            <Text style={styles.moonEmoji}>🌙</Text>
          </Animated.View>
          
          {todayEntry?.duration ? (
            <>
              <Text style={styles.counterTitle}>Dormiste</Text>
              <Text style={styles.counterNumber}>{formatDuration(todayEntry.duration)}</Text>
              <Text style={styles.objectiveText}>Objetivo: {sleepGoal}h</Text>
            </>
          ) : (
            <>
              <Text style={styles.counterTitle}>Horas de sueño hoy</Text>
              <Text style={styles.counterNumber}>--</Text>
              <Text style={styles.objectiveText}>Objetivo: {sleepGoal}h</Text>
            </>
          )}
          
          <TouchableOpacity 
            style={styles.addButton} 
            onPress={() => setShowSleepModal(true)} 
            activeOpacity={0.8}
          >
            <Text style={styles.addButtonText}>Registrar sueño</Text>
          </TouchableOpacity>
        </View>

        {/* Objetivo diario */}
        <View style={styles.goalSection}>
          {todayEntry?.duration && todayEntry.duration >= sleepGoal * 60 && (
            <Text style={styles.goalAchieved}>¡Meta cumplida! 🎉</Text>
          )}
          {todayEntry?.duration && (
            <View style={styles.goalProgress}>
              {renderProgressBar(todayEntry.duration, sleepGoal)}
            </View>
          )}
        </View>

        {/* Mensaje motivacional */}
        <View style={styles.motivationSection}>
          <Text style={[styles.motivationText, { color: motivationalMessage.color }]}>
            {motivationalMessage.text}
          </Text>
        </View>

        {/* Historial semanal */}
        <View style={styles.historySection}>
          <Text style={styles.historyTitle}>Tu semana</Text>
          
          {weeklyStats && (
            <View style={styles.statsContainer}>
              <Text style={styles.statsText}>
                Promedio semanal: {weeklyStats.averageHours}h
              </Text>
              <Text style={styles.statsText}>
                Racha: {weeklyStats.streak} día{weeklyStats.streak !== 1 ? 's' : ''} consecutivo{weeklyStats.streak !== 1 ? 's' : ''} cumpliendo meta
              </Text>
            </View>
          )}
          
          <View style={styles.historyList}>
            {getWeeklyHistory().map((dateKey) => {
              const entry = sleepHistory[dateKey];
              return (
                <View key={dateKey} style={styles.historyItem}>
                  <Text style={styles.dayName}>{getDayName(dateKey)}</Text>
                  
                  {/* Botones de horarios */}
                  <View style={styles.timeButtonsContainer}>
                    <TouchableOpacity 
                      style={styles.timeButton}
                      onPress={() => openPicker('start', dateKey)}
                    >
                      <Text style={styles.timeButtonText}>
                        {entry?.start ? formatTime(entry.start) : '--:--'}
                      </Text>
                    </TouchableOpacity>
                    
                    <Text style={styles.timeSeparator}>→</Text>
                    
                    <TouchableOpacity 
                      style={styles.timeButton}
                      onPress={() => openPicker('end', dateKey)}
                    >
                      <Text style={styles.timeButtonText}>
                        {entry?.end ? formatTime(entry.end) : '--:--'}
                      </Text>
                    </TouchableOpacity>
                  </View>
                  
                  <View style={styles.historyProgress}>
                    {entry?.duration ? renderProgressBar(entry.duration, sleepGoal) : (
                      <View style={styles.progressBarContainer}>
                        <View style={[styles.progressBar, { width: '0%' }]} />
                      </View>
                    )}
                  </View>
                  
                  <Text style={styles.hoursCount}>
                    {entry?.duration ? formatDuration(entry.duration) : '--'}
                  </Text>
                </View>
              );
            })}
          </View>
        </View>
      </ScrollView>

      {/* Modal de registro de sueño */}
      <Modal visible={showSleepModal} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modal}>
            <Text style={styles.modalTitle}>Registrar sueño</Text>
            
            {/* Hora de dormir */}
            <View style={styles.timeSection}>
              <Text style={styles.timeLabel}>¿A qué hora te acostaste?</Text>
              <TouchableOpacity 
                style={styles.modalTimeButton}
                onPress={() => setShowStartPicker(true)}
              >
                <Text style={styles.modalTimeButtonText}>
                  {sleepStart ? formatTime(sleepStart) : '--:--'}
                </Text>
              </TouchableOpacity>
            </View>

            {/* Hora de despertar */}
            <View style={styles.timeSection}>
              <Text style={styles.timeLabel}>¿A qué hora te despertaste?</Text>
              <TouchableOpacity 
                style={styles.modalTimeButton}
                onPress={() => setShowEndPicker(true)}
              >
                <Text style={styles.modalTimeButtonText}>
                  {sleepEnd ? formatTime(sleepEnd) : '--:--'}
                </Text>
              </TouchableOpacity>
            </View>

            {/* Duración calculada */}
            {sleepStart && sleepEnd && (
              <View style={styles.durationPreview}>
                <Text style={styles.durationText}>
                  Duración: {formatDuration(differenceInMinutes(sleepEnd < sleepStart ? addDays(sleepEnd, 1) : sleepEnd, sleepStart))}
                </Text>
              </View>
            )}
            
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => {
                  setShowSleepModal(false);
                  setSleepStart(null);
                  setSleepEnd(null);
                }}
              >
                <Text style={styles.cancelButtonText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.saveButton,
                  (!sleepStart || !sleepEnd) && styles.saveButtonDisabled
                ]}
                onPress={handleSaveSleep}
                disabled={!sleepStart || !sleepEnd}
              >
                <Text style={styles.saveButtonText}>Guardar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Modal para editar objetivo */}
      <Modal visible={showGoalModal} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modal}>
            <Text style={styles.modalTitle}>Editar objetivo diario</Text>
            <Text style={styles.modalSubtitle}>¿Cuántas horas quieres dormir al día?</Text>
            
            <TextInput
              style={styles.goalInput}
              placeholder={`${sleepGoal}`}
              value={goalInput}
              onChangeText={setGoalInput}
              keyboardType="numeric"
              maxLength={4}
            />
            
            <Text style={styles.modalHint}>Mínimo: 4, Máximo: 12 (ej: 7.5)</Text>
            
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => {
                  setShowGoalModal(false);
                  setGoalInput('');
                }}
              >
                <Text style={styles.cancelButtonText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.saveButton}
                onPress={saveGoal}
              >
                <Text style={styles.saveButtonText}>Guardar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* TimePickers para registro de sueño */}
      {showStartPicker && (
        <DateTimePicker
          mode="time"
          is24Hour
          value={sleepStart || new Date()}
          onChange={(event, selectedDate) => {
            setShowStartPicker(false);
            if (!selectedDate) return;
            setSleepStart(selectedDate);
            updateSleepData('start', selectedDate);
          }}
        />
      )}

      {showEndPicker && (
        <DateTimePicker
          mode="time"
          is24Hour
          value={sleepEnd || new Date()}
          onChange={(event, selectedDate) => {
            setShowEndPicker(false);
            if (!selectedDate) return;
            setSleepEnd(selectedDate);
            updateSleepData('end', selectedDate);
          }}
        />
      )}

      {/* TimePicker para editar historial */}
      {showPicker && (
        <DateTimePicker
          value={pickerValue}
          mode="time"
          is24Hour={true}
          display="default"
          onChange={onPickerChange}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    backgroundColor: '#000000',
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
    color: '#fff',
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  settingsButton: {
    padding: 8,
  },
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 32,
    paddingBottom: 40,
  },
  counterSection: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  moonContainer: {
    marginBottom: 24,
  },
  moonEmoji: {
    fontSize: 64,
  },
  counterTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 8,
  },
  counterNumber: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 8,
  },
  objectiveText: {
    fontSize: 16,
    color: '#6B7280',
    marginBottom: 24,
  },
  addButton: {
    backgroundColor: '#000000',
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  goalSection: {
    alignItems: 'center',
    marginBottom: 24,
  },
  goalAchieved: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#10B981',
    marginBottom: 8,
  },
  goalProgress: {
    width: '80%',
    height: 12,
    backgroundColor: '#E5E7EB',
    borderRadius: 8,
    overflow: 'hidden',
  },
  progressBarContainer: {
    width: '100%',
    height: 12,
    backgroundColor: '#E5E7EB',
    borderRadius: 8,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#A5B4FC',
    borderRadius: 8,
  },
  motivationSection: {
    alignItems: 'center',
    marginBottom: 32,
  },
  motivationText: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  historySection: {
    marginTop: 20,
  },
  historyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 16,
  },
  statsContainer: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  statsText: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 4,
  },
  historyList: {
    gap: 12,
  },
  historyItem: {
    paddingVertical: 16,
    paddingHorizontal: 20,
    backgroundColor: '#fff',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  dayName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6B7280',
    marginBottom: 12,
  },
  timeButtonsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  timeButton: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: '#F9FAFB',
    minWidth: 60,
    alignItems: 'center',
  },
  timeButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
  },
  timeSeparator: {
    fontSize: 16,
    color: '#6B7280',
    marginHorizontal: 12,
  },
  historyProgress: {
    marginBottom: 8,
  },
  hoursCount: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    textAlign: 'right',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modal: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 24,
    margin: 20,
    width: '90%',
    maxWidth: 400,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 20,
    textAlign: 'center',
  },
  timeSection: {
    marginBottom: 20,
  },
  timeLabel: {
    fontSize: 16,
    color: '#6B7280',
    marginBottom: 8,
  },
  modalTimeButton: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 12,
    padding: 16,
    backgroundColor: '#F9FAFB',
    alignItems: 'center',
  },
  modalTimeButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
  },
  durationPreview: {
    backgroundColor: '#F3F4F6',
    padding: 16,
    borderRadius: 12,
    marginBottom: 24,
    alignItems: 'center',
  },
  durationText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#111827',
  },
  modalSubtitle: {
    fontSize: 16,
    color: '#6B7280',
    marginBottom: 20,
  },
  goalInput: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 12,
    padding: 12,
    fontSize: 18,
    textAlign: 'center',
    backgroundColor: '#F9FAFB',
    marginBottom: 8,
  },
  modalHint: {
    fontSize: 14,
    color: '#9CA3AF',
    textAlign: 'center',
    marginBottom: 24,
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6B7280',
  },
  saveButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    backgroundColor: '#000000',
    alignItems: 'center',
  },
  saveButtonDisabled: {
    backgroundColor: '#D1D5DB',
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
});

export default SleepScreen; 