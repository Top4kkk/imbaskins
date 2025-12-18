import React, { useState } from 'react';
import { User, Item } from '../types';
import { formatMoney } from '../utils';

interface SkinBetModalProps {
  user: User;
  onConfirm: (selectedItems: Item[]) => void;
  onCancel: () => void;
}

const SkinBetModal: React.FC<SkinBetModalProps> = ({ user, onConfirm, onCancel }) => {
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const toggleItem = (id: string) => {
    const newSet = new Set(selectedIds);
    if (newSet.has(id)) newSet.delete(id);
    else newSet.add(id);
    setSelectedIds(newSet);
  };

  const selectedItems = user.inventory.filter(i => selectedIds.has(i.id));
  const totalValue = selectedItems.reduce((acc, i) => acc + i.price, 0);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="bg-dark-800 w-full max-w-2xl rounded-2xl border border-dark-600 flex flex-col max-h-[80vh]">
        <div className="p-6 border-b border-dark-600 flex justify-between items-center">
          <h2 className="text-xl font-bold text-white">Select Skins to Bet</h2>
          <button onClick={onCancel} className="text-gray-400 hover:text-white"><i className="fa-solid fa-xmark fa-xl"></i></button>
        </div>
        
        <div className="flex-grow overflow-y-auto p-4 grid grid-cols-3 sm:grid-cols-4 gap-3 scrollbar-hide">
           {user.inventory.length === 0 && <div className="col-span-full text-center text-gray-500 py-10">Inventory Empty</div>}
           {user.inventory.map(item => (
             <div 
               key={item.id}
               onClick={() => toggleItem(item.id)}
               className={`relative p-2 rounded border cursor-pointer transition-all ${selectedIds.has(item.id) ? 'bg-dark-700 border-green-500 shadow-[0_0_10px_rgba(34,197,94,0.3)]' : 'bg-dark-900 border-dark-600 hover:border-gray-500'}`}
             >
                {selectedIds.has(item.id) && <div className="absolute top-1 right-1 text-green-500"><i className="fa-solid fa-check-circle"></i></div>}
                <img src={item.image} className="w-full h-20 object-contain mb-2" alt="" />
                <div className="text-[10px] text-gray-400 truncate">{item.name}</div>
                <div className="text-xs font-bold text-green-400">{formatMoney(item.price, user.currency)}</div>
             </div>
           ))}
        </div>

        <div className="p-6 border-t border-dark-600 bg-dark-900/50 flex justify-between items-center rounded-b-2xl">
           <div>
             <div className="text-xs text-gray-400 uppercase">Total Bet</div>
             <div className="text-2xl font-bold text-white">{formatMoney(totalValue, user.currency)}</div>
           </div>
           <button 
             onClick={() => onConfirm(selectedItems)}
             disabled={selectedItems.length === 0}
             className="px-8 py-3 bg-red-600 hover:bg-red-500 disabled:bg-gray-700 disabled:text-gray-500 text-white font-black uppercase rounded shadow-lg transition-all"
           >
             Place Bet
           </button>
        </div>
      </div>
    </div>
  );
};

export default SkinBetModal;
