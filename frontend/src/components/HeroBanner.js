import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import './HeroBanner.css';

const HeroBanner = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  
  const slides = [
    {
      id: 1,
      title: "Summer Sale",
      subtitle: "Up to 50% Off",
      description: "Discover amazing deals on electronics, fashion, and more",
      image: "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=1200",
      cta: "Shop Now",
      link: "/search?category=Electronics"
    },
    {
      id: 2,
      title: "New Arrivals",
      subtitle: "Fresh Styles",
      description: "Explore the latest trends in fashion and accessories",
      image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200",
      cta: "Explore",
      link: "/search?category=Fashion"
    },
    {
      id: 3,
      title: "Tech Essentials",
      subtitle: "Upgrade Your Life",
      description: "Get the best gadgets and electronics at unbeatable prices",
      image: "https://images.unsplash.com/photo-1468495244123-6c6c332eeece?w=1200",
      cta: "Discover",
      link: "/search?category=Electronics"
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [slides.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  return (
    <div className="hero-banner">
      <Container fluid>
        <Row className="align-items-center">
          <Col lg={6} className="hero-content">
            <div className="hero-slide-content">
              <h1 className="hero-title animate-slide-up">
                {slides[currentSlide].title}
              </h1>
              <h2 className="hero-subtitle animate-slide-up" style={{ animationDelay: '0.2s' }}>
                {slides[currentSlide].subtitle}
              </h2>
              <p className="hero-description animate-slide-up" style={{ animationDelay: '0.4s' }}>
                {slides[currentSlide].description}
              </p>
              <Link to={slides[currentSlide].link} className="animate-slide-up" style={{ animationDelay: '0.6s' }}>
                <Button variant="primary" size="lg" className="hero-cta">
                  {slides[currentSlide].cta}
                </Button>
              </Link>
            </div>
          </Col>
          <Col lg={6} className="hero-image">
            <img 
              src={slides[currentSlide].image} 
              alt={slides[currentSlide].title}
              className="hero-slide-image animate-fade-in"
            />
          </Col>
        </Row>
        
        <div className="slider-controls">
          <Button variant="light" className="slider-arrow prev" onClick={prevSlide}>
            <i className="fas fa-chevron-left"></i>
          </Button>
          <div className="slider-dots">
            {slides.map((_, index) => (
              <button
                key={index}
                className={`slider-dot ${index === currentSlide ? 'active' : ''}`}
                onClick={() => setCurrentSlide(index)}
              />
            ))}
          </div>
          <Button variant="light" className="slider-arrow next" onClick={nextSlide}>
            <i className="fas fa-chevron-right"></i>
          </Button>
        </div>
      </Container>
    </div>
  );
};

export default HeroBanner;
