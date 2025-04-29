import React, { useState } from "react";
import Card from "../components/common/Card";
import WalletService from "../services/wallet";
import { truncateAddress } from "../utils/formatting";

const WalletManagement: React.FC = () => {
  const [walletAddress, setWalletAddress] = useState<string>("");
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [walletData, setWalletData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  
  const handleConnect = async () => {
    // In a real app, this would use a wallet adapter to connect
    setIsConnected(true);
    setWalletAddress("GkwFkToSJLVdyWrJ1ENyAZZR7gS4Gx6tpUbXHZhEZ5qz"); // Example address
  };
  
  const handleLoadWalletData = async () => {
    if (!walletAddress) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      // In a real app, this would fetch actual wallet data
      // For now we'll just simulate the functionality
      setTimeout(() => {
        setWalletData({
          solBalance: 12.34,
          tokens: [
            { symbol: "SOL", balance: 12.34, usdValue: 293.71 },
            { symbol: "BONK", balance: 1000000, usdValue: 25.43 },
            { symbol: "RAY", balance: 45.67, usdValue: 37.89 }
          ]
        });
        setIsLoading(false);
      }, 1500);
    } catch (err) {
      setError("Failed to load wallet data. Please try again.");
      setIsLoading(false);
    }
  };
  
  return (
    <div className="wallet-management-container">
      <h1>Wallet Management</h1>
      
      <Card>
        <h2>Connect Your Wallet</h2>
        {!isConnected ? (
          <div className="wallet-connect">
            <p>Connect your Solana wallet to manage your assets.</p>
            <button className="btn btn-primary" onClick={handleConnect}>
              Connect Wallet
            </button>
          </div>
        ) : (
          <div className="wallet-connected">
            <p>Wallet Connected: {truncateAddress(walletAddress)}</p>
            <button className="btn btn-outline" onClick={() => setIsConnected(false)}>
              Disconnect
            </button>
          </div>
        )}
      </Card>
      
      {isConnected && (
        <>
          <Card className="wallet-details">
            <h2>Wallet Details</h2>
            {error && <div className="error-message">{error}</div>}
            
            {!walletData ? (
              <button 
                className="btn btn-primary" 
                onClick={handleLoadWalletData} 
                disabled={isLoading}
              >
                {isLoading ? "Loading..." : "Load Wallet Data"}
              </button>
            ) : (
              <div className="wallet-data">
                <div className="sol-balance">
                  <h3>SOL Balance</h3>
                  <p className="balance">{walletData.solBalance} SOL</p>
                </div>
                
                <div className="token-list">
                  <h3>Tokens</h3>
                  <table>
                    <thead>
                      <tr>
                        <th>Token</th>
                        <th>Balance</th>
                        <th>USD Value</th>
                      </tr>
                    </thead>
                    <tbody>
                      {walletData.tokens.map((token: any, index: number) => (
                        <tr key={index}>
                          <td>{token.symbol}</td>
                          <td>{token.balance}</td>
                          <td>${token.usdValue.toFixed(2)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </Card>
        </>
      )}
    </div>
  );
};

export default WalletManagement;
