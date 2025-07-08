import React from "react";
import { View, Text, StyleSheet } from "react-native";

interface Habit {
  id: string;
  name: string;
  streak: number;
  isDoneToday: boolean;
}

interface DashboardProps {
  habits: Habit[];
}

export default function Dashboard({ habits }: DashboardProps) {
  const completedToday = habits.filter((habit) => habit.isDoneToday).length;
  const totalHabits = habits.length;
  const progressPercentage =
    totalHabits > 0 ? (completedToday / totalHabits) * 100 : 0;

  const longestStreakHabit = habits.reduce(
    (max, habit) => (habit.streak > max.streak ? habit : max),
    { streak: 0, name: "" },
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Progreso del Día</Text>

      <View style={styles.progressContainer}>
        <View style={styles.progressBar}>
          <View
            style={[styles.progressFill, { width: `${progressPercentage}%` }]}
          />
        </View>
        <Text style={styles.progressText}>
          {completedToday}/{totalHabits} hábitos completados
        </Text>
      </View>

      {longestStreakHabit.streak > 0 && (
        <View style={styles.streakContainer}>
          <Text style={styles.streakTitle}>🔥 Racha más larga</Text>
          <Text style={styles.streakText}>
            {longestStreakHabit.name}: {longestStreakHabit.streak} días
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 20,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 12,
  },
  progressContainer: {
    marginBottom: 16,
  },
  progressBar: {
    height: 8,
    backgroundColor: "#f0f0f0",
    borderRadius: 4,
    marginBottom: 8,
  },
  progressFill: {
    height: "100%",
    backgroundColor: "#4CAF50",
    borderRadius: 4,
  },
  progressText: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
  },
  streakContainer: {
    borderTopWidth: 1,
    borderTopColor: "#f0f0f0",
    paddingTop: 12,
  },
  streakTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 4,
  },
  streakText: {
    fontSize: 14,
    color: "#666",
  },
});
