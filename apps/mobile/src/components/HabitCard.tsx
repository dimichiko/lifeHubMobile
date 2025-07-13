import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigation } from "@react-navigation/native";
import { createHabitLog } from "../utils/api";

interface Habit {
  id: string;
  name: string;
  frequency: string;
  goal?: number;
  isRecurring?: boolean;
  daysOfWeek?: string[];
  streak: number;
  isDoneToday: boolean;
  logs: Array<{
    id: string;
    date: string;
  }>;
}

interface HabitCardProps {
  habit: Habit;
}

export default function HabitCard({ habit }: HabitCardProps) {
  const queryClient = useQueryClient();
  const navigation = useNavigation();

  const createLogMutation = useMutation({
    mutationFn: createHabitLog,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["habits"] });
      Alert.alert("¡Completado!", `${habit.name} marcado como completado`);
    },
    onError: (error: any) => {
      Alert.alert("Error", error.message || "Error al marcar como completado");
    },
  });

  const handleMarkComplete = () => {
    createLogMutation.mutate({
      habitId: habit.id,
    });
  };

  const handleEdit = () => {
    navigation.navigate("EditHabit" as never, { habit } as never);
  };

  const isCompletedToday = () => {
    return habit.isDoneToday;
  };

  const getFrequencyText = (frequency: string) => {
    switch (frequency) {
      case "daily":
        return "Diario";
      case "weekly":
        return "Semanal";
      case "monthly":
        return "Mensual";
      default:
        return frequency;
    }
  };

  const getDaysText = () => {
    if (!habit.isRecurring || !habit.daysOfWeek || habit.daysOfWeek.length === 0) {
      return "";
    }

    const dayLabels = {
      monday: "Lun",
      tuesday: "Mar",
      wednesday: "Mié",
      thursday: "Jue",
      friday: "Vie",
      saturday: "Sáb",
      sunday: "Dom",
    };

    return habit.daysOfWeek.map(day => dayLabels[day as keyof typeof dayLabels] || day).join(", ");
  };

  const completedToday = isCompletedToday();

  return (
    <View style={[styles.card, completedToday && styles.cardCompleted]}>
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <Text style={styles.name}>{habit.name}</Text>
          <Text style={styles.frequency}>
            {getFrequencyText(habit.frequency)}
          </Text>
        </View>
        <TouchableOpacity style={styles.editButton} onPress={handleEdit}>
          <Text style={styles.editButtonText}>✏️</Text>
        </TouchableOpacity>
      </View>

      {habit.isRecurring && habit.daysOfWeek && habit.daysOfWeek.length > 0 && (
        <Text style={styles.daysText}>Días: {getDaysText()}</Text>
      )}

      {habit.goal && <Text style={styles.goal}>Meta: {habit.goal}</Text>}

      <View style={styles.stats}>
        <Text style={styles.streak}>🔥 {habit.streak} días consecutivos</Text>
      </View>

      <TouchableOpacity
        style={[
          styles.completeButton,
          completedToday && styles.completedButton,
        ]}
        onPress={handleMarkComplete}
        disabled={completedToday || createLogMutation.isPending}
      >
        <Text style={styles.completeButtonText}>
          {completedToday
            ? "✓ Completado"
            : createLogMutation.isPending
              ? "Marcando..."
              : "Marcar como completado"}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  cardCompleted: {
    backgroundColor: "#f0f8ff",
    borderColor: "#4CAF50",
    borderWidth: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 8,
  },
  titleContainer: {
    flex: 1,
  },
  name: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    marginBottom: 4,
  },
  frequency: {
    fontSize: 14,
    color: "#666",
    backgroundColor: "#f0f0f0",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: "flex-start",
  },
  editButton: {
    padding: 8,
  },
  editButtonText: {
    fontSize: 18,
  },
  daysText: {
    fontSize: 14,
    color: "#666",
    marginBottom: 8,
    fontStyle: "italic",
  },
  goal: {
    fontSize: 14,
    color: "#666",
    marginBottom: 8,
  },
  stats: {
    marginBottom: 12,
  },
  streak: {
    fontSize: 14,
    color: "#007AFF",
    fontWeight: "500",
  },
  completeButton: {
    backgroundColor: "#007AFF",
    borderRadius: 8,
    padding: 12,
    alignItems: "center",
  },
  completedButton: {
    backgroundColor: "#4CAF50",
  },
  completeButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
