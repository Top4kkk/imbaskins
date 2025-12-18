import React from 'react';
import { User, Rarity } from '../types';
import { RARITY_COLORS } from '../constants';
import { Link } from 'react-router-dom';
import { formatMoney } from '../utils';

interface InventoryProps {
  user: User;
  onSellItem: (id: string, price: number) => void;
}

const Inventory: React.FC<InventoryProps> = ({ user, onSellItem }) => {
  const totalValue = user.inventory.reduce((acc, item) => acc + item.price, 0);

  if (user.inventory.length === 0) {
    return (
        <div className="flex flex-col items-center justify-center py-20 text-gray-500">
            <i className="fa-solid fa-box-open text-6xl mb-4 text-dark-600"></i>
            <h2 className="text-2xl font-bold text-gray-300">Inventory Empty</h2>
            <p className="mb-6">Go open some cases to get skins!</p>
            <Link to="/" className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-500">
                Go to Cases
            </Link>
        </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-center bg-dark-800 p-4 rounded-xl border border-dark-600">
         <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
                <i className="fa-solid fa-backpack text-blue-400"></i> Your Inventory
            </h1>
            <p className="text-gray-400 text-sm mt-1">{user.inventory.length} items</p>
         </div>
         <div className="text-right mt-4 md:mt-0">
             <span className="text-sm text-gray-400 uppercase tracking-wider">Total Value</span>
             <div className="text-3xl font-mono text-green-400 font-bold">{formatMoney(totalValue, user.currency)}</div>
         </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {user.inventory.map((item) => (
              <div key={item.id} className="bg-dark-800 rounded-lg overflow-hidden border border-dark-600 group hover:border-gray-500 transition-colors flex flex-col">
                  <div className={`h-1 w-full ${item.rarity === Rarity.GOLD ? 'bg-yellow-500' : item.rarity === Rarity.COVERT ? 'bg-red-500' : item.rarity === Rarity.CASE ? 'bg-blue-500' : 'bg-blue-400'}`}></div>
                  
                  <div className="p-2 flex justify-between items-start">
                      <span className="text-[10px] uppercase font-bold text-gray-500">{item.rarity}</span>
                      <span className="text-xs font-bold text-green-400 font-mono">${item.price.toFixed(2)}</span>
                  </div>
                  
                  <div className="relative p-4 flex-grow flex items-center justify-center">
                      <img src={item.image} alt={item.name} className={`object-contain group-hover:scale-110 transition-transform duration-300 ${item.rarity === Rarity.CASE ? 'w-20 h-20' : 'w-full h-24'}`} />
                  </div>
                  
                  <div className="px-3 pb-2">
                      <div className="text-sm text-gray-300 truncate font-medium mb-3" title={item.name}>{item.name}</div>
                      
                      <div className="grid grid-cols-2 gap-2 opacity-0 group-hover:opacity-100 transition-opacity translate-y-2 group-hover:translate-y-0 duration-200">
                          {item.rarity === Rarity.CASE ? (
                             <Link 
                               to={`/case/${item.caseIdRef || 'c1'}`}
                               className="col-span-2 bg-green-600 hover:bg-green-500 text-center text-xs py-1.5 rounded text-white font-bold transition-colors"
                             >
                               OPEN
                             </Link>
                          ) : (
                              <>
                                <button 
                                    onClick={() => onSellItem(item.id, item.price)}
                                    className="bg-dark-600 hover:bg-green-600 text-xs py-1.5 rounded text-white font-bold transition-colors"
                                >
                                    SELL
                                </button>
                                <Link 
                                    to="/upgrade"
                                    className="bg-purple-600 hover:bg-purple-500 text-center text-xs py-1.5 rounded text-white font-bold transition-colors"
                                >
                                    UPG
                                </Link>
                              </>
                          )}
                      </div>
                  </div>
              </div>
          ))}
      </div>
    </div>
  );
};

export default Inventory;
