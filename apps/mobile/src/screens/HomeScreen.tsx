import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  RefreshControl,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "../providers/AuthProvider";
import { useNavigation } from "@react-navigation/native";
import { api } from "../utils/api";

interface Habit {
  id: string;
  name: string;
  description: string;
  isRecurring: boolean;
  daysOfWeek: string[];
  createdAt: string;
}

type RootStackParamList = {
  CreateHabit: undefined;
  Habits: undefined;
  EditHabit: { habitId: string };
};

export default function HomeScreen() {
  const { user, logout } = useAuth();
  const navigation = useNavigation<any>();
  const [habits, setHabits] = useState<Habit[]>([]);
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState({
    totalHabits: 0,
    completedToday: 0,
    streak: 0,
  });

  const fetchHabits = async () => {
    try {
      setLoading(true);
      const response = await api.get("/habits");
      setHabits(response.data);
      setStats({
        totalHabits: response.data.length,
        completedToday: response.data.filter((h: any) => h.completedToday).length,
        streak: 7, // Placeholder - implementar lógica real
      });
    } catch (error) {
      console.error("Error fetching habits:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHabits();
  }, []);

  const handleLogout = () => {
    Alert.alert(
      "Cerrar sesión",
      "¿Estás seguro de que quieres cerrar sesión?",
      [
        { text: "Cancelar", style: "cancel" },
        { text: "Cerrar sesión", style: "destructive", onPress: logout },
      ]
    );
  };

  const getDayName = (day: string) => {
    const days: { [key: string]: string } = {
      monday: "Lun",
      tuesday: "Mar",
      wednesday: "Mié",
      thursday: "Jue",
      friday: "Vie",
      saturday: "Sáb",
      sunday: "Dom",
    };
    return days[day] || day;
  };

  const getCurrentDate = () => {
    const today = new Date();
    const options: Intl.DateTimeFormatOptions = {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    return today.toLocaleDateString("es-ES", options);
  };

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={fetchHabits} />
        }
      >
        {/* Header mejorado */}
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <Text style={styles.greeting}>
              ¡Hola, {user?.name || "Usuario"}!
            </Text>
            <Text style={styles.date}>Hoy es {getCurrentDate()}</Text>
          </View>
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Ionicons name="log-out-outline" size={24} color="#fff" />
          </TouchableOpacity>
        </View>

        {/* Métricas unificadas */}
        <View style={styles.statsCard}>
          <Text style={styles.statsTitle}>📊 Resumen de hoy</Text>
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>🎯</Text>
              <Text style={styles.statLabel}>Hábitos activos</Text>
              <Text style={styles.statValue}>{stats.totalHabits}</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>✅</Text>
              <Text style={styles.statLabel}>Completados hoy</Text>
              <Text style={styles.statValue}>{stats.completedToday}</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>🔥</Text>
              <Text style={styles.statLabel}>Racha más larga</Text>
              <Text style={styles.statValue}>{stats.streak} días</Text>
            </View>
          </View>
        </View>

        {/* Nueva tarjeta de acciones */}
        <View style={styles.actionsCard}>
          <Text style={styles.actionsTitle}>¿Qué quieres hacer hoy?</Text>
          <View style={styles.actionButtons}>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => navigation.navigate("CreateHabit")}
            >
              <Ionicons name="add-circle" size={24} color="#4CAF50" />
              <Text style={styles.actionText}>Crear nuevo hábito</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => navigation.navigate("Habits")}
            >
              <Ionicons name="eye" size={24} color="#2196F3" />
              <Text style={styles.actionText}>Ver mis hábitos</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => navigation.navigate("Habits")}
            >
              <Ionicons name="trending-up" size={24} color="#FF9800" />
              <Text style={styles.actionText}>Ver mi progreso</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Hábitos recientes */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Hábitos Recientes</Text>
            <TouchableOpacity onPress={() => navigation.navigate("Habits")}>
              <Text style={styles.seeAllText}>Ver todos</Text>
            </TouchableOpacity>
          </View>

          {habits.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyEmoji}>🪴</Text>
              <Text style={styles.emptyTitle}>Aún no tienes hábitos</Text>
              <Text style={styles.emptySubtext}>
                Comienza con uno pequeño. Los grandes cambios empiezan con pasos simples.
              </Text>
              <TouchableOpacity
                style={styles.createFirstButton}
                onPress={() => navigation.navigate("CreateHabit")}
              >
                <Text style={styles.createFirstText}>📋 Crear mi primer hábito</Text>
              </TouchableOpacity>
            </View>
          ) : (
            habits.slice(0, 3).map((habit) => (
              <TouchableOpacity
                key={habit.id}
                style={styles.habitCard}
                onPress={() => navigation.navigate("EditHabit", { habitId: habit.id })}
              >
                <View style={styles.habitInfo}>
                  <Text style={styles.habitName}>{habit.name}</Text>
                  <Text style={styles.habitDescription} numberOfLines={2}>
                    {habit.description}
                  </Text>
                  {habit.isRecurring && (
                    <View style={styles.daysContainer}>
                      {habit.daysOfWeek.map((day, index) => (
                        <View key={index} style={styles.dayChip}>
                          <Text style={styles.dayText}>{getDayName(day)}</Text>
                        </View>
                      ))}
                    </View>
                  )}
                </View>
                <Ionicons name="chevron-forward" size={20} color="#ccc" />
              </TouchableOpacity>
            ))
          )}
        </View>

        {/* Motivación */}
        <View style={styles.motivationContainer}>
          <View style={styles.motivationCard}>
            <Ionicons name="bulb-outline" size={32} color="#fff" />
            <Text style={styles.motivationText}>
              "Los pequeños hábitos diarios son la clave del éxito"
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* FAB - Botón flotante */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate("CreateHabit")}
      >
        <Ionicons name="add" size={30} color="#fff" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  scrollView: {
    flex: 1,
  },
  header: {
    backgroundColor: "#3B82F6",
    paddingTop: 60,
    paddingBottom: 30,
    paddingHorizontal: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  headerContent: {
    flex: 1,
  },
  greeting: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 8,
  },
  date: {
    fontSize: 16,
    color: "#fff",
    opacity: 0.9,
    textTransform: "capitalize",
  },
  logoutButton: {
    padding: 8,
  },
  statsCard: {
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
  statsTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 16,
    textAlign: "center",
  },
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  statItem: {
    alignItems: "center",
    flex: 1,
  },
  statNumber: {
    fontSize: 24,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: "#666",
    textAlign: "center",
    marginBottom: 4,
  },
  statValue: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  actionsCard: {
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
  actionsTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 16,
    textAlign: "center",
  },
  actionButtons: {
    gap: 12,
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: "#f8f9fa",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#e9ecef",
  },
  actionText: {
    fontSize: 16,
    color: "#333",
    marginLeft: 12,
    fontWeight: "500",
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
  },
  seeAllText: {
    fontSize: 14,
    color: "#3B82F6",
    fontWeight: "600",
  },
  emptyState: {
    backgroundColor: "#fff",
    padding: 40,
    borderRadius: 16,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  emptyEmoji: {
    fontSize: 48,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 8,
    textAlign: "center",
  },
  emptySubtext: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginBottom: 24,
    lineHeight: 24,
  },
  createFirstButton: {
    backgroundColor: "#3B82F6",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
  },
  createFirstText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  habitCard: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 12,
    marginBottom: 10,
    flexDirection: "row",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  habitInfo: {
    flex: 1,
  },
  habitName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 4,
  },
  habitDescription: {
    fontSize: 14,
    color: "#666",
    marginBottom: 8,
  },
  daysContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  dayChip: {
    backgroundColor: "#f0f0f0",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 5,
    marginBottom: 5,
  },
  dayText: {
    fontSize: 10,
    color: "#666",
    fontWeight: "500",
  },
  motivationContainer: {
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  motivationCard: {
    backgroundColor: "#FF6B6B",
    padding: 20,
    borderRadius: 16,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  motivationText: {
    color: "#fff",
    fontSize: 16,
    textAlign: "center",
    marginTop: 10,
    fontStyle: "italic",
  },
  fab: {
    position: "absolute",
    bottom: 30,
    right: 30,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#3B82F6",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
});
