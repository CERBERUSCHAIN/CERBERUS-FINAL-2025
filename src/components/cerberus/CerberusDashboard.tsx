import React, { useState } from "react";
import { BarChart2, Zap, Activity, Wallet, ArrowUpDown, Users, Eye, MessageCircle, Settings, Database } from "lucide-react";

// Import Components
import NavSection from "./components/NavSection";
import NavItem from "./components/NavItem";
import BotTabs from "./components/BotTabs";
import VolumeAnalysisBotContent from "./bot-tabs/VolumeAnalysisBotContent";
import BundleBotContent from "./bot-tabs/BundleBotContent";
import SniperBotContent from "./bot-tabs/SniperBotContent";
import BumpBotContent from "./bot-tabs/BumpBotContent";

// Constants
const CURRENT_DATE = "2025-04-29 23:45:49";
const CURRENT_USER = "CERBERUSCHAIN";

const CerberusDashboard = (): JSX.Element => {
  const [activeTab, setActiveTab] = useState<string>("dashboard");
  const [activeBotTab, setActiveBotTab] = useState<string>("volume");

  // Render Tab Content
  const renderTabContent = () => {
    switch (activeTab) {
      case "dashboard":
        return <div>Dashboard Content</div>;
      case "bots":
        return (
          <div>
            <BotTabs activeBot={activeBotTab} setActiveBot={setActiveBotTab} />
            {activeBotTab === "volume" && <VolumeAnalysisBotContent />}
            {activeBotTab === "bundle" && <BundleBotContent />}
            {activeBotTab === "sniper" && <SniperBotContent />}
            {activeBotTab === "bump" && <BumpBotContent />}
          </div>
        );
      default:
        return <div>Coming Soon</div>;
    }
  };

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <div className="w-64">
        <NavSection title="Main">
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
        </NavSection>
        <NavSection title="Settings">
          <NavItem
            icon={<Settings size={18} />}
            text="Settings"
            active={activeTab === "settings"}
            onClick={() => setActiveTab("settings")}
          />
        </NavSection>
      </div>

      {/* Main Content */}
      <div className="flex-1">{renderTabContent()}</div>
    </div>
  );
};

export default CerberusDashboard;