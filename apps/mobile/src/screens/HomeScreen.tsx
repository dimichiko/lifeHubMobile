import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  RefreshControl,
  Animated,
  StatusBar,
  StyleSheet,
  Dimensions,
} from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useAuth } from "../providers/AuthProvider";
import { useNavigation } from "@react-navigation/native";
import HabitCard from "../components/HabitCard";
import { api } from "../utils/api";

const { width } = Dimensions.get("window");

export default function HomeScreen() {
  const { user } = useAuth();
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const [dashboard, setDashboard] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Animaciones
  const headerOpacity = useRef(new Animated.Value(0)).current;
  const summaryY = useRef(new Animated.Value(40)).current;
  const progressX = useRef(new Animated.Value(-60)).current;
  const motivationPulse = useRef(new Animated.Value(1)).current;
  const fabScale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.timing(headerOpacity, {
      toValue: 1,
      duration: 350,
      useNativeDriver: true,
    }).start();
    Animated.timing(summaryY, {
      toValue: 0,
      duration: 350,
      delay: 200,
      useNativeDriver: true,
    }).start();
    Animated.timing(progressX, {
      toValue: 0,
      duration: 350,
      delay: 400,
      useNativeDriver: true,
    }).start();
    Animated.loop(
      Animated.sequence([
        Animated.timing(motivationPulse, { toValue: 1.03, duration: 1200, useNativeDriver: true }),
        Animated.timing(motivationPulse, { toValue: 1, duration: 1200, useNativeDriver: true }),
      ])
    ).start();
  }, []);

  const fetchDashboard = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get("/habits/dashboard");
      setDashboard(res.data);
    } catch {
      setDashboard(null);
    }
    setLoading(false);
  }, []);

  useEffect(() => { fetchDashboard(); }, [fetchDashboard]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchDashboard();
    setRefreshing(false);
  }, [fetchDashboard]);

  // Fecha formateada
  const getDate = () => {
    const d = new Date();
    return d.toLocaleDateString("es-ES", { weekday: "long", day: "numeric", month: "long" });
  };

  // Motivación dinámica
  const streak = dashboard?.currentStreak || 0;
  const motivation = streak < 3
    ? { text: "¡Cada día cuenta! Los pequeños pasos llevan a grandes cambios.", bg: "#FEF3C7", color: "#92400E" }
    : streak < 7 ? { text: "¡Excelente! Estás construyendo un hábito sólido.", bg: "#D1FAE5", color: "#065F46" }
    : { text: "¡Increíble! Eres una máquina de consistencia.", bg: "#DBEAFE", color: "#1E40AF" };

  // FAB
  const handleFab = () => {
    Animated.sequence([
      Animated.timing(fabScale, { toValue: 0.9, duration: 80, useNativeDriver: true }),
      Animated.timing(fabScale, { toValue: 1, duration: 80, useNativeDriver: true }),
    ]).start(() => navigation.navigate("CreateHabit" as never));
  };

  // Skeleton loader
  if (loading) {
    return (
      <View style={{ flex: 1, backgroundColor: "#f8f9fa" }}>
        <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />
        <SafeAreaView edges={["top"]} style={{ flex: 0, backgroundColor: "transparent" }}>
          <LinearGradient colors={["#407BFF", "#2A60E6"]} style={{
            width: "100%",
            paddingTop: (insets?.top || 0) + 24,
            paddingHorizontal: 20,
            paddingBottom: 20,
            borderBottomLeftRadius: 24,
            borderBottomRightRadius: 24,
            overflow: "hidden",
          }}>
            <View style={{ height: 28, width: 180, backgroundColor: "#ffffff33", borderRadius: 8, marginBottom: 10 }} />
            <View style={{ height: 16, width: 120, backgroundColor: "#ffffff33", borderRadius: 6 }} />
          </LinearGradient>
        </SafeAreaView>
        <View style={styles.skeletonCard} />
        <View style={styles.skeletonCard} />
        <View style={styles.skeletonCard} />
      </View>
    );
  }

  // Mini gráfico de barras (dummy data)
  const weekData = dashboard?.weekProgress || [2, 4, 3, 1, 0, 2, 1];
  const maxVal = Math.max(...weekData, 1);

  return (
    <View style={{ flex: 1, backgroundColor: "#f8f9fa" }}>
      <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />
      {/* Header vibrante y seguro para notch */}
      <Animated.View style={{ opacity: headerOpacity }}>
        <LinearGradient
          colors={["#407BFF", "#2A60E6"]}
          style={{
            width: "100%",
            paddingTop: insets.top + 32,
            paddingHorizontal: 20,
            paddingBottom: 48, // más espacio para que el resumen no tape el header
            borderBottomLeftRadius: 24,
            borderBottomRightRadius: 24,
            borderTopLeftRadius: 0,
            borderTopRightRadius: 0,
            overflow: "hidden",
          }}
        >
          <Text style={styles.greeting} accessibilityLabel="Saludo">
            ¡Hola, {user?.name?.split(" ")[0] || "Usuario"}!
          </Text>
          <Text style={[styles.date, { opacity: 0.5 }]}>{getDate()}</Text>
        </LinearGradient>
      </Animated.View>
      {/* Resumen con solapamiento dinámico */}
      <Animated.View style={[
        styles.summaryCard,
        { transform: [{ translateY: summaryY }], marginTop: -24 }
      ]}>
        <View style={styles.summaryRow}>
          <View style={styles.summaryCol}>
            <Ionicons name="locate" size={28} color="#407BFF" style={{ marginBottom: 2 }} />
            <Text style={styles.summaryNum}>{dashboard?.totalHabits || 0}</Text>
            <Text style={styles.summaryLabel}>Hábitos</Text>
          </View>
          <View style={styles.summaryCol}>
            <Ionicons name="checkmark-done-circle" size={28} color="#10B981" style={{ marginBottom: 2 }} />
            <Text style={styles.summaryNum}>{dashboard?.completedToday || 0}</Text>
            <Text style={styles.summaryLabel}>Completados</Text>
          </View>
          <View style={styles.summaryCol}>
            <Ionicons name="flame" size={28} color="#F59E42" style={{ marginBottom: 2 }} />
            <Text style={styles.summaryNum}>{dashboard?.currentStreak || 0}</Text>
            <Text style={styles.summaryLabel}>Racha</Text>
          </View>
        </View>
      </Animated.View>
      {/* Gráfica de progreso semanal */}
      <Animated.View style={[
        styles.progressCard,
        { transform: [{ translateX: progressX }] }
      ]}>
        <Text style={styles.progressTitle}>Progreso semanal</Text>
        <Text style={styles.progressSubtitle}>% completados por día</Text>
        <View style={styles.barChart}>
          {weekData.map((val, i) => (
            <View key={i} style={styles.barContainer}>
              <View style={[
                styles.bar,
                {
                  width: 12, // más ancho
                  height: 48 * (val / maxVal),
                  backgroundColor: "#407BFF",
                  opacity: 0.7 + 0.3 * (val / maxVal)
                }
              ]} />
              <Text style={styles.barLabel}>{["L", "M", "X", "J", "V", "S", "D"][i]}</Text>
            </View>
          ))}
        </View>
      </Animated.View>
      {/* Mensaje motivacional */}
      <Animated.View
        style={[
          styles.motivationCard,
          {
            backgroundColor: motivation.bg,
            transform: [{ scale: motivationPulse }],
            marginTop: 16,
          },
        ]}
      >
        <Text style={[styles.motivationText, { color: motivation.color }]} accessibilityLabel="Frase motivacional">
          {motivation.text}
        </Text>
      </Animated.View>
      {/* Lista de hábitos */}
      <FlatList
        data={dashboard?.habits || []}
        keyExtractor={h => h.id}
        renderItem={({ item }) => <HabitCard habit={item} onPress={() => {}} />}
        contentContainerStyle={styles.habitsList}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#407BFF" colors={["#407BFF"]} />
        }
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Ionicons name="add-circle" size={80} color="#407BFF" style={{ marginBottom: 16 }} />
            <Text style={styles.emptyTitle}>No tienes hábitos aún</Text>
            <Text style={styles.emptySubtitle}>Toca + para empezar</Text>
          </View>
        }
        showsVerticalScrollIndicator={false}
      />
      {/* FAB */}
      <Animated.View style={[styles.fabContainer, { transform: [{ scale: fabScale }] }]}> 
        <TouchableOpacity
          style={styles.fab}
          onPress={handleFab}
          activeOpacity={0.8}
          accessibilityLabel="Crear nuevo hábito"
          accessibilityRole="button"
        >
          <LinearGradient colors={["#407BFF", "#2A60E6"]} style={styles.fabGradient}>
            <Ionicons name="add" size={28} color="white" />
          </LinearGradient>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  greeting: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
    marginBottom: 4,
    textAlign: "left",
  },
  date: {
    fontSize: 14,
    color: "rgba(255,255,255,0.8)",
    textAlign: "left",
  },
  summaryCard: {
    width: "90%",
    maxWidth: 420,
    alignSelf: "center",
    backgroundColor: "white",
    borderRadius: 18,
    padding: 18,
    marginBottom: 18,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
  },
  summaryRow: { flexDirection: "row", justifyContent: "space-between" },
  summaryCol: { alignItems: "center", flex: 1 },
  summaryNum: { fontSize: 32, fontWeight: "bold", color: "#1A1A2E", marginBottom: 2 },
  summaryLabel: { fontSize: 13, color: "#666", fontWeight: "500", textTransform: 'capitalize' },
  progressCard: {
    width: "90%",
    maxWidth: 420,
    alignSelf: "center",
    backgroundColor: "white",
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
  },
  progressTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1A1A2E",
    marginBottom: 4,
    textAlign: "left",
  },
  progressSubtitle: {
    fontSize: 12,
    color: "#888",
    marginBottom: 10,
    textAlign: "left",
  },
  barChart: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
    height: 52,
    marginTop: 2,
    marginBottom: 2,
    paddingHorizontal: 8,
  },
  barContainer: { alignItems: "center", flex: 1, marginHorizontal: 2 },
  bar: {
    width: 12,
    borderRadius: 6,
    marginBottom: 4,
  },
  barLabel: {
    fontSize: 11,
    color: "#888",
    fontWeight: "500",
    textAlign: "center",
  },
  motivationCard: {
    width: "88%",
    alignSelf: "center",
    borderRadius: 14,
    padding: 14,
    marginBottom: 18,
    elevation: 1,
  },
  motivationText: { fontSize: 15, fontWeight: "600", textAlign: "center" },
  habitsList: { paddingBottom: 120 },
  emptyState: { alignItems: "center", justifyContent: "center", paddingVertical: 60 },
  emptyTitle: { fontSize: 20, fontWeight: "bold", color: "#1a1a2e", textAlign: "center", marginBottom: 8 },
  emptySubtitle: { fontSize: 14, color: "#666", textAlign: "center" },
  fabContainer: { position: "absolute", bottom: 24, right: 24, zIndex: 10 },
  fab: {
    width: 56, height: 56, borderRadius: 28,
    elevation: 4, shadowColor: "#000", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 8,
  },
  fabGradient: { width: 56, height: 56, borderRadius: 28, justifyContent: "center", alignItems: "center" },
  skeletonCard: {
    width: "90%", backgroundColor: "#e5e7eb", borderRadius: 16, alignSelf: "center", marginVertical: 8,
  },
}); 