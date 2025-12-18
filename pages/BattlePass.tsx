import React from 'react';
import { User, Rarity } from '../types';

interface BattlePassProps {
  user: User;
}

const BattlePass: React.FC<BattlePassProps> = ({ user }) => {
  const XP_PER_LEVEL = 1000;
  const level = Math.floor(user.xp / XP_PER_LEVEL) + 1;
  const progress = (user.xp % XP_PER_LEVEL) / (XP_PER_LEVEL / 100);

  const getReward = (lvl: number) => {
    if (lvl === 30) {
        return { type: 'gold', name: 'Butterfly Knife | Fade', img: 'https://wiki.swapskins.com/storage/skins/img/butterfly-knife-fade.png', rarity: Rarity.GOLD };
    }
    if (lvl % 5 === 0) {
        // Case Reward
        return { type: 'case', name: 'Winter Offensive Case', img: 'https://wiki.swapskins.com/storage/cases/img/winter-offensive-weapon-case.png', rarity: Rarity.CASE, caseId: 'c1' };
    }
    if (lvl % 3 === 0) {
        const amt = Math.min(10, lvl * 0.5).toFixed(2);
        return { type: 'money', val: `$${amt}` };
    }
    if (lvl % 7 === 0) {
         return { type: 'promo', code: `WINTER-${lvl}00`, desc: `+${lvl}% Bonus` };
    }
    // Default skin
    return { type: 'skin', name: 'P250 | Sand Dune', img: 'https://wiki.swapskins.com/storage/skins/img/p250-sand-dune.png', rarity: Rarity.COMMON };
  };

  const rewards = Array.from({ length: 30 }, (_, i) => ({ level: i + 1, ...getReward(i + 1) }));

  return (
    <div className="max-w-5xl mx-auto space-y-8">
        <div className="text-center">
            <h1 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-red-500 italic uppercase">
                Winter Battle Pass
            </h1>
            <p className="text-gray-400 mt-2">Open cases to earn XP. 1000 XP per level.</p>
        </div>

        {/* Status Bar */}
        <div className="bg-dark-800 p-6 rounded-xl border border-dark-600 flex flex-col md:flex-row items-center gap-6">
            <div className="flex items-center gap-4">
                <div className="w-20 h-20 rounded-full border-4 border-yellow-500 bg-dark-900 flex items-center justify-center text-3xl font-black text-yellow-500 shadow-[0_0_20px_rgba(234,179,8,0.3)]">
                    {level}
                </div>
                <div>
                    <div className="text-sm text-gray-500 font-bold uppercase">Current Level</div>
                    <div className="text-white font-bold text-xl">{user.xp} XP</div>
                </div>
            </div>
            
            <div className="flex-grow w-full">
                <div className="flex justify-between text-xs text-gray-400 mb-1 font-bold uppercase">
                    <span>Lvl {level}</span>
                    <span>Lvl {level + 1}</span>
                </div>
                <div className="h-6 bg-dark-900 rounded-full overflow-hidden border border-dark-600 relative">
                    <div 
                        className="absolute top-0 left-0 h-full bg-gradient-to-r from-yellow-600 to-yellow-400 transition-all duration-500"
                        style={{ width: `${progress}%` }}
                    ></div>
                    <div className="absolute inset-0 flex items-center justify-center text-[10px] font-bold text-white shadow-sm">
                        {Math.floor(progress)}%
                    </div>
                </div>
            </div>
        </div>

        {/* Timeline */}
        <div className="relative pt-10 pb-20 overflow-x-auto">
            <div className="absolute top-1/2 left-0 w-full h-1 bg-dark-600 -translate-y-1/2 z-0"></div>
            
            <div className="flex gap-8 min-w-max px-4">
                {rewards.map((reward) => {
                    const isUnlocked = level >= reward.level;
                    return (
                        <div key={reward.level} className={`relative z-10 w-40 flex flex-col items-center ${isUnlocked ? 'opacity-100' : 'opacity-50 grayscale'}`}>
                            {/* Level Marker */}
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm mb-4 border-2 ${isUnlocked ? 'bg-yellow-500 border-yellow-400 text-black' : 'bg-dark-800 border-gray-600 text-gray-500'}`}>
                                {reward.level}
                            </div>
                            
                            {/* Card */}
                            <div className="bg-dark-800 p-3 rounded-lg border border-dark-600 w-full flex flex-col items-center gap-2 group hover:-translate-y-2 transition-transform h-40 justify-between">
                                {reward.type === 'promo' ? (
                                    <div className="w-full flex-grow bg-gradient-to-br from-purple-900 to-indigo-900 rounded flex flex-col items-center justify-center p-2 text-center border border-purple-500/30">
                                        <div className="text-[10px] text-purple-300 uppercase font-bold">Promo Code</div>
                                        <div className="font-mono font-bold text-white text-sm bg-black/30 px-2 py-1 rounded my-1 select-all blur-[4px] hover:blur-none transition-all cursor-help">{reward.code}</div>
                                        <div className="text-[9px] text-gray-300">{reward.desc}</div>
                                    </div>
                                ) : reward.type === 'money' ? (
                                    <div className="w-full flex-grow bg-dark-700 rounded flex items-center justify-center border border-green-900">
                                        <span className="text-2xl font-bold text-green-400">{reward.val}</span>
                                    </div>
                                ) : (
                                    <div className="w-full flex-grow bg-dark-700 rounded flex items-center justify-center relative overflow-hidden">
                                        <div className={`absolute bottom-0 w-full h-1 ${reward.type === 'case' ? 'bg-blue-500' : 'bg-gray-500'}`}></div>
                                        <img src={reward.img} className={`object-contain drop-shadow-md ${reward.type === 'case' ? 'w-16 h-16' : 'w-20 h-20'}`} alt="" />
                                    </div>
                                )}
                                
                                <div className="text-center w-full">
                                    <div className="text-xs font-bold text-gray-300 truncate w-full px-1">
                                        {reward.name || 'Cash'}
                                    </div>
                                    <div className="text-[10px] text-gray-500 uppercase font-bold mt-1">
                                        {isUnlocked ? <span className="text-green-500">Inventory</span> : "Locked"}
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    </div>
  );
};

export default BattlePass;
