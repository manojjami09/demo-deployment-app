import React, { useContext, useEffect, useState } from "react";
import Navbar from "../Navbar";
import CartListView from "../CartListView";
import EmptyCartView from "../EmptyCartView";
import CartContext from "../../context/CartContext";
import axios from "axios";
import Cookies from "js-cookie";
import "./index.css";

const Cart = () => {
  const { cartList, setCartList, userId, deleteCartItem, clearCart } =
    useContext(CartContext);

  const [loading, setLoading] = useState(true);
  const [orderPlaced, setOrderPlaced] = useState(false);

  useEffect(() => {
    if (!userId) return;
    const token = Cookies.get("jwt_token");
    if (!token) return;

    setLoading(true);
    axios
      .get(`${import.meta.env.VITE_API_URL}/api/cart/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      })
      .then((res) => setCartList(res.data.items || []))
      .catch((err) => console.error("Error fetching cart:", err))
      .finally(() => setLoading(false));
  }, [userId, setCartList]);

  if (loading) return <div className="cart-loading">Loading...</div>;

  // ✅ Show Order Success UI first
  if (orderPlaced) {
    return (
      <>
        <Navbar />
        <div className="success-container">
          <div className="checkmark-circle">✓</div>
          <h1 className="order-message">Order Placed Successfully!</h1>
          <p className="thank-you-msg">Thank you for shopping with us.</p>
          <button
            className="shop-btn"
            onClick={() => setOrderPlaced(false)}
          >
            Continue Shopping
          </button>
        </div>
      </>
    );
  }

  // ✅ Empty cart fallback
  const showEmptyView = cartList.length === 0;

  return (
    <>
      <Navbar />
      <div className="cart-container">
        {showEmptyView ? (
          <EmptyCartView />
        ) : (
          <div className="cart-content-container">
            <h1 className="cart-heading">My Cart</h1>
            <CartListView
              cartItems={cartList}
              onDeleteItem={deleteCartItem}
              onClearCart={clearCart}
              onOrderPlaced={() => {
                setOrderPlaced(true);
                clearCart();
                // auto-hide after 5 sec
                setTimeout(() => setOrderPlaced(false), 5000);
              }}
            />
          </div>
        )}
      </div>
    </>
  );
};

export default Cart;
