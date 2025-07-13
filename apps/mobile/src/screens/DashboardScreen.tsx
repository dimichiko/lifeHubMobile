import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
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

export default function DashboardScreen() {
  const [stats, setStats] = useState<HabitStats[]>([]);
  const [weeklyData, setWeeklyData] = useState<WeeklyData[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState<"week" | "month">("week");

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      // Simular datos para el demo
      const mockStats: HabitStats[] = [
        {
          id: "1",
          name: "Beber agua",
          totalCompletions: 45,
          currentStreak: 7,
          longestStreak: 12,
          completionRate: 85,
          lastCompleted: new Date().toISOString(),
        },
        {
          id: "2",
          name: "Ejercicio",
          totalCompletions: 23,
          currentStreak: 3,
          longestStreak: 8,
          completionRate: 65,
          lastCompleted: new Date().toISOString(),
        },
      ];

      const mockWeeklyData: WeeklyData[] = [
        { date: "Lun", completions: 5, total: 6 },
        { date: "Mar", completions: 4, total: 6 },
        { date: "Mié", completions: 6, total: 6 },
        { date: "Jue", completions: 3, total: 6 },
        { date: "Vie", completions: 5, total: 6 },
        { date: "Sáb", completions: 4, total: 6 },
        { date: "Dom", completions: 6, total: 6 },
      ];

      setStats(mockStats);
      setWeeklyData(mockWeeklyData);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
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

  const renderProgressBar = (completed: number, total: number, height: number = 8) => {
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

  return (
    <ScrollView style={styles.container}>
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
            <Text style={styles.summaryNumber}>7</Text>
            <Text style={styles.summaryLabel}>Días seguidos</Text>
          </View>
          <View style={styles.summaryItem}>
            <Ionicons name="checkmark-circle" size={24} color="#4CAF50" />
            <Text style={styles.summaryNumber}>68</Text>
            <Text style={styles.summaryLabel}>Completados</Text>
          </View>
          <View style={styles.summaryItem}>
            <Ionicons name="trending-up" size={24} color="#2196F3" />
            <Text style={styles.summaryNumber}>75%</Text>
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
          {weeklyData.map((day, index) => (
            <View key={index} style={styles.chartBar}>
              <View style={styles.barContainer}>
                <View
                  style={[
                    styles.bar,
                    {
                      height: `${(day.completions / day.total) * 100}%`,
                      backgroundColor: getCompletionColor(
                        (day.completions / day.total) * 100
                      ),
                    },
                  ]}
                />
              </View>
              <Text style={styles.barLabel}>{day.date}</Text>
              <Text style={styles.barValue}>{day.completions}/{day.total}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* Estadísticas por hábito */}
      <View style={styles.statsCard}>
        <Text style={styles.statsTitle}>Estadísticas por Hábito</Text>
        {stats.map((habit) => (
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
                <Text style={styles.statValue}>{habit.currentStreak} días</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statLabel}>Mejor racha</Text>
                <Text style={styles.statValue}>{habit.longestStreak} días</Text>
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
        ))}
      </View>

      {/* Logros */}
      <View style={styles.achievementsCard}>
        <Text style={styles.achievementsTitle}>🏆 Logros</Text>
        <View style={styles.achievementsGrid}>
          <View style={styles.achievement}>
            <Ionicons name="flame" size={32} color="#FF6B35" />
            <Text style={styles.achievementTitle}>Racha de 7 días</Text>
            <Text style={styles.achievementDesc}>¡Completado!</Text>
          </View>
          <View style={styles.achievement}>
            <Ionicons name="trophy" size={32} color="#FFD700" />
            <Text style={styles.achievementTitle}>50 completados</Text>
            <Text style={styles.achievementDesc}>¡Completado!</Text>
          </View>
          <View style={styles.achievement}>
            <Ionicons name="star" size={32} color="#9C27B0" />
            <Text style={styles.achievementTitle}>80% de éxito</Text>
            <Text style={styles.achievementDesc}>¡Completado!</Text>
          </View>
          <View style={[styles.achievement, styles.achievementLocked]}>
            <Ionicons name="lock-closed" size={32} color="#ccc" />
            <Text style={styles.achievementTitle}>Racha de 30 días</Text>
            <Text style={styles.achievementDesc}>23/30 días</Text>
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
}); 