# 💧 Click Faucet dApp

A minimal decentralized application (dApp) that lets users claim free `CLICK` tokens once per day. Built with **Solidity**, **Hardhat**, and a **React (Vite)** frontend using **Ethers.js**.

---

## ✨ Features

- 🧪 Deploys an ERC20 token (`ClickToken`)
- 🚰 Faucet allows daily claims of 5 `CLICK`
- ⏳ Cooldown timer prevents re-claiming before 24 hours
- 🔐 MetaMask integration (wallet connect)
- 🔄 Smart contract + frontend auto-sync via `addresses.json`
- ⚙️ Simple interface for testing and demos

---

## 🧰 Tech Stack

- [Hardhat](https://hardhat.org/) – Smart contract development
- [OpenZeppelin](https://docs.openzeppelin.com/contracts) – Secure token & access control
- [React + Vite](https://vitejs.dev/) – Frontend
- [Ethers.js](https://docs.ethers.org/) – Web3 interaction

---

## 🚀 Getting Started

### 1. Clone & install
```bash
git clone https://github.com/Ventolus/Clicker-Faucet.git
cd Clicker-Faucet
npm install

2. Start local Hardhat node

npx hardhat node

3. Deploy contracts

npx hardhat run scripts/deployTokenAndFaucet.js --network localhost

4. Start the frontend

cd clicker-frontend
npm install
npm run dev



🧪 Contracts

    ClickToken.sol: ERC20 token contract

    ClickFaucet.sol: Faucet logic with 24h cooldown

    Exposes claim(), nextClaimTimestamp(address) and admin functions


contracts/             ← Solidity smart contracts
scripts/               ← Hardhat deployment and test scripts
contractAddresses/     ← Auto-generated address map (used by frontend)
clicker-frontend/      ← Vite + React frontend



🧠 License

MIT © 2024 @Ventolus


---

### ✅ How to use:

1. Save this to your project root as `README.md`
2. Run:
```bash
git add README.md
git commit -m "Add project README"
git push
