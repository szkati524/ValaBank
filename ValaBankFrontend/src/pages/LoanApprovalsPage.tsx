import React, { useState } from 'react';
import { Link } from 'react-router-dom';


interface LoanApplicationDTO {
  id: number;
  clientId: number;
  clientName: string;
  clientSurname: string;
  requestedAmount: number;
  monthlyIncome: number;
  loanTermMonths: number;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  applicationDate: string;
  rejectionReason?: string;
}

export default function LoanApprovalsPage() {
 
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<'ALL' | 'PENDING' | 'APPROVED' | 'REJECTED'>('PENDING');

 
  const [selectedLoan, setSelectedLoan] = useState<LoanApplicationDTO | null>(null);
  const [decisionReason, setDecisionReason] = useState('');

  
  const [applications, setApplications] = useState<LoanApplicationDTO[]>([
    {
      id: 501,
      clientId: 1,
      clientName: 'Jan',
      clientSurname: 'Kowalski',
      requestedAmount: 45000,
      monthlyIncome: 6500,
      loanTermMonths: 24,
      status: 'PENDING',
      applicationDate: '2026-07-10',
    },
    {
      id: 502,
      clientId: 2,
      clientName: 'Anna',
      clientSurname: 'Nowak',
      requestedAmount: 120000,
      monthlyIncome: 4200,
      loanTermMonths: 60,
      status: 'PENDING',
      applicationDate: '2026-07-12',
    },
    {
      id: 503,
      clientId: 3,
      clientName: 'Piotr',
      clientSurname: 'Zieliński',
      requestedAmount: 15000,
      monthlyIncome: 8000,
      loanTermMonths: 12,
      status: 'APPROVED',
      applicationDate: '2026-07-01',
    }
  ]);

 
  const filteredApplications = applications.filter(app => {
    const matchesQuery =
      app.id.toString() === searchQuery.trim() ||
      app.clientSurname.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.requestedAmount.toString().includes(searchQuery);

    const matchesStatus = filterStatus === 'ALL' || app.status === filterStatus;

    return matchesQuery && matchesStatus;
  });


  const calculateEstimatedRate = (amount: number, months: number) => {
  
    const annualRate = 0.08;
    const monthlyRate = annualRate / 12;
    return Math.round((amount * monthlyRate) / (1 - Math.pow(1 + monthlyRate, -months)));
  };

 
  const calculateDTI = (monthlyRate: number, income: number) => {
    return Math.round((monthlyRate / income) * 100);
  };


  const handleDecision = (id: number, newStatus: 'APPROVED' | 'REJECTED') => {
    if (newStatus === 'REJECTED' && !decisionReason.trim()) {
      alert('Proszę podać powód odrzucenia wniosku kredytowego!');
      return;
    }

    const updatedList = applications.map(app => {
      if (app.id === id) {
        return {
          ...app,
          status: newStatus,
          rejectionReason: newStatus === 'REJECTED' ? decisionReason : undefined
        };
      }
      return app;
    });

    setApplications(updatedList);
    
    
    const updatedSelected = updatedList.find(app => app.id === id);
    if (updatedSelected) {
      setSelectedLoan(updatedSelected);
    }

    setDecisionReason('');
    alert(`Wniosek #${id} został pomyślnie zweryfikowany: ${newStatus === 'APPROVED' ? 'ZAAKCEPTOWANY' : 'ODRZUCONY'}`);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 text-sm animate-fadeIn">
      
     
      <Link to="/opcje" className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-indigo-400 font-mono transition cursor-pointer">
        ⬅️ Wróć do Opcji i Zarządzania
      </Link>

     
      <div className="border-b border-slate-800 pb-3">
        <h2 className="text-xl font-black text-white tracking-wide">🏦 System Scoringowy i Weryfikacja Kredytowa</h2>
        <p className="text-xs text-slate-400 mt-0.5">Weryfikacja zdolności kredytowej, analiza wskaźnika DTI oraz podejmowanie decyzji finansowych.</p>
      </div>

     
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        
     
        <div className="lg:col-span-2 space-y-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <input 
              type="text" 
              placeholder="Szukaj wniosku po: ID, Nazwisku wnioskodawcy lub kwocie..." 
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white text-xs font-mono focus:outline-none focus:border-indigo-500"
            />
            <select value={filterStatus} onChange={(e: any) => setFilterStatus(e.target.value)} className="bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-slate-400 font-mono focus:outline-none">
              <option value="ALL">Wszystkie statusy</option>
              <option value="PENDING">Oczekujące (Do weryfikacji)</option>
              <option value="APPROVED">Zaakceptowane</option>
              <option value="REJECTED">Odrzucone</option>
            </select>
          </div>

     
          <div className="bg-slate-950 rounded-xl border border-slate-800 overflow-hidden">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-slate-900 text-slate-400 uppercase text-[10px] border-b border-slate-800">
                <tr>
                  <th className="p-3">ID / Data</th>
                  <th className="p-3">Wnioskodawca</th>
                  <th className="p-3">Kwota wnioskowana</th>
                  <th className="p-3 text-right">Status / Akcja</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/40 text-slate-200">
                {filteredApplications.map(app => (
                  <tr key={app.id} className="hover:bg-slate-900/30 transition">
                    <td className="p-3">
                      <p className="font-bold text-white">#{app.id}</p>
                      <p className="text-[10px] text-slate-500">{app.applicationDate}</p>
                    </td>
                    <td className="p-3">
                      <p className="font-sans font-bold text-slate-300">{app.clientName} {app.clientSurname}</p>
                      <p className="text-[10px] text-slate-500">ID Klienta: #{app.clientId}</p>
                    </td>
                    <td className="p-3">
                      <p className="text-white font-bold">{app.requestedAmount.toLocaleString()} PLN</p>
                      <p className="text-[10px] text-slate-500">Okres: {app.loanTermMonths} mies.</p>
                    </td>
                    <td className="p-3 text-right">
                      <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-sans font-bold mr-3 ${
                        app.status === 'PENDING' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' :
                        app.status === 'APPROVED' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                        'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                      }`}>
                        {app.status === 'PENDING' ? 'DO DECYZJI' : app.status === 'APPROVED' ? 'ZAAKCEPTOWANY' : 'ODRZUCONY'}
                      </span>
                      <button onClick={() => setSelectedLoan(app)} className="text-indigo-400 hover:underline font-bold font-sans cursor-pointer">
                        Analizuj 🔎
                      </button>
                    </td>
                  </tr>
                ))}
                {filteredApplications.length === 0 && (
                  <tr>
                    <td colSpan={4} className="text-center py-8 text-slate-500 italic">Brak wniosków spełniających wybrane kryteria.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

       
        <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 space-y-4 shadow-xl">
          <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider font-mono border-b border-slate-900 pb-2">📋 Karta scoringowa wniosku</h4>
          
          {selectedLoan ? (
            <div className="space-y-4 animate-fadeIn">
              <div>
                <h3 className="text-base font-black text-white">{selectedLoan.clientName} {selectedLoan.clientSurname}</h3>
                <p className="text-xs text-slate-400 font-mono">Wniosek kredytowy #{selectedLoan.id}</p>
              </div>

              
              <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-3 text-xs space-y-2 font-mono text-slate-300">
                <div className="flex justify-between">
                  <span className="text-slate-500">Miesięczny dochód:</span>
                  <span className="text-white font-bold">{selectedLoan.monthlyIncome.toLocaleString()} PLN</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Kwota kredytu:</span>
                  <span className="text-white font-bold">{selectedLoan.requestedAmount.toLocaleString()} PLN</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Okres spłaty:</span>
                  <span className="text-white">{selectedLoan.loanTermMonths} miesięcy</span>
                </div>
                
              
                <div className="border-t border-slate-800 pt-2 mt-1 space-y-2">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Szacowana rata:</span>
                    <span className="text-cyan-400 font-bold">
                      {calculateEstimatedRate(selectedLoan.requestedAmount, selectedLoan.loanTermMonths).toLocaleString()} PLN/mies.
                    </span>
                  </div>
                  
                 
                  {(() => {
                    const estRate = calculateEstimatedRate(selectedLoan.requestedAmount, selectedLoan.loanTermMonths);
                    const dti = calculateDTI(estRate, selectedLoan.monthlyIncome);
                    const isRisky = dti > 50; 

                    return (
                      <div className="flex justify-between items-center">
                        <span className="text-slate-500">Obciążenie (DTI):</span>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-sans font-bold ${
                          isRisky ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20' : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                        }`}>
                          {dti}% {isRisky ? '(WYSOKIE RYZYKO)' : '(BEZPIECZNE)'}
                        </span>
                      </div>
                    );
                  })()}
                </div>
              </div>

             
              {selectedLoan.status !== 'PENDING' && (
                <div className={`p-3 rounded-xl text-xs font-mono border ${
                  selectedLoan.status === 'APPROVED' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                }`}>
                  <p className="font-bold uppercase mb-1">Decyzja: {selectedLoan.status === 'APPROVED' ? 'ZAAKCEPTOWANO' : 'ODRZUCONO'}</p>
                  {selectedLoan.rejectionReason && <p className="text-slate-400"><span className="text-slate-500">Powód:</span> {selectedLoan.rejectionReason}</p>}
                </div>
              )}

             
             
              {selectedLoan.status === 'PENDING' && (
                <div className="space-y-3 pt-2 border-t border-slate-900">
                  <p className="text-[11px] font-mono text-slate-500">Notatka/Uzasadnienie decyzji (wymagane przy odrzuceniu):</p>
                  <textarea 
                    placeholder="Wpisz krótki powód odrzucenia lub notatkę z audytu..."
                    value={decisionReason}
                    onChange={e => setDecisionReason(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-white text-xs font-sans focus:outline-none focus:border-indigo-500 h-20 resize-none"
                  />
                  
                  <div className="flex gap-2">
                    <button 
                      onClick={() => handleDecision(selectedLoan.id, 'APPROVED')}
                      className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold py-2.5 rounded-xl text-xs uppercase tracking-wider transition cursor-pointer"
                    >
                      👍 Akceptuj
                    </button>
                    <button 
                      onClick={() => handleDecision(selectedLoan.id, 'REJECTED')}
                      className="flex-1 bg-rose-500/10 border border-rose-500/30 hover:bg-rose-500 hover:text-slate-950 text-rose-400 font-bold py-2.5 rounded-xl text-xs uppercase tracking-wider transition cursor-pointer"
                    >
                      👎 Odrzuć
                    </button>
                  </div>
                </div>
              )}

            </div>
          ) : (
            <p className="text-xs text-slate-500 italic text-center py-8 font-sans">Wybierz wniosek z tabeli obok, aby przejść do analizy scoringowej.</p>
          )}
        </div>

      </div>

    </div>
  );
}