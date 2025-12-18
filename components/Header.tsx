import React, { useState } from 'react';
import { User } from '../types';
import { Link, useLocation } from 'react-router-dom';
import { formatMoney } from '../utils';
import DepositModal from './DepositModal';

interface HeaderProps {
  user: User;
  onAddFunds: () => void;
  onToggleCurrency: () => void;
  isGameActive: boolean;
}

const Header: React.FC<HeaderProps> = ({ user, onAddFunds, onToggleCurrency, isGameActive }) => {
  const [showDeposit, setShowDeposit] = useState(false);
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path 
    ? "text-white bg-dark-600" 
    : "text-gray-400 hover:text-white hover:bg-dark-700";

  const linkClass = (path: string) => {
      const base = `px-4 py-2 rounded-lg font-medium transition-colors ${isActive(path)}`;
      if (isGameActive) return `${base} opacity-50 cursor-not-allowed pointer-events-none`;
      return base;
  };

  const mobileLinkClass = (path: string) => {
      const base = `flex-1 min-w-[80px] py-3 text-center text-sm font-medium ${location.pathname === path ? 'text-white' : 'text-gray-500'}`;
      if (isGameActive) return `${base} opacity-50 cursor-not-allowed pointer-events-none`;
      return base;
  };

  const handleLogoClick = (e: React.MouseEvent) => {
      if (isGameActive) e.preventDefault();
  }

  return (
    <>
    <header className="sticky top-0 z-50 bg-dark-800/90 backdrop-blur-md border-b border-dark-600">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" onClick={handleLogoClick} className={`flex items-center gap-2 group ${isGameActive ? 'cursor-not-allowed opacity-50' : ''}`}>
          <div className="w-8 h-8 bg-gradient-to-br from-rarity-restricted to-rarity-covert rounded flex items-center justify-center transform group-hover:rotate-12 transition-transform">
            <i className="fa-solid fa-snowflake text-white"></i>
          </div>
          <span className="text-xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
            Imba<span className="text-rarity-milspec">Skins</span>
          </span>
        </Link>

        {/* Nav */}
        <nav className="hidden md:flex items-center gap-1">
          <Link to="/" className={linkClass('/')}>
            <i className="fa-solid fa-box-open mr-2"></i>Cases
          </Link>
          <Link to="/mines" className={linkClass('/mines')}>
            <i className="fa-solid fa-bomb mr-2"></i>Mines
          </Link>
          <Link to="/crash" className={linkClass('/crash')}>
            <i className="fa-solid fa-chart-line mr-2"></i>Crash
          </Link>
          <Link to="/upgrade" className={linkClass('/upgrade')}>
            <i className="fa-solid fa-arrow-up-right-dots mr-2"></i>Upgrade
          </Link>
          <Link to="/battlepass" className={linkClass('/battlepass')}>
            <i className="fa-solid fa-ticket mr-2"></i>Battle Pass
          </Link>
        </nav>

        {/* User Stats */}
        <div className="flex items-center gap-4">
          <button 
             onClick={onToggleCurrency}
             className="px-2 py-1 rounded bg-dark-600 text-xs font-bold hover:bg-dark-700 text-gray-300"
          >
             {user.currency}
          </button>

          <div className="hidden sm:flex flex-col items-end">
             <span className="text-xs text-gray-400">{user.username}</span>
             <span className="text-green-400 font-bold font-mono">{formatMoney(user.balance, user.currency)}</span>
          </div>
          <button 
            onClick={() => setShowDeposit(true)}
            disabled={isGameActive}
            className={`w-8 h-8 rounded-full bg-green-500/20 text-green-400 hover:bg-green-500 hover:text-white flex items-center justify-center transition-all ${isGameActive ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            <i className="fa-solid fa-plus"></i>
          </button>
          
          <Link to="/inventory" onClick={handleLogoClick} className={`relative group ${isGameActive ? 'cursor-not-allowed opacity-50' : ''}`}>
            <div className="w-10 h-10 rounded-full bg-dark-600 border border-dark-600 group-hover:border-rarity-milspec overflow-hidden transition-colors flex items-center justify-center">
               <i className="fa-solid fa-user text-gray-400 group-hover:text-white"></i>
            </div>
            {user.inventory.length > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full text-[10px] flex items-center justify-center font-bold border-2 border-dark-800">
                {user.inventory.length}
              </span>
            )}
          </Link>
        </div>
      </div>
      
      {/* Mobile Nav */}
      <div className="md:hidden flex border-t border-dark-600 bg-dark-800 overflow-x-auto">
          <Link to="/" className={mobileLinkClass('/')}>
            Cases
          </Link>
          <Link to="/mines" className={mobileLinkClass('/mines')}>
            Mines
          </Link>
          <Link to="/crash" className={mobileLinkClass('/crash')}>
            Crash
          </Link>
          <Link to="/upgrade" className={mobileLinkClass('/upgrade')}>
            Upgrd
          </Link>
          <Link to="/battlepass" className={mobileLinkClass('/battlepass')}>
            Pass
          </Link>
      </div>
    </header>

    {showDeposit && (
        <DepositModal 
            user={user} 
            onClose={() => setShowDeposit(false)} 
            onDeposit={(amount, code) => {
                onAddFunds(); 
            }}
        />
    )}
    </>
  );
};

export default Header;
