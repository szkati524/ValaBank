import { useState } from "react";
import { useEffect } from "react";


interface FinancialReportDTO {
  flowType: string;    // "INCOMING" lub "OUTGOING"
  totalAmount: number; 
}


const CURRENT_USER_ID = 42;

export default function StatisticPage() {
  const [reportData, setReportData] = useState<FinancialReportDTO[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');


  useEffect(() => {

    setTimeout(() => {
      try {
        const mockResponse: FinancialReportDTO[] = [
          { flowType: 'INCOMING', totalAmount: 5200.00 },
          { flowType: 'OUTGOING', totalAmount: 2840.50 }
        ];
        setReportData(mockResponse);
        setIsLoading(false);
      } catch (err) {
        setError('Nie udało się załadować statystyk miesięcznych.');
        setIsLoading(false);
      }
    }, 500);
  }, []);

  
  const incoming = reportData.find(r => r.flowType === 'INCOMING')?.totalAmount || 0;
  const outgoing = reportData.find(r => r.flowType === 'OUTGOING')?.totalAmount || 0;
  const totalVolume = incoming + outgoing; 
  const savingsDelta = incoming - outgoing;

 
  const burnRatePercent = incoming > 0 ? Math.min((outgoing / incoming) * 105, 100) : 0;

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64 text-sm font-mono text-emerald-400 animate-pulse">
        ⏳ Analizowanie Twoich przepływów finansowych w tym miesiącu...
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-rose-500/10 border border-rose-500/20 text-rose-400 p-4 rounded-xl text-xs font-mono">
        ⚠️ {error}
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      
     
      <div className="border-b border-slate-800 pb-3">
        <h2 className="text-2xl font-black text-white tracking-wide flex items-center gap-2">
          📊 Analiza Finansów i Statystyki
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          Zestawienie wygenerowane automatycznie na podstawie transakcji od <span className="text-slate-200 font-mono font-bold">1 dnia bieżącego miesiąca</span>.
        </p>
      </div>

     
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        
       
        <div className="bg-slate-900/40 border border-slate-800/80 rounded-2xl p-5 backdrop-blur-md shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 text-xs font-bold text-slate-800 font-mono">IN</div>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Suma Wpływów</p>
          <p className="text-3xl font-black text-emerald-400 font-mono mt-2">
            +{incoming.toLocaleString('pl-PL', { minimumFractionDigits: 2 })} <span className="text-sm font-normal">PLN</span>
          </p>
        </div>

       
        <div className="bg-slate-900/40 border border-slate-800/80 rounded-2xl p-5 backdrop-blur-md shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 text-xs font-bold text-slate-800 font-mono">OUT</div>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Suma Wydatków</p>
          <p className="text-3xl font-black text-rose-400 font-mono mt-2">
            -{outgoing.toLocaleString('pl-PL', { minimumFractionDigits: 2 })} <span className="text-sm font-normal">PLN</span>
          </p>
        </div>

      
        <div className="bg-slate-900/40 border border-slate-800/80 rounded-2xl p-5 backdrop-blur-md shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 text-xs font-bold text-slate-800 font-mono">NET</div>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Zostaje w kieszeni</p>
          <p className={`text-3xl font-black font-mono mt-2 ${savingsDelta >= 0 ? 'text-emerald-400' : 'text-amber-500'}`}>
            {savingsDelta >= 0 ? '+' : ''}{savingsDelta.toLocaleString('pl-PL', { minimumFractionDigits: 2 })} <span className="text-sm font-normal">PLN</span>
          </p>
        </div>

      </div>

     
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
       
        <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-6 backdrop-blur-md space-y-4">
          <h3 className="text-sm font-bold text-slate-200">Indeks Wydatków do Przychodów</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Pokazuje, jaki procent swoich miesięcznych przychodów przeznaczasz na koszty i przelewy wychodzące.
          </p>
          
          <div className="space-y-1.5 pt-2">
            <div className="w-full bg-slate-950 rounded-full h-3 overflow-hidden border border-slate-800/80">
              <div 
                className={`h-full rounded-full transition-all duration-700 ${burnRatePercent > 85 ? 'bg-rose-500' : burnRatePercent > 50 ? 'bg-amber-500' : 'bg-emerald-500'}`} 
                style={{ width: `${burnRatePercent}%` }}
              ></div>
            </div>
            <div className="flex justify-between text-xs font-mono text-slate-400">
              <span>Wydane: {burnRatePercent.toFixed(1)}%</span>
              <span>Wolne środki: {(100 - burnRatePercent).toFixed(1)}%</span>
            </div>
          </div>
        </div>

     
        <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-6 backdrop-blur-md flex flex-col justify-between">
          <h3 className="text-sm font-bold text-slate-200 mb-2">Struktura Wolumenu</h3>
          <div className="space-y-2 text-xs font-mono text-slate-400">
            <div className="flex justify-between border-b border-slate-800/60 pb-1.5">
              <span>Całkowity obrót (Volume):</span>
              <span className="text-white font-bold">{totalVolume.toFixed(2)} PLN</span>
            </div>
            <div className="flex justify-between border-b border-slate-800/60 pb-1.5">
              <span>Status Bilansu:</span>
              <span className={savingsDelta >= 0 ? 'text-emerald-400 font-bold' : 'text-rose-400 font-bold'}>
                {savingsDelta >= 0 ? 'NADWYŻKA' : 'DEFICYT'}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Kondycja konta:</span>
              <span className="text-slate-300 italic">Stabilna</span>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}