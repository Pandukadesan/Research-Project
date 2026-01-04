import hre from "hardhat";

async function main() {
  // Get the contract factory
  const MileageLedger = await hre.ethers.getContractFactory("MileageLedger");

  // Deploy the contract
  const contract = await MileageLedger.deploy();

  await contract.deployed();

  console.log("MileageLedger deployed at:", contract.address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
