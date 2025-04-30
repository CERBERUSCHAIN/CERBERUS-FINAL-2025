import React, { useState, useEffect } from "react";
import { HeliusService } from "../../services/heliusService";

const WalletManager = () => {
  const [walletAddress, setWalletAddress] = useState<string>("");
  const [balances, setBalances] = useState<any>(null);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const fetchWalletData = async () => {
    if (!walletAddress) return;
    setLoading(true);

    try {
      const walletBalances = await HeliusService.getWalletBalances(
        walletAddress
      );
      const walletTransactions = await HeliusService.getTransactionHistory(
        walletAddress
      );

      setBalances(walletBalances);
      setTransactions(walletTransactions);
    } catch (error) {
      console.error("Error fetching wallet data:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="wallet-manager">
      <h1>Wallet Manager</h1>
      <input
        type="text"
        placeholder="Enter Wallet Address"
        value={walletAddress}
        onChange={(e) => setWalletAddress(e.target.value)}
      />
      <button onClick={fetchWalletData} disabled={loading}>
        {loading ? "Loading..." : "Fetch Wallet Data"}
      </button>

      {balances && (
        <div>
          <h2>Balances</h2>
          <pre>{JSON.stringify(balances, null, 2)}</pre>
        </div>
      )}

      {transactions.length > 0 && (
        <div>
          <h2>Transactions</h2>
          <ul>
            {transactions.map((tx, idx) => (
              <li key={idx}>{JSON.stringify(tx)}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default WalletManager;