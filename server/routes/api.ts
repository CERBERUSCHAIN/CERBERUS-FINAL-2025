import express from "express";
import TokenController from "../controllers/tokenController";
import WalletController from "../controllers/walletController";

const router = express.Router();

// Health check endpoint
router.get("/health", (req, res) => {
  res.status(200).json({ status: "OK", timestamp: new Date() });
});

// Token routes
router.get("/token/:mintAddress", TokenController.getTokenInfo);
router.post("/token", TokenController.createToken);

// Wallet routes
router.get("/wallet/:address/balances", WalletController.getWalletBalance);
router.get("/wallet/:address/transactions", WalletController.getWalletTransactions);

export default router;
