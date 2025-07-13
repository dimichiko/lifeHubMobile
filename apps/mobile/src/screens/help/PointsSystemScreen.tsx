import React from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function PointsSystemScreen() {
  const pointSources: Array<{
    title: string;
    points: string;
    description: string;
    icon: keyof typeof Ionicons.glyphMap;
    color: string;
  }> = [
    {
      title: "Completar hábitos",
      points: "+10 puntos",
      description: "Cada vez que marques un hábito como completado",
      icon: "checkmark-circle",
      color: "#4CAF50",
    },
    {
      title: "Rachas consecutivas",
      points: "+5 puntos",
      description: "Por cada día consecutivo que completes un hábito",
      icon: "flame",
      color: "#FF6B35",
    },
    {
      title: "Logros desbloqueados",
      points: "+25 puntos",
      description: "Cuando desbloquees un logro especial",
      icon: "trophy",
      color: "#FFD700",
    },
    {
      title: "Completar meta semanal",
      points: "+50 puntos",
      description: "Al completar todos tus hábitos en una semana",
      icon: "star",
      color: "#9C27B0",
    },
  ];

  const levels = [
    { level: 1, points: "0-99", title: "Principiante", color: "#4CAF50" },
    { level: 2, points: "100-299", title: "Aprendiz", color: "#2196F3" },
    { level: 3, points: "300-599", title: "Intermedio", color: "#FF9800" },
    { level: 4, points: "600-999", title: "Avanzado", color: "#9C27B0" },
    { level: 5, points: "1000+", title: "Experto", color: "#F44336" },
  ];

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Sistema de Puntos</Text>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>⭐ ¿Cómo ganar puntos?</Text>

        {pointSources.map((source, index) => (
          <View key={index} style={styles.pointItem}>
            <View style={styles.pointHeader}>
              <View
                style={[styles.pointIcon, { backgroundColor: source.color }]}
              >
                <Ionicons name={source.icon} size={20} color="#fff" />
              </View>
              <View style={styles.pointInfo}>
                <Text style={styles.pointTitle}>{source.title}</Text>
                <Text style={styles.pointDescription}>
                  {source.description}
                </Text>
              </View>
            </View>
            <Text style={[styles.pointValue, { color: source.color }]}>
              {source.points}
            </Text>
          </View>
        ))}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>📈 Niveles y Progresión</Text>

        {levels.map((level, index) => (
          <View key={index} style={styles.levelItem}>
            <View style={styles.levelHeader}>
              <View
                style={[styles.levelBadge, { backgroundColor: level.color }]}
              >
                <Text style={styles.levelNumber}>{level.level}</Text>
              </View>
              <View style={styles.levelInfo}>
                <Text style={styles.levelTitle}>{level.title}</Text>
                <Text style={styles.levelPoints}>{level.points} puntos</Text>
              </View>
            </View>
            <View
              style={[styles.levelColor, { backgroundColor: level.color }]}
            />
          </View>
        ))}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>
          💡 Consejos para maximizar puntos
        </Text>

        <View style={styles.tipItem}>
          <Ionicons name="bulb" size={16} color="#FFD700" />
          <Text style={styles.tipText}>
            Mantén rachas consecutivas para ganar puntos extra
          </Text>
        </View>

        <View style={styles.tipItem}>
          <Ionicons name="bulb" size={16} color="#FFD700" />
          <Text style={styles.tipText}>
            Completa todos tus hábitos diarios para bonificaciones
          </Text>
        </View>

        <View style={styles.tipItem}>
          <Ionicons name="bulb" size={16} color="#FFD700" />
          <Text style={styles.tipText}>
            Desbloquea logros especiales para puntos grandes
          </Text>
        </View>

        <View style={styles.tipItem}>
          <Ionicons name="bulb" size={16} color="#FFD700" />
          <Text style={styles.tipText}>
            Sé consistente: los puntos se acumulan con el tiempo
          </Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>🎯 Beneficios de subir de nivel</Text>

        <View style={styles.benefitItem}>
          <Ionicons name="gift" size={16} color="#4CAF50" />
          <Text style={styles.benefitText}>Desbloqueas nuevos logros</Text>
        </View>

        <View style={styles.benefitItem}>
          <Ionicons name="gift" size={16} color="#4CAF50" />
          <Text style={styles.benefitText}>
            Acceso a estadísticas avanzadas
          </Text>
        </View>

        <View style={styles.benefitItem}>
          <Ionicons name="gift" size={16} color="#4CAF50" />
          <Text style={styles.benefitText}>Recompensas especiales</Text>
        </View>

        <View style={styles.benefitItem}>
          <Ionicons name="gift" size={16} color="#4CAF50" />
          <Text style={styles.benefitText}>
            Mayor motivación para continuar
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 30,
    color: "#333",
  },
  section: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#333",
  },
  pointItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  pointHeader: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  pointIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
  },
  pointInfo: {
    flex: 1,
  },
  pointTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 4,
  },
  pointDescription: {
    fontSize: 14,
    color: "#666",
  },
  pointValue: {
    fontSize: 16,
    fontWeight: "bold",
  },
  levelItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  levelHeader: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  levelBadge: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
  },
  levelNumber: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  levelInfo: {
    flex: 1,
  },
  levelTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 4,
  },
  levelPoints: {
    fontSize: 14,
    color: "#666",
  },
  levelColor: {
    width: 20,
    height: 20,
    borderRadius: 10,
  },
  tipItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
  },
  tipText: {
    fontSize: 14,
    color: "#666",
    marginLeft: 10,
    flex: 1,
    lineHeight: 20,
  },
  benefitItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
  },
  benefitText: {
    fontSize: 14,
    color: "#666",
    marginLeft: 10,
    flex: 1,
    lineHeight: 20,
  },
});
