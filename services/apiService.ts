import axios from 'axios';
import { DiscordPayload } from '../types/cerberus';
import { DISCORD_WEBHOOK } from '../constants/appConfig';

export const sendDiscordNotification = async (payload: DiscordPayload): Promise<void> => {
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

export const fetchSolanaData = async () => {
  try {
    const response = await axios.get(
      "https://api.coingecko.com/api/v3/coins/solana?localization=false&tickers=false&market_data=true&community_data=false&developer_data=false"
    );
    
    return response.data;
  } catch (error) {
    console.error("Failed to fetch Solana data:", error);
    throw error;
  }
};