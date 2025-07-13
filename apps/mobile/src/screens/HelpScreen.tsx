import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Linking,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import type { StackNavigationProp } from "@react-navigation/stack";

type RootStackParamList = {
  HowToCreateHabit: undefined;
  PointsSystem: undefined;
  Achievements: undefined;
  Streaks: undefined;
  Contact: undefined;
  Support: undefined;
  Suggestions: undefined;
  BugReport: undefined;
};

type NavigationProp = StackNavigationProp<RootStackParamList>;

type HelpScreenKey = keyof RootStackParamList;

export default function HelpScreen() {
  const navigation = useNavigation<NavigationProp>();

  const helpTopics: Array<{
    title: string;
    description: string;
    icon: keyof typeof Ionicons.glyphMap;
    color: string;
    screen: HelpScreenKey;
  }> = [
    {
      title: "¿Cómo crear un hábito?",
      description: "Aprende a crear y configurar tus primeros hábitos",
      icon: "add-circle",
      color: "#4CAF50",
      screen: "HowToCreateHabit",
    },
    {
      title: "Sistema de puntos",
      description: "Entiende cómo ganar puntos y subir de nivel",
      icon: "star",
      color: "#FFD700",
      screen: "PointsSystem",
    },
    {
      title: "Logros y recompensas",
      description: "Descubre todos los logros disponibles",
      icon: "trophy",
      color: "#FF6B35",
      screen: "Achievements",
    },
    {
      title: "Rachas y streaks",
      description: "Mantén tus rachas consecutivas",
      icon: "flame",
      color: "#FF3B30",
      screen: "Streaks",
    },
  ];

  const contactInfo: Array<{
    title: string;
    description: string;
    icon: keyof typeof Ionicons.glyphMap;
    color: string;
    action: () => void;
  }> = [
    {
      title: "Soporte técnico",
      description: "Obtén ayuda con problemas técnicos",
      icon: "headset",
      color: "#007AFF",
      action: () => navigation.navigate("Support"),
    },
    {
      title: "Sugerencias",
      description: "Comparte tus ideas para mejorar la app",
      icon: "bulb",
      color: "#9C27B0",
      action: () => navigation.navigate("Suggestions"),
    },
    {
      title: "Reportar bug",
      description: "Ayúdanos a mejorar reportando errores",
      icon: "bug",
      color: "#F44336",
      action: () => navigation.navigate("BugReport"),
    },
  ];

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Centro de Ayuda</Text>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>📚 Guías Rápidas</Text>

        {helpTopics.map((topic, index) => (
          <TouchableOpacity
            key={index}
            style={styles.topicItem}
            onPress={() => navigation.navigate(topic.screen)}
          >
            <View style={styles.topicInfo}>
              <View
                style={[styles.topicIcon, { backgroundColor: topic.color }]}
              >
                <Ionicons name={topic.icon} size={24} color="#fff" />
              </View>
              <View style={styles.topicText}>
                <Text style={styles.topicTitle}>{topic.title}</Text>
                <Text style={styles.topicDescription}>{topic.description}</Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#ccc" />
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>📞 Contacto</Text>

        {contactInfo.map((contact, index) => (
          <TouchableOpacity
            key={index}
            style={styles.contactItem}
            onPress={contact.action}
          >
            <View style={styles.contactInfo}>
              <View
                style={[styles.contactIcon, { backgroundColor: contact.color }]}
              >
                <Ionicons name={contact.icon} size={24} color="#fff" />
              </View>
              <View style={styles.contactText}>
                <Text style={styles.contactTitle}>{contact.title}</Text>
                <Text style={styles.contactDescription}>
                  {contact.description}
                </Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#ccc" />
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>ℹ️ Información</Text>
        <View style={styles.infoCard}>
          <Text style={styles.infoTitle}>LifeHub v1.0.0</Text>
          <Text style={styles.infoText}>
            Aplicación para el seguimiento de hábitos y desarrollo personal.
            Desarrollada con React Native y NestJS.
          </Text>
          <Text style={styles.infoText}>
            © 2024 LifeHub. Todos los derechos reservados.
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
  topicItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  topicInfo: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  topicIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
  },
  topicText: {
    flex: 1,
  },
  topicTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 4,
  },
  topicDescription: {
    fontSize: 14,
    color: "#666",
  },
  contactItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  contactInfo: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  contactIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
  },
  contactText: {
    flex: 1,
  },
  contactTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 4,
  },
  contactDescription: {
    fontSize: 14,
    color: "#666",
  },
  infoCard: {
    backgroundColor: "#f8f9fa",
    padding: 20,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 10,
    textAlign: "center",
  },
  infoText: {
    fontSize: 14,
    color: "#666",
    lineHeight: 20,
    marginBottom: 8,
    textAlign: "center",
  },
});
