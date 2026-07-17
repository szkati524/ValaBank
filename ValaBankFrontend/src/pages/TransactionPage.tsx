import React, { useState, useEffect } from 'react';
import axios from 'axios';


const api = axios.create({
  baseURL: 'http://localhost:8081',
  withCredentials: true
});

const CURRENT_USER_ID = 1; 

export default function TransactionPage() {
  
  const [recipientAccount, setRecipientAccount] = useState('');
  const [amount, setAmount] = useState('');
  const [title, setTitle] = useState('');


  const [dailyLimit, setDailyLimit] = useState<number | null>(null);
  const [monthlyLimit, setMonthlyLimit] = useState<number | null>(null);
  
  const [isLoadingLimits, setIsLoadingLimits] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  
  useEffect(() => {
    const fetchLimits = async () => {
      try {
        setIsLoadingLimits(true);
       
        const response = await api.get(`/api/account/${CURRENT_USER_ID}`);
        
   
        setDailyLimit(response.data.dailyLimit);
        setMonthlyLimit(response.data.monthlyLimit);
      } catch (err) {
        console.error("Nie udało się załadować limitów do walidacji przelewu:", err);
        setError("Nie można pobrać aktualnych limitów transakcyjnych z serwera.");
      } finally {
        setIsLoadingLimits(false);
      }
    };

    fetchLimits();
  }, []);


  const handleTransfer = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    const transferAmount = Number(amount);

    if (isNaN(transferAmount) || transferAmount <= 0) {
      setError('Wprowadź poprawną kwotę przelewu większą od zera.');
      return;
    }

   
    if (typeof dailyLimit === 'number' && transferAmount > dailyLimit) {
      setError(`Kwota przelewu (${transferAmount.toLocaleString()} PLN) przekracza Twój aktualny dzienny limit transakcyjny (${dailyLimit.toLocaleString()} PLN).`);
      return;
    }

    try {
      const payload = {
        receiverAccountNumber: recipientAccount,
        amount: transferAmount,
        title: title
      };
      
      
      await api.post('/api/transactions/send', payload); 
      
      setSuccess('Przelew został zrealizowany pomyślnie!');
      
      
      setAmount('');
      setTitle('');
      setRecipientAccount('');

      
      const refreshResponse = await api.get(`/api/account/${CURRENT_USER_ID}`);
      setDailyLimit(refreshResponse.data.dailyLimit);
      setMonthlyLimit(refreshResponse.data.monthlyLimit);

    } catch (err: any) {
      console.error("Błąd podczas realizacji przelewu:", err);
      setError('Wystąpił błąd podczas realizacji przelewu. Upewnij się, że masz wystarczające środki na koncie.');
    }
  };

  return (
    <div className="max-w-xl mx-auto bg-slate-900/40 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6 backdrop-blur-md">
      <div>
        <h2 className="text-xl font-black text-white tracking-wide">💸 Nowy Przelew Krajowy</h2>
        <p className="text-xs text-slate-400 mt-0.5 font-sans">
          Środki zostaną przetworzone i zaksięgowane w systemie bankowym ValaBank.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3 bg-slate-950/60 p-3 rounded-xl border border-slate-800/60 font-mono text-[11px]">
  <div>
    <span className="text-slate-500 block">Dostępny limit dzienny:</span>
    <span className="text-cyan-400 font-bold">
      {isLoadingLimits 
        ? 'Ładowanie...' 
        : (dailyLimit !== null && dailyLimit !== undefined)
          ? `${Number(dailyLimit).toLocaleString()} PLN` 
          : 'Brak limitu (Nieustawiony)'}
    </span>
  </div>
  <div>
    <span className="text-slate-500 block">Limit miesięczny:</span>
    <span className="text-white font-bold">
      {isLoadingLimits 
        ? 'Ładowanie...' 
        : (monthlyLimit !== null && monthlyLimit !== undefined)
          ? `${Number(monthlyLimit).toLocaleString()} PLN` 
          : 'Brak limitu (Nieustawiony)'}
    </span>
  </div>
</div>
    
      
      <form onSubmit={handleTransfer} className="space-y-4 text-sm">
        <div>
          <label className="block text-xs text-slate-400 mb-1 font-medium">Numer konta odbiorcy</label>
          <input 
            type="text" 
            value={recipientAccount} 
            onChange={e => setRecipientAccount(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white font-mono text-xs focus:outline-none focus:border-cyan-500 transition" 
            placeholder="Wpisz numer konta (np. NRB)"
            required
          />
        </div>

        <div>
          <label className="block text-xs text-slate-400 mb-1 font-medium">Kwota przelewu (PLN)</label>
          <input 
            type="number" 
            step="0.01"
            value={amount} 
            onChange={e => setAmount(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white font-mono text-xs focus:outline-none focus:border-cyan-500 transition" 
            placeholder="0.00"
            required
          />
        </div>

        <div>
          <label className="block text-xs text-slate-400 mb-1 font-medium">Tytuł przelewu</label>
          <input 
            type="text" 
            value={title} 
            onChange={e => setTitle(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white text-xs focus:outline-none focus:border-cyan-500 transition" 
            placeholder="np. Faktura VAT lub zwrot kosztów"
            required
          />
        </div>

        <button 
          type="submit" 
          className="w-full bg-cyan-500 text-slate-950 font-bold py-3 rounded-xl uppercase tracking-wider text-xs hover:bg-cyan-600 transition cursor-pointer"
        >
          Autoryzuj i wyślij przelew
        </button>
      </form>

    
      {success && (
        <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-center">
          <p className="text-emerald-400 text-xs font-mono">✓ {success}</p>
        </div>
      )}
      
      {error && (
        <div className="p-3 bg-rose-500/10 border border-rose-500/20 rounded-xl text-center">
          <p className="text-rose-400 text-xs font-mono">⚠️ {error}</p>
        </div>
      )}
    </div>
  );
}