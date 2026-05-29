import React, { useEffect, useReducer, useState } from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Rating from './Rating';
import './TrendingProducts.css';

const reducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true };
    case 'FETCH_SUCCESS':
      return { ...state, loading: false, products: action.payload };
    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};

const TrendingProducts = () => {
  const [{ loading, error, products }, dispatch] = useReducer(reducer, {
    loading: true,
    error: '',
    products: [],
  });

  const [imageErrors, setImageErrors] = useState({});

  const handleImageError = (productId) => {
    setImageErrors((prev) => ({ ...prev, [productId]: true }));
  };

  useEffect(() => {
    const fetchTrendingProducts = async () => {
      dispatch({ type: 'FETCH_REQUEST' });
      try {
        const { data } = await axios.get(
          `${process.env.REACT_APP_API_URL}/api/products/random-diverse/5`,
        );
        dispatch({ type: 'FETCH_SUCCESS', payload: data });
      } catch (err) {
        dispatch({ type: 'FETCH_FAIL', payload: err.message });
      }
    };
    fetchTrendingProducts();
  }, []);

  return (
    <section className="trending-section">
      <Container>
        <div className="section-header">
          <h2 className="section-title">Trending Now</h2>
          <p className="section-subtitle">Discover what's popular right now</p>
        </div>

        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        ) : error ? (
          <div className="alert alert-danger">{error}</div>
        ) : (
          <Row className="g-4">
            {products.map((product) => (
              <Col key={product._id} xs={6} md={4} lg={3}>
                <Card className="trending-product-card">
                  <Link
                    to={`/product/${product.slug}`}
                    className="product-image-link"
                  >
                    <div className="product-image-wrapper">
                      <Card.Img
                        variant="top"
                        src={
                          imageErrors[product._id]
                            ? 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNTAwIiBoZWlnaHQ9IjUwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iNTAwIiBoZWlnaHQ9IjUwMCIgZmlsbD0iIzJhMmEyZSIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBkb21pbmFudC1iYXNlbGluZT0ibWlkZGxlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmb250LXNpemU9IjIwIiBmaWxsPSIjOGI4YjhiIj7wn5Oo8J+TqPCfk6k8J+TqPCfk6k8J+TqSDwn5Gm8J+RpvCfkabwn5Gm8J+RpvCfkabwn5GmPC90ZXh0Pjwvc3ZnPg=='
                            : product.image
                        }
                        alt={product.name}
                        className="product-image"
                        onError={() => handleImageError(product._id)}
                      />
                      <div className="product-badge">Trending</div>
                    </div>
                  </Link>
                  <Card.Body>
                    <Link
                      to={`/product/${product.slug}`}
                      className="product-link"
                    >
                      <Card.Title className="product-name">
                        {product.name}
                      </Card.Title>
                    </Link>
                    <Rating
                      rating={product.rating}
                      numReviews={product.numReviews}
                    />
                    <div className="product-price-section">
                      <span className="product-price">
                        ${product.price.toFixed(2)}
                      </span>
                      {product.countInStock > 0 && (
                        <span className="product-stock">In Stock</span>
                      )}
                    </div>
                    <Button
                      variant="primary"
                      className="add-to-cart-btn"
                      as={Link}
                      to={`/product/${product.slug}`}
                    >
                      View Details
                    </Button>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        )}

        <div className="text-center mt-5">
          <Button variant="outline-primary" size="lg" as={Link} to="/search">
            View All Products
          </Button>
        </div>
      </Container>
    </section>
  );
};

export default TrendingProducts;
