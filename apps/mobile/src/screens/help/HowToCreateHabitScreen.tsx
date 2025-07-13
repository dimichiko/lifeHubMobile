import React from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function HowToCreateHabitScreen() {
  const steps: Array<{
    number: string;
    title: string;
    description: string;
    icon: keyof typeof Ionicons.glyphMap;
    color: string;
  }> = [
    {
      number: "1",
      title: "Navega a la pantalla de crear hábito",
      description:
        "Desde la pantalla de hábitos, toca el botón '+' para crear un nuevo hábito.",
      icon: "add-circle",
      color: "#4CAF50",
    },
    {
      number: "2",
      title: "Escribe el nombre del hábito",
      description:
        "Piensa en un nombre claro y específico. Por ejemplo: 'Beber 8 vasos de agua' en lugar de solo 'Beber agua'.",
      icon: "create",
      color: "#2196F3",
    },
    {
      number: "3",
      title: "Selecciona la frecuencia",
      description:
        "Elige entre Diario, Semanal o Mensual según tus objetivos. Comienza con hábitos diarios para mayor consistencia.",
      icon: "calendar",
      color: "#FF9800",
    },
    {
      number: "4",
      title: "Establece una meta (opcional)",
      description:
        "Define una meta específica y medible. Por ejemplo: '8 vasos de agua' o '30 minutos de ejercicio'.",
      icon: "ellipse",
      color: "#9C27B0",
    },
    {
      number: "5",
      title: "Toca 'Crear Hábito'",
      description:
        "¡Listo! Tu hábito aparecerá en la lista y podrás comenzar a marcarlo como completado.",
      icon: "checkmark-circle",
      color: "#4CAF50",
    },
  ];

  const tips = [
    "Comienza con 1-3 hábitos a la vez para no abrumarte",
    "Elige hábitos que realmente quieras cambiar",
    "Sé específico con tus metas",
    "Establece recordatorios en momentos clave del día",
    "Celebra tus pequeños logros",
  ];

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>¿Cómo crear un hábito?</Text>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>📝 Pasos para crear un hábito</Text>

        {steps.map((step, index) => (
          <View key={index} style={styles.stepItem}>
            <View style={styles.stepHeader}>
              <View
                style={[styles.stepNumber, { backgroundColor: step.color }]}
              >
                <Text style={styles.stepNumberText}>{step.number}</Text>
              </View>
              <View style={styles.stepInfo}>
                <Text style={styles.stepTitle}>{step.title}</Text>
                <Text style={styles.stepDescription}>{step.description}</Text>
              </View>
            </View>
            <View style={[styles.stepIcon, { backgroundColor: step.color }]}>
              <Ionicons name={step.icon} size={20} color="#fff" />
            </View>
          </View>
        ))}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>💡 Consejos para el éxito</Text>

        {tips.map((tip, index) => (
          <View key={index} style={styles.tipItem}>
            <Ionicons name="bulb" size={16} color="#FFD700" />
            <Text style={styles.tipText}>{tip}</Text>
          </View>
        ))}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>🎯 Ejemplos de buenos hábitos</Text>

        <View style={styles.exampleItem}>
          <Text style={styles.exampleTitle}>Salud</Text>
          <Text style={styles.exampleText}>• Beber 8 vasos de agua al día</Text>
          <Text style={styles.exampleText}>
            • Hacer 30 minutos de ejercicio
          </Text>
          <Text style={styles.exampleText}>• Dormir 8 horas</Text>
        </View>

        <View style={styles.exampleItem}>
          <Text style={styles.exampleTitle}>Productividad</Text>
          <Text style={styles.exampleText}>• Leer 20 minutos al día</Text>
          <Text style={styles.exampleText}>• Meditar 10 minutos</Text>
          <Text style={styles.exampleText}>• Planificar el día siguiente</Text>
        </View>

        <View style={styles.exampleItem}>
          <Text style={styles.exampleTitle}>Desarrollo personal</Text>
          <Text style={styles.exampleText}>• Aprender algo nuevo cada día</Text>
          <Text style={styles.exampleText}>• Escribir en un diario</Text>
          <Text style={styles.exampleText}>• Practicar gratitud</Text>
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
  stepItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  stepHeader: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  stepNumber: {
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
  },
  stepNumberText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  stepInfo: {
    flex: 1,
  },
  stepTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 4,
  },
  stepDescription: {
    fontSize: 14,
    color: "#666",
    lineHeight: 20,
  },
  stepIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
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
  exampleItem: {
    marginBottom: 20,
  },
  exampleTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 8,
  },
  exampleText: {
    fontSize: 14,
    color: "#666",
    marginBottom: 4,
    lineHeight: 20,
  },
});
