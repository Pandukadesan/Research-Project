import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { useState } from "react";

const SERVICE_CENTERS = [
  "Toyota Authorized Service Centre",
  "Honda Service Centre",
  "Yamaha Service Centre",
  "Bajaj Auto Service Centre",
  "Mazda Service Centre",
];

export default function ServiceDashboard() {
  const [engineNumber, setEngineNumber] = useState("");
  const [chassisNumber, setChassisNumber] = useState("");

  const [serviceRecords, setServiceRecords] = useState([]);
  const [searched, setSearched] = useState(false);

  const [newMileage, setNewMileage] = useState("");
  const [serviceCentre, setServiceCentre] = useState("");
  const [serviceNumber, setServiceNumber] = useState("");
  const [serviceDate, setServiceDate] = useState("");

  const [dropdownOpen, setDropdownOpen] = useState(false);

  // 🔍 Fetch service records from BLOCKCHAIN
  const handleSearch = async () => {
    if (!engineNumber || !chassisNumber) {
      alert("Please enter both Engine Number and Chassis Number");
      return;
    }

    try {
      const response = await fetch(
        `http://172.20.10.3:8070/api/service/blockchain/getServiceRecords/${engineNumber}/${chassisNumber}`
      );

      const data = await response.json();

      // Blockchain records are inside `records`
      setServiceRecords(data.records || []);
      setSearched(true);
    } catch (error) {
      console.error("Error fetching blockchain service records:", error);
      alert("Failed to fetch blockchain records");
    }
  };

  // 🔢 Get last blockchain mileage
  const getLastBlockchainMileage = () => {
    if (serviceRecords.length === 0) return null;
    return Number(serviceRecords[serviceRecords.length - 1].mileage);
  };

  // 💾 Save New Service Record (WITH FRAUD CHECK)
  const handleSaveService = async () => {
    if (
      !engineNumber ||
      !chassisNumber ||
      !newMileage ||
      !serviceCentre ||
      !serviceNumber ||
      !serviceDate
    ) {
      alert("Please fill all fields");
      return;
    }

    const enteredMileage = Number(newMileage);
    const lastMileage = getLastBlockchainMileage();

    if (Number.isNaN(enteredMileage)) {
      alert("Mileage must be a number");
      return;
    }

    // 🚨 FRAUD DETECTION
    if (lastMileage !== null && enteredMileage <= lastMileage) {
      alert(
        `🚨 Mileage Fraud Detected!\n\nLast Verified Mileage: ${lastMileage} km\nEntered Mileage: ${enteredMileage} km`
      );
      return;
    }

    try {
      const response = await fetch(
        "http://172.20.10.3:8070/api/service/add",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            engineNumber,
            chassisNumber,
            serviceCentre,
            newMileage: enteredMileage,
            serviceNumber,
            serviceDate,
          }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        alert(
          `✅ Service added successfully!\n\nBlockchain TX:\n${data.blockchainTx}`
        );

        // Clear form
        setNewMileage("");
        setServiceCentre("");
        setServiceNumber("");
        setServiceDate("");

        // Refresh blockchain data
        handleSearch();
      } else {
        alert(data.message || "Failed to save service record");
      }
    } catch (error) {
      console.error("Error saving service record:", error);
      alert("Server error while saving record");
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Service Dashboard</Text>

      {/* 🔍 Search Vehicle */}
      <Text style={styles.sectionTitle}>Search Vehicle</Text>

      <TextInput
        style={styles.input}
        placeholder="Engine Number"
        value={engineNumber}
        onChangeText={setEngineNumber}
      />

      <TextInput
        style={styles.input}
        placeholder="Chassis Number"
        value={chassisNumber}
        onChangeText={setChassisNumber}
      />

      <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
        <Text style={styles.buttonText}>Search Blockchain Records</Text>
      </TouchableOpacity>

      {/* 📄 Blockchain Records */}
      {searched && (
        <>
          <Text style={styles.sectionTitle}>Blockchain Records</Text>

          {serviceRecords.length === 0 ? (
            <Text style={styles.noData}>No blockchain records found</Text>
          ) : (
            serviceRecords.map((record, index) => (
              <View key={index} style={styles.recordCard}>
                <Text>Service No: {record.serviceNumber}</Text>
                <Text>Mileage: {record.mileage} km</Text>
                <Text>
                  Date:{" "}
                  {new Date(record.timestamp * 1000).toLocaleDateString()}
                </Text>
                <Text style={styles.blockchainTag}>
                  ✔ Verified on Blockchain
                </Text>
              </View>
            ))
          )}
        </>
      )}

      {/* ➕ Add New Service Record */}
      <Text style={styles.sectionTitle}>Add New Service Record</Text>

      {/* Show last mileage */}
      {serviceRecords.length > 0 && (
        <Text style={styles.lastMileage}>
          Last Verified Mileage: {getLastBlockchainMileage()} km
        </Text>
      )}

      <TextInput
        style={styles.input}
        placeholder="New Mileage"
        keyboardType="numeric"
        value={newMileage}
        onChangeText={setNewMileage}
      />

      <TouchableOpacity
        style={styles.dropdown}
        onPress={() => setDropdownOpen(!dropdownOpen)}
      >
        <Text>{serviceCentre || "Select Service Centre"}</Text>
      </TouchableOpacity>

      {dropdownOpen &&
        SERVICE_CENTERS.map((center, index) => (
          <TouchableOpacity
            key={index}
            style={styles.option}
            onPress={() => {
              setServiceCentre(center);
              setDropdownOpen(false);
            }}
          >
            <Text>{center}</Text>
          </TouchableOpacity>
        ))}

      <TextInput
        style={styles.input}
        placeholder="Service Number"
        value={serviceNumber}
        onChangeText={setServiceNumber}
      />

      <TextInput
        style={styles.input}
        placeholder="Service Date (YYYY-MM-DD)"
        value={serviceDate}
        onChangeText={setServiceDate}
      />

      <TouchableOpacity
        style={styles.submitButton}
        onPress={handleSaveService}
      >
        <Text style={styles.buttonText}>Save New Mileage Record</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20 },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    color: "#1e40af",
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginTop: 20,
    marginBottom: 10,
  },
  lastMileage: {
    color: "green",
    fontWeight: "600",
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: "#000",
    borderRadius: 6,
    padding: 12,
    marginBottom: 15,
  },
  searchButton: {
    backgroundColor: "#2563eb",
    padding: 14,
    borderRadius: 6,
    alignItems: "center",
    marginBottom: 10,
  },
  dropdown: {
    borderWidth: 1,
    borderColor: "#000",
    borderRadius: 6,
    padding: 12,
    marginBottom: 10,
    backgroundColor: "#f9f9f9",
  },
  option: {
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 12,
    backgroundColor: "#fff",
  },
  recordCard: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 6,
    padding: 12,
    marginBottom: 10,
    backgroundColor: "#fafafa",
  },
  blockchainTag: {
    marginTop: 6,
    color: "green",
    fontWeight: "bold",
  },
  noData: {
    color: "#777",
    fontStyle: "italic",
  },
  submitButton: {
    backgroundColor: "#2563eb",
    padding: 15,
    borderRadius: 6,
    alignItems: "center",
    marginTop: 15,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});
