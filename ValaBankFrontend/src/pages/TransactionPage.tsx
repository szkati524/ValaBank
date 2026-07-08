import React, { useState } from 'react';


interface TransactionRequestDTO {
  senderId: number;
  receiverId: number;
  amount: number;
  title: string;
  currency: string;
}


const CURRENT_USER = {
  id: 1,
  dailyLimit: 5000.00,
  monthlyLimit: 20000.00,
  isSmartSaverEnabled: true,
  activeSavingGoalName: "Na nowy komputer"
};


const currentBalances = [
  { currency: 'PLN', amount: 12500.50 },
  { currency: 'EUR', amount: 850.00 },
  { currency: 'USD', amount: 320.00 }
];

export default function TransactionPage() {
 
  const [receiverId, setReceiverId] = useState('');
  const [amount, setAmount] = useState('');
  const [title, setTitle] = useState('');
  const [currency, setCurrency] = useState('PLN');


  const getSmartSaverRounding = (val: string) => {
    if (!CURRENT_USER.isSmartSaverEnabled || currency !== 'PLN' || !val) return 0;
    const num = Number(val);
    if (isNaN(num) || num <= 0) return 0;
    
    const nextWholeAmount = Math.ceil(num);
    if (nextWholeAmount === num) return 0;
    return (nextWholeAmount - num);
  };

  const rounding = getSmartSaverRounding(amount);
  const totalDebited = Number(amount) + rounding;
  const currentWallet = currentBalances.find(b => b.currency === currency);

 
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    
    if (currentWallet && totalDebited > currentWallet.amount) {
      alert("Błąd: Niewystarczające środki na koncie (uwzględniając zaokrąglenie Smart Saver)!");
      return;
    }

    const payload: TransactionRequestDTO = {
      senderId: CURRENT_USER.id,
      receiverId: Number(receiverId),
      amount: Number(amount),
      title: title,
      currency: currency
    };

    alert(`Wysyłam przelew do bazy danych Vala Bank!\nKwota: ${payload.amount} ${payload.currency}\nTytuł: ${payload.title}\nOdbiorca ID: ${payload.receiverId}`);
    
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      
    
      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 backdrop-blur-md shadow-xl grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
        <div>
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Twoje Limity Transakcyjne</h3>
          <p className="text-slate-300 font-mono">Dzienny: <span className="text-white font-bold">{CURRENT_USER.dailyLimit.toFixed(2)} PLN</span></p>
          <p className="text-slate-300 font-mono">Miesięczny: <span className="text-white font-bold">{CURRENT_USER.monthlyLimit.toFixed(2)} PLN</span></p>
        </div>
        <div className="md:border-l md:border-slate-800 md:pl-4">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Dostępne środki (Wybrana waluta)</h3>
          <p className="text-2xl font-black text-emerald-400 font-mono">
            {currentWallet ? currentWallet.amount.toLocaleString('pl-PL', { minimumFractionDigits: 2 }) : '0.00'} {currency}
          </p>
        </div>
      </div>

    
      <form onSubmit={handleSubmit} className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 backdrop-blur-md shadow-xl space-y-5">
        <div className="border-b border-slate-800/60 pb-3">
          <h2 className="text-xl font-black text-white tracking-wide">🚀 Nowy Przelew Krajowy / Walutowy</h2>
          <p className="text-xs text-slate-400 mt-0.5">Środki zostaną przelane natychmiastowo na konto odbiorcy.</p>
        </div>

        <div className="space-y-4 text-sm">
      
          <div>
            <label className="block text-xs text-slate-400 mb-1 font-medium">Identyfikator (ID) Odbiorcy</label>
            <input 
              type="number" 
              value={receiverId} 
              onChange={(e) => setReceiverId(e.target.value)} 
              placeholder="Wpisz ID konta docelowego" 
              required 
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white focus:outline-none focus:border-emerald-500" 
            />
          </div>

      
          <div className="grid grid-cols-3 gap-3">
            <div className="col-span-2">
              <label className="block text-xs text-slate-400 mb-1 font-medium">Kwota przelewu</label>
              <input 
                type="number" 
                step="0.01" 
                value={amount} 
                onChange={(e) => setAmount(e.target.value)} 
                placeholder="0.00" 
                required 
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white font-mono focus:outline-none focus:border-emerald-500" 
              />
            </div>
            <div>
              <label className="block text-xs text-slate-400 mb-1 font-medium">Waluta</label>
              <select 
                value={currency} 
                onChange={(e) => setCurrency(e.target.value)} 
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white font-semibold focus:outline-none focus:border-emerald-500"
              >
                <option value="PLN">PLN</option>
                <option value="EUR">EUR</option>
                <option value="USD">USD</option>
              </select>
            </div>
          </div>

   
          {rounding > 0 && (
            <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-xl p-3 flex justify-between items-center text-xs text-emerald-400 animate-fadeIn">
              <div>
                <p className="font-bold">✨ Aktywny Smart Saver</p>
                <p className="text-slate-400 text-[11px] mt-0.5">
                  Kwota przelewu zostanie zaokrąglona do pełnej kwoty. Końcówka trafi na cel: <span className="text-slate-300 italic">"{CURRENT_USER.activeSavingGoalName}"</span>.
                </p>
              </div>
              <div className="text-right font-mono font-bold whitespace-nowrap">
                +{rounding.toFixed(2)} PLN
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs text-slate-400 mb-1 font-medium">Tytuł przelewu</label>
            <input 
              type="text" 
              value={title} 
              onChange={(e) => setTitle(e.target.value)} 
              placeholder="np. Zwrot za pizzę, Faktura nr 12/2026" 
              required 
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white focus:outline-none focus:border-emerald-500" 
            />
          </div>
        </div>

     
        {Number(amount) > 0 && (
          <div className="bg-slate-950/40 border border-slate-800/60 rounded-xl p-4 text-xs space-y-1.5 font-mono">
            <div className="flex justify-between text-slate-400">
              <span>Kwota operacji:</span>
              <span>{Number(amount).toFixed(2)} {currency}</span>
            </div>
            {rounding > 0 && (
              <div className="flex justify-between text-emerald-500/80">
                <span>Zaokrąglenie Smart Saver:</span>
                <span>+{rounding.toFixed(2)} PLN</span>
              </div>
            )}
            <div className="flex justify-between text-sm font-bold text-white border-t border-slate-800/60 pt-2">
              <span>Łączny koszt transakcji (Obciążenie konta):</span>
              <span className="text-emerald-400">{totalDebited.toFixed(2)} {currency}</span>
            </div>
          </div>
        )}

        <button 
          type="submit" 
          className="w-full bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-black text-sm py-3.5 rounded-xl transition duration-200 cursor-pointer shadow-lg shadow-emerald-500/10"
        >
          Autoryzuj i wyślij środki
        </button>
      </form>

    </div>
  );
}