import React, { useState } from 'react';
import { User } from '../types';

interface DepositModalProps {
  user: User;
  onClose: () => void;
  onDeposit: (amount: number, promoCode: string) => void;
}

const DepositModal: React.FC<DepositModalProps> = ({ user, onClose, onDeposit }) => {
  const [amount, setAmount] = useState<string>('10');
  const [promo, setPromo] = useState('');
  const [method, setMethod] = useState('card');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseFloat(amount);
    if (val > 0) {
        onDeposit(val, promo);
        onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="bg-dark-800 w-full max-w-md rounded-2xl border border-dark-600 shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="p-6 border-b border-dark-600 flex justify-between items-center bg-dark-900">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <i className="fa-solid fa-wallet text-green-500"></i> Add Funds
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
              <i className="fa-solid fa-xmark fa-xl"></i>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Payment Methods */}
            <div className="grid grid-cols-3 gap-2">
                {['card', 'crypto', 'paypal'].map(m => (
                    <button
                        key={m}
                        type="button"
                        onClick={() => setMethod(m)}
                        className={`py-3 rounded-lg border flex flex-col items-center gap-1 transition-all ${method === m ? 'bg-green-500/10 border-green-500 text-green-400' : 'bg-dark-700 border-dark-600 text-gray-400 hover:bg-dark-600'}`}
                    >
                        <i className={`fa-solid ${m === 'card' ? 'fa-credit-card' : m === 'crypto' ? 'fa-bitcoin-sign' : 'fa-paypal'} text-xl`}></i>
                        <span className="text-[10px] uppercase font-bold">{m}</span>
                    </button>
                ))}
            </div>

            {/* Amount */}
            <div>
                <label className="text-xs text-gray-400 font-bold uppercase mb-1 block">Amount ({user.currency})</label>
                <div className="relative">
                    <span className="absolute left-4 top-3.5 text-gray-400">{user.currency === 'USD' ? '$' : '₽'}</span>
                    <input 
                        type="number"
                        value={amount}
                        onChange={e => setAmount(e.target.value)}
                        className="w-full bg-dark-900 border border-dark-600 rounded-lg py-3 pl-8 pr-4 text-white font-mono focus:border-green-500 outline-none transition-colors"
                        min="1"
                    />
                </div>
                <div className="flex gap-2 mt-2">
                    {[5, 10, 25, 50, 100].map(val => (
                        <button 
                            key={val}
                            type="button"
                            onClick={() => setAmount(val.toString())}
                            className="flex-1 py-1 bg-dark-700 rounded text-xs text-gray-400 hover:bg-dark-600 hover:text-white transition-colors"
                        >
                            +{val}
                        </button>
                    ))}
                </div>
            </div>

            {/* Promo */}
            <div>
                <label className="text-xs text-gray-400 font-bold uppercase mb-1 block">Promo Code</label>
                <input 
                    type="text"
                    value={promo}
                    onChange={e => setPromo(e.target.value)}
                    placeholder="Enter code (optional)"
                    className="w-full bg-dark-900 border border-dark-600 rounded-lg p-3 text-white focus:border-blue-500 outline-none transition-colors uppercase"
                />
            </div>

            <button 
                type="submit"
                className="w-full py-4 bg-green-500 hover:bg-green-400 text-dark-900 font-black uppercase rounded-lg shadow-lg shadow-green-500/20 transition-all"
            >
                Pay Now
            </button>
        </form>
      </div>
    </div>
  );
};

export default DepositModal;
