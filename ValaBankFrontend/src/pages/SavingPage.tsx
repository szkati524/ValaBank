import React, { useState, useEffect } from 'react';
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8081',
  withCredentials: true
});



interface SavingGoalResponseDTO {
  id: number;
  name: string;
  targetAmount: number;
  currentAmount: number;
  accountId: number;
}

interface DepositDetailsDTO {
  depositId: number; 
  accountId: number;
  principal: number;
  interestRate: number; 
  currency: string;
  startDate: string;
  endDate: string;
  status: 'ACTIVE' | 'COMPLETED' | 'TERMINATED';
}

interface DepositRequestDTO {
  accountId: number;
  amount: number;
  DurationInMonths: number; 
  interestRate: number;
  currency: string;
}

export default function SavingPage() {
  const loggedInAccountId = 1; 

  const [goals, setGoals] = useState<SavingGoalResponseDTO[]>([]);
  const [deposits, setDeposits] = useState<DepositDetailsDTO[]>([]);
  const [activeSmartSaverId, setActiveSmartSaverId] = useState<number | null>(null);
  
  const [loadingGoals, setLoadingGoals] = useState(true);
  const [loadingDeposits, setLoadingDeposits] = useState(true);
  const [message, setMessage] = useState<{ text: string; isError: boolean } | null>(null);

  const [goalName, setGoalName] = useState('');
  const [goalTarget, setGoalTarget] = useState('');

  const [depositAmount, setDepositAmount] = useState('');
  const [depositDuration, setDepositDuration] = useState('6');
  const [depositCurrency, setDepositCurrency] = useState('PLN');

  const fetchData = () => {
    setLoadingGoals(true);
    setLoadingDeposits(true);

    api.get(`/api/saving-goals/account/${loggedInAccountId}`)
      .then(res => {
        setGoals(res.data);
        setLoadingGoals(false);
      })
      .catch(err => {
        console.warn("Brak endpointu GET dla celów na backendzie - fallback na cele demo:", err);
        setGoals([
          { id: 101, name: 'Na nowy komputer (Demo)', targetAmount: 5000.00, currentAmount: 1200.00, accountId: 1 },
          { id: 102, name: 'Wakacje 2026 (Demo)', targetAmount: 8000.00, currentAmount: 4500.00, accountId: 1 }
        ]);
        setLoadingGoals(false);
      });

    api.get(`/api/deposits/account/${loggedInAccountId}`)
      .then(res => {
        setDeposits(res.data);
        setLoadingDeposits(false);
      })
      .catch(err => {
        console.warn("Nie udało się pobrać lokat z backendu - fallback na lokaty demo:", err);
        setDeposits([
          { depositId: 501, accountId: 1, principal: 10000.00, interestRate: 0.06, currency: 'PLN', startDate: '2026-01-01', endDate: '2026-07-01', status: 'ACTIVE' }
        ]);
        setLoadingDeposits(false);
      });
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCreateGoal = (e: React.FormEvent) => {
    e.preventDefault();
    
    const payload = {
      name: goalName,
      targetAmount: Number(goalTarget)
    };

    api.post(`/api/saving-goals/account/${loggedInAccountId}`, payload)
      .then(res => {
        const successMsg = typeof res.data === 'string' ? res.data : `Skarbonka "${goalName}" została pomyślnie utworzona!`;
        setMessage({ text: successMsg, isError: false });
        setGoalName('');
        setGoalTarget('');
        fetchData();
      })
      .catch(err => {
        console.error(err);
        const errMsg = err.response?.data?.message || err.response?.data || "Wystąpił błąd podczas tworzenia celu.";
        setMessage({ text: typeof errMsg === 'object' ? "Błąd tworzenia celu" : errMsg, isError: true });
      });
  };

  const handleActivateSmartSaver = (goalId: number) => {
    api.post(`/api/saving-goals/account/${loggedInAccountId}/activate/${goalId}`)
      .then(res => {
        setActiveSmartSaverId(goalId);
        const successMsg = typeof res.data === 'string' ? res.data : "Smart Saver aktywowany!";
        setMessage({ text: successMsg, isError: false });
        fetchData();
      })
      .catch(err => {
        console.error(err);
        const errMsg = err.response?.data?.message || err.response?.data || "Błąd podczas aktywacji usługi Smart Saver.";
        setMessage({ text: typeof errMsg === 'object' ? "Błąd aktywacji" : errMsg, isError: true });
      });
  };

  const handleOpenDeposit = (e: React.FormEvent) => {
    e.preventDefault();
    
    let interestRate = 0.05;
    if (depositDuration === '6') interestRate = 0.055;
    if (depositDuration === '12') interestRate = 0.065;

    const payload: DepositRequestDTO = {
      accountId: loggedInAccountId,
      amount: Number(depositAmount),
      DurationInMonths: Number(depositDuration), 
      interestRate: interestRate,
      currency: depositCurrency
    };

    api.post('/api/deposits', payload)
      .then(res => {
        setMessage({ text: "Lokata została pomyślnie otwarta!", isError: false });
        setDepositAmount('');
        fetchData();
      })
      .catch(err => {
        console.error(err);
        const errMsg = err.response?.data?.message || err.response?.data || "Brak wystarczających środków na koncie.";
        setMessage({ text: typeof errMsg === 'object' ? "Nie udało się założyć lokaty." : errMsg, isError: true });
      });
  };

  const handleTerminateDeposit = (id: number) => {
    if (confirm("Czy na pewno chcesz zerwać lokatę przed terminem? Stracisz wypracowane odsetki.")) {
      api.post(`/api/deposits/${id}/terminate`)
        .then(res => {
          const info = typeof res.data === 'string' ? res.data : "Lokata została zerwana.";
          setMessage({ text: info, isError: false });
          
          
          setDeposits(prevDeposits => prevDeposits.filter(deposit => deposit.depositId !== id));
          
        
          fetchData();
        })
        .catch(err => {
          console.error(err);
          const errMsg = err.response?.data?.message || err.response?.data || "Nie udało się zerwać lokaty.";
          setMessage({ text: typeof errMsg === 'object' ? "Błąd zrywania lokaty" : errMsg, isError: true });
        });
    }
  };

 
  const activeDeposits = deposits.filter(deposit => deposit.status === 'ACTIVE');

  return (
    <div className="space-y-10">
      
      {message && (
        <div className={`p-4 rounded-xl border text-sm font-medium transition ${
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

    
      <section className="space-y-6">
        <div className="border-b border-slate-800 pb-2">
          <h2 className="text-2xl font-black text-white tracking-wide flex items-center gap-2">
            🐷 Skarbonki i Cele Oszczędnościowe
          </h2>
          <p className="text-xs text-slate-400 mt-1">Ustawiaj cele i oszczędzaj automatycznie dzięki funkcji Smart Saver.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          <form onSubmit={handleCreateGoal} className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 backdrop-blur-md shadow-xl flex flex-col justify-between">
            <div>
              <h3 className="font-bold text-slate-200 mb-4 text-sm uppercase tracking-wider text-emerald-400">Stwórz nowy cel</h3>
              <div className="space-y-4 text-sm">
                <div>
                  <label className="block text-xs text-slate-400 mb-1 font-medium">Nazwa skarbonki</label>
                  <input type="text" value={goalName} onChange={(e) => setGoalName(e.target.value)} placeholder="np. Nowy komputer, Podróże" required className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white focus:outline-none focus:border-emerald-500" />
                </div>
                <div>
                  <label className="block text-xs text-slate-400 mb-1 font-medium">Kwota docelowa (PLN)</label>
                  <input type="number" step="0.01" value={goalTarget} onChange={(e) => setGoalTarget(e.target.value)} placeholder="0.00" required className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white font-mono focus:outline-none focus:border-emerald-500" />
                </div>
              </div>
            </div>
            <button type="submit" className="w-full bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold text-xs py-3 rounded-xl transition duration-200 cursor-pointer shadow-lg mt-6">
              Uruchom skarbonkę
            </button>
          </form>

          <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {loadingGoals ? (
              <div className="col-span-2 text-center py-10 text-slate-500 text-xs font-mono animate-pulse">Pobieranie Twoich celów...</div>
            ) : (
              goals.map((goal, index) => {
                const progressPercent = goal.targetAmount > 0 ? Math.min((goal.currentAmount / goal.targetAmount) * 100, 100) : 0;
                const isSmartSaverActive = activeSmartSaverId === goal.id;
                const goalKey = goal.id ? `goal-${goal.id}` : `goal-index-${index}`;

                return (
                  <div key={goalKey} className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 backdrop-blur-md shadow-xl flex flex-col justify-between relative overflow-hidden">
                    
                    {isSmartSaverActive && (
                      <div className="absolute top-0 right-0 bg-emerald-500 text-slate-950 text-[10px] font-black px-3 py-1 rounded-bl-xl uppercase tracking-wider animate-pulse">
                        🚀 Smart Saver Aktywny
                      </div>
                    )}

                    <div>
                      <h4 className="font-bold text-white text-base pr-20 truncate">{goal.name}</h4>
                      <p className="text-xs text-slate-500 font-mono mt-1">ID celu: {goal.id}</p>
                      
                      <div className="mt-4 grid grid-cols-2 gap-2 border-t border-slate-800/60 pt-3">
                        <div>
                          <p className="text-[11px] text-slate-400">Zebrano</p>
                          <p className="text-lg font-black text-emerald-400 font-mono">{goal.currentAmount.toFixed(2)} zł</p>
                        </div>
                        <div className="text-right">
                          <p className="text-[11px] text-slate-400">Cel</p>
                          <p className="text-lg font-bold text-slate-300 font-mono">{goal.targetAmount.toFixed(2)} zł</p>
                        </div>
                      </div>

                      <div className="mt-4">
                        <div className="w-full bg-slate-950 rounded-full h-2 overflow-hidden border border-slate-800">
                          <div className="bg-emerald-500 h-2 rounded-full transition-all duration-500" style={{ width: `${progressPercent}%` }}></div>
                        </div>
                        <p className="text-right text-[10px] font-mono text-slate-400 mt-1">{progressPercent.toFixed(1)}% realizacji</p>
                      </div>
                    </div>

                    <button 
                      disabled={isSmartSaverActive}
                      onClick={() => handleActivateSmartSaver(goal.id)}
                      className={`w-full mt-4 text-xs font-bold py-2 rounded-xl transition ${isSmartSaverActive ? 'bg-slate-950 text-emerald-500 border border-emerald-500/20 cursor-not-allowed' : 'bg-slate-800 hover:bg-slate-700 text-slate-200 cursor-pointer'}`}
                    >
                      {isSmartSaverActive ? 'Skarbonka powiązana ze Smart Saver' : 'Podepnij Smart Saver'}
                    </button>

                  </div>
                );
              })
            )}
          </div>
        </div>
      </section>

      <section className="space-y-6">
        <div className="border-b border-slate-800 pb-2">
          <h2 className="text-2xl font-black text-white tracking-wide flex items-center gap-2">
            📈 Lokaty Oszczędnościowe
          </h2>
          <p className="text-xs text-slate-400 mt-1">Pomnażaj kapitał na bezpiecznych lokatach terminowych z automatycznym naliczaniem odsetek.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          <form onSubmit={handleOpenDeposit} className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 backdrop-blur-md shadow-xl flex flex-col justify-between">
            <div>
              <h3 className="font-bold text-slate-200 mb-4 text-sm uppercase tracking-wider text-amber-400">Otwórz nową lokatę</h3>
              <div className="space-y-4 text-sm">
                <div className="grid grid-cols-3 gap-2">
                  <div className="col-span-2">
                    <label className="block text-xs text-slate-400 mb-1 font-medium">Kwota na lokatę</label>
                    <input type="number" step="0.01" value={depositAmount} onChange={(e) => setDepositAmount(e.target.value)} placeholder="0.00" required className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white font-mono focus:outline-none focus:border-amber-500" />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-400 mb-1 font-medium">Waluta</label>
                    <select value={depositCurrency} onChange={(e) => setDepositCurrency(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white font-semibold focus:outline-none focus:border-amber-500 cursor-pointer">
                      <option value="PLN">PLN</option>
                      <option value="EUR">EUR</option>
                      <option value="USD">USD</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs text-slate-400 mb-1 font-medium">Okres trwania</label>
                  <select value={depositDuration} onChange={(e) => setDepositDuration(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white font-semibold focus:outline-none focus:border-amber-500 cursor-pointer">
                    <option value="3">3 Miesiące (Opr. 5.0%)</option>
                    <option value="6">6 Miesięcy (Opr. 5.5%)</option>
                    <option value="12">12 Miesięcy (Opr. 6.5%)</option>
                  </select>
                </div>
              </div>
            </div>
            <button type="submit" className="w-full bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs py-3 rounded-xl transition duration-200 cursor-pointer shadow-lg mt-6 shadow-amber-500/10">
              Załóż lokatę kapitałową
            </button>
          </form>

          <div className="lg:col-span-2 bg-slate-900/60 border border-slate-800 rounded-2xl p-6 backdrop-blur-md shadow-xl overflow-hidden">
            <h3 className="font-bold text-slate-200 mb-4 text-sm uppercase tracking-wider">Twoje aktywne lokaty</h3>
            
            <div className="overflow-x-auto rounded-xl border border-slate-800">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-950/60 text-slate-400 uppercase text-[11px] tracking-wider">
                  <tr>
                    <th className="p-3">Kapitał</th>
                    <th className="p-3">Oprocentowanie</th>
                    <th className="p-3">Data zapadalności</th>
                    <th className="p-3 text-right">Akcja</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 text-slate-300">
                  {loadingDeposits ? (
                    <tr>
                      <td colSpan={4} className="p-6 text-center text-xs text-slate-500 font-mono animate-pulse">Ładowanie lokat...</td>
                    </tr>
                  ) : activeDeposits.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="p-6 text-center text-xs text-slate-500 font-mono">Brak aktywnych lokat.</td>
                    </tr>
                  ) : (
                    activeDeposits.map((deposit, index) => {
                      const rowKey = deposit.depositId ? `deposit-${deposit.depositId}` : `deposit-index-${index}`;

                      return (
                        <tr key={rowKey} className="hover:bg-slate-800/20 transition">
                          <td className="p-3 font-mono font-bold text-white">
                            {deposit.principal.toLocaleString('pl-PL', { minimumFractionDigits: 2 })} {deposit.currency}
                          </td>
                          <td className="p-3 text-amber-400 font-mono font-semibold">
                            {(deposit.interestRate * 100).toFixed(1)}%
                          </td>
                          <td className="p-3 text-xs text-slate-400">
                            {deposit.endDate}
                          </td>
                          <td className="p-3 text-right">
                            <button 
                              onClick={() => {
                                if (deposit.depositId) {
                                  handleTerminateDeposit(deposit.depositId);
                                } else {
                                  setMessage({ text: "Błąd: Brak poprawnego ID lokaty.", isError: true });
                                }
                              }}
                              className="text-rose-400 hover:text-rose-300 border border-rose-500/20 hover:border-rose-500/50 bg-rose-500/5 px-2.5 py-1 rounded-lg text-xs font-semibold transition cursor-pointer"
                            >
                              Zerwij
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      </section>

    </div>
  );
}