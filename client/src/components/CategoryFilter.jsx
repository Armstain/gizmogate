import React, { useEffect, useState } from 'react';
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
        const response = await axios.get('http://localhost:8000/products', {
          params: {
            category: selectedCategory,
            brand: selectedBrand,
            minPrice,
            maxPrice,
          },
        });
        const fetchedProducts = response.data.products;
        setProducts(fetchedProducts);

        // Extract unique categories and brands from the fetched products
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
    <div className="filter-container">
      <div className="filter">
        <label>Category:</label>
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
        >
          <option value="">All Categories</option>
          {categories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
      </div>

      <div className="filter">
        <label>Brand:</label>
        <select
          value={selectedBrand}
          onChange={(e) => setSelectedBrand(e.target.value)}
        >
          <option value="">All Brands</option>
          {brands.map((brand) => (
            <option key={brand} value={brand}>
              {brand}
            </option>
          ))}
        </select>
      </div>

      <div className="filter">
        <label>Min Price:</label>
        <input
          type="number"
          value={minPrice}
          onChange={(e) => setMinPrice(e.target.value)}
        />
      </div>

      <div className="filter">
        <label>Max Price:</label>
        <input
          type="number"
          value={maxPrice}
          onChange={(e) => setMaxPrice(e.target.value)}
        />
      </div>
    </div>
  );
};

export default CategoryFilter;
