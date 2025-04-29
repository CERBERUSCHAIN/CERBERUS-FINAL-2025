import React, { useState, useEffect } from "react";
import axios from "axios";
import { BarChart2, Settings, Zap, Activity, ArrowUpDown, Wallet, Eye, Database, MessageCircle } from "lucide-react";
import { DashboardTab } from "./tabs/DashboardTab";
import { BotTabs } from "./bots/BotTabs"; // Fix import path

const CerberusDashboard = (): JSX.Element => {
  // State definitions
  const [activeTab, setActiveTab] = useState<string>("dashboard");
  const [activeBotTab, setActiveBotTab] = useState<string>("volume");
  const [currentDateTime, setCurrentDateTime] = useState<string>("2025-04-29 19:38:26");
  const [solPrice, setSolPrice] = useState<number>(198.42);
  const [sol24hChange, setSol24hChange] = useState<number>(5.2);
  const [solMarketCap, setSolMarketCap] = useState<number>(84500000000);
  const [solVolume, setSolVolume] = useState<number>(3250000000);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [walletBalance, setWalletBalance] = useState<number>(14.35);
  const [tokenHolders, setTokenHolders] = useState<number>(2845);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [totalPortfolioValue, setTotalPortfolioValue] = useState<number>(0);
  
  // Mock data
  const [tokens, setTokens] = useState([
    {
      name: "Solana",
      symbol: "SOL",
      price: 198.42,
      change: 5.2,
      marketCap: 84500000000,
      volume: 3250000000
    },
    {
      name: "Cerberus",
      symbol: "CBRS",
      price: 0.012,
      change: 12.5,
      marketCap: 1200000,
      volume: 450000
    }
  ]);
  
  const [wallets, setWallets] = useState([
    {
      name: "Main Wallet",
      address: "CRBSg5j7....HNmUa",
      tokens: [
        { symbol: "SOL", balance: 14.35, dollarValue: 2847.32 },
        { symbol: "CBRS", balance: 25000, dollarValue: 300 }
      ]
    }
  ]);
  
  const [botTransactions, setBotTransactions] = useState([
    {
      type: "buy",
      bot: "bundle",
      timestamp: "2025-04-29 15:32:14",
      user: "CERBERUSCHAIN"
    }
  ]);
  
  // Bot states
  const [activeBots, setActiveBots] = useState({
    volume: true,
    bundle: false,
    sniper: true,
    bump: false
  });
  
  // Navigation components
  const NavSection = ({ title, children }) => (
    <div className="px-4 py-2">
      <div className="text-xs uppercase tracking-wider text-zinc-500 mb-2">{title}</div>
      <div className="space-y-1">{children}</div>
    </div>
  );
  
  const NavItem = ({ icon, text, active = false, onClick }) => (
    <div
      className={`flex items-center px-3 py-2 rounded-md cursor-pointer ${
        active ? "bg-purple-900/30 text-purple-400" : "text-zinc-400 hover:bg-zinc-900 hover:text-zinc-300"
      }`}
      onClick={onClick}
    >
      <div className="mr-3">{icon}</div>
      <div className="text-sm">{text}</div>
    </div>
  );

  // Function to render content based on active tab
  const renderTabContent = () => {
    switch (activeTab) {
      case "dashboard":
        return (
          <DashboardTab 
            currentDateTime={currentDateTime}
            walletBalance={walletBalance}
            solPrice={solPrice}
            sol24hChange={sol24hChange}
            activeBots={activeBots}
            tokenHolders={tokenHolders}
            totalPortfolioValue={totalPortfolioValue}
            tokens={tokens}
            wallets={wallets}
            botTransactions={botTransactions}
          />
        );
        
      case "bots":
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-2xl font-bold text-white">Trading Bots</h1>
            </div>
            <BotTabs activeBot={activeBotTab} setActiveBot={setActiveBotTab} />
          </div>
        );
        
      case "market":
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-2xl font-bold text-white">Market Analysis</h1>
            </div>
            <div className="text-center py-12">
              <div className="text-lg text-zinc-500">Coming soon</div>
            </div>
          </div>
        );
        
      case "wallet-manager":
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-2xl font-bold text-white">Wallet Manager</h1>
            </div>
            <div className="text-center py-12">
              <div className="text-lg text-zinc-500">Coming soon</div>
            </div>
          </div>
        );
          
      default:
        return (
          <div className="text-center py-12">
            <div className="text-lg text-zinc-500">This feature is coming soon</div>
          </div>
        );
    }
  };

  return (
    <div className="flex h-screen bg-black text-white overflow-hidden">
      {/* Left Sidebar */}
      <div className="w-64 bg-zinc-950 border-r border-purple-900/30 flex flex-col">
        <div className="p-4 border-b border-purple-900/30 flex items-center">
          <div className="text-xl font-semibold text-white">CERBERUS</div>
        </div>
        
        <div className="flex-1 overflow-y-auto py-4">
          <NavSection title="Monitoring">
            <NavItem 
              icon={<BarChart2 size={18} />} 
              text="Dashboard" 
              active={activeTab === "dashboard"}
              onClick={() => setActiveTab("dashboard")} 
            />
            <NavItem 
              icon={<Zap size={18} />} 
              text="Trading Bots" 
              active={activeTab === "bots"}
              onClick={() => setActiveTab("bots")} 
            />
            <NavItem 
              icon={<Activity size={18} />} 
              text="Market Analysis" 
              active={activeTab === "market"}
              onClick={() => setActiveTab("market")} 
            />
          </NavSection>
          
          <NavSection title="Management">
            <NavItem 
              icon={<Wallet size={18} />} 
              text="Wallet Manager" 
              active={activeTab === "wallet-manager"}
              onClick={() => setActiveTab("wallet-manager")} 
            />
            <NavItem 
              icon={<ArrowUpDown size={18} />} 
              text="Transactions" 
            />
          </NavSection>
          
          <NavSection title="System">
            <NavItem 
              icon={<Database size={18} />} 
              text="Logs" 
            />
            <NavItem 
              icon={<MessageCircle size={18} />} 
              text="Notifications" 
            />
            <NavItem 
              icon={<Settings size={18} />} 
              text="Settings" 
            />
            <NavItem 
              icon={<Eye size={18} />} 
              text="API Keys" 
            />
          </NavSection>
        </div>
        
        <div className="p-4 border-t border-purple-900/30">
          <div className="flex items-center">
            <div className="w-8 h-8 rounded-full bg-purple-700 flex items-center justify-center text-sm font-medium">C</div>
            <div className="ml-3">
              <div className="text-sm font-medium text-white">CERBERUSCHAIN</div>
              <div className="text-xs text-zinc-500">Admin</div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="flex-1 overflow-auto p-6 bg-black">
          <div className="bg-zinc-950 rounded-lg border border-purple-900/30 p-6">
            {renderTabContent()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CerberusDashboard;