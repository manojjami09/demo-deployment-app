import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router";
import axios from "axios";
import Cookies from "js-cookie";
import jwtDecode from "jwt-decode";

import Home from "./components/Home";
import Shop from "./components/Shop";
import ProductItem from "./components/ProductItem";
import NewArrivalItem from "./components/NewArrivalItem";
import LoginForm from "./components/LoginForm";
import SignupForm from "./components/SignupForm";
import Cart from "./components/Cart";
import ProtectedRoute from "./components/ProtectedRoute";
import CartContext from "./context/CartContext";

export default function App() {
  const [cartList, setCartList] = useState([]);
  const [userId, setUserId] = useState(null);
  // Axios instance
  const api = axios.create({
    baseURL: `${import.meta.env.VITE_API_URL}/api/cart`,
    withCredentials: true,
  });

  api.interceptors.request.use((config) => {
    const token = Cookies.get("jwt_token");
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  });

  // Decode JWT on mount
  useEffect(() => {
      const token = Cookies.get("jwt_token");
      if (!token) return;

      try {
        const decoded = jwtDecode(token);

        // 👇 assuming your JWT payload looks like:
        // { userId: 1, username: "Manoj", email: "manoj@gmail.com", ... }
        if (decoded.userId) {
          setUserId(decoded.userId);
        }
      } catch (err) {
        console.error("Invalid JWT token:", err);
      }
    }, []);
//add cart item
const addCartItem = async ({ productId = null, newArrivalId = null, quantity = 1 }) => {
  if (!userId) {
    alert("Please login first!");
    return;
  }

  try {
    const res = await api.post(`/${userId}/add`, null, {
      params: { productId, newArrivalId, quantity },
    });

    setCartList(res.data.items || []); // update context immediately
    return res.data; // optionally return the updated cart
  } catch (err) {
    console.error("Error adding item to cart:", err);
    alert("Failed to add item to cart. Please try again.");
  }
};

  // Clear cart when userId changes
  useEffect(() => {
    setCartList([]); // remove previous user's cart immediately
  }, [userId]);


  // Delete item from cart
  const deleteCartItem = async (productId) => {
    if (!userId) return;

    try {
      await api.delete(`/${userId}/remove/${productId}`);
      const res = await api.get(`/${userId}`);
      setCartList(res.data.items || []);
    } catch (err) {
      console.error("Error deleting item:", err);
    }
  };

  // Clear cart
  const clearCart = () => {
    if (!userId) return;

    api.delete(`/${userId}/clear`)
      .then(() => setCartList([]))
      .catch(err => console.error("Error clearing cart:", err));
  };

  //update cart
  const updateQuantity = (cartItemId, newQuantity) => {
    if (!userId) return;

    api.put(`/${userId}/update/${cartItemId}?quantity=${newQuantity}`)
      .then((res) => setCartList(res.data.items || [])) // ✅ update state
      .catch((err) => console.error("Error updating quantity:", err));
  };

  return (
    <CartContext.Provider value={{ cartList, setCartList, addCartItem, deleteCartItem, clearCart, userId, setUserId , updateQuantity}}>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginForm />} />
          <Route path="/signup" element={<SignupForm />} />

          <Route
            path="/cart"
            element={
              <ProtectedRoute>
                <Cart />
              </ProtectedRoute>
            }
          />
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            }
          />
          <Route
            path="/products"
            element={
              <ProtectedRoute>
                <Shop />
              </ProtectedRoute>
            }
          />
          <Route
            path="/products/:id"
            element={
              <ProtectedRoute>
                <ProductItem />
              </ProtectedRoute>
            }
          />
          <Route
            path="/newArrivals/:id"
            element={
              <ProtectedRoute>
                <NewArrivalItem />
              </ProtectedRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </CartContext.Provider>
  );
}
