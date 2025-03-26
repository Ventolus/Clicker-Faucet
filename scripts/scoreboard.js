const loadContract = require("./loadContract");

async function main() {
  const { game } = await loadContract();
  const [addresses, scores] = await game.getTopPlayers();

  console.log("🏆 Scoreboard:");
  for (let i = 0; i < addresses.length; i++) {
    if (Number(scores[i]) === 0) continue;
    console.log(`${i + 1}: ${addresses[i]} -> ${Number(scores[i])} clicks`);
  }
}

main().catch(console.error);
