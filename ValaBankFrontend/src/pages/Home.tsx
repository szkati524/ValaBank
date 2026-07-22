import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Home() {
  const navigate = useNavigate();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isFirstLoginMode, setIsFirstLoginMode] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      if (isFirstLoginMode) {
       
        const response = await fetch('http://localhost:8081/api/auth/first-login/verify', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username }),
        });

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(errorText || 'Niepoprawny login lub konto jest już aktywne.');
        }

        navigate('/first-password', { state: { username } });
      } else {
        const response = await fetch('http://localhost:8081/api/auth/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ username, password }),
        });

        if (!response.ok) {
          throw new Error('Nieprawidłowy login lub hasło.');
        }

        const data = await response.json();
        
      
        localStorage.setItem('token', data.jwtToken || data.token);

        navigate('/pulpit');
      }
    } catch (err: any) {
      console.error("Błąd uwierzytelniania:", err);
      setError(err.message || 'Wystąpił błąd podczas połączenia z serwerem.');
    } finally {
      setIsLoading(false);
    }
  };

  const toggleMode = (firstLogin: boolean) => {
    setIsFirstLoginMode(firstLogin);
    setError('');
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
                <h2 className="text-lg font-bold text-white">
                  {isFirstLoginMode ? "Pierwsze logowanie / Aktywacja" : "Zaloguj się do systemu"}
                </h2>
                <p className="text-xs text-slate-400">
                  {isFirstLoginMode 
                    ? "Wprowadź wygenerowany identyfikator otrzymany w wiadomości e-mail." 
                    : "Wprowadź swoje poświadczenia autoryzacyjne."}
                </p>
              </div>

              {error && (
                <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-xs text-center font-mono">
                  ⚠️ {error}
                </div>
              )}

              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-1.5 text-left">
                  <label htmlFor="username-input" className="text-[10px] font-mono text-slate-500 uppercase tracking-wider block">
                    Identyfikator (Login)
                  </label>
                  <input 
                    id="username-input"
                    type="text" 
                    required
                    placeholder="np. VLB987654"
                    value={username}
                    onChange={e => setUsername(e.target.value)}
                    disabled={isLoading}
                    className="w-full bg-slate-950/80 border border-slate-800 rounded-xl p-3 text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-emerald-500 transition disabled:opacity-50"
                  />
                </div>

                {!isFirstLoginMode && (
                  <div className="space-y-1.5 text-left">
                    <div className="flex justify-between items-center">
                      <label htmlFor="password-input" className="text-[10px] font-mono text-slate-500 uppercase tracking-wider block">
                        Hasło dostępu
                      </label>
                      <a href="#reset-password" className="text-[10px] text-emerald-400 hover:underline">
                        Zapomniałeś hasła?
                      </a>
                    </div>
                    <input 
                      id="password-input"
                      type="password" 
                      required
                      placeholder="••••••••"
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      disabled={isLoading}
                      className="w-full bg-slate-950/80 border border-slate-800 rounded-xl p-3 text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-emerald-500 transition disabled:opacity-50"
                    />
                  </div>
                )}

                <button 
                  type="submit" 
                  disabled={isLoading}
                  className="w-full bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-extrabold text-xs py-3.5 rounded-xl uppercase tracking-widest transition duration-300 shadow-lg shadow-emerald-500/10 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading 
                    ? "Przetwarzanie..." 
                    : (isFirstLoginMode ? "Rozpocznij Aktywację ⚡" : "Uzyskaj Dostęp 🔑")}
                </button>
              </form>

              <div className="mt-6 pt-6 border-t border-slate-800/60 text-center">
                <p className="text-xs text-slate-500">
                  {isFirstLoginMode ? (
                    <>
                      Pamiętasz swoje hasło? <br />
                      <button 
                        type="button"
                        onClick={() => toggleMode(false)}
                        className="text-emerald-400 font-bold hover:underline cursor-pointer bg-transparent border-0 p-0 text-xs"
                      >
                        Wróć do tradycyjnego logowania
                      </button>
                    </>
                  ) : (
                    <>
                      Logujesz się po raz pierwszy? <br />
                      <button 
                        type="button"
                        onClick={() => toggleMode(true)} 
                        className="text-emerald-400 font-bold hover:underline cursor-pointer bg-transparent border-0 p-0 text-xs"
                      >
                        Aktywuj dostęp tutaj
                      </button>
                    </>
                  )}
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