import './App.css';

import {
  BrowserRouter as Router,
  Route, Routes
} from 'react-router-dom';

import LoginPage from './Components/LoginPage/LoginPage';
import MainPage from './Components/MainPage/MainPage';
import ModifyPage from './Components/ModifyPage/ModifyPage';
import SummaryPage from './Components/SummaryPage/SummaryPage';
import LogoutPage from './Components/LogoutPage/LogoutPage';
import Navigation from './Components/Common/Navigation';
import TokenManager, { AuthPage } from './Components/Common/Session';

const navig = <Navigation nav={[
  { "name": "Obecność", "address": "/" },
  { "name": "Modyfikuj", "address": "/modify" },
  { "name": "Podsumowanie", "address": "/summary" },
  { "name": "Wyloguj", "address": "/logout" }]} />

function App() {
  return (
    <TokenManager>
      <Router>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/" element={<AuthPage><MainPage nav={navig} /></AuthPage>} />
          <Route path="/modify" element={<AuthPage><ModifyPage nav={navig} /></AuthPage>} />
          <Route path="/summary" element={<AuthPage><SummaryPage nav={navig} /></AuthPage>} />
          <Route path="/logout" element={<AuthPage><LogoutPage nav={navig} /></AuthPage>} />
        </Routes>
      </Router>
    </TokenManager>
  );
}

export default App;
