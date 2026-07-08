import './App.css'
import Desk from './pages/Desk';
import { BrowserRouter,Routes,Route,Navigate } from 'react-router-dom';
import MainLayout from './components/MainLayout';
import CurrencyAccount from './pages/CurrencyAccount';
import SavingPage from './pages/SavingPage';
import TransactionPage from './pages/TransactionPage';
import LoanPage from './pages/LoanPage';
import HistoryAndPDFPage from './pages/HistoryAndPDFPage';
import StatisticPage from './pages/Statistic';
import Options from './pages/Options';
import ClientManagementPage from './pages/ClientManagmentPage';

function App() {
  return (
<BrowserRouter>
<Routes>
  
  <Route element={<MainLayout />}>
  <Route path="/" element={<Navigate to="/pulpit" replace />}/>
  <Route path="/pulpit" element={<Desk />} />
  <Route path="/konto-walutowe" element={<CurrencyAccount/>} />
  <Route path="/konto-oszczednosciowe" element={<SavingPage />} />
  <Route path ="/przelew" element={<TransactionPage/>} />
  <Route path="/kredyt" element={<LoanPage/>}/>
  <Route path="/historia-pdf" element={<HistoryAndPDFPage />} />
  <Route path="/statystyki" element={<StatisticPage />} />
  <Route path="/opcje" element={<Options />} />
  <Route path="/zarzadzanie-klientami" element={<ClientManagementPage />} />
 {/*} <Route path="/weryfikacja-kredytowa" element={<LoanApprovalsPage />} /> {*/}
 {/*} <Route path="/panel-hr" element={<EmployeeManagmentPage />} />{*/}
  </Route>
</Routes>
</BrowserRouter>
  );
}

export default App;