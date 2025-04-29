import React from "react";

// Define common types used throughout components
export interface IconProps {
  size?: number;
  className?: string;
}

export interface NavSectionProps {
  title: string;
  children: React.ReactNode;
}

export interface NavItemProps {
  icon: React.ReactNode;
  text: string;
  active?: boolean;
  onClick: () => void;
}

export interface BotTabProps {
  icon: React.ReactNode;
  text: string;
  active: boolean;
  onClick: () => void;
}

export interface BotsTabsProps {
  activeBotTab: string;
  setActiveBotTab: (tab: string) => void;
}

export interface StatsCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  trend?: string;
  color: "purple" | "pink" | "blue" | "cyan";
}

export interface BotSettingsCardProps {
  title: string;
  value: string;
  description: string;
  icon: React.ReactNode;
  color: "purple" | "pink" | "blue" | "cyan";
}

export interface ActivityLogItemProps {
  time: string;
  message: string;
  type: "info" | "success" | "warning" | "error" | "normal";
}

export interface ToggleSettingProps {
  title: string;
  description: string;
  defaultChecked: boolean;
}

export interface VolumeBarProps {
  height: string;
  color: "normal" | "spike";
  label?: string;
}

export interface BotStatusCardProps {
  name: string;
  description: string;
  status: string;
  isActive: boolean;
  lastAction: string;
  color: "purple" | "pink" | "blue" | "cyan";
}

export interface TransactionRowProps {
  token: string;
  type: string;
  amount: string;
  price: string;
  time: string;
  status: string;
}

export interface TokenRowProps {
  name: string;
  symbol: string;
  price: string;
  change: string;
  isPositive: boolean;
  marketCap: string;
  volume: string;
}

export interface TokenListingRowProps {
  name: string;
  symbol: string;
  score: number;
  time: string;
  status: "purchased" | "rejected" | "pending";
  initialPrice: string;
}

export interface BotContentProps {
  isRunning: boolean;
}

export interface BotsContentProps {
  activeBot: string;
  isVolumeActive: boolean;
  setIsVolumeActive: (active: boolean) => void;
  isBundleActive: boolean;
  setIsBundleActive: (active: boolean) => void;
  isSniperActive: boolean;
  setIsSniperActive: (active: boolean) => void;
  isBumpActive: boolean;
  setIsBumpActive: (active: boolean) => void;
}
