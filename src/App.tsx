import { useApp } from './context/AppContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Shop from './pages/Shop';
import Product from './pages/Product';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Admin from './pages/Admin';

export default function App() {
  const { currentPage } = useApp();

  if (currentPage === 'admin') {
    return <Admin />;
  }

  return (
    <div className="flex flex-col min-h-full">
      <Navbar />
      <main className="flex-1">
        {currentPage === 'home' && <Home />}
        {currentPage === 'shop' && <Shop />}
        {currentPage === 'product' && <Product />}
        {currentPage === 'cart' && <Cart />}
        {(currentPage === 'checkout' || currentPage === 'confirmation') && <Checkout />}
      </main>
      <Footer />
    </div>
  );
}
