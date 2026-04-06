// src/pages/NewArrivalItem/index.jsx
import { useState, useEffect, useContext } from "react";
import { useParams } from "react-router";
import Navbar from "../../components/Navbar";
import { BsPlusSquare, BsDashSquare } from "react-icons/bs";
import Cookies from "js-cookie";
import axios from "axios";
import "./index.css";
import jwtDecode from "jwt-decode";
import CartContext from "../../context/CartContext"; // ✅ import context
const API = import.meta.env.VITE_API_URL;

const NewArrivalItem = () => {
  const [newArrival, setNewArrival] = useState(null);
  const { id } = useParams();
  const [quantity, setQuantity] = useState(1);
  const [isAdded, setIsAdded] = useState(false);

  // ✅ use CartContext
  const { setCartList } = useContext(CartContext);

  // ✅ Add to Cart for New Arrival
  // ✅ Add to Cart for New Arrival
  const onClickAddToCart = async () => {
    try {
      const token = Cookies.get("jwt_token");
      if (!token) {
        alert("Please login first!");
        return;
      }

      const decoded = jwtDecode(token);
      const userId = decoded.userId;

      // ✅ use correct backend endpoint: /add
      const response = await axios.post(
        `${API}/api/cart/${userId}/add`,
        null,
        {
          params: {
            newArrivalId: newArrival.id, // ✅ matches your backend @RequestParam
            quantity,
          },
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("Cart updated:", response.data);

      // ✅ Immediately update cartList in context
      setCartList(response.data.items || []);

      setIsAdded(true);
    } catch (error) {
      console.error("Error adding new arrival to cart:", error);
      alert("Failed to add item. Please try again.");
    }
  };


  // ✅ Fetch new arrival details
  useEffect(() => {
    const fetchNewArrival = async () => {
      try {
        const token = Cookies.get("jwt_token");

        const response = await fetch(
          `${API}/api/newArrivals/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) throw new Error("Failed to fetch new arrival");
        const data = await response.json();
        setNewArrival(data);
      } catch (error) {
        console.error("Error fetching new arrival:", error);
      }
    };

    fetchNewArrival();
  }, [id]);

  if (!newArrival) {
    return (
      <div className="loading-container">
        <p>Loading new arrival...</p>
      </div>
    );
  }

  const onDecrementQuantity = () => {
    setQuantity((prev) => (prev > 1 ? prev - 1 : prev));
  };

  const onIncrementQuantity = () => {
    setQuantity((prev) => prev + 1);
  };

  const { name, price, image } = newArrival;

  return (
    <>
      <Navbar />
      <div className="product-item-container">
        <div className="product-item">
          <img src={image} alt={name} className="product-image" />
          <div className="product-details">
            <h2 className="product-name">{name}</h2>
            <p className="price-tag">₹ {price}</p>
            <p className="product-tax">Inclusive of all taxes</p>

            <div className="quantity-container">
              <button
                type="button"
                className="quantity-controller-button"
                onClick={onDecrementQuantity}
              >
                <BsDashSquare className="quantity-controller-icon" />
              </button>
              <p className="quantity">{quantity}</p>
              <button
                type="button"
                className="quantity-controller-button"
                onClick={onIncrementQuantity}
              >
                <BsPlusSquare className="quantity-controller-icon" />
              </button>
            </div>

            <hr />
            <p className="product-offer">
              Special New Arrival Discount 🎉 <br />
              Limited stock – grab yours now!
            </p>
            <hr />
            <p className="product-stock">In stock - ready to ship</p>
            <button className="add-to-cart-btn" onClick={onClickAddToCart}>
              {isAdded ? "Added to Cart" : "Add to Cart"}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default NewArrivalItem;
