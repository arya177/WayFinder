import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import MyGroup from './pages/MyGroup';
import Settings from './pages/Settings';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/mygroups" element={<MyGroup />} />     
        <Route path="/settings" element={<Settings />} />   
      </Routes>
    </Router>
  );
}

export default App;
