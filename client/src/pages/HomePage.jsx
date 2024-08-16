// src/components/HomePage.jsx
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useSearchParams } from 'react-router-dom';

const HomePage = () => {
  const [products, setProducts] = useState([]);
  const [totalProducts, setTotalProducts] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchParams, setSearchParams] = useSearchParams();
  
  const [brand, setBrand] = useState('');
  const [category, setCategory] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');

  const page = parseInt(searchParams.get('page') || '1', 10);
  const limit = 10;

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/products`, {
          params: {
            limit,
            offset: (page - 1) * limit,
            brand: brand || undefined,
            category: category || undefined,
            minPrice: minPrice || undefined,
            maxPrice: maxPrice || undefined,
          },
        });
        setProducts(response.data.products);
        setTotalProducts(response.data.totalProducts);
      } catch (err) {
        setError('Failed to fetch products');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [page, brand, category, minPrice, maxPrice]);

  const handlePageChange = (newPage) => {
    setSearchParams({ page: newPage });
  };

  const handleFilterChange = () => {
    setSearchParams({ page: 1 }); // Reset to first page when filters change
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  const totalPages = Math.ceil(totalProducts / limit);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Product List</h1>
      
      <div className="mb-4">
        <h2 className="text-xl font-semibold mb-2">Filters</h2>
        
        <div className="mb-2">
          <label className="mr-2">Brand:</label>
          <input
            type="text"
            value={brand}
            onChange={(e) => setBrand(e.target.value)}
            className="border p-1 rounded"
          />
        </div>
        
        <div className="mb-2">
          <label className="mr-2">Category:</label>
          <input
            type="text"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="border p-1 rounded"
          />
        </div>

        <div className="mb-2">
          <label className="mr-2">Min Price:</label>
          <input
            type="number"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
            className="border p-1 rounded"
          />
        </div>

        <div className="mb-2">
          <label className="mr-2">Max Price:</label>
          <input
            type="number"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            className="border p-1 rounded"
          />
        </div>

        <button
          onClick={handleFilterChange}
          className="btn btn-primary"
        >
          Apply Filters
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {products.map((product) => (
          <div key={product.id} className="border rounded-lg p-4 shadow-md">
            <img
              src={product.imageUrl}
              alt={product.name}
              className="w-full h-48 object-cover mb-2"
            />
            <h2 className="text-lg font-semibold mb-1">{product.name}</h2>
            <p className="text-gray-700 mb-2">${product.price}</p>
          </div>
        ))}
      </div>

      <div className="flex justify-center mt-4">
        <button
          onClick={() => handlePageChange(page - 1)}
          disabled={page <= 1}
          className="btn btn-primary mr-2"
        >
          Previous
        </button>
        <span className="btn btn-disabled">{page}</span>
        <button
          onClick={() => handlePageChange(page + 1)}
          disabled={page >= totalPages}
          className="btn btn-primary ml-2"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default HomePage;
