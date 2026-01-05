import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { router } from "expo-router";

export default function UserDashboard() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Dashboard</Text>
      <Text style={styles.subtitle}>
        Analyze your vehicle condition and get smart recommendations
      </Text>

      {/* Vehicle Score Button */}
      <TouchableOpacity
        style={styles.button}
        onPress={() => router.push("/(vehicle score)")}
      >
        <Text style={styles.buttonText}>Vehicle Score</Text>
      </TouchableOpacity>

      
      {/* Price Score Button */}
      <TouchableOpacity
        style={styles.button}
        onPress={() => router.push("/(price predict)")}
      >
        <Text style={styles.buttonText}>Vehicle Score</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
    justifyContent: "center",
    padding: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "#0F172A",
    textAlign: "center",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: "#475569",
    textAlign: "center",
    marginBottom: 32,
  },
  button: {
    backgroundColor: "#2563EB",
    paddingVertical: 16,
    borderRadius: 10,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 4,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
});
