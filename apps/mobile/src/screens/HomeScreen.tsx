import React, { useState, useEffect, useCallback, useMemo } from "react";
import { 
  View, 
  Text, 
  TouchableOpacity, 
  Alert, 
  FlatList, 
  RefreshControl, 
  Animated, 
  StyleSheet,
  Dimensions,
  StatusBar
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "../providers/AuthProvider";
import { useNavigation } from "@react-navigation/native";
import HabitCard from "../components/HabitCard";
import { api } from "../utils/api";
import { LinearGradient } from "expo-linear-gradient";
import { Svg, Path, Circle, Defs, LinearGradient as SvgLinearGradient, Stop } from "react-native-svg";

const { width, height } = Dimensions.get("window");

interface Habit {
  id: string;
  name: string;
  description: string;
  frequency: string;
  streak: number;
  isDoneToday: boolean;
  category: string;
  createdAt: string;
  logs: Array<{
    id: string;
    date: string;
  }>;
}

interface HabitLog {
  id: string;
  habitId: string;
  completedAt: string;
}

interface DashboardData {
  habits: Habit[];
  habitLogs: HabitLog[];
  totalHabits: number;
  completedToday: number;
  currentStreak: number;
  totalPoints: number;
}

const HomeScreen = () => {
  const { user } = useAuth();
  const navigation = useNavigation();
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [fabScale] = useState(new Animated.Value(1));
  const [headerOpacity] = useState(new Animated.Value(0));
  const [progressCardScale] = useState(new Animated.Value(0.95));
  const [progressCardElevation] = useState(new Animated.Value(2));

  // Animaciones de entrada
  useEffect(() => {
    Animated.parallel([
      Animated.timing(headerOpacity, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(progressCardScale, {
        toValue: 1,
        duration: 400,
        delay: 100,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const fetchDashboardData = useCallback(async () => {
    try {
      setLoading(true);
      const response = await api.get("/habits/habit-logs");
      setDashboardData(response.data);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      Alert.alert("Error", "No se pudo cargar el dashboard");
    } finally {
      setLoading(false);
    }
  }, []);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchDashboardData();
    setRefreshing(false);
  }, [fetchDashboardData]);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  const handleHabitToggle = useCallback(async (habitId: string, completed: boolean) => {
    try {
      if (completed) {
        await api.post("/habits/habit-logs", { habitId });
      } else {
        // Implementar lógica para desmarcar si es necesario
      }
      await fetchDashboardData();
    } catch (error) {
      console.error("Error toggling habit:", error);
      Alert.alert("Error", "No se pudo actualizar el hábito");
    }
  }, [fetchDashboardData]);

  const handleFabPress = useCallback(() => {
    Animated.sequence([
      Animated.timing(fabScale, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(fabScale, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();

    navigation.navigate("CreateHabit" as never);
  }, [fabScale, navigation]);

  const handleProgressCardPress = useCallback(() => {
    Animated.sequence([
      Animated.timing(progressCardElevation, {
        toValue: 8,
        duration: 100,
        useNativeDriver: false,
      }),
      Animated.timing(progressCardElevation, {
        toValue: 2,
        duration: 100,
        useNativeDriver: false,
      }),
    ]).start();
  }, [progressCardElevation]);

  const renderHabitCard = useCallback(({ item }: { item: Habit }) => (
    <HabitCard
      habit={item}
    />
  ), []);

  const keyExtractor = useCallback((item: Habit) => item.id, []);

  const MiniChart = () => {
    const data = [65, 80, 45, 90, 75, 85, 70];
    const maxValue = Math.max(...data);
    const chartWidth = (width * 0.9) - 32; // 90% width - padding
    const chartHeight = 60;
    const barWidth = chartWidth / data.length - 4;

    return (
      <View style={styles.miniChartContainer}>
        <Svg width={chartWidth} height={chartHeight}>
          {data.map((value, index) => {
            const barHeight = (value / maxValue) * chartHeight;
            const x = index * (barWidth + 4);
            const y = chartHeight - barHeight;
            
            return (
              <Path
                key={index}
                d={`M ${x} ${chartHeight} L ${x} ${y} L ${x + barWidth} ${y} L ${x + barWidth} ${chartHeight} Z`}
                fill="url(#gradient)"
                stroke="#407BFF"
                strokeWidth="1"
              />
            );
          })}
          <Defs>
            <SvgLinearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <Stop offset="0%" stopColor="#407BFF" stopOpacity="0.8" />
              <Stop offset="100%" stopColor="#407BFF" stopOpacity="0.3" />
            </SvgLinearGradient>
          </Defs>
        </Svg>
      </View>
    );
  };

  const getCurrentDate = () => {
    const today = new Date();
    const options: Intl.DateTimeFormatOptions = { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    };
    return today.toLocaleDateString('es-ES', options);
  };

  // Pantalla vacía cuando no hay hábitos
  if (!loading && (!dashboardData?.habits || dashboardData.habits.length === 0)) {
    return (
      <View style={styles.emptyContainer}>
        <StatusBar barStyle="light-content" backgroundColor="#407BFF" />
        
        {/* Header compacto */}
        <Animated.View style={[styles.header, { opacity: headerOpacity }]}>
          <LinearGradient
            colors={["#407BFF", "#2A60E6"]}
            style={styles.headerGradient}
          >
            <View style={styles.headerContent}>
              <Text style={styles.greeting}>
                ¡Hola, {user?.name?.split(" ")[0] || "Usuario"}!
              </Text>
              <Text style={styles.dateText}>{getCurrentDate()}</Text>
            </View>
          </LinearGradient>
        </Animated.View>

        {/* Contenido centrado */}
        <View style={styles.emptyContent}>
          <View style={styles.emptyIconContainer}>
            <Ionicons name="add-circle" size={80} color="#407BFF" />
          </View>
          <Text style={styles.emptyTitle}>No tienes hábitos aún</Text>
          <Text style={styles.emptySubtitle}>
            Comienza creando tu primer hábito para mejorar tu vida
          </Text>
        </View>

        {/* FAB */}
        <Animated.View style={[styles.fabContainer, { transform: [{ scale: fabScale }] }]}>
          <TouchableOpacity
            style={styles.fab}
            onPress={handleFabPress}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={["#407BFF", "#2A60E6"]}
              style={styles.fabGradient}
            >
              <Ionicons name="add" size={28} color="white" />
            </LinearGradient>
          </TouchableOpacity>
        </Animated.View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#407BFF" />
      
      {/* Header compacto */}
      <Animated.View style={[styles.header, { opacity: headerOpacity }]}>
        <LinearGradient
          colors={["#407BFF", "#2A60E6"]}
          style={styles.headerGradient}
        >
          <View style={styles.headerContent}>
            <Text style={styles.greeting}>
              ¡Hola, {user?.name?.split(" ")[0] || "Usuario"}!
            </Text>
            <Text style={styles.dateText}>{getCurrentDate()}</Text>
          </View>
        </LinearGradient>
      </Animated.View>

      {/* Contenido principal */}
      <View style={styles.content}>
        {/* Progreso Semanal */}
        <Animated.View 
          style={[
            styles.progressCard,
            { 
              transform: [{ scale: progressCardScale }],
              elevation: progressCardElevation,
              shadowOpacity: progressCardElevation.interpolate({
                inputRange: [0, 8],
                outputRange: [0.1, 0.3],
              }),
            }
          ]}
        >
          <TouchableOpacity 
            style={styles.progressCardTouchable}
            onPress={handleProgressCardPress}
            activeOpacity={0.9}
          >
            <Text style={styles.sectionTitle}>Progreso Semanal</Text>
            <MiniChart />
            <View style={styles.progressStats}>
              <View style={styles.progressStat}>
                <Text style={styles.progressStatNumber}>{dashboardData?.completedToday || 0}</Text>
                <Text style={styles.progressStatLabel}>Hoy</Text>
              </View>
              <View style={styles.progressStat}>
                <Text style={styles.progressStatNumber}>{dashboardData?.currentStreak || 0}</Text>
                <Text style={styles.progressStatLabel}>Racha</Text>
              </View>
              <View style={styles.progressStat}>
                <Text style={styles.progressStatNumber}>{dashboardData?.totalPoints || 0}</Text>
                <Text style={styles.progressStatLabel}>Puntos</Text>
              </View>
            </View>
          </TouchableOpacity>
        </Animated.View>

        {/* Lista de hábitos */}
        <View style={styles.habitsSection}>
          <Text style={styles.sectionTitle}>Tus Hábitos</Text>
          <FlatList
            data={dashboardData?.habits || []}
            renderItem={renderHabitCard}
            keyExtractor={keyExtractor}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.habitsList}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                tintColor="#407BFF"
                colors={["#407BFF"]}
              />
            }
          />
        </View>
      </View>

      {/* FAB */}
      <Animated.View style={[styles.fabContainer, { transform: [{ scale: fabScale }] }]}>
        <TouchableOpacity
          style={styles.fab}
          onPress={handleFabPress}
          activeOpacity={0.8}
        >
          <LinearGradient
            colors={["#407BFF", "#2A60E6"]}
            style={styles.fabGradient}
          >
            <Ionicons name="add" size={28} color="white" />
          </LinearGradient>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  emptyContainer: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  header: {
    height: 60,
  },
  headerGradient: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 8,
    justifyContent: "center",
  },
  headerContent: {
    flex: 1,
    justifyContent: "center",
  },
  greeting: {
    fontSize: 20,
    fontWeight: "bold",
    color: "white",
    marginBottom: 2,
  },
  dateText: {
    fontSize: 12,
    color: "rgba(255, 255, 255, 0.8)",
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  emptyContent: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 32,
  },
  emptyIconContainer: {
    marginBottom: 24,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1a1a2e",
    textAlign: "center",
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    lineHeight: 24,
  },
  progressCard: {
    backgroundColor: "white",
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowRadius: 8,
    shadowOpacity: 0.1,
    elevation: 2,
  },
  progressCardTouchable: {
    flex: 1,
  },
  miniChartContainer: {
    alignItems: "center",
    marginVertical: 16,
  },
  progressStats: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 16,
  },
  progressStat: {
    alignItems: "center",
  },
  progressStatNumber: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#407BFF",
  },
  progressStatLabel: {
    fontSize: 12,
    color: "#666",
    marginTop: 2,
  },
  habitsSection: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1a1a2e",
    marginBottom: 16,
  },
  habitsList: {
    paddingBottom: 100, // Espacio para FAB
  },
  fabContainer: {
    position: "absolute",
    bottom: 24,
    right: 24,
    zIndex: 1000,
  },
  fab: {
    width: 56,
    height: 56,
    borderRadius: 28,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowRadius: 8,
    shadowOpacity: 0.3,
    elevation: 4,
  },
  fabGradient: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default HomeScreen;
