import axios from "axios";
import * as SecureStore from "expo-secure-store";
import Constants from "expo-constants";

// Get API URL from Expo config or environment
const getApiUrl = () => {
  // Forzar IP local para emulador iOS/Mac
  return "http://192.168.0.14:3000"; // Cambia esta IP si tu red es diferente
};

// Create axios instance
export const api = axios.create({
  baseURL: getApiUrl(),
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  async (config) => {
    try {
      const token = await SecureStore.getItemAsync("token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      console.error("Error getting token:", error);
    }
    return config;
  },
  (error) => {
    return Promise.reject(new Error(error.message || "Request failed"));
  },
);

// Response interceptor to handle auth errors
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid, clear storage
      await SecureStore.deleteItemAsync("token");
      await SecureStore.deleteItemAsync("user");
    }
    return Promise.reject(new Error(error.message || "Response failed"));
  },
);

// Auth functions
export const login = async (credentials: {
  email: string;
  password: string;
}) => {
  const response = await api.post("/auth/login", credentials);
  return response.data;
};

export const register = async (userData: {
  email: string;
  password: string;
  name: string;
}) => {
  const response = await api.post("/auth/register", userData);
  return response.data;
};

// Habits functions
export const getHabits = async () => {
  const response = await api.get("/habits");
  return response.data;
};

export const createHabit = async (habitData: {
  name: string;
  frequency: string;
  reminderTime?: string;
  goal?: number;
}) => {
  const response = await api.post("/habits", habitData);
  return response.data;
};

export const updateHabit = async (
  id: string,
  habitData: {
    name?: string;
    frequency?: string;
    reminderTime?: string;
    goal?: number;
  },
) => {
  const response = await api.patch(`/habits/${id}`, habitData);
  return response.data;
};

export const deleteHabit = async (id: string) => {
  const response = await api.delete(`/habits/${id}`);
  return response.data;
};

export const createHabitLog = async (logData: {
  habitId: string;
  date?: string;
  note?: string;
  mood?: string;
  energyLevel?: number;
}) => {
  const response = await api.post("/habits/habit-logs", logData);
  return response.data;
};
