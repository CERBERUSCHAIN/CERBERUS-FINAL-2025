import React, { useState } from "react";

interface BotSettings {
  name: string;
  enabled: boolean;
}

interface BotSettingsFormProps {
  settings: BotSettings;
  onSave: (settings: BotSettings) => void;
}

export const BotSettingsForm: React.FC<BotSettingsFormProps> = ({ settings, onSave }) => {
  const [botName, setBotName] = useState(settings.name);
  const [isEnabled, setIsEnabled] = useState(settings.enabled);

  const handleSave = () => {
    onSave({ name: botName, enabled: isEnabled });
  };

  return (
    <div>
      <label>
        Bot Name:
        <input
          type="text"
          value={botName}
          onChange={(e) => setBotName(e.target.value)}
        />
      </label>
      <label>
        Enabled:
        <input
          type="checkbox"
          checked={isEnabled}
          onChange={(e) => setIsEnabled(e.target.checked)}
        />
      </label>
      <button onClick={handleSave}>Save</button>
    </div>
  );
};