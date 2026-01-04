const hre = require("hardhat");

async function main() {
  // Get the contract factory
  const MileageLedgerFactory = await hre.ethers.getContractFactory("MileageLedger");

  // Deploy the contract
  const contract = await MileageLedgerFactory.deploy(); // await deploy() directly
  await contract.waitForDeployment(); // <-- ethers v6

  console.log("MileageLedger deployed at:", await contract.getAddress());
}

// Run the script
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
