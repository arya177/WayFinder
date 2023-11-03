
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import MapInterface from '../components/MapInterface';

const HomePage = () => {
  return (
    <div className="App">
      <Navbar/>
      <MapInterface/>
      <Footer/>
    </div>
  );
}

export default HomePage;
