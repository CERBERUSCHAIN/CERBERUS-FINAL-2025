import React, { useState, useEffect } from "react";
import Card from "../common/Card";
import Loader from "../common/Loader";
import PriceChart from "./PriceChart";
import { formatCurrency } from "../../utils/formatting";

interface TokenDashboardProps {
  tokenAddress?: string;
}

const TokenDashboard: React.FC<TokenDashboardProps> = ({ tokenAddress = "So11111111111111111111111111111111111111112" }) => {
  const [loading, setLoading] = useState<boolean>(true);
  const [tokenData, setTokenData] = useState<any>(null);
  const [timeframe, setTimeframe] = useState<"1h" | "24h" | "7d" | "30d" | "all">("24h");
  const [chartData, setChartData] = useState<{
    timestamps: string[];
    prices: number[];
  }>({
    timestamps: [],
    prices: []
  });

  useEffect(() => {
    // Simulate fetching token data
    const fetchTokenData = async () => {
      setLoading(true);
      
      // In a real app, this would be an API call to get token data
      setTimeout(() => {
        // Demo data - in a real app, this would come from the API
        setTokenData({
          name: tokenAddress === "So11111111111111111111111111111111111111112" ? "Solana" : "Demo Token",
          symbol: tokenAddress === "So11111111111111111111111111111111111111112" ? "SOL" : "DEMO",
          price: 23.45,
          marketCap: 9823000000,
          volume24h: 754300000,
          circulatingSupply: 419000000,
          priceChange24h: 2.35,
          high24h: 24.12,
          low24h: 22.87,
          address: tokenAddress
        });

        // Demo chart data - in a real app, this would come from the API
        const now = new Date();
        const timestamps = [];
        const prices = [];
        const basePrice = 23.0;
        
        // Generate 24 hours of price data
        for (let i = 0; i < 24; i++) {
          const time = new Date(now);
          time.setHours(now.getHours() - 24 + i);
          timestamps.push(time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
          
          // Create somewhat realistic price fluctuations
          const randomFactor = Math.random() * 0.1 - 0.05; // -5% to +5%
          const pricePoint = basePrice * (1 + randomFactor) + i * 0.02;
          prices.push(Number(pricePoint.toFixed(2)));
        }
        
        setChartData({
          timestamps,
          prices
        });
        
        setLoading(false);
      }, 1500);
    };

    fetchTokenData();
  }, [tokenAddress, timeframe]);

  const handleTimeframeChange = (newTimeframe: "1h" | "24h" | "7d" | "30d" | "all") => {
    setTimeframe(newTimeframe);
  };

  return (
    <div className="token-dashboard">
      {loading ? (
        <Card>
          <div className="loading-container">
            <Loader size="large" />
            <p>Loading token data...</p>
          </div>
        </Card>
      ) : (
        <>
          <Card>
            <div className="token-header">
              <div className="token-info">
                <h2>{tokenData.name} ({tokenData.symbol})</h2>
                <div className="token-price-container">
                  <div className="token-price">{formatCurrency(tokenData.price)}</div>
                  <div className={`token-price-change ${tokenData.priceChange24h >= 0 ? 'positive' : 'negative'}`}>
                    {tokenData.priceChange24h >= 0 ? '+' : ''}{tokenData.priceChange24h.toFixed(2)}%
                  </div>
                </div>
              </div>
            </div>
            
            <div className="token-metrics">
              <div className="metric">
                <span className="metric-label">Market Cap</span>
                <span className="metric-value">{formatCurrency(tokenData.marketCap)}</span>
              </div>
              <div className="metric">
                <span className="metric-label">24h Volume</span>
                <span className="metric-value">{formatCurrency(tokenData.volume24h)}</span>
              </div>
              <div className="metric">
                <span className="metric-label">24h High</span>
                <span className="metric-value">{formatCurrency(tokenData.high24h)}</span>
              </div>
              <div className="metric">
                <span className="metric-label">24h Low</span>
                <span className="metric-value">{formatCurrency(tokenData.low24h)}</span>
              </div>
            </div>
          </Card>
          
          <Card>
            <div className="chart-header">
              <h3>Price Chart</h3>
              <div className="timeframe-selector">
                <button 
                  className={`timeframe-btn ${timeframe === '1h' ? 'active' : ''}`}
                  onClick={() => handleTimeframeChange('1h')}
                >
                  1H
                </button>
                <button 
                  className={`timeframe-btn ${timeframe === '24h' ? 'active' : ''}`}
                  onClick={() => handleTimeframeChange('24h')}
                >
                  24H
                </button>
                <button 
                  className={`timeframe-btn ${timeframe === '7d' ? 'active' : ''}`}
                  onClick={() => handleTimeframeChange('7d')}
                >
                  7D
                </button>
                <button 
                  className={`timeframe-btn ${timeframe === '30d' ? 'active' : ''}`}
                  onClick={() => handleTimeframeChange('30d')}
                >
                  30D
                </button>
                <button 
                  className={`timeframe-btn ${timeframe === 'all' ? 'active' : ''}`}
                  onClick={() => handleTimeframeChange('all')}
                >
                  ALL
                </button>
              </div>
            </div>
            
            <div className="chart-container">
              {chartData.prices.length > 0 ? (
                <PriceChart 
                  data={chartData} 
                  timeframe={timeframe} 
                  height={400}
                />
              ) : (
                <div className="no-data-message">
                  No price data available
                </div>
              )}
            </div>
          </Card>
          
          <Card>
            <h3>Token Details</h3>
            <div className="token-details">
              <div className="detail-row">
                <span className="detail-label">Token Address</span>
                <span className="detail-value address">{tokenData.address}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Circulating Supply</span>
                <span className="detail-value">{tokenData.circulatingSupply.toLocaleString()}</span>
              </div>
            </div>
            
            <div className="token-actions">
              <button className="btn btn-primary">Buy Token</button>
              <button className="btn btn-outline">Add to Watchlist</button>
            </div>
          </Card>
        </>
      )}
    </div>
  );
};

export default TokenDashboard;
