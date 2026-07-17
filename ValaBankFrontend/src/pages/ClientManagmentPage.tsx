import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8081',
  withCredentials: true
});

interface BalanceDTO {
  id: number;
  amount: number;
  currency: string;
}

interface AccountResponseDTO {
  id: number;
  accountNumber: number;
  balances: BalanceDTO[];
  clientId: number | null;
  dailyLimit: number;
  monthlyLimit: number;
}

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

export default function ClientManagementPage() {
  const [subTab, setSubTab] = useState<'search' | 'add-client' | 'add-account' | 'all-accounts'>('search');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterActive, setFilterActive] = useState<'ALL' | 'ACTIVE' | 'INACTIVE'>('ALL');
  
  const [selectedClient, setSelectedClient] = useState<ClientResponseDTO | null>(null);
  const [selectedClientAccounts, setSelectedClientAccounts] = useState<AccountResponseDTO[]>([]);

  const [newClient, setNewClient] = useState<CreateClientDTO>({ name: '', surname: '', email: '', birthDate: '' });
  const [newAccount, setNewAccount] = useState({ accountNumber: '', clientId: '' });
  const [clients, setClients] = useState<ClientResponseDTO[]>([]);
  const [allAccounts, setAllAccounts] = useState<AccountResponseDTO[]>([]);
  
  const [isLoading, setIsLoading] = useState(false);
  const [systemMessage, setSystemMessage] = useState('');
  const [systemError, setSystemError] = useState('');

 
  const fetchClients = async (searchParam = '') => {
    setIsLoading(true);
    setSystemError('');
    try {
      const url = searchParam ? `/api/client?search=${encodeURIComponent(searchParam)}` : '/api/client';
      const response = await api.get<ClientResponseDTO[]>(url);
      setClients(response.data);
      
      if (selectedClient) {
        const updated = response.data.find(c => c.id === selectedClient.id);
        if (updated) {
          setSelectedClient(updated);
          fetchAccountsForClient(updated.id);
        }
      }
    } catch (err) {
      console.error("Błąd podczas pobierania klientów:", err);
      setSystemError("Nie udało się połączyć z bazą danych ValaBank.");
    } finally {
      setIsLoading(false);
    }
  };

  
  const fetchAccountsForClient = async (clientId: number) => {
    try {
      const response = await api.get<AccountResponseDTO[]>(`/api/account/client/${clientId}`);
      setSelectedClientAccounts(response.data);
    } catch (err) {
      console.error("Błąd pobierania rachunków klienta:", err);
    }
  };

 
  const fetchAllAccounts = async () => {
    setIsLoading(true);
    try {
      const response = await api.get<AccountResponseDTO[]>('/api/account');
      setAllAccounts(response.data);
    } catch (err) {
      console.error("Błąd pobierania listy rachunków:", err);
      setSystemError("Nie udało się zaciągnąć globalnej listy rachunków.");
    } finally {
      setIsLoading(false);
    }
  };


  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      fetchClients(searchQuery);
    }, 300);
    return () => clearTimeout(delayDebounce);
  }, [searchQuery]);

  
  useEffect(() => {
    if (subTab === 'all-accounts') {
      fetchAllAccounts();
    }
  }, [subTab]);

  
  useEffect(() => {
    if (subTab === 'add-account' && clients.length === 0) {
      fetchClients();
    }
  }, [subTab]);

  const handleSelectClient = (client: ClientResponseDTO) => {
    setSelectedClient(client);
    fetchAccountsForClient(client.id);
  };

  
  const handleCreateClient = async (e: React.FormEvent) => {
    e.preventDefault();
    setSystemError('');
    setSystemMessage('');
    try {
      await api.post('/api/client', newClient);
      setSystemMessage(`Klient ${newClient.name} ${newClient.surname} został pomyślnie zarejestrowany!`);
      setNewClient({ name: '', surname: '', email: '', birthDate: '' });
      setSubTab('search');
      fetchClients();
    } catch (err) {
      console.error(err);
      setSystemError("Wystąpił błąd podczas zapisu profilu klienta.");
    }
  };


  const handleCreateAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    setSystemError('');
    setSystemMessage('');

    if (!newAccount.clientId) {
      setSystemError("Proszę wybrać klienta z listy rozwijanej.");
      return;
    }

    const targetClientId = Number(newAccount.clientId);
    const payload = {
      accountNumber: Number(newAccount.accountNumber),
      balances: [], 
      clientId: targetClientId
    };

    try {
      await api.post('/api/account', payload);
      setSystemMessage(`Rachunek № ${payload.accountNumber} został pomyślnie utworzony.`);
      
     
      setNewAccount({ accountNumber: '', clientId: '' });
      
      
      setSubTab('search');
      fetchClients(searchQuery).then(() => {
        const currentClient = clients.find(c => c.id === targetClientId);
        if (currentClient) {
          setSelectedClient(currentClient);
          fetchAccountsForClient(targetClientId);
        }
      });
    } catch (err) {
      console.error(err);
      setSystemError("Nie udało się utworzyć rachunku. Sprawdź, czy numer konta jest unikalny.");
    }
  };

 
  const handleToggleStatus = async (id: number) => {
    setSystemError('');
    try {
      await api.patch(`/api/client/${id}/toggle-status`);
      fetchClients(searchQuery);
    } catch (err) {
      console.error(err);
      setSystemError("Nie udało się zmienić statusu blokady klienta.");
    }
  };

  const filteredClients = clients.filter(client => {
    if (filterActive === 'ACTIVE') return client.isActive;
    if (filterActive === 'INACTIVE') return !client.isActive;
    return true;
  });

  return (
    <div className="max-w-5xl mx-auto space-y-6 text-sm animate-fadeIn">
      
      <Link to="/opcje" className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-emerald-400 font-mono transition">
        ⬅️ Wróć do Opcji i Zarządzania
      </Link>
      
      <div className="border-b border-slate-800 pb-3 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div>
          <h2 className="text-xl font-black text-white tracking-wide">👥 System Zarządzania Klientami i Kontami (CRM)</h2>
          <p className="text-xs text-slate-400 mt-0.5">Moduł operacyjny ValaBank do autoryzacji profili, kontroli sald i przydzielania rachunków.</p>
        </div>
        
        <div className="flex flex-wrap gap-1.5 bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs font-mono">
          <button onClick={() => { setSubTab('search'); setSelectedClient(null); }} className={`px-3 py-1.5 rounded-lg font-bold transition cursor-pointer ${subTab === 'search' ? 'bg-emerald-500 text-slate-950' : 'text-slate-400 hover:text-white'}`}>🔍 Lista Klientów</button>
          <button onClick={() => setSubTab('all-accounts')} className={`px-3 py-1.5 rounded-lg font-bold transition cursor-pointer ${subTab === 'all-accounts' ? 'bg-emerald-500 text-slate-950' : 'text-slate-400 hover:text-white'}`}>💳 Wszystkie Rachunki</button>
          <button onClick={() => setSubTab('add-client')} className={`px-3 py-1.5 rounded-lg font-bold transition cursor-pointer ${subTab === 'add-client' ? 'bg-emerald-500 text-slate-950' : 'text-slate-400 hover:text-white'}`}>➕ Nowy Klient</button>
          <button onClick={() => setSubTab('add-account')} className={`px-3 py-1.5 rounded-lg font-bold transition cursor-pointer ${subTab === 'add-account' ? 'bg-emerald-500 text-slate-950' : 'text-slate-400 hover:text-white'}`}>🪙 Przypisz Rachunek</button>
        </div>
      </div>

      {systemMessage && <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs rounded-xl font-mono">✓ {systemMessage}</div>}
      {systemError && <div className="p-3 bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs rounded-xl font-mono">⚠️ {systemError}</div>}

      
      {subTab === 'search' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          <div className="lg:col-span-2 space-y-4">
            <div className="flex flex-col sm:flex-row gap-3">
              <input 
                type="text" 
                placeholder="Szukaj w bazie po imieniu, nazwisku lub mailu..." 
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
                  {isLoading ? (
                    <tr><td colSpan={4} className="p-8 text-center text-slate-500 italic">Pobieranie aktualnych danych z repozytorium...</td></tr>
                  ) : filteredClients.length === 0 ? (
                    <tr><td colSpan={4} className="p-8 text-center text-slate-500 italic">Brak wyników.</td></tr>
                  ) : (
                    filteredClients.map(client => (
                      <tr key={client.id} className="hover:bg-slate-900/30 transition">
                        <td className="p-3">
                          <p className="font-bold text-white font-sans">{client.name} {client.surname}</p>
                          <p className="text-[10px] text-slate-500">ID klienta: {client.id}</p>
                        </td>
                        <td className="p-3 text-slate-300">{client.email}</td>
                        <td className="p-3">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${client.isActive ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'}`}>
                            {client.isActive ? 'AKTYWNY' : 'BLOKADA'}
                          </span>
                        </td>
                        <td className="p-3 text-right">
                          <button onClick={() => handleSelectClient(client)} className="text-emerald-400 hover:underline font-bold font-sans cursor-pointer">
                            Otwórz profil
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

        
          <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 space-y-4">
            <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider font-mono border-b border-slate-900 pb-2">📋 Kartoteka & Rachunki Walutowe</h4>
            {selectedClient ? (
              <div className="space-y-4 animate-fadeIn">
                <div>
                  <h3 className="text-base font-black text-white">{selectedClient.name} {selectedClient.surname}</h3>
                  <p className="text-xs text-slate-400 font-mono">ID: {selectedClient.id} | {selectedClient.email}</p>
                </div>
                
                <div>
                  <button 
                    onClick={() => handleToggleStatus(selectedClient.id)} 
                    className={`w-full text-xs py-2 rounded-xl cursor-pointer font-bold transition border ${
                      selectedClient.isActive 
                        ? 'bg-rose-500/10 text-rose-400 border-rose-500/20 hover:bg-rose-500 hover:text-slate-950' 
                        : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20 hover:bg-emerald-500 hover:text-slate-950'
                    }`}
                  >
                    {selectedClient.isActive ? '🔒 Zablokuj Profil' : '🔓 Aktywuj Profil'}
                  </button>
                </div>

                <div className="space-y-2 pt-2 border-t border-slate-900">
                  <p className="font-sans font-bold text-slate-200 text-xs">Aktywne rachunki (Dane z sub-systemu):</p>
                  
                  {selectedClientAccounts.length > 0 ? (
                    selectedClientAccounts.map((acc) => (
                      <div key={acc.id} className="bg-slate-900 p-3 rounded-xl border border-slate-800/80 space-y-2">
                        <div className="flex justify-between items-center text-xs text-slate-400">
                          <span className="text-emerald-400 font-bold">№ {acc.accountNumber}</span>
                          <span className="text-[10px] text-slate-500">ID: {acc.id}</span>
                        </div>
                        
                        <div className="space-y-1 pl-1 border-l-2 border-slate-800">
                          {acc.balances && acc.balances.length > 0 ? (
                            acc.balances.map((b) => (
                              <div key={b.id} className="flex justify-between text-xs">
                                <span className="text-slate-400">Saldo:</span>
                                <span className="text-white font-bold">{b.amount.toFixed(2)} <span className="text-emerald-400 text-[10px]">{b.currency}</span></span>
                              </div>
                            ))
                          ) : (
                            <p className="text-[10px] text-slate-600 italic">Brak zainicjalizowanych walut (0.00 PLN)</p>
                          )}
                        </div>

                        <div className="pt-1 flex justify-between text-[10px] text-slate-500 font-mono">
                          <span>Limit dz.: {acc.dailyLimit} zł</span>
                          <span>Lim. mies.: {acc.monthlyLimit} zł</span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-[11px] text-slate-500 italic pt-1">Brak powiązanych kont. Użyj zakładki "Przypisz Rachunek", aby wygenerować pierwsze konto dla tego klienta.</p>
                  )}
                </div>
              </div>
            ) : (
              <p className="text-xs text-slate-500 italic text-center py-8">Wybierz klienta z listy po lewej stronie, aby załadować salda, numery kont oraz limity operacyjne.</p>
            )}
          </div>
        </div>
      )}

  
      {subTab === 'all-accounts' && (
        <div className="space-y-4 animate-fadeIn">
          <div className="bg-slate-950 p-4 border border-slate-800 rounded-xl">
            <h3 className="text-sm font-bold text-white font-mono">Rejestr Wszystkich Rachunków Bankowych ValaBank</h3>
            <p className="text-xs text-slate-400">Pełne zestawienie kont przypisanych bezpośrednio pod identyfikatory klientów.</p>
          </div>

          <div className="bg-slate-950 rounded-xl border border-slate-800 overflow-hidden">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-slate-900 text-slate-400 uppercase text-[10px] border-b border-slate-800">
                <tr>
                  <th className="p-3">ID Rachunku</th>
                  <th className="p-3">Numer Rachunku (Long)</th>
                  <th className="p-3">ID Właściciela (Client)</th>
                  <th className="p-3">Saldа i Waluty</th>
                  <th className="p-3 text-right">Limity (Dz / Mies)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/40 text-slate-200">
                {isLoading ? (
                  <tr><td colSpan={5} className="p-8 text-center text-slate-500 italic">Pobieranie listy rachunków...</td></tr>
                ) : allAccounts.length === 0 ? (
                  <tr><td colSpan={5} className="p-8 text-center text-slate-500 italic">Brak otwartych rachunków w systemie.</td></tr>
                ) : (
                  allAccounts.map(acc => (
                    <tr key={acc.id} className="hover:bg-slate-900/30 transition">
                      <td className="p-3 text-slate-400">#{acc.id}</td>
                      <td className="p-3 font-bold text-white text-sm">№ {acc.accountNumber}</td>
                      <td className="p-3 text-slate-300">ID Klienta: {acc.clientId ?? 'Brak'}</td>
                      <td className="p-3 space-y-1">
                        {acc.balances && acc.balances.length > 0 ? (
                          acc.balances.map(b => (
                            <div key={b.id} className="bg-slate-900/60 px-2 py-0.5 rounded inline-block mr-1 text-[11px]">
                              <span className="text-white font-bold">{b.amount.toFixed(2)}</span> <span className="text-emerald-400 font-sans text-[10px]">{b.currency}</span>
                            </div>
                          ))
                        ) : (
                          <span className="text-slate-600 italic text-[11px]">Brak sald</span>
                        )}
                      </td>
                      <td className="p-3 text-right text-slate-400 text-[11px]">
                        <div>Dz: <span className="text-slate-200">{acc.dailyLimit} PLN</span></div>
                        <div>Mies: <span className="text-slate-200">{acc.monthlyLimit} PLN</span></div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

  
      {subTab === 'add-client' && (
        <form onSubmit={handleCreateClient} className="max-w-md mx-auto bg-slate-950 p-6 border border-slate-800 rounded-2xl space-y-4 animate-fadeIn">
          <div className="border-b border-slate-900 pb-2">
            <h3 className="text-sm font-bold text-white font-mono">CreateClientDTO ➡️ POST /api/client</h3>
            <p className="text-[11px] text-slate-500 mt-0.5">Wprowadź dane osobowe nowego klienta banku.</p>
          </div>
          <input type="text" placeholder="Imię" required value={newClient.name} onChange={e => setNewClient({...newClient, name: e.target.value})} className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-white focus:outline-none focus:border-emerald-500" />
          <input type="text" placeholder="Nazwisko" required value={newClient.surname} onChange={e => setNewClient({...newClient, surname: e.target.value})} className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-white focus:outline-none focus:border-emerald-500" />
          <input type="email" placeholder="E-mail" required value={newClient.email} onChange={e => setNewClient({...newClient, email: e.target.value})} className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-white focus:outline-none focus:border-emerald-500" />
          
          <div>
            <label className="block text-[11px] text-slate-500 mb-1 font-mono">Data urodzenia:</label>
            <input type="date" required value={newClient.birthDate} onChange={e => setNewClient({...newClient, birthDate: e.target.value})} className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-white font-mono focus:outline-none focus:border-emerald-500" />
          </div>

          <button type="submit" className="w-full bg-emerald-500 text-slate-950 font-bold py-2.5 rounded-xl text-xs uppercase tracking-wider hover:bg-emerald-600 transition cursor-pointer">
            Zapisz klienta w bazie
          </button>
        </form>
      )}

    
      {subTab === 'add-account' && (
        <form onSubmit={handleCreateAccount} className="max-w-md mx-auto bg-slate-950 p-6 border border-slate-800 rounded-2xl space-y-4 animate-fadeIn">
          <div className="border-b border-slate-900 pb-2">
            <h3 className="text-sm font-bold text-white font-mono">CreateAccountDTO ➡️ POST /api/account</h3>
            <p className="text-[11px] text-slate-500 mt-0.5">Otwórz nowy unikalny rachunek dla klienta zarejestrowanego w systemie.</p>
          </div>
          
          <div>
            <label className="block text-[11px] text-slate-500 mb-1 font-mono">Wybierz właściciela rachunku:</label>
            <select 
              required 
              value={newAccount.clientId} 
              onChange={e => setNewAccount({...newAccount, clientId: e.target.value})} 
              className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-white text-xs focus:outline-none focus:border-emerald-500 font-mono"
            >
              <option value="">-- Wybierz klienta z bazy danych --</option>
              {clients.map(c => (
                <option key={c.id} value={c.id}>
                  {c.surname} {c.name} (ID: {c.id})
                </option>
              ))}
            </select>
            {clients.length === 0 && (
              <p className="text-[10px] text-rose-400 mt-1 italic">Brak załadowanych klientów. Wróć do listy, aby odświeżyć dane.</p>
            )}
          </div>

          <div>
            <label className="block text-[11px] text-slate-500 mb-1 font-mono">Numer konta (wartość typu long):</label>
            <input 
              type="number" 
              placeholder="np. 55443322" 
              required 
              value={newAccount.accountNumber} 
              onChange={e => setNewAccount({...newAccount, accountNumber: e.target.value})} 
              className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-white font-mono focus:outline-none focus:border-emerald-500" 
            />
          </div>

          <button 
            type="submit" 
            disabled={!newAccount.clientId || !newAccount.accountNumber}
            className="w-full bg-emerald-500 text-slate-950 font-bold py-2.5 rounded-xl text-xs uppercase tracking-wider hover:bg-emerald-600 disabled:bg-slate-800 disabled:text-slate-500 transition cursor-pointer"
          >
            Generuj i otwórz rachunek
          </button>
        </form>
      )}

    </div>
  );
}