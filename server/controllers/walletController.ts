import { Request, Response } from "express";
import axios from "axios";
import heliusConfig from "../config/helius";

/**
 * Wallet controller for handling wallet-related API requests
 */
export const WalletController = {
  /**
   * Get wallet balance for a Solana address
   */
  getWalletBalance: async (req: Request, res: Response) => {
    try {
      const { address } = req.params;
      
      const response = await axios.get(`${heliusConfig.baseUrl}/addresses/${address}/balances`, {
        params: {
          "api-key": heliusConfig.apiKey
        }
      });
      
      res.json(response.data);
    } catch (error) {
      console.error("Error fetching wallet balance:", error);
      res.status(500).json({ error: "Failed to fetch wallet balance" });
    }
  },
  
  /**
   * Get transactions for a wallet address
   */
  getWalletTransactions: async (req: Request, res: Response) => {
    try {
      const { address } = req.params;
      const { limit = 10 } = req.query;
      
      const response = await axios.get(`${heliusConfig.baseUrl}/addresses/${address}/transactions`, {
        params: {
          "api-key": heliusConfig.apiKey,
          "limit": limit
        }
      });
      
      res.json(response.data);
    } catch (error) {
      console.error("Error fetching wallet transactions:", error);
      res.status(500).json({ error: "Failed to fetch wallet transactions" });
    }
  }
};

export default WalletController;
