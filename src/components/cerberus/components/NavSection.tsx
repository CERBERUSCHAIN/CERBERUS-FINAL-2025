import React from "react";

const NavSection = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <div className="my-4">
    <div className="px-4 py-2 text-xs uppercase text-zinc-500">{title}</div>
    {children}
  </div>
);

export default NavSection;