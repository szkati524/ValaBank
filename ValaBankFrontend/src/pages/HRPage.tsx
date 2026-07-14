import React, { useState } from 'react';
import { Link } from 'react-router-dom';


interface EmployeeResponseDTO {
  id: number;
  name: string;
  surname: string;
  email: string;
  role: 'EMPLOYEE' | 'ADMIN';
  hireDate: string;
}

interface CreateEmployeeDTO {
  name: string;
  surname: string;
  email: string;
  role: 'EMPLOYEE' | 'ADMIN';
}

export default function HRPage() {

  const [subTab, setSubTab] = useState<'list' | 'add-employee'>('list');
  
 
  const [searchQuery, setSearchQuery] = useState('');
  const [filterRole, setFilterRole] = useState<'ALL' | 'EMPLOYEE' | 'ADMIN'>('ALL');


  const [selectedEmployee, setSelectedEmployee] = useState<EmployeeResponseDTO | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState<CreateEmployeeDTO>({ name: '', surname: '', email: '', role: 'EMPLOYEE' });

  
  const [newEmployee, setNewEmployee] = useState<CreateEmployeeDTO>({ name: '', surname: '', email: '', role: 'EMPLOYEE' });


  const [employees, setEmployees] = useState<EmployeeResponseDTO[]>([
    { id: 1, name: 'Marek', surname: 'Kwiatkowski', email: 'm.kwiatkowski@valabank.pl', role: 'ADMIN', hireDate: '2024-03-15' },
    { id: 2, name: 'Karolina', surname: 'Zielińska', email: 'k.zielinska@valabank.pl', role: 'EMPLOYEE', hireDate: '2025-01-10' }
  ]);


  const filteredEmployees = employees.filter(emp => {
    const matchesQuery = 
      emp.id.toString() === searchQuery.trim() ||
      emp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      emp.surname.toLowerCase().includes(searchQuery.toLowerCase()) ||
      emp.email.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesRole = filterRole === 'ALL' || emp.role === filterRole;

    return matchesQuery && matchesRole;
  });


  const handleCreateEmployee = (e: React.FormEvent) => {
    e.preventDefault();
    const savedEmployee: EmployeeResponseDTO = {
      id: employees.length + 1,
      name: newEmployee.name,
      surname: newEmployee.surname,
      email: newEmployee.email,
      role: newEmployee.role,
      hireDate: new Date().toISOString().split('T')[0] 
    };

    setEmployees([...employees, savedEmployee]);
    setNewEmployee({ name: '', surname: '', email: '', role: 'EMPLOYEE' });
    setSubTab('list');
  };

  
  const handleUpdateEmployee = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedEmployee) return;

    const updatedList = employees.map(emp => emp.id === selectedEmployee.id ? {
      ...emp,
      name: editForm.name,
      surname: editForm.surname,
      email: editForm.email,
      role: editForm.role
    } : emp);

    setEmployees(updatedList);
    setSelectedEmployee({
      ...selectedEmployee,
      name: editForm.name,
      surname: editForm.surname,
      email: editForm.email,
      role: editForm.role
    });
    setIsEditing(false);
  };

  
  const handleDeleteEmployee = (id: number) => {
    if (window.confirm("Czy na pewno chcesz cofnąć akredytację i usunąć tego pracownika z systemu HR ValaBank?")) {
      setEmployees(employees.filter(emp => emp.id !== id));
      setSelectedEmployee(null);
    }
  };

  
  const startEditing = (emp: EmployeeResponseDTO) => {
    setEditForm({
      name: emp.name,
      surname: emp.surname,
      email: emp.email,
      role: emp.role
    });
    setIsEditing(true);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 text-sm animate-fadeIn">
      
      
      <Link to="/opcje" className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-rose-400 font-mono transition cursor-pointer">
        ⬅️ Wróć do Opcji i Zarządzania
      </Link>
      
   
      <div className="border-b border-slate-800 pb-3 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-black text-white tracking-wide">🛠️ Panel HR & Uprawnienia Personelu</h2>
          <p className="text-xs text-slate-400 mt-0.5">Zarządzanie kontami dostępowymi pracowników, modyfikacja ról i audyt kadrowy.</p>
        </div>
        
        
        <div className="flex gap-1.5 bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs font-mono">
          <button onClick={() => { setSubTab('list'); setSelectedEmployee(null); setIsEditing(false); }} className={`px-3 py-1.5 rounded-lg font-bold transition cursor-pointer ${subTab === 'list' ? 'bg-rose-500 text-slate-950' : 'text-slate-400 hover:text-white'}`}>🔍 Lista Pracowników</button>
          <button onClick={() => setSubTab('add-employee')} className={`px-3 py-1.5 rounded-lg font-bold transition cursor-pointer ${subTab === 'add-employee' ? 'bg-rose-500 text-slate-950' : 'text-slate-400 hover:text-white'}`}>➕ Dodaj Pracownika</button>
        </div>
      </div>

    
      {subTab === 'list' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          
         
          <div className="lg:col-span-2 space-y-4">
            <div className="flex flex-col sm:flex-row gap-3">
              <input 
                type="text" 
                placeholder="Filtruj po: UID, Imieniu, Nazwisku lub Adresie Email..." 
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white text-xs font-mono focus:outline-none focus:border-rose-500"
              />
              <select value={filterRole} onChange={(e: any) => setFilterRole(e.target.value)} className="bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-slate-400 font-mono focus:outline-none">
                <option value="ALL">Wszystkie Role</option>
                <option value="EMPLOYEE">Role: EMPLOYEE</option>
                <option value="ADMIN">Role: ADMIN</option>
              </select>
            </div>

            <div className="bg-slate-950 rounded-xl border border-slate-800 overflow-hidden">
              <table className="w-full text-left text-xs font-mono">
                <thead className="bg-slate-900 text-slate-400 uppercase text-[10px] border-b border-slate-800">
                  <tr>
                    <th className="p-3">Pracownik</th>
                    <th className="p-3">Identyfikator E-mail</th>
                    <th className="p-3">Rola Systemowa</th>
                    <th className="p-3 text-right">Zarządzaj</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/40 text-slate-200">
                  {filteredEmployees.map(emp => (
                    <tr key={emp.id} className="hover:bg-slate-900/30 transition">
                      <td className="p-3">
                        <p className="font-bold text-white font-sans">{emp.name} {emp.surname}</p>
                        <p className="text-[10px] text-slate-500">Zatrudniono: {emp.hireDate}</p>
                      </td>
                      <td className="p-3 text-slate-300">{emp.email}</td>
                      <td className="p-3">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${emp.role === 'ADMIN' ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20' : 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20'}`}>
                          {emp.role}
                        </span>
                      </td>
                      <td className="p-3 text-right">
                        <button onClick={() => { setSelectedEmployee(emp); setIsEditing(false); }} className="text-rose-400 hover:underline font-bold font-sans cursor-pointer">
                          Szczegóły ⚙️
                        </button>
                      </td>
                    </tr>
                  ))}
                  {filteredEmployees.length === 0 && (
                    <tr>
                      <td colSpan={4} className="text-center py-6 text-slate-500 italic">Brak zarejestrowanych pracowników spełniających filtry.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          
          <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 space-y-4 shadow-xl">
            <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider font-mono border-b border-slate-900 pb-2">📋 Inspekcja Konta Pracowniczego</h4>
            
            {selectedEmployee ? (
              <div className="space-y-4 animate-fadeIn">
                
                {isEditing ? (
                  
                  <form onSubmit={handleUpdateEmployee} className="space-y-3 border border-slate-800 p-3 rounded-xl bg-slate-900/20">
                    <p className="text-[10px] font-bold font-mono text-rose-400 uppercase">Modyfikacja Uprawnień HR</p>
                    <input type="text" value={editForm.name} onChange={e => setEditForm({...editForm, name: e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-xs text-white" placeholder="Imię" required />
                    <input type="text" value={editForm.surname} onChange={e => setEditForm({...editForm, surname: e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-xs text-white" placeholder="Nazwisko" required />
                    <input type="email" value={editForm.email} onChange={e => setEditForm({...editForm, email: e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-xs text-white" placeholder="Email służbowy" required />
                    <select value={editForm.role} onChange={e => setEditForm({...editForm, role: e.target.value as any})} className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-xs text-slate-300">
                      <option value="EMPLOYEE">EMPLOYEE (Konsultant)</option>
                      <option value="ADMIN">ADMIN (Główny Administrator)</option>
                    </select>
                    <div className="flex gap-2 pt-1">
                      <button type="submit" className="bg-rose-500 text-slate-950 font-bold px-3 py-1.5 rounded-lg text-xs cursor-pointer">Zapisz Zmiany</button>
                      <button type="button" onClick={() => setIsEditing(false)} className="bg-slate-800 text-slate-400 px-3 py-1.5 rounded-lg text-xs cursor-pointer">Anuluj</button>
                    </div>
                  </form>
                ) : (
                  
                  <div className="space-y-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-base font-black text-white">{selectedEmployee.name} {selectedEmployee.surname}</h3>
                        <p className="text-xs text-slate-400 font-mono">Pracownik ID: #{selectedEmployee.id}</p>
                      </div>
                      <button onClick={() => startEditing(selectedEmployee)} className="text-xs text-rose-400 hover:underline cursor-pointer">Edytuj ✏️</button>
                    </div>

                    <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-3 text-xs space-y-1 text-slate-300 font-mono">
                      <p><span className="text-slate-500">Login e-mail:</span> {selectedEmployee.email}</p>
                      <p><span className="text-slate-500">Rola w systemie:</span> <span className="text-white font-bold">{selectedEmployee.role}</span></p>
                      <p><span className="text-slate-500">Data zatrudnienia:</span> {selectedEmployee.hireDate}</p>
                    </div>

                    <div className="pt-2">
                      <button 
                        onClick={() => handleDeleteEmployee(selectedEmployee.id)} 
                        className="w-full bg-rose-500/10 text-rose-400 border border-rose-500/20 hover:bg-rose-500 hover:text-slate-950 font-bold text-xs py-2 rounded-xl cursor-pointer transition duration-300"
                      >
                        Zwolnij Pracownika (Usuń Dostęp) 🗑️
                      </button>
                    </div>
                  </div>
                )}
                
              </div>
            ) : (
              <p className="text-xs text-slate-500 italic text-center py-8">Wybierz członka personelu z listy, aby zarządzać uprawnieniami.</p>
            )}
          </div>
        </div>
      )}

      
      {subTab === 'add-employee' && (
        <form onSubmit={handleCreateEmployee} className="max-w-md mx-auto bg-slate-950 p-6 border border-slate-800 rounded-2xl space-y-4 animate-fadeIn">
          <h3 className="text-sm font-bold text-white border-b border-slate-900 pb-2">CreateEmployeeDTO ➡️ @PostMapping("/api/hr/employees")</h3>
          <input type="text" placeholder="Imię pracownika" required value={newEmployee.name} onChange={e => setNewEmployee({...newEmployee, name: e.target.value})} className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-white" />
          <input type="text" placeholder="Nazwisko pracownika" required value={newEmployee.surname} onChange={e => setNewEmployee({...newEmployee, surname: e.target.value})} className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-white" />
          <input type="email" placeholder="Adres e-mail (@valabank.pl)" required value={newEmployee.email} onChange={e => setNewEmployee({...newEmployee, email: e.target.value})} className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-white font-mono" />
          
          <div className="space-y-1">
            <label className="text-[11px] font-mono text-slate-400">Przypisz uprawnienia systemowe:</label>
            <select required value={newEmployee.role} onChange={e => setNewEmployee({...newEmployee, role: e.target.value as any})} className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-white text-xs">
              <option value="EMPLOYEE">EMPLOYEE (Dostęp operacyjny - scoring kredytowy, obsługa CRM)</option>
              <option value="ADMIN">ADMIN (Pełny dostęp zarządczy - w tym HR)</option>
            </select>
          </div>
          
          <button type="submit" className="w-full bg-rose-500 text-slate-950 font-bold py-2.5 rounded-xl text-xs uppercase cursor-pointer hover:bg-rose-600 transition">
            Autoryzuj i Stwórz Profil Kadrowy
          </button>
        </form>
      )}

    </div>
  );
}