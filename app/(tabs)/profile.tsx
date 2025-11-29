import { useRouter } from "expo-router";
import { Button, View } from "react-native";
import { logout } from "../../hooks/useAuth";

export default function Profile() {
  const router = useRouter();

  async function handleLogout() {
    await logout();
    router.replace("/");
  }

  return (
    <View style={{ flex: 1, justifyContent: "center", padding: 20 }}>
      <Button title="Logout" onPress={handleLogout} />
    </View>
  );
}
