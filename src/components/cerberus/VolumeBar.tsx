import React from "react";

interface VolumeBarProps {
  height: string;
  color: string;
  label?: string;
}

const VolumeBar: React.FC<VolumeBarProps> = ({ height, color, label }) => {
  let barColors = color === "spike" 
    ? "bg-gradient-to-t from-purple-500 to-fuchsia-500"
    : "bg-purple-900/60";

  return (
    <div className="flex flex-col items-center">
      <div className="relative w-6">
        <div 
          className={`w-6 ${barColors} rounded-t`} 
          style={{ height }}
        ></div>
        {label && (
          <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 px-1.5 py-0.5 bg-purple-900/80 text-purple-300 text-xs rounded whitespace-nowrap">
            {label}
          </div>
        )}
      </div>
    </div>
  );
};

export default VolumeBar;
