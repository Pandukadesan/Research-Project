import { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Alert,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { router } from "expo-router";

export default function VehicleScoreDashboard() {
  // 🔢 Dummy score data
  const score = 82;
  const [status, setStatus] = useState("Good Condition");

  // Image picker & prediction state
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [prediction, setPrediction] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Open gallery to pick image
  const pickImage = async () => {
    try {
      const permissionResult =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permissionResult.granted) {
        Alert.alert(
          "Permission Required",
          "Camera roll permission is required to select an image."
        );
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 1,
      });

      if (!result.canceled && result.assets.length > 0) {
        setSelectedImage(result.assets[0].uri);
        sendToModel(result.assets[0].uri);
      }
    } catch (error) {
      console.log("Image picker error:", error);
    }
  };

  // Send image to Flask API
  const sendToModel = async (uri: string) => {
    setLoading(true);
    setPrediction(null);
    try {
      const formData = new FormData();
      const filename = uri.split("/").pop() || "image.jpg";
      const match = /\.(\w+)$/.exec(filename);
      const type = match ? `image/${match[1]}` : `image`;

      // Append file
      formData.append("file", {
        uri,
        name: filename,
        type,
      } as any);

      const response = await fetch("http://172.20.10.3:5001/predict", {
        method: "POST",
        body: formData,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      const data = await response.json();
      if (data.prediction) {
        setPrediction(data.prediction);
        setStatus(
          data.prediction === "good" ? "Good Condition" : "Defective Tyre"
        );
      } else {
        Alert.alert("Error", "Invalid response from model.");
      }
    } catch (error) {
      console.log("Prediction error:", error);
      Alert.alert("Error", "Failed to get prediction from model.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Vehicle Score</Text>
      <Text style={styles.subtitle}>Overall health analysis of the vehicle</Text>

      {/* SCORE CARD */}
      <View style={styles.scoreCard}>
        <Text style={styles.score}>{score}</Text>
        <Text style={styles.scoreOutOf}>/ 100</Text>
        <Text style={styles.status}>{status}</Text>
      </View>

      {/* IMAGE PICKER */}
      <View style={styles.analysisCard}>
        <Text style={styles.sectionTitle}>Check Tyre Condition</Text>
        {selectedImage && (
          <Image source={{ uri: selectedImage }} style={styles.imagePreview} />
        )}
        {loading && <ActivityIndicator size="large" color="#2563EB" />}
        <TouchableOpacity style={styles.button} onPress={pickImage}>
          <Text style={styles.buttonText}>
            {selectedImage ? "Change Image" : "Select Image"}
          </Text>
        </TouchableOpacity>
        {prediction && (
          <Text style={styles.predictionText}>
            Prediction: {prediction.toUpperCase()}
          </Text>
        )}
      </View>

      {/* RECOMMENDATION */}
      <View style={styles.recommendationCard}>
        <Text style={styles.sectionTitle}>Recommendation</Text>
        <Text style={styles.recommendationText}>
          The vehicle is in good condition overall. However, tyre replacement is
          recommended before purchase. Engine performance is healthy.
        </Text>
      </View>

      {/* BACK BUTTON */}
      <TouchableOpacity style={styles.button} onPress={() => router.back()}>
        <Text style={styles.buttonText}>Back to Dashboard</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F8FAFC", padding: 24 },
  title: { fontSize: 28, fontWeight: "700", color: "#0F172A", textAlign: "center", marginTop: 20 },
  subtitle: { fontSize: 14, color: "#475569", textAlign: "center", marginBottom: 24 },
  scoreCard: {
    backgroundColor: "#2563EB",
    borderRadius: 16,
    paddingVertical: 32,
    alignItems: "center",
    marginBottom: 24,
  },
  score: { fontSize: 56, fontWeight: "800", color: "#FFFFFF" },
  scoreOutOf: { color: "#DBEAFE", fontSize: 16 },
  status: { marginTop: 8, fontSize: 16, color: "#E0E7FF", fontWeight: "600" },
  analysisCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    alignItems: "center",
  },
  sectionTitle: { fontSize: 16, fontWeight: "600", marginBottom: 8, color: "#0F172A" },
  imagePreview: { width: 200, height: 200, borderRadius: 12, marginVertical: 12 },
  predictionText: { fontSize: 16, fontWeight: "600", marginTop: 12, color: "#DC2626" },
  recommendationCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  recommendationText: { fontSize: 14, color: "#475569", lineHeight: 20 },
  button: {
    backgroundColor: "#2563EB",
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 12,
    paddingHorizontal: 16,
  },
  buttonText: { color: "#FFFFFF", fontSize: 16, fontWeight: "600" },
});
