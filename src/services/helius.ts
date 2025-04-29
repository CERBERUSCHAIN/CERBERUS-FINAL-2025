import axios from "axios";

const HELIUS_API_KEY = process.env.REACT_APP_HELIUS_API_KEY || "";
const BASE_URL = `https://api.helius.xyz/v0`;

/**
 * Helius API service for Solana blockchain data
 */
export const HeliusService = {
  /**
   * Get real-time token information
   * @param mintAddress - The token's mint address
   */
  getTokenInfo: async (mintAddress: string) => {
    try {
      const response = await axios.get(`${BASE_URL}/tokens`, {
        params: {
          mintAccounts: [mintAddress],
          "api-key": HELIUS_API_KEY,
        },
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching token info:", error);
      throw error;
    }
  },

  /**
   * Get SOL price and other market data
   */
  getSolanaPrice: async () => {
    try {
      const response = await axios.get(`${BASE_URL}/token-metadata`, {
        params: {
          mintAccounts: ["So11111111111111111111111111111111111111112"], // Native SOL mint address
          "api-key": HELIUS_API_KEY,
        },
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching SOL price:", error);
      throw error;
    }
  },

  /**
   * Get transactions for a wallet address
   * @param walletAddress - Solana wallet address
   */
  getWalletTransactions: async (walletAddress: string) => {
    try {
      const response = await axios.get(`${BASE_URL}/addresses/${walletAddress}/transactions`, {
        params: {
          "api-key": HELIUS_API_KEY,
        },
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching wallet transactions:", error);
      throw error;
    }
  },

  /**
   * Get wallet balances including all tokens
   * @param walletAddress - Solana wallet address
   */
  getWalletBalances: async (walletAddress: string) => {
    try {
      const response = await axios.get(`${BASE_URL}/addresses/${walletAddress}/balances`, {
        params: {
          "api-key": HELIUS_API_KEY,
        },
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching wallet balances:", error);
      throw error;
    }
  }
};

export default HeliusService;
