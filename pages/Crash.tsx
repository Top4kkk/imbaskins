import React, { useState, useEffect, useRef } from 'react';
import { User, Item } from '../types';
import { formatMoney } from '../utils';
import SkinBetModal from '../components/SkinBetModal';
import WinModal from '../components/WinModal';

interface CrashProps {
  user: User;
  onWin: (amount: number) => void;
  onLoss: (itemIds: string[]) => void;
  addSkinToInventoryByValue: (value: number) => Item;
  setGameActive: (active: boolean) => void;
}

const Crash: React.FC<CrashProps> = ({ user, onWin, onLoss, addSkinToInventoryByValue, setGameActive }) => {
  const [multiplier, setMultiplier] = useState(1.00);
  const [phase, setPhase] = useState<'idle' | 'betting' | 'running' | 'crashed'>('idle');
  const [betItems, setBetItems] = useState<Item[]>([]);
  const [showSkinSelector, setShowSkinSelector] = useState(false);
  const [timer, setTimer] = useState(10);
  const [crashPoint, setCrashPoint] = useState(0);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [showWinModal, setShowWinModal] = useState(false);
  const [winAmount, setWinAmount] = useState(0);
  const [wonSkin, setWonSkin] = useState<Item | undefined>(undefined);
  
  const betValue = betItems.reduce((acc, i) => acc + i.price, 0);

  // Animation Loop
  useEffect(() => {
    let animId: number;
    let lastTime = Date.now();

    if (phase === 'running') {
       const run = () => {
          const now = Date.now();
          const dt = (now - lastTime) / 1000;
          lastTime = now;

          setMultiplier(prev => {
             const growth = prev * 0.3 * dt; 
             const next = prev + growth;
             if (next >= crashPoint) {
                 setPhase('crashed');
                 setMultiplier(crashPoint);
                 // Loss Logic
                 if (betItems.length > 0) {
                    onLoss(betItems.map(i => i.id));
                    setBetItems([]);
                    setGameActive(false);
                 }
                 return crashPoint;
             }
             return next;
          });

          if (phase === 'running') animId = requestAnimationFrame(run);
       };
       animId = requestAnimationFrame(run);
    }
    return () => cancelAnimationFrame(animId);
  }, [phase, crashPoint, betItems, onLoss, setGameActive]);

  // Canvas Drawing
  useEffect(() => {
     const cvs = canvasRef.current;
     if (!cvs) return;
     const ctx = cvs.getContext('2d');
     if (!ctx) return;

     // Resize
     const parent = cvs.parentElement;
     if (parent) {
         cvs.width = parent.clientWidth;
         cvs.height = parent.clientHeight;
     }

     ctx.clearRect(0, 0, cvs.width, cvs.height);

     if (phase === 'running' || phase === 'crashed') {
         ctx.beginPath();
         ctx.moveTo(0, cvs.height);
         
         const progress = Math.min(1, (multiplier - 1) / 10); 
         
         const endX = cvs.width * 0.8;
         const endY = cvs.height * (1 - progress * 0.8);
         
         ctx.quadraticCurveTo(cvs.width * 0.4, cvs.height, endX, endY);
         
         ctx.strokeStyle = phase === 'crashed' ? '#ef4444' : '#22c55e';
         ctx.lineWidth = 4;
         ctx.stroke();

         // Dot
         ctx.beginPath();
         ctx.arc(endX, endY, 6, 0, Math.PI * 2);
         ctx.fillStyle = '#fff';
         ctx.fill();
         
         // Fill Gradient
         ctx.lineTo(endX, cvs.height);
         ctx.lineTo(0, cvs.height);
         ctx.fillStyle = phase === 'crashed' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(34, 197, 94, 0.1)';
         ctx.fill();
     }
  }, [multiplier, phase]);

  // Countdown Timer
  useEffect(() => {
      let interval: ReturnType<typeof setInterval>;
      if (phase === 'betting') {
          interval = setInterval(() => {
              setTimer(prev => {
                  if (prev <= 1) {
                      // Start Game
                      const point = 1 + Math.random() * Math.random() * 20; 
                      setCrashPoint(Math.max(1.01, point));
                      setPhase('running');
                      return 0;
                  }
                  return prev - 1;
              });
          }, 1000);
      }
      return () => clearInterval(interval);
  }, [phase]);

  const startBetting = () => {
     setPhase('betting');
     setTimer(10);
     setMultiplier(1.00);
     setShowWinModal(false);
     setGameActive(true);
  };

  const cashout = () => {
      if (phase !== 'running') return;
      const profit = betValue * multiplier;
      setWinAmount(profit);
      
      // Award Skin
      const skin = addSkinToInventoryByValue(profit);
      setWonSkin(skin);
      
      // Remove old skins
      onLoss(betItems.map(i => i.id)); 
      
      setBetItems([]); // Clear active bet
      setShowWinModal(true);
      // User doesn't lose, they just leave with profit. Game technically runs in background but user is "safe"
      setGameActive(false);
  };

  return (
    <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6 relative">
        {showWinModal && (
            <WinModal 
                amount={winAmount} 
                item={wonSkin}
                currency={user.currency} 
                onClose={() => setShowWinModal(false)} 
            />
        )}

        {/* Left: Controls */}
        <div className="bg-dark-800 rounded-xl border border-dark-600 p-6 flex flex-col h-[600px]">
            <h2 className="text-2xl font-black italic text-gray-200 mb-6 flex items-center gap-2">
                <i className="fa-solid fa-chart-line text-red-500"></i> CRASH
            </h2>

            <div className="flex-grow">
                <div className="text-sm text-gray-400 mb-2 font-bold uppercase">Current Bet</div>
                {betItems.length > 0 ? (
                    <div className="bg-dark-900 rounded p-4 border border-dark-600">
                        <div className="flex items-center gap-2 mb-2">
                            <span className="text-white font-bold">{betItems.length} Skins</span>
                            <span className="text-green-400 font-mono">
                                {formatMoney(betValue, user.currency)}
                            </span>
                        </div>
                        <div className="flex -space-x-2 overflow-hidden">
                            {betItems.slice(0, 5).map(i => (
                                <img key={i.id} src={i.image} className="w-10 h-10 rounded-full border border-dark-800 bg-dark-700" alt=""/>
                            ))}
                            {betItems.length > 5 && (
                                <div className="w-10 h-10 rounded-full border border-dark-800 bg-dark-700 flex items-center justify-center text-xs text-gray-400">
                                    +{betItems.length - 5}
                                </div>
                            )}
                        </div>
                    </div>
                ) : (
                    <div className="text-gray-600 italic">No skins selected</div>
                )}
            </div>
            
            <div className="mt-6 space-y-4">
                {phase === 'idle' || phase === 'crashed' ? (
                     <button 
                       onClick={() => setShowSkinSelector(true)}
                       className="w-full py-4 bg-blue-600 hover:bg-blue-500 text-white font-black uppercase rounded shadow-lg transition-all"
                     >
                        Select Skins
                     </button>
                ) : null}

                {phase === 'idle' || phase === 'crashed' ? (
                     <button 
                       onClick={startBetting}
                       disabled={betItems.length === 0}
                       className="w-full py-4 bg-green-500 hover:bg-green-400 disabled:bg-gray-700 disabled:text-gray-500 text-dark-900 font-black uppercase rounded shadow-lg transition-all"
                     >
                        Start Round
                     </button>
                ) : phase === 'betting' ? (
                    <div className="w-full py-4 bg-gray-700 text-white font-black uppercase rounded text-center">
                        Starting in {timer}s
                    </div>
                ) : (
                    <button 
                       onClick={cashout}
                       disabled={betItems.length === 0} // Already cashed out
                       className={`w-full py-4 font-black uppercase rounded shadow-lg transition-all ${betItems.length === 0 ? 'bg-gray-700 text-gray-400' : 'bg-yellow-500 hover:bg-yellow-400 text-dark-900'}`}
                     >
                        {betItems.length === 0 ? 'Cashed Out' : `Cashout ${formatMoney(betValue * multiplier, user.currency)}`}
                     </button>
                )}
            </div>
        </div>

        {/* Right: Graph */}
        <div className="lg:col-span-2 bg-dark-800 rounded-xl border border-dark-600 relative overflow-hidden flex items-center justify-center">
             <canvas ref={canvasRef} className="absolute inset-0 w-full h-full z-0" />
             
             <div className="relative z-10 text-center">
                 {phase === 'betting' && (
                     <div className="text-5xl font-black text-white animate-pulse">
                         {timer}s
                     </div>
                 )}
                 {(phase === 'running' || phase === 'crashed') && (
                     <div className={`text-8xl font-black font-mono ${phase === 'crashed' ? 'text-red-500' : 'text-white'}`}>
                         {multiplier.toFixed(2)}x
                     </div>
                 )}
                 {phase === 'crashed' && (
                     <div className="text-red-500 font-bold uppercase tracking-widest mt-2">Crashed</div>
                 )}
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

export default Crash;
