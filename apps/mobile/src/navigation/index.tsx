import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Text } from "react-native";

// Pantallas dummy
function LoginScreen() {
  return <Text>Login</Text>;
}
function RegisterScreen() {
  return <Text>Register</Text>;
}
function HomeScreen() {
  return <Text>Home</Text>;
}
function HabitsScreen() {
  return <Text>Habits</Text>;
}

const AuthStack = createStackNavigator();
const Tab = createBottomTabNavigator();

function AppTabs() {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Habits" component={HabitsScreen} />
    </Tab.Navigator>
  );
}

export default function Navigation({ isLoggedIn }: { isLoggedIn: boolean }) {
  return (
    <NavigationContainer>
      {isLoggedIn ? (
        <AppTabs />
      ) : (
        <AuthStack.Navigator>
          <AuthStack.Screen name="Login" component={LoginScreen} />
          <AuthStack.Screen name="Register" component={RegisterScreen} />
        </AuthStack.Navigator>
      )}
    </NavigationContainer>
  );
}
