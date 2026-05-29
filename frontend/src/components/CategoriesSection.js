import React from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import './CategoriesSection.css';

const CategoriesSection = () => {
  const categories = [
    {
      id: 1,
      name: 'Electronics',
      image:
        'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=400',
      itemCount: 150,
      icon: 'fas fa-laptop',
    },
    {
      id: 2,
      name: 'Fashion',
      image:
        'https://images.unsplash.com/photo-1445205170230-053b83016050?w=400',
      itemCount: 320,
      icon: 'fas fa-tshirt',
    },
    {
      id: 3,
      name: 'Home & Living',
      image:
        'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400',
      itemCount: 89,
      icon: 'fas fa-couch',
    },
    {
      id: 4,
      name: 'Beauty',
      image:
        'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400',
      itemCount: 120,
      icon: 'fas fa-spa',
    },
    {
      id: 5,
      name: 'Books',
      image:
        'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400',
      itemCount: 200,
      icon: 'fas fa-book',
    },
    {
      id: 6,
      name: 'Sports',
      image:
        'https://images.unsplash.com/photo-1461896836934-561709ea56e3?w=400',
      itemCount: 75,
      icon: 'fas fa-futbol',
    },
    {
      id: 7,
      name: 'Toys',
      image: 'https://images.unsplash.com/photo-1558060370-d644479cb6f7?w=400',
      itemCount: 95,
      icon: 'fas fa-gamepad',
    },
    {
      id: 8,
      name: 'Groceries',
      image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=400',
      itemCount: 180,
      icon: 'fas fa-shopping-basket',
    },
  ];

  return (
    <section className="categories-section">
      <Container>
        <div className="section-header">
          <h2 className="section-title">Shop by Category</h2>
          <p className="section-subtitle">Browse our wide range of products</p>
        </div>

        <Row className="g-4">
          {categories.map((category) => (
            <Col key={category.id} xs={6} md={4} lg={3}>
              <Link
                to={`/search?category=${category.name}`}
                className="category-card"
              >
                <Card className="category-card-inner">
                  <div className="category-image-wrapper">
                    <Card.Img
                      variant="top"
                      src={category.image}
                      alt={category.name}
                      className="category-image"
                    />
                    <div className="category-overlay">
                      <i className={`${category.icon} category-icon`}></i>
                    </div>
                  </div>
                  <Card.Body className="category-body">
                    <Card.Title className="category-name">
                      {category.name}
                    </Card.Title>
                    <Card.Text className="category-count">
                      {category.itemCount} Products
                    </Card.Text>
                  </Card.Body>
                </Card>
              </Link>
            </Col>
          ))}
        </Row>
      </Container>
    </section>
  );
};

export default CategoriesSection;
