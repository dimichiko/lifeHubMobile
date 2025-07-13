export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  points: number;
  unlocked: boolean;
  progress: number;
  maxProgress: number;
}

export interface UserStats {
  level: number;
  experience: number;
  totalPoints: number;
  achievements: Achievement[];
  currentStreak: number;
  longestStreak: number;
  totalHabitsCompleted: number;
}

export class GamificationService {
  private static readonly POINTS_PER_HABIT = 10;
  private static readonly POINTS_PER_STREAK_DAY = 5;
  private static readonly EXPERIENCE_PER_LEVEL = 100;

  static calculateLevel(experience: number): number {
    return Math.floor(experience / this.EXPERIENCE_PER_LEVEL) + 1;
  }

  static calculateExperienceToNextLevel(experience: number): number {
    const currentLevel = this.calculateLevel(experience);
    const experienceForCurrentLevel =
      (currentLevel - 1) * this.EXPERIENCE_PER_LEVEL;
    return this.EXPERIENCE_PER_LEVEL - (experience - experienceForCurrentLevel);
  }

  static calculateProgressToNextLevel(experience: number): number {
    const currentLevel = this.calculateLevel(experience);
    const experienceForCurrentLevel =
      (currentLevel - 1) * this.EXPERIENCE_PER_LEVEL;
    const experienceInCurrentLevel = experience - experienceForCurrentLevel;
    return (experienceInCurrentLevel / this.EXPERIENCE_PER_LEVEL) * 100;
  }

  static getPointsForHabitCompletion(streakDays: number = 0): number {
    let points = this.POINTS_PER_HABIT;

    // Bonus por racha
    if (streakDays >= 7) points += 20;
    else if (streakDays >= 3) points += 10;

    return points;
  }

  static getPointsForStreak(streakDays: number): number {
    return streakDays * this.POINTS_PER_STREAK_DAY;
  }

  static getAchievements(): Achievement[] {
    return [
      {
        id: "first_habit",
        title: "Primer Paso",
        description: "Completa tu primer hábito",
        icon: "🎯",
        points: 50,
        unlocked: false,
        progress: 0,
        maxProgress: 1,
      },
      {
        id: "streak_3",
        title: "Constancia",
        description: "Mantén una racha de 3 días",
        icon: "💪",
        points: 100,
        unlocked: false,
        progress: 0,
        maxProgress: 3,
      },
      {
        id: "streak_7",
        title: "Semana Perfecta",
        description: "Mantén una racha de 7 días",
        icon: "🔥",
        points: 200,
        unlocked: false,
        progress: 0,
        maxProgress: 7,
      },
      {
        id: "streak_30",
        title: "Maestro de Hábitos",
        description: "Mantén una racha de 30 días",
        icon: "👑",
        points: 500,
        unlocked: false,
        progress: 0,
        maxProgress: 30,
      },
      {
        id: "complete_10",
        title: "Dedicación",
        description: "Completa 10 hábitos",
        icon: "⭐",
        points: 150,
        unlocked: false,
        progress: 0,
        maxProgress: 10,
      },
      {
        id: "complete_50",
        title: "Experto",
        description: "Completa 50 hábitos",
        icon: "🏆",
        points: 300,
        unlocked: false,
        progress: 0,
        maxProgress: 50,
      },
      {
        id: "complete_100",
        title: "Leyenda",
        description: "Completa 100 hábitos",
        icon: "💎",
        points: 1000,
        unlocked: false,
        progress: 0,
        maxProgress: 100,
      },
      {
        id: "perfect_week",
        title: "Semana Impecable",
        description: "Completa todos tus hábitos en una semana",
        icon: "✨",
        points: 250,
        unlocked: false,
        progress: 0,
        maxProgress: 1,
      },
      {
        id: "level_5",
        title: "Ascenso",
        description: "Alcanza el nivel 5",
        icon: "🚀",
        points: 400,
        unlocked: false,
        progress: 0,
        maxProgress: 5,
      },
      {
        id: "level_10",
        title: "Veterano",
        description: "Alcanza el nivel 10",
        icon: "🎖️",
        points: 800,
        unlocked: false,
        progress: 0,
        maxProgress: 10,
      },
    ];
  }

  static checkAchievements(userStats: UserStats): Achievement[] {
    const achievements = this.getAchievements();
    const updatedAchievements = achievements.map((achievement) => {
      let progress = 0;
      let unlocked = false;

      switch (achievement.id) {
        case "first_habit":
          progress = userStats.totalHabitsCompleted > 0 ? 1 : 0;
          unlocked = userStats.totalHabitsCompleted > 0;
          break;
        case "streak_3":
          progress = Math.min(userStats.currentStreak, 3);
          unlocked = userStats.currentStreak >= 3;
          break;
        case "streak_7":
          progress = Math.min(userStats.currentStreak, 7);
          unlocked = userStats.currentStreak >= 7;
          break;
        case "streak_30":
          progress = Math.min(userStats.currentStreak, 30);
          unlocked = userStats.currentStreak >= 30;
          break;
        case "complete_10":
          progress = Math.min(userStats.totalHabitsCompleted, 10);
          unlocked = userStats.totalHabitsCompleted >= 10;
          break;
        case "complete_50":
          progress = Math.min(userStats.totalHabitsCompleted, 50);
          unlocked = userStats.totalHabitsCompleted >= 50;
          break;
        case "complete_100":
          progress = Math.min(userStats.totalHabitsCompleted, 100);
          unlocked = userStats.totalHabitsCompleted >= 100;
          break;
        case "level_5":
          progress = Math.min(userStats.level, 5);
          unlocked = userStats.level >= 5;
          break;
        case "level_10":
          progress = Math.min(userStats.level, 10);
          unlocked = userStats.level >= 10;
          break;
      }

      return {
        ...achievement,
        progress,
        unlocked,
      };
    });

    return updatedAchievements;
  }

  static getLevelTitle(level: number): string {
    if (level >= 20) return "Leyenda";
    if (level >= 15) return "Maestro";
    if (level >= 10) return "Experto";
    if (level >= 5) return "Avanzado";
    if (level >= 3) return "Intermedio";
    return "Principiante";
  }

  static getLevelColor(level: number): string {
    if (level >= 20) return "#FFD700"; // Dorado
    if (level >= 15) return "#C0C0C0"; // Plateado
    if (level >= 10) return "#CD7F32"; // Bronce
    if (level >= 5) return "#4CAF50"; // Verde
    return "#2196F3"; // Azul
  }

  static getRewardsForLevel(level: number): string[] {
    const rewards: string[] = [];

    if (level >= 5) rewards.push("🎨 Temas personalizados");
    if (level >= 10) rewards.push("📊 Estadísticas avanzadas");
    if (level >= 15) rewards.push("🏆 Logros especiales");
    if (level >= 20) rewards.push("👑 Estado VIP");

    return rewards;
  }
}
