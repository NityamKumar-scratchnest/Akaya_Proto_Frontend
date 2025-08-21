import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import { Platform } from "react-native";

// Register and get token
export async function registerForPushNotificationsAsync() {
  if (Platform.OS === "android") {
    await Notifications.setNotificationChannelAsync("default", {
      name: "default",
      importance: Notifications.AndroidImportance.MAX,
    });
  }

  if (Device.isDevice) {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== "granted") {
      alert("Failed to get push token!");
      return null;
    }

    return (await Notifications.getExpoPushTokenAsync()).data;
  } else {
    alert("Must use physical device for Push Notifications");
    return null;
  }
}

// Trigger a notification
export async function sendLoginNotification() {
  await Notifications.scheduleNotificationAsync({
    content: {
      title: "Login Successful ✅",
      body: "Welcome back! You’ve successfully signed in.",
    },
    trigger: null, // send immediately
  });
}
