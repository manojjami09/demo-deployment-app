import { BsPlusSquare, BsDashSquare } from "react-icons/bs";
import { AiFillCloseCircle } from "react-icons/ai";
import { useContext } from "react";
import CartContext from "../../context/CartContext";
import "./index.css";

const CartItem = ({ cartItemDetails }) => {
  if (!cartItemDetails) return null;

  const { id, product, newArrival, quantity = 0 } = cartItemDetails;

  // ✅ pick whichever exists
  const item = product || newArrival;
  if (!item) return null;

  const { name = "Item", price = 0, image = "" } = item;

  const { deleteCartItem, updateQuantity } = useContext(CartContext);

  const handleDecrease = () => {
    if (quantity > 1) updateQuantity(id, quantity - 1);
    else deleteCartItem(id);
  };

  const handleIncrease = () => updateQuantity(id, quantity + 1);

  return (
    <li className="cart-item">
      <img className="cart-product-image" src={image} alt={name} />
      <div className="cart-item-details-container">
        <div className="cart-product-title-brand-container">
          <p className="cart-product-title">{name}</p>
        </div>

        <div className="cart-quantity-container">
          <button
            type="button"
            className="quantity-controller-button"
            onClick={handleDecrease}
          >
            <BsDashSquare color="#52606D" size={12} />
          </button>
          <p className="cart-quantity">{quantity}</p>
          <button
            type="button"
            className="quantity-controller-button"
            onClick={handleIncrease}
          >
            <BsPlusSquare color="#52606D" size={12} />
          </button>
        </div>

        <div className="total-price-delete-container">
          <p className="cart-total-price">₹ {price * quantity}/-</p>
          <button
            className="remove-button"
            type="button"
            onClick={() => deleteCartItem(id)}
          >
            Remove
          </button>
        </div>
      </div>

      <button
        className="delete-button"
        type="button"
        onClick={() => deleteCartItem(id)}
      >
        <AiFillCloseCircle color="#616E7C" size={20} />
      </button>
    </li>
  );
};

export default CartItem;
