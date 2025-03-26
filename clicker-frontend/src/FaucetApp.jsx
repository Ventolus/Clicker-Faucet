import { useEffect, useState } from "react";
import { ethers } from "ethers";
import FaucetABI from "./ClickFaucetABI.json"; // ✅ correct based on your structure

import contractAddress from "./contractAddress.json"; // place this above
const CONTRACT_ADDRESS = contractAddress.ClickFaucet; // ✅ update key name if needed


export default function FaucetApp() {
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [faucet, setFaucet] = useState(null);
  const [address, setAddress] = useState("");
  const [canClaim, setCanClaim] = useState(false);
  const [nextClaimTime, setNextClaimTime] = useState(null);
  const [countdown, setCountdown] = useState("");
  const [loading, setLoading] = useState(false);

  // STEP 1: Connect Wallet
  const connectWallet = async () => {
    const ethProvider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = ethProvider.getSigner();
    const addr = await signer.getAddress();
    const contract = new ethers.Contract(CONTRACT_ADDRESS, FaucetABI, signer);

    setProvider(ethProvider);
    setSigner(signer);
    setFaucet(contract);
    setAddress(addr);
  };

  // STEP 2: Check Claim Status
  const updateClaimInfo = async () => {
    if (!faucet || !address) return;
    const isClaimable = await faucet.canClaim(address);
    const nextTimestamp = await faucet.nextClaimTimestamp(address);
    setCanClaim(isClaimable);
    setNextClaimTime(nextTimestamp.toNumber());
  };

  // STEP 3: Claim Tokens
  const claimTokens = async () => {
    try {
      setLoading(true);
      const tx = await faucet.claim();
      await tx.wait();
      alert("✅ Tokens claimed!");
    } catch (err) {
      alert("❌ Claim failed");
      console.error(err);
    } finally {
      setLoading(false);
      updateClaimInfo();
    }
  };

  // STEP 4: Countdown Timer
  useEffect(() => {
    if (!nextClaimTime) return;
    const interval = setInterval(() => {
      const now = Math.floor(Date.now() / 1000);
      const secs = nextClaimTime - now;
      if (secs <= 0) {
        setCountdown("Ready to claim!");
        setCanClaim(true);
        clearInterval(interval);
      } else {
        const m = Math.floor(secs / 60);
        const s = secs % 60;
        setCountdown(`${m}m ${s}s until next claim`);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [nextClaimTime]);

  useEffect(() => {
    connectWallet();
  }, []);

  useEffect(() => {
    updateClaimInfo();
  }, [faucet, address]);

  return (
    <div style={{ padding: "20px" }}>
      <h2>🧴 Click Faucet</h2>
      <p><strong>Wallet:</strong> {address}</p>
      <p><strong>Status:</strong> {canClaim ? "✅ Ready to claim" : countdown}</p>

      <button onClick={claimTokens} disabled={!canClaim || loading}>
        {loading ? "Claiming..." : "Claim Tokens"}
      </button>
    </div>
  );
}
