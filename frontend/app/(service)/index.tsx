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

const COMPONENTS_OPTIONS = [
  "Tyre",
  "Body",
];

// Tab types
const TABS = {
  SERVICE: "SERVICE",
  REPAIR: "REPAIR",
};

export default function ServiceDashboard() {
  const [engineNumber, setEngineNumber] = useState("");
  const [chassisNumber, setChassisNumber] = useState("");

  const [serviceRecords, setServiceRecords] = useState([]);
  const [searched, setSearched] = useState(false);

  // Service tab fields
  const [newMileage, setNewMileage] = useState("");
  const [serviceCentre, setServiceCentre] = useState("");
  const [serviceNumber, setServiceNumber] = useState("");
  const [serviceDate, setServiceDate] = useState("");

  // Repair tab fields
  const [repairMileage, setRepairMileage] = useState("");
  const [repairServiceCentre, setRepairServiceCentre] = useState("");
  const [repairServiceNumber, setRepairServiceNumber] = useState("");
  const [repairServiceDate, setRepairServiceDate] = useState("");
  const [selectedComponents, setSelectedComponents] = useState([]);

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [repairDropdownOpen, setRepairDropdownOpen] = useState(false);
  const [componentsDropdownOpen, setComponentsDropdownOpen] = useState(false);
  const [activeTab, setActiveTab] = useState(TABS.SERVICE);

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

  // Toggle component selection
  const toggleComponent = (component) => {
    if (selectedComponents.includes(component)) {
      setSelectedComponents(selectedComponents.filter(c => c !== component));
    } else {
      setSelectedComponents([...selectedComponents, component]);
    }
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
            recordType: "SERVICE",
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

  // 🔧 Save New Repair Record (WITH FRAUD CHECK)
  const handleSaveRepair = async () => {
    if (
      !engineNumber ||
      !chassisNumber ||
      !repairMileage ||
      !repairServiceCentre ||
      !repairServiceNumber ||
      !repairServiceDate ||
      selectedComponents.length === 0
    ) {
      alert("Please fill all fields and select at least one component");
      return;
    }

    const enteredMileage = Number(repairMileage);
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
            serviceCentre: repairServiceCentre,
            newMileage: enteredMileage,
            serviceNumber: repairServiceNumber,
            serviceDate: repairServiceDate,
            componentsReplaced: selectedComponents.join(", "),
            recordType: "REPAIR",
          }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        alert(
          `✅ Repair record added successfully!\n\nBlockchain TX:\n${data.blockchainTx}`
        );

        // Clear repair form
        setRepairMileage("");
        setRepairServiceCentre("");
        setRepairServiceNumber("");
        setRepairServiceDate("");
        setSelectedComponents([]);

        // Refresh blockchain data
        handleSearch();
      } else {
        alert(data.message || "Failed to save repair record");
      }
    } catch (error) {
      console.error("Error saving repair record:", error);
      alert("Server error while saving record");
    }
  };

  // Filter records by type
  const serviceRecordsOnly = serviceRecords.filter(
    (record) => record.recordType === "SERVICE" || !record.recordType // For backward compatibility
  );
  
  const repairRecordsOnly = serviceRecords.filter(
    (record) => record.recordType === "REPAIR"
  );

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
            <>
              {/* Service Records */}
              {serviceRecordsOnly.length > 0 && (
                <>
                  <Text style={styles.recordTypeTitle}>🔧 Service Records</Text>
                  {serviceRecordsOnly.map((record, index) => (
                    <View key={`service-${index}`} style={styles.recordCard}>
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
                  ))}
                </>
              )}

              {/* Repair Records */}
              {repairRecordsOnly.length > 0 && (
                <>
                  <Text style={styles.recordTypeTitle}>🔨 Repair Records</Text>
                  {repairRecordsOnly.map((record, index) => (
                    <View key={`repair-${index}`} style={styles.recordCard}>
                      <Text>Service No: {record.serviceNumber}</Text>
                      <Text>Mileage: {record.mileage} km</Text>
                      <Text>
                        Date:{" "}
                        {new Date(record.timestamp * 1000).toLocaleDateString()}
                      </Text>
                      <Text style={styles.componentsText}>
                        Components Replaced: {record.componentsReplaced || "N/A"}
                      </Text>
                      <Text style={styles.repairTag}>
                        🔨 Repair Record
                      </Text>
                      <Text style={styles.blockchainTag}>
                        ✔ Verified on Blockchain
                      </Text>
                    </View>
                  ))}
                </>
              )}
            </>
          )}
        </>
      )}

      {/* Tab Navigation */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === TABS.SERVICE && styles.activeTab]}
          onPress={() => setActiveTab(TABS.SERVICE)}
        >
          <Text style={[styles.tabText, activeTab === TABS.SERVICE && styles.activeTabText]}>
            🔧 Service
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === TABS.REPAIR && styles.activeTab]}
          onPress={() => setActiveTab(TABS.REPAIR)}
        >
          <Text style={[styles.tabText, activeTab === TABS.REPAIR && styles.activeTabText]}>
            🔨 Repair
          </Text>
        </TouchableOpacity>
      </View>

      {/* Show last mileage */}
      {serviceRecords.length > 0 && (
        <Text style={styles.lastMileage}>
          Last Verified Mileage: {getLastBlockchainMileage()} km
        </Text>
      )}

      {/* SERVICE TAB */}
      {activeTab === TABS.SERVICE && (
        <View style={styles.tabContent}>
          <Text style={styles.sectionTitle}>Add New Service Record</Text>

          <TextInput
            style={styles.input}
            placeholder="New Mileage (km)"
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
            <Text style={styles.buttonText}>Save Service Record</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* REPAIR TAB */}
      {activeTab === TABS.REPAIR && (
        <View style={styles.tabContent}>
          <Text style={styles.sectionTitle}>Add New Repair Record</Text>

          <TextInput
            style={styles.input}
            placeholder="Repair Mileage (km)"
            keyboardType="numeric"
            value={repairMileage}
            onChangeText={setRepairMileage}
          />

          <TouchableOpacity
            style={styles.dropdown}
            onPress={() => setRepairDropdownOpen(!repairDropdownOpen)}
          >
            <Text>{repairServiceCentre || "Select Service Centre"}</Text>
          </TouchableOpacity>

          {repairDropdownOpen &&
            SERVICE_CENTERS.map((center, index) => (
              <TouchableOpacity
                key={index}
                style={styles.option}
                onPress={() => {
                  setRepairServiceCentre(center);
                  setRepairDropdownOpen(false);
                }}
              >
                <Text>{center}</Text>
              </TouchableOpacity>
            ))}

          <TextInput
            style={styles.input}
            placeholder="Service Number"
            value={repairServiceNumber}
            onChangeText={setRepairServiceNumber}
          />

          <TextInput
            style={styles.input}
            placeholder="Service Date (YYYY-MM-DD)"
            value={repairServiceDate}
            onChangeText={setRepairServiceDate}
          />

          {/* Components Replaced Dropdown */}
          <Text style={styles.label}>Components Replaced:</Text>
          <TouchableOpacity
            style={styles.dropdown}
            onPress={() => setComponentsDropdownOpen(!componentsDropdownOpen)}
          >
            <Text>
              {selectedComponents.length > 0 
                ? selectedComponents.join(", ")
                : "Select Components"}
            </Text>
          </TouchableOpacity>

          {componentsDropdownOpen && (
            <View style={styles.optionsContainer}>
              {COMPONENTS_OPTIONS.map((component, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.option,
                    selectedComponents.includes(component) && styles.selectedOption
                  ]}
                  onPress={() => toggleComponent(component)}
                >
                  <Text style={[
                    styles.optionText,
                    selectedComponents.includes(component) && styles.selectedOptionText
                  ]}>
                    {component} {selectedComponents.includes(component) ? "✓" : ""}
                  </Text>
                </TouchableOpacity>
              ))}
              <TouchableOpacity
                style={styles.doneButton}
                onPress={() => setComponentsDropdownOpen(false)}
              >
                <Text style={styles.doneButtonText}>Done</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* Show selected components count */}
          {selectedComponents.length > 0 && (
            <Text style={styles.selectedCount}>
              {selectedComponents.length} component(s) selected
            </Text>
          )}

          <TouchableOpacity
            style={[styles.submitButton, styles.repairButton]}
            onPress={handleSaveRepair}
          >
            <Text style={styles.buttonText}>Save Repair Record</Text>
          </TouchableOpacity>
        </View>
      )}
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
  recordTypeTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginTop: 10,
    marginBottom: 5,
    color: "#4b5563",
  },
  lastMileage: {
    color: "green",
    fontWeight: "600",
    marginBottom: 10,
    marginTop: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: "#000",
    borderRadius: 6,
    padding: 12,
    marginBottom: 15,
  },
  label: {
    fontSize: 14,
    fontWeight: "500",
    marginBottom: 5,
    color: "#374151",
  },
  multilineInput: {
    minHeight: 80,
    textAlignVertical: "top",
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
  optionsContainer: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 6,
    marginBottom: 15,
    backgroundColor: "#fff",
    maxHeight: 300,
  },
  option: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  selectedOption: {
    backgroundColor: "#e6f7e6",
  },
  optionText: {
    fontSize: 14,
    color: "#333",
  },
  selectedOptionText: {
    color: "#2563eb",
    fontWeight: "600",
  },
  doneButton: {
    backgroundColor: "#2563eb",
    padding: 12,
    alignItems: "center",
    borderBottomLeftRadius: 6,
    borderBottomRightRadius: 6,
  },
  doneButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  selectedCount: {
    fontSize: 12,
    color: "#2563eb",
    marginBottom: 15,
    fontStyle: "italic",
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
  repairTag: {
    marginTop: 4,
    color: "#b45309",
    fontWeight: "600",
  },
  componentsText: {
    marginTop: 4,
    color: "#1f2937",
    fontStyle: "italic",
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
    marginBottom: 20,
  },
  repairButton: {
    backgroundColor: "#2563eb",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  tabContainer: {
    flexDirection: "row",
    marginTop: 20,
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: "center",
    backgroundColor: "#f3f4f6",
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    marginHorizontal: 2,
  },
  activeTab: {
    backgroundColor: "#2563eb",
  },
  tabText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#4b5563",
  },
  activeTabText: {
    color: "#ffffff",
  },
  tabContent: {
    marginTop: 10,
  },
});