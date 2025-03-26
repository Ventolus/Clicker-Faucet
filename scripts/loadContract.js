const hre = require("hardhat");
const fs = require("fs");
const path = require("path");

async function loadContract() {
  const [signer] = await hre.ethers.getSigners();

  const filePath = path.join(__dirname, "../contractAddress.json");
  const { address } = JSON.parse(fs.readFileSync(filePath, "utf8"));

  const ClickerGame = await hre.ethers.getContractFactory("ClickerGame");
  const game = await ClickerGame.attach(address);

  return { game, signer };
}

module.exports = loadContract;
