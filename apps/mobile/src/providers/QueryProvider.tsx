import React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// Configuración optimizada de React Query
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Cache por 5 minutos
      staleTime: 5 * 60 * 1000,
      // Cache por 10 minutos
      gcTime: 10 * 60 * 1000,
      // Refetch solo cuando la ventana vuelve a estar activa
      refetchOnWindowFocus: false,
      // Refetch al montar solo si los datos están stale
      refetchOnMount: true,
      // Reintentos en caso de error
      retry: 2,
      // Tiempo entre reintentos
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    },
    mutations: {
      // Reintentos para mutaciones
      retry: 1,
      // Tiempo entre reintentos
      retryDelay: 1000,
    },
  },
});

interface QueryProviderProps {
  children: React.ReactNode;
}

export const QueryProvider: React.FC<QueryProviderProps> = ({ children }) => {
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};
