const loadContract = require("./loadContract");

async function main() {
  const { game, signer } = await loadContract();
  const tx = await game.startGame();
  await tx.wait();
  console.log("🎮 Game started for:", signer.address);
}

main().catch(console.error);
