import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

export default function FirstPassword() {
  const navigate = useNavigate();
  const location = useLocation();
  
  const initialUsername = location.state?.username || '';
  
  const [username, setUsername] = useState(initialUsername);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (newPassword !== confirmPassword) {
      setError('Wpisane hasła nie są identyczne.');
      return;
    }

    try {
     
      const response = await fetch('http://localhost:8081/api/auth/first-login/activate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: username,
          password: newPassword
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || 'Nie udało się aktywować konta.');
      }

      setSuccess('Konto aktywowane pomyślnie! Za chwilę nastąpi przekierowanie...');
      console.log(`Ustawiono nowe hasło dla użytkownika: ${username}`);
      
      
      setTimeout(() => {
        navigate('/');
      }, 2500);

    } catch (err: any) {
      setError(err.message || 'Wystąpił błąd podczas aktywacji konta. Spróbuj ponownie.');
    }
  };

  return (
    <div className="min-h-screen bg-[url('/bank.jpg')] bg-cover bg-center bg-no-repeat text-slate-100 flex flex-col font-sans">
      <div className="min-h-screen bg-slate-950/85 backdrop-blur-xs flex flex-col justify-center items-center px-4">
        
        <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-6 md:p-8 backdrop-blur-lg shadow-2xl max-w-md w-full relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/5 rounded-full blur-3xl"></div>
          
          <div className="mb-6 text-center">
            <h1 className="text-2xl font-black tracking-widest text-emerald-400 mb-2">VALA BANK</h1>
            <h2 className="text-lg font-bold text-white">Ustaw hasło dostępu</h2>
            <p className="text-xs text-slate-400">To Twoje pierwsze logowanie. Skonfiguruj bezpieczne hasło do konta.</p>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-xs text-red-400 text-center font-mono">
              ⚠️ {error}
            </div>
          )}

          {success && (
            <div className="mb-4 p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-xs text-emerald-400 text-center font-mono">
              ✅ {success}
            </div>
          )}

          <form onSubmit={handleUpdatePassword} className="space-y-4">
            <div className="space-y-1.5 text-left">
              <label className="text-[10px] font-mono text-slate-500 uppercase tracking-wider">Twój Identyfikator</label>
              <input 
                type="text" 
                required
                disabled={!!initialUsername} 
                value={username}
                onChange={e => setUsername(e.target.value)}
                className="w-full bg-slate-950/80 border border-slate-800 rounded-xl p-3 text-xs text-white disabled:opacity-50 focus:outline-none focus:border-cyan-500 transition"
              />
            </div>

            <div className="space-y-1.5 text-left">
              <label className="text-[10px] font-mono text-slate-500 uppercase tracking-wider">Nowe Hasło</label>
              <input 
                type="password" 
                required
                placeholder="••••••••"
                value={newPassword}
                onChange={e => setNewPassword(e.target.value)}
                className="w-full bg-slate-950/80 border border-slate-800 rounded-xl p-3 text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-cyan-500 transition"
              />
            </div>

            <div className="space-y-1.5 text-left">
              <label className="text-[10px] font-mono text-slate-500 uppercase tracking-wider">Powtórz Nowe Hasło</label>
              <input 
                type="password" 
                required
                placeholder="••••••••"
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                className="w-full bg-slate-950/80 border border-slate-800 rounded-xl p-3 text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-cyan-500 transition"
              />
            </div>

            <button 
              type="submit" 
              className="w-full bg-cyan-500 hover:bg-cyan-600 text-slate-950 font-extrabold text-xs py-3.5 rounded-xl uppercase tracking-widest transition duration-300 shadow-lg shadow-cyan-500/10 cursor-pointer"
            >
              Zapisz hasło i aktywuj konto 🚀
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-slate-800/60 text-center">
            <span 
              onClick={() => navigate('/')} 
              className="text-xs text-slate-400 hover:text-white cursor-pointer transition font-medium"
            >
              ← Anuluj i wróć
            </span>
          </div>
        </div>

      </div>
    </div>
  );
}