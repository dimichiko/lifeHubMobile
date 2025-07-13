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

export default function SuggestionsScreen() {
  const email = "sugerencias@lifehub.com";
  const handleEmail = () =>
    Linking.openURL(`mailto:${email}?subject=Sugerencia%20LifeHub`);

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Sugerencias</Text>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>¿Tienes una idea para mejorar?</Text>
        <Text style={styles.text}>
          Nos encanta escuchar nuevas ideas y sugerencias para mejorar LifeHub.
          ¡Tu opinión es muy importante para nosotros!
        </Text>
        <TouchableOpacity style={styles.button} onPress={handleEmail}>
          <Ionicons
            name="bulb"
            size={20}
            color="#fff"
            style={{ marginRight: 8 }}
          />
          <Text style={styles.buttonText}>Enviar Sugerencia</Text>
        </TouchableOpacity>
        <Text style={styles.email}>{email}</Text>
      </View>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>
          ¿Qué tipo de sugerencias puedes enviar?
        </Text>
        <Text style={styles.tip}>• Nuevas funciones o mejoras</Text>
        <Text style={styles.tip}>
          • Cambios en la interfaz o experiencia de usuario
        </Text>
        <Text style={styles.tip}>• Integraciones con otras apps</Text>
        <Text style={styles.tip}>
          • Cualquier idea que ayude a la comunidad
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
    backgroundColor: "#9C27B0",
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginTop: 10,
    marginBottom: 10,
    alignSelf: "flex-start",
  },
  buttonText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
  email: { fontSize: 14, color: "#9C27B0", marginTop: 5, fontWeight: "500" },
  tip: { fontSize: 14, color: "#666", marginBottom: 6, marginLeft: 8 },
});
