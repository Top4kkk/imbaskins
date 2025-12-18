import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import SnowEffect from './components/SnowEffect';
import Home from './pages/Home';
import CaseOpen from './pages/CaseOpen';
import Upgrade from './pages/Upgrade';
import Inventory from './pages/Inventory';
import Mines from './pages/Mines';
import Crash from './pages/Crash';
import BattlePass from './pages/BattlePass';
import { User, Item } from './types';
import { getRealItem } from './constants';

// Initial User State
const INITIAL_USER: User = {
  balance: 500.00,
  inventory: [],
  xp: 0,
  currency: 'USD'
};

const App: React.FC = () => {
  const [user, setUser] = useState<User>(() => {
    const saved = localStorage.getItem('imba_user');
    return saved ? JSON.parse(saved) : INITIAL_USER;
  });

  const [registerName, setRegisterName] = useState('');
  const [isGameActive, setGameActive] = useState(false);

  useEffect(() => {
    localStorage.setItem('imba_user', JSON.stringify(user));
  }, [user]);

  const addFunds = () => {
    setUser(prev => ({ ...prev, balance: prev.balance + 100 }));
  };

  const updateBalance = (amount: number) => {
    setUser(prev => ({ ...prev, balance: prev.balance + amount }));
  };

  const addXp = (amount: number) => {
    setUser(prev => ({ ...prev, xp: prev.xp + amount }));
  };

  const addItemToInventory = (item: Item) => {
    setUser(prev => ({ ...prev, inventory: [item, ...prev.inventory] }));
  };

  // NEW: Get a skin approximately worth 'value' and add to inventory
  const addSkinToInventoryByValue = (value: number) => {
      const skin = getRealItem(undefined, value * 0.9);
      // Override price to be exactly what they won for display purposes? 
      // User asked to receive "a skin with this X" (value). 
      // We will create a unique item that matches the visual skin but has the exact won price.
      const newSkin = { 
          ...skin, 
          id: `win_${Date.now()}_${Math.random()}`,
          price: parseFloat(value.toFixed(2)) 
      };
      addItemToInventory(newSkin);
      return newSkin;
  };

  const removeItemFromInventory = (itemId: string) => {
    setUser(prev => ({ 
      ...prev, 
      inventory: prev.inventory.filter(i => i.id !== itemId) 
    }));
  };
  
  const removeItems = (itemIds: string[]) => {
      const set = new Set(itemIds);
      setUser(prev => ({
          ...prev,
          inventory: prev.inventory.filter(i => !set.has(i.id))
      }));
  };

  const sellItem = (itemId: string, price: number) => {
    removeItemFromInventory(itemId);
    updateBalance(price);
  };

  const toggleCurrency = () => {
      setUser(prev => ({ ...prev, currency: prev.currency === 'USD' ? 'RUB' : 'USD' }));
  };

  const handleRegister = (e: React.FormEvent) => {
      e.preventDefault();
      if(registerName.trim().length > 0) {
          setUser(prev => ({...prev, username: registerName.trim()}));
      }
  };

  if (!user.username) {
      return (
          <div className="min-h-screen bg-dark-900 flex items-center justify-center p-4">
              <SnowEffect />
              <div className="relative z-10 bg-dark-800 p-8 rounded-2xl border border-dark-600 max-w-md w-full text-center">
                  <div className="w-16 h-16 mx-auto bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center mb-6">
                    <i className="fa-solid fa-snowflake text-3xl text-white"></i>
                  </div>
                  <h1 className="text-3xl font-black text-white mb-2">Welcome to ImbaSkins</h1>
                  <p className="text-gray-400 mb-6">Enter your username to start opening cases.</p>
                  
                  <form onSubmit={handleRegister} className="space-y-4">
                      <input 
                        type="text" 
                        placeholder="Username" 
                        value={registerName}
                        onChange={(e) => setRegisterName(e.target.value)}
                        className="w-full bg-dark-900 border border-dark-600 rounded-lg p-3 text-white focus:border-blue-500 outline-none"
                        required
                        minLength={3}
                        maxLength={15}
                      />
                      <button 
                        type="submit" 
                        className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-lg transition-colors"
                      >
                          Start Dropping
                      </button>
                  </form>
              </div>
          </div>
      )
  }

  return (
    <Router>
      <div className="min-h-screen bg-dark-900 text-white font-sans relative">
        <SnowEffect />
        
        <div className="relative z-10 flex flex-col min-h-screen">
          <Header 
            user={user} 
            onAddFunds={addFunds} 
            onToggleCurrency={toggleCurrency} 
            isGameActive={isGameActive}
          />
          
          <main className="flex-grow container mx-auto px-4 py-6">
            <Routes>
              <Route path="/" element={<Home user={user} />} />
              <Route 
                path="/case/:caseId" 
                element={
                  <CaseOpen 
                    user={user} 
                    updateBalance={updateBalance} 
                    addItemToInventory={addItemToInventory}
                    addXp={addXp}
                    setGameActive={setGameActive}
                  />
                } 
              />
              <Route 
                path="/upgrade" 
                element={
                  <Upgrade 
                    user={user} 
                    onUpgradeSuccess={(newItem, oldItemId) => {
                      removeItemFromInventory(oldItemId);
                      addItemToInventory(newItem);
                    }}
                    onUpgradeFail={(oldItemId) => {
                      removeItemFromInventory(oldItemId);
                    }}
                  />
                } 
              />
              <Route 
                path="/inventory" 
                element={
                  <Inventory 
                    user={user} 
                    onSellItem={sellItem} 
                  />
                } 
              />
              <Route 
                path="/mines" 
                element={
                  <Mines 
                    user={user} 
                    updateBalance={updateBalance} 
                    addSkinToInventoryByValue={addSkinToInventoryByValue}
                    setGameActive={setGameActive}
                  />
                } 
              />
              <Route 
                path="/crash" 
                element={
                  <Crash 
                    user={user} 
                    onWin={updateBalance} // kept for legacy compat, mostly unused now
                    onLoss={removeItems} 
                    addSkinToInventoryByValue={addSkinToInventoryByValue}
                    setGameActive={setGameActive}
                  />
                } 
              />
              <Route 
                path="/battlepass" 
                element={
                  <BattlePass user={user} />
                } 
              />
            </Routes>
          </main>
          
          <footer className="border-t border-dark-600 py-8 bg-dark-800 mt-12">
             <div className="container mx-auto px-4 text-center text-gray-500 text-sm">
                <p>&copy; 2024 ImbaSkins. Not affiliated with Valve Corp.</p>
                <div className="flex justify-center gap-4 mt-4">
                  <a href="#" className="hover:text-white">ToS</a>
                  <a href="#" className="hover:text-white">Privacy</a>
                  <a href="#" className="hover:text-white">Support</a>
                </div>
             </div>
          </footer>
        </div>
      </div>
    </Router>
  );
};

export default App;
