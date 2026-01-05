import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  ScrollView,
} from "react-native";

export default function App() {
  // ---------------- STATES ----------------
  const [faultName, setFaultName] = useState("");
  const [faultCode, setFaultCode] = useState("");

  const [partsNeeded, setPartsNeeded] = useState(""); // predicted part
  const [futureDate, setFutureDate] = useState("");

  const [priceResult, setPriceResult] = useState(null);

  const [region, setRegion] = useState(""); // selected region
  const [repairCost, setRepairCost] = useState(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const REGION_OPTIONS = ["Urban", "Suburban", "Rural", "Colombo Metro"];

  // ---------------- STEP 1: PREDICT PARTS ----------------
  const predictPartNeeded = async () => {
    setLoading(true);
    setError("");
    setPartsNeeded("");
    setPriceResult(null);
    setRepairCost(null);

    try {
      const response = await fetch(
        "http://172.20.10.3:6001/predictparts6",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            FaultName: faultName,
            FaultCode: faultCode,
          }),
        }
      );

      if (!response.ok) throw new Error();

      const data = await response.json();
      setPartsNeeded(data.predicted_part_needed);
    } catch {
      setError("Failed to predict parts needed");
    } finally {
      setLoading(false);
    }
  };

  // ---------------- STEP 2: PREDICT FUTURE PRICE ----------------
  const predictPriceByDate = async () => {
    setLoading(true);
    setError("");
    setPriceResult(null);
    setRepairCost(null);

    try {
      const response = await fetch(
        "http://172.20.10.3:6000/predict3",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            partname: partsNeeded,
            date: futureDate,
          }),
        }
      );

      if (!response.ok) throw new Error();

      const data = await response.json();
      setPriceResult(data);
    } catch {
      setError("Failed to predict future price");
    } finally {
      setLoading(false);
    }
  };

  // ---------------- STEP 3: PREDICT REPAIR COST ----------------
  const predictRepairCost = async () => {
    if (!priceResult) {
      setError("Please predict the part price first");
      return;
    }

    if (!region) {
      setError("Please select a region");
      return;
    }

    setLoading(true);
    setError("");
    setRepairCost(null);

    try {
      const response = await fetch(
        "http://172.20.10.3:6002/predictcost",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            FaultCategory: faultName,
            FaultCode: faultCode,
            Region: region,
            Partscost: Number(priceResult.predicted_price),
          }),
        }
      );

      if (!response.ok) throw new Error();

      const data = await response.json();
      setRepairCost(data.predicted_cost);
    } catch {
      setError("Failed to predict repair cost");
    } finally {
      setLoading(false);
    }
  };

  // ---------------- UI ----------------
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Fault → Part → Price → Repair Cost</Text>

      {/* ---------- STEP 1 ---------- */}
      <Text style={styles.sectionTitle}>Step 1: Predict Parts Needed</Text>

      <TextInput
        style={styles.input}
        placeholder="Fault Name (e.g. Engine Overheating)"
        value={faultName}
        onChangeText={setFaultName}
      />

      <TextInput
        style={styles.input}
        placeholder="Fault Code (e.g. FC101)"
        value={faultCode}
        onChangeText={setFaultCode}
      />

      <TouchableOpacity style={styles.button} onPress={predictPartNeeded}>
        <Text style={styles.buttonText}>Predict Part</Text>
      </TouchableOpacity>

      {partsNeeded !== "" && (
        <View style={styles.resultBox}>
          <Text style={{ fontWeight: "bold" }}>Predicted Part Needed:</Text>
          <Text>{partsNeeded}</Text>
        </View>
      )}

      {/* ---------- STEP 2 ---------- */}
      <Text style={styles.sectionTitle}>Step 2: Predict Future Price</Text>

      <TextInput
        style={styles.input}
        placeholder="Future Date (YYYY-MM-DD)"
        value={futureDate}
        onChangeText={setFutureDate}
      />

      <TouchableOpacity
        style={[
          styles.button,
          (!partsNeeded || !futureDate) && styles.disabledButton,
        ]}
        onPress={predictPriceByDate}
        disabled={!partsNeeded || !futureDate}
      >
        <Text style={styles.buttonText}>
          Predict Price for {partsNeeded || "Part"}
        </Text>
      </TouchableOpacity>

      {priceResult && (
        <View style={styles.resultBox}>
          <Text style={{ fontWeight: "bold" }}>Predicted Future Price:</Text>
          <Text>LKR {Number(priceResult.predicted_price).toFixed(2)}</Text>
        </View>
      )}

      {/* ---------- STEP 3 ---------- */}
      <Text style={styles.sectionTitle}>Step 3: Predict Repair Cost</Text>
      <Text style={{ marginBottom: 5 }}>Select Region:</Text>

      <View style={styles.regionContainer}>
        {REGION_OPTIONS.map((r) => (
          <TouchableOpacity
            key={r}
            style={[
              styles.regionButton,
              region === r && styles.regionButtonSelected,
            ]}
            onPress={() => setRegion(r)}
          >
            <Text
              style={[
                styles.regionButtonText,
                region === r && styles.regionButtonTextSelected,
              ]}
            >
              {r}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity
        style={[
          styles.button,
          (!faultCode || !region || !priceResult) && styles.disabledButton,
        ]}
        onPress={predictRepairCost}
        disabled={!faultCode || !region || !priceResult}
      >
        <Text style={styles.buttonText}>Predict Repair Cost</Text>
      </TouchableOpacity>

      {repairCost !== null && (
        <View style={styles.resultBox}>
          <Text style={{ fontWeight: "bold" }}>Predicted Repair Cost:</Text>
          <Text>LKR {Number(repairCost).toFixed(2)}</Text>
        </View>
      )}

      {loading && <ActivityIndicator size="large" />}
      {error !== "" && <Text style={styles.error}>{error}</Text>}
    </ScrollView>
  );
}

// ---------------- STYLES ----------------
const styles = StyleSheet.create({
  container: { padding: 20, backgroundColor: "#fff" },
  title: { fontSize: 22, fontWeight: "bold", textAlign: "center" },
  sectionTitle: { fontSize: 18, fontWeight: "bold", marginTop: 25 },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 12,
    borderRadius: 6,
    marginBottom: 12,
  },
  button: {
    backgroundColor: "#007bff",
    padding: 12,
    borderRadius: 6,
    alignItems: "center",
    marginBottom: 10,
  },
  disabledButton: { backgroundColor: "#a0a0a0" },
  buttonText: { color: "#fff", fontWeight: "bold" },
  resultBox: {
    marginTop: 10,
    padding: 12,
    backgroundColor: "#eef5ff",
    borderRadius: 6,
  },
  error: { color: "red", textAlign: "center", marginTop: 10 },
  regionContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 12,
  },
  regionButton: {
    padding: 10,
    borderWidth: 1,
    borderColor: "#007bff",
    borderRadius: 6,
    marginRight: 10,
    marginBottom: 10,
  },
  regionButtonSelected: {
    backgroundColor: "#007bff",
  },
  regionButtonText: {
    color: "#007bff",
    fontWeight: "bold",
  },
  regionButtonTextSelected: {
    color: "#fff",
  },
});
