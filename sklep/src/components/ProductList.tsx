import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import socket from "../websocketConfig";

interface Product {
  uuid: string;
  name: string;
  price: number;
  main_image: {
    url: string;
  };
  product_group_uuid: string;
  product_group_name: string;
  created_at: string; 
}

interface ProductGroup {
  uuid: string;
  name: string;
} 

const ProductList: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [searchText, setSearchText] = useState<string>('');
  const [selectedGroup, setSelectedGroup] = useState<string>('');
  const [productGroups, setProductGroups] = useState<ProductGroup[]>([]);
  const [sortBy, setSortBy] = useState<string>('created_at'); 

  const token: string = 'Bearer twój token autoryzacyjny'; // Token autoryzacyjny

  useEffect(() => {
    const handleProductUpdate = (updatedItem: any) => {
      setProducts(prevProducts =>
        prevProducts.map(product =>
          product.uuid === updatedItem.uuid ? updatedItem : product
        )
      );
    };

    socket.on("product.updated", handleProductUpdate);

    return () => {
      socket.off("product.updated", handleProductUpdate);
    };
  }, []);

  useEffect(() => {
    fetch('http://188.137.111.131:8083/api/products', {
      headers: {
        Authorization: token
      }
    })
      .then(response => response.json())
      .then((data: { products: Product[] }) => {
        if (Array.isArray(data.products)) {
          setProducts(data.products);
          setFilteredProducts(data.products);
          const uniqueGroups = Array.from(new Set(data.products.map(product => product.product_group_uuid)));
          const uniqueProductGroups: ProductGroup[] = uniqueGroups.map(groupUuid => {
            return {
              uuid: groupUuid,
              name: data.products.find(product => product.product_group_uuid === groupUuid)?.product_group_name || ''
            };
          });
          setProductGroups(uniqueProductGroups);
        }
      })
      .catch(error => {
        console.error('Error fetching products:', error);
      });
  }, [token]);


  const handleFilter = () => {
    let filtered = products.filter(product => {
      const nameMatch: boolean = product.name.toLowerCase().includes(searchText.toLowerCase());
      const groupMatch: boolean = selectedGroup ? product.product_group_uuid === selectedGroup : true;
      return nameMatch && groupMatch;
    });


    switch (sortBy) {
      case 'created_at':
        filtered.sort((a, b) => (new Date(a.created_at) > new Date(b.created_at) ? 1 : -1));
        break;
      case 'price':
        filtered.sort((a, b) => (a.price - b.price));
        break;
      default:
        break;
    }

    setFilteredProducts(filtered);
  };

  return (
    <div className="container mx-auto px-4">
      <h1 className="text-center font-semibold text-4xl mb-11">Lista produktów</h1>
      <div className="flex items-center justify-center mb-4">
        <input 
          type="text" 
          placeholder="Wyszukaj..."
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          className="border border-gray-300 mx-2 px-3 py-2 rounded focus:outline-none"
        />
        <select 
          value={selectedGroup}
          onChange={(e) => setSelectedGroup(e.target.value)}
          className="border border-gray-300 rounded px-3 py-2 focus:outline-none"
        >
          <option value="">Wszystkie</option>
          {productGroups.map(group => (
            <option key={group.uuid} value={group.uuid}>{group.uuid === '9bf9ec15-77b1-4e5d-b13d-3cf86b35c7e0' ? 'Telefony' : 'Telewizory'}</option>
          ))}
        </select>
        <select 
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="border border-gray-300 ml-2 px-3 py-2 rounded focus:outline-none"
        >
          <option value="created_at">Date Added</option>
          <option value="price">Price</option>
        </select>
        <button onClick={handleFilter} className="ml-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none transition duration-300">Filter</button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {filteredProducts.map((product) => (
          <div key={product.uuid} className="bg-white shadow-lg p-4 rounded-lg transition duration-300 transform hover:scale-105">
            <img src={product.main_image.url} className="w-full mb-2 rounded-lg" alt={product.name} />
            <h3 className="text-lg font-semibold mb-1">{product.name}</h3>
            <p className="text-gray-700">${product.price.toFixed(2)}</p>
            <Link to={`${product.product_group_uuid}/product/${product.uuid}`}>
              <button className="bg-blue-500 text-white px-4 py-2 mt-2 rounded hover:bg-blue-600 focus:outline-none transition duration-300">Szczegóły</button>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductList;
