import {Link} from 'react-router'
import './index.css'

const EmptyCartView = () => (
  <div className="cart-empty-view-container">
    <img
      src="https://res.cloudinary.com/dobgclr9v/image/upload/v1750095923/minimalist-shopping-cart-icon-white-background-cart-designed-black-outline-light-beige-fill-featuring-two-378077529_lyhwo6.webp"
      className="cart-empty-image"
      alt="cart empty"
    />
    <h1 className="cart-empty-heading">Your Cart Is Empty</h1>

    <Link to="/products">
      <button type="button" className="shop-now-btn">
        Shop Now
      </button>
    </Link>
  </div>
)

export default EmptyCartView
