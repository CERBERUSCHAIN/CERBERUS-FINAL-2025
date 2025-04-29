import React, { useState } from "react";
import Card from "../components/common/Card";

const Settings: React.FC = () => {
  const [network, setNetwork] = useState<string>("devnet");
  const [apiKey, setApiKey] = useState<string>("");
  const [webhookUrl, setWebhookUrl] = useState<string>("");
  const [notifications, setNotifications] = useState<boolean>(true);
  const [darkMode, setDarkMode] = useState<boolean>(true);
  const [success, setSuccess] = useState<string | null>(null);
  
  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would save settings to localStorage or an API
    setSuccess("Settings saved successfully!");
    setTimeout(() => setSuccess(null), 3000);
  };
  
  return (
    <div className="settings-container">
      <h1>Settings</h1>
      
      {success && <div className="success-message">{success}</div>}
      
      <form onSubmit={handleSaveSettings}>
        <Card>
          <h2>Network Settings</h2>
          <div className="form-group">
            <label htmlFor="network">Solana Network</label>
            <select
              id="network"
              value={network}
              onChange={(e) => setNetwork(e.target.value)}
            >
              <option value="devnet">Devnet</option>
              <option value="mainnet-beta">Mainnet Beta</option>
              <option value="testnet">Testnet</option>
            </select>
          </div>
        </Card>
        
        <Card>
          <h2>API Configuration</h2>
          <div className="form-group">
            <label htmlFor="apiKey">Helius API Key</label>
            <input
              id="apiKey"
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="Enter your Helius API key"
            />
          </div>
        </Card>
        
        <Card>
          <h2>Notifications</h2>
          <div className="form-group checkbox">
            <input
              id="notifications"
              type="checkbox"
              checked={notifications}
              onChange={(e) => setNotifications(e.target.checked)}
            />
            <label htmlFor="notifications">Enable Notifications</label>
          </div>
          
          <div className="form-group">
            <label htmlFor="webhookUrl">Discord Webhook URL</label>
            <input
              id="webhookUrl"
              type="text"
              value={webhookUrl}
              onChange={(e) => setWebhookUrl(e.target.value)}
              placeholder="Enter Discord webhook URL"
              disabled={!notifications}
            />
          </div>
        </Card>
        
        <Card>
          <h2>Appearance</h2>
          <div className="form-group checkbox">
            <input
              id="darkMode"
              type="checkbox"
              checked={darkMode}
              onChange={(e) => setDarkMode(e.target.checked)}
            />
            <label htmlFor="darkMode">Dark Mode</label>
          </div>
        </Card>
        
        <div className="form-actions">
          <button type="submit" className="btn btn-primary">
            Save Settings
          </button>
        </div>
      </form>
    </div>
  );
};

export default Settings;
