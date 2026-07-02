
import './App.css'

function App() {
  return(
    <div className="min-h-screen bg-[url('/bank.jpg')] bg-cover bg-center bg-no-repeat text-slate-100 antialiased font-sans">
    <div className ="min-h-screen bg-slate-950/85 backdrop-blur-xs flex flex-col items-center justify-center p-6">
    <div className="text-center space-y-3 select-none">
      <h1 className="text-5xl font-extrabold tracking-widest text-emerald-400 drop-shadow-[0_0_15px_rgba(52,211,153,0.3)]">
        VALA BANK
      </h1>
      <p className="text-slate-400 text-sm tracking-wide uppercase font-medium">
        Przyszłość cyfryzacji bankowej
      </p>
    </div>
    </div>
    </div>
  );
}

export default App
