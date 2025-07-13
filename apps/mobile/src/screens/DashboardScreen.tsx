import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  ActivityIndicator,
  RefreshControl,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { api } from "../utils/api";

const { width } = Dimensions.get("window");

interface HabitStats {
  id: string;
  name: string;
  totalCompletions: number;
  currentStreak: number;
  longestStreak: number;
  completionRate: number;
  lastCompleted?: string;
}

interface WeeklyData {
  date: string;
  completions: number;
  total: number;
}

interface DashboardData {
  totalHabits: number;
  totalCompletions: number;
  currentStreak: number;
  averageCompletionRate: number;
  habits: HabitStats[];
  weeklyData: WeeklyData[];
}

export default function DashboardScreen() {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(
    null,
  );
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState<"week" | "month">(
    "week",
  );

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      // Obtener hábitos del usuario
      const habitsResponse = await api.get("/habits");
      const habits = habitsResponse.data;

      // Obtener logs de hábitos
      const logsResponse = await api.get("/habits/habit-logs");
      const logs = logsResponse.data;

      // Calcular estadísticas
      const stats = calculateHabitStats(habits, logs);
      const weeklyData = calculateWeeklyData(habits, logs);

      const totalHabits = habits.length;
      const totalCompletions = logs.length;
      const currentStreak = Math.max(...stats.map((s) => s.currentStreak), 0);
      const averageCompletionRate =
        stats.length > 0
          ? Math.round(
              stats.reduce((sum, s) => sum + s.completionRate, 0) /
                stats.length,
            )
          : 0;

      setDashboardData({
        totalHabits,
        totalCompletions,
        currentStreak,
        averageCompletionRate,
        habits: stats,
        weeklyData,
      });
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      Alert.alert(
        "Error",
        "No se pudieron cargar los datos del dashboard. Intenta de nuevo.",
      );
    } finally {
      setLoading(false);
    }
  };

  const calculateHabitStats = (habits: any[], logs: any[]): HabitStats[] => {
    return habits.map((habit) => {
      const habitLogs = logs.filter((log) => log.habitId === habit.id);
      const totalCompletions = habitLogs.length;

      // Calcular racha actual
      let currentStreak = 0;
      let longestStreak = 0;
      let tempStreak = 0;

      const sortedLogs = habitLogs.sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
      );

      const today = new Date();
      today.setHours(0, 0, 0, 0);

      for (let i = 0; i < 30; i++) {
        const checkDate = new Date(today);
        checkDate.setDate(today.getDate() - i);

        const hasLog = sortedLogs.some((log) => {
          const logDate = new Date(log.date);
          logDate.setHours(0, 0, 0, 0);
          return logDate.getTime() === checkDate.getTime();
        });

        if (hasLog) {
          tempStreak++;
          if (i === 0) currentStreak = tempStreak;
        } else {
          if (tempStreak > longestStreak) longestStreak = tempStreak;
          tempStreak = 0;
        }
      }

      if (tempStreak > longestStreak) longestStreak = tempStreak;

      // Calcular tasa de completado (últimos 30 días)
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(today.getDate() - 30);

      const recentLogs = habitLogs.filter(
        (log) => new Date(log.date) >= thirtyDaysAgo,
      );

      const completionRate = Math.round((recentLogs.length / 30) * 100);

      return {
        id: habit.id,
        name: habit.name,
        totalCompletions,
        currentStreak,
        longestStreak,
        completionRate,
        lastCompleted: sortedLogs[0]?.date,
      };
    });
  };

  const calculateWeeklyData = (habits: any[], logs: any[]): WeeklyData[] => {
    const days = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];
    const weekData: WeeklyData[] = [];

    const today = new Date();
    const totalHabits = habits.length;

    for (let i = 6; i >= 0; i--) {
      const checkDate = new Date(today);
      checkDate.setDate(today.getDate() - i);

      const dayLogs = logs.filter((log) => {
        const logDate = new Date(log.date);
        logDate.setHours(0, 0, 0, 0);
        checkDate.setHours(0, 0, 0, 0);
        return logDate.getTime() === checkDate.getTime();
      });

      weekData.push({
        date: days[checkDate.getDay()],
        completions: dayLogs.length,
        total: totalHabits,
      });
    }

    return weekData;
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchDashboardData();
    setRefreshing(false);
  };

  const getStreakEmoji = (streak: number) => {
    if (streak >= 10) return "🔥";
    if (streak >= 7) return "⚡";
    if (streak >= 3) return "💪";
    return "🎯";
  };

  const getCompletionColor = (rate: number) => {
    if (rate >= 80) return "#4CAF50";
    if (rate >= 60) return "#FF9800";
    return "#F44336";
  };

  const renderProgressBar = (
    completed: number,
    total: number,
    height: number = 8,
  ) => {
    const percentage = total > 0 ? (completed / total) * 100 : 0;
    return (
      <View style={[styles.progressBar, { height }]}>
        <View
          style={[
            styles.progressFill,
            {
              width: `${percentage}%`,
              backgroundColor: getCompletionColor(percentage),
            },
          ]}
        />
      </View>
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#3B82F6" />
        <Text style={styles.loadingText}>Cargando dashboard...</Text>
      </View>
    );
  }

  if (!dashboardData) {
    return (
      <View style={styles.errorContainer}>
        <Ionicons name="alert-circle" size={64} color="#F44336" />
        <Text style={styles.errorTitle}>Error al cargar datos</Text>
        <Text style={styles.errorText}>
          No se pudieron cargar los datos del dashboard
        </Text>
        <TouchableOpacity
          style={styles.retryButton}
          onPress={fetchDashboardData}
        >
          <Text style={styles.retryButtonText}>Reintentar</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>📊 Dashboard</Text>
        <Text style={styles.subtitle}>Tu progreso en detalle</Text>
      </View>

      {/* Resumen general */}
      <View style={styles.summaryCard}>
        <View style={styles.summaryRow}>
          <View style={styles.summaryItem}>
            <Ionicons name="trophy" size={24} color="#FFD700" />
            <Text style={styles.summaryNumber}>
              {dashboardData.currentStreak}
            </Text>
            <Text style={styles.summaryLabel}>Días seguidos</Text>
          </View>
          <View style={styles.summaryItem}>
            <Ionicons name="checkmark-circle" size={24} color="#4CAF50" />
            <Text style={styles.summaryNumber}>
              {dashboardData.totalCompletions}
            </Text>
            <Text style={styles.summaryLabel}>Completados</Text>
          </View>
          <View style={styles.summaryItem}>
            <Ionicons name="trending-up" size={24} color="#2196F3" />
            <Text style={styles.summaryNumber}>
              {dashboardData.averageCompletionRate}%
            </Text>
            <Text style={styles.summaryLabel}>Tasa de éxito</Text>
          </View>
        </View>
      </View>

      {/* Gráfico semanal */}
      <View style={styles.chartCard}>
        <View style={styles.chartHeader}>
          <Text style={styles.chartTitle}>Progreso Semanal</Text>
          <View style={styles.periodSelector}>
            <TouchableOpacity
              style={[
                styles.periodButton,
                selectedPeriod === "week" && styles.periodButtonActive,
              ]}
              onPress={() => setSelectedPeriod("week")}
            >
              <Text
                style={[
                  styles.periodText,
                  selectedPeriod === "week" && styles.periodTextActive,
                ]}
              >
                Semana
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.periodButton,
                selectedPeriod === "month" && styles.periodButtonActive,
              ]}
              onPress={() => setSelectedPeriod("month")}
            >
              <Text
                style={[
                  styles.periodText,
                  selectedPeriod === "month" && styles.periodTextActive,
                ]}
              >
                Mes
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.chartContainer}>
          {dashboardData.weeklyData.map((day, index) => (
            <View key={index} style={styles.chartBar}>
              <View style={styles.barContainer}>
                <View
                  style={[
                    styles.bar,
                    {
                      height: `${(day.completions / day.total) * 100}%`,
                      backgroundColor: getCompletionColor(
                        (day.completions / day.total) * 100,
                      ),
                    },
                  ]}
                />
              </View>
              <Text style={styles.barLabel}>{day.date}</Text>
              <Text style={styles.barValue}>
                {day.completions}/{day.total}
              </Text>
            </View>
          ))}
        </View>
      </View>

      {/* Estadísticas por hábito */}
      <View style={styles.statsCard}>
        <Text style={styles.statsTitle}>Estadísticas por Hábito</Text>
        {dashboardData.habits.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="stats-chart" size={48} color="#ccc" />
            <Text style={styles.emptyStateText}>
              No hay hábitos para mostrar
            </Text>
            <Text style={styles.emptyStateSubtext}>
              Crea tu primer hábito para ver estadísticas
            </Text>
          </View>
        ) : (
          dashboardData.habits.map((habit) => (
            <View key={habit.id} style={styles.habitStats}>
              <View style={styles.habitHeader}>
                <Text style={styles.habitName}>{habit.name}</Text>
                <Text style={styles.streakEmoji}>
                  {getStreakEmoji(habit.currentStreak)}
                </Text>
              </View>

              <View style={styles.statsGrid}>
                <View style={styles.statItem}>
                  <Text style={styles.statLabel}>Racha actual</Text>
                  <Text style={styles.statValue}>
                    {habit.currentStreak} días
                  </Text>
                </View>
                <View style={styles.statItem}>
                  <Text style={styles.statLabel}>Mejor racha</Text>
                  <Text style={styles.statValue}>
                    {habit.longestStreak} días
                  </Text>
                </View>
                <View style={styles.statItem}>
                  <Text style={styles.statLabel}>Completados</Text>
                  <Text style={styles.statValue}>{habit.totalCompletions}</Text>
                </View>
                <View style={styles.statItem}>
                  <Text style={styles.statLabel}>Tasa de éxito</Text>
                  <Text
                    style={[
                      styles.statValue,
                      { color: getCompletionColor(habit.completionRate) },
                    ]}
                  >
                    {habit.completionRate}%
                  </Text>
                </View>
              </View>

              <View style={styles.progressSection}>
                <Text style={styles.progressLabel}>Progreso general</Text>
                {renderProgressBar(habit.completionRate, 100, 12)}
                <Text style={styles.progressText}>
                  {habit.completionRate}% completado
                </Text>
              </View>
            </View>
          ))
        )}
      </View>

      {/* Logros */}
      <View style={styles.achievementsCard}>
        <Text style={styles.achievementsTitle}>🏆 Logros</Text>
        <View style={styles.achievementsGrid}>
          <View
            style={[
              styles.achievement,
              dashboardData.currentStreak >= 7 && styles.achievementUnlocked,
            ]}
          >
            <Ionicons
              name="flame"
              size={32}
              color={dashboardData.currentStreak >= 7 ? "#FF6B35" : "#ccc"}
            />
            <Text style={styles.achievementTitle}>Racha de 7 días</Text>
            <Text style={styles.achievementDesc}>
              {dashboardData.currentStreak >= 7
                ? "¡Completado!"
                : `${dashboardData.currentStreak}/7 días`}
            </Text>
          </View>
          <View
            style={[
              styles.achievement,
              dashboardData.totalCompletions >= 50 &&
                styles.achievementUnlocked,
            ]}
          >
            <Ionicons
              name="trophy"
              size={32}
              color={dashboardData.totalCompletions >= 50 ? "#FFD700" : "#ccc"}
            />
            <Text style={styles.achievementTitle}>50 completados</Text>
            <Text style={styles.achievementDesc}>
              {dashboardData.totalCompletions >= 50
                ? "¡Completado!"
                : `${dashboardData.totalCompletions}/50`}
            </Text>
          </View>
          <View
            style={[
              styles.achievement,
              dashboardData.averageCompletionRate >= 80 &&
                styles.achievementUnlocked,
            ]}
          >
            <Ionicons
              name="star"
              size={32}
              color={
                dashboardData.averageCompletionRate >= 80 ? "#9C27B0" : "#ccc"
              }
            />
            <Text style={styles.achievementTitle}>80% de éxito</Text>
            <Text style={styles.achievementDesc}>
              {dashboardData.averageCompletionRate >= 80
                ? "¡Completado!"
                : `${dashboardData.averageCompletionRate}%`}
            </Text>
          </View>
          <View
            style={[
              styles.achievement,
              dashboardData.currentStreak >= 30 && styles.achievementUnlocked,
            ]}
          >
            <Ionicons
              name="lock-closed"
              size={32}
              color={dashboardData.currentStreak >= 30 ? "#4CAF50" : "#ccc"}
            />
            <Text style={styles.achievementTitle}>Racha de 30 días</Text>
            <Text style={styles.achievementDesc}>
              {dashboardData.currentStreak >= 30
                ? "¡Completado!"
                : `${dashboardData.currentStreak}/30 días`}
            </Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  header: {
    padding: 20,
    paddingTop: 60,
    backgroundColor: "#3B82F6",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    color: "#fff",
    opacity: 0.9,
  },
  summaryCard: {
    backgroundColor: "#fff",
    margin: 20,
    padding: 20,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  summaryItem: {
    alignItems: "center",
  },
  summaryNumber: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginTop: 8,
  },
  summaryLabel: {
    fontSize: 12,
    color: "#666",
    marginTop: 4,
  },
  chartCard: {
    backgroundColor: "#fff",
    marginHorizontal: 20,
    marginBottom: 20,
    padding: 20,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  chartHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  periodSelector: {
    flexDirection: "row",
    backgroundColor: "#f0f0f0",
    borderRadius: 8,
  },
  periodButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  periodButtonActive: {
    backgroundColor: "#3B82F6",
  },
  periodText: {
    fontSize: 14,
    color: "#666",
  },
  periodTextActive: {
    color: "#fff",
    fontWeight: "600",
  },
  chartContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "flex-end",
    height: 150,
  },
  chartBar: {
    alignItems: "center",
    flex: 1,
  },
  barContainer: {
    width: 20,
    height: 100,
    backgroundColor: "#f0f0f0",
    borderRadius: 10,
    overflow: "hidden",
  },
  bar: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    borderRadius: 10,
  },
  barLabel: {
    fontSize: 12,
    color: "#666",
    marginTop: 8,
  },
  barValue: {
    fontSize: 10,
    color: "#999",
    marginTop: 2,
  },
  statsCard: {
    backgroundColor: "#fff",
    marginHorizontal: 20,
    marginBottom: 20,
    padding: 20,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  statsTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 20,
  },
  habitStats: {
    marginBottom: 20,
    padding: 15,
    backgroundColor: "#f8f9fa",
    borderRadius: 12,
  },
  habitHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  habitName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
  streakEmoji: {
    fontSize: 20,
  },
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 15,
  },
  statItem: {
    width: "50%",
    marginBottom: 10,
  },
  statLabel: {
    fontSize: 12,
    color: "#666",
  },
  statValue: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  progressSection: {
    marginTop: 10,
  },
  progressLabel: {
    fontSize: 14,
    color: "#666",
    marginBottom: 8,
  },
  progressBar: {
    backgroundColor: "#f0f0f0",
    borderRadius: 6,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    borderRadius: 6,
  },
  progressText: {
    fontSize: 12,
    color: "#666",
    marginTop: 4,
  },
  achievementsCard: {
    backgroundColor: "#fff",
    marginHorizontal: 20,
    marginBottom: 30,
    padding: 20,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  achievementsTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 20,
  },
  achievementsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  achievement: {
    width: "48%",
    alignItems: "center",
    padding: 15,
    backgroundColor: "#f8f9fa",
    borderRadius: 12,
    marginBottom: 10,
  },
  achievementUnlocked: {
    opacity: 1,
  },
  achievementLocked: {
    opacity: 0.5,
  },
  achievementTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
    textAlign: "center",
    marginTop: 8,
  },
  achievementDesc: {
    fontSize: 12,
    color: "#666",
    textAlign: "center",
    marginTop: 4,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f8f9fa",
  },
  loadingText: {
    marginTop: 10,
    color: "#666",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#f8f9fa",
  },
  errorTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 10,
  },
  errorText: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: "#3B82F6",
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 8,
  },
  retryButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  emptyState: {
    alignItems: "center",
    paddingVertical: 30,
  },
  emptyStateText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginTop: 10,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: "#666",
    marginTop: 5,
    textAlign: "center",
  },
});
