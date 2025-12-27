import React from 'react'
import { Routes,Route, Router } from 'react-router-dom';
import Navbar from './components/Navbar/navbar'
import Footer from './components/Footer/footer'
import Home from './pages/index/Home';
import Cartpage from './pages/cart/Cartpage';
import Product from './pages/product/Product';
import Details from './pages/product/Details';
import About from './pages/about/About';
import Message from './components/Message/message';
import Buycoolmate from './components/Message/buycoolmate';
import ScrollToTop from './until/scroll';
import Odercart from './pages/cart/Odercart';
import Register from './pages/login/Register';
import Login from './pages/login/Login';
import { UserProvider } from './until/userContext';
import ChatAIApp from './components/Messages/chat';
import VnpayReturn from './pages/cart/Vnpay';

export default function App() {
  
  return (
    <div className='app'>
      <UserProvider>
      <ScrollToTop/>
      <Navbar/>
        <Routes>
        <Route path='/' element={<Home/>}/>
        <Route path='/cart' element={<Cartpage/>}/>
        <Route path='/product' element={<Product/>}/>
        <Route path='/detail' element={<Details/>}/>
        <Route path='/DangKy' element={<Register/>}/>
        <Route path='/about' element={<About/>}/>
        <Route path='/DangNhap' element={<Login/>}/>
        <Route path='/detail/:ma_san_pham' element={<Details/>}/>
        <Route path='/donhang' element={<Odercart/>}/>
        <Route path="/chatai" element={<ChatAIApp/>} />
        <Route path="/vnpay-return" element={<VnpayReturn />} />
        </Routes>
      <Message/>
      <Buycoolmate/>
      <Footer/>
      </UserProvider>
     
    </div>
  )
}
