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

export default function SupportScreen() {
  const email = "soporte@lifehub.com";
  const handleEmail = () =>
    Linking.openURL(`mailto:${email}?subject=Soporte%20LifeHub`);

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Soporte Técnico</Text>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>¿Tienes un problema técnico?</Text>
        <Text style={styles.text}>
          Si tienes problemas con la app, errores inesperados o necesitas ayuda
          técnica, contáctanos y te responderemos lo antes posible.
        </Text>
        <TouchableOpacity style={styles.button} onPress={handleEmail}>
          <Ionicons
            name="headset"
            size={20}
            color="#fff"
            style={{ marginRight: 8 }}
          />
          <Text style={styles.buttonText}>Contactar Soporte</Text>
        </TouchableOpacity>
        <Text style={styles.email}>{email}</Text>
      </View>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>
          Consejos para recibir mejor soporte
        </Text>
        <Text style={styles.tip}>• Describe el problema con detalle</Text>
        <Text style={styles.tip}>
          • Incluye capturas de pantalla si es posible
        </Text>
        <Text style={styles.tip}>
          • Indica tu modelo de dispositivo y versión de la app
        </Text>
        <Text style={styles.tip}>
          • Explica los pasos para reproducir el error
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
    backgroundColor: "#007AFF",
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginTop: 10,
    marginBottom: 10,
    alignSelf: "flex-start",
  },
  buttonText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
  email: { fontSize: 14, color: "#007AFF", marginTop: 5, fontWeight: "500" },
  tip: { fontSize: 14, color: "#666", marginBottom: 6, marginLeft: 8 },
});
