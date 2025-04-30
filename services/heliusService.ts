import axios from "axios";
import { API_KEY, RPC_URLS } from "../config";

export const HeliusService = {
  // Get wallet balances
  getWalletBalances: async (walletAddress: string) => {
    const url = `${RPC_URLS.MAINNET}/addresses/${walletAddress}/balances`;
    try {
      const response = await axios.get(url, {
        params: {
          "api-key": API_KEY,
        },
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching wallet balances:", error);
      throw error;
    }
  },

  // Get transaction history for a wallet
  getTransactionHistory: async (walletAddress: string) => {
    const url = `${RPC_URLS.MAINNET}/addresses/${walletAddress}/transactions`;
    try {
      const response = await axios.get(url, {
        params: {
          "api-key": API_KEY,
          limit: 50, // Fetch up to 50 transactions
        },
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching transaction history:", error);
      throw error;
    }
  },
};