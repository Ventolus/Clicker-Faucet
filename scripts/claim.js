const hre = require("hardhat");
const fs = require("fs");
const path = require("path");

async function main() {
  const [claimer] = await hre.ethers.getSigners();
  const addresses = require("../contractAddresses/addresses.json");

  const faucet = await hre.ethers.getContractAt("ClickFaucet", addresses.faucet);
  const token = await hre.ethers.getContractAt("ClickToken", addresses.token);

  // Hent 5 CLICK fra faucet
  const tx = await faucet.claim();
  await tx.wait();
  console.log("Claimed 5 CLICK!");

  // Vis saldo
  const balance = await token.balanceOf(claimer.address);
  console.log("New balance:", hre.ethers.formatUnits(balance, 18), "CLICK");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
