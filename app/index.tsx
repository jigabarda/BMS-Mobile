import { useRouter } from "expo-router";
import { useState } from "react";
import { Alert, Button, Text, TextInput, View } from "react-native";
import { login, signup } from "../hooks/useAuth";
import { registerForPushNotificationsAsync } from "../hooks/usePushNotifications";

export default function AuthScreen() {
  const router = useRouter();
  const [isSignup, setIsSignup] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function handleSubmit() {
    try {
      if (isSignup) await signup(email, password);
      await login(email, password);
      await registerForPushNotificationsAsync();
      router.push("/(tabs)");
    } catch (e) {
      Alert.alert("Error", String(e));
    }
  }

  return (
    <View style={{ flex: 1, justifyContent: "center", padding: 20 }}>
      <Text style={{ fontSize: 22, fontWeight: "bold", marginBottom: 20 }}>
        {isSignup ? "Create Account" : "Login"}
      </Text>

      <TextInput
        placeholder="Email"
        value={email}
        autoCapitalize="none"
        onChangeText={setEmail}
        style={{ borderWidth: 1, padding: 8, marginBottom: 10 }}
      />

      <TextInput
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
        style={{ borderWidth: 1, padding: 8, marginBottom: 10 }}
      />

      <Button title={isSignup ? "Sign Up" : "Login"} onPress={handleSubmit} />

      <Text style={{ marginTop: 20 }} onPress={() => setIsSignup(!isSignup)}>
        {isSignup ? "Already have an account? Login" : "No account? Sign up"}
      </Text>
    </View>
  );
}
