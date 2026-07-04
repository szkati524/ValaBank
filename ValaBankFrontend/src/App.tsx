import './App.css'
import Desk from './pages/Desk';
import { BrowserRouter,Routes,Route,Navigate } from 'react-router-dom';
import MainLayout from './components/MainLayout';
import CurrencyAccount from './pages/CurrencyAccount';
import SavingPage from './pages/SavingPage';

function App() {
  return (
<BrowserRouter>
<Routes>
  
  <Route element={<MainLayout />}>
  <Route path="/" element={<Navigate to="/pulpit" replace />}/>
  <Route path="/pulpit" element={<Desk />} />
  <Route path="/konto-walutowe" element={<CurrencyAccount/>} />
  <Route path="/konto-oszczednosciowe" element={<SavingPage />} />
  </Route>
</Routes>
</BrowserRouter>
  );
}

export default App;