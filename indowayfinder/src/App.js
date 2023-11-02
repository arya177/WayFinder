import './App.css';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import MapInterface from './components/MapInterface';

function App() {
  return (
    <div className="App">
      <Navbar/>
      <MapInterface/>
      <Footer/>
    </div>
  );
}

export default App;
