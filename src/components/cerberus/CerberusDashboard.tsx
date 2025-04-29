import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Settings, RefreshCw, Sliders, Database, Download,
  AlertTriangle, Check, Info, Wallet, BarChart,
  Eye, Zap, BarChart2, Activity, ArrowUpDown, ChevronRight,
  PlusCircle, TrendingUp, LineChart, X, DollarSign, Search,
  Target
} from "lucide-react";

// Set current values
const CURRENT_DATE = "2025-04-29 03:45:12";
const CURRENT_USER = "CERBERUSCHAIN";

// Helius API key
const HELIUS_API_KEY = "db301f63-f32f-4dc2-8145-854177455291";
const HELIUS_RPC = `https://katy-i0vx58-fast-mainnet.helius-rpc.com/?api-key=${HELIUS_API_KEY}`;

// Discord webhook
const DISCORD_WEBHOOK = "https://discord.com/api/webhooks/1366201027745026048/WChs30CoYOXhtP17XvaxYXv0ZspW3P-4tdFAAUo4ON-Z64VPfOQEaKnRoF8LMrgxLhXb";

// Define our transaction type
interface BotTransaction {
  type: string;
  bot: string;
  timestamp: string;
  user: string;
}

// Define Discord notification payload type
interface DiscordPayload {
  content: string;
  embeds?: Array<{
    title: string;
    description: string;
    color: number;
    footer?: {
      text: string;
    };
  }>;
}

interface TokenData {
  name: string;
  symbol: string;
  price: number;
  change: number;
  marketCap: number;
  volume: number;
  holders?: number;
}

interface WalletTokenData {
  symbol: string;
  balance: number;
  dollarValue: number;
}

interface WalletData {
  name: string;
  address: string;
  tokens: WalletTokenData[];
}

interface BotSettings {
  enabled: boolean;
  riskLevel: string;
  maxAmount: number;
  autoTrade: boolean;
}

