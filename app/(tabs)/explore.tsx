import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import { useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";
import {
  Alert,
  FlatList,
  Platform,
  RefreshControl,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import BroadcastItem from "../../components/BroadcastItem";
import { getTokenHeaders } from "../../hooks/useAuth";
import { apiRequest } from "../../lib/api";

type Broadcast = {
  id: number;
  title: string;
  message: string;
};

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export default function Explore() {
  const [data, setData] = useState<Broadcast[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const router = useRouter();
  const hasRegisteredDeviceRef = useRef(false);

  async function registerDeviceWithBackend(deviceToken: string) {
    try {
      const headers = await getTokenHeaders();
      if (!headers) return;

      await apiRequest(
        "/devices",
        "POST",
        { device: { token: deviceToken, platform: Platform.OS } },
        headers
      );

      console.log("✅ Device registered");
    } catch (err: any) {
      if (err?.exception?.includes("PG::UniqueViolation")) {
        console.log("ℹ️ Duplicate device token, ignoring.");
        return;
      }
      console.log("❌ Device register error", err);
    }
  }

  async function getFCMToken() {
    try {
      if (Platform.OS !== "android") return null;

      const fcm = await Notifications.getDevicePushTokenAsync();
      return fcm?.data || null;
    } catch (e) {
      console.log("❌ getFCMToken error", e);
      return null;
    }
  }

  async function registerForPush() {
    if (hasRegisteredDeviceRef.current) return;
    hasRegisteredDeviceRef.current = true;

    try {
      if (!Device.isDevice) {
        Alert.alert("Push notifications require a real device.");
        return;
      }

      let { status } = await Notifications.getPermissionsAsync();
      if (status !== "granted") {
        status = (await Notifications.requestPermissionsAsync()).status;
      }

      if (status !== "granted") return;

      const token = await getFCMToken();
      if (!token) return;

      await registerDeviceWithBackend(token);
    } catch (e) {
      console.log("❌ registerForPush error", e);
    }
  }

  async function load() {
    setRefreshing(true);

    try {
      const headers = await getTokenHeaders();
      if (headers) {
        const broadcasts = await apiRequest(
          "/broadcasts",
          "GET",
          undefined,
          headers
        );
        setData(broadcasts);
      }
    } catch (err) {
      console.log("❌ Failed to load broadcasts:", err);
    }

    setRefreshing(false);
  }

  useEffect(() => {
    registerForPush();
    load();

    const sub = Notifications.addNotificationResponseReceivedListener(
      (response) => {
        const id = response.notification.request.content.data.broadcast_id;
        if (id) router.push(`/broadcast/${id}`);
      }
    );

    return () => sub.remove();
  }, []);

  return (
    <View style={{ flex: 1, paddingTop: 20 }}>
      {/* 🔵 Refresh Button */}

      <FlatList
        data={data}
        keyExtractor={(item) => item.id.toString()}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={load} />
        }
        renderItem={({ item }) => <BroadcastItem item={item} />}
      />
      <TouchableOpacity
        onPress={load}
        style={{
          backgroundColor: "#007AFF",
          padding: 10,
          borderRadius: 8,
          alignSelf: "center",
          marginBottom: 10,
          width: 120,
        }}
      >
        <Text
          style={{ color: "white", textAlign: "center", fontWeight: "bold" }}
        >
          Refresh 🔄
        </Text>
      </TouchableOpacity>
    </View>
  );
}
