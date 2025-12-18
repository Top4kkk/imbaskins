import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { CASES, RARITY_COLORS } from '../constants';
import { User, Item, Rarity } from '../types';
import { formatMoney } from '../utils';

interface CaseOpenProps {
  user: User;
  updateBalance: (amount: number) => void;
  addItemToInventory: (item: Item) => void;
  addXp: (amount: number) => void;
  setGameActive: (active: boolean) => void;
}

const ITEM_WIDTH = 200; 
const VISIBLE_ITEMS = 5; 
const TRANSITION_DURATION = 6000; 

const CaseOpen: React.FC<CaseOpenProps> = ({ user, updateBalance, addItemToInventory, addXp, setGameActive }) => {
  const { caseId } = useParams<{ caseId: string }>();
  const currentCase = CASES.find(c => c.id === caseId);
  
  const [isRolling, setIsRolling] = useState(false);
  const [wonItems, setWonItems] = useState<Item[]>([]);
  // We now use an array of strips for multi-open
  const [strips, setStrips] = useState<{ id: number, items: Item[] }[]>([]);
  const [openCount, setOpenCount] = useState(1); 
  const [showResults, setShowResults] = useState(false);
  const scrollRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [showModal, setShowModal] = useState(false);

  const selectRandomItem = (items: Item[]): Item => {
    const totalWeight = items.reduce((acc, item) => {
        let weight = 0;
        switch(item.rarity) {
            case Rarity.COMMON: weight = 1000; break;
            case Rarity.INDUSTRIAL: weight = 500; break;
            case Rarity.MIL_SPEC: weight = 200; break;
            case Rarity.RESTRICTED: weight = 80; break;
            case Rarity.CLASSIFIED: weight = 25; break;
            case Rarity.COVERT: weight = 8; break;
            case Rarity.GOLD: weight = 2; break;
            default: weight = 10;
        }
        return acc + weight;
    }, 0);

    let random = Math.random() * totalWeight;
    for (const item of items) {
        let weight = 0;
        switch(item.rarity) {
            case Rarity.COMMON: weight = 1000; break;
            case Rarity.INDUSTRIAL: weight = 500; break;
            case Rarity.MIL_SPEC: weight = 200; break;
            case Rarity.RESTRICTED: weight = 80; break;
            case Rarity.CLASSIFIED: weight = 25; break;
            case Rarity.COVERT: weight = 8; break;
            case Rarity.GOLD: weight = 2; break;
            default: weight = 10;
        }
        if (random < weight) return item;
        random -= weight;
    }
    return items[0];
  };

  // Static preview line for idle state
  useEffect(() => {
    if (!currentCase) return;
    const tempLine: Item[] = [];
    for(let i=0; i<VISIBLE_ITEMS + 2; i++) {
        tempLine.push(currentCase.items[Math.floor(Math.random() * currentCase.items.length)]);
    }
    setStrips([{ id: 0, items: tempLine }]);
  }, [currentCase]);

  const handleOpen = () => {
    if (!currentCase || isRolling || user.balance < (currentCase.price * openCount)) return;

    // Deduct Balance
    const totalCost = currentCase.price * openCount;
    updateBalance(-totalCost);
    addXp(Math.floor(totalCost * 10));

    setIsRolling(true);
    setGameActive(true);
    setShowResults(false);
    setShowModal(false);
    setWonItems([]);
    scrollRefs.current = [];

    const winners: Item[] = [];
    const newStrips: { id: number, items: Item[] }[] = [];
    const TARGET_INDEX = 40;
    const TOTAL_ITEMS = 50;

    for(let i=0; i<openCount; i++) {
        const w = selectRandomItem(currentCase.items);
        const winner = {...w, id: `${w.id}_won_${Date.now()}_${i}`};
        winners.push(winner);

        // Build strip where winner is GUARANTEED at TARGET_INDEX
        const stripItems: Item[] = [];
        for (let j = 0; j < TOTAL_ITEMS; j++) {
            if (j === TARGET_INDEX) {
                stripItems.push(winner);
            } else {
                stripItems.push(selectRandomItem(currentCase.items));
            }
        }
        newStrips.push({ id: i, items: stripItems });
    }

    setStrips(newStrips);

    // Start Animation logic
    // We need a slight delay to let DOM render the strips at position 0
    setTimeout(() => {
        scrollRefs.current.forEach((ref) => {
            if (ref) {
                const cardCenter = ITEM_WIDTH / 2;
                const containerCenter = ref.parentElement!.clientWidth / 2;
                const jitter = (Math.random() - 0.5) * (ITEM_WIDTH * 0.8);
                const scrollAmount = (TARGET_INDEX * ITEM_WIDTH) - containerCenter + cardCenter + jitter;

                ref.style.transition = `transform ${TRANSITION_DURATION}ms cubic-bezier(0.15, 0.9, 0.3, 1)`;
                ref.style.transform = `translateX(-${scrollAmount}px)`;
            }
        });
    }, 50);

    setTimeout(() => {
        setIsRolling(false);
        setWonItems(winners);
        setGameActive(false);
        
        if (openCount === 1) {
             setShowModal(true);
        } else {
             setShowResults(true);
             winners.forEach(w => addItemToInventory(w));
        }
    }, TRANSITION_DURATION + 300);
  };

  // Helper to remove duplicates for display list
  const uniqueDisplayItems = React.useMemo(() => {
    if (!currentCase) return [];
    const seen = new Set();
    return currentCase.items.filter(item => {
      if (seen.has(item.name)) return false;
      seen.add(item.name);
      return true;
    }).sort((a,b) => b.price - a.price);
  }, [currentCase]);


  if (!currentCase) return <div className="text-center p-20">Case not found</div>;

  return (
    <div className="max-w-6xl mx-auto space-y-8">
       {/* Breadcrumbs */}
       <div className="flex items-center text-sm text-gray-400 gap-2">
         <Link to="/" className="hover:text-white">Cases</Link>
         <span>/</span>
         <span className="text-white font-bold">{currentCase.name}</span>
       </div>

       {/* Game Area */}
       <div className="bg-dark-800 border-y-4 border-dark-600 min-h-[300px] flex flex-col justify-center shadow-2xl relative overflow-hidden">
          
          {/* ROULETTE STRIPS */}
          {!showResults && strips.map((strip, idx) => (
             <div key={strip.id} className="relative h-48 border-b border-dark-700 last:border-0">
                <div className="absolute top-0 bottom-0 left-1/2 w-1 bg-yellow-500 z-20 shadow-[0_0_15px_rgba(234,179,8,0.8)]"></div>
                <div 
                   ref={(el) => { scrollRefs.current[idx] = el; }}
                   className="flex items-center h-full pl-[50%]"
                   style={{ willChange: 'transform' }}
                >
                   {strip.items.map((item, index) => (
                      <div 
                        key={`${index}-${item.id}`} 
                        className="flex-shrink-0 flex flex-col items-center justify-center p-2"
                        style={{ width: `${ITEM_WIDTH}px` }}
                      >
                          <div className={`relative w-32 h-32 bg-dark-700 rounded-lg border-b-4 flex items-center justify-center p-2 ${RARITY_COLORS[item.rarity]}`}>
                               <img src={item.image} alt={item.name} className="w-full h-full object-contain drop-shadow-md" />
                          </div>
                      </div>
                   ))}
                </div>
             </div>
          ))}

          {/* MULTI OPEN RESULTS GRID */}
          {showResults && (
              <div className="flex flex-wrap justify-center gap-4 p-8 animate-in fade-in zoom-in duration-500">
                  {wonItems.map((item, idx) => (
                      <div key={idx} className="flex flex-col items-center bg-dark-700 p-4 rounded-xl border border-dark-600 animate-bounce-slow" style={{ animationDelay: `${idx * 0.1}s` }}>
                          <div className={`relative w-32 h-32 mb-2 flex items-center justify-center ${RARITY_COLORS[item.rarity].split(' ')[1]}`}>
                              <img src={item.image} className="w-full h-full object-contain" alt="" />
                          </div>
                          <div className={`text-[10px] font-bold uppercase ${RARITY_COLORS[item.rarity].split(' ')[1]}`}>{item.rarity}</div>
                          <div className="text-xs text-white truncate w-32 text-center">{item.name}</div>
                          <div className="text-sm font-bold text-green-400">{formatMoney(item.price, user.currency)}</div>
                      </div>
                  ))}
              </div>
          )}
       </div>

       {/* Controls */}
       <div className="flex flex-col items-center gap-6 mt-8">
           <div className="flex bg-dark-800 rounded-lg p-1 border border-dark-600">
               {[1, 2, 3, 4, 5].map(num => (
                   <button
                     key={num}
                     onClick={() => {
                        setOpenCount(num);
                        // Reset preview strip
                        setStrips(prev => prev.slice(0, 1)); // Keep 1 just for visual or reset completely
                     }}
                     disabled={isRolling}
                     className={`px-4 py-2 rounded font-bold transition-all ${openCount === num ? 'bg-dark-600 text-white' : 'text-gray-500 hover:text-gray-300'}`}
                   >
                       x{num}
                   </button>
               ))}
           </div>

           <button 
             onClick={handleOpen}
             disabled={isRolling || user.balance < (currentCase.price * openCount)}
             className={`px-16 py-5 rounded-lg font-black text-2xl tracking-wider transition-all transform
                ${isRolling || user.balance < (currentCase.price * openCount)
                  ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                  : 'bg-green-500 text-dark-900 hover:bg-green-400 hover:scale-105 shadow-[0_0_30px_rgba(34,197,94,0.4)]'
                }
             `}
           >
              {isRolling ? 'OPENING...' : `OPEN FOR ${formatMoney(currentCase.price * openCount, user.currency)}`}
           </button>
       </div>

       {/* Win Modal for Single Open */}
       {showModal && wonItems.length === 1 && (
           <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm animate-in fade-in zoom-in duration-300">
               <div className="bg-dark-800 p-1 bg-gradient-to-b from-dark-700 to-dark-900 rounded-2xl border border-dark-500 shadow-2xl max-w-md w-full mx-4 relative overflow-hidden">
                   <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full blur-[80px] opacity-40 ${RARITY_COLORS[wonItems[0].rarity].split(' ')[1].replace('text-', 'bg-')}`}></div>
                   
                   <div className="relative z-10 flex flex-col items-center p-8 text-center">
                       <h2 className="text-3xl font-black text-white italic mb-2 uppercase tracking-widest drop-shadow-md">You Won!</h2>
                       
                       <div className="my-6 relative">
                          <img src={wonItems[0].image} alt={wonItems[0].name} className="w-48 h-48 object-contain" />
                       </div>
                       
                       <div className={`text-sm font-bold uppercase tracking-widest mb-1 ${RARITY_COLORS[wonItems[0].rarity].split(' ')[1]}`}>
                           {wonItems[0].rarity}
                       </div>
                       <h3 className="text-xl font-bold text-white mb-6">{wonItems[0].name}</h3>
                       
                       <div className="flex gap-3 w-full">
                           <button onClick={() => { updateBalance(wonItems[0].price); setShowModal(false); }} className="flex-1 py-3 bg-dark-600 rounded hover:bg-dark-500 font-bold text-gray-300">
                               Sell {formatMoney(wonItems[0].price, user.currency)}
                           </button>
                           <button onClick={() => { addItemToInventory(wonItems[0]); setShowModal(false); }} className="flex-1 py-3 bg-green-600 rounded hover:bg-green-500 font-bold text-white shadow-lg shadow-green-900/50">
                               Keep
                           </button>
                       </div>
                   </div>
               </div>
           </div>
       )}

       {/* Case Contents Preview */}
       <div className="bg-dark-800 rounded-xl p-6 border border-dark-600">
           <h3 className="text-xl font-bold mb-4 text-gray-300">Case Contents</h3>
           <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
               {uniqueDisplayItems.map((item, idx) => (
                  <div key={`${item.id}_${idx}`} className={`group p-3 rounded bg-dark-700 border border-transparent hover:border-gray-500 transition-colors relative overflow-hidden`}>
                      <div className={`absolute bottom-0 left-0 right-0 h-1 ${item.rarity === Rarity.GOLD ? 'bg-yellow-500' : item.rarity === Rarity.COVERT ? 'bg-red-500' : item.rarity === Rarity.CLASSIFIED ? 'bg-pink-500' : 'bg-blue-500'}`}></div>
                      <div className="flex justify-between text-[10px] text-gray-400 font-mono mb-2">
                          <span>{item.rarity}</span>
                          <span className="text-gray-200">{formatMoney(item.price, user.currency)}</span>
                      </div>
                      <img src={item.image} alt={item.name} className="w-full h-24 object-contain mb-2 group-hover:scale-105 transition-transform" />
                      <div className="text-xs text-center text-gray-300 truncate">{item.name}</div>
                  </div>
               ))}
           </div>
       </div>
    </div>
  );
};

export default CaseOpen;