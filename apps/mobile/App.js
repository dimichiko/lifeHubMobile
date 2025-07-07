import { StatusBar } from "expo-status-bar";
import { StyleSheet, View } from "react-native";
import Navigation from "./src/navigation";
import { AuthProvider, useAuth } from "./src/providers/AuthProvider";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

function Root() {
  const { token } = useAuth();
  return <Navigation isLoggedIn={!!token} />;
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <View style={styles.container}>
          <Root />
          <StatusBar style="auto" />
        </View>
      </AuthProvider>
    </QueryClientProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
});
