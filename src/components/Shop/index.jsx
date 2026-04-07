import React, { useEffect, useState } from 'react';
import ProductCard from '../../components/ProductCard';
import './index.css';
import Navbar from '../../components/Navbar';
import ProductsHeader from '../../components/ProductsHeader';
import axios from "axios";
import Cookies from "js-cookie";
import jwtDecode from "jwt-decode"; // ✅ to decode userId from token
const API = import.meta.env.VITE_API_URL;

const sortbyOptions = [
  { optionId: 'PRICE_HIGH', displayText: 'Price (High-Low)' },
  { optionId: 'PRICE_LOW', displayText: 'Price (Low-High)' },
];

export default function Shop() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [priceRange, setPriceRange] = useState({ min: 0, max: Infinity });
  const [activeOptionId, setActiveOptionId] = useState(sortbyOptions[0].optionId);

  // ✅ Get userId from token
  const getUserIdFromToken = () => {
    try {
      const token = Cookies.get("jwt_token");
      if (!token) return null;
      const decoded = jwtDecode(token);
      return decoded.userId; // ⚠️ make sure backend puts "userId" in JWT claims
    } catch (error) {
      console.error("Error decoding token:", error);
      return null;
    }
  };

  // ✅ Fetch products with JWT token
  const fetchProducts = async () => {
    try {
      const token = Cookies.get("jwt_token");
      const response = await axios.get(`${API}/api/products`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setProducts(response.data);
      setFilteredProducts(response.data);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  // ✅ Add to cart
  const addToCart = async (productId) => {
    try {
      const token = Cookies.get("jwt_token");
      const userId = getUserIdFromToken();
      if (!userId) {
        alert("User not logged in");
        return;
      }

      const response = await axios.post(
        `http://localhost:8080/api/cart/${userId}/add`,
        null,
        {
          params: { productId, quantity: 1 }, // send product + qty
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      console.log("Added to cart:", response.data);
      alert("Item added to cart!");
    } catch (error) {
      console.error("Error adding to cart:", error);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // ✅ Search filter
  useEffect(() => {
    const handleSearch = (e) => {
      const searchTerm = e.detail.toLowerCase();
      const matched = products.filter((product) =>
        product.name.toLowerCase().includes(searchTerm)
      );
      setFilteredProducts(matched);
    };

    window.addEventListener('shop-search', handleSearch);
    return () => window.removeEventListener('shop-search', handleSearch);
  }, [products]);

  // ✅ Sort filter
  useEffect(() => {
    let sortedProducts = [...filteredProducts];
    if (activeOptionId === 'PRICE_HIGH') {
      sortedProducts.sort((a, b) => b.price - a.price);
    } else if (activeOptionId === 'PRICE_LOW') {
      sortedProducts.sort((a, b) => a.price - b.price);
    }
    setFilteredProducts(sortedProducts);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeOptionId]);

  // ✅ Price filter
  useEffect(() => {
    let filtered = products.filter(
      (product) => product.price >= priceRange.min && product.price <= priceRange.max
    );

    if (activeOptionId === 'PRICE_HIGH') {
      filtered.sort((a, b) => b.price - a.price);
    } else if (activeOptionId === 'PRICE_LOW') {
      filtered.sort((a, b) => a.price - b.price);
    }

    setFilteredProducts(filtered);
  }, [products, priceRange, activeOptionId]);

  const updateActiveOptionId = (id) => setActiveOptionId(id);

  return (
    <>
      <Navbar />
      <div className="shop-container">
        <div className="filter-bar">
          <h3>Filters</h3>
          <div className="filters">
            <div>
              <label className="range">Price Range:</label>
              <select onChange={(e) => {
                const value = e.target.value;
                switch (value) {
                  case '0-1000': setPriceRange({ min: 0, max: 1000 }); break;
                  case '1000-3000': setPriceRange({ min: 1000, max: 3000 }); break;
                  case '3000-5000': setPriceRange({ min: 3000, max: 5000 }); break;
                  case '5000+': setPriceRange({ min: 5000, max: Infinity }); break;
                  default: setPriceRange({ min: 0, max: Infinity });
                }
              }}>
                <option value="">All</option>
                <option value="0-1000">₹0 - ₹1000</option>
                <option value="1000-3000">₹1000 - ₹3000</option>
                <option value="3000-5000">₹3000 - ₹5000</option>
                <option value="5000+">₹5000+</option>
              </select>
            </div>
          </div>
        </div>

        <div className="all-products">
          <ProductsHeader
            sortbyOptions={sortbyOptions}
            activeOptionId={activeOptionId}
            updateActiveOptionId={updateActiveOptionId}
          />
          <div className="products-bar">
            {filteredProducts.map((product) => (
              <ProductCard
                product={product}
                key={product.id}
                type="products"
                onAddToCart={() => addToCart(product.id)} // ✅ Pass handler
              />
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
