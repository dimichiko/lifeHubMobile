import React, { createContext, useContext, useEffect, useState } from "react";
import * as SecureStore from "expo-secure-store";
import { useMutation } from "@tanstack/react-query";
import { api, login as apiLogin, register as apiRegister } from "../utils/api";
import { useQueryClient } from "@tanstack/react-query";

interface User {
  id: string;
  email: string;
  name: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const queryClient = useQueryClient();

  // Load stored auth data on app start
  useEffect(() => {
    const loadStoredAuth = async () => {
      try {
        const storedToken = await SecureStore.getItemAsync("token");
        const storedUser = await SecureStore.getItemAsync("user");

        if (storedToken && storedUser) {
          setToken(storedToken);
          setUser(JSON.parse(storedUser));
        }
      } catch (error) {
        console.error("Error loading stored auth:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadStoredAuth();
  }, []);

  // Login mutation
  const loginMutation = useMutation({
    mutationFn: async ({
      email,
      password,
    }: {
      email: string;
      password: string;
    }) => {
      return await apiLogin({ email, password });
    },
    onSuccess: async (data) => {
      console.log("Login exitoso, datos recibidos:", data);
      const { user: userData, token: tokenData } = data;
      setUser(userData);
      setToken(tokenData);
      await SecureStore.setItemAsync("token", tokenData);
      await SecureStore.setItemAsync("user", JSON.stringify(userData));
      queryClient.setQueryData(["me"], userData);
    },
    onError: (error: any) => {
      console.error("Error en login mutation:", error);
      console.error("Error response:", error?.response?.data);
      throw error;
    },
  });

  // Register mutation
  const registerMutation = useMutation({
    mutationFn: async ({
      name,
      email,
      password,
    }: {
      name: string;
      email: string;
      password: string;
    }) => {
      return await apiRegister({ name, email, password });
    },
    onSuccess: async (data) => {
      const { user: userData, token } = data;
      setUser(userData);
      setToken(token);
      await SecureStore.setItemAsync("token", token);
      await SecureStore.setItemAsync("user", JSON.stringify(userData));
      queryClient.setQueryData(["me"], userData);
    },
    onError: (err: any) => {
      console.log("ERROR REGISTRO BACKEND RAW:", err?.response);
      alert(JSON.stringify(err?.response));
    },
  });

  const login = async (email: string, password: string) => {
    await loginMutation.mutateAsync({ email, password });
  };

  const register = async (name: string, email: string, password: string) => {
    await registerMutation.mutateAsync({ name, email, password });
  };

  const logout = async () => {
    setUser(null);
    setToken(null);
    await SecureStore.deleteItemAsync("token");
    await SecureStore.deleteItemAsync("user");
  };

  const value: AuthContextType = {
    user,
    token,
    login,
    register,
    logout,
    isLoading:
      isLoading || loginMutation.isPending || registerMutation.isPending,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
