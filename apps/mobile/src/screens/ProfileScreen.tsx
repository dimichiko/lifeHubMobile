import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "../providers/AuthProvider";
import { GamificationService, UserStats, Achievement } from "../utils/gamification";

export default function ProfileScreen() {
  const { user, logout } = useAuth();
  const [userStats, setUserStats] = useState<UserStats>({
    level: 1,
    experience: 0,
    totalPoints: 0,
    achievements: [],
    currentStreak: 7,
    longestStreak: 12,
    totalHabitsCompleted: 45,
  });

  useEffect(() => {
    loadUserStats();
  }, []);

  const loadUserStats = () => {
    // Simular datos del usuario
    const mockStats: UserStats = {
      level: 5,
      experience: 420,
      totalPoints: 1250,
      achievements: [],
      currentStreak: 7,
      longestStreak: 12,
      totalHabitsCompleted: 45,
    };

    const achievements = GamificationService.checkAchievements(mockStats);
    mockStats.achievements = achievements;
    setUserStats(mockStats);
  };

  const handleLogout = () => {
    Alert.alert(
      "Cerrar sesión",
      "¿Estás seguro de que quieres cerrar sesión?",
      [
        { text: "Cancelar", style: "cancel" },
        { text: "Cerrar sesión", style: "destructive", onPress: logout },
      ]
    );
  };

  const getLevelProgress = () => {
    return GamificationService.calculateProgressToNextLevel(userStats.experience);
  };

  const getExperienceToNext = () => {
    return GamificationService.calculateExperienceToNextLevel(userStats.experience);
  };

  const getLevelTitle = () => {
    return GamificationService.getLevelTitle(userStats.level);
  };

  const getLevelColor = () => {
    return GamificationService.getLevelColor(userStats.level);
  };

  const getRewards = () => {
    return GamificationService.getRewardsForLevel(userStats.level);
  };

  return (
    <ScrollView style={styles.container}>
      {/* Header del perfil */}
      <View style={styles.header}>
        <View style={styles.profileInfo}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {user?.name?.charAt(0) || "U"}
            </Text>
          </View>
          <View style={styles.userInfo}>
            <Text style={styles.userName}>{user?.name || "Usuario"}</Text>
            <Text style={styles.userEmail}>{user?.email}</Text>
            <Text style={[styles.levelTitle, { color: getLevelColor() }]}>
              {getLevelTitle()} - Nivel {userStats.level}
            </Text>
          </View>
        </View>
      </View>

      {/* Barra de progreso de nivel */}
      <View style={styles.levelCard}>
        <View style={styles.levelHeader}>
          <Text style={styles.levelLabel}>Progreso al siguiente nivel</Text>
          <Text style={styles.levelProgress}>
            {userStats.experience} / {userStats.experience + getExperienceToNext()} XP
          </Text>
        </View>
        <View style={styles.progressBar}>
          <View
            style={[
              styles.progressFill,
              { width: `${getLevelProgress()}%` },
            ]}
          />
        </View>
        <Text style={styles.nextLevelText}>
          {getExperienceToNext()} XP para el nivel {userStats.level + 1}
        </Text>
      </View>

      {/* Estadísticas principales */}
      <View style={styles.statsCard}>
        <Text style={styles.sectionTitle}>📊 Estadísticas</Text>
        <View style={styles.statsGrid}>
          <View style={styles.statItem}>
            <Ionicons name="trophy" size={24} color="#FFD700" />
            <Text style={styles.statNumber}>{userStats.totalPoints}</Text>
            <Text style={styles.statLabel}>Puntos totales</Text>
          </View>
          <View style={styles.statItem}>
            <Ionicons name="flame" size={24} color="#FF6B35" />
            <Text style={styles.statNumber}>{userStats.currentStreak}</Text>
            <Text style={styles.statLabel}>Racha actual</Text>
          </View>
          <View style={styles.statItem}>
            <Ionicons name="checkmark-circle" size={24} color="#4CAF50" />
            <Text style={styles.statNumber}>{userStats.totalHabitsCompleted}</Text>
            <Text style={styles.statLabel}>Hábitos completados</Text>
          </View>
          <View style={styles.statItem}>
            <Ionicons name="star" size={24} color="#9C27B0" />
            <Text style={styles.statNumber}>
              {userStats.achievements.filter(a => a.unlocked).length}
            </Text>
            <Text style={styles.statLabel}>Logros desbloqueados</Text>
          </View>
        </View>
      </View>

      {/* Logros */}
      <View style={styles.achievementsCard}>
        <Text style={styles.sectionTitle}>🏆 Logros</Text>
        <View style={styles.achievementsGrid}>
          {userStats.achievements.map((achievement) => (
            <View
              key={achievement.id}
              style={[
                styles.achievement,
                achievement.unlocked && styles.achievementUnlocked,
              ]}
            >
              <Text style={styles.achievementIcon}>{achievement.icon}</Text>
              <Text style={styles.achievementTitle}>{achievement.title}</Text>
              <Text style={styles.achievementDesc}>{achievement.description}</Text>
              <View style={styles.achievementProgress}>
                <View style={styles.achievementProgressBar}>
                  <View
                    style={[
                      styles.achievementProgressFill,
                      {
                        width: `${(achievement.progress / achievement.maxProgress) * 100}%`,
                      },
                    ]}
                  />
                </View>
                <Text style={styles.achievementProgressText}>
                  {achievement.progress}/{achievement.maxProgress}
                </Text>
              </View>
              <Text style={styles.achievementPoints}>+{achievement.points} XP</Text>
            </View>
          ))}
        </View>
      </View>

      {/* Recompensas por nivel */}
      <View style={styles.rewardsCard}>
        <Text style={styles.sectionTitle}>🎁 Recompensas</Text>
        <View style={styles.rewardsList}>
          {getRewards().map((reward, index) => (
            <View key={index} style={styles.rewardItem}>
              <Ionicons name="gift" size={20} color="#FF6B6B" />
              <Text style={styles.rewardText}>{reward}</Text>
            </View>
          ))}
          {getRewards().length === 0 && (
            <Text style={styles.noRewardsText}>
              Completa más hábitos para desbloquear recompensas
            </Text>
          )}
        </View>
      </View>

      {/* Configuración */}
      <View style={styles.settingsCard}>
        <Text style={styles.sectionTitle}>⚙️ Configuración</Text>
        <TouchableOpacity style={styles.settingItem}>
          <Ionicons name="notifications" size={20} color="#666" />
          <Text style={styles.settingText}>Notificaciones</Text>
          <Ionicons name="chevron-forward" size={20} color="#ccc" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.settingItem}>
          <Ionicons name="color-palette" size={20} color="#666" />
          <Text style={styles.settingText}>Tema</Text>
          <Ionicons name="chevron-forward" size={20} color="#ccc" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.settingItem}>
          <Ionicons name="help-circle" size={20} color="#666" />
          <Text style={styles.settingText}>Ayuda</Text>
          <Ionicons name="chevron-forward" size={20} color="#ccc" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.settingItem} onPress={handleLogout}>
          <Ionicons name="log-out" size={20} color="#FF3B30" />
          <Text style={[styles.settingText, { color: "#FF3B30" }]}>
            Cerrar sesión
          </Text>
          <Ionicons name="chevron-forward" size={20} color="#ccc" />
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  header: {
    backgroundColor: "#3B82F6",
    padding: 20,
    paddingTop: 60,
  },
  profileInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 20,
  },
  avatarText: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#3B82F6",
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    color: "#fff",
    opacity: 0.9,
    marginBottom: 8,
  },
  levelTitle: {
    fontSize: 16,
    fontWeight: "600",
  },
  levelCard: {
    backgroundColor: "#fff",
    margin: 20,
    padding: 20,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  levelHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  levelLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
  levelProgress: {
    fontSize: 14,
    color: "#666",
  },
  progressBar: {
    height: 8,
    backgroundColor: "#f0f0f0",
    borderRadius: 4,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: "#3B82F6",
    borderRadius: 4,
  },
  nextLevelText: {
    fontSize: 12,
    color: "#666",
    marginTop: 8,
    textAlign: "center",
  },
  statsCard: {
    backgroundColor: "#fff",
    marginHorizontal: 20,
    marginBottom: 20,
    padding: 20,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 20,
  },
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  statItem: {
    width: "50%",
    alignItems: "center",
    marginBottom: 20,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginTop: 8,
  },
  statLabel: {
    fontSize: 12,
    color: "#666",
    marginTop: 4,
    textAlign: "center",
  },
  achievementsCard: {
    backgroundColor: "#fff",
    marginHorizontal: 20,
    marginBottom: 20,
    padding: 20,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  achievementsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  achievement: {
    width: "48%",
    backgroundColor: "#f8f9fa",
    padding: 15,
    borderRadius: 12,
    marginBottom: 10,
    alignItems: "center",
    opacity: 0.5,
  },
  achievementUnlocked: {
    opacity: 1,
    backgroundColor: "#e8f5e8",
  },
  achievementIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  achievementTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
    textAlign: "center",
    marginBottom: 4,
  },
  achievementDesc: {
    fontSize: 11,
    color: "#666",
    textAlign: "center",
    marginBottom: 8,
  },
  achievementProgress: {
    width: "100%",
    marginBottom: 8,
  },
  achievementProgressBar: {
    height: 4,
    backgroundColor: "#f0f0f0",
    borderRadius: 2,
    overflow: "hidden",
    marginBottom: 4,
  },
  achievementProgressFill: {
    height: "100%",
    backgroundColor: "#4CAF50",
    borderRadius: 2,
  },
  achievementProgressText: {
    fontSize: 10,
    color: "#666",
    textAlign: "center",
  },
  achievementPoints: {
    fontSize: 12,
    fontWeight: "600",
    color: "#4CAF50",
  },
  rewardsCard: {
    backgroundColor: "#fff",
    marginHorizontal: 20,
    marginBottom: 20,
    padding: 20,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  rewardsList: {
    gap: 10,
  },
  rewardItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
  },
  rewardText: {
    fontSize: 14,
    color: "#333",
    marginLeft: 10,
  },
  noRewardsText: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    fontStyle: "italic",
  },
  settingsCard: {
    backgroundColor: "#fff",
    marginHorizontal: 20,
    marginBottom: 30,
    padding: 20,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  settingItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  settingText: {
    fontSize: 16,
    color: "#333",
    marginLeft: 15,
    flex: 1,
  },
}); 