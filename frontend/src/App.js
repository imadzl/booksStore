
import './App.css';
import { Navbar } from './Components/Navbar/Navbar';
import { BrowserRouter,Routes,Route } from 'react-router-dom';
import ShopCategory from './Pages/ShopCategory';
import Product from './Pages/Product';
import Cart from './Pages/Cart';
import LoginSignup from './Pages/LoginSignup';
import Shop from './Pages/Shop';
import Footer from './Components/Footer/Footer';
import fic_banner from './Components/Assets/banner_fic.png'
import nfic_banner from './Components/Assets/banner_nfic.png'
import teen_banner from './Components/Assets/banner_teen.png'
import Checkout from './Components/Checkout/Checkout';

function App() {
  return (
    <div>
      <BrowserRouter>
      <Navbar/>
      <Routes>
        <Route path='/' element={<Shop/>}/>
        <Route path='/Fiction' element={<ShopCategory banner={fic_banner} category="Fiction"/>}/>
        <Route path='/Non-Fiction' element={<ShopCategory banner={nfic_banner} category="Non-Fiction"/>}/>
        <Route path='/Children-Teen' element={<ShopCategory banner={teen_banner} category="Children-Teen"/>}/>
        <Route path="/product" element={<Product/>}>
          <Route path=':productId' element={<Product/>}/>
        </Route>
        <Route path='/cart' element={<Cart/>}/>
        <Route path='/login' element={<LoginSignup/>}/>
        <Route path='/checkout' element={<Checkout/>}/>
      </Routes>
      <Footer/>
      </BrowserRouter>
    </div>
  );
}

export default App;
