import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useAuth } from "../providers/AuthProvider";

export default function HomeScreen() {
  const { user, logout } = useAuth();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>¡Bienvenido a LifeHub!</Text>
      <Text style={styles.subtitle}>Hola, {user?.name}</Text>

      <View style={styles.content}>
        <Text style={styles.description}>
          Tu app para gestionar hábitos y mejorar tu vida diaria.
        </Text>

        <Text style={styles.feature}>✨ Crea y rastrea tus hábitos</Text>
        <Text style={styles.feature}>📊 Visualiza tu progreso</Text>
        <Text style={styles.feature}>🎯 Alcanza tus metas</Text>
      </View>

      <TouchableOpacity style={styles.logoutButton} onPress={logout}>
        <Text style={styles.logoutText}>Cerrar sesión</Text>
      </TouchableOpacity>
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
    textAlign: "center",
    marginTop: 60,
    marginBottom: 10,
    color: "#333",
  },
  subtitle: {
    fontSize: 18,
    textAlign: "center",
    marginBottom: 40,
    color: "#666",
  },
  content: {
    flex: 1,
    justifyContent: "center",
  },
  description: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 30,
    color: "#555",
    lineHeight: 24,
  },
  feature: {
    fontSize: 16,
    marginBottom: 15,
    color: "#333",
    textAlign: "center",
  },
  logoutButton: {
    backgroundColor: "#FF3B30",
    padding: 15,
    borderRadius: 8,
    marginBottom: 20,
  },
  logoutText: {
    color: "#fff",
    textAlign: "center",
    fontSize: 16,
    fontWeight: "600",
  },
});
