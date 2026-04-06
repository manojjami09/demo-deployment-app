import ProductCard from '../../components/ProductCard';
import { useState, useEffect } from 'react';
import './index.css';
import Navbar from '../../components/Navbar';
import axios from "axios";
import Cookies from "js-cookie";

export default function Home() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        // Get token from cookies (or localStorage if you stored it there)
        const token = Cookies.get("jwt_token");
        // or Cookies.get("jwt_token") if you used cookies
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/newArrivals`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setProducts(response.data);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, []);

  const showProducts = () => {
    window.location.href = '/products'; // Redirect to the products page
  }

  return (
    <>
      <Navbar />
      <section>
        {/* Carousel Section */}
        <div className='carousel-container'>
          <div id="carouselExampleSlidesOnly" className="carousel slide caro" data-bs-ride="carousel">
            <div className="carousel-inner">
              <div className="carousel-item active">
                <img src="https://res.cloudinary.com/dobgclr9v/image/upload/v1747204495/84770f_e069f1bf22464052b666a284d3f458fb_mv2_fj0dhs.avif" className="d-block w-100" alt="..." />
              </div>
              <div className="carousel-item">
                <img src="https://res.cloudinary.com/dobgclr9v/image/upload/v1747204495/84770f_bb57e5518bbd43e8870325b93c908cee_mv2_y0srim.avif" className="d-block w-100" alt="..." />
              </div>
              <div className="carousel-item">
                <img src="https://res.cloudinary.com/dobgclr9v/image/upload/v1747204495/84770f_ca183cbde2e54902bb15671ac5b117dd_mv2_ehnsb1.avif" className="d-block w-100" alt="..." />
              </div>
            </div>
          </div>
          <div className="overlay-content">
            <h1 className="fw-lighter">The New Minimal<br />Jewelry Collection</h1>
            <button className="btn-warning shop-btn" onClick={showProducts}>Shop Collection</button>
          </div>
        </div>

        {/* New Arrivals */}
        <h3 className="fw-lighter text-center heading-bestSell">New Arrivals</h3>
        <div className="carousel-container">
          <button className="arrow left" onClick={() => console.log("scroll left")}>&#10094;</button>

          <div className="carousel" id="productCarousel">
            {products.map(product => (
              <ProductCard key={product.id} product={product} type="newArrivals" />
            ))}
          </div>

          <button className="arrow right" onClick={() => console.log("scroll right")}>&#10095;</button>
        </div>

        {/* Instagram Promo */}
        <div className="insta-promo">
          <h3 className="heading-promo">Follow</h3>
          <h3 className="heading-promo">Adalene On Instagram</h3>
          <p className="para-promo">@adaleneShop</p>
          <div className="images-insta">
            <img src="https://res.cloudinary.com/dobgclr9v/image/upload/v1747212802/157553_1244b96056e84b759931705533c8390a_va93xc.avif" alt="insta1" className="img-insta" />
            <img src="https://res.cloudinary.com/dobgclr9v/image/upload/v1747212802/157553_e1822d6ccef54c91a6e01f9220c0b5a1_wcza46.avif" alt="insta2" className="img-insta" />
            <img src="https://res.cloudinary.com/dobgclr9v/image/upload/v1747212802/157553_9bd1176d767b4d159892d0fe8353e855_b50pzk.avif" alt="insta3" className="img-insta" />
            <img src="https://res.cloudinary.com/dobgclr9v/image/upload/v1747212802/157553_981b23afab4a4ae89a3900753b98e378_noof0i.avif" alt="insta3" className="img-insta" />
            <img src="https://res.cloudinary.com/dobgclr9v/image/upload/v1747212802/157553_c026677d330b4b809c04d07d1d7abee6_vcbwvq.avif" alt="insta3" className="img-insta" />
            <img src="https://res.cloudinary.com/dobgclr9v/image/upload/v1747212802/157553_9bd1176d767b4d159892d0fe8353e855_b50pzk.avif" alt="insta3" className="img-insta" />
          </div>
          <div className="advantages">
            <p className="para-promo1">Free Shipping</p>
            <p className="para-promo1">Easy 30 Days Return</p>
            <p className="para-promo1">12 Months Warranty</p>
          </div>
        </div>
      </section>
    </>
  );
}
