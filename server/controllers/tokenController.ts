import { Request, Response } from "express";
import axios from "axios";
import heliusConfig from "../config/helius";
import DiscordWebhookService from "../webhooks/discord";

/**
 * Token controller for handling token-related API requests
 */
export const TokenController = {
  /**
   * Get detailed information about a token
   */
  getTokenInfo: async (req: Request, res: Response) => {
    try {
      const { mintAddress } = req.params;
      
      const response = await axios.get(`${heliusConfig.baseUrl}/tokens`, {
        params: {
          "api-key": heliusConfig.apiKey,
          "mintAccounts": [mintAddress]
        }
      });
      
      res.json(response.data);
    } catch (error) {
      console.error("Error fetching token data:", error);
      res.status(500).json({ error: "Failed to fetch token data" });
    }
  },
  
  /**
   * Create a new token (placeholder for token creation functionality)
   * This would be integrated with Solana web3.js in a production app
   */
  createToken: async (req: Request, res: Response) => {
    try {
      // This is a placeholder for actual token creation functionality
      // In a real implementation, this would use Solana web3.js
      
      const mockTokenData = {
        name: req.body.name,
        symbol: req.body.symbol,
        mintAddress: "Sample123456789", // This would be a real address in production
        creator: req.body.creatorWallet || "Sample987654321"
      };
      
      // Notify on Discord about token creation
      await DiscordWebhookService.notifyTokenCreation({
        name: mockTokenData.name,
        symbol: mockTokenData.symbol,
        mintAddress: mockTokenData.mintAddress,
        creator: mockTokenData.creator
      });
      
      res.status(201).json({ 
        success: true,
        message: "Token created successfully (mock)",
        data: mockTokenData
      });
    } catch (error) {
      console.error("Error creating token:", error);
      res.status(500).json({ error: "Failed to create token" });
    }
  }
};

export default TokenController;
