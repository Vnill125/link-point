import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const Cart = () => {
  const [cart, setCart] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    fetchCart();
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

  const clearCart = async () => {
    try {
      const token: string = 'Bearer twój token autoryzacyjny'; // Token autoryzacyjny
      const clearResponse = await fetch('http://188.137.111.131:8083/api/carts', {
        method: 'DELETE',
        headers: {
          Authorization: token,
          'Content-Type': 'application/json'
        }
      });
      if (clearResponse.ok) {
        alert('Cart cleared successfully!');
        setCart(null); 
      } else {
        alert('Failed to clear cart.');
      }
    } catch (error) {
      console.error('Error clearing cart:', error);
    }
  };

  const updateCart = async (updatedItems: any[]) => {
    try {
      const token: string = 'Bearer twój token autoryzacyjny'; // Token autoryzacyjny

      const updateResponse = await fetch('http://188.137.111.131:8083/api/carts', {
        method: 'POST', 
        headers: {
          Authorization: token,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ items: updatedItems })
      });

      if (updateResponse.ok) {
        alert('Cart updated successfully!');
        const totalPrice = updatedItems.reduce((total: number, item: any) => total + (item.amount * item.price_per_unit), 0);
        setCart({ ...cart, items: updatedItems, total_price: totalPrice });
      } else {
        alert('Failed to update cart.');
      }
    } catch (error) {
      console.error('Error updating cart:', error);
    }
  };

  const changeQuantity = async (itemUuid: string, newQuantity: number) => {
    try {
      const updatedItems = cart.items.map((item: any) => {
        if (item.uuid === itemUuid) {
          return { ...item, amount: newQuantity };
        }
        return item;
      });

      await updateCart(updatedItems);
    } catch (error) {
      console.error('Error updating quantity:', error);
    }
  };

  const removeItem = async (itemUuid: string) => {
    try {
      const token: string = 'Bearer twój token autoryzacyjny'; // Token autoryzacyjny
  
      const removeResponse = await fetch('http://188.137.111.131:8083/api/carts/items', {
        method: 'DELETE',
        headers: {
          Authorization: token,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ items: [itemUuid] })
      });
  
      if (removeResponse.ok) {
        alert('Item removed successfully!');
        const updatedItems = cart.items.filter((item: any) => item.uuid !== itemUuid);
        if (updatedItems.length === 0) {
          await clearCart();
          return;
        }
        await updateCart(updatedItems);
      } else {
        alert('Failed to remove item.');
      }
    } catch (error) {
      console.error('Error removing item:', error);
    }
  };

  if (loading) {
    return <div>Loading cart...</div>;
  }

  if (!cart || !cart.items || cart.items.length === 0) {
    return <div><h1 className='text-center font-semibold text-3xl'>Twój Koszyk jest pusty</h1></div>;
  }

  const calculateTotalQuantity = () => {
    if (!cart || !cart.items) return 0;
    return cart.items.reduce((total: number, item: any) => total + item.amount, 0);
  };

  return (
    <div className="container mx-auto px-4">
      <h2 className="text-center font-semibold text-4xl mb-8">Koszyk</h2>
      <p className="text-center">Liczba przedmiotów w koszyku: {calculateTotalQuantity()}</p>
      <ul>
        {cart.items.map((item: any) => (
          <li key={item.uuid} className="flex items-center justify-between border-b py-2">
            <div>
              <p>{item.product.name} - Quantity: {item.amount} - Cena za jeden: ${item.price_per_unit.toFixed(2)}</p>
            </div>
            <div className="flex">
              <button className="bg-green-500 text-white mx-2 py-1 px-2 focus:outline-none" onClick={() => changeQuantity(item.uuid, item.amount + 1)}>+</button>
              <button className="bg-red-500 text-white mx-2 py-1 px-2 focus:outline-none" onClick={() => changeQuantity(item.uuid, Math.max(1, item.amount - 1))}>-</button>
              <button className="text-red-500 hover:text-red-700 mx-2" onClick={() => removeItem(item.uuid)}>Usuń</button>
            </div>
          </li>
        ))}
      </ul>
      <div className="text-center">
        <button onClick={() => clearCart()} className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 focus:outline-none mt-4">Wyczyść koszyk</button>
        <p>Total Price: ${cart.total_price.toFixed(2)}</p>
        <Link to='/checkout' className="text-blue-500 hover:underline">Dostawa i płatność</Link>
      </div>
    </div>
  );
};

export default Cart;
