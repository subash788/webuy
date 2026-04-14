import { Navbar } from "./components/Navbar/Navbar";
import {BrowserRouter,Routes,Route} from 'react-router-dom';
import Shop from './pages/Shop';
import ShopCategory from './pages/ShopCategory';
import LoginSignup from './pages/LoginSignup';
import Cart from './pages/Cart';
import Product from './pages/Product';
import Footer from "./components/Footer/Footer";
import ChatPage from "./pages/ChatPage";

import men_banner from './components/Assets/banner_mens.png'
import woman_banner from './components/Assets/banner_women.png'
import kid_banner from './components/Assets/banner_kids.png'
//import Breadcrum from "./components/Breadcrums/Breadcrum";


function App() {
  return (
    <div>
      <BrowserRouter>
       <Navbar />
       <Routes>
        <Route path='/' element={<Shop/>}/>
        <Route path='/mens' element={<ShopCategory banner={men_banner} category="men"/>}/>
        <Route path='/womens' element={<ShopCategory  banner={woman_banner} category="women"/>}/>
        <Route path='/kids' element={<ShopCategory  banner={kid_banner} category="kid"/>}/>
        <Route path='/product/:productId' element={<Product/>}/>

        <Route path='/cart' element={<Cart/>}/>
        <Route path='/login' element={<LoginSignup/>}/>
        <Route path="/chat" element={<ChatPage />} />
    
       </Routes>
       <Footer/>
      </BrowserRouter>
     
    </div>
    
  );
}

export default App;
