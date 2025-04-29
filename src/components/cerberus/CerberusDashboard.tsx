import React, { useState } from "react";

// Types for Props
interface NavSectionProps {
  title: string;
  children: React.ReactNode;
}

interface NavItemProps {
  icon: React.ReactNode;
  text: string;
  active?: boolean;
  onClick: () => void;
}

// Navigation Section Component
const NavSection: React.FC<NavSectionProps> = ({ title, children }) => (
  <div className="px-4 py-2">
    <div className="text-xs uppercase tracking-wider text-zinc-500 mb-2">{title}</div>
    <div className="space-y-1">{children}</div>
  </div>
);

// Navigation Item Component
const NavItem: React.FC<NavItemProps> = ({ icon, text, active = false, onClick }) => (
  <div
    className={`flex items-center px-3 py-2 rounded-md cursor-pointer ${
      active ? "bg-purple-900/30 text-purple-400" : "text-zinc-400 hover:bg-zinc-900 hover:text-zinc-300"
    }`}
    onClick={onClick}
  >
    {icon}
    <span className="ml-2">{text}</span>
  </div>
);

// Dashboard Component
const CerberusDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>("dashboard");

  return (
    <div className="flex h-screen bg-black text-white overflow-hidden">
      {/* Sidebar */}
      <div className="w-64 bg-zinc-800">
        <NavSection title="Main">
          <NavItem
            icon={<i className="fas fa-home" />}
            text="Dashboard"
            active={activeTab === "dashboard"}
            onClick={() => setActiveTab("dashboard")}
          />
          <NavItem
            icon={<i className="fas fa-wallet" />}
            text="Wallet Manager"
            active={activeTab === "wallet-manager"}
            onClick={() => setActiveTab("wallet-manager")}
          />
        </NavSection>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6">
        {activeTab === "dashboard" && <div>Dashboard Content</div>}
        {activeTab === "wallet-manager" && <div>Wallet Manager Content</div>}
      </div>
    </div>
  );
};

export default CerberusDashboard;