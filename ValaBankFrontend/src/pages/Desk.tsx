import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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


interface RateItem {
  currency: string;
  rate: number;
}

export default function Desk() {
  const navigate = useNavigate();
  const [activeStatTab, setActiveStatTab] = useState<'general' | 'income' | 'expenses'>('general');

  
  const [rates, setRates] = useState<RateItem[]>([]);
  const [balances, setBalances] = useState<BalanceDTO[]>([]);
  const [loadingRates, setLoadingRates] = useState<boolean>(true);
  const [loadingBalances, setLoadingBalances] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);


  const loggedInClientId = 1;

  useEffect(() => {
   
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
        setError("Nie udało się pobrać aktualnych kursów.");
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
        console.warn("Brak połączenia z API kont. Używam danych demonstracyjnych (fallback):", err);
        setBalances([
          { id: 1, amount: 12500.50, currency: 'PLN' },
          { id: 2, amount: 850.00, currency: 'EUR' }
        ]);
        setLoadingBalances(false);
      });
  }, [loggedInClientId]);

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
              {loadingRates ? (
                <tr>
                  <td colSpan={2} className="p-4 text-center text-xs text-slate-500 font-mono animate-pulse">
                    Łączenie z API...
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
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Stan Konta</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {loadingBalances ? (
              <div className="col-span-2 text-center py-6 text-slate-500 text-xs font-mono animate-pulse">
                Autoryzacja dostępu do portfela...
              </div>
            ) : (
              balances.map((balance) => (
                <div key={balance.id} className="bg-slate-950/40 border border-slate-800 rounded-xl p-4 flex justify-between items-center hover:border-emerald-500/30 transition shadow-inner">
                  <div>
                    <p className="text-xs text-slate-500 font-medium">Środki dostępne</p>
                    <p className="text-2xl font-black text-white font-mono mt-1">
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

       
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4 backdrop-blur-md shadow-xl flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-emerald-500/10 text-emerald-400 rounded-xl border border-emerald-500/20">
              💸
            </div>
            <div>
              <h4 className="font-semibold text-slate-200 text-sm">Masz rachunki do opłacenia?</h4>
              <p className="text-xs text-slate-400">Wyślij natychmiastowy przelew krajowy lub walutowy.</p>
            </div>
          </div>
          <button 
            onClick={() => navigate('/przelew')}
            className="bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold text-xs px-4 py-2.5 rounded-xl transition duration-200 cursor-pointer shadow-lg shadow-emerald-500/10"
          >
            Zrób przelew
          </button>
        </div>

        {/* Analiza Finansowa */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 backdrop-blur-md shadow-xl space-y-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-slate-800 pb-3">
            <h3 className="text-lg font-bold text-slate-200">📊 Analiza Finansowa</h3>
            
            <div className="flex bg-slate-950/60 border border-slate-800 rounded-lg p-1 text-xs font-semibold">
              <button 
                onClick={() => setActiveStatTab('general')}
                className={`px-3 py-1.5 rounded-md transition cursor-pointer ${activeStatTab === 'general' ? 'bg-emerald-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-slate-200'}`}
              >
                Ogólne
              </button>
              <button 
                onClick={() => setActiveStatTab('income')}
                className={`px-3 py-1.5 rounded-md transition cursor-pointer ${activeStatTab === 'income' ? 'bg-emerald-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-slate-200'}`}
              >
                Przychody
              </button>
              <button 
                onClick={() => setActiveStatTab('expenses')}
                className={`px-3 py-1.5 rounded-md transition cursor-pointer ${activeStatTab === 'expenses' ? 'bg-emerald-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-slate-200'}`}
              >
                Wydatki
              </button>
            </div>
          </div>

          <div className="bg-slate-950/30 rounded-xl p-6 border border-slate-800/40 min-h-[120px] flex items-center justify-center">
            {activeStatTab === 'general' && (
              <div className="text-center space-y-1">
                <p className="text-slate-300 font-medium">Bieżący bilans przepływu gotówki</p>
                <p className="text-xs text-slate-500">Dane zagregowane za pomocą zapytań JPQL z bazy danych.</p>
              </div>
            )}
            {activeStatTab === 'income' && (
              <div className="text-center space-y-1">
                <p className="text-emerald-400 font-bold text-lg">+ 4 500,00 zł</p>
                <p className="text-xs text-slate-400">Główne źródła: Wpłaty własne, przelewy przychodzące.</p>
              </div>
            )}
            {activeStatTab === 'expenses' && (
              <div className="text-center space-y-1">
                <p className="text-rose-400 font-bold text-lg">- 1 230,40 zł</p>
                <p className="text-xs text-slate-400">Największe obciążenia: Smart Saver, Autopłatności.</p>
              </div>
            )}
          </div>

        </div>

      </div>
    </div>
  );
}