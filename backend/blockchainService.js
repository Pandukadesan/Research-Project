const { ethers } = require("ethers");
const abi = require("./MileageLedgerABI.json"); // Make sure ABI is exported

// Hardhat local node
const provider = new ethers.JsonRpcProvider("http://127.0.0.1:8545");

// Use Hardhat Account #0 private key
const wallet = new ethers.Wallet(
  "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80", // replace with one from npx hardhat node
  provider
);

// Deployed contract address
const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3"; // replace

const contract = new ethers.Contract(contractAddress, abi, wallet);

// 🔹 Get total number of records
async function getRecordCount() {
  const count = await contract.getRecordCount();
  return Number(count);
}

// 🔹 Get a single record by index
async function getRecordByIndex(index) {
  const r = await contract.records(index);

  return {
    engineNumber: r.engineNumber,
    chassisNumber: r.chassisNumber,
    serviceNumber: r.serviceNumber,
    mileage: Number(r.mileage),
    timestamp: Number(r.timestamp)
  };
}

// 🔹 Get all records (used for filtering)
async function getAllMileageRecords() {
  const count = await getRecordCount();
  const records = [];

  for (let i = 0; i < count; i++) {
    records.push(await getRecordByIndex(i));
  }

  return records;
}

// Function to store mileage on blockchain
async function storeMileage(engineNumber, chassisNumber, serviceNumber, mileage) {
  const tx = await contract.storeMileage(
    engineNumber,
    chassisNumber,
    serviceNumber,
    mileage
  );
  await tx.wait();
  return tx.hash;
}

module.exports = {
  storeMileage,
  getRecordCount,
  getRecordByIndex,
  getAllMileageRecords
};

