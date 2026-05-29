import { useContext } from 'react';
import { Store } from '../Store';
import { Helmet } from 'react-helmet-async';
import { Row, Col } from 'react-bootstrap';
import MessageBox from '../components/MessageBox';
import { Link } from 'react-router-dom';
import { ListGroup } from 'react-bootstrap';
import { Button } from 'react-bootstrap';
import { Card } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { isValidImageUrl } from '../utils';
export default function CartScreen() {
  const navigate = useNavigate();
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const {
    cart: { items },
  } = state;

  const handleImageError = (e, itemId) => {
    e.target.style.display = 'none';
    e.target.parentElement.classList.add('no-image');
  };
  const updateCartHandler = async (item, quantity) => {
    const { data } = await axios.get(
      `${process.env.REACT_APP_API_URL}/api/products/${item._id}`,
    );
    if (data.countInStock < quantity) {
      window.alert('Sorry. Product is out of stock');
      return;
    }

    ctxDispatch({
      type: 'CART_ADD_ITEM',
      payload: { ...item, quantity },
    });
  };
  const removeItemHandler = (item) => {
    ctxDispatch({ type: 'CART_REMOVE_ITEM', payload: item });
  };
  const checkoutHandler = () => {
    navigate('/signin?redirect=/shipping');
  };
  return (
    <div>
      <Helmet>
        <title>Shopping Cart</title>
      </Helmet>
      <h1>Cart Screen</h1>
      <Row>
        <Col md={8}>
          {items.length === 0 ? (
            <MessageBox>
              Cart is empty. <Link to="/">Go Shopping</Link>
            </MessageBox>
          ) : (
            <ListGroup>
              {items.map((item) => (
                <ListGroup.Item key={item._id}>
                  <Row className="align-items-center">
                    <Col md={4}>
                      <div
                        style={{
                          position: 'relative',
                          width: '80px',
                          height: '80px',
                          backgroundColor: '#2a2a2e',
                          display: 'inline-block',
                        }}
                        className="cart-image-wrapper"
                      >
                        <img
                          src={isValidImageUrl(item.image) ? item.image : null}
                          alt={item.name}
                          className="img-fluid rounded img-thumbnail"
                          style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                          }}
                          onError={(e) => handleImageError(e, item._id)}
                        ></img>
                      </div>{' '}
                      <style>{`
                        .cart-image-wrapper.no-image::after {
                          content: '📷';
                          position: absolute;
                          top: 50%;
                          left: 50%;
                          transform: translate(-50%, -50%);
                          color: #8b8b8b;
                          font-size: 24px;
                        }
                      `}</style>{' '}
                      <Link to={`/product/${item.slug}`}>{item.name}</Link>
                    </Col>
                    <Col md={3}>
                      <Button
                        variant="light"
                        onClick={() =>
                          updateCartHandler(item, item.quantity - 1)
                        }
                        disabled={item.quantity === 1}
                      >
                        <i className="fas fa-minus-circle"></i>
                      </Button>{' '}
                      <span>{item.quantity}</span>{' '}
                      <Button
                        variant="light"
                        onClick={() =>
                          updateCartHandler(item, item.quantity + 1)
                        }
                        disabled={item.quantity === item.countInStock}
                      >
                        <i className="fas fa-plus-circle"></i>
                      </Button>
                    </Col>
                    <Col md={3}>${Number(item.price).toFixed(2)}</Col>
                    <Col md={2}>
                      <Button
                        variant="light"
                        onClick={() => removeItemHandler(item)}
                      >
                        <i className="fas fa-trash"></i>
                      </Button>
                    </Col>
                  </Row>
                </ListGroup.Item>
              ))}
            </ListGroup>
          )}
        </Col>
        <Col md={4}>
          <Card>
            <Card.Body>
              <ListGroup variant="flush">
                <ListGroup.Item>
                  <h3>
                    Subtotal ({items.reduce((a, c) => a + c.quantity, 0)} items)
                    : $
                    {items
                      .reduce((a, c) => a + c.price * c.quantity, 0)
                      .toFixed(2)}
                  </h3>
                </ListGroup.Item>
                <ListGroup.Item>
                  <div className="d-grid">
                    <Button
                      type="button"
                      variant="primary"
                      onClick={checkoutHandler}
                      disabled={items.length === 0}
                    >
                      Proceed to Checkout
                    </Button>
                  </div>
                </ListGroup.Item>
              </ListGroup>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
}
