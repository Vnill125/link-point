import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';

interface Product {
  uuid: string;
  name: string;
  price: number;
  images: { url: string }[];
}

const ProductPage: React.FC = () => {
  const { productId } = useParams<{ productId: string }>();
  const { productGroup } = useParams<{ productGroup: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isInCart, setIsInCart] = useState<boolean>(false);

  useEffect(() => {
    const token: string = 'Bearer twój token autoryzacyjny'; // Token autoryzacyjny

    fetch(`http://188.137.111.131:8083/api/product-groups/${productGroup}/products/${productId}`, {
      headers: {
        Authorization: token
      }
    })
      .then(response => response.json())
      .then((data: { product: Product }) => {
        setProduct(data.product);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching product details:', error);
        setLoading(false);
      });
  }, [productId, productGroup]);

  useEffect(() => {
    const checkIfInCart = async () => {
      try {
        const token: string = 'Bearer twój token autoryzacyjny'; // Token autoryzacyjny
        const response = await fetch('http://188.137.111.131:8083/api/carts', {
          headers: {
            Authorization: token
          }
        });
        const cartData = await response.json();
        const items = cartData.cart.items;
        const isInCart = items.some((item: any) => item.product_uuid === productId);
        setIsInCart(isInCart);
      } catch (error) {
        console.error('Error checking if product is in cart:', error);
      }
    };

    checkIfInCart();
  }, [productId]);

  const addToCart = async () => {
    if (!product) {
      return; 
    }

    if (isInCart) {
      alert('Product is already in the cart!');
      return;
    }

    const token: string = 'Bearer twój token autoryzacyjny'; // Token autoryzacyjny
    const payload = {
      items: [
        {
          product_uuid: productId,
          amount: 1
        }
      ]
    };

    try {
      const response = await fetch('http://188.137.111.131:8083/api/carts', {
        method: 'POST',
        headers: {
          'Authorization': token,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });
      
      if (response.ok) {
        alert('Product added to cart successfully!');
      } else {
        alert('Failed to add product to cart.');
      }
    } catch (error) {
      console.error('Error adding product to cart:', error);
    }
  };

  if (loading) {
    return <div className="container mx-auto">Loading...</div>;
  }

  return (
    <div className="container mx-auto px-6 ">
      <Link to='/' className="text-blue-500"><p>Wróć</p></Link>
      <h2 className="text-3xl font-semibold text-gray-800 mb-4">Szczegóły produktu:</h2>
      {product && (
        <div className="flex flex-col items-center">
            <p className="font-semibold text-xl text-gray-800 mb-10">{product.name}</p>
            <img src={product.images[0].url} width={500} className="mb-4 rounded-lg shadow-2xl hover:scale-105 transition duration-300" alt="" />
          <p className="text-lg font-semibold text-gray-800 mt-5">${product.price}</p>
          <button onClick={addToCart} className="mt-4 px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none">Dodaj do koszyka</button>
        </div>
      )}
    </div>
  );
};

export default ProductPage;
