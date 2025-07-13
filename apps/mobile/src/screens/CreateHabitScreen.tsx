import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigation } from "@react-navigation/native";
import { createHabit } from "../utils/api";
import { scheduleNotification } from "../providers/NotificationsProvider";

export default function CreateHabitScreen() {
  const navigation = useNavigation();
  const queryClient = useQueryClient();

  // Estados simples
  const [name, setName] = useState("");
  const [frequency, setFrequency] = useState("daily");
  const [goal, setGoal] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const createHabitMutation = useMutation({
    mutationFn: createHabit,
    onSuccess: () => {
      Alert.alert("Éxito", "Hábito creado correctamente");
      queryClient.invalidateQueries({ queryKey: ["habits"] });
      navigation.goBack();
    },
    onError: (error: any) => {
      Alert.alert("Error", error.message || "Error al crear el hábito");
    },
  });

  const handleSubmit = async () => {
    if (!name.trim()) {
      Alert.alert("Error", "El nombre del hábito es obligatorio");
      return;
    }

    setIsSubmitting(true);
    try {
      // Crear el hábito
      await createHabitMutation.mutateAsync({
        name: name.trim(),
        frequency,
        goal: goal ? parseInt(goal) : undefined,
      });
    } catch (error) {
      // El error ya se maneja en la mutación
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Crear Nuevo Hábito</Text>

      <View style={styles.form}>
        {/* Nombre del hábito */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Nombre del hábito *</Text>
          <TextInput
            style={styles.input}
            placeholder="Ej: Beber agua, Hacer ejercicio..."
            value={name}
            onChangeText={setName}
          />
        </View>

        {/* Frecuencia */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Frecuencia *</Text>
          <View style={styles.frequencyContainer}>
            <TouchableOpacity
              style={[
                styles.frequencyButton,
                frequency === "daily" && styles.frequencyButtonActive,
              ]}
              onPress={() => setFrequency("daily")}
            >
              <Text
                style={[
                  styles.frequencyButtonText,
                  frequency === "daily" && styles.frequencyButtonTextActive,
                ]}
              >
                Diario
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.frequencyButton,
                frequency === "weekly" && styles.frequencyButtonActive,
              ]}
              onPress={() => setFrequency("weekly")}
            >
              <Text
                style={[
                  styles.frequencyButtonText,
                  frequency === "weekly" && styles.frequencyButtonTextActive,
                ]}
              >
                Semanal
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.frequencyButton,
                frequency === "monthly" && styles.frequencyButtonActive,
              ]}
              onPress={() => setFrequency("monthly")}
            >
              <Text
                style={[
                  styles.frequencyButtonText,
                  frequency === "monthly" && styles.frequencyButtonTextActive,
                ]}
              >
                Mensual
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Meta opcional */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Meta (opcional)</Text>
          <TextInput
            style={styles.input}
            placeholder="Ej: 8 vasos de agua"
            value={goal}
            onChangeText={setGoal}
            keyboardType="numeric"
          />
        </View>
        {/* Botón de crear */}
        <TouchableOpacity
          style={[styles.button, isSubmitting && styles.buttonDisabled]}
          onPress={handleSubmit}
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Crear Hábito</Text>
          )}
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 30,
    color: "#333",
  },
  form: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
    color: "#333",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: "#fff",
  },
  frequencyContainer: {
    flexDirection: "row",
    gap: 8,
  },
  frequencyButton: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
    alignItems: "center",
    backgroundColor: "#fff",
  },
  frequencyButtonActive: {
    backgroundColor: "#007AFF",
    borderColor: "#007AFF",
  },
  frequencyButtonText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#666",
  },
  frequencyButtonTextActive: {
    color: "#fff",
  },
  hint: {
    fontSize: 12,
    color: "#666",
    marginTop: 4,
    fontStyle: "italic",
  },
  button: {
    backgroundColor: "#007AFF",
    borderRadius: 8,
    padding: 16,
    alignItems: "center",
    marginTop: 20,
  },
  buttonDisabled: {
    backgroundColor: "#ccc",
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
});
