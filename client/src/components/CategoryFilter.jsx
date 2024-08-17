import  { useEffect, useState } from 'react';
import axios from 'axios';

const CategoryFilter = ({ onFilterChange }) => {
  const [products, setProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedBrand, setSelectedBrand] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/products`, {
          params: {
            category: selectedCategory,
            brand: selectedBrand,
            minPrice,
            maxPrice,
          },
        });
        const fetchedProducts = response.data.products;
        setProducts(fetchedProducts);

        const uniqueCategories = [...new Set(fetchedProducts.map(product => product.category))];
        const uniqueBrands = [...new Set(fetchedProducts.map(product => product.brand))];

        setCategories(uniqueCategories);
        setBrands(uniqueBrands);

      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    fetchProducts();
  }, [selectedCategory, selectedBrand, minPrice, maxPrice]);

  const handleFilterChange = () => {
    onFilterChange({
      category: selectedCategory,
      brand: selectedBrand,
      minPrice,
      maxPrice,
    });
  };

  useEffect(() => {
    handleFilterChange();
  }, [selectedCategory, selectedBrand, minPrice, maxPrice]);

  return (
    <div className="bg-gray-100 p-4 rounded-lg shadow-md">
  <h2 className="text-xl font-semibold mb-4">Filter Products</h2>

  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
    {/* Category Filter */}
    <div className="flex flex-col">
      <label className="font-medium mb-2">Category:</label>
      <select
        value={selectedCategory}
        onChange={(e) => setSelectedCategory(e.target.value)}
        className="p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <option value="">All Categories</option>
        {categories.map((category) => (
          <option key={category} value={category}>
            {category}
          </option>
        ))}
      </select>
    </div>

    {/* Brand Filter */}
    <div className="flex flex-col">
      <label className="font-medium mb-2">Brand:</label>
      <select
        value={selectedBrand}
        onChange={(e) => setSelectedBrand(e.target.value)}
        className="p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <option value="">All Brands</option>
        {brands.map((brand) => (
          <option key={brand} value={brand}>
            {brand}
          </option>
        ))}
      </select>
    </div>

    {/* Min Price Filter */}
 
 <div className="flex flex-col">
      <label className="font-medium mb-2">Min Price:</label>
      <input
        type="number"
        value={minPrice}
        onChange={(e) => setMinPrice(e.target.value)}
        className="p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        placeholder="0"
      />
    </div>

    {/* Max Price Filter */}
    <div className="flex flex-col">
      <label className="font-medium mb-2">Max Price:</label>
      <input
        type="number"
        value={maxPrice}
        onChange={(e) => setMaxPrice(e.target.value)}
        className="p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        placeholder="0"
      />
    </div>
 </div>
  </div>


  );
};

export default CategoryFilter;
