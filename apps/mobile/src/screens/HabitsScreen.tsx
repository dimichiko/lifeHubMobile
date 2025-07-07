import React from "react";
import { View, Text, StyleSheet, FlatList } from "react-native";

const mockHabits = [
  { id: "1", name: "Beber agua", description: "8 vasos al día" },
  { id: "2", name: "Ejercicio", description: "30 minutos diarios" },
  { id: "3", name: "Leer", description: "20 páginas al día" },
];

export default function HabitsScreen() {
  const renderHabit = ({ item }: any) => (
    <View style={styles.habitItem}>
      <Text style={styles.habitName}>{item.name}</Text>
      <Text style={styles.habitDescription}>{item.description}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Mis Hábitos</Text>

      <FlatList
        data={mockHabits}
        renderItem={renderHabit}
        keyExtractor={(item) => item.id}
        style={styles.list}
      />

      <Text style={styles.emptyText}>
        Próximamente: Crear y gestionar hábitos
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginTop: 60,
    marginBottom: 20,
    color: "#333",
  },
  list: {
    flex: 1,
  },
  habitItem: {
    backgroundColor: "#f8f9fa",
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    borderLeftWidth: 4,
    borderLeftColor: "#007AFF",
  },
  habitName: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    marginBottom: 5,
  },
  habitDescription: {
    fontSize: 14,
    color: "#666",
  },
  emptyText: {
    textAlign: "center",
    color: "#999",
    fontSize: 16,
    marginTop: 20,
  },
});
