import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import './ModernFooter.css';

const ModernFooter = () => {
  return (
    <footer className="modern-footer">
      <Container>
        <Row className="g-4">
          <Col lg={4} md={6}>
            <div className="footer-brand">
              <h3>Amazon Clone</h3>
              <p>
                Your one-stop destination for all your shopping needs. Quality
                products, great prices, and exceptional service.
              </p>
              <div className="social-links">
                <button className="social-link" aria-label="Facebook">
                  <i className="fab fa-facebook-f"></i>
                </button>
                <button className="social-link" aria-label="Twitter">
                  <i className="fab fa-twitter"></i>
                </button>
                <button className="social-link" aria-label="Instagram">
                  <i className="fab fa-instagram"></i>
                </button>
                <button className="social-link" aria-label="LinkedIn">
                  <i className="fab fa-linkedin-in"></i>
                </button>
              </div>
            </div>
          </Col>

          <Col lg={2} md={6}>
            <div className="footer-links-section">
              <h4>Quick Links</h4>
              <ul className="footer-links">
                <li>
                  <Link to="/">Home</Link>
                </li>
                <li>
                  <Link to="/search">Products</Link>
                </li>
                <li>
                  <Link to="/cart">Cart</Link>
                </li>
                <li>
                  <Link to="/signin">Sign In</Link>
                </li>
              </ul>
            </div>
          </Col>

          <Col lg={2} md={6}>
            <div className="footer-links-section">
              <h4>Categories</h4>
              <ul className="footer-links">
                <li>
                  <Link to="/search?category=Electronics">Electronics</Link>
                </li>
                <li>
                  <Link to="/search?category=Fashion">Fashion</Link>
                </li>
                <li>
                  <Link to="/search?category=Home">Home & Living</Link>
                </li>
                <li>
                  <Link to="/search?category=Beauty">Beauty</Link>
                </li>
              </ul>
            </div>
          </Col>

          <Col lg={2} md={6}>
            <div className="footer-links-section">
              <h4>Support</h4>
              <ul className="footer-links">
                <li>
                  <Link to="/contact">Contact Us</Link>
                </li>
                <li>
                  <Link to="/faq">FAQ</Link>
                </li>
                <li>
                  <Link to="/shipping">Shipping Info</Link>
                </li>
                <li>
                  <Link to="/returns">Returns</Link>
                </li>
              </ul>
            </div>
          </Col>

          <Col lg={2} md={6}>
            <div className="footer-links-section">
              <h4>Legal</h4>
              <ul className="footer-links">
                <li>
                  <Link to="/privacy">Privacy Policy</Link>
                </li>
                <li>
                  <Link to="/terms">Terms of Service</Link>
                </li>
                <li>
                  <Link to="/cookies">Cookie Policy</Link>
                </li>
              </ul>
            </div>
          </Col>
        </Row>

        <div className="footer-bottom">
          <div className="footer-bottom-content">
            <p>&copy; 2024 Amazon Clone. All rights reserved.</p>
            <div className="payment-methods">
              <i className="fab fa-cc-visa"></i>
              <i className="fab fa-cc-mastercard"></i>
              <i className="fab fa-cc-amex"></i>
              <i className="fab fa-cc-paypal"></i>
              <i className="fab fa-apple-pay"></i>
            </div>
          </div>
        </div>
      </Container>
    </footer>
  );
};

export default ModernFooter;
