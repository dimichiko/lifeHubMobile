import React, { lazy, Suspense } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { useAuth } from "../providers/AuthProvider";
import { View, Text, ActivityIndicator } from "react-native";
import { Ionicons } from "@expo/vector-icons";

// Lazy loaded screens
const LoginScreen = lazy(() => import("../screens/LoginScreen"));
const RegisterScreen = lazy(() => import("../screens/RegisterScreen"));
const HomeScreen = lazy(() => import("../screens/HomeScreen"));
const HabitsScreen = lazy(() => import("../screens/HabitsScreen"));
const CreateHabitScreen = lazy(() => import("../screens/CreateHabitScreen"));
const EditHabitScreen = lazy(() => import("../screens/EditHabitScreen"));
const DashboardScreen = lazy(() => import("../screens/DashboardScreen"));
const ProfileScreen = lazy(() => import("../screens/ProfileScreen"));
const NotificationsSettingsScreen = lazy(
  () => import("../screens/NotificationsSettingsScreen"),
);
const ThemeSettingsScreen = lazy(
  () => import("../screens/ThemeSettingsScreen"),
);
const HelpScreen = lazy(() => import("../screens/HelpScreen"));
const HowToCreateHabitScreen = lazy(
  () => import("../screens/help/HowToCreateHabitScreen"),
);
const PointsSystemScreen = lazy(
  () => import("../screens/help/PointsSystemScreen"),
);
const AchievementsScreen = lazy(
  () => import("../screens/help/AchievementsScreen"),
);
const StreaksScreen = lazy(() => import("../screens/help/StreaksScreen"));
const ContactScreen = lazy(() => import("../screens/help/ContactScreen"));
const SupportScreen = lazy(() => import("../screens/help/SupportScreen"));
const SuggestionsScreen = lazy(
  () => import("../screens/help/SuggestionsScreen"),
);
const BugReportScreen = lazy(() => import("../screens/help/BugReportScreen"));

// Loading component for lazy screens
const ScreenLoader = () => (
  <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
    <ActivityIndicator size="large" color="#007AFF" />
    <Text style={{ marginTop: 10, color: "#666" }}>Cargando...</Text>
  </View>
);

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

// Wrappers para cada screen con Suspense
const LoginScreenWrapper = (props) => (
  <Suspense fallback={<ScreenLoader />}>
    <LoginScreen {...props} />
  </Suspense>
);
const RegisterScreenWrapper = (props) => (
  <Suspense fallback={<ScreenLoader />}>
    <RegisterScreen {...props} />
  </Suspense>
);
const HomeScreenWrapper = (props) => (
  <Suspense fallback={<ScreenLoader />}>
    <HomeScreen {...props} />
  </Suspense>
);
const HabitsScreenWrapper = (props) => (
  <Suspense fallback={<ScreenLoader />}>
    <HabitsScreen {...props} />
  </Suspense>
);
const DashboardScreenWrapper = (props) => (
  <Suspense fallback={<ScreenLoader />}>
    <DashboardScreen {...props} />
  </Suspense>
);
const ProfileScreenWrapper = (props) => (
  <Suspense fallback={<ScreenLoader />}>
    <ProfileScreen {...props} />
  </Suspense>
);
const CreateHabitScreenWrapper = (props) => (
  <Suspense fallback={<ScreenLoader />}>
    <CreateHabitScreen {...props} />
  </Suspense>
);
const EditHabitScreenWrapper = (props) => (
  <Suspense fallback={<ScreenLoader />}>
    <EditHabitScreen {...props} />
  </Suspense>
);
const NotificationsSettingsScreenWrapper = (props) => (
  <Suspense fallback={<ScreenLoader />}>
    <NotificationsSettingsScreen {...props} />
  </Suspense>
);
const ThemeSettingsScreenWrapper = (props) => (
  <Suspense fallback={<ScreenLoader />}>
    <ThemeSettingsScreen {...props} />
  </Suspense>
);
const HelpScreenWrapper = (props) => (
  <Suspense fallback={<ScreenLoader />}>
    <HelpScreen {...props} />
  </Suspense>
);
const HowToCreateHabitScreenWrapper = (props) => (
  <Suspense fallback={<ScreenLoader />}>
    <HowToCreateHabitScreen {...props} />
  </Suspense>
);
const PointsSystemScreenWrapper = (props) => (
  <Suspense fallback={<ScreenLoader />}>
    <PointsSystemScreen {...props} />
  </Suspense>
);
const AchievementsScreenWrapper = (props) => (
  <Suspense fallback={<ScreenLoader />}>
    <AchievementsScreen {...props} />
  </Suspense>
);
const StreaksScreenWrapper = (props) => (
  <Suspense fallback={<ScreenLoader />}>
    <StreaksScreen {...props} />
  </Suspense>
);
const ContactScreenWrapper = (props) => (
  <Suspense fallback={<ScreenLoader />}>
    <ContactScreen {...props} />
  </Suspense>
);
const SupportScreenWrapper = (props) => (
  <Suspense fallback={<ScreenLoader />}>
    <SupportScreen {...props} />
  </Suspense>
);
const SuggestionsScreenWrapper = (props) => (
  <Suspense fallback={<ScreenLoader />}>
    <SuggestionsScreen {...props} />
  </Suspense>
);
const BugReportScreenWrapper = (props) => (
  <Suspense fallback={<ScreenLoader />}>
    <BugReportScreen {...props} />
  </Suspense>
);

