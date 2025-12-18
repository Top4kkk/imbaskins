import React, { useState } from 'react';
import { User, Item } from '../types';
import { formatMoney } from '../utils';
import SkinBetModal from '../components/SkinBetModal';
import WinModal from '../components/WinModal';

interface MinesProps {
  user: User;
  updateBalance: (amount: number) => void;
  addSkinToInventoryByValue: (value: number) => Item;
  setGameActive: (active: boolean) => void;
}

const MINES_COUNT_OPTIONS = [1, 3, 5, 10, 20, 24];
const GRID_SIZE = 25;

const Mines: React.FC<MinesProps> = ({ user, updateBalance, addSkinToInventoryByValue, setGameActive }) => {
  const [betItems, setBetItems] = useState<Item[]>([]);
  const [showSkinSelector, setShowSkinSelector] = useState(false);
  const [minesCount, setMinesCount] = useState<number>(3);
  const [isPlaying, setIsPlaying] = useState(false);
  const [grid, setGrid] = useState<('hidden' | 'gem' | 'mine')[]>(Array(GRID_SIZE).fill('hidden'));
  const [revealed, setRevealed] = useState<boolean[]>(Array(GRID_SIZE).fill(false));
  const [gameOver, setGameOver] = useState(false);
  const [multiplier, setMultiplier] = useState(1.0);
  const [profit, setProfit] = useState(0);
  const [showWinModal, setShowWinModal] = useState(false);
  const [wonSkin, setWonSkin] = useState<Item | undefined>(undefined);

  const betValue = betItems.reduce((acc, i) => acc + i.price, 0);

  const calculateNextMultiplier = (currentMult: number, revealedCount: number, totalMines: number) => {
     const remainingCells = GRID_SIZE - revealedCount;
     const safeCells = remainingCells - totalMines;
     if (safeCells <= 0) return currentMult;
     const rawOdds = remainingCells / safeCells;
     return currentMult * rawOdds * 0.99;
  };

  const startGame = () => {
    if (betItems.length === 0) return;
    setGameActive(true);
    const newGrid = Array(GRID_SIZE).fill('gem');
    let minesPlaced = 0;
    while (minesPlaced < minesCount) {
        const idx = Math.floor(Math.random() * GRID_SIZE);
        if (newGrid[idx] !== 'mine') {
            newGrid[idx] = 'mine';
            minesPlaced++;
        }
    }

    setGrid(newGrid);
    setRevealed(Array(GRID_SIZE).fill(false));
    setIsPlaying(true);
    setGameOver(false);
    setMultiplier(1.0);
    setProfit(0);
    setShowWinModal(false);
    setWonSkin(undefined);
  };

  const handleCellClick = (index: number) => {
    if (!isPlaying || revealed[index] || gameOver) return;

    const newRevealed = [...revealed];
    newRevealed[index] = true;
    setRevealed(newRevealed);

    if (grid[index] === 'mine') {
        // Boom - LOSS
        setProfit(0); 
        setGameOver(true);
        setIsPlaying(false);
        setRevealed(Array(GRID_SIZE).fill(true));
        updateBalance(-betValue); // Deduct value (simulate loss of items)
        setBetItems([]);
        setGameActive(false);
    } else {
        // Gem
        const gemsFound = newRevealed.filter((r, i) => r && grid[i] === 'gem').length;
        const nextMult = calculateNextMultiplier(multiplier, gemsFound - 1, minesCount);
        setMultiplier(nextMult);
        setProfit(betValue * nextMult);
    }
  };

  const cashout = () => {
    if (!isPlaying || gameOver) return;
    
    const totalWinValue = profit;
    // Instead of money, give a skin
    const skin = addSkinToInventoryByValue(totalWinValue);
    setWonSkin(skin);
    
    // Remove bet items (simulating trade up/bet logic where you risk old to get new)
    updateBalance(-betValue);

    setBetItems([]);
    setIsPlaying(false);
    setGameOver(true); 
    setRevealed(Array(GRID_SIZE).fill(true));
    setShowWinModal(true);
    setGameActive(false);
  };

  return (
    <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 relative">
       {showWinModal && (
           <WinModal 
             amount={profit} 
             item={wonSkin}
             currency={user.currency} 
             onClose={() => setShowWinModal(false)} 
           />
       )}
       
       {/* Sidebar Controls */}
       <div className="bg-dark-800 p-6 rounded-xl border border-dark-600 h-fit">
           <h2 className="text-2xl font-black italic mb-6 text-gray-200"><i className="fa-solid fa-bomb mr-2 text-red-500"></i>MINES</h2>
           
           <div className="space-y-4">
               <div>
                   <label className="text-xs text-gray-500 font-bold uppercase">Bet Items</label>
                   {betItems.length > 0 ? (
                       <div className="bg-dark-900 p-3 rounded border border-dark-600 mt-1 cursor-pointer hover:border-gray-500" onClick={() => !isPlaying && setShowSkinSelector(true)}>
                           <div className="flex justify-between text-sm font-bold text-white mb-2">
                               <span>{betItems.length} Skins</span>
                               <span className="text-green-400">{formatMoney(betValue, user.currency)}</span>
                           </div>
                           <div className="flex -space-x-2 overflow-hidden">
                               {betItems.slice(0, 5).map(i => (
                                   <img key={i.id} src={i.image} className="w-8 h-8 rounded-full bg-dark-700 border border-dark-600" alt=""/>
                               ))}
                           </div>
                       </div>
                   ) : (
                       <button 
                         onClick={() => setShowSkinSelector(true)}
                         disabled={isPlaying}
                         className="w-full mt-1 py-3 bg-dark-900 border border-dashed border-gray-600 text-gray-400 hover:text-white hover:border-white rounded transition-all"
                       >
                           Select Skins
                       </button>
                   )}
               </div>

               <div>
                   <label className="text-xs text-gray-500 font-bold uppercase">Mines Count</label>
                   <div className="grid grid-cols-3 gap-2 mt-1">
                       {MINES_COUNT_OPTIONS.map(count => (
                           <button
                             key={count}
                             onClick={() => setMinesCount(count)}
                             disabled={isPlaying}
                             className={`py-2 rounded font-bold text-sm transition-colors border ${minesCount === count ? 'bg-red-500/20 border-red-500 text-red-400' : 'bg-dark-900 border-dark-600 text-gray-400 hover:bg-dark-700'}`}
                           >
                               {count}
                           </button>
                       ))}
                   </div>
               </div>

               <div className="pt-4 border-t border-dark-600">
                   {!isPlaying ? (
                       <button 
                         onClick={startGame}
                         disabled={betItems.length === 0}
                         className="w-full py-4 bg-green-500 hover:bg-green-400 text-dark-900 font-black text-xl rounded shadow-[0_0_15px_rgba(34,197,94,0.4)] disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                       >
                           PLAY
                       </button>
                   ) : (
                       <button 
                         onClick={cashout}
                         className="w-full py-4 bg-yellow-500 hover:bg-yellow-400 text-dark-900 font-black text-xl rounded shadow-[0_0_15px_rgba(234,179,8,0.4)] transition-all flex flex-col items-center leading-tight"
                       >
                           <span>CASHOUT</span>
                           <span className="text-sm font-mono">{formatMoney(profit, user.currency)}</span>
                       </button>
                   )}
               </div>
           </div>
       </div>

       {/* Game Grid */}
       <div className="md:col-span-2 bg-dark-800 p-6 rounded-xl border border-dark-600 relative overflow-hidden">
           {isPlaying && (
               <div className="absolute top-4 right-4 bg-dark-900 border border-green-500/50 px-4 py-2 rounded-lg z-10">
                   <div className="text-green-400 font-mono font-bold text-2xl">x{multiplier.toFixed(2)}</div>
               </div>
           )}

           <div className="grid grid-cols-5 gap-3 max-w-md mx-auto aspect-square">
               {grid.map((cell, idx) => {
                   const isRevealed = revealed[idx];
                   let content = null;
                   let style = "bg-dark-700 hover:bg-dark-600 cursor-pointer shadow-[inset_0_-4px_0_rgba(0,0,0,0.3)]";
                   
                   if (isRevealed) {
                       if (cell === 'mine') {
                           style = "bg-red-900/50 border border-red-500";
                           content = <i className="fa-solid fa-bomb text-3xl text-red-500 animate-pulse"></i>;
                       } else {
                           style = "bg-green-900/50 border border-green-500";
                           content = <i className="fa-solid fa-gem text-3xl text-green-400 animate-bounce"></i>;
                       }
                   }

                   if (gameOver && cell === 'mine' && !isRevealed) {
                        content = <i className="fa-solid fa-bomb text-2xl text-red-500/50"></i>;
                   }

                   return (
                       <button
                         key={idx}
                         onClick={() => handleCellClick(idx)}
                         disabled={!isPlaying || isRevealed || gameOver}
                         className={`rounded-xl flex items-center justify-center transition-all duration-200 active:scale-95 ${style}`}
                       >
                           {content}
                       </button>
                   );
               })}
           </div>
       </div>

       {showSkinSelector && (
           <SkinBetModal 
             user={user}
             onConfirm={(items) => {
                 setBetItems(items);
                 setShowSkinSelector(false);
             }}
             onCancel={() => setShowSkinSelector(false)}
           />
       )}
    </div>
  );
};

export default Mines;
