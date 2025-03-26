const hre = require("hardhat");
const fs = require("fs");
const path = require("path");

async function main() {
  const [deployer] = await hre.ethers.getSigners();

  console.log("Deploying contracts with account:", deployer.address);

  // Deploy ClickToken med navn og symbol
  const ClickToken = await hre.ethers.getContractFactory("ClickToken");
  const clickToken = await ClickToken.deploy("ClickToken", "CLICK");
  console.log("ClickToken deployed to:", clickToken.target);

  // Deploy ClickFaucet med ClickToken sin adresse
  const ClickFaucet = await hre.ethers.getContractFactory("ClickFaucet");
  const clickFaucet = await ClickFaucet.deploy(clickToken.target);
  console.log("ClickFaucet deployed to:", clickFaucet.target);

  // Send 1000 CLICK tokens til faucet
  const amount = hre.ethers.parseUnits("1000", 18);
  const tx = await clickToken.transfer(clickFaucet.target, amount);
  await tx.wait();
  console.log("1000 CLICK tokens sent to faucet");

  // Lagre adresser i JSON-fil
  const addresses = {
    token: clickToken.target,
    faucet: clickFaucet.target,
  };

  const outputPath = path.join(__dirname, "../contractAddresses/addresses.json");
  fs.writeFileSync(outputPath, JSON.stringify(addresses, null, 2));
  console.log("Contract addresses saved to addresses.json");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
