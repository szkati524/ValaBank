import React, { useState } from 'react';


interface BalanceDTO {
  id: number;
  amount: number;
  currency: string;
}

interface ExchangeRequestDTO {
  from: string;
  to: string;
  amount: number;
}

interface TransferRequestDTO {
  senderId: number;
  receiverId: number;
  amount: number;
  title: string;
  currency: string;
}


const mockBalances: BalanceDTO[] = [
  { id: 1, amount: 12500.50, currency: 'PLN' },
  { id: 2, amount: 850.00, currency: 'EUR' },
  { id: 3, amount: 320.00, currency: 'USD' },
  { id: 4, amount: 150.00, currency: 'GBP' },
];

const mockRates = [
  { currency: 'PLN', rate: 1.00 },
  { currency: 'EUR', rate: 4.28 },
  { currency: 'USD', rate: 3.95 },
  { currency: 'GBP', rate: 5.05 }
];

export default function CurrencyAccount() {
  
  const [exchangeFrom, setExchangeFrom] = useState('PLN');
  const [exchangeTo, setExchangeTo] = useState('EUR');
  const [exchangeAmount, setExchangeAmount] = useState('');

 
  const [transferReceiver, setTransferReceiver] = useState('');
  const [transferAmount, setTransferAmount] = useState('');
  const [transferCurrency, setTransferCurrency] = useState('EUR');
  const [transferTitle, setTransferTitle] = useState('');


  const handleExchange = (e: React.FormEvent) => {
    e.preventDefault();
    const payload: ExchangeRequestDTO = {
      from: exchangeFrom,
      to: exchangeTo,
      amount: Number(exchangeAmount)
    };
    alert(`Wysyłam żądanie wymiany: ${payload.amount} ${payload.from} -> ${payload.to}`);
    
  };

 
  const handleTransfer = (e: React.FormEvent) => {
    e.preventDefault();
    const payload: TransferRequestDTO = {
      senderId: 1, 
      receiverId: Number(transferReceiver),
      amount: Number(transferAmount),
      title: transferTitle,
      currency: transferCurrency
    };
    alert(`Wysyłam przelew walutowy: ${payload.amount} ${payload.currency} do konta o ID ${payload.receiverId}`);
  
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
      
     
      <div className="lg:col-span-1 bg-slate-900/60 border border-slate-800 rounded-2xl p-4 backdrop-blur-md shadow-xl">
        <h3 className="text-lg font-bold text-slate-200 mb-3 flex items-center gap-2">
          💱 Kursy Walut <span className="text-xs text-slate-500 font-normal">(NBP)</span>
        </h3>
        <div className="overflow-hidden rounded-xl border border-slate-800">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-950/50 text-slate-400 uppercase text-xs">
              <tr>
                <th className="p-3">Waluta</th>
                <th className="p-3 text-right">Kurs (PLN)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              {mockRates.map((item) => (
                <tr key={item.currency} className="hover:bg-slate-800/30 transition">
                  <td className="p-3 font-bold text-emerald-400">{item.currency}</td>
                  <td className="p-3 text-right font-mono">{item.rate.toFixed(2)} zł</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

     
      <div className="lg:col-span-3 space-y-6">
        
   
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 backdrop-blur-md shadow-xl">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Twoje Portfele Walutowe</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {mockBalances.map((balance) => (
              <div key={balance.id} className="bg-slate-950/40 border border-slate-800 rounded-xl p-4 flex justify-between items-center hover:border-emerald-500/30 transition shadow-inner">
                <div>
                  <p className="text-xs text-slate-500 font-medium">Dostępne środki</p>
                  <p className="text-xl font-black text-white font-mono mt-1">
                    {balance.amount.toLocaleString('pl-PL', { minimumFractionDigits: 2 })}
                  </p>
                </div>
                <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-extrabold px-3 py-1 rounded-md tracking-wider">
                  {balance.currency}
                </span>
              </div>
            ))}
          </div>
        </div>

       
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
        
          <form onSubmit={handleExchange} className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 backdrop-blur-md shadow-xl flex flex-col justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-200 mb-4 flex items-center gap-2">
                🔄 Kantor internetowy ValaBank
              </h3>
              
              <div className="space-y-4 text-sm">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs text-slate-400 mb-1 font-medium">Sprzedajesz</label>
                    <select value={exchangeFrom} onChange={(e) => setExchangeFrom(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white font-semibold focus:outline-none focus:border-emerald-500">
                      {mockRates.map(r => <option key={r.currency} value={r.currency}>{r.currency}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs text-slate-400 mb-1 font-medium">Kupujesz</label>
                    <select value={exchangeTo} onChange={(e) => setExchangeTo(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white font-semibold focus:outline-none focus:border-emerald-500">
                      {mockRates.map(r => <option key={r.currency} value={r.currency}>{r.currency}</option>)}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs text-slate-400 mb-1 font-medium">Kwota do wymiany</label>
                  <input type="number" step="0.01" value={exchangeAmount} onChange={(e) => setExchangeAmount(e.target.value)} placeholder="0.00" required className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white font-mono placeholder-slate-600 focus:outline-none focus:border-emerald-500" />
                </div>
              </div>
            </div>

            <button type="submit" className="w-full bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold text-xs py-3 rounded-xl transition duration-200 cursor-pointer shadow-lg mt-6 shadow-emerald-500/5">
              Zatwierdź wymianę waluty
            </button>
          </form>

          
          <form onSubmit={handleTransfer} className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 backdrop-blur-md shadow-xl flex flex-col justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-200 mb-4 flex items-center gap-2">
                🌍 Przelew Zagraniczny / Walutowy
              </h3>
              
              <div className="space-y-3 text-sm">
                <div>
                  <label className="block text-xs text-slate-400 mb-1 font-medium">ID Odbiorcy (Numer konta)</label>
                  <input type="number" value={transferReceiver} onChange={(e) => setTransferReceiver(e.target.value)} placeholder="Wprowadź ID konta odbiorcy" required className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500" />
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <div className="col-span-2">
                    <label className="block text-xs text-slate-400 mb-1 font-medium">Kwota przelewu</label>
                    <input type="number" step="0.01" value={transferAmount} onChange={(e) => setTransferAmount(e.target.value)} placeholder="0.00" required className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white font-mono placeholder-slate-600 focus:outline-none focus:border-emerald-500" />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-400 mb-1 font-medium">Waluta</label>
                    <select value={transferCurrency} onChange={(e) => setTransferCurrency(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white font-semibold focus:outline-none focus:border-emerald-500">
                      {mockRates.filter(r => r.currency !== 'PLN').map(r => <option key={r.currency} value={r.currency}>{r.currency}</option>)}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs text-slate-400 mb-1 font-medium">Tytuł przelewu</label>
                  <input type="text" value={transferTitle} onChange={(e) => setTransferTitle(e.target.value)} placeholder="np. Zapłata za fakturę" required className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500" />
                </div>
              </div>
            </div>

            <button type="submit" className="w-full bg-slate-100 hover:bg-slate-200 text-slate-950 font-bold text-xs py-3 rounded-xl transition duration-200 cursor-pointer shadow-lg mt-4">
              Wyślij przelew walutowy
            </button>
          </form>

        </div>

      </div>
    </div>
  );
}