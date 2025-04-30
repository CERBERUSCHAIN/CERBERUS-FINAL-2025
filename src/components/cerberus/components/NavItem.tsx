import React from "react";

const NavItem = ({
  icon,
  text,
  active,
  onClick,
}: {
  icon: React.ReactNode;
  text: string;
  active?: boolean;
  onClick: () => void;
}) => (
  <div
    className={`flex items-center px-4 py-2 cursor-pointer ${
      active ? "bg-purple-900 text-purple-400" : "hover:bg-zinc-800 text-zinc-400"
    }`}
    onClick={onClick}
  >
    <div className="mr-3">{icon}</div>
    <div>{text}</div>
  </div>
);

export default NavItem;