// Auth Stack (Login/Register)
const AuthStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }} {...({} as any)}>
    <Stack.Screen name="Login" component={LoginScreenWrapper} />
    <Stack.Screen name="Register" component={RegisterScreenWrapper} />
  </Stack.Navigator>
);

// App Tabs (Home/Habits/Dashboard/Profile)
const AppTabs = () => (
  <Tab.Navigator
    screenOptions={({ route }) => ({
      tabBarIcon: ({ focused, color, size }) => {
        let iconName: keyof typeof Ionicons.glyphMap;

        if (route.name === 'Home') {
          iconName = focused ? 'home' : 'home-outline';
        } else if (route.name === 'Habits') {
          iconName = focused ? 'list' : 'list-outline';
        } else if (route.name === 'Dashboard') {
          iconName = focused ? 'stats-chart' : 'stats-chart-outline';
        } else if (route.name === 'Profile') {
          iconName = focused ? 'person' : 'person-outline';
        } else {
          iconName = 'help-outline';
        }

        return (
          <Ionicons 
            name={iconName} 
            size={focused ? size * 1.2 : size} 
            color={focused ? '#407BFF' : color} 
          />
        );
      },
      tabBarActiveTintColor: '#407BFF',
      tabBarInactiveTintColor: '#8E8E93',
      tabBarStyle: {
        backgroundColor: 'white',
        borderTopWidth: 1,
        borderTopColor: '#E5E5EA',
        paddingBottom: 8,
        paddingTop: 8,
        height: 88,
        shadowColor: '#000',
        shadowOffset: {
          width: 0,
          height: -2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 8,
      },
      tabBarLabelStyle: {
        fontSize: 12,
        fontWeight: '600',
        marginTop: 4,
      },
      headerShown: false,
    })}
  >
    <Tab.Screen 
      name="Home" 
      component={HomeScreenWrapper}
      options={{
        tabBarLabel: 'Inicio',
      }}
    />
    <Tab.Screen 
      name="Habits" 
      component={HabitsScreenWrapper}
      options={{
        tabBarLabel: 'Hábitos',
      }}
    />
    <Tab.Screen 
      name="Dashboard" 
      component={DashboardScreenWrapper}
      options={{
        tabBarLabel: 'Dashboard',
      }}
    />
    <Tab.Screen 
      name="Profile" 
      component={ProfileScreenWrapper}
      options={{
        tabBarLabel: 'Perfil',
      }}
    />
  </Tab.Navigator>
);

// Main App Stack (Tabs + CreateHabit + EditHabit)
const AppStack = () => (
  <Stack.Navigator {...({} as any)}>
    <Stack.Screen name="MainTabs" component={AppTabs} options={{ headerShown: false }} />
    <Stack.Screen name="CreateHabit" component={CreateHabitScreenWrapper} options={{ title: "Crear Hábito", presentation: "modal", headerShown: true }} />
    <Stack.Screen name="EditHabit" component={EditHabitScreenWrapper} options={{ title: "Editar Hábito", presentation: "modal", headerShown: true }} />
    <Stack.Screen name="NotificationsSettings" component={NotificationsSettingsScreenWrapper} options={{ title: "Notificaciones", headerShown: true }} />
    <Stack.Screen name="ThemeSettings" component={ThemeSettingsScreenWrapper} options={{ title: "Tema", headerShown: true }} />
    <Stack.Screen name="Help" component={HelpScreenWrapper} options={{ title: "Ayuda", headerShown: true }} />
    <Stack.Screen name="HowToCreateHabit" component={HowToCreateHabitScreenWrapper} options={{ title: "¿Cómo crear un hábito?", headerShown: true }} />
    <Stack.Screen name="PointsSystem" component={PointsSystemScreenWrapper} options={{ title: "Sistema de Puntos", headerShown: true }} />
    <Stack.Screen name="Achievements" component={AchievementsScreenWrapper} options={{ title: "Logros y Recompensas", headerShown: true }} />
    <Stack.Screen name="Streaks" component={StreaksScreenWrapper} options={{ title: "Rachas y Streaks", headerShown: true }} />
    <Stack.Screen name="Contact" component={ContactScreenWrapper} options={{ title: "Contacto y Soporte", headerShown: true }} />
    <Stack.Screen name="Support" component={SupportScreenWrapper} options={{ title: "Soporte Técnico", headerShown: true }} />
    <Stack.Screen name="Suggestions" component={SuggestionsScreenWrapper} options={{ title: "Sugerencias", headerShown: true }} />
    <Stack.Screen name="BugReport" component={BugReportScreenWrapper} options={{ title: "Reportar Bug", headerShown: true }} />
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
