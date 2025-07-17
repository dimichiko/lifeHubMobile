import React, { useRef, useEffect } from "react";
import {
  View,
  TouchableOpacity,
  Text,
  Animated,
  StyleSheet,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";

const TABS = [
  { name: "Inicio", icon: "home-outline", active: "home" },
  { name: "Hábitos", icon: "list-outline", active: "list" },
  { name: "Dashboard", icon: "bar-chart-outline", active: "bar-chart" },
  { name: "Perfil", icon: "person-outline", active: "person" },
];

export default function BottomNav() {
  const navigation = useNavigation();
  const route = useRoute();

  return (
    <View style={styles.container}>
      {TABS.map((tab) => {
        const isActive = route.name === tab.name;
        return (
          <TabItem
            key={tab.name}
            tab={tab}
            isActive={isActive}
            onPress={() => navigation.navigate(tab.name)}
          />
        );
      })}
    </View>
  );
}

function TabItem({ tab, isActive, onPress }) {
  const scale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.spring(scale, {
      toValue: isActive ? 1.2 : 1,
      friction: 6,
      tension: 120,
      useNativeDriver: true,
    }).start();
  }, [isActive]);

  return (
    <TouchableOpacity
      style={styles.tab}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={tab.name}
      hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
      activeOpacity={0.7}
    >
      <Animated.View style={{ alignItems: "center", transform: [{ scale }] }}>
        <Ionicons
          name={isActive ? tab.active : tab.icon}
          size={28}
          color={isActive ? "#407BFF" : "#666"}
        />
        <Text style={[styles.label, isActive && styles.labelActive]}>
          {tab.name}
        </Text>
      </Animated.View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    height: 60,
    backgroundColor: "#fff",
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  tab: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    minWidth: 44,
    minHeight: 44,
  },
  label: {
    fontSize: 12,
    color: "#666",
    marginTop: 4,
  },
  labelActive: {
    color: "#407BFF",
    fontWeight: "600",
  },
}); 