import React from "react";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { QueryProvider } from "./src/providers/QueryProvider";
import { AuthProvider } from "./src/providers/AuthProvider";
import { NotificationsProvider } from "./src/providers/NotificationsProvider";
import { Navigation } from "./src/navigation";

export default function App() {
  return (
    <SafeAreaProvider>
      <QueryProvider>
        <AuthProvider>
          <NotificationsProvider>
            <Navigation />
            <StatusBar style="auto" />
          </NotificationsProvider>
        </AuthProvider>
      </QueryProvider>
    </SafeAreaProvider>
  );
}
