import React from "react";
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
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigation } from "@react-navigation/native";
import { Picker } from "@react-native-picker/picker";
import { createHabit } from "../utils/api";

const createHabitSchema = z.object({
  name: z.string().min(2, "El nombre debe tener al menos 2 caracteres"),
  frequency: z.enum(["daily", "weekly", "monthly"]),
  reminderTime: z.string().optional(),
  goal: z.number().min(1).max(100).optional(),
});

type CreateHabitForm = z.infer<typeof createHabitSchema>;

export default function CreateHabitScreen() {
  const navigation = useNavigation();
  const queryClient = useQueryClient();

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<CreateHabitForm>({
    resolver: zodResolver(createHabitSchema),
    defaultValues: {
      name: "",
      frequency: "daily",
      reminderTime: "",
      goal: undefined,
    },
  });

  const createHabitMutation = useMutation({
    mutationFn: createHabit,
    onSuccess: () => {
      Alert.alert("Éxito", "Hábito creado correctamente");
      queryClient.invalidateQueries({ queryKey: ["habits"] });
      reset();
      navigation.goBack();
    },
    onError: (error: any) => {
      Alert.alert("Error", error.message || "Error al crear el hábito");
    },
  });

  const onSubmit = (data: CreateHabitForm) => {
    createHabitMutation.mutate({
      ...data,
      goal: data.goal || undefined,
    });
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Crear Nuevo Hábito</Text>

      <View style={styles.form}>
        {/* Nombre del hábito */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Nombre del hábito *</Text>
          <Controller
            control={control}
            name="name"
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                style={[styles.input, errors.name && styles.inputError]}
                placeholder="Ej: Beber agua, Hacer ejercicio..."
                onChangeText={onChange}
                onBlur={onBlur}
                value={value}
              />
            )}
          />
          {errors.name && (
            <Text style={styles.errorText}>{errors.name.message}</Text>
          )}
        </View>

        {/* Frecuencia */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Frecuencia *</Text>
          <Controller
            control={control}
            name="frequency"
            render={({ field: { onChange, value } }) => (
              <View style={styles.pickerContainer}>
                <Picker
                  selectedValue={value}
                  onValueChange={onChange}
                  style={styles.picker}
                >
                  <Picker.Item label="Diario" value="daily" />
                  <Picker.Item label="Semanal" value="weekly" />
                  <Picker.Item label="Mensual" value="monthly" />
                </Picker>
              </View>
            )}
          />
        </View>

        {/* Meta opcional */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Meta (opcional)</Text>
          <Controller
            control={control}
            name="goal"
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                style={styles.input}
                placeholder="Ej: 8 vasos de agua"
                onChangeText={(text) =>
                  onChange(text ? parseInt(text) : undefined)
                }
                onBlur={onBlur}
                value={value?.toString() || ""}
                keyboardType="numeric"
              />
            )}
          />
        </View>

        {/* Hora de recordatorio opcional */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Hora de recordatorio (opcional)</Text>
          <Controller
            control={control}
            name="reminderTime"
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                style={styles.input}
                placeholder="Ej: 08:00"
                onChangeText={onChange}
                onBlur={onBlur}
                value={value}
              />
            )}
          />
        </View>

        {/* Botón de crear */}
        <TouchableOpacity
          style={[styles.button, isSubmitting && styles.buttonDisabled]}
          onPress={handleSubmit(onSubmit)}
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
  inputError: {
    borderColor: "#ff6b6b",
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    backgroundColor: "#fff",
  },
  picker: {
    height: 50,
  },
  errorText: {
    color: "#ff6b6b",
    fontSize: 14,
    marginTop: 4,
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
