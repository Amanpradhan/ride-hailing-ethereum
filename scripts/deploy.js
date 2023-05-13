const hre = require("hardhat");

async function main() {
  const RideHailing = await hre.ethers.getContractFactory("RideHailing");
  const rideHailing = await RideHailing.deploy();
  await rideHailing.deployed();
  console.log("RideHailing deployed to:", rideHailing.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
