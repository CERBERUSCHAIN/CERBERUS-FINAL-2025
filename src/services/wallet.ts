import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:3001";

/**
 * Wallet service for managing Solana wallets
 */
export const WalletService = {
  /**
   * Get wallet balance
   * @param address - Solana wallet address
   */
  getBalance: async (address: string) => {
    try {
      const response = await axios.get(`${API_URL}/api/wallet/${address}/balances`);
      return response.data;
    } catch (error) {
      console.error("Error fetching wallet balance:", error);
      throw error;
    }
  },

  /**
   * Get wallet transactions
   * @param address - Solana wallet address
   * @param limit - Number of transactions to fetch
   */
  getTransactions: async (address: string, limit = 10) => {
    try {
      const response = await axios.get(`${API_URL}/api/wallet/${address}/transactions`, {
        params: { limit }
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching wallet transactions:", error);
      throw error;
    }
  }
};

export default WalletService;
