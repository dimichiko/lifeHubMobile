import React, { useEffect, useRef } from "react";
import * as Notifications from "expo-notifications";
import * as Device from "expo-device";
import { Platform } from "react-native";

// Configurar comportamiento de notificaciones
Notifications.setNotificationHandler({
  handleNotification: () => {
    return Promise.resolve({
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: false,
      shouldShowBanner: true,
      shouldShowList: true,
    });
  },
});

interface NotificationsProviderProps {
  children: React.ReactNode;
}

export const NotificationsProvider: React.FC<NotificationsProviderProps> = ({
  children,
}) => {
  const notificationListener = useRef<any>();
  const responseListener = useRef<any>();

  useEffect(() => {
    void registerForPushNotificationsAsync();

    notificationListener.current =
      Notifications.addNotificationReceivedListener((notification: any) => {
        console.log("Notification received:", notification);
      });

    responseListener.current =
      Notifications.addNotificationResponseReceivedListener((response: any) => {
        console.log("Notification response:", response);
      });

    return () => {
      if (notificationListener.current) {
        Notifications.removeNotificationSubscription(
          notificationListener.current,
        );
      }
      if (responseListener.current) {
        Notifications.removeNotificationSubscription(responseListener.current);
      }
    };
  }, []);

  return <>{children}</>;
};

// Función para solicitar permisos y registrar para notificaciones
async function registerForPushNotificationsAsync() {
  if (Platform.OS === "android") {
    await Notifications.setNotificationChannelAsync("default", {
      name: "default",
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: "#FF231F7C",
    });
  }

  if (Device.isDevice) {
    const { status: existingStatus } =
      await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== "granted") {
      console.log("Failed to get push token for push notification!");
      return;
    }

    try {
      const token = (
        await Notifications.getExpoPushTokenAsync({
          projectId: "your-project-id", // Reemplazar con tu project ID
        })
      ).data;
      console.log("Push token:", token);
    } catch (error) {
      console.log("Error getting push token:", error);
    }
  } else {
    console.log("Must use physical device for Push Notifications");
  }
}

// Función para agendar notificaciones
export const scheduleNotification = async (
  title: string,
  body: string,
  trigger: any,
) => {
  try {
    await Notifications.scheduleNotificationAsync({
      content: {
        title,
        body,
        sound: true,
      },
      trigger,
    });
    console.log("Notification scheduled successfully");
  } catch (error) {
    console.error("Error scheduling notification:", error);
  }
};

// Función para cancelar todas las notificaciones
export const cancelAllNotifications = async () => {
  try {
    await Notifications.cancelAllScheduledNotificationsAsync();
    console.log("All notifications cancelled");
  } catch (error) {
    console.error("Error cancelling notifications:", error);
  }
};
