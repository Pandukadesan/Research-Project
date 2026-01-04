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

  const [newMileage, setNewMileage] = useState("");
  const [serviceCentre, setServiceCentre] = useState("");
  const [serviceNumber, setServiceNumber] = useState("");
  const [serviceDate, setServiceDate] = useState("");

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [searched, setSearched] = useState(false);

  // 🔍 Search button handler
  const handleSearch = async () => {
    if (!engineNumber || !chassisNumber) {
      alert("Please enter both Engine Number and Chassis Number");
      return;
    }

    try {
      const response = await fetch(
        `http://172.20.10.3:8070/api/service/getServiceRecords/${engineNumber}/${chassisNumber}`
      );

      const data = await response.json();
      setServiceRecords(data);
      setSearched(true);
    } catch (error) {
      console.log("Error fetching service records:", error);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Service Dashboard</Text>

      {/* 🔍 Search Section */}
      <Text style={styles.sectionTitle}>Search Vehicle</Text>

      <TextInput
        style={styles.input}
        placeholder="Engine Number"
        placeholderTextColor="#64748B"
        value={engineNumber}
        onChangeText={setEngineNumber}
      />

      <TextInput
        style={styles.input}
        placeholder="Chassis Number"
        placeholderTextColor="#64748B"
        value={chassisNumber}
        onChangeText={setChassisNumber}
      />

      <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
        <Text style={styles.buttonText}>Search Records</Text>
      </TouchableOpacity>

      {/* 📄 Service Records */}
      {searched && (
        <>
          <Text style={styles.sectionTitle}>Service Records</Text>

          {serviceRecords.length === 0 ? (
            <Text style={styles.noData}>No service records found</Text>
          ) : (
            serviceRecords.map((record) => (
              <View key={record._id} style={styles.recordCard}>
                <Text>Service Centre: {record.serviceCentre}</Text>
                <Text>Mileage: {record.newMileage} km</Text>
                <Text>Service No: {record.serviceNumber}</Text>
                <Text>Date: {record.serviceDate}</Text>
              </View>
            ))
          )}
        </>
      )}

      {/* ➕ Add New Service Record */}
      <Text style={styles.sectionTitle}>Add New Service Record</Text>

      <TextInput
        style={styles.input}
        placeholder="New Mileage"
        placeholderTextColor="#64748B"
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
        placeholderTextColor="#64748B"
        value={serviceNumber}
        onChangeText={setServiceNumber}
      />

      <TextInput
        style={styles.input}
        placeholder="Service Date (YYYY-MM-DD)"
        placeholderTextColor="#64748B"
        value={serviceDate}
        onChangeText={setServiceDate}
      />

      <TouchableOpacity style={styles.submitButton}>
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
  noData: {
    color: "#777",
    fontStyle: "italic",
  },
  submitButton: {
    backgroundColor: "green",
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
