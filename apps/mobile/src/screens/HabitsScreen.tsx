import React, { useState, useRef, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator,
  Animated,
  Dimensions,
  StatusBar,
} from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useQuery } from "@tanstack/react-query";
import { useNavigation } from "@react-navigation/native";
import { getHabits } from "../utils/api";
import HabitCard from "../components/HabitCard";

const { width } = Dimensions.get("window");

type FilterType = "todos" | "activos" | "completados";
type SortType = "az" | "racha" | "fecha";

export default function HabitsScreen() {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const [filter, setFilter] = useState<FilterType>("todos");
  const [sortBy, setSortBy] = useState<SortType>("az");
  const [showSortDropdown, setShowSortDropdown] = useState(false);

  // Animaciones
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;

  const {
    data: habits,
    isLoading,
    error,
    refetch,
    isRefetching,
  } = useQuery({
    queryKey: ["habits"],
    queryFn: getHabits,
  });

  // Animación de entrada
  React.useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const handleCreateHabit = () => {
    navigation.navigate("CreateHabit" as never);
  };

  // Calcular estadísticas
  const stats = React.useMemo(() => {
    if (!habits) return { total: 0, completed: 0, active: 0, percentage: 0, longestStreak: 0 };
    const total = habits.length;
    const completed = habits.filter(h => h.isDoneToday).length;
    const active = habits.filter(h => !h.isDoneToday).length;
    const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;
    const longestStreak = Math.max(...habits.map(h => h.streak || 0), 0);
    return { total, completed, active, percentage, longestStreak };
  }, [habits]);

  // Filtrar y ordenar hábitos
  const filteredAndSortedHabits = React.useMemo(() => {
    if (!habits) return [];
    let filtered = habits;
    switch (filter) {
      case "activos":
        filtered = habits.filter(h => !h.isDoneToday);
        break;
      case "completados":
        filtered = habits.filter(h => h.isDoneToday);
        break;
      default:
        filtered = habits;
    }
    switch (sortBy) {
      case "racha":
        filtered = [...filtered].sort((a, b) => (b.streak || 0) - (a.streak || 0));
        break;
      case "fecha":
        filtered = [...filtered].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
      default:
        filtered = [...filtered].sort((a, b) => (a.name || "").localeCompare(b.name || ""));
    }
    return filtered;
  }, [habits, filter, sortBy]);

  const renderHabitCard = useCallback(({ item }) => (
    <HabitCard 
      habit={item} 
      onPress={() => navigation.navigate("EditHabit", { habit: item } as never)}
    />
  ), [navigation]);

  const renderSeparator = () => <View style={styles.separator} />;

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <Ionicons name="add-circle" size={80} color="#407BFF" style={{ marginBottom: 16 }} />
      <Text style={styles.emptyTitle}>No tienes hábitos</Text>
      <Text style={styles.emptyText}>
        Comienza creando tu primer hábito para mejorar tu vida
      </Text>
      <TouchableOpacity
        style={styles.createFirstButton}
        onPress={handleCreateHabit}
        accessibilityLabel="Crear mi primer hábito"
        accessibilityRole="button"
      >
        <LinearGradient colors={["#407BFF", "#2A60E6"]} style={styles.createFirstGradient}>
          <Text style={styles.createFirstButtonText}>
            Crea el primero
          </Text>
        </LinearGradient>
      </TouchableOpacity>
    </View>
  );

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#407BFF" />
        <Text style={styles.loadingText}>Cargando hábitos...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Ionicons name="alert-circle" size={64} color="#ff6b6b" style={{ marginBottom: 16 }} />
        <Text style={styles.errorText}>
          Error al cargar hábitos: {(error as any).message}
        </Text>
        <TouchableOpacity 
          style={styles.retryButton} 
          onPress={() => refetch()}
          accessibilityLabel="Reintentar carga de hábitos"
          accessibilityRole="button"
        >
          <Text style={styles.retryButtonText}>Reintentar</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      {/* Header minimalista */}
      <View style={styles.header}>
        <Text style={styles.title}>Mis hábitos</Text>
        <TouchableOpacity
          style={styles.createButton}
          onPress={handleCreateHabit}
          accessibilityLabel="Crear nuevo hábito"
          accessibilityRole="button"
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <LinearGradient colors={["#407BFF", "#2A60E6"]} style={styles.createButtonGradient}>
            <Ionicons name="add" size={16} color="white" />
            <Text style={styles.createButtonText}>Nuevo</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
      {/* Resumen del día */}
      <View style={styles.summaryCard}>
        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <View 
              style={[
                styles.progressFill, 
                { width: `${stats.percentage}%` }
              ]} 
            />
          </View>
          <Text style={styles.progressText}>
            {stats.completed} / {stats.total} hábitos completados
          </Text>
        </View>
        <View style={styles.streakContainer}>
          <Ionicons name="flame" size={16} color="#F59421" />
          <Text style={styles.streakText}>
            Racha más larga: {stats.longestStreak} días
          </Text>
        </View>
      </View>
      {/* Filtro y orden */}
      <View style={styles.filterContainer}>
        <View style={styles.filterPills}>
          {(["todos", "activos", "completados"] as FilterType[]).map((filterType) => (
            <TouchableOpacity
              key={filterType}
              style={[
                styles.filterPill,
                filter === filterType && styles.filterPillActive
              ]}
              onPress={() => setFilter(filterType)}
              accessibilityLabel={`Filtrar por ${filterType}`}
              accessibilityRole="button"
            >
              <Text style={[
                styles.filterPillText,
                filter === filterType && styles.filterPillTextActive
              ]}>
                {filterType.charAt(0).toUpperCase() + filterType.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
        <TouchableOpacity
          style={styles.sortButton}
          onPress={() => setShowSortDropdown(!showSortDropdown)}
          accessibilityLabel="Ordenar hábitos"
          accessibilityRole="button"
        >
          <Ionicons name="funnel" size={16} color="#666" />
          <Text style={styles.sortButtonText}>
            {sortBy === "az" ? "A→Z" : sortBy === "racha" ? "Racha" : "Fecha"}
          </Text>
          <Ionicons name="chevron-down" size={12} color="#666" />
        </TouchableOpacity>
      </View>
      {showSortDropdown && (
        <View style={styles.sortDropdown}>
          {[
            { key: "az", label: "A→Z" },
            { key: "racha", label: "Racha" },
            { key: "fecha", label: "Fecha" }
          ].map(({ key, label }) => (
            <TouchableOpacity
              key={key}
              style={styles.sortOption}
              onPress={() => {
                setSortBy(key as SortType);
                setShowSortDropdown(false);
              }}
              accessibilityLabel={`Ordenar por ${label}`}
              accessibilityRole="button"
            >
              <Text style={[
                styles.sortOptionText,
                sortBy === key && styles.sortOptionTextActive
              ]}>
                {label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
      {/* Lista de hábitos */}
      <Animated.View style={[
        styles.listContainer,
        { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }
      ]}>
        <FlatList
          data={filteredAndSortedHabits}
          renderItem={renderHabitCard}
          keyExtractor={(item) => item.id}
          ItemSeparatorComponent={renderSeparator}
          ListEmptyComponent={renderEmptyState}
          refreshControl={
            <RefreshControl 
              refreshing={isRefetching} 
              onRefresh={refetch}
              tintColor="#407BFF"
              colors={["#407BFF"]}
            />
          }
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
        />
      </Animated.View>
      {/* Resumen rápido al pie */}
      {habits && habits.length > 0 && (
        <View style={styles.footerSummary}>
          <View style={styles.footerItem}>
            <Ionicons name="locate" size={16} color="#407BFF" />
            <Text style={styles.footerNumber}>{stats.total}</Text>
            <Text style={styles.footerLabel}>Activos</Text>
          </View>
          <View style={styles.footerItem}>
            <Ionicons name="checkmark-done-circle" size={16} color="#10B981" />
            <Text style={styles.footerNumber}>{stats.completed}</Text>
            <Text style={styles.footerLabel}>Completados</Text>
          </View>
          <View style={styles.footerItem}>
            <Ionicons name="time" size={16} color="#F59E42" />
            <Text style={styles.footerNumber}>{stats.active}</Text>
            <Text style={styles.footerLabel}>Pendientes</Text>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f8f9fa",
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: "#666",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#f8f9fa",
  },
  errorText: {
    fontSize: 16,
    color: "#ff6b6b",
    textAlign: "center",
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: "#407BFF",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 20,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#e9ecef",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1A1A2E",
  },
  createButton: {
    borderRadius: 20,
    overflow: "hidden",
  },
  createButtonGradient: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 8,
    gap: 4,
  },
  createButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  summaryCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    margin: 16,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
  },
  progressContainer: {
    marginBottom: 12,
  },
  progressBar: {
    height: 8,
    backgroundColor: "#e9ecef",
    borderRadius: 4,
    overflow: "hidden",
    marginBottom: 8,
  },
  progressFill: {
    height: "100%",
    backgroundColor: "#407BFF",
    borderRadius: 4,
  },
  progressText: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
  },
  streakContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
  },
  streakText: {
    fontSize: 14,
    color: "#666",
  },
  filterContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  filterPills: {
    flexDirection: "row",
    gap: 8,
  },
  filterPill: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: "#f1f3f4",
  },
  filterPillActive: {
    backgroundColor: "#407BFF",
  },
  filterPillText: {
    fontSize: 14,
    color: "#666",
    fontWeight: "500",
  },
  filterPillTextActive: {
    color: "#fff",
  },
  sortButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
    backgroundColor: "#f1f3f4",
  },
  sortButtonText: {
    fontSize: 14,
    color: "#666",
    fontWeight: "500",
  },
  sortDropdown: {
    position: "absolute",
    top: 80,
    right: 16,
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 8,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    zIndex: 1000,
  },
  sortOption: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
  },
  sortOptionText: {
    fontSize: 14,
    color: "#666",
  },
  sortOptionTextActive: {
    color: "#407BFF",
    fontWeight: "600",
  },
  listContainer: {
    flex: 1,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 100,
  },
  separator: {
    height: 8,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 40,
    paddingVertical: 60,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1A1A2E",
    marginBottom: 12,
    textAlign: "center",
  },
  emptyText: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginBottom: 30,
    lineHeight: 24,
  },
  createFirstButton: {
    borderRadius: 12,
    overflow: "hidden",
  },
  createFirstGradient: {
    paddingHorizontal: 24,
    paddingVertical: 16,
    alignItems: "center",
  },
  createFirstButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
  footerSummary: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#fff",
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 12,
    paddingHorizontal: 16,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  footerItem: {
    alignItems: "center",
    gap: 4,
  },
  footerNumber: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#1A1A2E",
  },
  footerLabel: {
    fontSize: 12,
    color: "#666",
    fontWeight: "500",
  },
});
