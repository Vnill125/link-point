import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'; 
import ProductList from './components/ProductList';
import ProductPage from './components/ProductPage';
import Cart from './components/Cart';
import CheckoutForm from './components/CheckoutForm';
import Navigation from './components/Navigation';

const App: React.FC = () => {
  return (
    <Router>
      <div className="app">
        <Navigation />
        <main className='m-16'>
          <Routes> 
            <Route path="/" element={<ProductList />} /> 
            <Route path="/:productGroup/product/:productId" element={<ProductPage />} /> 
            <Route path="/cart" element={<Cart />} /> 
            <Route path="/checkout" element={<CheckoutForm />} /> 
          </Routes> 
        </main>
      </div>
    </Router>
  );
};

export default App;
