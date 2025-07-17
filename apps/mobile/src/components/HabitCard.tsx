import React, { useRef } from "react";
import {
  Animated,
  TouchableWithoutFeedback,
  View,
  Text,
  StyleSheet,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function HabitCard({ habit, onPress }) {
  const scale = useRef(new Animated.Value(1)).current;

  const handlePressIn = () =>
    Animated.timing(scale, {
      toValue: 0.97,
      duration: 100,
      useNativeDriver: true,
    }).start();
  const handlePressOut = () =>
    Animated.timing(scale, {
      toValue: 1,
      duration: 100,
      useNativeDriver: true,
    }).start();

  return (
    <TouchableWithoutFeedback
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      accessibilityRole="button"
      accessibilityLabel={`Hábito: ${habit.name}`}
      hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
    >
      <Animated.View
        style={[
          styles.card,
          { transform: [{ scale }] },
          habit.isDoneToday && styles.cardCompleted,
        ]}
      >
        <View style={styles.header}>
          <Text style={styles.title} numberOfLines={1}>
            {habit.name}
          </Text>
          {habit.isDoneToday && (
            <Ionicons name="checkmark-circle" size={24} color="#10B981" />
          )}
        </View>
        {habit.frequency && (
          <Text style={styles.subtitle} numberOfLines={1}>
            {habit.frequency}
          </Text>
        )}
      </Animated.View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 14,
    marginBottom: 12,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    minHeight: 56,
    minWidth: 44,
    justifyContent: "center",
  },
  cardCompleted: {
    borderColor: "#10B981",
    borderWidth: 1.5,
    backgroundColor: "#ECFDF5",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 6,
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1A1A2E",
    flex: 1,
    marginRight: 8,
  },
  subtitle: {
    fontSize: 14,
    color: "#666",
  },
});
