import './App.css';
import {
  BrowserRouter as Router,
  Route, Routes
} from 'react-router-dom';

import LoginPage from './Components/LoginPage/LoginPage';
import MainPage from './Components/MainPage/MainPage';
import ChildPage from './Components/ChildPage/ChildPage';
import GroupPage from './Components/GroupPage/GroupPage';
import Navigation from './Components/Common/Navigation';

function App() {
  var navig = <Navigation nav={[
    { "name": "Obecność", "address": "/" },
    { "name": "Dzieci", "address": "/children" },
    { "name": "Grupy", "address": "/groups" }]} />
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage/>} />
        <Route path="/" element={<MainPage nav={navig} />} />
        <Route path="/groups" element={<GroupPage nav={navig} />} />
        <Route path="/children" element={<ChildPage nav={navig} />} />
      </Routes>
    </Router>
  );
}

export default App;
