import { StyleSheet, Text, View } from "react-native";

type Props = {
  item: {
    id: number;
    title: string;
    message: string;
  };
};

export default function BroadcastItem({ item }: Props) {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>{item.title}</Text>
      <Text>{item.message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "white",
    padding: 15,
    marginVertical: 8,
    borderRadius: 10,
    elevation: 3,
  },
  title: { fontWeight: "bold", fontSize: 16 },
});
