import React, { useState, useEffect } from 'react';
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8081',
  withCredentials: true
});



interface LoanDetailsDTO {
  id: number;
  totalAmountToRepay: number;
  remainingAmount: number;
  monthlyInstallment: number;
  interestRate: number; 
  durationInMonths: number;
  startDate: string;
}

interface LoanRequestDTO {
  accountId: number;
  amount: number;
  months: number;
  interestRate: number;
}

interface OverpaymentRequestDTO {
  amount: number;
}

export default function LoanPage() {
  const loggedInAccountId = 1; 

 
  const [activeLoans, setActiveLoans] = useState<LoanDetailsDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState<{ text: string; isError: boolean } | null>(null);

 
  const [loanAmount, setLoanAmount] = useState('');
  const [loanMonths, setLoanMonths] = useState('12');
  const [fixedInterestRate] = useState(0.08); 

  
  const [overpayAmounts, setOverpayAmounts] = useState<{ [key: number]: string }>({});

 
  const fetchLoans = () => {
    setLoading(true);
    api.get(`/api/loan/account/${loggedInAccountId}`)
      .then(response => {
        // Upewniamy się, że odpowiedź to tablica
        if (Array.isArray(response.data)) {
          setActiveLoans(response.data);
        } else {
          setActiveLoans([]);
        }
        setLoading(false);
      })
      .catch(err => {
        console.warn("Błąd pobierania kredytów, używam danych demonstracyjnych:", err);
    
        setActiveLoans([
          { id: 701, totalAmountToRepay: 24000.00, remainingAmount: 18000.00, monthlyInstallment: 1000.00, interestRate: 0.10, durationInMonths: 24, startDate: '2026-01-10' },
          { id: 702, totalAmountToRepay: 60000.00, remainingAmount: 55000.00, monthlyInstallment: 1250.00, interestRate: 0.12, durationInMonths: 48, startDate: '2026-05-01' }
        ]);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchLoans();
  }, []);


  const calculateLiveInstallment = () => {
    const principal = Number(loanAmount);
    if (isNaN(principal) || principal <= 0) return { total: 0, installment: 0 };

    const interest = principal * fixedInterestRate;
    const totalToRepay = principal + interest;
    const monthlyRate = totalToRepay / Number(loanMonths);

    return { total: totalToRepay, installment: monthlyRate };
  };

  const { total: liveTotal, installment: liveInstallment } = calculateLiveInstallment();

 
  const handleTakeLoan = (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);

    const payload: LoanRequestDTO = {
      accountId: loggedInAccountId,
      amount: Number(loanAmount),
      months: Number(loanMonths),
      interestRate: fixedInterestRate
    };

    api.post('/api/loan', payload)
      .then(() => {
        setMessage({
          text: `🎉 Kredyt na kwotę ${payload.amount} PLN został pomyślnie przyznany! Środki trafiły na Twoje konto.`,
          isError: false
        });
        setLoanAmount('');
        fetchLoans(); 
      })
      .catch(err => {
        console.error(err);
        const errMsg = err.response?.data?.message || "Nie udało się zaciągnąć kredytu. Sprawdź, czy posiadasz konto PLN.";
        setMessage({ text: errMsg, isError: true });
      });
  };

  
  const handleOverpay = (loanId: number) => {
    setMessage(null);
    const amountStr = overpayAmounts[loanId];
    
    if (!amountStr || Number(amountStr) <= 0) {
      setMessage({ text: "Wpisz poprawną kwotę nadpłaty!", isError: true });
      return;
    }

    const payload: OverpaymentRequestDTO = {
      amount: Number(amountStr)
    };

    api.post(`/api/loan/${loanId}/overpay`, payload)
      .then(res => {
        setMessage({ text: res.data || `Pomyślnie nadpłacono kredyt #${loanId}!`, isError: false });
        setOverpayAmounts({ ...overpayAmounts, [loanId]: '' });
        fetchLoans(); 
      })
      .catch(err => {
        console.error(err);
        const errMsg = err.response?.data?.message || "Błąd podczas dokonywania nadpłaty. Upewnij się, że masz środki na koncie.";
        setMessage({ text: errMsg, isError: true });
      });
  };

  if (loading) {
    return (
      <div className="text-center py-20 text-slate-500 text-xs font-mono animate-pulse">
        Wczytywanie Twoich zobowiązań kredytowych z bazy danych...
      </div>
    );
  }

  return (
    <div className="space-y-10">

  
      {message && (
        <div className={`p-4 rounded-xl border text-sm font-medium transition ${
          message.isError 
            ? 'bg-rose-500/10 border-rose-500/30 text-rose-400' 
            : 'bg-indigo-500/10 border-indigo-500/30 text-indigo-400'
        }`}>
          <div className="flex justify-between items-center">
            <span>{message.text}</span>
            <button onClick={() => setMessage(null)} className="text-xs underline hover:no-underline cursor-pointer">Zamknij</button>
          </div>
        </div>
      )}
      
    
      <section className="space-y-6">
        <div className="border-b border-slate-800 pb-2">
          <h2 className="text-2xl font-black text-white tracking-wide flex items-center gap-2">
            🏦 Wnioskowanie o Kredyt Gotówkowy
          </h2>
          <p className="text-xs text-slate-400 mt-1">Szybka decyzja kredytowa. Środki trafiają bezpośrednio na Twoje konto PLN.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <form onSubmit={handleTakeLoan} className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 backdrop-blur-md shadow-xl flex flex-col justify-between">
            <div className="space-y-4">
              <h3 className="font-bold text-slate-200 text-sm uppercase tracking-wider text-indigo-400">Skonfiguruj kredyt</h3>
              
              <div className="text-sm">
                <label className="block text-xs text-slate-400 mb-1 font-medium">Kwota kredytu (PLN)</label>
                <input 
                  type="number" 
                  step="100"
                  value={loanAmount} 
                  onChange={(e) => setLoanAmount(e.target.value)} 
                  placeholder="0.00" 
                  required 
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white font-mono focus:outline-none focus:border-indigo-500" 
                />
              </div>

              <div className="text-sm">
                <label className="block text-xs text-slate-400 mb-1 font-medium">Okres spłaty</label>
                <select 
                  value={loanMonths} 
                  onChange={(e) => setLoanMonths(e.target.value)} 
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white font-semibold focus:outline-none focus:border-indigo-500 cursor-pointer"
                >
                  <option value="12">12 Miesięcy</option>
                  <option value="24">24 Miesiące</option>
                  <option value="36">36 Miesięcy</option>
                  <option value="48">48 Miesięcy</option>
                </select>
              </div>

              <div className="bg-slate-950/40 border border-slate-800/60 rounded-xl p-3 text-xs text-slate-400 font-mono">
                Oprocentowanie stałe: <span className="text-white font-bold">{(fixedInterestRate * 100).toFixed(1)}%</span>
              </div>
            </div>

            <button type="submit" className="w-full bg-indigo-500 hover:bg-indigo-600 text-slate-950 font-black text-xs py-3 rounded-xl transition duration-200 cursor-pointer shadow-lg mt-6 shadow-indigo-500/10">
              Weź kredyt (PLN)
            </button>
          </form>

         
          <div className="lg:col-span-2 bg-slate-900/60 border border-slate-800 rounded-2xl p-6 backdrop-blur-md shadow-xl flex flex-col justify-center relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 text-7xl opacity-5 pointer-events-none select-none">📊</div>
            <h3 className="font-bold text-slate-400 text-xs uppercase tracking-wider mb-6">Symulacja Twojej raty</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1">
                <p className="text-xs text-slate-400">Szacowana rata miesięczna:</p>
                <p className="text-4xl font-black text-indigo-400 font-mono">
                  {liveInstallment.toLocaleString('pl-PL', { minimumFractionDigits: 2 })} <span className="text-lg font-normal text-slate-400">PLN/mc</span>
                </p>
              </div>

              <div className="space-y-2 text-sm border-t md:border-t-0 md:border-l border-slate-800 pt-4 md:pt-0 md:pl-6 justify-center flex flex-col">
                <div className="flex justify-between">
                  <span className="text-slate-400">Kapitał pożyczki:</span>
                  <span className="font-mono text-slate-200">{(Number(loanAmount) || 0).toFixed(2)} PLN</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Koszt odsetek:</span>
                  <span className="font-mono text-slate-400">+{(liveTotal - (Number(loanAmount) || 0)).toFixed(2)} PLN</span>
                </div>
                <div className="flex justify-between font-bold border-t border-slate-800/80 pt-1.5 text-white">
                  <span>Suma do spłaty:</span>
                  <span className="font-mono text-indigo-400">{liveTotal.toFixed(2)} PLN</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

     
      <section className="space-y-6">
        <div className="border-b border-slate-800 pb-2">
          <h2 className="text-2xl font-black text-white tracking-wide flex items-center gap-2">
            📑 Twoje Aktywne Zobowiązania
          </h2>
          <p className="text-xs text-slate-400 mt-1">Zestawienie aktualnych kredytów oraz możliwość szybszej spłaty (nadpłaty).</p>
        </div>

        {activeLoans.length === 0 ? (
          <div className="text-center py-10 bg-slate-900/20 border border-slate-800 border-dashed rounded-2xl text-xs font-mono text-slate-500">
            Obecnie nie posiadasz żadnych aktywnych kredytów do spłaty.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {activeLoans.map((loan) => {
              // Bezpieczne rzutowanie i konwersja na liczby na wypadek null/undefined/string z bazy danych
              const totalAmount = Number(loan.totalAmountToRepay ?? 0);
              const remainingAmount = Number(loan.remainingAmount ?? 0);
              const monthlyInstallment = Number(loan.monthlyInstallment ?? 0);
              const interestRate = Number(loan.interestRate ?? 0);

              const paidAmount = totalAmount - remainingAmount;
              const progressPercent = totalAmount > 0 ? Math.min((paidAmount / totalAmount) * 100, 100) : 0;

              return (
                <div key={loan.id} className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 backdrop-blur-md shadow-xl space-y-6 relative flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-black text-white text-base">Kredyt Gotówkowy #{loan.id}</h4>
                        <p className="text-[11px] text-slate-500 font-mono mt-0.5">
                          Uruchomiono: {loan.startDate || 'Brak danych'} • Opr. {(interestRate * 100).toFixed(1)}%
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-[10px] text-slate-400 uppercase font-bold">Rata miesięczna</p>
                        <p className="text-lg font-black text-indigo-400 font-mono">{monthlyInstallment.toFixed(2)} zł</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 border-t border-slate-800/60 pt-4 mt-4 text-xs font-mono">
                      <div>
                        <p className="text-slate-400">Pozostało do spłaty:</p>
                        <p className="text-base font-black text-white">{remainingAmount.toFixed(2)} PLN</p>
                      </div>
                      <div className="text-right">
                        <p className="text-slate-400">Całkowita kwota:</p>
                        <p className="text-sm font-bold text-slate-400">{totalAmount.toFixed(2)} PLN</p>
                      </div>
                    </div>

                    <div className="mt-4">
                      <div className="w-full bg-slate-950 rounded-full h-1.5 overflow-hidden border border-slate-800">
                        <div className="bg-indigo-500 h-1.5 rounded-full transition-all duration-500" style={{ width: `${progressPercent}%` }}></div>
                      </div>
                      <div className="flex justify-between text-[10px] font-mono text-slate-500 mt-1">
                        <span>Spłacono: {progressPercent.toFixed(1)}%</span>
                        <span>Pozostało: {loan.durationInMonths ?? 0} msc</span>
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-slate-800/60 pt-4 mt-2">
                    <label className="block text-[11px] text-slate-400 mb-1.5 font-medium">Szybka nadpłata kredytu (Zmniejsza zadłużenie)</label>
                    <div className="flex gap-2">
                      <input 
                        type="number" 
                        step="10"
                        value={overpayAmounts[loan.id] || ''} 
                        onChange={(e) => setOverpayAmounts({ ...overpayAmounts, [loan.id]: e.target.value })} 
                        placeholder="Kwota nadpłaty (PLN)" 
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2 text-xs text-white font-mono focus:outline-none focus:border-indigo-500" 
                      />
                      <button 
                        onClick={() => handleOverpay(loan.id)}
                        className="bg-indigo-500/10 hover:bg-indigo-500 text-indigo-400 hover:text-slate-950 border border-indigo-500/20 font-bold text-xs px-4 rounded-xl transition duration-200 cursor-pointer whitespace-nowrap"
                      >
                        Nadpłać
                      </button>
                    </div>
                  </div>

                </div>
              );
            })}
          </div>
        )}
      </section>

    </div>
  );
}