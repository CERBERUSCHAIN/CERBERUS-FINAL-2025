import React from "react";
import { Link } from "react-router-dom";

const Header: React.FC = () => {
  return (
    <header className="header">
      <div className="header-container">
        <div className="brand">
          <Link to="/" className="logo">
            CERBERUS
          </Link>
        </div>
        <nav className="main-nav">
          <ul>
            <li>
              <Link to="/">Dashboard</Link>
            </li>
            <li>
              <Link to="/create-token">Create Token</Link>
            </li>
            <li>
              <Link to="/wallets">Wallets</Link>
            </li>
            <li>
              <Link to="/settings">Settings</Link>
            </li>
          </ul>
        </nav>
        <div className="header-actions">
          <button className="btn btn-primary">Connect Wallet</button>
        </div>
      </div>
    </header>
  );
};

export default Header;
