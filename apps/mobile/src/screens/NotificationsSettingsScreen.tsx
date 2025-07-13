import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function NotificationsSettingsScreen() {
  const [remindersEnabled, setRemindersEnabled] = useState(true);
  const [completionEnabled, setCompletionEnabled] = useState(true);
  const [streakEnabled, setStreakEnabled] = useState(true);
  const [achievementsEnabled, setAchievementsEnabled] = useState(true);

  const handleSaveSettings = () => {
    Alert.alert(
      "Configuración guardada",
      "Tus preferencias de notificaciones han sido actualizadas",
    );
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Configuración de Notificaciones</Text>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Tipos de Notificaciones</Text>

        <View style={styles.settingItem}>
          <View style={styles.settingInfo}>
            <Ionicons name="time" size={24} color="#007AFF" />
            <View style={styles.settingText}>
              <Text style={styles.settingLabel}>Recordatorios diarios</Text>
              <Text style={styles.settingDescription}>
                Recibe recordatorios para completar tus hábitos
              </Text>
            </View>
          </View>
          <Switch
            value={remindersEnabled}
            onValueChange={setRemindersEnabled}
            trackColor={{ false: "#767577", true: "#81b0ff" }}
            thumbColor={remindersEnabled ? "#007AFF" : "#f4f3f4"}
          />
        </View>

        <View style={styles.settingItem}>
          <View style={styles.settingInfo}>
            <Ionicons name="checkmark-circle" size={24} color="#4CAF50" />
            <View style={styles.settingText}>
              <Text style={styles.settingLabel}>Completado de hábitos</Text>
              <Text style={styles.settingDescription}>
                Notificaciones cuando completes un hábito
              </Text>
            </View>
          </View>
          <Switch
            value={completionEnabled}
            onValueChange={setCompletionEnabled}
            trackColor={{ false: "#767577", true: "#81b0ff" }}
            thumbColor={completionEnabled ? "#007AFF" : "#f4f3f4"}
          />
        </View>

        <View style={styles.settingItem}>
          <View style={styles.settingInfo}>
            <Ionicons name="flame" size={24} color="#FF6B35" />
            <View style={styles.settingText}>
              <Text style={styles.settingLabel}>Rachas y streaks</Text>
              <Text style={styles.settingDescription}>
                Celebra tus rachas consecutivas
              </Text>
            </View>
          </View>
          <Switch
            value={streakEnabled}
            onValueChange={setStreakEnabled}
            trackColor={{ false: "#767577", true: "#81b0ff" }}
            thumbColor={streakEnabled ? "#007AFF" : "#f4f3f4"}
          />
        </View>

        <View style={styles.settingItem}>
          <View style={styles.settingInfo}>
            <Ionicons name="trophy" size={24} color="#FFD700" />
            <View style={styles.settingText}>
              <Text style={styles.settingLabel}>Logros desbloqueados</Text>
              <Text style={styles.settingDescription}>
                Notificaciones cuando desbloquees logros
              </Text>
            </View>
          </View>
          <Switch
            value={achievementsEnabled}
            onValueChange={setAchievementsEnabled}
            trackColor={{ false: "#767577", true: "#81b0ff" }}
            thumbColor={achievementsEnabled ? "#007AFF" : "#f4f3f4"}
          />
        </View>
      </View>

      <TouchableOpacity style={styles.saveButton} onPress={handleSaveSettings}>
        <Text style={styles.saveButtonText}>Guardar Configuración</Text>
      </TouchableOpacity>
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
  settingItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  settingInfo: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  settingText: {
    marginLeft: 15,
    flex: 1,
  },
  settingLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 4,
  },
  settingDescription: {
    fontSize: 14,
    color: "#666",
  },
  saveButton: {
    backgroundColor: "#007AFF",
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    marginTop: 20,
  },
  saveButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
});
