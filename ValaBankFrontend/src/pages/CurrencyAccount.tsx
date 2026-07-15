import React, { useState, useEffect } from 'react';
import axios from 'axios';


const api = axios.create({
  baseURL: 'http://localhost:8081',
  withCredentials: true
});



interface BalanceDTO {
  id: number;
  amount: number;
  currency: string;
}

interface AccountResponseDTO {
  id: number;
  accountNumber: number;
  balances: BalanceDTO[];
  clientId: number | null;
}


interface ExchangeResponseDTO {
  clientId: number;
  from: string;
  to: string;
  amount: number;
}

interface TransactionRequestDTO {
  senderId: number;
  receiverId: number;
  amount: number;
  title: string;
  currency: string;
}

interface RateItem {
  currency: string;
  rate: number;
}

export default function CurrencyAccount() {
 
  const [rates, setRates] = useState<RateItem[]>([]);
  const [balances, setBalances] = useState<BalanceDTO[]>([]);
  const [loadingRates, setLoadingRates] = useState<boolean>(true);
  const [loadingBalances, setLoadingBalances] = useState<boolean>(true);
  const [message, setMessage] = useState<{ text: string; isError: boolean } | null>(null);

 
  const [exchangeFrom, setExchangeFrom] = useState('PLN');
  const [exchangeTo, setExchangeTo] = useState('EUR');
  const [exchangeAmount, setExchangeAmount] = useState('');


  const [transferReceiver, setTransferReceiver] = useState(''); 
  const [transferAmount, setTransferAmount] = useState('');
  const [transferCurrency, setTransferCurrency] = useState('EUR');
  const [transferTitle, setTransferTitle] = useState('');


  const loggedInClientId = 1;

  
  const fetchData = () => {
    setLoadingRates(true);
    setLoadingBalances(true);

  
    api.get('/api/currencies/rates')
      .then(response => {
        const mappedRates: RateItem[] = Object.entries(response.data).map(([currency, rate]) => ({
          currency,
          rate: Number(rate)
        }));

        if (!mappedRates.some(r => r.currency === 'PLN')) {
          mappedRates.unshift({ currency: 'PLN', rate: 1.00 });
        }

        setRates(mappedRates);
        setLoadingRates(false);
      })
      .catch(err => {
        console.error("Błąd podczas pobierania kursów walut:", err);
        setLoadingRates(false);
      });

    
    api.get(`/api/account/client/${loggedInClientId}`)
      .then(response => {
        const accounts: AccountResponseDTO[] = response.data;
        
        const allBalances: BalanceDTO[] = accounts.flatMap((account) => 
          account.balances.map((b) => ({
            id: b.id, 
            amount: b.amount,
            currency: b.currency
          }))
        );

        setBalances(allBalances);
        setLoadingBalances(false);
      })
      .catch(err => {
        console.warn("Błąd pobierania kont. Fallback na dane demo:", err);
        setBalances([
          { id: 1, amount: 10000.00, currency: 'PLN' },
          { id: 2, amount: 0.00, currency: 'EUR' }
        ]);
        setLoadingBalances(false);
      });
  };

  useEffect(() => {
    fetchData();
  }, [loggedInClientId]);


  const handleExchange = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (exchangeFrom === exchangeTo) {
      setMessage({ text: "Wybierz dwie różne waluty do wymiany.", isError: true });
      return;
    }

    const payload: ExchangeResponseDTO = {
      clientId: loggedInClientId,
      from: exchangeFrom,
      to: exchangeTo,
      amount: Number(exchangeAmount)
    };

    api.post(`/api/transaction/accounts/${loggedInClientId}/exchange`, payload)
      .then(response => {
        setMessage({ text: response.data || "Wymiana zrealizowana pomyślnie!", isError: false });
        setExchangeAmount('');
        fetchData(); 
      })
      .catch(err => {
        console.error(err);
        setMessage({ text: err.response?.data || "Błąd podczas wymiany walut. Brak środków?", isError: true });
      });
  };

 
  const handleTransfer = (e: React.FormEvent) => {
    e.preventDefault();

    const payload: TransactionRequestDTO = {
      senderId: loggedInClientId, 
      receiverId: Number(transferReceiver),
      amount: Number(transferAmount),
      title: transferTitle,
      currency: transferCurrency
    };

    api.post('/api/transaction/transfer', payload)
      .then(response => {
        setMessage({ text: response.data || "Transakcja zakończona sukcesem!", isError: false });
        setTransferReceiver('');
        setTransferAmount('');
        setTransferTitle('');
        fetchData(); 
      })
      .catch(err => {
        console.error(err);
        setMessage({ text: err.response?.data || "Błąd transakcji. Sprawdź ID odbiorcy i stan konta.", isError: true });
      });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
      
   
      {message && (
        <div className={`col-span-1 lg:col-span-4 p-4 rounded-xl border text-sm font-medium transition ${
          message.isError 
            ? 'bg-rose-500/10 border-rose-500/30 text-rose-400' 
            : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
        }`}>
          <div className="flex justify-between items-center">
            <span>{message.text}</span>
            <button onClick={() => setMessage(null)} className="text-xs underline hover:no-underline cursor-pointer">Zamknij</button>
          </div>
        </div>
      )}

     
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
              {loadingRates ? (
                <tr>
                  <td colSpan={2} className="p-4 text-center text-xs text-slate-500 font-mono animate-pulse">
                    Aktualizacja kursów...
                  </td>
                </tr>
              ) : (
                rates.map((item) => (
                  <tr key={item.currency} className="hover:bg-slate-800/30 transition">
                    <td className="p-3 font-bold text-emerald-400">{item.currency}</td>
                    <td className="p-3 text-right font-mono">{item.rate.toFixed(2)} zł</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

     
      <div className="lg:col-span-3 space-y-6">
        
      
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 backdrop-blur-md shadow-xl">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Twoje Portfele Walutowe</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {loadingBalances ? (
              <div className="col-span-2 text-center py-6 text-slate-500 text-xs font-mono animate-pulse">
                Ładowanie portfeli walutowych...
              </div>
            ) : (
              balances.map((balance) => (
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
              ))
            )}
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
                    <select value={exchangeFrom} onChange={(e) => setExchangeFrom(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white font-semibold focus:outline-none focus:border-emerald-500 cursor-pointer">
                      {rates.map(r => <option key={r.currency} value={r.currency}>{r.currency}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs text-slate-400 mb-1 font-medium">Kupujesz</label>
                    <select value={exchangeTo} onChange={(e) => setExchangeTo(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white font-semibold focus:outline-none focus:border-emerald-500 cursor-pointer">
                      {rates.map(r => <option key={r.currency} value={r.currency}>{r.currency}</option>)}
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
                  <label className="block text-xs text-slate-400 mb-1 font-medium">ID Odbiorcy (Konto ID)</label>
                  <input type="number" value={transferReceiver} onChange={(e) => setTransferReceiver(e.target.value)} placeholder="Wprowadź ID odbiorcy" required className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500" />
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <div className="col-span-2">
                    <label className="block text-xs text-slate-400 mb-1 font-medium">Kwota przelewu</label>
                    <input type="number" step="0.01" value={transferAmount} onChange={(e) => setTransferAmount(e.target.value)} placeholder="0.00" required className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white font-mono placeholder-slate-600 focus:outline-none focus:border-emerald-500" />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-400 mb-1 font-medium">Waluta</label>
                    <select value={transferCurrency} onChange={(e) => setTransferCurrency(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white font-semibold focus:outline-none focus:border-emerald-500 cursor-pointer">
                      {rates.filter(r => r.currency !== 'PLN').map(r => <option key={r.currency} value={r.currency}>{r.currency}</option>)}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs text-slate-400 mb-1 font-medium">Tytuł przelewu</label>
                  <input type="text" value={transferTitle} onChange={(e) => setTransferTitle(e.target.value)} placeholder="np. Prezent urodzinowy" required className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500" />
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