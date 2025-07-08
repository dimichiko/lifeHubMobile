import React from "react";
import { StatusBar } from "expo-status-bar";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "./src/providers/AuthProvider";
import { NotificationsProvider } from "./src/providers/NotificationsProvider";
import { Navigation } from "./src/navigation";

const queryClient = new QueryClient();

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <NotificationsProvider>
          <Navigation />
          <StatusBar style="auto" />
        </NotificationsProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}
