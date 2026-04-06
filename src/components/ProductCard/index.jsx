import './index.css';
import { Link } from 'react-router';
function ProductCard({ product, type }) {
  return (
    <Link to={`/${type}/${product.id}`}>
      <div className="card-container">
        <div className="card">
          <img src={product.image} alt="img" />
          <p className="Name">{product.name}</p>
          <p className="Price">₹{product.price}</p>
        </div>
      </div>
    </Link>
  );
}

export default ProductCard;