const CerberusDashboard = (): JSX.Element => {
  const [activeTab, setActiveTab] = useState<string>("dashboard");
  const [activeBotTab, setActiveBotTab] = useState<string>("volume");
  const [currentDateTime, setCurrentDateTime] = useState<string>(CURRENT_DATE);
  const [solPrice, setSolPrice] = useState<number>(0);
  const [sol24hChange, setSol24hChange] = useState<number>(0);
  const [solMarketCap, setSolMarketCap] = useState<number>(0);
  const [solVolume, setSolVolume] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [walletBalance, setWalletBalance] = useState<number>(0);
  const [tokenHolders, setTokenHolders] = useState<number>(0);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [totalPortfolioValue, setTotalPortfolioValue] = useState<number>(0);
  
  // Demo data for tokens
  const [tokens, setTokens] = useState<TokenData[]>([
    { name: "Solana", symbol: "SOL", price: 198.42, change: 5.2, marketCap: 85000000000, volume: 2800000000 },
    { name: "Jupiter", symbol: "JUP", price: 1.26, change: 3.8, marketCap: 2800000000, volume: 340000000 },
    { name: "Raydium", symbol: "RAY", price: 2.87, change: 7.2, marketCap: 750000000, volume: 120000000 },
    { name: "Cerberus", symbol: "CBRS", price: 0.000042, change: 5.8, marketCap: 42000000, volume: 3200000 }
  ]);
  
  // Demo wallet data
  const [wallets, setWallets] = useState<WalletData[]>([
    {
      name: "Main Wallet",
      address: "Cerb4kzjHMXEWjEpawTU2jietJwUjTXhrFJZnCMr4Eib",
      tokens: [
        { symbol: "SOL", balance: 12.84, dollarValue: 2547.71 },
        { symbol: "CBRS", balance: 420000, dollarValue: 17.64 },
        { symbol: "JUP", balance: 350, dollarValue: 441 },
        { symbol: "RAY", balance: 65, dollarValue: 186.55 }
      ]
    },
    {
      name: "Trading Wallet",
      address: "CerbGUytdV29CdQWddcudafqMEXzL6hvXg9CXm6Q5F9t",
      tokens: [
        { symbol: "SOL", balance: 8.32, dollarValue: 1650.85 },
        { symbol: "USDC", balance: 1200, dollarValue: 1200 }
      ]
    }
  ]);
  
  // Bot transaction history
  const [botTransactions, setBotTransactions] = useState<BotTransaction[]>([
    { type: "Buy SOL", bot: "volume", timestamp: "2025-04-28 19:45:12", user: CURRENT_USER },
    { type: "Sell JUP", bot: "bump", timestamp: "2025-04-28 18:32:07", user: CURRENT_USER },
    { type: "Bot Activated", bot: "sniper", timestamp: "2025-04-28 17:15:33", user: CURRENT_USER },
    { type: "Buy CBRS", bot: "volume", timestamp: "2025-04-28 15:22:51", user: CURRENT_USER },
    { type: "Sell RAY", bot: "bump", timestamp: "2025-04-28 12:08:19", user: CURRENT_USER }
  ]);
  
  // Bot active states
  const [activeBots, setActiveBots] = useState({
    volume: false,
    bundle: true,
    sniper: true,
    bump: false
  });
  
  // Bot settings
  const [botSettings, setBotSettings] = useState({
    volume: { enabled: false, riskLevel: "medium", maxAmount: 5, autoTrade: true },
    bundle: { enabled: true, riskLevel: "high", maxAmount: 10, autoTrade: true },
    sniper: { enabled: true, riskLevel: "medium", maxAmount: 3, autoTrade: true },
    bump: { enabled: false, riskLevel: "low", maxAmount: 2, autoTrade: false }
  });
  
  // Update time every second
  useEffect(() => {
    const timer = setInterval(() => {
      const date = new Date(currentDateTime);
      date.setSeconds(date.getSeconds() + 1);
      setCurrentDateTime(date.toISOString().slice(0, 19).replace("T", " "));
    }, 1000);
    return () => clearInterval(timer);
  }, [currentDateTime]);

  // Calculate total portfolio value
  useEffect(() => {
    let total = 0;
    wallets.forEach(wallet => {
      wallet.tokens.forEach(token => {
        total += token.dollarValue;
      });
    });
    setTotalPortfolioValue(total);
  }, [wallets]);

  // Fetch real Solana data
  useEffect(() => {
    const fetchSolanaData = async () => {
      try {
        setIsLoading(true);
        
        // Get SOL price data from CoinGecko
        const response = await axios.get(
          "https://api.coingecko.com/api/v3/coins/solana?localization=false&tickers=false&market_data=true&community_data=false&developer_data=false"
        );
        
        const marketData = response.data.market_data;
        setSolPrice(marketData.current_price.usd);
        setSol24hChange(marketData.price_change_percentage_24h);
        setSolMarketCap(marketData.market_cap.usd);
        setSolVolume(marketData.total_volume.usd);
        
        // For now, setting some values for testing
        setWalletBalance(4.78);
        setTokenHolders(1245);
        
        // Send Discord notification for successful data fetch
        sendDiscordNotification({
          content: "CERBERUS Bot data updated successfully",
          embeds: [
            {
              title: "Real-time SOL Price",
              description: `$${marketData.current_price.usd.toFixed(2)} (${marketData.price_change_percentage_24h.toFixed(2)}%)`,
              color: marketData.price_change_percentage_24h > 0 ? 3066993 : 15158332, // Green or red
              footer: {
                text: `Last Updated: ${currentDateTime}`
              }
            }
          ]
        });
        
      } catch (error: any) {
        console.error("Failed to fetch Solana data:", error);
        sendDiscordNotification({
          content: "❌ Error fetching CERBERUS Bot data",
          embeds: [
            {
              title: "Error Details",
              description: error.message || "Unknown error",
              color: 15158332 // Red
            }
          ]
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    // Uncomment this to enable real data fetching
    // fetchSolanaData();
    
    // Refresh data every 60 seconds
    // const dataInterval = setInterval(fetchSolanaData, 60000);
    // return () => clearInterval(dataInterval);
  }, [currentDateTime]);

  // Function to send notifications to Discord
  const sendDiscordNotification = async (payload: DiscordPayload): Promise<void> => {
    try {
      // Uncomment this when ready to use Discord webhook:
      /*
      await axios.post(
        DISCORD_WEBHOOK,
        payload
      );
      */
      console.log("Discord notification sent:", payload);
    } catch (error) {
      console.error("Failed to send Discord notification:", error);
    }
  };
  
  // Toggle bot status and send Discord notification
  const toggleBot = (botName: string): void => {
    const newStatus = !activeBots[botName as keyof typeof activeBots];
    
    setActiveBots({
      ...activeBots,
      [botName]: newStatus
    });
    
    // Send Discord notification
    sendDiscordNotification({
      content: `${botName.charAt(0).toUpperCase() + botName.slice(1)} Bot is now ${newStatus ? "active" : "inactive"}`,
      embeds: [
        {
          title: "Bot Status Change",
          description: `${botName.charAt(0).toUpperCase() + botName.slice(1)} Bot has been ${newStatus ? "activated" : "deactivated"}`,
          color: newStatus ? 3066993 : 15158332, // Green or red
          footer: {
            text: `Executed by ${CURRENT_USER} at ${currentDateTime}`
          }
        }
      ]
    });
    
    // Add to bot transactions
    const newTransaction: BotTransaction = {
      type: newStatus ? "Bot Activated" : "Bot Deactivated",
      bot: botName,
      timestamp: currentDateTime,
      user: CURRENT_USER
    };
    
    setBotTransactions([newTransaction, ...botTransactions]);
  };
  
  // Execute buy for a token
  const executeBuy = (symbol: string, amount: number) => {
    const newTransaction: BotTransaction = {
      type: `Buy ${symbol}`,
      bot: "manual",
      timestamp: currentDateTime,
      user: CURRENT_USER
    };
    
    setBotTransactions([newTransaction, ...botTransactions]);
    
    // Here you would handle the actual buy logic
    console.log(`Buying ${amount} ${symbol}`);
  };
  
  // Execute sell for a token
  const executeSell = (symbol: string, amount: number) => {
    const newTransaction: BotTransaction = {
      type: `Sell ${symbol}`,
      bot: "manual",
      timestamp: currentDateTime,
      user: CURRENT_USER
    };
    
    setBotTransactions([newTransaction, ...botTransactions]);
    
    // Here you would handle the actual sell logic
    console.log(`Selling ${amount} ${symbol}`);
  };
  
  // Save bot settings
  const saveBotSettings = (botType: string, settings: BotSettings) => {
    setBotSettings({
      ...botSettings,
      [botType]: settings
    });
    
    // Here you would handle the actual settings update
    console.log(`Updated settings for ${botType} bot`, settings);
  };
  
  // Custom icons for sidebar
  const MessageCircle = ({ size, className = "" }: { size: number, className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
    </svg>
  );
  
  const Users = ({ size, className = "" }: { size: number, className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
      <circle cx="9" cy="7" r="4"></circle>
      <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
      <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
    </svg>
  );
  
  // Navigation components
  const NavSection = ({ title, children }: { title: string, children: React.ReactNode }) => (
    <div className="my-2">
      <div className="px-4 py-2 text-xs text-purple-400 font-semibold">{title}</div>
      {children}
    </div>
  );
  
  const NavItem = ({ icon, text, active = false, onClick }: { 
    icon: React.ReactNode, 
    text: string, 
    active?: boolean, 
    onClick: () => void 
  }) => (
    <div
      className={`flex items-center px-4 py-3 cursor-pointer transition-all ${
        active
          ? "bg-gradient-to-r from-purple-900/30 to-pink-900/20 border-l-2 border-fuchsia-500"
          : "hover:bg-zinc-900 border-l-2 border-transparent"
      }`}
      onClick={onClick}
      role="button"
      aria-label={text}
    >
      <div className={`${active ? "text-fuchsia-400" : "text-zinc-400"} mr-3`}>{icon}</div>
      <div className={`${active ? "text-white" : "text-zinc-400"}`}>{text}</div>
    </div>
  );

  // Stats Card component 
  const StatsCard = ({ title, value, icon, trend, color }: { 
    title: string, 
    value: string, 
    icon: React.ReactNode, 
    trend?: string, 
    color: string 
  }) => {
    let gradient: string, textColor: string, borderColor: string;
    
    switch (color) {
      case "purple":
        gradient = "from-purple-500 to-fuchsia-500";
        textColor = "text-purple-300";
        borderColor = "border-purple-900/30";
        break;
      case "pink":
        gradient = "from-pink-500 to-rose-500";
        textColor = "text-pink-300";
        borderColor = "border-pink-900/30";
        break;
      case "blue":
        gradient = "from-blue-500 to-cyan-500";
        textColor = "text-blue-300";
        borderColor = "border-blue-900/30";
        break;
      case "cyan":
        gradient = "from-cyan-500 to-blue-500";
        textColor = "text-cyan-300";
        borderColor = "border-cyan-900/30";
        break;
      default:
        gradient = "from-purple-500 to-fuchsia-500";
        textColor = "text-purple-300";
        borderColor = "border-purple-900/30";
    }
  
    return (
      <div className={`bg-zinc-950 rounded-lg border ${borderColor} p-4`}>
        <div className="flex items-center justify-between mb-3">
          <div className={`${textColor} text-sm`}>{title}</div>
          <div className={`w-8 h-8 rounded-lg bg-gradient-to-r ${gradient} flex items-center justify-center`}>
            {icon}
          </div>
        </div>
        <div className="text-xl font-bold text-white">{value}</div>
        {trend && (
          <div className={`text-xs ${trend.startsWith("+") ? "text-green-400" : "text-red-400"} mt-1`}>
            {trend} {trend.includes("%") ? "" : "today"}
          </div>
        )}
      </div>
    );
  }; 

  // Token Price Card
  const TokenPriceCard = ({ name, symbol, price, change, marketCap, volume, iconLetter }: {
    name: string,
    symbol: string,
    price: number,
    change: number,
    marketCap: number,
    volume: number,
    iconLetter: string
  }) => {
    const isPositive = change > 0;
    
    return (
      <div className="bg-zinc-950 rounded-lg border border-purple-900/30 p-4">
        <div className="flex items-center mb-4">
          <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-500 to-fuchsia-500 flex items-center justify-center mr-3">
            <span className="text-white font-semibold">{iconLetter}</span>
          </div>
          <div>
            <div className="text-lg font-semibold text-white">{name}</div>
            <div className="text-sm text-zinc-400">{symbol}</div>
          </div>
          <div className="ml-auto">
            <div className="text-lg font-semibold text-white">${price.toFixed(2)}</div>
            <div className={`text-sm ${isPositive ? "text-green-400" : "text-red-400"}`}>
              {isPositive ? "+" : ""}{change.toFixed(2)}%
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <div className="text-zinc-400">Market Cap</div>
            <div className="text-white font-medium">${marketCap.toLocaleString()}</div>
          </div>
          <div>
            <div className="text-zinc-400">24h Volume</div>
            <div className="text-white font-medium">${volume.toLocaleString()}</div>
          </div>
        </div>
      </div>
    );
    };

  const ToggleSwitch = ({ isActive, onToggle, activeLabel = "Active", inactiveLabel = "Inactive" }: {
    isActive: boolean,
    onToggle: () => void,
    activeLabel?: string,
    inactiveLabel?: string
  }) => {
  // Add this line to fix the ARIA attribute
  const ariaPressed = isActive ? 'true' : 'false';

    return (
      <div className="flex items-center">
        <button
          onClick={onToggle}
          className={`relative inline-flex h-6 w-12 items-center rounded-full transition-colors focus:outline-none ${isActive ? "bg-gradient-to-r from-purple-600 to-fuchsia-600" : "bg-zinc-700"
            }`}
            aria-label={isActive ? "Deactivate" : "Activate"}
                aria-pressed={ariaPressed}
            >
           <span
            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${isActive ? "translate-x-7" : "translate-x-1"
            }`}
          />
        </button>
        <span className={`ml-2 text-sm ${isActive ? "text-green-400" : "text-red-400"}`}>
          {isActive ? activeLabel : inactiveLabel}
        </span>
      </div>
    );
  };
  // Simple ActivityLog component
  const ActivityLog = ({ type, message, time }: {
    type: string,
    message: string,
    time: string
  }) => {
    let iconColor: string, bgColor: string;
    
    switch (type) {
      case "success":
        iconColor = "text-green-400";
        bgColor = "bg-green-900/20";
        break;
      case "error":
        iconColor = "text-red-400";
        bgColor = "bg-red-900/20";
        break;
      case "warning":
        iconColor = "text-yellow-400";
        bgColor = "bg-yellow-900/20";
        break;
      case "info":
      default:
        iconColor = "text-blue-400";
        bgColor = "bg-blue-900/20";
        break;
    }
    
    return (
      <div className={`flex items-start rounded p-2 ${bgColor}`}>
        <div className={`mr-2 mt-0.5 ${iconColor}`}>
          {type === "success" && <Check size={14} />}
          {type === "error" && <AlertTriangle size={14} />}
          {type === "warning" && <AlertTriangle size={14} />}
          {type === "info" && <Info size={14} />}
        </div>
        <div className="flex-1">
          <div className="text-xs text-white">{message}</div>
          <div className="text-xs text-zinc-500 mt-0.5">{time}</div>
        </div>
      </div>
    );
  };

  // Bot tabs navigation with fixed ARIA attributes
  const BotTabs = ({ activeBot, setActiveBot }: { activeBot: string, setActiveBot: React.Dispatch<React.SetStateAction<string>> }) => {
    return (
      <div className="flex border-b border-zinc-800" role="tablist" aria-label="Bot configurations">
        <div 
          className={`px-4 py-2 cursor-pointer text-sm border-b-2 ${activeBot === "volume" ? "border-purple-500 text-purple-400" : "border-transparent text-zinc-400 hover:text-zinc-300"}`}
          onClick={() => setActiveBot("volume")}
          role="tab"
          aria-selected={activeBot === "volume" ? 'true' : 'false'}
          tabIndex={0}
          id="volume-tab"
          aria-controls="volume-panel"
        >
          Volume Analysis
        </div>
        <div 
          className={`px-4 py-2 cursor-pointer text-sm border-b-2 ${activeBot === "bundle" ? "border-purple-500 text-purple-400" : "border-transparent text-zinc-400 hover:text-zinc-300"}`}
          onClick={() => setActiveBot("bundle")}
          role="tab"
          aria-selected={activeBot === "bundle" ? 'true' : 'false'}
          tabIndex={0}
          id="bundle-tab"
          aria-controls="bundle-panel"
        >
          Bundle Bot
        </div>
        <div 
          className={`px-4 py-2 cursor-pointer text-sm border-b-2 ${activeBot === "sniper" ? "border-purple-500 text-purple-400" : "border-transparent text-zinc-400 hover:text-zinc-300"}`}
          onClick={() => setActiveBot("sniper")}
          role="tab"
          aria-selected={activeBot === "sniper" ? 'true' : 'false'}
          tabIndex={0}
          id="sniper-tab"
          aria-controls="sniper-panel"
        >
          Sniper Bot
        </div>
        <div 
          className={`px-4 py-2 cursor-pointer text-sm border-b-2 ${activeBot === "bump" ? "border-purple-500 text-purple-400" : "border-transparent text-zinc-400 hover:text-zinc-300"}`}
          onClick={() => setActiveBot("bump")}
          role="tab"
          aria-selected={activeBot === "bump" ? 'true' : 'false'}
          tabIndex={0}
          id="bump-tab"
          aria-controls="bump-panel"
        >
          Bump Bot
        </div>
      </div>
    );
  };

  // Bot Settings Form
  const BotSettingsForm = ({ botType, settings, onSave }: { 
    botType: string, 
    settings: BotSettings, 
    onSave: (botType: string, settings: BotSettings) => void 
  }) => {
    const [formSettings, setFormSettings] = useState<BotSettings>(settings);
    
    const handleChange = (key: keyof BotSettings, value: any) => {
      setFormSettings({
        ...formSettings,
        [key]: value
      });
    };
    
    return (
      <div className="bg-zinc-950 rounded-lg border border-purple-900/30 overflow-hidden">
        <div className="border-b border-purple-900/30 p-4">
          <h3 className="text-lg font-medium text-white">{botType.charAt(0).toUpperCase() + botType.slice(1)} Bot Settings</h3>
        </div>
        <div className="p-4">
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-zinc-400 text-sm mb-2">Status</label>
              <div className="flex items-center">
                <ToggleSwitch 
                  isActive={formSettings.enabled} 
                  onToggle={() => handleChange("enabled", !formSettings.enabled)} 
                />
              </div>
            </div>
            
            <div>
              <label className="block text-zinc-400 text-sm mb-2" htmlFor={`risk-${botType}`}>Risk Level</label>
              <select 
                id={`risk-${botType}`}
                className="w-full bg-zinc-900 border border-zinc-800 rounded p-3 text-white"
                value={formSettings.riskLevel}
                onChange={(e) => handleChange("riskLevel", e.target.value)}
                aria-label="Select risk level"
                title="Risk level selection"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
            
            <div>
              <label className="block text-zinc-400 text-sm mb-2" htmlFor={`max-amount-${botType}`}>Max Amount (SOL)</label>
              <input 
                id={`max-amount-${botType}`}
                type="number" 
                className="w-full bg-zinc-900 border border-zinc-800 rounded p-3 text-white"
                value={formSettings.maxAmount}
                onChange={(e) => handleChange("maxAmount", parseFloat(e.target.value))}
                aria-label="Set maximum SOL amount"
                placeholder="Max SOL amount"
              />
            </div>
            
            <div>
              <label className="block text-zinc-400 text-sm mb-2">Auto-Trading</label>
              <div className="flex items-center">
                <ToggleSwitch 
                  isActive={formSettings.autoTrade} 
                  onToggle={() => handleChange("autoTrade", !formSettings.autoTrade)} 
                />
              </div>
            </div>
          </div>
          
          <div className="flex justify-end mt-6">
            <button 
              className="px-4 py-2 bg-gradient-to-r from-purple-600 to-fuchsia-600 rounded text-white"
              onClick={() => onSave(botType, formSettings)}
              aria-label={`Save ${botType} settings`}
            >
              Save Settings
            </button>
          </div>
        </div>
      </div>
    );
  };
  
  // Volume Analysis Bot Content
  const VolumeAnalysisBotContent = () => {
    return (
      <div className="space-y-6">
        <div className="bg-zinc-950 rounded-lg border border-purple-900/30 p-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-medium text-white">Volume Analysis Bot</h3>
              <p className="text-sm text-zinc-400">Analyzes token volume data for trading opportunities</p>
            </div>
            <ToggleSwitch 
              isActive={activeBots.volume} 
              onToggle={() => toggleBot("volume")} 
            />
          </div>
          
          <div className="grid grid-cols-3 gap-4 mt-4">
            <div className="bg-zinc-900 rounded p-3">
              <div className="text-sm text-zinc-400 mb-1">Profit</div>
              <div className="text-xl text-white">+1.24 SOL</div>
              <div className="text-xs text-green-400">+0.54 today</div>
            </div>
            <div className="bg-zinc-900 rounded p-3">
              <div className="text-sm text-zinc-400 mb-1">Trades</div>
              <div className="text-xl text-white">24</div>
              <div className="text-xs text-zinc-400">Last: 2 hours ago</div>
            </div>
            <div className="bg-zinc-900 rounded p-3">
              <div className="text-sm text-zinc-400 mb-1">Win Rate</div>
              <div className="text-xl text-white">68%</div>
              <div className="text-xs text-zinc-400">Last 30 days</div>
            </div>
          </div>
          
          <div className="mt-6">
            <h4 className="text-sm text-white mb-2 font-medium">Top Volume Events (24h)</h4>
            <div className="rounded overflow-hidden border border-zinc-800">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-zinc-900">
                    <th className="text-left p-3 text-zinc-400 font-medium">Token</th>
                    <th className="text-right p-3 text-zinc-400 font-medium">Volume</th>
                    <th className="text-right p-3 text-zinc-400 font-medium">Price</th>
                    <th className="text-right p-3 text-zinc-400 font-medium">Change</th>
                    <th className="text-right p-3 text-zinc-400 font-medium">Action</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-t border-zinc-800">
                    <td className="p-3 text-white">
                      <div className="flex items-center">
                        <div className="w-6 h-6 rounded-full bg-gradient-to-r from-purple-500 to-fuchsia-500 flex items-center justify-center mr-2">
                          <span className="text-white text-xs">S</span>
                        </div>
                        <div>SOL</div>
                      </div>
                    </td>
                    <td className="p-3 text-right text-white">$4.82M</td>
                    <td className="p-3 text-right text-white">$198.42</td>
                    <td className="p-3 text-right text-green-400">+5.2%</td>
                    <td className="p-3 text-right">
                      <button className="bg-zinc-800 hover:bg-zinc-700 text-white text-xs py-1.5 px-3 rounded transition-colors">
                        Monitor
                      </button>
                    </td>
                  </tr>
                  <tr className="border-t border-zinc-800">
                    <td className="p-3 text-white">
                      <div className="flex items-center">
                        <div className="w-6 h-6 rounded-full bg-gradient-to-r from-purple-500 to-fuchsia-500 flex items-center justify-center mr-2">
                          <span className="text-white text-xs">J</span>
                        </div>
                        <div>JUP</div>
                      </div>
                    </td>
                    <td className="p-3 text-right text-white">$2.45M</td>
                    <td className="p-3 text-right text-white">$1.26</td>
                    <td className="p-3 text-right text-green-400">+3.8%</td>
                    <td className="p-3 text-right">
                      <button className="bg-zinc-800 hover:bg-zinc-700 text-white text-xs py-1.5 px-3 rounded transition-colors">
                        Monitor
                      </button>
                    </td>
                  </tr>
                  <tr className="border-t border-zinc-800">
                    <td className="p-3 text-white">
                      <div className="flex items-center">
                        <div className="w-6 h-6 rounded-full bg-gradient-to-r from-purple-500 to-fuchsia-500 flex items-center justify-center mr-2">
                          <span className="text-white text-xs">R</span>
                        </div>
                        <div>RAY</div>
                      </div>
                    </td>
                    <td className="p-3 text-right text-white">$1.34M</td>
                    <td className="p-3 text-right text-white">$2.87</td>
                    <td className="p-3 text-right text-green-400">+7.2%</td>
                    <td className="p-3 text-right">
                      <button className="bg-zinc-800 hover:bg-zinc-700 text-white text-xs py-1.5 px-3 rounded transition-colors">
                        Monitor
                      </button>
                    </td>
                  </tr>
                  <tr className="border-t border-zinc-800">
                    <td className="p-3 text-white">
                      <div className="flex items-center">
                        <div className="w-6 h-6 rounded-full bg-gradient-to-r from-purple-500 to-fuchsia-500 flex items-center justify-center mr-2">
                          <span className="text-white text-xs">C</span>
                        </div>
                        <div>CBRS</div>
                      </div>
                    </td>
                    <td className="p-3 text-right text-white">$0.24M</td>
                    <td className="p-3 text-right text-white">$0.000042</td>
                    <td className="p-3 text-right text-green-400">+5.8%</td>
                    <td className="p-3 text-right">
                      <button className="bg-zinc-800 hover:bg-zinc-700 text-white text-xs py-1.5 px-3 rounded transition-colors">
                        Monitor
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
        
        <BotSettingsForm 
          botType="volume"
          settings={botSettings.volume}
          onSave={saveBotSettings}
        />
      </div>
    );
  };

  // Bundle Bot Content
  const BundleBotContent = () => {
    return (
      <div className="space-y-6">
        <div className="bg-zinc-950 rounded-lg border border-purple-900/30 p-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-medium text-white">Bundle Bot</h3>
              <p className="text-sm text-zinc-400">Monitors transaction bundles for opportunities</p>
            </div>
            <ToggleSwitch 
              isActive={activeBots.bundle} 
              onToggle={() => toggleBot("bundle")} 
            />
          </div>
          
          {/* Bundle Bot specific content here */}
          <div className="grid grid-cols-3 gap-4 mt-4">
            <div className="bg-zinc-900 rounded p-3">
              <div className="text-sm text-zinc-400 mb-1">Profit</div>
              <div className="text-xl text-white">+2.84 SOL</div>
              <div className="text-xs text-green-400">+1.02 today</div>
            </div>
            <div className="bg-zinc-900 rounded p-3">
              <div className="text-sm text-zinc-400 mb-1">Bundles</div>
              <div className="text-xl text-white">18</div>
              <div className="text-xs text-zinc-400">Last: 1 hour ago</div>
            </div>
            <div className="bg-zinc-900 rounded p-3">
              <div className="text-sm text-zinc-400 mb-1">Success Rate</div>
              <div className="text-xl text-white">72%</div>
              <div className="text-xs text-zinc-400">Last 30 days</div>
            </div>
          </div>
          
          {/* Recent bundles detected */}
          <div className="mt-6">
            <h4 className="text-sm text-white mb-2 font-medium">Recent Bundle Activity</h4>
            <div className="space-y-2">
              <ActivityLog 
                type="success" 
                message="Bundle detected: SOL/USDC DEX swap - 245 SOL" 
                time="25 mins ago" 
              />
              <ActivityLog 
                type="info" 
                message="Bundle analyzed: JUP listing on Tensor" 
                time="1.2 hours ago" 
              />
              <ActivityLog 
                type="success" 
                message="Bundle executed: Bought 0.42 SOL of RAY" 
                time="2.5 hours ago" 
              />
              <ActivityLog 
                type="warning" 
                message="Bundle skipped: Risk level too high" 
                time="3 hours ago" 
              />
            </div>
          </div>
        </div>
        
        <BotSettingsForm 
          botType="bundle"
          settings={botSettings.bundle}
          onSave={saveBotSettings}
        />
      </div>
    );
  };

  // Sniper Bot Content
  const SniperBotContent = () => {
    return (
      <div className="space-y-6">
        <div className="bg-zinc-950 rounded-lg border border-purple-900/30 p-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-medium text-white">Sniper Bot</h3>
              <p className="text-sm text-zinc-400">Monitors and snipes new token listings</p>
            </div>
            <ToggleSwitch 
              isActive={activeBots.sniper} 
              onToggle={() => toggleBot("sniper")} 
            />
          </div>
          
          {/* Sniper Bot specific content here */}
          <div className="grid grid-cols-3 gap-4 mt-4">
            <div className="bg-zinc-900 rounded p-3">
              <div className="text-sm text-zinc-400 mb-1">Profit</div>
              <div className="text-xl text-white">+5.21 SOL</div>
              <div className="text-xs text-green-400">+3.04 today</div>
            </div>
            <div className="bg-zinc-900 rounded p-3">
              <div className="text-sm text-zinc-400 mb-1">Snipes</div>
              <div className="text-xl text-white">7</div>
              <div className="text-xs text-zinc-400">Last: 45 mins ago</div>
            </div>
            <div className="bg-zinc-900 rounded p-3">
              <div className="text-sm text-zinc-400 mb-1">Success Rate</div>
              <div className="text-xl text-white">85%</div>
              <div className="text-xs text-zinc-400">Last 30 days</div>
            </div>
          </div>
          
          {/* Recent snipes */}
          <div className="mt-6">
            <h4 className="text-sm text-white mb-2 font-medium">Recent Sniper Activity</h4>
            <div className="rounded overflow-hidden border border-zinc-800">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-zinc-900">
                    <th className="text-left p-3 text-zinc-400 font-medium">Token</th>
                    <th className="text-right p-3 text-zinc-400 font-medium">Purchased</th>
                    <th className="text-right p-3 text-zinc-400 font-medium">Current Value</th>
                    <th className="text-right p-3 text-zinc-400 font-medium">Profit</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-t border-zinc-800">
                    <td className="p-3 text-white">
                      <div className="flex items-center">
                        <div className="w-6 h-6 rounded-full bg-gradient-to-r from-purple-500 to-fuchsia-500 flex items-center justify-center mr-2">
                          <span className="text-white text-xs">C</span>
                        </div>
                        <div>CBRS</div>
                      </div>
                    </td>
                    <td className="p-3 text-right text-white">0.8 SOL</td>
                    <td className="p-3 text-right text-white">2.24 SOL</td>
                    <td className="p-3 text-right text-green-400">+180%</td>
                  </tr>
                  <tr className="border-t border-zinc-800">
                    <td className="p-3 text-white">
                      <div className="flex items-center">
                        <div className="w-6 h-6 rounded-full bg-gradient-to-r from-purple-500 to-fuchsia-500 flex items-center justify-center mr-2">
                          <span className="text-white text-xs">B</span>
                        </div>
                        <div>BONK</div>
                      </div>
                    </td>
                    <td className="p-3 text-right text-white">1.2 SOL</td>
                    <td className="p-3 text-right text-white">3.75 SOL</td>
                    <td className="p-3 text-right text-green-400">+212%</td>
                  </tr>
                  <tr className="border-t border-zinc-800">
                    <td className="p-3 text-white">
                      <div className="flex items-center">
                        <div className="w-6 h-6 rounded-full bg-gradient-to-r from-purple-500 to-fuchsia-500 flex items-center justify-center mr-2">
                          <span className="text-white text-xs">T</span>
                        </div>
                        <div>TENSOR</div>
                      </div>
                    </td>
                    <td className="p-3 text-right text-white">0.5 SOL</td>
                    <td className="p-3 text-right text-white">0.85 SOL</td>
                    <td className="p-3 text-right text-green-400">+70%</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
        
        <BotSettingsForm 
          botType="sniper"
          settings={botSettings.sniper}
          onSave={saveBotSettings}
        />
      </div>
    );
  };

  // Bump Bot Content
  const BumpBotContent = () => {
    return (
      <div className="space-y-6">
        <div className="bg-zinc-950 rounded-lg border border-purple-900/30 p-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-medium text-white">Bump Bot</h3>
              <p className="text-sm text-zinc-400">Analyzes price bumps for trading opportunities</p>
            </div>
            <ToggleSwitch 
              isActive={activeBots.bump} 
              onToggle={() => toggleBot("bump")} 
            />
          </div>
          
          {/* Bump Bot specific content here */}
          <div className="grid grid-cols-3 gap-4 mt-4">
            <div className="bg-zinc-900 rounded p-3">
              <div className="text-sm text-zinc-400 mb-1">Profit</div>
              <div className="text-xl text-white">+0.78 SOL</div>
              <div className="text-xs text-green-400">+0.12 today</div>
            </div>
            <div className="bg-zinc-900 rounded p-3">
              <div className="text-sm text-zinc-400 mb-1">Trades</div>
              <div className="text-xl text-white">12</div>
              <div className="text-xs text-zinc-400">Last: 5 hours ago</div>
            </div>
            <div className="bg-zinc-900 rounded p-3">
              <div className="text-sm text-zinc-400 mb-1">Win Rate</div>
              <div className="text-xl text-white">58%</div>
              <div className="text-xs text-zinc-400">Last 30 days</div>
            </div>
          </div>
          
          {/* Price bump threshold configuration */}
          <div className="mt-6 bg-zinc-900 rounded p-4 border border-zinc-800">
            <h4 className="text-sm text-white mb-3 font-medium">Bump Threshold Settings</h4>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-zinc-400 text-xs mb-2" htmlFor="min-bump">Minimum Bump %</label>
                <input 
                  id="min-bump"
                  type="number" 
                  className="w-full bg-zinc-800 border border-zinc-700 rounded p-2 text-white"
                  value="5"
                />
              </div>
              <div>
                <label className="block text-zinc-400 text-xs mb-2" htmlFor="max-slippage">Max Slippage %</label>
                <input 
                  id="max-slippage"
                  type="number" 
                  className="w-full bg-zinc-800 border border-zinc-700 rounded p-2 text-white"
                  value="2.5"
                />
              </div>
              <div>
                <label className="block text-zinc-400 text-xs mb-2" htmlFor="timeframe">Analysis Timeframe</label>
                <select 
                  id="timeframe"
                  className="w-full bg-zinc-800 border border-zinc-700 rounded p-2 text-white"
                >
                  <option value="5m">5 minutes</option>
                  <option value="15m">15 minutes</option>
                  <option value="30m">30 minutes</option>
                  <option value="1h" selected>1 hour</option>
                  <option value="4h">4 hours</option>
                </select>
              </div>
              <div>
                <label className="block text-zinc-400 text-xs mb-2" htmlFor="confirmation">Confirmation Count</label>
                <input 
                  id="confirmation"
                  type="number" 
                  className="w-full bg-zinc-800 border border-zinc-700 rounded p-2 text-white"
                  value="3"
                />
              </div>
            </div>
            <div className="flex justify-end mt-4">
              <button className="bg-zinc-800 hover:bg-zinc-700 text-white text-xs py-2 px-4 rounded transition-colors">
                Update Settings
              </button>
            </div>
          </div>
        </div>
        
        <BotSettingsForm 
          botType="bump"
          settings={botSettings.bump}
          onSave={saveBotSettings}
        />
      </div>
    );
  };

  // Function to render content based on active bot tab
  const renderBotTabContent = () => {
    switch (activeBotTab) {
      case "volume":
        return <VolumeAnalysisBotContent />;
      case "bundle":
        return <BundleBotContent />;
      case "sniper":
        return <SniperBotContent />;
      case "bump":
        return <BumpBotContent />;
      default:
        return <VolumeAnalysisBotContent />;
    }
  };
  
  // Function to render content based on active tab
  const renderTabContent = () => {
    switch (activeTab) {
      case "dashboard":
        return (
          <div className="space-y-6">
            {/* Dashboard content here */}
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-2xl font-bold text-white">Dashboard</h1>
              <div className="flex items-center">
                <div className="flex items-center bg-zinc-900 rounded-lg px-3 py-1.5 mr-4">
                  <div className="w-2 h-2 rounded-full bg-green-500 mr-2"></div>
                  <div className="text-sm text-white">System Online</div>
                </div>
                <div className="text-sm text-zinc-400">{CURRENT_USER} • {currentDateTime}</div>
              </div>
            </div>
            
            {/* Stats Grid */}
            <div className="grid grid-cols-4 gap-4">
              <StatsCard 
                title="Wallet Balance" 
                value={`${walletBalance.toFixed(2)} SOL`}
                icon={<Wallet size={16} className="text-white" />}
                trend={"+0.24 SOL"}
                color="purple"
              />
              <StatsCard 
                title="SOL Price" 
                value={`$${solPrice || 198.42}`}
                icon={<DollarSign size={16} className="text-white" />}
                trend={`${(sol24hChange || 5.2).toFixed(2)}%`}
                color="pink"
              />
              <StatsCard 
                title="Trading Bots" 
                value={`${Object.values(activeBots).filter(Boolean).length}/4 Active`}
                icon={<Zap size={16} className="text-white" />}
                color="blue"
              />
              <StatsCard 
                title="$CBRS Holders" 
                value={tokenHolders.toString()}
                icon={<Users size={16} className="text-white" />}
                trend={"+45"}
                color="cyan"
              />
            </div>
            
            {/* Portfolio and Activity */}
            <div className="grid grid-cols-3 gap-4 mt-8">
              <div className="col-span-2 bg-zinc-950 rounded-lg border border-purple-900/30 p-4">
                <h2 className="text-lg font-semibold text-white mb-4">Portfolio Overview</h2>
                <div className="text-2xl font-bold text-white mb-1">${totalPortfolioValue.toFixed(2)}</div>
                <div className="text-sm text-green-400 mb-6">+$142.58 (5.8%) today</div>
                
                {/* Portfolio Chart Placeholder */}
                <div className="w-full h-64 bg-zinc-900 rounded-lg flex items-center justify-center mb-4">
                  <div className="text-center">
                    <LineChart size={32} className="text-zinc-700 mx-auto mb-2" />
                    <div className="text-zinc-500">Portfolio Chart</div>
                  </div>
                </div>
                
                {/* Token Breakdown */}
                <h3 className="text-sm font-medium text-white mt-6 mb-2">Token Distribution</h3>
                <div className="grid grid-cols-2 gap-4">
                  {tokens.map((token, index) => (
                    <div key={index} className="flex items-center justify-between bg-zinc-900 p-3 rounded">
                      <div className="flex items-center">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-fuchsia-500 flex items-center justify-center mr-2">
                          <span className="text-white">{token.symbol.charAt(0)}</span>
                        </div>
                        <div>
                          <div className="text-white">{token.name}</div>
                          <div className="text-xs text-zinc-400">{token.symbol}</div>
                        </div>
                      </div>
                      <div>
                        <div className="text-right text-white">${token.price.toFixed(token.symbol === "CBRS" ? 6 : 2)}</div>
                        <div className={`text-xs text-right ${token.change >= 0 ? "text-green-400" : "text-red-400"}`}>
                          {token.change >= 0 ? "+" : ""}{token.change}%
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="bg-zinc-950 rounded-lg border border-purple-900/30 p-4">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-white">Recent Activity</h2>
                  <div className="text-sm text-purple-400 cursor-pointer hover:text-purple-300 transition-colors">
                    View All
                  </div>
                </div>
                
                <div className="space-y-3">
                  {botTransactions.slice(0, 5).map((transaction, index) => (
                    <div key={index} className="bg-zinc-900 p-3 rounded">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-2 ${
                            transaction.type.includes("Buy") 
                              ? "bg-green-900/30 text-green-400" 
                              : transaction.type.includes("Sell") 
                                ? "bg-red-900/30 text-red-400"
                                : "bg-blue-900/30 text-blue-400"
                          }`}>
                            {transaction.type.includes("Buy") && <ArrowUpDown size={14} />}
                            {transaction.type.includes("Sell") && <ArrowUpDown size={14} />}
                            {transaction.type.includes("Bot") && <Zap size={14} />}
                          </div>
                          <div>
                            <div className="text-white font-medium text-sm">{transaction.type}</div>
                            <div className="text-xs text-zinc-400">{transaction.bot} bot</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-xs text-zinc-300">{transaction.timestamp.split(" ")[1]}</div>
                          <div className="text-xs text-zinc-500">{transaction.timestamp.split(" ")[0]}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="mt-4 pt-4 border-t border-zinc-800">
                  <div className="text-sm font-medium text-white mb-3">Quick Actions</div>
                  <div className="space-y-2">
                    <button className="w-full bg-zinc-900 hover:bg-zinc-800 py-2 text-sm text-white flex items-center justify-center rounded transition-colors">
                      <RefreshCw size={12} className="mr-2" /> 
                      Refresh Data
                    </button>
                    <button className="w-full bg-purple-900/20 hover:bg-purple-900/30 border border-purple-900/30 py-2 text-sm text-purple-400 flex items-center justify-center rounded transition-colors">
                      <Settings size={12} className="mr-2" /> 
                      Configure Dashboard
                    </button>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Market Trends */}
            <div className="bg-zinc-950 rounded-lg border border-purple-900/30 p-4">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold text-white">Market Trends</h2>
                <div className="flex space-x-2">
                  <button className="bg-zinc-900 hover:bg-zinc-800 py-1.5 px-3 text-sm rounded transition-colors">
                    24h
                  </button>
                  <button className="bg-purple-900/30 border border-purple-900/30 py-1.5 px-3 text-sm rounded transition-colors text-purple-400">
                    7d
                  </button>
                  <button className="bg-zinc-900 hover:bg-zinc-800 py-1.5 px-3 text-sm rounded transition-colors">
                    30d
                  </button>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-6 mt-4">
                <div className="bg-zinc-900 p-4 rounded-lg flex flex-col">
                  <div className="flex justify-between items-center mb-4">
                    <div>
                      <div className="text-lg font-medium text-white">SOL/USD</div>
                      <div className="flex items-center">
                        <div className="text-2xl text-white mr-2">${solPrice || 198.42}</div>
                        <div className={`text-sm ${(sol24hChange || 5.2) >= 0 ? "text-green-400" : "text-red-400"}`}>
                          {(sol24hChange || 5.2) >= 0 ? "+" : ""}{(sol24hChange || 5.2).toFixed(2)}%
                        </div>
                      </div>
                    </div>
                    <div className="text-xs text-zinc-500">Market Cap: ${(solMarketCap || 85000000000).toLocaleString()}</div>
                  </div>
                  
                  {/* Chart Placeholder */}
                  <div className="flex-1 min-h-[180px] bg-zinc-800/50 rounded flex items-center justify-center">
                    <div className="text-center">
                      <LineChart size={24} className="text-zinc-700 mx-auto mb-1" />
                      <div className="text-zinc-500 text-xs">Price Chart</div>
                    </div>
                  </div>
                  </div>
                </div>

                <div className="bg-zinc-900 p-4 rounded-lg flex flex-col">
                  <div className="flex justify-between items-center mb-4">
                    <div>
                      <div className="text-lg font-medium text-white">JUP/USD</div>
                      <div className="flex items-center">
                        <div className="text-2xl text-white mr-2">$1.26</div>
                        <div className="text-sm text-green-400">+3.8%</div>
                      </div>
                    </div>
                    <div className="text-xs text-zinc-500">Market Cap: $2,800,000,000</div>
                  </div>
                  
                  {/* Chart Placeholder */}
                  <div className="flex-1 min-h-[180px] bg-zinc-800/50 rounded flex items-center justify-center">
                    <div className="text-center">
                      <LineChart size={24} className="text-zinc-700 mx-auto mb-1" />
                      <div className="text-zinc-500 text-xs">Price Chart</div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-4 gap-4 mt-5">
                <TokenPriceCard 
                  name="Solana" 
                  symbol="SOL" 
                  price={198.42} 
                  change={5.2} 
                  marketCap={85000000000} 
                  volume={2800000000}
                  iconLetter="S" 
                />
                <TokenPriceCard 
                  name="Jupiter" 
                  symbol="JUP" 
                  price={1.26} 
                  change={3.8} 
                  marketCap={2800000000} 
                  volume={340000000}
                  iconLetter="J" 
                />
                <TokenPriceCard 
                  name="Raydium" 
                  symbol="RAY" 
                  price={2.87} 
                  change={7.2} 
                  marketCap={750000000} 
                  volume={120000000}
                  iconLetter="R" 
                />
                <TokenPriceCard 
                  name="Cerberus" 
                  symbol="CBRS" 
                  price={0.000042} 
                  change={5.8} 
                  marketCap={42000000} 
                  volume={3200000}
                  iconLetter="C" 
                />
              </div>
            </div>
          </div>
        );
        
      case "bots":
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-2xl font-bold text-white">Trading Bots</h1>
              <div className="text-sm text-zinc-400">
                {CURRENT_USER} • {currentDateTime}
              </div>
            </div>
            
            <BotTabs activeBot={activeBotTab} setActiveBot={setActiveBotTab} />
            
            <div className="mt-6">
              {renderBotTabContent()}
            </div>
          </div>
        );
      
      case "market":
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-2xl font-bold text-white">Market Data</h1>
              <div className="text-sm text-zinc-400">
                {CURRENT_USER} • {currentDateTime}
              </div>
            </div>
            
            <div className="flex mb-4">
              <div className="relative flex-1 max-w-xl">
                <input 
                  type="text" 
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-lg pl-10 pr-4 py-2.5 text-white"
                  placeholder="Search tokens..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <div className="absolute left-3 top-2.5 text-zinc-500">
                  <Search size={18} />
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-3 gap-4">
              <div className="col-span-2 bg-zinc-950 rounded-lg border border-purple-900/30 p-4">
                <h2 className="text-lg font-medium text-white mb-4">Top Performing Tokens</h2>
                
                <div className="rounded overflow-hidden border border-zinc-800">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-zinc-900">
                        <th className="text-left p-3 text-zinc-400 font-medium">Name</th>
                        <th className="text-right p-3 text-zinc-400 font-medium">Price</th>
                        <th className="text-right p-3 text-zinc-400 font-medium">24h Change</th>
                        <th className="text-right p-3 text-zinc-400 font-medium">Market Cap</th>
                        <th className="text-right p-3 text-zinc-400 font-medium">24h Volume</th>
                      </tr>
                    </thead>
                    <tbody>
                      {tokens.map((token, index) => (
                        <tr key={index} className="border-t border-zinc-800 hover:bg-zinc-900/50">
                          <td className="p-3">
                            <div className="flex items-center">
                              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-fuchsia-500 flex items-center justify-center mr-2">
                                <span className="text-white font-medium">{token.symbol.charAt(0)}</span>
                              </div>
                              <div>
                                <div className="text-white font-medium">{token.name}</div>
                                <div className="text-xs text-zinc-400">{token.symbol}</div>
                              </div>
                            </div>
                          </td>
                          <td className="p-3 text-right text-white">${token.price.toFixed(token.symbol === "CBRS" ? 6 : 2)}</td>
                          <td className={`p-3 text-right ${token.change >= 0 ? "text-green-400" : "text-red-400"}`}>
                            {token.change >= 0 ? "+" : ""}{token.change.toFixed(2)}%
                          </td>
                          <td className="p-3 text-right text-white">${token.marketCap.toLocaleString()}</td>
                          <td className="p-3 text-right text-white">${token.volume.toLocaleString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                
                <div className="mt-6 mb-4">
                  <h2 className="text-lg font-medium text-white mb-4">Market Overview</h2>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="bg-zinc-900 p-3 rounded">
                      <div className="text-sm text-zinc-400 mb-1">Total Market Cap</div>
                      <div className="text-xl text-white">$1.78T</div>
                      <div className="text-xs text-green-400 mt-1">+3.2% today</div>
                    </div>
                    <div className="bg-zinc-900 p-3 rounded">
                      <div className="text-sm text-zinc-400 mb-1">24h Trading Volume</div>
                      <div className="text-xl text-white">$82B</div>
                      <div className="text-xs text-red-400 mt-1">-2.8% today</div>
                    </div>
                    <div className="bg-zinc-900 p-3 rounded">
                      <div className="text-sm text-zinc-400 mb-1">SOL Dominance</div>
                      <div className="text-xl text-white">4.78%</div>
                      <div className="text-xs text-green-400 mt-1">+0.14% today</div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-zinc-950 rounded-lg border border-purple-900/30 p-4">
                <h2 className="text-lg font-medium text-white mb-4">Trading Signals</h2>
                
                <div className="space-y-4">
                  <div className="bg-green-900/20 rounded-lg p-3 border border-green-900/30">
                    <div className="flex items-center mb-2">
                      <div className="bg-green-900/30 w-8 h-8 rounded-full flex items-center justify-center mr-2">
                        <Target size={16} className="text-green-400" />
                      </div>
                      <div>
                        <div className="text-white font-medium">Buy Signal</div>
                        <div className="text-xs text-green-400">Strong momentum</div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <div className="text-white">SOL</div>
                      <div className="text-green-400">+5.2% in 24h</div>
                    </div>
                  </div>
                  
                  <div className="bg-zinc-900 rounded-lg p-3 border border-zinc-800">
                    <div className="flex items-center mb-2">
                      <div className="bg-blue-900/30 w-8 h-8 rounded-full flex items-center justify-center mr-2">
                        <Eye size={16} className="text-blue-400" />
                      </div>
                      <div>
                        <div className="text-white font-medium">Watch</div>
                        <div className="text-xs text-zinc-400">Accumulation phase</div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <div className="text-white">JUP</div>
                      <div className="text-blue-400">Consolidating</div>
                    </div>
                  </div>
                  
                  <div className="bg-red-900/20 rounded-lg p-3 border border-red-900/30">
                    <div className="flex items-center mb-2">
                      <div className="bg-red-900/30 w-8 h-8 rounded-full flex items-center justify-center mr-2">
                        <AlertTriangle size={16} className="text-red-400" />
                      </div>
                      <div>
                        <div className="text-white font-medium">Sell Signal</div>
                        <div className="text-xs text-red-400">Overbought</div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <div className="text-white">BONK</div>
                      <div className="text-red-400">RSI 78</div>
                    </div>
                  </div>
                  
                  <div className="bg-zinc-900 rounded-lg p-3 border border-zinc-800">
                    <div className="flex items-center mb-2">
                      <div className="bg-yellow-900/30 w-8 h-8 rounded-full flex items-center justify-center mr-2">
                        <AlertTriangle size={16} className="text-yellow-400" />
                      </div>
                      <div>
                        <div className="text-white font-medium">Caution</div>
                        <div className="text-xs text-yellow-400">High volatility</div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <div className="text-white">CBRS</div>
                      <div className="text-yellow-400">Low liquidity</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      
        case "wallet-manager":
          return (
            <div className="space-y-6">
              <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold text-white">Wallet Manager</h1>
                <div className="text-sm text-zinc-400">
                  {CURRENT_USER} • {currentDateTime}
                </div>
              </div>
              
              {/* Wallet manager content here */}
              <div className="bg-zinc-950 rounded-lg border border-purple-900/30 overflow-hidden">
                <div className="border-b border-purple-900/30 p-4 flex items-center justify-between">
                  <h2 className="text-lg font-medium text-white">Your Wallets</h2>
                  <button 
                    className="flex items-center text-sm bg-purple-900/30 border border-purple-900/30 hover:bg-purple-900/50 text-white px-3 py-1.5 rounded transition-colors"
                    aria-label="Add new wallet"
                  >
                    <PlusCircle size={14} className="mr-1.5" />
                    Add Wallet
                  </button>
                </div>
                
                <div className="p-4">
                  {wallets.map((wallet, index) => (
                    <div key={index} className="bg-zinc-900/50 rounded-lg p-4 border border-zinc-800/50 mb-4 last:mb-0">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-fuchsia-500 flex items-center justify-center mr-3">
                            <Wallet size={16} className="text-white" />
                          </div>
                          <div>
                            <div className="text-white font-medium">{wallet.name}</div>
                            <div className="text-xs text-zinc-400">{wallet.address.slice(0, 6)}...{wallet.address.slice(-4)}</div>
                          </div>
                        </div>
                        <div>
                          <div className="text-white font-medium">${wallet.tokens.reduce((acc, token) => acc + token.dollarValue, 0).toFixed(2)}</div>
                          <div className="text-xs text-zinc-400">{wallet.tokens.length} tokens</div>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        {wallet.tokens.map((token, tokenIndex) => (
                          <div key={tokenIndex} className="flex items-center justify-between p-2 bg-zinc-900 rounded text-sm">
                            <div className="flex items-center">
                              <div className="w-6 h-6 rounded-full bg-gradient-to-r from-purple-500 to-fuchsia-500 flex items-center justify-center mr-2">
                                <span className="text-white text-xs">{token.symbol.charAt(0)}</span>
                              </div>
                              <div>
                                <div className="text-white">{token.symbol}</div>
                                <div className="text-xs text-zinc-400">{token.balance.toLocaleString()}</div>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="text-white">${token.dollarValue.toFixed(2)}</div>
                              <div className="text-xs text-zinc-400">
                                ${tokens.find(t => t.symbol === token.symbol)?.price.toFixed(token.symbol === "CBRS" ? 6 : 2)} per token
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                      
                      <div className="flex space-x-2 mt-3">
                        <button 
                          className="px-3 py-1.5 text-sm bg-zinc-800 hover:bg-zinc-700 text-white rounded"
                          aria-label={`View details for ${wallet.name}`}
                        >
                          View Details
                        </button>
                        <button 
                          className="px-3 py-1.5 text-sm bg-zinc-800 hover:bg-zinc-700 text-white rounded flex items-center"
                          aria-label={`Refresh ${wallet.name} data`}
                        >
                          <RefreshCw size={12} className="mr-1.5" />
                          Refresh
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          );
      
      default:
        return (
          <div className="text-center py-12">
            <div className="text-lg text-zinc-500">This feature is coming soon</div>
            <div className="text-sm text-zinc-600 mt-1">Currently in development</div>
          </div>
        );
    }
  };

  return (
    <div className="flex h-screen bg-black text-white overflow-hidden">
      {/* Left Sidebar */}
      <div className="w-64 bg-zinc-950 border-r border-purple-900/30 flex flex-col">
        {/* Logo */}
        <div className="p-5 flex items-center border-b border-purple-900/30">
          <div className="text-2xl font-bold bg-gradient-to-r from-purple-500 via-fuchsia-500 to-pink-500 text-transparent bg-clip-text">
            CERBERUS
          </div>
          <div className="ml-2 text-white font-semibold">
            BOT
          </div>
        </div>
        
        {/* Navigation */}
        <div className="flex-1 overflow-auto">
          <NavSection title="MAIN">
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
              text="Market Data" 
              active={activeTab === "market"} 
              onClick={() => setActiveTab("market")}
            />
            <NavItem 
              icon={<Wallet size={18} />} 
              text="Wallet Manager" 
              active={activeTab === "wallet-manager"} 
              onClick={() => setActiveTab("wallet-manager")}
            />
          </NavSection>
          
          <NavSection title="TRADING">
            <NavItem 
              icon={<ArrowUpDown size={18} />} 
              text="Quick Buys" 
              active={activeTab === "quick-buys"} 
              onClick={() => setActiveTab("quick-buys")}
            />
            <NavItem 
              icon={<ArrowUpDown size={18} />} 
              text="Quick Sells" 
              active={activeTab === "quick-sells"} 
              onClick={() => setActiveTab("quick-sells")}
            />
            <NavItem 
              icon={<Users size={18} className="text-zinc-400" />} 
              text="Human Mode" 
              active={activeTab === "human-mode"} 
              onClick={() => setActiveTab("human-mode")}
            />
            <NavItem 
              icon={<Eye size={18} />} 
              text="Token Monitor" 
              active={activeTab === "token-monitor"} 
              onClick={() => setActiveTab("token-monitor")}
            />
            <NavItem 
              icon={<MessageCircle size={18} className="text-zinc-400" />} 
              text="Comment Bot" 
              active={activeTab === "comment-bot"} 
              onClick={() => setActiveTab("comment-bot")}
            />
          </NavSection>
          
          <NavSection title="SETTINGS">
            <NavItem 
              icon={<Settings size={18} />} 
              text="Bot Settings" 
              active={activeTab === "settings"} 
              onClick={() => setActiveTab("settings")}
            />
            <NavItem 
              icon={<Database size={18} />} 
              text="Dev Wallet" 
              active={activeTab === "dev-wallet"} 
              onClick={() => setActiveTab("dev-wallet")}
            />
          </NavSection>
        </div>
        
        {/* User Info */}
        <div className="border-t border-purple-900/30 p-4">
          <div className="flex items-center mb-2">
            <div className="w-9 h-9 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 flex items-center justify-center">
              C
            </div>
            <div className="ml-3">
              <div className="text-sm font-medium">CERBERUS</div>
              <div className="text-xs text-purple-400">Alpha v0.1</div>
            </div>
          </div>
          <div className="mt-2 text-xs text-zinc-500">
            <div>User: {CURRENT_USER}</div>
            <div>UTC: {currentDateTime}</div>
          </div>
        </div>
      </div>
      
      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Main Content */}
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