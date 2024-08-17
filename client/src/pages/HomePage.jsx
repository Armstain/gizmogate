import { useState, useEffect } from "react";
import axios from "axios";
import CategoryFilter from "../components/CategoryFilter";
import Pagination from "../components/Pagination";

const HomePage = () => {
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filters, setFilters] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("date_added"); 

  const fetchProducts = async (filters = {}) => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/products`,
        {
          params: {
            ...filters,
            page: currentPage,
            limit: 8,
            search: searchTerm,
            sortBy: sortBy,
          },
        }
      );

      setFilteredProducts(response.data.products);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  useEffect(() => {
    fetchProducts(filters);
  }, [currentPage, filters, searchTerm, sortBy]);

  const handleFilterChange = (newFilters) => {
    setCurrentPage(1); 
    setFilters(newFilters); 
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); 
  };

  const handleSortChange = (e) => {
    setSortBy(e.target.value);
    setCurrentPage(1); 
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Product List</h1>
      <CategoryFilter onFilterChange={handleFilterChange} />
      <div className="my-4 flex flex-col md:flex-row items-center justify-center space-x-4 ">
        <input
          type="text"
          value={searchTerm}
          onChange={handleSearchChange}
          placeholder="Search for products..."
          className="border px-4 py-2 rounded"
        />
        <select
          value={sortBy}
          onChange={handleSortChange}
          className="border px-4 py-2 rounded"
        >
          <option value="date_added">Sort by Date Added (Newest First)</option>
          <option value="price_asc">Sort by Price (Low to High)</option>
          <option value="price_desc">Sort by Price (High to Low)</option>
        </select>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-8">
      {filteredProducts.map((product) => (
        <div key={product.id} className="bg-white rounded-lg shadow-md overflow-hidden transition-all duration-300 hover:shadow-xl hover:scale-105">
          <div className="relative">
            <img
              src={product.imageUrl}
              alt={product.name}
              className="w-full h-56 object-cover"
            />
            <span className="absolute top-2 right-2 bg-white text-sm font-semibold px-2 py-1 rounded-full">
              {product.category}
            </span>
          </div>
          <div className="p-4">
            <h2 className="text-xl font-bold mb-2 text-gray-800">{product.name}</h2>
            <p className="text-gray-600 text-sm mb-4 line-clamp-2">{product.description}</p>
            <div className="flex justify-between items-center mb-4">
              <span className="text-gray-700 font-semibold">{product.brand}</span>
              <span className="text-yellow-500 font-bold">
                {"★".repeat(product.rating)}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-2xl font-bold text-indigo-600">${product.price}</span>
              <span className="text-gray-500 text-xs">
                Added {new Date(product.dateAdded).toLocaleDateString()}
              </span>
            </div>
          </div>
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
