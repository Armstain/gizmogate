import { useState, useEffect } from 'react';
import axios from 'axios';
import CategoryFilter from '../components/CategoryFilter';
import Pagination from '../components/Pagination';

const HomePage = () => {
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filters, setFilters] = useState({});
  const [searchTerm, setSearchTerm] = useState('');

  const fetchProducts = async (filters = {}) => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/products`, {
        params: {
          ...filters,
          page: currentPage,
          limit: 10,
          search: searchTerm,
        },
      });

      setFilteredProducts(response.data.products);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  useEffect(() => {
    fetchProducts(filters);
  }, [currentPage, filters, searchTerm]);

  const handleFilterChange = (newFilters) => {
    setCurrentPage(1); // Reset to first page when filters change
    setFilters(newFilters); // Update filters
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // Reset to first page when search term changes
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Product List</h1>
      <CategoryFilter onFilterChange={handleFilterChange} />
      <div className="mb-4">
        <input
          type="text"
          value={searchTerm}
          onChange={handleSearchChange}
          placeholder="Search for products..."
          className="border px-4 py-2 rounded"
        />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-4">
        {filteredProducts.map((product) => (
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
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
    </div>
  );
};

export default HomePage;
