import React from 'react';

interface ToggleSwitchProps {
  isActive: boolean;
  onToggle: () => void;
  activeLabel?: string;
  inactiveLabel?: string;
}

export const ToggleSwitch: React.FC<ToggleSwitchProps> = ({ 
  isActive, 
  onToggle, 
  activeLabel = "Active", 
  inactiveLabel = "Inactive" 
}) => {
  return (
    <div className="flex items-center">
      {/* Using conditional rendering to avoid expressions in ARIA attributes */}
      {isActive ? (
        <button 
          onClick={onToggle}
          className="relative inline-flex h-6 w-12 items-center rounded-full transition-colors focus:outline-none bg-gradient-to-r from-purple-600 to-fuchsia-600"
          aria-label="Deactivate"
          aria-pressed="true"
        >
          <span className="inline-block h-4 w-4 transform rounded-full bg-white transition-transform translate-x-7" />
        </button>
      ) : (
        <button 
          onClick={onToggle}
          className="relative inline-flex h-6 w-12 items-center rounded-full transition-colors focus:outline-none bg-zinc-700"
          aria-label="Activate"
          aria-pressed="false"
        >
          <span className="inline-block h-4 w-4 transform rounded-full bg-white transition-transform translate-x-1" />
        </button>
      )}
      <span className={`ml-2 text-sm ${isActive ? "text-green-400" : "text-red-400"}`}>
        {isActive ? activeLabel : inactiveLabel}
      </span>
    </div>
  );
};