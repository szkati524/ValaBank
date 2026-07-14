import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Home() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    navigate('/pulpit');
  };

  return (
    <div className="min-h-screen bg-[url('/bank.jpg')] bg-cover bg-center bg-no-repeat text-slate-100 flex flex-col font-sans">
      
      <div className="min-h-screen bg-slate-950/85 backdrop-blur-xs flex flex-col justify-between">
        
       
        <header className="border-b border-slate-900 bg-slate-950/80 backdrop-blur-md sticky top-0 z-50 px-6 py-4">
          <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="text-center space-y-1 select-none">
              <h1 className="text-5xl font-extrabold tracking-widest text-emerald-400 drop-shadow-[0_0_15px_rgba(52,211,153,0.3)]">
                VALA BANK
              </h1>
              <p className="text-slate-400 text-sm tracking-wide uppercase font-medium">
                Przyszłość cyfryzacji bankowej
              </p>
            </div>
            <div className="hidden md:flex gap-6 text-xs font-mono text-slate-400">
              <a href="#features" className="hover:text-emerald-400 transition">Rachunki</a>
              <a href="#stats" className="hover:text-emerald-400 transition">Statystyki</a>
              <a href="#security" className="hover:text-emerald-400 transition">Bezpieczeństwo</a>
            </div>
          </div>
        </header>

       
        <main className="flex-1 max-w-7xl w-full mx-auto px-6 py-12 md:py-20 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
        
          <div className="lg:col-span-7 space-y-6 text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-mono">
              <span>⚡</span> Bankowość Nowej Generacji 2.0
            </div>
            
            <h1 className="text-4xl md:text-6xl font-black tracking-tight text-white leading-tight">
              Przyszłość finansów <br />
              <span className="bg-gradient-to-r from-emerald-400 via-cyan-400 to-indigo-500 bg-clip-text text-transparent">
                w Twoich rękach.
              </span>
            </h1>

            <p className="text-base text-slate-400 max-w-xl leading-relaxed">
              Zabezpiecz swój kapitał w stabilnym ekosystemie ValaBanku. Otwieraj błyskawicznie subkonta wielowalutowe, korzystaj z automatycznego scoringu kredytowego i zarządzaj aktywami z poziomu zaawansowanego pulpitu CRM.
            </p>

          
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 text-xs font-mono">
              <div className="p-3.5 rounded-xl border border-slate-900 bg-slate-900/35 backdrop-blur-md">
                <span className="text-emerald-400 text-base">🛡️</span>
                <p className="font-bold text-white mt-1">Gwarancja BFG</p>
                <p className="text-slate-500 text-[10px]">Pełne bezpieczeństwo środków</p>
              </div>
              <div className="p-3.5 rounded-xl border border-slate-900 bg-slate-900/35 backdrop-blur-md">
                <span className="text-cyan-400 text-base">🌐</span>
                <p className="font-bold text-white mt-1">Multiwaluty</p>
                <p className="text-slate-500 text-[10px]">PLN, EUR, USD, GBP</p>
              </div>
              <div className="p-3.5 rounded-xl border border-slate-900 bg-slate-900/35 backdrop-blur-md">
                <span className="text-indigo-400 text-base">🚀</span>
                <p className="font-bold text-white mt-1">Ekspres-Kredyt</p>
                <p className="text-slate-500 text-[10px]">Weryfikacja w 5 minut</p>
              </div>
            </div>
          </div>

         
          <div className="lg:col-span-5">
            <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-6 md:p-8 backdrop-blur-lg shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-3xl"></div>
              
              <div className="mb-6">
                <h2 className="text-lg font-bold text-white">Zaloguj się do systemu</h2>
                <p className="text-xs text-slate-400">Wprowadź swoje poświadczenia autoryzacyjne.</p>
              </div>

              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-1.5 text-left">
                  <label className="text-[10px] font-mono text-slate-500 uppercase tracking-wider">Adres E-mail</label>
                  <input 
                    type="email" 
                    required
                    placeholder="np. kowalski@valabank.pl"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className="w-full bg-slate-950/80 border border-slate-800 rounded-xl p-3 text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-emerald-500 transition"
                  />
                </div>

                <div className="space-y-1.5 text-left">
                  <div className="flex justify-between items-center">
                    <label className="text-[10px] font-mono text-slate-500 uppercase tracking-wider">Hasło dostępu</label>
                    <a href="#" className="text-[10px] text-emerald-400 hover:underline">Zapomniałeś hasła?</a>
                  </div>
                  <input 
                    type="password" 
                    required
                    placeholder="••••••••"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    className="w-full bg-slate-950/80 border border-slate-800 rounded-xl p-3 text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-emerald-500 transition"
                  />
                </div>

                <button 
                  type="submit" 
                  className="w-full bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-extrabold text-xs py-3.5 rounded-xl uppercase tracking-widest transition duration-300 shadow-lg shadow-emerald-500/10 cursor-pointer"
                >
                  Uzyskaj Dostęp 🔑
                </button>
              </form>

              <div className="mt-6 pt-6 border-t border-slate-800/60 text-center">
                <p className="text-xs text-slate-500">
                  Nie jesteś jeszcze naszym klientem? <br />
                  <span className="text-emerald-400 font-bold hover:underline cursor-pointer">Zgłoś wniosek o otwarcie konta</span>
                </p>
              </div>
            </div>
          </div>

        </main>

       
        <footer className="border-t border-slate-900 bg-slate-950 py-6 px-6 text-center text-[10px] font-mono text-slate-500">
          <p>© 2026 ValaBank S.A. Wszystkie prawa zastrzeżone. System chroniony adnotacjami @Transactional oraz protokołem SSL.</p>
        </footer>

      </div>
    </div>
  );
}