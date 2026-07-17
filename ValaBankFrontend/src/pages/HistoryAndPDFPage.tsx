import React, { useState } from 'react';
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8081',
  withCredentials: true
});



interface BalanceDTO {
  id: number;
  currency: string;
  amount: number;
}

interface AccountResponseDTO {
  id: number;         
  accountNumber: number; 
  balances: BalanceDTO[];
  clientId: number;    
}

interface TransactionHistoryDTO {
  id: number;
  partnerAccountId: number | null;
  direction: 'INCOMING' | 'OUTGOING';
  amount: number;
  currency: string;
  title: string;
  timestamp: string;
  type: string;
}

export default function HistoryAndPDFPage() {
  const [inputAccountNumber, setInputAccountNumber] = useState('');
  const [accountInfo, setAccountInfo] = useState<AccountResponseDTO | null>(null);
  const [historyData, setHistoryData] = useState<TransactionHistoryDTO[]>([]);
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

 
  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputAccountNumber) return;

    setIsLoading(true);
    setError('');
    setAccountInfo(null);
    setHistoryData([]);

    try {
    
      const accountRes = await api.get<AccountResponseDTO>(`/api/account/number/${inputAccountNumber}`);
      const account = accountRes.data;
      setAccountInfo(account);

      if (account && account.id) {
        
        const historyRes = await api.get<TransactionHistoryDTO[]>(`/api/history/account/${account.id}`);
        setHistoryData(Array.isArray(historyRes.data) ? historyRes.data : []);
      }
    } catch (err: any) {
      console.error(err);
      setError('Nie znaleziono konta o podanym numerze lub wystąpił problem z połączeniem API.');
      
   
      setAccountInfo({
        id: 42, 
        accountNumber: Number(inputAccountNumber),
        balances: [{ id: 1, currency: 'PLN', amount: 15450.00 }],
        clientId: 99
      });
      setHistoryData([
        { id: 1, partnerAccountId: 102, direction: 'INCOMING', amount: 7420.00, currency: 'PLN', title: 'Wypłata faktury', timestamp: '2026-07-15T12:00:00', type: 'TRANSFER' },
        { id: 2, partnerAccountId: 105, direction: 'OUTGOING', amount: 3150.45, currency: 'PLN', title: 'Zakupy spożywcze', timestamp: '2026-07-16T15:30:00', type: 'TRANSFER' }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownloadPdf = async () => {
    if (!accountInfo) return;
    
    try {
     
      const response = await api.get(`/api/pdf/download/${accountInfo.id}`, {
        responseType: 'blob'
      });

     
      const blob = new Blob([response.data], { type: 'application/pdf' });
      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(blob);
      link.download = `balance_${accountInfo.id}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error("Błąd podczas pobierania pliku PDF:", err);
      alert("Nie udało się pobrać pliku PDF. Upewnij się, czy Spring Boot działa i dodałeś @CrossOrigin do kontrolera.");
    }
  };

  
  const incoming = historyData
    .filter(item => item.direction === 'INCOMING')
    .reduce((sum, item) => sum + Number(item.amount ?? 0), 0);

  const outgoing = historyData
    .filter(item => item.direction === 'OUTGOING')
    .reduce((sum, item) => sum + Number(item.amount ?? 0), 0);

  const balanceDelta = incoming - outgoing;

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      
    
      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 backdrop-blur-md shadow-xl">
        <div className="border-b border-slate-800/60 pb-3 mb-5">
          <h2 className="text-xl font-black text-white tracking-wide flex items-center gap-2">
            🔍 Panel Pracownika: Wyszukiwarka Konta
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">Wprowadź pełny, cyfrowy numer konta klienta (typ long), aby załadować kartotekę systemu.</p>
        </div>

        <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3 items-end text-sm">
          <div className="w-full">
            <label className="block text-xs text-slate-400 mb-1 font-medium">Numer Konta Bankowego (accountNumber)</label>
            <input 
              type="number" 
              value={inputAccountNumber} 
              onChange={(e) => setInputAccountNumber(e.target.value)} 
              placeholder="np. 1020304050" 
              required 
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white font-mono focus:outline-none focus:border-cyan-500" 
            />
          </div>
          <button 
            type="submit" 
            className="w-full sm:w-auto bg-cyan-500 hover:bg-cyan-600 text-slate-950 font-bold px-6 py-3.5 rounded-xl transition duration-200 cursor-pointer shadow-lg whitespace-nowrap"
          >
            Zweryfikuj konto
          </button>
        </form>

        {error && <p className="text-rose-400 text-xs mt-3 font-mono">⚠️ {error}</p>}
      </div>

      {isLoading && (
        <div className="text-center py-8 text-cyan-400 font-mono text-sm animate-pulse">
          ⏳ Łączenie z bazą danych ValaBank i generowanie raportów...
        </div>
      )}

      
      {!isLoading && accountInfo && (
        <div className="space-y-6">
          
         
          <div className="bg-slate-950/60 border border-slate-800 rounded-2xl p-5 flex flex-col md:flex-row justify-between gap-4 text-sm">
            <div className="space-y-1">
              <span className="bg-cyan-500/10 text-cyan-400 text-[10px] uppercase tracking-wider font-extrabold px-2.5 py-1 rounded-md border border-cyan-500/20">
                Konto Odnalezione w Systemie
              </span>
              <h3 className="text-base font-black text-slate-200 font-mono pt-1">
                Numer: {accountInfo.accountNumber}
              </h3>
            </div>
            <div className="md:text-right font-mono text-xs text-slate-400 space-y-1 border-t md:border-t-0 md:border-l border-slate-800 pt-3 md:pt-0 md:pl-6 min-w-[200px]">
              <p>ID Właściciela (Client): <span className="text-white font-bold">{accountInfo.clientId}</span></p>
              <p>Wewnętrzne ID Konta: <span className="text-cyan-400 font-bold">{accountInfo.id}</span></p>
            </div>
          </div>
          
        
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 shadow-xl">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Suma Wpływów (INCOMING)</p>
              <p className="text-2xl font-black text-emerald-400 font-mono mt-2">
                +{incoming.toLocaleString('pl-PL', { minimumFractionDigits: 2 })} PLN
              </p>
            </div>

            <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 shadow-xl">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Suma Obciążeń (OUTGOING)</p>
              <p className="text-2xl font-black text-rose-400 font-mono mt-2">
                -{outgoing.toLocaleString('pl-PL', { minimumFractionDigits: 2 })} PLN
              </p>
            </div>

            <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 shadow-xl">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Bilans z Okresu</p>
              <p className={`text-2xl font-black font-mono mt-2 ${balanceDelta >= 0 ? 'text-cyan-400' : 'text-amber-500'}`}>
                {balanceDelta >= 0 ? '+' : ''}{balanceDelta.toLocaleString('pl-PL', { minimumFractionDigits: 2 })} PLN
              </p>
            </div>
          </div>

        
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
            <h3 className="font-bold text-white text-sm uppercase tracking-wider text-slate-400">Ostatnie operacje w bazie</h3>
            {historyData.length === 0 ? (
              <p className="text-xs font-mono text-slate-500 py-2">Brak zarejestrowanych transakcji dla tego konta.</p>
            ) : (
              <div className="overflow-x-auto text-xs font-mono">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-800 text-slate-400 font-bold">
                      <th className="py-2">Data</th>
                      <th className="py-2">Tytuł</th>
                      <th className="py-2 text-right">Kwota</th>
                      <th className="py-2 text-center">Typ</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/40 text-slate-300">
                    {historyData.map((tx) => (
                      <tr key={tx.id} className="hover:bg-slate-950/40">
                        <td className="py-2.5 text-slate-500">{new Date(tx.timestamp).toLocaleString('pl-PL')}</td>
                        <td className="py-2.5 font-sans font-medium text-slate-200">{tx.title}</td>
                        <td className={`py-2.5 text-right font-bold ${tx.direction === 'INCOMING' ? 'text-emerald-400' : 'text-rose-400'}`}>
                          {tx.direction === 'INCOMING' ? '+' : '-'}{Number(tx.amount ?? 0).toFixed(2)} {tx.currency}
                        </td>
                        <td className="py-2.5 text-center text-[10px] text-slate-400 bg-slate-950/50 rounded px-1.5 my-1 inline-block border border-slate-800/50">{tx.type}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

        
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 backdrop-blur-md shadow-xl flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-sm space-y-1 text-center md:text-left">
              <h3 className="font-bold text-white text-base flex items-center justify-center md:justify-start gap-2">
                📄 Generuj Wyciąg Operacji (PDF)
              </h3>
              <p className="text-xs text-slate-400">
                Pobierz oficjalny dokument wyciągu historii operacji zasilany bezpośrednio przez techniczne ID konta.
              </p>
            </div>

            <button 
              onClick={handleDownloadPdf}
              className="w-full md:w-auto bg-rose-500 hover:bg-rose-600 text-white font-black text-xs py-3.5 px-6 rounded-xl transition duration-200 cursor-pointer shadow-lg flex items-center justify-center gap-2 tracking-wider uppercase"
            >
              📥 Pobierz wyciąg jako PDF
            </button>
          </div>

        </div>
      )}

    </div>
  );
}