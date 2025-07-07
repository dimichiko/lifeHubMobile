import React, { createContext, useContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import type { Habit, HabitProgress, Carpeta } from "../types/habit";

interface HabitsContextProps {
  habits: Habit[];
  progress: HabitProgress;
  setCheck: (habitId: string, dayIdx: number) => void;
  addHabit: (habit: Habit) => void;
  editHabit: (habit: Habit) => void;
  removeHabit: (habitId: string) => void;
  dreamLogs: { [habitId: string]: { [dayIdx: number]: string } };
  saveDream: (habitId: string, dayIdx: number, text: string) => void;
  carpetas: Carpeta[];
  addCarpeta: (carpeta: Carpeta) => void;
}

const HabitsContext = createContext<HabitsContextProps | undefined>(undefined);

export const HabitsProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [habits, setHabits] = useState<Habit[]>([
    { id: "1", name: "Agua", emoji: "💧", goal: 3, type: "habit" },
    { id: "2", name: "Dormir", emoji: "😴", goal: 3, type: "dream" },
  ]);
  const [progress, setProgress] = useState<HabitProgress>({});
  const [dreamLogs, setDreamLogs] = useState<{
    [habitId: string]: { [dayIdx: number]: string };
  }>({});
  const [carpetas, setCarpetas] = useState<Carpeta[]>([
    { id: "todos", nombre: "Todos", color: "#6366F1" },
  ]);

  useEffect(() => {
    (async () => {
      const data = await AsyncStorage.getItem("progress");
      if (data) setProgress(JSON.parse(data));
      const dreams = await AsyncStorage.getItem("dreamLogs");
      if (dreams) setDreamLogs(JSON.parse(dreams));
      const carpetasData = await AsyncStorage.getItem("carpetas");
      if (carpetasData) setCarpetas(JSON.parse(carpetasData));
    })();
  }, []);

  useEffect(() => {
    AsyncStorage.setItem("progress", JSON.stringify(progress));
  }, [progress]);

  useEffect(() => {
    AsyncStorage.setItem("dreamLogs", JSON.stringify(dreamLogs));
  }, [dreamLogs]);

  useEffect(() => {
    AsyncStorage.setItem("carpetas", JSON.stringify(carpetas));
  }, [carpetas]);

  const setCheck = (habitId: string, dayIdx: number) => {
    setProgress((prev: HabitProgress) => {
      const week = prev[habitId] || Array(7).fill(0);
      week[dayIdx] = (week[dayIdx] + 1) % 4;
      return { ...prev, [habitId]: week };
    });
  };

  const addHabit = (habit: Habit) => {
    setHabits((prev: Habit[]) => [...prev, habit]);
  };

  const editHabit = (habit: Habit) => {
    setHabits((prev: Habit[]) =>
      prev.map((h) => (h.id === habit.id ? habit : h)),
    );
  };

  const removeHabit = (habitId: string) => {
    setHabits((prev: Habit[]) => prev.filter((h) => h.id !== habitId));
  };

  const saveDream = (habitId: string, dayIdx: number, text: string) => {
    setDreamLogs((prev) => ({
      ...prev,
      [habitId]: { ...(prev[habitId] || {}), [dayIdx]: text },
    }));
  };

  const addCarpeta = (carpeta: Carpeta) => {
    setCarpetas((prev) => [...prev, carpeta]);
  };

  return (
    <HabitsContext.Provider
      value={{
        habits,
        progress,
        setCheck,
        addHabit,
        editHabit,
        removeHabit,
        dreamLogs,
        saveDream,
        carpetas,
        addCarpeta,
      }}
    >
      {children}
    </HabitsContext.Provider>
  );
};

export const useHabits = () => {
  const ctx = useContext(HabitsContext);
  if (!ctx) throw new Error("useHabits debe usarse dentro de HabitsProvider");
  return ctx;
};
