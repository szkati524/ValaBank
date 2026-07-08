import React, { useState } from 'react';



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

interface FinancialReportDTO {
  flowType: string;    // "INCOMING" / "OUTGOING"
  totalAmount: number;
}

export default function HistoryAndPDFPage() {
  
  const [inputAccountNumber, setInputAccountNumber] = useState('');
  

  const [accountInfo, setAccountInfo] = useState<AccountResponseDTO | null>(null);
  const [reportData, setReportData] = useState<FinancialReportDTO[] | null>(null);
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');


  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputAccountNumber) return;

    setIsLoading(true);
    setError('');
    setAccountInfo(null);
    setReportData(null);

    try {
     
      const mockAccountResponse: AccountResponseDTO = {
        id: 42, 
        accountNumber: Number(inputAccountNumber),
        balances: [{ id: 1, currency: 'PLN', amount: 15450.00 }],
        clientId: 99
      };

     
      const mockStatsResponse: FinancialReportDTO[] = [
        { flowType: 'INCOMING', totalAmount: 7420.00 },
        { flowType: 'OUTGOING', totalAmount: 3150.45 }
      ];

   
      setAccountInfo(mockAccountResponse);
      setReportData(mockStatsResponse);

    } catch (err) {
      setError('Nie znaleziono konta bankowego o podanym numerze lub wystąpił błąd komunikacji.');
    } finally {
      setIsLoading(false);
    }
  };

  
  const handleDownloadPdf = () => {
    if (!accountInfo) return;
    
    
    alert(`Inicjuję pobieranie dokumentu PDF z ValaBank API.\n` +
          `Endpoint: /api/pdf/download/${accountInfo.id}\n` +
          `Generowanie dla Klienta o ID: ${accountInfo.clientId}`);
  };

  const incoming = reportData?.find(r => r.flowType === 'INCOMING')?.totalAmount || 0;
  const outgoing = reportData?.find(r => r.flowType === 'OUTGOING')?.totalAmount || 0;
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

   
      {!isLoading && accountInfo && reportData && (
        <div className="space-y-6 animate-fadeIn">
          
         
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
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Bilans Miesięczny</p>
              <p className={`text-2xl font-black font-mono mt-2 ${balanceDelta >= 0 ? 'text-cyan-400' : 'text-amber-500'}`}>
                {balanceDelta >= 0 ? '+' : ''}{balanceDelta.toLocaleString('pl-PL', { minimumFractionDigits: 2 })} PLN
              </p>
            </div>
          </div>

          
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 backdrop-blur-md shadow-xl flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-sm space-y-1 text-center md:text-left">
              <h3 className="font-bold text-white text-base flex items-center justify-center md:justify-start gap-2">
                📄 Generuj Wyciąg Operacji (PDF)
              </h3>
              <p className="text-xs text-slate-400">
                Pobierz wyciąg historii operacji zasilany bezpośrednio przez techniczne ID konta.
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