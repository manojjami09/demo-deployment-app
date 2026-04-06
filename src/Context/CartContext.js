import React from "react";

const CartContext = React.createContext({
  cartList: [],
  setCartList: () => {},
  addCartItem: () => {},
  deleteCartItem: () => {},
  updateQuantity: () => {},
  clearCart: () => {},
  userId: null,
  setUserId: () => {},
  user: null,      // 👈 add user
  setUser: () => {} // 👈 add setter
});

export default CartContext;
