
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import MapInterface from '../components/MapInterface';
import SearchResult from '../components/SearchResults';

const HomePage = () => {
  return (
    <div className="App">
      <Navbar/>
      <MapInterface/>
      {/* <SearchResult/> */}
      <Footer/>
    </div>
  );
}

export default HomePage;
