import React, { useEffect, useReducer, useState } from 'react';
import { Container, Row, Col, Card, Button, Badge } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Rating from './Rating';
import './DealsSection.css';

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

const DealsSection = () => {
  const [{ loading, error, products }, dispatch] = useReducer(reducer, {
    loading: true,
    error: '',
    products: [],
  });

  const [imageErrors, setImageErrors] = useState({});

  const handleImageError = (productId) => {
    setImageErrors((prev) => ({ ...prev, [productId]: true }));
  };

  const [timeLeft, setTimeLeft] = useState({
    days: 2,
    hours: 15,
    minutes: 30,
    seconds: 45,
  });

  useEffect(() => {
    const fetchDeals = async () => {
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
    fetchDeals();
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        let { days, hours, minutes, seconds } = prev;

        if (seconds > 0) {
          seconds--;
        } else if (minutes > 0) {
          minutes--;
          seconds = 59;
        } else if (hours > 0) {
          hours--;
          minutes = 59;
          seconds = 59;
        } else if (days > 0) {
          days--;
          hours = 23;
          minutes = 59;
          seconds = 59;
        }

        return { days, hours, minutes, seconds };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <section className="deals-section">
      <Container>
        <div className="deals-header">
          <div className="deals-title-section">
            <h2 className="section-title">Flash Deals</h2>
            <p className="section-subtitle">
              Limited time offers - Don't miss out!
            </p>
          </div>
          <div className="countdown-timer">
            <div className="timer-block">
              <span className="timer-value">
                {String(timeLeft.days).padStart(2, '0')}
              </span>
              <span className="timer-label">Days</span>
            </div>
            <span className="timer-separator">:</span>
            <div className="timer-block">
              <span className="timer-value">
                {String(timeLeft.hours).padStart(2, '0')}
              </span>
              <span className="timer-label">Hours</span>
            </div>
            <span className="timer-separator">:</span>
            <div className="timer-block">
              <span className="timer-value">
                {String(timeLeft.minutes).padStart(2, '0')}
              </span>
              <span className="timer-label">Mins</span>
            </div>
            <span className="timer-separator">:</span>
            <div className="timer-block">
              <span className="timer-value">
                {String(timeLeft.seconds).padStart(2, '0')}
              </span>
              <span className="timer-label">Secs</span>
            </div>
          </div>
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
              <Col key={product._id} xs={12} md={6} lg={3}>
                <Card className="deal-product-card">
                  <div className="deal-badge">
                    <Badge bg="danger">
                      -{Math.floor(Math.random() * 30 + 20)}% OFF
                    </Badge>
                  </div>
                  <Link
                    to={`/product/${product.slug}`}
                    className="deal-image-link"
                  >
                    <div className="deal-image-wrapper">
                      <Card.Img
                        variant="top"
                        src={
                          imageErrors[product._id]
                            ? 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNTAwIiBoZWlnaHQ9IjUwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iNTAwIiBoZWlnaHQ9IjUwMCIgZmlsbD0iIzJhMmEyZSIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBkb21pbmFudC1iYXNlbGluZT0ibWlkZGxlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmb250LXNpemU9IjIwIiBmaWxsPSIjOGI4YjhiIj7wn5Oo8J+TqPCfk6k8J+TqPCfk6k8J+TqSDwn5Gm8J+RpvCfkabwn5Gm8J+RpvCfkabwn5GmPC90ZXh0Pjwvc3ZnPg=='
                            : product.image
                        }
                        alt={product.name}
                        className="deal-image"
                        onError={() => handleImageError(product._id)}
                      />
                    </div>
                  </Link>
                  <Card.Body>
                    <Link to={`/product/${product.slug}`} className="deal-link">
                      <Card.Title className="deal-name">
                        {product.name}
                      </Card.Title>
                    </Link>
                    <Rating
                      rating={product.rating}
                      numReviews={product.numReviews}
                    />
                    <div className="deal-price-section">
                      <span className="deal-price">
                        ${product.price.toFixed(2)}
                      </span>
                      <span className="deal-original-price">
                        ${(product.price * 1.3).toFixed(2)}
                      </span>
                    </div>
                    <Button
                      variant="danger"
                      className="deal-btn"
                      as={Link}
                      to={`/product/${product.slug}`}
                    >
                      Grab Deal
                    </Button>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        )}
      </Container>
    </section>
  );
};

export default DealsSection;
