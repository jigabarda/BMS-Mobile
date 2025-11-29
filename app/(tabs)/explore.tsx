import { useEffect, useState } from "react";
import { FlatList, RefreshControl, View } from "react-native";
import BroadcastItem from "../../components/BroadcastItem";
import { getToken } from "../../hooks/useAuth";
import { apiRequest } from "../../lib/api";

type Broadcast = {
  id: number;
  title: string;
  message: string;
};

export default function Explore() {
  const [data, setData] = useState<Broadcast[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  async function load() {
    setRefreshing(true);
    const token = await getToken();
    const result = await apiRequest(
      "/broadcasts",
      "GET",
      null,
      token ?? undefined
    );
    setData(result);
    setRefreshing(false);
  }

  useEffect(() => {
    load();
  }, []);

  return (
    <View style={{ flex: 1 }}>
      <FlatList
        data={data}
        keyExtractor={(item) => item.id.toString()}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={load} />
        }
        renderItem={({ item }) => <BroadcastItem item={item} />}
      />
    </View>
  );
}
