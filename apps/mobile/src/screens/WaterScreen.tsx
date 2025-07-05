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
  Dimensions,
  ScrollView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Settings } from 'lucide-react-native';

// Habilitar LayoutAnimation en Android
if (Platform.OS === 'android') {
  UIManager.setLayoutAnimationEnabledExperimental?.(true);
}

const { width: screenWidth } = Dimensions.get('window');

interface WaterDay {
  date: string;
  glasses: number;
}

const WaterScreen = () => {
  const navigation = useNavigation();
  const [todayGlasses, setTodayGlasses] = useState(0);
  const [weeklyHistory, setWeeklyHistory] = useState<WaterDay[]>([]);
  const [dailyGoal, setDailyGoal] = useState(8);
  const [showGoalModal, setShowGoalModal] = useState(false);
  const [goalInput, setGoalInput] = useState('');

  // Animaciones
  const waterLevelAnim = useRef(new Animated.Value(0)).current;
  const dropAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const initializeData = async () => {
      await loadWaterData();
      await checkDailyReset();
    };
    initializeData();
  }, []);

  useEffect(() => {
    animateWaterLevel();
  }, [todayGlasses, dailyGoal]);

  const animateWaterLevel = () => {
    const progress = Math.min(todayGlasses / dailyGoal, 1);
    Animated.timing(waterLevelAnim, {
      toValue: progress,
      duration: 800,
      useNativeDriver: false,
    }).start();

    // Animación de pulso si se cumple el objetivo
    if (todayGlasses >= dailyGoal) {
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

  const animateDrop = () => {
    dropAnim.setValue(0);
    Animated.timing(dropAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  };

  const checkDailyReset = async () => {
    const today = new Date().toISOString().split('T')[0];
    const lastDate = await AsyncStorage.getItem('lastWaterDate');
    
    if (lastDate !== today) {
      setTodayGlasses(0);
      await AsyncStorage.setItem('lastWaterDate', today);
    }
  };

  const loadWaterData = async () => {
    try {
      const today = new Date().toISOString().split('T')[0];
      const waterData = await AsyncStorage.getItem('waterData');
      const goalData = await AsyncStorage.getItem('waterGoal');
      
      if (waterData) {
        const data = JSON.parse(waterData);
        const todayData = data.find((day: WaterDay) => day.date === today);
        setTodayGlasses(todayData?.glasses || 0);
        setWeeklyHistory(data);
      }
      
      if (goalData) {
        setDailyGoal(JSON.parse(goalData));
      }
    } catch (error) {
      console.error('Error loading water data:', error);
    }
  };

  const saveWaterData = async (newGlasses: number) => {
    try {
      const today = new Date().toISOString().split('T')[0];
      const updatedHistory = [...weeklyHistory];
      const todayIndex = updatedHistory.findIndex(day => day.date === today);
      
      if (todayIndex >= 0) {
        updatedHistory[todayIndex].glasses = newGlasses;
      } else {
        updatedHistory.push({ date: today, glasses: newGlasses });
      }
      
      // Mantener solo los últimos 7 días
      const last7Days = updatedHistory.slice(-7);
      
      await AsyncStorage.setItem('waterData', JSON.stringify(last7Days));
      setWeeklyHistory(last7Days);
      setTodayGlasses(newGlasses);
    } catch (error) {
      console.error('Error saving water data:', error);
    }
  };

  const addGlass = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    const newCount = todayGlasses + 1;
    saveWaterData(newCount);
    
    // Animación de gota
    animateDrop();
    
    // Haptic feedback
    if (Platform.OS === 'ios') {
      Vibration.vibrate(50);
    } else {
      Vibration.vibrate(100);
    }
    
    // Mostrar notificación cada 5 vasos
    if (newCount % 5 === 0) {
      Alert.alert('¡Bien hecho! 🎉', `¡Has tomado ${newCount} vasos de agua hoy!`);
    }
  };

  const saveGoal = async () => {
    const newGoal = parseInt(goalInput);
    
    if (isNaN(newGoal) || newGoal < 4 || newGoal > 20) {
      Alert.alert('Error', 'El objetivo debe estar entre 4 y 20 vasos');
      return;
    }

    try {
      await AsyncStorage.setItem('waterGoal', JSON.stringify(newGoal));
      setDailyGoal(newGoal);
      setShowGoalModal(false);
      setGoalInput('');
    } catch (error) {
      console.error('Error saving goal:', error);
    }
  };

  const getDayName = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', { weekday: 'short' }).toUpperCase();
  };

  const getMotivationalMessage = () => {
    const progress = todayGlasses / dailyGoal;
    const remaining = dailyGoal - todayGlasses;
    
    if (todayGlasses >= dailyGoal) {
      return { text: '¡Meta diaria cumplida! 🎉', color: '#10B981' };
    } else if (progress >= 0.7) {
      return { text: `¡Solo ${remaining} más para tu meta 💪`, color: '#F59E0B' };
    } else if (progress >= 0.5) {
      return { text: '¡Buen ritmo! 🚀', color: '#3B82F6' };
    } else {
      return { text: '¡Aún puedes más!', color: '#6B7280' };
    }
  };

  const getWeeklyStats = () => {
    if (weeklyHistory.length === 0) return null;
    
    const totalGlasses = weeklyHistory.reduce((sum, day) => sum + day.glasses, 0);
    const average = Math.round(totalGlasses / weeklyHistory.length);
    
    // Calcular racha de días consecutivos que cumplen la meta
    let streak = 0;
    const sortedDays = [...weeklyHistory].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    
    for (let i = sortedDays.length - 1; i >= 0; i--) {
      if (sortedDays[i].glasses >= dailyGoal) {
        streak++;
      } else {
        break;
      }
    }
    
    return { average, streak };
  };

  const renderProgressBar = (glasses: number, goal: number) => {
    const progress = Math.min(glasses / goal, 1);
    const isCompleted = glasses >= goal;
    
    return (
      <View style={styles.progressBarContainer}>
        <View style={[styles.progressBar, { width: `${progress * 100}%` }]} />
      </View>
    );
  };

  const weeklyStats = getWeeklyStats();
  const motivationalMessage = getMotivationalMessage();

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" backgroundColor="#000000" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Agua</Text>
        <TouchableOpacity style={styles.settingsButton} onPress={() => setShowGoalModal(true)}>
          <Settings color="#fff" size={24} />
        </TouchableOpacity>
      </View>

      {/* Contenido principal */}
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Contador diario con barra de agua */}
        <View style={styles.counterSection}>
          <View style={styles.waterContainer}>
            {/* Barra de agua animada */}
            <View style={styles.waterBarContainer}>
              <View style={styles.waterBarBackground}>
                <Animated.View 
                  style={[
                    styles.waterBar,
                    {
                      height: waterLevelAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: ['0%', '100%'],
                      }),
                    }
                  ]}
                />
              </View>
              <Animated.View 
                style={[
                  styles.waterEmojiContainer,
                  { transform: [{ scale: pulseAnim }] }
                ]}
              >
                <Text style={styles.waterEmoji}>💧</Text>
              </Animated.View>
            </View>
            
            {/* Animación de gota */}
            <Animated.View
              style={[
                styles.dropAnimation,
                {
                  opacity: dropAnim.interpolate({
                    inputRange: [0, 0.5, 1],
                    outputRange: [1, 0.5, 0],
                  }),
                  transform: [{
                    translateY: dropAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0, 100],
                    })
                  }]
                }
              ]}
            >
              <Text style={styles.dropEmoji}>💧</Text>
            </Animated.View>
          </View>
          
          <Text style={styles.counterTitle}>Vasos de agua hoy</Text>
          <Text style={styles.counterNumber}>{todayGlasses}</Text>
          
          <TouchableOpacity 
            style={styles.addButton} 
            onPress={addGlass} 
            activeOpacity={0.8}
          >
            <Text style={styles.addButtonText}>+1 vaso</Text>
          </TouchableOpacity>
        </View>

        {/* Objetivo diario */}
        <View style={styles.goalSection}>
          <Text style={styles.goalTitle}>Objetivo diario: {dailyGoal} vasos</Text>
          {todayGlasses >= dailyGoal && (
            <Text style={styles.goalAchieved}>¡Meta alcanzada! 🎉</Text>
          )}
          <View style={styles.goalProgress}>
            {renderProgressBar(todayGlasses, dailyGoal)}
          </View>
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
                Promedio: {weeklyStats.average} vasos/día
              </Text>
              <Text style={styles.statsText}>
                Racha: {weeklyStats.streak} día{weeklyStats.streak !== 1 ? 's' : ''} consecutivo{weeklyStats.streak !== 1 ? 's' : ''}
              </Text>
            </View>
          )}
          
          {!weeklyHistory || weeklyHistory.length === 0 ? (
            <View style={styles.emptyHistory}>
              <Text style={styles.emptyText}>Sin registros todavía</Text>
            </View>
          ) : (
            <View style={styles.historyList}>
              {weeklyHistory.map((day) => {
                if (!day || !day.date) return null;
                return (
                  <View key={day.date} style={styles.historyItem}>
                    <Text style={styles.dayName}>{getDayName(day.date)}</Text>
                    <View style={styles.historyProgress}>
                      {renderProgressBar(day.glasses || 0, dailyGoal)}
                    </View>
                    <Text style={styles.glassesCount}>{day.glasses || 0}/{dailyGoal}</Text>
                  </View>
                );
              })}
            </View>
          )}
        </View>
      </ScrollView>

      {/* Modal para editar objetivo */}
      <Modal visible={showGoalModal} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modal}>
            <Text style={styles.modalTitle}>Editar objetivo diario</Text>
            <Text style={styles.modalSubtitle}>¿Cuántos vasos quieres tomar al día?</Text>
            
            <TextInput
              style={styles.goalInput}
              placeholder={`${dailyGoal}`}
              value={goalInput}
              onChangeText={setGoalInput}
              keyboardType="numeric"
              maxLength={2}
            />
            
            <Text style={styles.modalHint}>Mínimo: 4, Máximo: 20</Text>
            
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
  waterContainer: {
    position: 'relative',
    marginBottom: 24,
  },
  waterBarContainer: {
    position: 'relative',
    width: 120,
    height: 200,
    alignItems: 'center',
  },
  waterBarBackground: {
    width: 40,
    height: 160,
    backgroundColor: '#E5E7EB',
    borderRadius: 20,
    overflow: 'hidden',
    position: 'relative',
  },
  waterBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#D0F2FF',
    borderRadius: 20,
  },
  waterEmojiContainer: {
    position: 'absolute',
    top: -20,
    alignItems: 'center',
  },
  waterEmoji: {
    fontSize: 48,
  },
  dropAnimation: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  dropEmoji: {
    fontSize: 24,
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
  goalTitle: {
    fontSize: 16,
    color: '#6B7280',
    marginBottom: 8,
  },
  goalAchieved: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#10B981',
    marginBottom: 8,
  },
  goalProgress: {
    width: '80%',
    height: 8,
    backgroundColor: '#E5E7EB',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBarContainer: {
    width: '100%',
    height: 8,
    backgroundColor: '#E5E7EB',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#3B82F6',
    borderRadius: 4,
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
  emptyHistory: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#9CA3AF',
  },
  historyList: {
    gap: 12,
  },
  historyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#fff',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  dayName: {
    width: 40,
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
  },
  historyProgress: {
    flex: 1,
    marginHorizontal: 16,
  },
  glassesCount: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
    minWidth: 40,
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
    marginBottom: 8,
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
  saveButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
});

export default WaterScreen; 