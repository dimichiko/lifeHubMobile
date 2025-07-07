import React, { createContext, useContext, useState, useEffect } from "react";
import * as SecureStore from "expo-secure-store";
import {
  useMutation,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import axios from "axios";

const AuthContext = createContext(null);
const TOKEN_KEY = "accessToken";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    SecureStore.getItemAsync(TOKEN_KEY).then(setToken);
  }, []);

  const loginMutation = useMutation({
    mutationFn: async ({
      email,
      password,
    }: {
      email: string;
      password: string;
    }) => {
      const { data } = await axios.post("http://localhost:3000/auth/login", {
        email,
        password,
      });
      await SecureStore.setItemAsync(TOKEN_KEY, data.access_token);
      setToken(data.access_token);
      return data;
    },
  });

  const registerMutation = useMutation({
    mutationFn: async ({
      email,
      password,
    }: {
      email: string;
      password: string;
    }) => {
      const { data } = await axios.post("http://localhost:3000/auth/register", {
        email,
        password,
      });
      return data;
    },
  });

  const logout = async () => {
    await SecureStore.deleteItemAsync(TOKEN_KEY);
    setToken(null);
  };

  return (
    <AuthContext.Provider
      value={{ token, setToken, loginMutation, registerMutation, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}

export function useLogin() {
  const { loginMutation } = useAuth();
  return loginMutation;
}

export function useRegister() {
  const { registerMutation } = useAuth();
  return registerMutation;
}
