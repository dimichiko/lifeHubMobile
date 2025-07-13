import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
} from "react-native";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigation, useRoute } from "@react-navigation/native";
import { Picker } from "@react-native-picker/picker";
import { api } from "../utils/api";

const editHabitSchema = z.object({
  name: z.string().min(1, "El nombre es requerido"),
  frequency: z.string().min(1, "La frecuencia es requerida"),
  reminderAt: z.string().optional(),
  goal: z.number().optional(),
  isRecurring: z.boolean().default(false),
  daysOfWeek: z.array(z.string()).default([]),
});

type EditHabitForm = z.infer<typeof editHabitSchema>;

const DAYS_OF_WEEK = [
  { value: "monday", label: "Lunes" },
  { value: "tuesday", label: "Martes" },
  { value: "wednesday", label: "Miércoles" },
  { value: "thursday", label: "Jueves" },
  { value: "friday", label: "Viernes" },
  { value: "saturday", label: "Sábado" },
  { value: "sunday", label: "Domingo" },
];

export default function EditHabitScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const queryClient = useQueryClient();
  const habit = route.params?.habit;

  const {
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<EditHabitForm>({
    resolver: zodResolver(editHabitSchema),
    defaultValues: {
      name: habit?.name || "",
      frequency: habit?.frequency || "daily",
      reminderAt: habit?.reminderAt || "",
      goal: habit?.goal || undefined,
      isRecurring: habit?.isRecurring || false,
      daysOfWeek: habit?.daysOfWeek || [],
    },
  });

  const isRecurring = watch("isRecurring");
  const selectedDays = watch("daysOfWeek");

  const updateHabitMutation = useMutation({
    mutationFn: async (data: EditHabitForm) => {
      const response = await api.patch(`/habits/${habit.id}`, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["habits"] });
      Alert.alert("Éxito", "Hábito actualizado correctamente");
      navigation.goBack();
    },
    onError: (error: any) => {
      console.log("ERROR ACTUALIZAR HÁBITO:", error);
      Alert.alert("Error", JSON.stringify(error));
    },
  });

  const onSubmit = (data: EditHabitForm) => {
    updateHabitMutation.mutate(data);
  };

  const toggleDay = (day: string) => {
    const newDays = selectedDays.includes(day)
      ? selectedDays.filter((d) => d !== day)
      : [...selectedDays, day];
    setValue("daysOfWeek", newDays);
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Editar Hábito</Text>

      <Controller
        control={control}
        name="name"
        render={({ field: { onChange, value } }) => (
          <TextInput
            style={styles.input}
            placeholder="Nombre del hábito"
            value={value}
            onChangeText={onChange}
          />
        )}
      />
      {errors.name && <Text style={styles.error}>{errors.name.message}</Text>}

      <Controller
        control={control}
        name="frequency"
        render={({ field: { onChange, value } }) => (
          <View style={styles.pickerContainer}>
            <Picker selectedValue={value} onValueChange={onChange}>
              <Picker.Item label="Diario" value="daily" />
              <Picker.Item label="Semanal" value="weekly" />
              <Picker.Item label="Mensual" value="monthly" />
            </Picker>
          </View>
        )}
      />

      <Controller
        control={control}
        name="reminderAt"
        render={({ field: { onChange, value } }) => (
          <TextInput
            style={styles.input}
            placeholder="Hora de recordatorio (HH:MM)"
            value={value}
            onChangeText={onChange}
          />
        )}
      />

      <Controller
        control={control}
        name="goal"
        render={({ field: { onChange, value } }) => (
          <TextInput
            style={styles.input}
            placeholder="Meta (opcional)"
            value={value?.toString() || ""}
            onChangeText={(text) => onChange(text ? parseInt(text) : undefined)}
            keyboardType="numeric"
          />
        )}
      />

      <Controller
        control={control}
        name="isRecurring"
        render={({ field: { onChange, value } }) => (
          <TouchableOpacity
            style={styles.checkboxContainer}
            onPress={() => onChange(!value)}
          >
            <View style={[styles.checkbox, value && styles.checkboxChecked]}>
              {value && <Text style={styles.checkmark}>✓</Text>}
            </View>
            <Text style={styles.checkboxLabel}>Hábito recurrente</Text>
          </TouchableOpacity>
        )}
      />

      {isRecurring && (
        <View style={styles.daysContainer}>
          <Text style={styles.daysTitle}>Seleccionar días:</Text>
          {DAYS_OF_WEEK.map((day) => (
            <TouchableOpacity
              key={day.value}
              style={[
                styles.dayButton,
                selectedDays.includes(day.value) && styles.dayButtonSelected,
              ]}
              onPress={() => toggleDay(day.value)}
            >
              <Text
                style={[
                  styles.dayButtonText,
                  selectedDays.includes(day.value) && styles.dayButtonTextSelected,
                ]}
              >
                {day.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      <TouchableOpacity
        style={styles.button}
        onPress={handleSubmit(onSubmit)}
        disabled={updateHabitMutation.isPending}
      >
        <Text style={styles.buttonText}>
          {updateHabitMutation.isPending ? "Actualizando..." : "Actualizar Hábito"}
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 15,
    marginBottom: 15,
    fontSize: 16,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    marginBottom: 15,
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 2,
    borderColor: "#007AFF",
    borderRadius: 4,
    marginRight: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  checkboxChecked: {
    backgroundColor: "#007AFF",
  },
  checkmark: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "bold",
  },
  checkboxLabel: {
    fontSize: 16,
  },
  daysContainer: {
    marginBottom: 20,
  },
  daysTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 10,
  },
  dayButton: {
    padding: 10,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    marginBottom: 5,
    alignItems: "center",
  },
  dayButtonSelected: {
    backgroundColor: "#007AFF",
    borderColor: "#007AFF",
  },
  dayButtonText: {
    fontSize: 14,
  },
  dayButtonTextSelected: {
    color: "#fff",
    fontWeight: "600",
  },
  button: {
    backgroundColor: "#007AFF",
    padding: 15,
    borderRadius: 8,
    marginTop: 20,
  },
  buttonText: {
    color: "#fff",
    textAlign: "center",
    fontSize: 16,
    fontWeight: "600",
  },
  error: {
    color: "red",
    marginBottom: 10,
  },
}); 