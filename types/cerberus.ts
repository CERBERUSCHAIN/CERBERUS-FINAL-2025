// Define all interfaces for the application
export interface BotTransaction {
  type: string;
  bot: string;
  timestamp: string;
  user: string;
}

export interface DiscordPayload {
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

export interface TokenData {
  name: string;
  symbol: string;
  price: number;
  change: number;
  marketCap: number;
  volume: number;
  holders?: number;
}

export interface WalletTokenData {
  symbol: string;
  balance: number;
  dollarValue: number;
}

export interface WalletData {
  name: string;
  address: string;
  tokens: WalletTokenData[];
}

export interface BotSettings {
  enabled: boolean;
  riskLevel: string;
  maxAmount: number;
  autoTrade: boolean;
}