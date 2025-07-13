import React from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function AchievementsScreen() {
  const achievements: Array<{
    title: string;
    description: string;
    icon: keyof typeof Ionicons.glyphMap;
    color: string;
    requirement: string;
  }> = [
    {
      title: "Primer Paso",
      description: "Completa tu primer hábito",
      icon: "footsteps",
      color: "#4CAF50",
      requirement: "1 hábito completado",
    },
    {
      title: "Consistente",
      description: "Mantén una racha de 7 días",
      icon: "flame",
      color: "#FF6B35",
      requirement: "7 días consecutivos",
    },
    {
      title: "Maestro",
      description: "Completa 30 hábitos en un mes",
      icon: "trophy",
      color: "#FFD700",
      requirement: "30 hábitos en 30 días",
    },
    {
      title: "Perfeccionista",
      description: "Completa todos tus hábitos en una semana",
      icon: "star",
      color: "#9C27B0",
      requirement: "100% de hábitos en 7 días",
    },
    {
      title: "Leyenda",
      description: "Mantén una racha de 100 días",
      icon: "medal",
      color: "#F44336",
      requirement: "100 días consecutivos",
    },
  ];

  const rewards: Array<{
    title: string;
    rewards: string[];
    color: string;
  }> = [
    {
      title: "Nivel 1",
      rewards: ["Acceso a estadísticas básicas", "Logros básicos"],
      color: "#4CAF50",
    },
    {
      title: "Nivel 2",
      rewards: [
        "Estadísticas avanzadas",
        "Logros intermedios",
        "Recompensas especiales",
      ],
      color: "#2196F3",
    },
    {
      title: "Nivel 3",
      rewards: [
        "Dashboard personalizado",
        "Logros avanzados",
        "Insignias exclusivas",
      ],
      color: "#FF9800",
    },
    {
      title: "Nivel 4",
      rewards: [
        "Todas las funciones",
        "Logros legendarios",
        "Recompensas únicas",
      ],
      color: "#9C27B0",
    },
    {
      title: "Nivel 5",
      rewards: ["Acceso VIP", "Logros exclusivos", "Recompensas premium"],
      color: "#F44336",
    },
  ];

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Logros y Recompensas</Text>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>🏆 Logros Disponibles</Text>

        {achievements.map((achievement, index) => (
          <View key={index} style={styles.achievementItem}>
            <View style={styles.achievementHeader}>
              <View
                style={[
                  styles.achievementIcon,
                  { backgroundColor: achievement.color },
                ]}
              >
                <Ionicons name={achievement.icon} size={24} color="#fff" />
              </View>
              <View style={styles.achievementInfo}>
                <Text style={styles.achievementTitle}>{achievement.title}</Text>
                <Text style={styles.achievementDescription}>
                  {achievement.description}
                </Text>
                <Text style={styles.achievementRequirement}>
                  {achievement.requirement}
                </Text>
              </View>
            </View>
            <View
              style={[
                styles.achievementStatus,
                { backgroundColor: achievement.color },
              ]}
            >
              <Ionicons name="lock-open" size={16} color="#fff" />
            </View>
          </View>
        ))}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>🎁 Recompensas por Nivel</Text>

        {rewards.map((level, index) => (
          <View key={index} style={styles.rewardItem}>
            <View style={styles.rewardHeader}>
              <View
                style={[styles.rewardBadge, { backgroundColor: level.color }]}
              >
                <Text style={styles.rewardLevel}>{level.title}</Text>
              </View>
              <View style={styles.rewardInfo}>
                <Text style={styles.rewardTitle}>{level.title}</Text>
                {level.rewards.map((reward, rewardIndex) => (
                  <Text key={rewardIndex} style={styles.rewardText}>
                    • {reward}
                  </Text>
                ))}
              </View>
            </View>
          </View>
        ))}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>💡 Cómo desbloquear logros</Text>

        <View style={styles.tipItem}>
          <Ionicons name="bulb" size={16} color="#FFD700" />
          <Text style={styles.tipText}>
            Completa hábitos regularmente para desbloquear logros básicos
          </Text>
        </View>

        <View style={styles.tipItem}>
          <Ionicons name="bulb" size={16} color="#FFD700" />
          <Text style={styles.tipText}>
            Mantén rachas consecutivas para logros de consistencia
          </Text>
        </View>

        <View style={styles.tipItem}>
          <Ionicons name="bulb" size={16} color="#FFD700" />
          <Text style={styles.tipText}>
            Completa metas semanales para logros especiales
          </Text>
        </View>

        <View style={styles.tipItem}>
          <Ionicons name="bulb" size={16} color="#FFD700" />
          <Text style={styles.tipText}>
            Sube de nivel para acceder a logros más avanzados
          </Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>⭐ Beneficios de los logros</Text>

        <View style={styles.benefitItem}>
          <Ionicons name="gift" size={16} color="#4CAF50" />
          <Text style={styles.benefitText}>
            Puntos extra para subir de nivel
          </Text>
        </View>

        <View style={styles.benefitItem}>
          <Ionicons name="gift" size={16} color="#4CAF50" />
          <Text style={styles.benefitText}>
            Insignias para mostrar tu progreso
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
  achievementItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  achievementHeader: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  achievementIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
  },
  achievementInfo: {
    flex: 1,
  },
  achievementTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 4,
  },
  achievementDescription: {
    fontSize: 14,
    color: "#666",
    marginBottom: 4,
  },
  achievementRequirement: {
    fontSize: 12,
    color: "#999",
    fontStyle: "italic",
  },
  achievementStatus: {
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
  },
  rewardItem: {
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  rewardHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  rewardBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    marginRight: 15,
  },
  rewardLevel: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 12,
  },
  rewardInfo: {
    flex: 1,
  },
  rewardTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 8,
  },
  rewardText: {
    fontSize: 14,
    color: "#666",
    marginBottom: 4,
    lineHeight: 20,
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
