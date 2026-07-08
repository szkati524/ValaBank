import React, { useState } from 'react';
import { Link } from 'react-router-dom';

interface ClientResponseDTO {
  id: number;
  name: string;
  surname: string;
  email: string;
  isActive: boolean;
  accountIds: number[];
  accountNumbers: number[];
}

interface CreateClientDTO {
  name: string;
  surname: string;
  email: string;
  birthDate: string;
}

interface CreateAccountDTO {
  accountNumber: number;
  balances: any[];
  clientId: number;
}

export default function ClientManagementPage() {
  const [subTab, setSubTab] = useState<'search' | 'add-client' | 'add-account'>('search');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterActive, setFilterActive] = useState<'ALL' | 'ACTIVE' | 'INACTIVE'>('ALL');
  const [selectedClient, setSelectedClient] = useState<ClientResponseDTO | null>(null);

  const [newClient, setNewClient] = useState<CreateClientDTO>({ name: '', surname: '', email: '', birthDate: '' });
  const [newAccount, setNewAccount] = useState({ accountNumber: '', clientId: '' });

  const [clients, setClients] = useState<ClientResponseDTO[]>([
    { id: 1, name: 'Jan', surname: 'Kowalski', email: 'jan@wp.pl', isActive: true, accountIds: [10], accountNumbers: [10203040] },
    { id: 2, name: 'Anna', surname: 'Nowak', email: 'anna@gmail.com', isActive: false, accountIds: [11], accountNumbers: [99887766] }
  ]);

  const filteredClients = clients.filter(client => {
    const matchesQuery = 
      client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      client.surname.toLowerCase().includes(searchQuery.toLowerCase()) ||
      client.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      client.accountNumbers.some(num => String(num).includes(searchQuery));

    return matchesQuery && (filterActive === 'ALL' || (filterActive === 'ACTIVE' && client.isActive) || (filterActive === 'INACTIVE' && !client.isActive));
  });

  const handleCreateClient = (e: React.FormEvent) => {
    e.preventDefault();
    const savedClient: ClientResponseDTO = {
      id: clients.length + 1,
      name: newClient.name,
      surname: newClient.surname,
      email: newClient.email,
      isActive: true,
      accountIds: [],
      accountNumbers: []
    };
    setClients([...clients, savedClient]);
    setNewClient({ name: '', surname: '', email: '', birthDate: '' });
    setSubTab('search');
  };

  const handleCreateAccount = (e: React.FormEvent) => {
    e.preventDefault();
    setClients(clients.map(c => c.id === Number(newAccount.clientId) ? { ...c, accountNumbers: [...c.accountNumbers, Number(newAccount.accountNumber)] } : c));
    setNewAccount({ accountNumber: '', clientId: '' });
    setSubTab('search');
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 text-sm animate-fadeIn">
      <Link to="/opcje" className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-emerald-400 font-mono transition">
        ⬅️ Wróć do Opcji i Zarządzania
      </Link>
      
      <div className="border-b border-slate-800 pb-3 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-black text-white tracking-wide">👥 System Zarządzania Klientami (CRM)</h2>
          <p className="text-xs text-slate-400 mt-0.5">Moduł operacyjny do autoryzacji profili i przydzielania rachunków.</p>
        </div>
        
        <div className="flex gap-1.5 bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs font-mono">
          <button onClick={() => { setSubTab('search'); setSelectedClient(null); }} className={`px-3 py-1.5 rounded-lg font-bold transition cursor-pointer ${subTab === 'search' ? 'bg-emerald-500 text-slate-950' : 'text-slate-400 hover:text-white'}`}>🔍 Lista & Akcje</button>
          <button onClick={() => setSubTab('add-client')} className={`px-3 py-1.5 rounded-lg font-bold transition cursor-pointer ${subTab === 'add-client' ? 'bg-emerald-500 text-slate-950' : 'text-slate-400 hover:text-white'}`}>➕ Zarejestruj Klienta</button>
          <button onClick={() => setSubTab('add-account')} className={`px-3 py-1.5 rounded-lg font-bold transition cursor-pointer ${subTab === 'add-account' ? 'bg-emerald-500 text-slate-950' : 'text-slate-400 hover:text-white'}`}>💳 Przypisz Rachunek</button>
        </div>
      </div>

      {subTab === 'search' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          <div className="lg:col-span-2 space-y-4">
            <div className="flex flex-col sm:flex-row gap-3">
              <input 
                type="text" 
                placeholder="Filtruj po imieniu, nazwisku, emailu, numerze konta..." 
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white text-xs font-mono focus:outline-none focus:border-emerald-500"
              />
              <select value={filterActive} onChange={(e: any) => setFilterActive(e.target.value)} className="bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-slate-400 font-mono focus:outline-none">
                <option value="ALL">Wszyscy</option>
                <option value="ACTIVE">Aktywni</option>
                <option value="INACTIVE">Zablokowani</option>
              </select>
            </div>

            <div className="bg-slate-950 rounded-xl border border-slate-800 overflow-hidden">
              <table className="w-full text-left text-xs font-mono">
                <thead className="bg-slate-900 text-slate-400 uppercase text-[10px] border-b border-slate-800">
                  <tr>
                    <th className="p-3">Klient</th>
                    <th className="p-3">Kontakt</th>
                    <th className="p-3">Status</th>
                    <th className="p-3 text-right">Zarządzaj</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/40 text-slate-200">
                  {filteredClients.map(client => (
                    <tr key={client.id} className="hover:bg-slate-900/30 transition">
                      <td className="p-3"><p className="font-bold text-white font-sans">{client.name} {client.surname}</p><p className="text-[10px] text-slate-500">ID: {client.id}</p></td>
                      <td className="p-3 text-slate-300">{client.email}</td>
                      <td className="p-3">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${client.isActive ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'}`}>{client.isActive ? 'AKTYWNY' : 'BLOKADA'}</span>
                      </td>
                      <td className="p-3 text-right"><button onClick={() => setSelectedClient(client)} className="text-emerald-400 hover:underline font-bold font-sans cursor-pointer">Otwórz</button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 space-y-4">
            <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider font-mono border-b border-slate-900 pb-2">📋 Podgląd Kartoteki</h4>
            {selectedClient ? (
              <div className="space-y-4 animate-fadeIn">
                <div>
                  <h3 className="text-base font-black text-white">{selectedClient.name} {selectedClient.surname}</h3>
                  <p className="text-xs text-slate-400 font-mono">{selectedClient.email}</p>
                </div>
                <div className="flex gap-2 border-t border-slate-900 pt-3">
                  <button onClick={() => setClients(clients.map(c => c.id === selectedClient.id ? {...c, isActive: !c.isActive} : c))} className="flex-1 bg-slate-900 text-slate-300 border border-slate-800 text-xs py-2 rounded-xl cursor-pointer">Toggle Status</button>
                </div>
                <div className="space-y-1 font-mono text-xs text-slate-400 pt-2">
                  <p className="font-sans font-bold text-white text-xs mb-1">Konta w @GetMapping:</p>
                  {selectedClient.accountNumbers.map(n => <div key={n} className="bg-slate-900 p-2 rounded border border-slate-800 flex justify-between"><span>№ {n}</span></div>)}
                </div>
              </div>
            ) : <p className="text-xs text-slate-500 italic text-center py-8">Wybierz profil z listy.</p>}
          </div>
        </div>
      )}

      {subTab === 'add-client' && (
        <form onSubmit={handleCreateClient} className="max-w-md mx-auto bg-slate-950 p-6 border border-slate-800 rounded-2xl space-y-4 animate-fadeIn">
          <h3 className="text-sm font-bold text-white">CreateClientDTO ➡️ @PostMapping("/api/client")</h3>
          <input type="text" placeholder="Imię" required value={newClient.name} onChange={e => setNewClient({...newClient, name: e.target.value})} className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-white" />
          <input type="text" placeholder="Nazwisko" required value={newClient.surname} onChange={e => setNewClient({...newClient, surname: e.target.value})} className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-white" />
          <input type="email" placeholder="E-mail" required value={newClient.email} onChange={e => setNewClient({...newClient, email: e.target.value})} className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-white" />
          <input type="date" required value={newClient.birthDate} onChange={e => setNewClient({...newClient, birthDate: e.target.value})} className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-white font-mono" />
          <button type="submit" className="w-full bg-emerald-500 text-slate-950 font-bold py-2.5 rounded-xl text-xs uppercase cursor-pointer">Zapisz Klienta</button>
        </form>
      )}

      {subTab === 'add-account' && (
        <form onSubmit={handleCreateAccount} className="max-w-md mx-auto bg-slate-950 p-6 border border-slate-800 rounded-2xl space-y-4 animate-fadeIn">
          <h3 className="text-sm font-bold text-white">CreateAccountDTO ➡️ @PostMapping("/api/account")</h3>
          <select required value={newAccount.clientId} onChange={e => setNewAccount({...newAccount, clientId: e.target.value})} className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-white text-xs">
            <option value="">Wybierz ID Klienta</option>
            {clients.map(c => <option key={c.id} value={c.id}>{c.name} {c.surname} (ID: {c.id})</option>)}
          </select>
          <input type="number" placeholder="Numer konta (long)" required value={newAccount.accountNumber} onChange={e => setNewAccount({...newAccount, accountNumber: e.target.value})} className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-white font-mono" />
          <button type="submit" className="w-full bg-emerald-500 text-slate-950 font-bold py-2.5 rounded-xl text-xs uppercase cursor-pointer">Otwórz Rachunek</button>
        </form>
      )}

    </div>
  );
}