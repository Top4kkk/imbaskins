import React, { useMemo } from 'react';
import { CASES, getRealItem, RARITY_COLORS } from '../constants';
import { Link } from 'react-router-dom';
import { User, Rarity } from '../types';
import { formatMoney } from '../utils';

interface HomeProps {
  user: User;
}

const Home: React.FC<HomeProps> = ({ user }) => {
  // Generate dummy live drops
  const liveDrops = useMemo(() => {
     return Array.from({length: 8}, (_, i) => {
         // Get high tier items only for "Live Drops" effect
         const item = getRealItem(Math.random() > 0.7 ? Rarity.COVERT : Rarity.CLASSIFIED);
         return {
             id: i,
             user: `User${Math.floor(Math.random()*9000)+1000}`,
             item,
             time: `${Math.floor(Math.random()*50)+1}s ago`
         }
     })
  }, []);

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="relative rounded-2xl overflow-hidden bg-gradient-to-r from-dark-800 to-indigo-900/50 border border-dark-600 p-8 md:p-12 text-center md:text-left">
        <div className="relative z-10 max-w-2xl">
          <h1 className="text-4xl md:text-6xl font-black mb-4 tracking-tighter">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
              WINTER EVENT
            </span> 
            <br /> IS LIVE
          </h1>
          <p className="text-gray-300 text-lg mb-6">
            Open the new exclusive winter cases with increased chances for Gold items. 
            Limited time only!
          </p>
          <div className="flex gap-4 justify-center md:justify-start">
             <a href="#cases" className="px-8 py-3 bg-white text-dark-900 font-bold rounded hover:bg-gray-200 transition-colors">
               Open Cases
             </a>
             <Link to="/upgrade" className="px-8 py-3 bg-indigo-600 text-white font-bold rounded hover:bg-indigo-500 transition-colors">
               Try Upgrade
             </Link>
          </div>
        </div>
        <div className="absolute right-0 top-0 bottom-0 w-1/2 bg-[url('https://wiki.swapskins.com/storage/skins/img/awp-gungnir.png')] bg-contain bg-no-repeat bg-right opacity-20 mask-image-gradient"></div>
      </div>

      {/* Live Drops */}
      <div className="bg-dark-800 rounded-xl border border-dark-600 overflow-hidden">
          <div className="p-4 border-b border-dark-600 flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
              <span className="font-bold text-gray-300 uppercase tracking-wider text-xs">Live Drops</span>
          </div>
          <div className="flex overflow-x-auto p-4 gap-4 scrollbar-hide">
              {liveDrops.map(drop => (
                  <div key={drop.id} className="min-w-[140px] bg-dark-700 rounded-lg p-3 border border-dark-600 flex flex-col items-center gap-2 relative group hover:scale-105 transition-transform">
                      <div className={`absolute top-0 left-0 w-full h-1 rounded-t-lg ${RARITY_COLORS[drop.item.rarity].split(' ')[1].replace('text-', 'bg-')}`}></div>
                      <img src={drop.item.image} className="w-16 h-16 object-contain" alt=""/>
                      <div className="text-center w-full">
                          <div className="text-[10px] text-gray-400 truncate w-full">{drop.item.name}</div>
                          <div className={`text-xs font-bold ${RARITY_COLORS[drop.item.rarity].split(' ')[1]}`}>{formatMoney(drop.item.price, user.currency)}</div>
                      </div>
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center transition-opacity rounded-lg backdrop-blur-sm">
                          <div className="text-xs font-bold text-white">{drop.user}</div>
                          <div className="text-[10px] text-gray-400">{drop.time}</div>
                      </div>
                  </div>
              ))}
          </div>
      </div>

      {/* Stats Bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-dark-800 rounded-xl p-4 border border-dark-600">
         <div className="text-center">
            <div className="text-2xl font-bold text-green-400">24K+</div>
            <div className="text-xs text-gray-500 uppercase tracking-widest">Cases Opened Today</div>
         </div>
         <div className="text-center">
            <div className="text-2xl font-bold text-orange-400">1.2K</div>
            <div className="text-xs text-gray-500 uppercase tracking-widest">Users Online</div>
         </div>
         <div className="text-center">
            <div className="text-2xl font-bold text-purple-400">$450K</div>
            <div className="text-xs text-gray-500 uppercase tracking-widest">Items Upgraded</div>
         </div>
         <div className="text-center">
            <div className="text-2xl font-bold text-blue-400">98%</div>
            <div className="text-xs text-gray-500 uppercase tracking-widest">RTP Rate</div>
         </div>
      </div>

      {/* Cases Grid */}
      <div id="cases">
        <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
          <i className="fa-solid fa-box text-rarity-gold"></i> Available Cases
        </h2>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {CASES.map((box) => (
            <Link 
              key={box.id} 
              to={`/case/${box.id}`}
              className="group relative bg-dark-800 border border-dark-600 rounded-xl p-4 hover:border-rarity-milspec hover:shadow-lg hover:shadow-rarity-milspec/10 transition-all duration-300 flex flex-col items-center"
            >
              {/* Image with glow effect */}
              <div className="relative w-32 h-32 mb-4 group-hover:scale-110 transition-transform duration-300">
                 <div className="absolute inset-0 bg-blue-500/20 blur-xl rounded-full group-hover:bg-blue-500/40 transition-colors"></div>
                 <img src={box.image} alt={box.name} className="relative z-10 w-full h-full object-contain drop-shadow-lg" />
              </div>
              
              <h3 className="font-bold text-center text-gray-200 group-hover:text-white">{box.name}</h3>
              
              <div className="mt-2 text-sm font-bold text-green-400 bg-dark-900/50 px-3 py-1 rounded border border-dark-600 group-hover:bg-green-500 group-hover:text-white transition-colors">
                {formatMoney(box.price, user.currency)}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;
