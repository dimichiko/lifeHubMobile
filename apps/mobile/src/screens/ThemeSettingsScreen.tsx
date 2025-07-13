import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function ThemeSettingsScreen() {
  const [selectedTheme, setSelectedTheme] = useState("light");

  const themes = [
    {
      id: "light",
      name: "Claro",
      description: "Tema claro por defecto",
      icon: "sunny",
      color: "#FFD700",
    },
    {
      id: "dark",
      name: "Oscuro",
      description: "Tema oscuro para uso nocturno",
      icon: "moon",
      color: "#4A4A4A",
    },
    {
      id: "auto",
      name: "Automático",
      description: "Se adapta al sistema",
      icon: "settings",
      color: "#007AFF",
    },
  ];

  const handleThemeChange = (themeId: string) => {
    setSelectedTheme(themeId);
    Alert.alert(
      "Tema cambiado",
      `Has seleccionado el tema: ${themes.find((t) => t.id === themeId)?.name}`,
    );
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Seleccionar Tema</Text>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Temas Disponibles</Text>

        {themes.map((theme) => (
          <TouchableOpacity
            key={theme.id}
            style={[
              styles.themeItem,
              selectedTheme === theme.id && styles.themeItemSelected,
            ]}
            onPress={() => handleThemeChange(theme.id)}
          >
            <View style={styles.themeInfo}>
              <View
                style={[styles.themeIcon, { backgroundColor: theme.color }]}
              >
                <Ionicons name={theme.icon as any} size={24} color="#fff" />
              </View>
              <View style={styles.themeText}>
                <Text style={styles.themeName}>{theme.name}</Text>
                <Text style={styles.themeDescription}>{theme.description}</Text>
              </View>
            </View>
            {selectedTheme === theme.id && (
              <Ionicons name="checkmark-circle" size={24} color="#007AFF" />
            )}
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Vista Previa</Text>
        <View style={styles.previewCard}>
          <Text style={styles.previewTitle}>Vista previa del tema</Text>
          <Text style={styles.previewText}>
            Esta es una vista previa de cómo se verá la aplicación con el tema
            seleccionado.
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
  themeItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 15,
    paddingHorizontal: 15,
    borderRadius: 8,
    marginBottom: 10,
    backgroundColor: "#f8f9fa",
  },
  themeItemSelected: {
    backgroundColor: "#e3f2fd",
    borderColor: "#007AFF",
    borderWidth: 2,
  },
  themeInfo: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  themeIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
  },
  themeText: {
    flex: 1,
  },
  themeName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 4,
  },
  themeDescription: {
    fontSize: 14,
    color: "#666",
  },
  previewCard: {
    backgroundColor: "#f8f9fa",
    padding: 20,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  previewTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 8,
  },
  previewText: {
    fontSize: 14,
    color: "#666",
    lineHeight: 20,
  },
});
