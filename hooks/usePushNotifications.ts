import Constants from "expo-constants";
import * as Notifications from "expo-notifications";
import { Platform } from "react-native";
import { apiRequest } from "../lib/api";
import { getRawToken } from "./useAuth";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export async function registerForPushNotificationsAsync() {
  try {
    let { status } = await Notifications.getPermissionsAsync();

    if (status !== "granted") {
      status = (await Notifications.requestPermissionsAsync()).status;
    }

    if (status !== "granted") {
      console.log("❌ Push permission not granted");
      return null;
    }

    if (Platform.OS === "android") {
      await Notifications.setNotificationChannelAsync("default", {
        name: "default",
        importance: Notifications.AndroidImportance.MAX,
      });
    }

    const expoToken = await Notifications.getExpoPushTokenAsync({
      projectId: Constants?.expoConfig?.extra?.eas?.projectId,
    });

    const token = expoToken.data;
    console.log("📲 Expo Push Token:", token);

    const jwt = await getRawToken();

    if (!jwt) {
      console.log("❌ Cannot save token — JWT missing");
      return token;
    }

    // Must use /api/v1/devices
    await apiRequest(
      "/devices",
      "POST",
      { device: { token } },
      { Authorization: `Bearer ${jwt}` }
    );

    console.log("✅ Device token saved to Rails:", token);
    return token;
  } catch (e) {
    console.log("❌ registerForPush error:", e);
    return null;
  }
}
