import "./index.css";
import { Link, useLocation, useNavigate } from "react-router";
import { useState, useContext, useEffect } from "react";
import Cookies from "js-cookie";
import CartContext from "../../context/CartContext";
import jwtDecode from "jwt-decode"; // npm install jwt-decode

export default function Navbar({ onSearch }) {
  const [searchInput, setSearchInput] = useState("");
  const [username, setUsername] = useState(null);

  const location = useLocation();
  const navigate = useNavigate();

  const { cartList, setUserId } = useContext(CartContext);

  useEffect(() => {
    const token = Cookies.get("jwt_token");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setUsername(decoded.sub); // ✅ only username
      } catch (err) {
        console.error("Invalid JWT:", err);
      }
    }
  }, []);

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchInput(value);

    if (location.pathname === "/products") {
      const event = new CustomEvent("shop-search", {
        detail: value.toLowerCase(),
      });
      window.dispatchEvent(event);
    }
  };

  const onClickLogout = () => {
    Cookies.remove("jwt_token");
    setUserId(null);
    navigate("/login", { replace: true });
  };

  return (
    <div className="navbar-container">
      <nav className="navbar">
        {location.pathname === "/products" && (
          <input
            type="search"
            placeholder="Search..."
            className="search-bar"
            value={searchInput}
            onChange={handleSearch}
          />
        )}

        <div className="logo">
          <Link to="/">
            <h1 className="logo-name">Zyra</h1>
          </Link>
        </div>

        <div className="right-bar">
            {/* ✅ Profile Hover Section (username only) */}
          {username && (
            <div className="profile relative group">
              <i className="fa-solid fa-user"></i>
              <div className="profile-dropdown absolute hidden group-hover:block bg-white p-3 ">
                <p><strong>{username}</strong></p>
              </div>
            </div>
          )}


          <div className="cart-icon">
            <Link to="/cart" className="relative">
              <i className="fa-solid fa-cart-shopping"></i>
              {cartList.length > 0 && (
                <span className="cart-badge">{cartList.length}</span>
              )}
            </Link>
          </div>



          <div className="login">
            <button
              type="button"
              className="login-out"
              onClick={onClickLogout}
            >
              Logout
            </button>
          </div>
        </div>
      </nav>

      <div className="navbar-bottom">
        <div className="navbar-links">
          <Link className="nav-link" to="/">
            Home
          </Link>
          <Link className="nav-link" to="/products">
            Products
          </Link>
        </div>
      </div>
    </div>
  );
}
