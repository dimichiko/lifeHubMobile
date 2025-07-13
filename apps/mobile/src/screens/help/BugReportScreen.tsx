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

export default function BugReportScreen() {
  const email = "bugs@lifehub.com";
  const handleEmail = () =>
    Linking.openURL(`mailto:${email}?subject=Reporte%20de%20Bug%20LifeHub`);

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Reportar Bug</Text>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>¿Encontraste un error?</Text>
        <Text style={styles.text}>
          Si detectaste un bug o comportamiento inesperado, por favor repórtalo
          para que podamos solucionarlo lo antes posible.
        </Text>
        <TouchableOpacity style={styles.button} onPress={handleEmail}>
          <Ionicons
            name="bug"
            size={20}
            color="#fff"
            style={{ marginRight: 8 }}
          />
          <Text style={styles.buttonText}>Reportar Bug</Text>
        </TouchableOpacity>
        <Text style={styles.email}>{email}</Text>
      </View>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>¿Qué información incluir?</Text>
        <Text style={styles.tip}>• Descripción clara del error</Text>
        <Text style={styles.tip}>• Pasos para reproducirlo</Text>
        <Text style={styles.tip}>• Capturas de pantalla o video</Text>
        <Text style={styles.tip}>
          • Modelo de dispositivo y versión de la app
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f8f9fa", padding: 20 },
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
    marginBottom: 15,
    color: "#333",
  },
  text: { fontSize: 15, color: "#555", marginBottom: 15 },
  button: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F44336",
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginTop: 10,
    marginBottom: 10,
    alignSelf: "flex-start",
  },
  buttonText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
  email: { fontSize: 14, color: "#F44336", marginTop: 5, fontWeight: "500" },
  tip: { fontSize: 14, color: "#666", marginBottom: 6, marginLeft: 8 },
});
