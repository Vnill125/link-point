import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import CheckoutFormSchema from './CheckoutFormSchema';

const CheckoutForm = () => {
  const [cart, setCart] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(CheckoutFormSchema)
  });

  useEffect(() => {
    fetchCart();
  }, []);
  
  const sendOrder = async (formData: any) => {
    try {
      const response = await fetch('http://188.137.111.131:8083/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });
      if (response.ok) {
        const responseData = await response.json();
        console.log('Numer zamówienia:', responseData);
      } else {
        console.error('Błąd podczas tworzenia zamówienia');
      }
    } catch (error) {
      console.error('Wystąpił błąd:', error);
    }
  };

  const onSubmit = (data: any) => {
    sendOrder(data);
  };

  const fetchCart = async () => {
    try {
      const token = 'Bearer twój token autoryzacyjny'; // Token autoryzacyjny
      const response = await fetch('http://188.137.111.131:8083/api/carts', {
        headers: {
          Authorization: token
        }
      });
      if (response.ok) {
        const cartData = await response.json();
        setCart(cartData.cart);
      } else {
        throw new Error('Failed to fetch cart data');
      }
    } catch (error) {
      console.error('Error fetching cart:', error);
      setError('Failed to fetch cart data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }


  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className='flex justify-between mx-[400px]'>
        <div>
          <div className="mb-4">
            <label htmlFor="fullname" className="block text-gray-700">Imię i nazwisko</label>
            <input type="text" id="fullname" {...register('fullname')} className="form-input mt-1 block w-full border border-gray-300 rounded" />
            {errors.fullname && <p className="text-red-500">{errors.fullname.message}</p>}
          </div>
          <div className="mb-4">
            <label htmlFor="zip_code" className="block text-gray-700">Kod pocztowy</label>
            <input type="text" id="zip_code" {...register('zip_code')} className="form-input mt-1 block w-full border border-gray-300 rounded" />
            {errors.zip_code && <p className="text-red-500">{errors.zip_code.message}</p>}
          </div>
          <div className="mb-4">
            <label htmlFor="city" className="block text-gray-700">Miasto</label>
            <input type="text" id="city" {...register('city')} className="form-input mt-1 block w-full border border-gray-300 rounded" />
            {errors.city && <p className="text-red-500">{errors.city.message}</p>}
          </div>
          <div className="mb-4">
            <label htmlFor="street" className="block text-gray-700">Ulica</label>
            <input type="text" id="street" {...register('street')} className="form-input mt-1 block w-full border border-gray-300 rounded" />
            {errors.street && <p className="text-red-500">{errors.street.message}</p>}
          </div>
          <div className="mb-4">
            <label htmlFor="phone" className="block text-gray-700">Telefon</label>
            <input type="text" id="phone" {...register('phone')} className="form-input mt-1 block w-full border border-gray-300 rounded" />
            {errors.phone && <p className="text-red-500">{errors.phone.message}</p>}
          </div>
          <div className="mb-4">
            <label htmlFor="card_owner" className="block text-gray-700">Właściciel karty</label>
            <input type="text" id="card_owner" {...register('card_owner')} className="form-input mt-1 block w-full border border-gray-300 rounded" />
            {errors.card_owner && <p className="text-red-500">{errors.card_owner.message}</p>}
          </div>
          <div className="mb-4">
            <label htmlFor="card_number" className="block text-gray-700">Numer karty</label>
            <input type="text" id="card_number" {...register('card_number')} className="form-input mt-1 block w-full border border-gray-300 rounded" />
            {errors.card_number && <p className="text-red-500">{errors.card_number.message}</p>}
          </div>
          <div className="mb-4">
            <label htmlFor="card_expiration" className="block text-gray-700">Data ważności karty</label>
            <input type="text" id="card_expiration" {...register('card_expiration')} className="form-input mt-1 block w-full border border-gray-300 rounded" />
            {errors.card_expiration && <p className="text-red-500">{errors.card_expiration.message}</p>}
          </div>
          <div className="mb-4">
            <label htmlFor="card_cvc" className="block text-gray-700">CVC karty</label>
            <input type="text" id="card_cvc" {...register('card_cvc')} className="form-input mt-1 block w-full border border-gray-300 rounded" />
            {errors.card_cvc && <p className="text-red-500">{errors.card_cvc.message}</p>}
          </div>
            <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 focus:outline-none">Zapłać</button>
        </div>
        
        <div className="mt-8">
          <p className="text-lg font-semibold mb-4">Twoje zamówienie:</p>
          <ul>
            {cart.items.map((item: any) => (
              <li key={item.uuid} className="mb-2">
                <span className="font-semibold">{item.product.name}</span> - Quantity: {item.amount} - Price per unit: ${item.price_per_unit}
              </li>
            ))}
            <li className="font-semibold mt-2">Total Price: ${cart.total_price}</li>
          </ul>
        </div>
      </div>
    </form>
  );
};

export default CheckoutForm;
