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
import { Svg, Path, Circle } from "react-native-svg";

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
  const [listOpacity] = useState(new Animated.Value(0));

  // Animaciones de entrada
  useEffect(() => {
    Animated.parallel([
      Animated.timing(headerOpacity, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(listOpacity, {
        toValue: 1,
        duration: 1000,
        delay: 200,
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
        toValue: 0.9,
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

  const renderHabitCard = useCallback(({ item }: { item: Habit }) => (
    <HabitCard
      habit={item}
    />
  ), []);

  const keyExtractor = useCallback((item: Habit) => item.id, []);

  const MiniChart = () => {
    const data = [65, 80, 45, 90, 75, 85, 70];
    const maxValue = Math.max(...data);
    const chartWidth = width - 80;
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
                stroke="#4A90E2"
                strokeWidth="1"
              />
            );
          })}
          <defs>
            <linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#4A90E2" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#4A90E2" stopOpacity="0.3" />
            </linearGradient>
          </defs>
        </Svg>
      </View>
    );
  };

  const MotivationalQuote = () => {
    const quotes = [
      "Cada día es una nueva oportunidad para ser mejor",
      "Los pequeños pasos llevan a grandes cambios",
      "La consistencia es la clave del éxito",
      "Hoy es el día perfecto para empezar",
      "Tú eres más fuerte de lo que crees"
    ];
    
    const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
    
    return (
      <View style={styles.quoteContainer}>
        <Text style={styles.quoteText}>"{randomQuote}"</Text>
      </View>
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <View style={styles.skeletonHeader} />
        <View style={styles.skeletonCard} />
        <View style={styles.skeletonCard} />
        <View style={styles.skeletonCard} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1a1a2e" />
      
      {/* Header con gradiente */}
      <Animated.View style={[styles.header, { opacity: headerOpacity }]}>
        <LinearGradient
          colors={["#16213e", "#0f3460"]}
          style={styles.headerGradient}
        >
          <View style={styles.headerContent}>
            <View>
              <Text style={styles.greeting}>
                ¡Hola, {user?.name?.split(" ")[0] || "Usuario"}!
              </Text>
              <Text style={styles.subtitle}>
                {dashboardData?.completedToday || 0} de {dashboardData?.totalHabits || 0} hábitos completados hoy
              </Text>
            </View>
            <View style={styles.statsContainer}>
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>{dashboardData?.currentStreak || 0}</Text>
                <Text style={styles.statLabel}>Días</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>{dashboardData?.totalPoints || 0}</Text>
                <Text style={styles.statLabel}>Puntos</Text>
              </View>
            </View>
          </View>
        </LinearGradient>
      </Animated.View>

      {/* Contenido principal */}
      <Animated.View style={[styles.content, { opacity: listOpacity }]}>
        {/* Frase motivacional */}
        <MotivationalQuote />
        
        {/* Mini gráfico */}
        <View style={styles.chartSection}>
          <Text style={styles.sectionTitle}>Progreso Semanal</Text>
          <MiniChart />
        </View>

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
                tintColor="#4A90E2"
                colors={["#4A90E2"]}
              />
            }
            ListEmptyComponent={
              <View style={styles.emptyState}>
                <Ionicons name="leaf-outline" size={64} color="#ccc" />
                <Text style={styles.emptyText}>No tienes hábitos aún</Text>
                <Text style={styles.emptySubtext}>
                  Toca el botón + para crear tu primer hábito
                </Text>
              </View>
            }
          />
        </View>
      </Animated.View>

      {/* FAB */}
      <Animated.View style={[styles.fabContainer, { transform: [{ scale: fabScale }] }]}>
        <TouchableOpacity
          style={styles.fab}
          onPress={handleFabPress}
          activeOpacity={0.8}
        >
          <LinearGradient
            colors={["#4A90E2", "#357ABD"]}
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
  loadingContainer: {
    flex: 1,
    backgroundColor: "#f8f9fa",
    padding: 20,
  },
  skeletonHeader: {
    height: 120,
    backgroundColor: "#e9ecef",
    borderRadius: 16,
    marginBottom: 20,
  },
  skeletonCard: {
    height: 100,
    backgroundColor: "#e9ecef",
    borderRadius: 12,
    marginBottom: 16,
  },
  header: {
    height: 200,
  },
  headerGradient: {
    flex: 1,
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  headerContent: {
    flex: 1,
    justifyContent: "space-between",
  },
  greeting: {
    fontSize: 28,
    fontWeight: "bold",
    color: "white",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: "rgba(255, 255, 255, 0.8)",
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 20,
  },
  statItem: {
    alignItems: "center",
  },
  statNumber: {
    fontSize: 32,
    fontWeight: "bold",
    color: "white",
  },
  statLabel: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.8)",
    marginTop: 4,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    marginTop: -20,
  },
  quoteContainer: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 16,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  quoteText: {
    fontSize: 16,
    fontStyle: "italic",
    color: "#495057",
    textAlign: "center",
    lineHeight: 24,
  },
  chartSection: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 16,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#212529",
    marginBottom: 16,
  },
  miniChartContainer: {
    alignItems: "center",
    justifyContent: "center",
    height: 80,
  },
  habitsSection: {
    flex: 1,
  },
  habitsList: {
    paddingBottom: 100,
  },
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#6c757d",
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 14,
    color: "#adb5bd",
    textAlign: "center",
    marginTop: 8,
  },
  fabContainer: {
    position: "absolute",
    bottom: 30,
    right: 20,
  },
  fab: {
    width: 56,
    height: 56,
    borderRadius: 28,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  fabGradient: {
    flex: 1,
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
  },
});

export default HomeScreen;
