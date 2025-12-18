import React, { useState, useMemo } from 'react';
import { User, Item } from '../types';
import { UPGRADE_TARGETS, RARITY_COLORS } from '../constants';
import { formatMoney } from '../utils';

interface UpgradeProps {
  user: User;
  onUpgradeSuccess: (newItem: Item, oldItemId: string) => void;
  onUpgradeFail: (oldItemId: string) => void;
}

const Upgrade: React.FC<UpgradeProps> = ({ user, onUpgradeSuccess, onUpgradeFail }) => {
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);
  const [targetItem, setTargetItem] = useState<Item | null>(null);
  const [isRolling, setIsRolling] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [result, setResult] = useState<'idle' | 'win' | 'loss'>('idle');

  // Multiplier Logic (House Edge)
  const HOUSE_EDGE = 0.95;

  const winChance = useMemo(() => {
    if (!selectedItem || !targetItem) return 0;
    const rawChance = (selectedItem.price / targetItem.price) * HOUSE_EDGE * 100;
    return Math.min(Math.max(rawChance, 1), 80); // Clamp between 1% and 80%
  }, [selectedItem, targetItem]);

  const handleUpgrade = () => {
    if (!selectedItem || !targetItem || isRolling) return;
    
    setIsRolling(true);
    setResult('idle');
    
    const random = Math.random() * 100;
    const isWin = random <= winChance;
    
    const spins = 5; // minimum full spins
    const zoneSize = (winChance / 100) * 360;
    
    let landingAngle;
    // Win zone is visually from 0 to zoneSize degrees (clockwise from top)
    if (isWin) {
        landingAngle = Math.random() * zoneSize;
    } else {
        landingAngle = zoneSize + (Math.random() * (360 - zoneSize));
    }
    
    // We rotate the spinner clockwise.
    // Landing position X means spinner rotates such that it lands on X relative to 0.
    const totalRotation = 360 * spins + landingAngle;

    setRotation(totalRotation);

    setTimeout(() => {
        setIsRolling(false);
        if (isWin) {
            setResult('win');
            onUpgradeSuccess(targetItem, selectedItem.id);
            setSelectedItem(null);
            setTargetItem(null);
        } else {
            setResult('loss');
            onUpgradeFail(selectedItem.id);
            setSelectedItem(null);
            setTargetItem(null);
        }
    }, 4000); // 4s animation
  };

  // Filter Targets: Only show items more expensive than selected
  const availableTargets = useMemo(() => {
    if(!selectedItem) return UPGRADE_TARGETS;
    return UPGRADE_TARGETS.filter(i => i.price > selectedItem.price);
  }, [selectedItem]);

  return (
    <div className="max-w-6xl mx-auto min-h-[80vh] flex flex-col">
       <div className="text-center mb-8">
         <h1 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500 uppercase italic">
            Upgrade Station
         </h1>
         <p className="text-gray-400">Risk your items for a chance to get something better.</p>
       </div>

       <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 flex-grow">
          
          {/* Left: User Inventory */}
          <div className="bg-dark-800 rounded-xl border border-dark-600 flex flex-col h-[600px]">
             <div className="p-4 border-b border-dark-600 font-bold text-gray-300">Select Item</div>
             <div className="overflow-y-auto p-2 space-y-2 flex-grow scrollbar-hide">
                {user.inventory.length === 0 && <div className="text-center text-gray-500 mt-10">Empty Inventory</div>}
                {user.inventory.map(item => (
                   <div 
                     key={item.id} 
                     onClick={() => !isRolling && setSelectedItem(item)}
                     className={`flex items-center gap-3 p-2 rounded cursor-pointer border transition-all ${selectedItem?.id === item.id ? 'bg-dark-700 border-purple-500 shadow-[0_0_10px_rgba(168,85,247,0.3)]' : 'border-transparent hover:bg-dark-700'}`}
                   >
                      <img src={item.image} className="w-12 h-12 object-contain" alt="" />
                      <div className="flex-grow">
                         <div className="text-xs text-gray-300 truncate">{item.name}</div>
                         <div className="text-xs font-bold text-green-400">{formatMoney(item.price, user.currency)}</div>
                      </div>
                   </div>
                ))}
             </div>
          </div>

          {/* Center: The Game */}
          <div className="flex flex-col items-center justify-center relative">
             {/* Result Overlay */}
             {result === 'win' && <div className="absolute top-0 text-green-400 font-black text-4xl animate-bounce z-20">SUCCESS!</div>}
             {result === 'loss' && <div className="absolute top-0 text-red-500 font-black text-4xl animate-bounce z-20">FAILED</div>}

             <div className="relative w-80 h-80 mb-8">
                 {/* SVG Circle */}
                 <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-90">
                    {/* Background Track */}
                    <circle cx="50" cy="50" r="45" fill="none" stroke="#1f2937" strokeWidth="8" />
                    
                    {/* Win Chance Segment */}
                    <circle 
                        cx="50" cy="50" r="45" 
                        fill="none" 
                        stroke="#a855f7" 
                        strokeWidth="8"
                        strokeDasharray={`${(winChance / 100) * 283} 283`} // 2*PI*45 approx 283
                        className="transition-all duration-500"
                    />
                 </svg>

                 {/* Central Info */}
                 <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                     <div className="text-4xl font-black text-white">{winChance.toFixed(2)}%</div>
                     <div className="text-xs text-gray-500 uppercase">Win Chance</div>
                 </div>

                 {/* Spinner Marker */}
                 <div 
                    className="absolute inset-0 z-10"
                    style={{ 
                        transform: `rotate(${rotation}deg)`,
                        transition: isRolling ? 'transform 4s cubic-bezier(0.15, 0.9, 0.3, 1)' : 'none'
                    }}
                 >
                     <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-2 w-4 h-6 bg-white shadow-[0_0_10px_white] rounded-b-full"></div>
                 </div>
             </div>

             <div className="flex items-center justify-between w-full px-4 mb-8">
                {/* Selected Preview */}
                <div className="w-24 h-24 bg-dark-800 rounded-lg border border-dark-600 flex items-center justify-center relative">
                    {selectedItem ? (
                        <>
                          <img src={selectedItem.image} className="w-20 h-20 object-contain" alt="" />
                          <div className="absolute bottom-0 right-0 bg-dark-900 text-green-400 text-xs px-1 rounded">{formatMoney(selectedItem.price, user.currency)}</div>
                        </>
                    ) : <div className="text-gray-600 text-xs">Select Item</div>}
                </div>

                <i className="fa-solid fa-arrow-right text-gray-500 text-xl"></i>

                {/* Target Preview */}
                <div className="w-24 h-24 bg-dark-800 rounded-lg border border-dark-600 flex items-center justify-center relative">
                    {targetItem ? (
                        <>
                          <img src={targetItem.image} className="w-20 h-20 object-contain" alt="" />
                          <div className="absolute bottom-0 right-0 bg-dark-900 text-green-400 text-xs px-1 rounded">{formatMoney(targetItem.price, user.currency)}</div>
                        </>
                    ) : <div className="text-gray-600 text-xs">Select Target</div>}
                </div>
             </div>

             <button 
                onClick={handleUpgrade}
                disabled={!selectedItem || !targetItem || isRolling}
                className={`
                    w-full py-4 rounded-xl font-black text-xl uppercase tracking-widest transition-all
                    ${!selectedItem || !targetItem || isRolling 
                        ? 'bg-dark-700 text-gray-500 cursor-not-allowed' 
                        : 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white shadow-lg shadow-purple-900/40 hover:scale-105'
                    }
                `}
             >
                 {isRolling ? 'Upgrading...' : 'Upgrade'}
             </button>
          </div>

          {/* Right: Target Selection */}
          <div className="bg-dark-800 rounded-xl border border-dark-600 flex flex-col h-[600px]">
             <div className="p-4 border-b border-dark-600 font-bold text-gray-300">Select Target</div>
             <div className="overflow-y-auto p-2 space-y-2 flex-grow scrollbar-hide">
                {availableTargets.map(item => (
                   <div 
                     key={item.id} 
                     onClick={() => !isRolling && setTargetItem(item)}
                     className={`flex items-center gap-3 p-2 rounded cursor-pointer border transition-all ${targetItem?.id === item.id ? 'bg-dark-700 border-green-500 shadow-[0_0_10px_rgba(34,197,94,0.3)]' : 'border-transparent hover:bg-dark-700'}`}
                   >
                      <img src={item.image} className="w-12 h-12 object-contain" alt="" />
                      <div className="flex-grow">
                         <div className="text-xs text-gray-300 truncate">{item.name}</div>
                         <div className="text-xs font-bold text-green-400">{formatMoney(item.price, user.currency)}</div>
                      </div>
                   </div>
                ))}
             </div>
          </div>

       </div>
    </div>
  );
};

export default Upgrade;
