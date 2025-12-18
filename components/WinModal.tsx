import React from 'react';
import { formatMoney } from '../utils';
import { Item, Rarity } from '../types';
import { RARITY_COLORS } from '../constants';

interface WinModalProps {
  amount: number;
  item?: Item; // Optional item won
  currency: 'USD' | 'RUB';
  onClose: () => void;
}

const WinModal: React.FC<WinModalProps> = ({ amount, item, currency, onClose }) => {
  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm animate-in fade-in duration-300">
        <div className="bg-dark-800 p-8 rounded-2xl border border-green-500 text-center shadow-2xl animate-bounce-slow max-w-sm w-full mx-4 relative overflow-hidden">
            {/* BG Effect */}
            {item && <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full blur-[80px] opacity-30 ${RARITY_COLORS[item.rarity].split(' ')[1].replace('text-', 'bg-')}`}></div>}

            <div className="relative z-10">
                <div className="w-20 h-20 mx-auto bg-green-500/20 rounded-full flex items-center justify-center mb-4">
                    <i className="fa-solid fa-trophy text-4xl text-green-400"></i>
                </div>
                <h3 className="text-3xl font-black text-white italic uppercase tracking-wider">You Won!</h3>
                
                {item ? (
                    <div className="my-4">
                        <img src={item.image} alt={item.name} className="w-40 h-40 object-contain mx-auto drop-shadow-lg" />
                        <div className={`text-xs font-bold uppercase mt-2 ${RARITY_COLORS[item.rarity].split(' ')[1]}`}>{item.rarity}</div>
                        <div className="text-white font-bold text-sm truncate px-2">{item.name}</div>
                    </div>
                ) : null}

                <div className="text-4xl font-black text-green-400 my-4 font-mono drop-shadow-md">
                    {formatMoney(amount, currency)}
                </div>
                <button 
                    onClick={onClose} 
                    className="w-full py-3 bg-gray-700 hover:bg-gray-600 rounded-lg text-white font-bold transition-colors"
                >
                    Collect
                </button>
            </div>
        </div>
    </div>
  );
};

export default WinModal;
