const { ethers } = require("hardhat");

async function main() {
  const tokenAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
  const faucetAddress = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512";

  const [deployer] = await ethers.getSigners();
  const token = await ethers.getContractAt("ClickToken", tokenAddress);

  const tx = await token.transfer(faucetAddress, ethers.parseEther("1000"));
  await tx.wait();

  console.log(`✅ Sent 1000 CLICK tokens to faucet at ${faucetAddress}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
