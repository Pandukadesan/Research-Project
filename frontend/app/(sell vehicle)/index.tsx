import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
} from "react-native";
import { useState } from "react";

const Registered_Seller_List = [
  "Yamaha",
  "Bajaj",
  "Honda",
  "Toyota",
  "Mazda",
];

export default function SellVehicle() {
  const [selectedSeller, setSelectedSeller] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const [vehicleId, setVehicleId] = useState("");
  const [registrationDate, setRegistrationDate] = useState("");
  const [baselineMileage, setBaselineMileage] = useState("0");
  const [make, setMake] = useState("");
  const [model, setModel] = useState("");
  const [year, setYear] = useState("");
  const [verifierInfo, setVerifierInfo] = useState("");

  // 🔗 SUBMIT TO BACKEND
  const submitVehicleBaseline = async () => {
    try {
      const response = await fetch(
        "http://172.20.10.3:8070/api/vehicleRecordsBaseline/add",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            engineNumber: vehicleId,
            chassisNumber: vehicleId,
            registrationDate,
            baselineMileage: Number(baselineMileage),
            make,
            model,
            year: Number(year),
            verifierInfo,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(data);
        return;
      }

      alert("Vehicle Record Baseline Added Successfully 🚗✅");

      // Reset form
      setSelectedSeller("");
      setVehicleId("");
      setRegistrationDate("");
      setBaselineMileage("0");
      setMake("");
      setModel("");
      setYear("");
      setVerifierInfo("");

    } catch (error) {
      console.error(error);
      alert("Server error. Please try again.");
    }
  };

  // 🧠 VALIDATION + SUBMIT
  const handleSubmit = () => {
    if (!selectedSeller) {
      alert("Please select a seller");
      return;
    }

    if (
      !vehicleId ||
      !registrationDate ||
      !make ||
      !model ||
      !year ||
      !verifierInfo
    ) {
      alert("Please fill all required fields");
      return;
    }

    submitVehicleBaseline();
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Sell Vehicle</Text>

      {/* Seller Dropdown */}
      <TouchableOpacity
        style={styles.dropdown}
        onPress={() => setDropdownOpen(!dropdownOpen)}
      >
        <Text>{selectedSeller || "Select Seller"}</Text>
      </TouchableOpacity>

      {dropdownOpen &&
        Registered_Seller_List.map((item, index) => (
          <TouchableOpacity
            key={index}
            style={styles.option}
            onPress={() => {
              setSelectedSeller(item);
              setDropdownOpen(false);
            }}
          >
            <Text>{item}</Text>
          </TouchableOpacity>
        ))}

      {/* Inputs */}
      <TextInput
        style={styles.input}
        placeholder="Engine / Chassis Number"
        value={vehicleId}
        onChangeText={setVehicleId}
      />

      <TextInput
        style={styles.input}
        placeholder="Registration Date (YYYY-MM-DD)"
        value={registrationDate}
        onChangeText={setRegistrationDate}
      />

      <TextInput
        style={styles.input}
        placeholder="Baseline Mileage"
        keyboardType="numeric"
        value={baselineMileage}
        onChangeText={setBaselineMileage}
      />

      <TextInput
        style={styles.input}
        placeholder="Vehicle Make"
        value={make}
        onChangeText={setMake}
      />

      <TextInput
        style={styles.input}
        placeholder="Vehicle Model"
        value={model}
        onChangeText={setModel}
      />

      <TextInput
        style={styles.input}
        placeholder="Vehicle Year"
        keyboardType="numeric"
        value={year}
        onChangeText={setYear}
      />

      <TextInput
        style={styles.input}
        placeholder="Verifier Info (Dealer / Wallet Address)"
        value={verifierInfo}
        onChangeText={setVerifierInfo}
      />

      {/* Submit Button */}
      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Submit to Blockchain</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    alignItems: "center",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "blue",
    marginBottom: 20,
  },
  dropdown: {
    width: "100%",
    padding: 12,
    borderWidth: 1,
    borderColor: "#000",
    borderRadius: 5,
    backgroundColor: "#f9f9f9",
    marginBottom: 10,
  },
  option: {
    width: "100%",
    padding: 12,
    borderWidth: 1,
    borderColor: "#ddd",
    backgroundColor: "#fff",
  },
  input: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#000",
    borderRadius: 5,
    padding: 12,
    marginBottom: 15,
    color: "black",
  },
  button: {
    backgroundColor: "blue",
    padding: 15,
    borderRadius: 5,
    width: "100%",
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
  },
});
