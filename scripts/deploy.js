const hre = require("hardhat");

async function main() {
  const ClickerGame = await hre.ethers.getContractFactory("ClickerGame");
  const game = await ClickerGame.deploy();

  await game.waitForDeployment();

  console.log("ClickerGame deployed to:", game.target);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
