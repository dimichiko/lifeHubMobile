import * as Notifications from "expo-notifications";
import * as Device from "expo-device";
import { Platform } from "react-native";

// Configurar notificaciones
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export class NotificationService {
  static async registerForPushNotificationsAsync() {
    let token;

    if (Platform.OS === "android") {
      await Notifications.setNotificationChannelAsync("default", {
        name: "default",
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: "#FF231F7C",
      });
    }

    if (Device.isDevice) {
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      
      if (existingStatus !== "granted") {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      
      if (finalStatus !== 'granted') {
        alert('¡Necesitamos permisos para enviarte recordatorios!');
        return;
      }
      
      token = (await Notifications.getExpoPushTokenAsync({
        projectId: 'your-project-id', // Reemplazar con tu project ID
      })).data;
    } else {
      alert('Debes usar un dispositivo físico para las notificaciones');
    }

    return token;
  }

  static async scheduleHabitReminder(habitId: string, habitName: string, time: Date, daysOfWeek: string[] = []) {
    if (daysOfWeek.length > 0) {
      // Notificación recurrente en días específicos
      for (const day of daysOfWeek) {
        const dayNumber = this.getDayNumber(day);
        await Notifications.scheduleNotificationAsync({
          content: {
            title: "🔄 Recordatorio de hábito",
            body: `Es hora de: ${habitName}`,
            data: { habitId, type: "reminder" },
          },
          trigger: {
            type: "calendar",
            hour: time.getHours(),
            minute: time.getMinutes(),
            weekday: dayNumber,
            repeats: true,
          },
        });
      }
    } else {
      // Notificación diaria
      await Notifications.scheduleNotificationAsync({
        content: {
          title: "🔄 Recordatorio de hábito",
          body: `Es hora de: ${habitName}`,
          data: { habitId, type: "reminder" },
        },
        trigger: {
          type: "calendar",
          hour: time.getHours(),
          minute: time.getMinutes(),
          repeats: true,
        },
      });
    }
  }

  static async scheduleHabitCompletion(habitName: string) {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: '✅ ¡Hábito completado!',
        body: `¡Felicidades! Has completado: ${habitName}`,
        data: { type: 'completion' },
      },
      trigger: null, // Notificación inmediata
    });
  }

  static async scheduleStreakNotification(streakDays: number, habitName: string) {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: '🔥 ¡Racha impresionante!',
        body: `¡${streakDays} días seguidos con ${habitName}! ¡Sigue así!`,
        data: { type: 'streak' },
      },
      trigger: null,
    });
  }

  static async cancelHabitReminders(habitId: string) {
    const scheduledNotifications = await Notifications.getAllScheduledNotificationsAsync();
    
    for (const notification of scheduledNotifications) {
      if (notification.content.data?.habitId === habitId) {
        await Notifications.cancelScheduledNotificationAsync(notification.identifier);
      }
    }
  }

  static async cancelAllNotifications() {
    await Notifications.cancelAllScheduledNotificationsAsync();
  }

  private static getDayNumber(day: string): number {
    const days: { [key: string]: number } = {
      sunday: 1,
      monday: 2,
      tuesday: 3,
      wednesday: 4,
      thursday: 5,
      friday: 6,
      saturday: 7,
    };
    return days[day] || 1;
  }
} 