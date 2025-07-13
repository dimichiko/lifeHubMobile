import React from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function StreaksScreen() {
  const streakTypes: Array<{
    title: string;
    description: string;
    icon: keyof typeof Ionicons.glyphMap;
    color: string;
    bonus: string;
  }> = [
    {
      title: "Racha Diaria",
      description: "Completa un hábito todos los días consecutivos",
      icon: "calendar",
      color: "#4CAF50",
      bonus: "+5 puntos por día",
    },
    {
      title: "Racha Semanal",
      description: "Completa todos tus hábitos en una semana completa",
      icon: "star",
      color: "#FFD700",
      bonus: "+25 puntos por semana",
    },
    {
      title: "Racha Mensual",
      description: "Mantén consistencia durante todo un mes",
      icon: "trophy",
      color: "#FF6B35",
      bonus: "+100 puntos por mes",
    },
  ];

  const streakTips = [
    "Comienza con hábitos pequeños y fáciles",
    "Establece recordatorios en momentos clave",
    "No te desanimes si pierdes una racha",
    "Celebra cada día que mantengas la racha",
    "Visualiza tu progreso en el dashboard",
  ];

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Rachas y Streaks</Text>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>🔥 Tipos de Rachas</Text>

        {streakTypes.map((streak, index) => (
          <View key={index} style={styles.streakItem}>
            <View style={styles.streakHeader}>
              <View
                style={[styles.streakIcon, { backgroundColor: streak.color }]}
              >
                <Ionicons name={streak.icon} size={24} color="#fff" />
              </View>
              <View style={styles.streakInfo}>
                <Text style={styles.streakTitle}>{streak.title}</Text>
                <Text style={styles.streakDescription}>
                  {streak.description}
                </Text>
                <Text style={[styles.streakBonus, { color: streak.color }]}>
                  {streak.bonus}
                </Text>
              </View>
            </View>
          </View>
        ))}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>
          💡 Consejos para mantener rachas
        </Text>

        {streakTips.map((tip, index) => (
          <View key={index} style={styles.tipItem}>
            <Ionicons name="bulb" size={16} color="#FFD700" />
            <Text style={styles.tipText}>{tip}</Text>
          </View>
        ))}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>📊 Cómo funcionan las rachas</Text>

        <View style={styles.infoItem}>
          <Ionicons name="checkmark-circle" size={16} color="#4CAF50" />
          <Text style={styles.infoText}>
            Una racha se cuenta desde el primer día que completas un hábito
          </Text>
        </View>

        <View style={styles.infoItem}>
          <Ionicons name="checkmark-circle" size={16} color="#4CAF50" />
          <Text style={styles.infoText}>
            Si pierdes un día, la racha se reinicia pero no pierdes puntos
          </Text>
        </View>

        <View style={styles.infoItem}>
          <Ionicons name="checkmark-circle" size={16} color="#4CAF50" />
          <Text style={styles.infoText}>
            Las rachas más largas dan más puntos y logros especiales
          </Text>
        </View>

        <View style={styles.infoItem}>
          <Ionicons name="checkmark-circle" size={16} color="#4CAF50" />
          <Text style={styles.infoText}>
            Puedes ver tu progreso en tiempo real en el dashboard
          </Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>🎯 Beneficios de las rachas</Text>

        <View style={styles.benefitItem}>
          <Ionicons name="gift" size={16} color="#4CAF50" />
          <Text style={styles.benefitText}>Puntos extra por consistencia</Text>
        </View>

        <View style={styles.benefitItem}>
          <Ionicons name="gift" size={16} color="#4CAF50" />
          <Text style={styles.benefitText}>
            Logros especiales desbloqueados
          </Text>
        </View>

        <View style={styles.benefitItem}>
          <Ionicons name="gift" size={16} color="#4CAF50" />
          <Text style={styles.benefitText}>
            Mayor motivación para continuar
          </Text>
        </View>

        <View style={styles.benefitItem}>
          <Ionicons name="gift" size={16} color="#4CAF50" />
          <Text style={styles.benefitText}>
            Formación de hábitos más efectiva
          </Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>
          ⚠️ Qué hacer si pierdes una racha
        </Text>

        <View style={styles.recoveryItem}>
          <Ionicons name="refresh" size={16} color="#FF9800" />
          <Text style={styles.recoveryText}>
            No te desanimes, las rachas se pueden recuperar
          </Text>
        </View>

        <View style={styles.recoveryItem}>
          <Ionicons name="refresh" size={16} color="#FF9800" />
          <Text style={styles.recoveryText}>
            Analiza qué causó la interrupción y ajusta tu estrategia
          </Text>
        </View>

        <View style={styles.recoveryItem}>
          <Ionicons name="refresh" size={16} color="#FF9800" />
          <Text style={styles.recoveryText}>
            Comienza de nuevo con más determinación
          </Text>
        </View>

        <View style={styles.recoveryItem}>
          <Ionicons name="refresh" size={16} color="#FF9800" />
          <Text style={styles.recoveryText}>
            Recuerda que el progreso no se pierde, solo se pausa
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
  streakItem: {
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  streakHeader: {
    flexDirection: "row",
    alignItems: "center",
  },
  streakIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
  },
  streakInfo: {
    flex: 1,
  },
  streakTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 4,
  },
  streakDescription: {
    fontSize: 14,
    color: "#666",
    marginBottom: 4,
  },
  streakBonus: {
    fontSize: 12,
    fontWeight: "bold",
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
  infoItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
  },
  infoText: {
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
  recoveryItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
  },
  recoveryText: {
    fontSize: 14,
    color: "#666",
    marginLeft: 10,
    flex: 1,
    lineHeight: 20,
  },
});
