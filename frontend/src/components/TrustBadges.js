import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import './TrustBadges.css';

const TrustBadges = () => {
  const badges = [
    {
      icon: 'fas fa-shipping-fast',
      title: 'Free Shipping',
      description: 'On orders over $50',
      color: '#667eea'
    },
    {
      icon: 'fas fa-undo',
      title: 'Easy Returns',
      description: '30-day return policy',
      color: '#764ba2'
    },
    {
      icon: 'fas fa-shield-alt',
      title: 'Secure Payment',
      description: '100% secure checkout',
      color: '#f093fb'
    },
    {
      icon: 'fas fa-headset',
      title: '24/7 Support',
      description: 'Dedicated support team',
      color: '#4facfe'
    },
    {
      icon: 'fas fa-certificate',
      title: 'Quality Guarantee',
      description: 'Verified products only',
      color: '#43e97b'
    },
    {
      icon: 'fas fa-tags',
      title: 'Best Prices',
      description: 'Competitive pricing',
      color: '#fa709a'
    }
  ];

  return (
    <section className="trust-badges-section">
      <Container>
        <Row className="g-4">
          {badges.map((badge, index) => (
            <Col key={index} xs={12} sm={6} md={4} lg={2}>
              <div className="trust-badge-item">
                <div 
                  className="badge-icon-wrapper"
                  style={{ background: `linear-gradient(135deg, ${badge.color} 0%, ${badge.color}aa 100%)` }}
                >
                  <i className={`${badge.icon} badge-icon`}></i>
                </div>
                <h3 className="badge-title">{badge.title}</h3>
                <p className="badge-description">{badge.description}</p>
              </div>
            </Col>
          ))}
        </Row>
      </Container>
    </section>
  );
};

export default TrustBadges;
