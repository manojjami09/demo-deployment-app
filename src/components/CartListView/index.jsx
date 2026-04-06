import CartItem from "../CartItem";
import "./index.css";

const CartListView = ({ cartItems = [], onDeleteItem, onClearCart, onOrderPlaced }) => {
  const safeCartItems = Array.isArray(cartItems) ? cartItems : [];

  const getCartTotal = () =>
    safeCartItems.reduce((acc, item) => {
      if (!item) return acc;

      const price = item.product?.price ?? item.newArrival?.price ?? 0;
      const quantity = item.quantity ?? 0;

      return acc + price * quantity;
    }, 0);

  return (
    <div className="cart-list-view-container">
      <div>
        <ul className="cart-list">
          {safeCartItems.map((eachCartItem) => {
            if (!eachCartItem || (!eachCartItem.product && !eachCartItem.newArrival))
              return null;

            return (
              <CartItem
                key={eachCartItem.id}
                cartItemDetails={eachCartItem}
                onDeleteItem={onDeleteItem}
              />
            );
          })}
        </ul>
      </div>

      <div className="cart-total-container">
        <h3>Total: ₹{getCartTotal()}</h3>
        <button className="checkout-btn" onClick={onOrderPlaced}>
          Buy Now
        </button>
      </div>
    </div>
  );
};

export default CartListView;
