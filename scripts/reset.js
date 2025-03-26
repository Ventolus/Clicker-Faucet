const loadContract = require("./loadContract");

async function main() {
  const { game, signer } = await loadContract();
  const tx = await game.resetScore();
  await tx.wait();
  console.log(`🔄 Score reset for ${signer.address}`);
}

main().catch(console.error);
