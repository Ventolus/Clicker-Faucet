const loadContract = require("./loadContract");

async function main() {
    const { game, signer } = await loadContract();
    const address = await signer.getAddress();
    const clicks = await game.getClicks(address);
    console.log(`✅ ${address} has ${clicks} clicks.`);
}

main().catch(console.error);
