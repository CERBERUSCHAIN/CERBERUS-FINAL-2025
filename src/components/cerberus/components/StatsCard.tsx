import React from "react";

const StatsCard = ({
  title,
  value,
  icon,
}: {
  title: string;
  value: string;
  icon: React.ReactNode;
}) => (
  <div className="p-4 bg-zinc-900 rounded-lg">
    <div className="flex items-center justify-between">
      <div className="text-sm text-zinc-400">{title}</div>
      <div>{icon}</div>
    </div>
    <div className="text-xl font-bold text-white">{value}</div>
  </div>
);

export default StatsCard;