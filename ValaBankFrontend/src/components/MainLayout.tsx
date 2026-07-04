import { NavLink, Outlet } from 'react-router-dom';

export default function MainLayout() {

  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    `pb-2 px-1 whitespace-nowrap transition cursor-pointer border-b-2 ${
      isActive 
        ? 'text-emerald-400 border-emerald-400 font-bold' 
        : 'text-slate-400 border-transparent hover:text-slate-200 hover:border-slate-500'
    }`;

  return (
   
    <div className="min-h-screen bg-[url('/bank.jpg')] bg-cover bg-center bg-no-repeat text-slate-100 antialiased font-sans">
      <div className="min-h-screen bg-slate-950/85 backdrop-blur-xs flex flex-col">
        
       
        <header className="w-full border-b border-slate-800/60 bg-slate-900/40 backdrop-blur-md pt-6 pb-4 px-6">
          <div className="max-w-7xl mx-auto flex flex-col items-center space-y-6">
            
            <div className="text-center space-y-1 select-none">
              <h1 className="text-5xl font-extrabold tracking-widest text-emerald-400 drop-shadow-[0_0_15px_rgba(52,211,153,0.3)]">
                VALA BANK
              </h1>
              <p className="text-slate-400 text-sm tracking-wide uppercase font-medium">
                Przyszłość cyfryzacji bankowej
              </p>
            </div>
            
            <nav className="w-full border-t border-slate-800/40 pt-4">
              <div className="flex flex-wrap justify-between items-center w-full text-center text-sm font-semibold tracking-wide gap-4">
                
            
                <NavLink to="/pulpit" className={navLinkClass}>Pulpit</NavLink>
                <NavLink to="/konto-walutowe" className={navLinkClass}>Konto Walutowe</NavLink>
                <NavLink to="/konto-oszczednosciowe" className={navLinkClass}>Konto Oszczędnościowe</NavLink>
                <NavLink to="/przelew" className={navLinkClass}>Przelew</NavLink>
                <NavLink to="/kredyt" className={navLinkClass}>Kredyt</NavLink>
                <NavLink to="/historia" className={navLinkClass}>Historia i PDF</NavLink>
                <NavLink to="/statystyki" className={navLinkClass}>Statystyki</NavLink>
                <NavLink to="/opcje" className={navLinkClass}>Opcje</NavLink>
                
              
                <NavLink to="/wyloguj" className="text-rose-400 hover:text-rose-300 hover:border-b-2 hover:border-rose-500 transition cursor-pointer pb-2 px-1 whitespace-nowrap border-b-2 border-transparent">
                  Wyloguj się
                </NavLink>

              </div>
            </nav> 

          </div>
        </header>
        
   
        <main className="max-w-7xl mx-auto p-6 w-full flex-1">
      
          <Outlet />
        </main>

      </div>
    </div>
  );
}