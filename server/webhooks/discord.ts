import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const DISCORD_WEBHOOK_URL = process.env.DISCORD_WEBHOOK_URL || "";

export interface DiscordMessage {
  title: string;
  description: string;
  color?: number;
  fields?: Array<{
    name: string;
    value: string;
    inline?: boolean;
  }>;
  timestamp?: string;
}

/**
 * Discord webhook service for real-time notifications
 */
export const DiscordWebhookService = {
  /**
   * Send a message to Discord via webhook
   * @param message - The message to send
   */
  sendMessage: async (message: DiscordMessage) => {
    if (!DISCORD_WEBHOOK_URL) {
      console.error("Discord webhook URL not configured");
      return;
    }

    try {
      // Format the message as an embed
      const embed = {
        title: message.title,
        description: message.description,
        color: message.color || 0xff4500, // Default to primary orange color
        fields: message.fields || [],
        timestamp: message.timestamp || new Date().toISOString(),
      };

      // Send the webhook
      await axios.post(DISCORD_WEBHOOK_URL, {
        embeds: [embed],
      });
      
      console.log("Discord notification sent successfully");
    } catch (error) {
      console.error("Failed to send Discord notification:", error);
    }
  },

  /**
   * Send token creation notification
   */
  notifyTokenCreation: async (tokenData: {
    name: string;
    symbol: string;
    mintAddress: string;
    creator: string;
  }) => {
    return DiscordWebhookService.sendMessage({
      title: "🚀 New Token Created",
      description: `A new token has been successfully created on the Solana blockchain.`,
      color: 0x4caf50, // Green
      fields: [
        { name: "Token Name", value: tokenData.name },
        { name: "Symbol", value: tokenData.symbol },
        { name: "Mint Address", value: `\`${tokenData.mintAddress}\`` },
        { name: "Creator", value: `\`${tokenData.creator}\`` }
      ]
    });
  },

  /**
   * Send price alert notification
   */
  notifyPriceAlert: async (alertData: {
    token: string;
    symbol: string;
    price: number;
    changePercent: number;
    threshold: number;
  }) => {
    const isPositive = alertData.changePercent > 0;
    
    return DiscordWebhookService.sendMessage({
      title: `${isPositive ? "📈" : "📉"} Price Alert: ${alertData.symbol}`,
      description: `${alertData.token} has ${isPositive ? "increased" : "decreased"} by ${Math.abs(alertData.changePercent).toFixed(2)}%`,
      color: isPositive ? 0x4caf50 : 0xf44336, // Green for positive, red for negative
      fields: [
        { name: "Current Price", value: `$${alertData.price.toFixed(6)}` },
        { name: "Alert Threshold", value: `${alertData.threshold}%` }
      ]
    });
  }
};

export default DiscordWebhookService;
