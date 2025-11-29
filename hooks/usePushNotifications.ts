import Constants from "expo-constants";
import * as Notifications from "expo-notifications";
import { apiRequest } from "../lib/api";
import { getToken } from "./useAuth";

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
  const { status } = await Notifications.getPermissionsAsync();

  if (status !== "granted") {
    const { status: newStatus } = await Notifications.requestPermissionsAsync();
    if (newStatus !== "granted") return null;
  }

  const expoToken = await Notifications.getExpoPushTokenAsync({
    projectId: Constants.expoConfig?.extra?.eas?.projectId,
  });

  const jwt = await getToken();

  if (jwt && expoToken.data) {
    await apiRequest("/devices", "POST", { token: expoToken.data }, jwt);
  }

  return expoToken.data;
}
