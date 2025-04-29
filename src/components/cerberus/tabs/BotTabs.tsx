import React, { useState } from 'react';
import { BotTabs } from '../bots/BotTabs';

export const BotsTab: React.FC = () => {
  const [activeBot, setActiveBot] = useState<string>("volume");
  
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-white">Trading Bots</h1>
      
      <BotTabs activeBot={activeBot} setActiveBot={setActiveBot} />
      
      {/* Add panel elements with IDs that match the aria-controls attributes */}
      <div id="volume-panel" role="tabpanel" aria-labelledby="volume-tab" hidden={activeBot !== "volume"}>
        <div className="mt-6 bg-zinc-950 p-4 rounded-lg border border-purple-900/30">
          {/* Volume bot content */}
          <h2 className="text-lg font-medium text-white mb-4">Volume Analysis Bot</h2>
          <p className="text-zinc-400">Configure and monitor your volume analysis trading bot.</p>
        </div>
      </div>
      
      <div id="bundle-panel" role="tabpanel" aria-labelledby="bundle-tab" hidden={activeBot !== "bundle"}>
        <div className="mt-6 bg-zinc-950 p-4 rounded-lg border border-purple-900/30">
          {/* Bundle bot content */}
          <h2 className="text-lg font-medium text-white mb-4">Bundle Bot</h2>
          <p className="text-zinc-400">Configure and monitor your bundle trading bot.</p>
        </div>
      </div>
      
      <div id="sniper-panel" role="tabpanel" aria-labelledby="sniper-tab" hidden={activeBot !== "sniper"}>
        <div className="mt-6 bg-zinc-950 p-4 rounded-lg border border-purple-900/30">
          {/* Sniper bot content */}
          <h2 className="text-lg font-medium text-white mb-4">Sniper Bot</h2>
          <p className="text-zinc-400">Configure and monitor your token sniping bot.</p>
        </div>
      </div>
      
      <div id="bump-panel" role="tabpanel" aria-labelledby="bump-tab" hidden={activeBot !== "bump"}>
        <div className="mt-6 bg-zinc-950 p-4 rounded-lg border border-purple-900/30">
          {/* Bump bot content */}
          <h2 className="text-lg font-medium text-white mb-4">Bump Bot</h2>
          <p className="text-zinc-400">Configure and monitor your bump trading bot.</p>
        </div>
      </div>
    </div>
  );
};