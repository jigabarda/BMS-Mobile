import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { Text, View } from "react-native";
import { getTokenHeaders } from "../../hooks/useAuth";
import { apiRequest } from "../../lib/api";

export default function BroadcastDetails() {
  const { id } = useLocalSearchParams();
  const [broadcast, setBroadcast] = useState<any>(null);

  useEffect(() => {
    if (!id) return;

    (async () => {
      try {
        const headers = await getTokenHeaders();
        if (!headers) return;

        const result = await apiRequest(
          `/broadcasts/${id}`,
          "GET",
          undefined,
          headers
        );
        setBroadcast(result);
      } catch (err) {
        console.log("❌ Failed to load broadcast:", err);
      }
    })();
  }, [id]);

  if (!broadcast) return <Text>Loading...</Text>;

  return (
    <View style={{ padding: 20 }}>
      <Text style={{ fontSize: 22, fontWeight: "bold" }}>
        {broadcast?.title}
      </Text>
      <Text style={{ marginTop: 10, fontSize: 16 }}>{broadcast?.message}</Text>
    </View>
  );
}
