import React, { useEffect, useState } from "react";
import { BrowserProvider, Contract, formatUnits } from "ethers";
import faucetABI from "./ClickFaucetABI.json";
import tokenABI from "./ClickTokenABI.json";
import addresses from "./clickAddresses.json";

function App() {
  const [status, setStatus] = useState("🟡 Connecting...");
  const [address, setAddress] = useState("");
  const [balance, setBalance] = useState("0.0");
  const [loading, setLoading] = useState(false);
  const [faucet, setFaucet] = useState(null);
  const [token, setToken] = useState(null);
  const [nextClaimTime, setNextClaimTime] = useState(null);
  const [countdown, setCountdown] = useState("");

  useEffect(() => {
    const init = async () => {
      if (!window.ethereum) {
        setStatus("🦊 MetaMask not installed");
        return;
      }

      try {
        await window.ethereum.request({ method: "eth_requestAccounts" });
        const provider = new BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        const userAddress = await signer.getAddress();

        setAddress(userAddress);
        setStatus("✅ Connected");

        const tokenContract = new Contract(addresses.token, tokenABI, signer);
        const faucetContract = new Contract(addresses.faucet, faucetABI, signer);
        setToken(tokenContract);
        setFaucet(faucetContract);

        const rawBalance = await tokenContract.balanceOf(userAddress);
        setBalance(formatUnits(rawBalance, 18));

        const next = await faucetContract.nextClaimTimestamp(userAddress);
        console.log("📅 Next claim timestamp:", next.toString());
        console.log("⏰ Now (timestamp):", Math.floor(Date.now() / 1000));
        setNextClaimTime(Number(next));
      } catch (err) {
        console.error("Connection error:", err);
        setStatus("❌ Failed to connect");
      }
    };

    init();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      if (!nextClaimTime) return;

      const now = Math.floor(Date.now() / 1000);
      const secondsLeft = nextClaimTime - now;

      if (secondsLeft > 0) {
        const minutes = Math.floor(secondsLeft / 60);
        const seconds = secondsLeft % 60;
        setCountdown(`${minutes}m ${seconds < 10 ? "0" : ""}${seconds}s`);
      } else {
        setCountdown("");
        setNextClaimTime(null);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [nextClaimTime]);

  const handleClaim = async () => {
    if (!faucet || !token) return;
    setLoading(true);

    try {
      const tx = await faucet.claim();
      await tx.wait();

      const rawBalance = await token.balanceOf(address);
      setBalance(formatUnits(rawBalance, 18));

      const next = await faucet.nextClaimTimestamp(address);
      console.log("📅 Next claim timestamp (after claim):", next.toString());
      setNextClaimTime(Number(next));

      alert("✅ You claimed 5 CLICK!");
    } catch (err) {
      console.error("Claim failed:", err);
      alert("⚠️ Claim failed – maybe already claimed?");
    }

    setLoading(false);
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.title}>💧 Click Faucet</h1>
        <p style={styles.status}>Status: <span>{status}</span></p>

        {address && (
          <>
            <p style={styles.label}>Address:</p>
            <p style={styles.value}>{address.slice(0, 6)}...{address.slice(-4)}</p>

            <p style={styles.label}>CLICK Balance:</p>
            <p style={styles.value}>{balance} CLICK</p>

            {countdown ? (
              <p style={{ color: "#bbb", marginTop: "1.5rem", fontSize: "1rem" }}>
                ⏳ Wait: {countdown}
              </p>
            ) : (
              <button
                style={styles.button}
                onClick={handleClaim}
                disabled={loading}
              >
                {loading ? "Claiming..." : "💧 Claim 5 CLICK"}
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: "100vh",
    backgroundColor: "#0e0e0e",
    color: "#eee",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontFamily: "Segoe UI, sans-serif",
  },
  card: {
    backgroundColor: "#1c1c1c",
    padding: "2rem 3rem",
    borderRadius: "12px",
    boxShadow: "0 0 12px rgba(255, 255, 255, 0.05)",
    textAlign: "center",
    width: "350px",
  },
  title: {
    fontSize: "1.8rem",
    marginBottom: "1.5rem",
    color: "#0f62fe",
  },
  status: {
    marginBottom: "1.2rem",
    fontSize: "0.95rem",
  },
  label: {
    marginTop: "1.2rem",
    fontSize: "0.9rem",
    color: "#aaa",
  },
  value: {
    fontSize: "1rem",
    marginBottom: "0.5rem",
    wordBreak: "break-all",
  },
  button: {
    marginTop: "1.5rem",
    padding: "12px 20px",
    fontSize: "1rem",
    backgroundColor: "#0f62fe",
    border: "none",
    borderRadius: "6px",
    color: "#fff",
    cursor: "pointer",
    transition: "background 0.3s ease",
  },
};

export default App;
