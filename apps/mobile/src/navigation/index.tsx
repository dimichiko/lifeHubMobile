import React, { lazy, Suspense } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { useAuth } from "../providers/AuthProvider";
import { View, Text, ActivityIndicator } from "react-native";

// Lazy loaded screens
const LoginScreen = lazy(() => import("../screens/LoginScreen"));
const RegisterScreen = lazy(() => import("../screens/RegisterScreen"));
const HomeScreen = lazy(() => import("../screens/HomeScreen"));
const HabitsScreen = lazy(() => import("../screens/HabitsScreen"));
const CreateHabitScreen = lazy(() => import("../screens/CreateHabitScreen"));
const EditHabitScreen = lazy(() => import("../screens/EditHabitScreen"));
const DashboardScreen = lazy(() => import("../screens/DashboardScreen"));
const ProfileScreen = lazy(() => import("../screens/ProfileScreen"));

// Loading component for lazy screens
const ScreenLoader = () => (
  <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
    <ActivityIndicator size="large" color="#007AFF" />
    <Text style={{ marginTop: 10, color: "#666" }}>Cargando...</Text>
  </View>
);

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

// Auth Stack (Login/Register)
const AuthStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }} {...({} as any)}>
    <Stack.Screen
      name="Login"
      component={(props) => (
        <Suspense fallback={<ScreenLoader />}>
          <LoginScreen {...props} />
        </Suspense>
      )}
    />
    <Stack.Screen
      name="Register"
      component={(props) => (
        <Suspense fallback={<ScreenLoader />}>
          <RegisterScreen {...props} />
        </Suspense>
      )}
    />
  </Stack.Navigator>
);

// App Tabs (Home/Habits/Dashboard/Profile)
const AppTabs = () => (
  <Tab.Navigator {...({} as any)}>
    <Tab.Screen
      name="Home"
      component={(props) => (
        <Suspense fallback={<ScreenLoader />}>
          <HomeScreen {...props} />
        </Suspense>
      )}
    />
    <Tab.Screen
      name="Habits"
      component={(props) => (
        <Suspense fallback={<ScreenLoader />}>
          <HabitsScreen {...props} />
        </Suspense>
      )}
    />
    <Tab.Screen
      name="Dashboard"
      component={(props) => (
        <Suspense fallback={<ScreenLoader />}>
          <DashboardScreen {...props} />
        </Suspense>
      )}
    />
    <Tab.Screen
      name="Profile"
      component={(props) => (
        <Suspense fallback={<ScreenLoader />}>
          <ProfileScreen {...props} />
        </Suspense>
      )}
    />
  </Tab.Navigator>
);

// Main App Stack (Tabs + CreateHabit + EditHabit)
const AppStack = () => (
  <Stack.Navigator {...({} as any)}>
    <Stack.Screen
      name="MainTabs"
      component={AppTabs}
      options={{ headerShown: false }}
    />
    <Stack.Screen
      name="CreateHabit"
      component={(props) => (
        <Suspense fallback={<ScreenLoader />}>
          <CreateHabitScreen {...props} />
        </Suspense>
      )}
      options={{
        title: "Crear Hábito",
        presentation: "modal",
        headerShown: true,
      }}
    />
    <Stack.Screen
      name="EditHabit"
      component={(props) => (
        <Suspense fallback={<ScreenLoader />}>
          <EditHabitScreen {...props} />
        </Suspense>
      )}
      options={{
        title: "Editar Hábito",
        presentation: "modal",
        headerShown: true,
      }}
    />
  </Stack.Navigator>
);

// Main Navigation
export const Navigation = () => {
  const { user } = useAuth();

  return (
    <NavigationContainer>
      {user ? <AppStack /> : <AuthStack />}
    </NavigationContainer>
  );
};
