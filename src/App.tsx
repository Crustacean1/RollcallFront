import './App.css';

import {
  BrowserRouter as Router,
  Route, Routes
} from 'react-router-dom';

import LoginPage from './Components/LoginPage/LoginPage';
import MainPage from './Components/MainPage/MainPage';
import ChildPage from './Components/ChildPage/ChildPage';
import GroupPage from './Components/GroupPage/GroupPage';
import SummaryPage from './Components/SummaryPage/SummaryPage';
import Navigation from './Components/Common/Navigation';
import TokenManager, { AuthPage } from './Components/Common/Session';

const navig = <Navigation nav={[
  { "name": "Obecność", "address": "/" },
  { "name": "Dzieci", "address": "/children" },
  { "name": "Grupy", "address": "/groups" },
  { "name": "Podsumowanie", "address": "/summary" }]} />

function App() {
  return (
    <TokenManager>
      <Router>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/" element={<AuthPage><MainPage nav={navig} /></AuthPage>} />
          <Route path="/groups" element={<GroupPage nav={navig} />} />
          <Route path="/children" element={<ChildPage nav={navig} />} />
          <Route path="/summary" element={<SummaryPage nav={navig} />} />
        </Routes>
      </Router>
    </TokenManager>
  );
}

export default App;
