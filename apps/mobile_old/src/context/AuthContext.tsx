import React, { createContext, useContext, useEffect, useState } from "react";
import * as SecureStore from "expo-secure-store";
// import { authAPI, setAuthToken } from "../services/api";

const AuthContext = createContext<any>(undefined);

const TOKEN_KEY = "auth_token";
const USER_KEY = "auth_user";

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<any>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Cargar token y usuario al iniciar la app
  useEffect(() => {
    loadStoredAuth();
  }, []);

  // Actualizar token en axios cuando cambie
  useEffect(() => {
    // setAuthToken(token); // This line was commented out in the original file
  }, [token]);

  const loadStoredAuth = async () => {
    try {
      const [storedToken, storedUser] = await Promise.all([
        SecureStore.getItemAsync(TOKEN_KEY),
        SecureStore.getItemAsync(USER_KEY),
      ]);

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

  const storeAuth = async (newToken: string, newUser: any) => {
    try {
      await Promise.all([
        SecureStore.setItemAsync(TOKEN_KEY, newToken),
        SecureStore.setItemAsync(USER_KEY, JSON.stringify(newUser)),
      ]);
    } catch (error) {
      console.error("Error storing auth:", error);
    }
  };

  const clearStoredAuth = async () => {
    try {
      await Promise.all([
        SecureStore.deleteItemAsync(TOKEN_KEY),
        SecureStore.deleteItemAsync(USER_KEY),
      ]);
    } catch (error) {
      console.error("Error clearing stored auth:", error);
    }
  };

  const login = async (credentials: any) => {
    try {
      // const response = await authAPI.login(credentials); // This line was commented out in the original file
      // setToken(response.token);
      // setUser(response.user);
      // await storeAuth(response.token, response.user);
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  };

  const register = async (credentials: any) => {
    try {
      // const response = await authAPI.register(credentials); // This line was commented out in the original file
      // setToken(response.token);
      // setUser(response.user);
      // await storeAuth(response.token, response.user);
    } catch (error) {
      console.error("Register error:", error);
      throw error;
    }
  };

  const logout = async () => {
    setToken(null);
    setUser(null);
    await clearStoredAuth();
  };

  const value: any = {
    user,
    token,
    isLoading,
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): any => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
