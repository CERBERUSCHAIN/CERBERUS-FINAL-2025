import React, { useState, useEffect } from "react";
import Card from "../components/common/Card";
import Loader from "../components/common/Loader";
import TokenDashboard from "../components/dashboard/TokenDashboard";
import HeliusService from "../services/helius";

const Dashboard: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [solPrice, setSolPrice] = useState<number | null>(null);
  const [change24h, setChange24h] = useState<number | null>(null);
  const [marketCap, setMarketCap] = useState<number | null>(null);

  useEffect(() => {
    const fetchSolanaData = async () => {
      try {
        setLoading(true);
        // This would be replaced with actual API call
        // const solData = await HeliusService.getSolanaPrice();
        
        // Simulate API response
        setTimeout(() => {
          setSolPrice(23.45);
          setChange24h(2.35);
          setMarketCap(9823000000);
          setLoading(false);
        }, 1500);
      } catch (error) {
        console.error("Error fetching Solana data:", error);
        setLoading(false);
      }
    };

    fetchSolanaData();
    // Set up an interval to refresh data every minute
    const interval = setInterval(fetchSolanaData, 60000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="dashboard-container">
      <h1>Dashboard</h1>
      
      <div className="market-overview">
        <h2>Market Overview</h2>
        <div className="card-grid">
          <Card title="SOL Price">
            {loading ? (
              <Loader />
            ) : (
              <div className="price-info">
                <span className="price">${solPrice?.toFixed(2) || "-.--"}</span>
                {change24h !== null && (
                  <span className={`change ${change24h >= 0 ? "positive" : "negative"}`}>
                    {change24h >= 0 ? "+" : ""}{change24h.toFixed(2)}%
                  </span>
                )}
              </div>
            )}
          </Card>
          
          <Card title="Market Cap">
            {loading ? (
              <Loader />
            ) : (
              <div className="market-cap">
                ${marketCap ? (marketCap / 1000000000).toFixed(2) + "B" : "-.--"}
              </div>
            )}
          </Card>
          
          <Card title="Your Portfolio">
            <p>Connect your wallet to view your portfolio</p>
            <button className="btn btn-primary">Connect Wallet</button>
          </Card>
        </div>
      </div>
      
      {/* Add Token Dashboard component */}
      <h2>Token Dashboard</h2>
      <TokenDashboard tokenAddress="So11111111111111111111111111111111111111112" />
      
      <div className="token-creation-section">
        <h2>Token Creation</h2>
        <Card>
          <p>Create your own Solana token with advanced customization options</p>
          <button className="btn btn-primary">Create New Token</button>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
