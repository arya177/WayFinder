import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import MyGroup from './pages/MyGroup';
import Settings from './pages/Settings';
import GroupMap from './pages/GroupMap';
import SearchPage from './pages/SearchPage'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/search" element={<SearchPage />} />
        <Route path="/mygroups" element={<MyGroup />} />     
        <Route path="/settings" element={<Settings />} />  
        <Route path="/group-map" element={<GroupMap/>} />
      </Routes>
    </Router>
  );
}

export default App;
