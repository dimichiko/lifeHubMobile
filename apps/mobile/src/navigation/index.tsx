import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { useAuth } from "../providers/AuthProvider";

// Screens
import LoginScreen from "../screens/LoginScreen";
import RegisterScreen from "../screens/RegisterScreen";
import HomeScreen from "../screens/HomeScreen";
import HabitsScreen from "../screens/HabitsScreen";
import CreateHabitScreen from "../screens/CreateHabitScreen";

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

// Auth Stack (Login/Register)
const AuthStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="Login" component={LoginScreen} />
    <Stack.Screen name="Register" component={RegisterScreen} />
  </Stack.Navigator>
);

// App Tabs (Home/Habits)
const AppTabs = () => (
  <Tab.Navigator>
    <Tab.Screen name="Home" component={HomeScreen} />
    <Tab.Screen name="Habits" component={HabitsScreen} />
  </Tab.Navigator>
);

// Main App Stack (Tabs + CreateHabit)
const AppStack = () => (
  <Stack.Navigator>
    <Stack.Screen
      name="MainTabs"
      component={AppTabs}
      options={{ headerShown: false }}
    />
    <Stack.Screen
      name="CreateHabit"
      component={CreateHabitScreen}
      options={{
        title: "Crear Hábito",
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
