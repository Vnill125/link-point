import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom";
import { ShoppingCart } from "phosphor-react";

const Navigation = () => {
  const [cart, setCart] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    fetchCart();
    const interval = setInterval(fetchCart, 1000);
    return () => clearInterval(interval);
  }, []);

  const fetchCart = async () => {
    try {
      const token: string = 'Bearer twój token autoryzacyjny'; // Token autoryzacyjny
      const response = await fetch('http://188.137.111.131:8083/api/carts', {
        headers: {
          Authorization: token
        }
      });
      const cartData = await response.json();
      setCart(cartData.cart);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching cart:', error);
      setLoading(false);
    }
  };

  const calculateTotalQuantity = () => {
    if (!cart || !cart.items) return 0;
    return cart.items.reduce((total: number, item: any) => total + item.amount, 0);
  };

  return (
    <div className='bg-gray-100 p-4 flex flex-row shadow-2xl justify-between items-center'>
      <Link to={'/'}>
        <p className='ml-20 text-4xl font-semibold'>Link<span className='text-blue-400'>Shop</span></p>
      </Link>
      <div className='mr-20'>
        <Link to="/cart">
          <div className='flex'>
            <p className='text-black font-bold mr-2'>Koszyk</p>
            <div>
              <ShoppingCart size={32} />
              <p className='absolute right-[90px] top-8 text-red-500 font-bold'>{calculateTotalQuantity()}</p>
            </div>
          </div>
        </Link>
      </div>
    </div>
  )
}

export default Navigation;
