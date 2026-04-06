import { useState } from "react";
import { useNavigate, Navigate, Link } from "react-router";
import Cookies from "js-cookie";
import axios from "axios";
import jwtDecode from "jwt-decode";
import { useContext } from "react";
import CartContext from "../../context/CartContext";
import "./index.css";

const LoginForm = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const navigate = useNavigate();
  const { setUserId } = useContext(CartContext);

  const submitForm = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/login`, { username, password });
      const token = response.data.token;
      Cookies.set("jwt_token", token, { expires: 7 });

      // ✅ Decode token and update userId immediately
      const decoded = jwtDecode(token);
      if (decoded.userId) setUserId(decoded.userId);

      navigate("/", { replace: true });
    } catch (error) {
      console.error(error);
      setErrorMsg("Invalid credentials");
    }
  };

  if (Cookies.get("jwt_token")) return <Navigate to="/" />;

  return (
    <div className="login-page">
      <form className="login-card" onSubmit={submitForm}>
        <h1 className="brand-name">Zyra</h1>
        <h2 className="login-heading">Login to Your Account</h2>

        <label htmlFor="username">Username</label>
        <input
          type="text"
          id="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Enter username"
        />

        <label htmlFor="password">Password</label>
        <input
          type="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter password"
        />

        {errorMsg && <p className="error">{errorMsg}</p>}

        <button type="submit">Login</button>

        <p className="signup-option">
          Don’t have an account? <Link to="/signup">Sign up</Link>
        </p>
      </form>
    </div>
  );
};

export default LoginForm;
