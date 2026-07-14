import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; 

const CURRENT_USER_ROLE = 'ADMIN'; 

export default function Options() {
  const navigate = useNavigate(); 

  
  const [dailyLimit, setDailyLimit] = useState('');
  const [monthlyLimit, setMonthlyLimit] = useState('');
  const [currentDailyLimit, setCurrentDailyLimit] = useState(5000);
  const [currentMonthlyLimit, setCurrentMonthlyLimit] = useState(20000);

  const hasAccess = (allowedRoles: string[]) => {
    return allowedRoles.includes(CURRENT_USER_ROLE);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      
      
      <div className="border-b border-slate-800 pb-3">
        <h2 className="text-2xl font-black text-white tracking-wide flex items-center gap-2">
          ⚙️ Centrum Zarządzania i Ustawień
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          Zarządzaj swoim profilem osobistym lub przejdź do dedykowanych systemów operacyjnych ValaBank.
        </p>
      </div>

    
      {hasAccess(['EMPLOYEE', 'ADMIN']) && (
        <div className="space-y-3">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest font-mono">
            💼 Panele Operacyjne Personelu ({CURRENT_USER_ROLE})
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            
           
            <button
              onClick={() => navigate('/kredyt')}
              className="p-5 rounded-2xl border border-slate-800 bg-slate-900/40 text-left hover:border-indigo-500/50 hover:bg-slate-900/80 transition duration-300 cursor-pointer flex items-center gap-4 group"
            >
              <div className="p-3 rounded-xl bg-indigo-500/10 text-indigo-400 group-hover:bg-indigo-500 text-xl group-hover:text-slate-950 transition duration-300">
                🏦
              </div>
              <div>
                <p className="text-sm font-black text-white uppercase tracking-wider">Wnioski Kredytowe</p>
                <p className="text-[11px] text-slate-400 mt-0.5">Weryfikacja, scoring i akceptacja wniosków</p>
              </div>
            </button>

         
            <button
              onClick={() => navigate('/zarzadzanie-klientami')} 
              className="p-5 rounded-2xl border border-slate-800 bg-slate-900/40 text-left hover:border-emerald-500/50 hover:bg-slate-900/80 transition duration-300 cursor-pointer flex items-center gap-4 group"
            >
              <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-400 group-hover:bg-emerald-500 text-xl group-hover:text-slate-950 transition duration-300">
                👥
              </div>
              <div>
                <p className="text-sm font-black text-white uppercase tracking-wider">Zarządzanie Klientami</p>
                <p className="text-[11px] text-slate-400 mt-0.5">Baza CRM, otwieranie kont i blokady</p>
              </div>
            </button>

           
            <button
              onClick={() => navigate('/panel-hr')}
              disabled={!hasAccess(['ADMIN'])}
              className={`p-5 rounded-2xl border text-left flex items-center gap-4 group transition duration-300 ${
                hasAccess(['ADMIN']) 
                  ? 'border-slate-800 bg-slate-900/40 hover:border-rose-500/50 hover:bg-slate-900/80 cursor-pointer' 
                  : 'border-slate-900 bg-slate-950/20 opacity-40 select-none'
              }`}
            >
              <div className={`p-3 rounded-xl text-xl transition duration-300 ${hasAccess(['ADMIN']) ? 'bg-rose-500/10 text-rose-400 group-hover:bg-rose-500 group-hover:text-slate-950' : 'bg-slate-800'}`}>
                🛠️
              </div>
              <div>
                <p className="text-sm font-black text-white uppercase tracking-wider">Panel HR Pracownicy</p>
                <p className="text-[11px] text-slate-400 mt-0.5">{hasAccess(['ADMIN']) ? 'Zarządzanie uprawnieniami personelu' : 'Wymagana rola: System-Admin'}</p>
              </div>
            </button>

          </div>
        </div>
      )}

     
      <div className="space-y-3 pt-4 border-t border-slate-800/60">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest font-mono">
          👤 Ustawienia Twojego Konta Osobistego
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-6 backdrop-blur-md shadow-xl">
            <h3 className="text-sm font-bold text-cyan-400 uppercase tracking-wider mb-4">🛡️ Limity Transakcyjne</h3>
            <div className="bg-slate-950/80 p-3.5 rounded-xl mb-4 text-xs font-mono space-y-2 border border-slate-800/40">
              <div className="flex justify-between"><span className="text-slate-500">Dzienny limit:</span><span className="text-white font-bold">{currentDailyLimit.toLocaleString()} PLN</span></div>
              <div className="flex justify-between"><span className="text-slate-500">Miesięczny limit:</span><span className="text-white font-bold">{currentMonthlyLimit.toLocaleString()} PLN</span></div>
            </div>
            <div className="space-y-3 text-sm">
              <input type="number" value={dailyLimit} onChange={e => setDailyLimit(e.target.value)} placeholder="Nowy limit dzienny" className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white font-mono text-xs" />
              <input type="number" value={monthlyLimit} onChange={e => setMonthlyLimit(e.target.value)} placeholder="Nowy limit miesięczny" className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white font-mono text-xs" />
              <button className="w-full bg-cyan-500 text-slate-950 font-bold text-xs py-3 rounded-xl uppercase tracking-wider hover:bg-cyan-600 transition cursor-pointer">Zapisz limity</button>
            </div>
          </div>
          
          <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-6 flex flex-col justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider mb-2">🔒 Status Autoryzacji</h3>
              <p className="text-xs text-slate-400">Twoja aktywna rola sesji: <span className="text-cyan-400 font-bold font-mono">{CURRENT_USER_ROLE}</span></p>
            </div>
            <div className="bg-slate-950/60 p-4 border border-slate-800 rounded-xl text-xs text-slate-400 font-mono mt-4 leading-relaxed">
              ⚠️ Zmiana limitów wywołuje adnotację <span className="text-amber-500">@Transactional</span> i zapisuje dane bezpośrednio do bazy.
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}