import React, { useState } from 'react';
import { BotSettings } from '../../../types/cerberus';
import { ToggleSwitch } from '../ui/ToggleSwitch';

interface BotSettingsFormProps {
  botType: string;
  settings: BotSettings;
  onSave: (botType: string, settings: BotSettings) => void;
}

export const BotSettingsForm: React.FC<BotSettingsFormProps> = ({ 
  botType, 
  settings, 
  onSave 
}) => {
  const [formSettings, setFormSettings] = useState<BotSettings>(settings);
  
  const handleChange = (key: keyof BotSettings, value: any) => {
    setFormSettings({
      ...formSettings,
      [key]: value
    });
  };
  
  return (
    <div className="bg-zinc-950 rounded-lg border border-purple-900/30 overflow-hidden">
      <div className="border-b border-purple-900/30 p-4">
        <h3 className="text-lg font-medium text-white">{botType.charAt(0).toUpperCase() + botType.slice(1)} Bot Settings</h3>
      </div>
      <div className="p-4">
        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="block text-zinc-400 text-sm mb-2">Status</label>
            <div className="flex items-center">
              <ToggleSwitch 
                isActive={formSettings.enabled} 
                onToggle={() => handleChange("enabled", !formSettings.enabled)} 
              />
            </div>
          </div>
          
          <div>
            <label className="block text-zinc-400 text-sm mb-2" htmlFor={`risk-${botType}`}>Risk Level</label>
            <select 
              id={`risk-${botType}`}
              className="w-full bg-zinc-900 border border-zinc-800 rounded p-3 text-white"
              value={formSettings.riskLevel}
              onChange={(e) => handleChange("riskLevel", e.target.value)}
              aria-label="Select risk level"
              title="Risk level selection"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>
          
          <div>
            <label className="block text-zinc-400 text-sm mb-2" htmlFor={`max-amount-${botType}`}>Max Amount (SOL)</label>
            <input 
              id={`max-amount-${botType}`}
              type="number" 
              className="w-full bg-zinc-900 border border-zinc-800 rounded p-3 text-white"
              value={formSettings.maxAmount}
              onChange={(e) => handleChange("maxAmount", parseFloat(e.target.value))}
              aria-label="Set maximum SOL amount"
              placeholder="Max SOL amount"
            />
          </div>
          
          <div>
            <label className="block text-zinc-400 text-sm mb-2">Auto-Trading</label>
            <div className="flex items-center">
              <ToggleSwitch 
                isActive={formSettings.autoTrade} 
                onToggle={() => handleChange("autoTrade", !formSettings.autoTrade)} 
              />
            </div>
          </div>
        </div>
        
        <div className="flex justify-end mt-6">
          <button 
            className="px-4 py-2 bg-gradient-to-r from-purple-600 to-fuchsia-600 rounded text-white"
            onClick={() => onSave(botType, formSettings)}
            aria-label={`Save ${botType} settings`}
          >
            Save Settings
          </button>
        </div>
      </div>
    </div>
  );
};