import axios from 'axios';
import React, { useContext, useEffect, useReducer, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import {
  Container,
  Row,
  Col,
  Card,
  ListGroup,
  Button,
  Badge,
} from 'react-bootstrap';
import { Store } from '../Store';
import { getError } from '../utils';
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';

const reducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true, error: '' };
    case 'FETCH_SUCCESS':
      return { ...state, loading: false, order: action.payload, error: '' };
    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};

export default function DeliveryTrackingScreen() {
  const { state } = useContext(Store);
  const { userInfo } = state;
  const navigate = useNavigate();
  const params = useParams();
  const { id: orderId } = params;
  const [{ loading, error, order }, dispatch] = useReducer(reducer, {
    loading: true,
    order: {},
    error: '',
  });
  const [trackingSteps, setTrackingSteps] = useState([]);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        dispatch({ type: 'FETCH_REQUEST' });
        const { data } = await axios.get(
          `${process.env.REACT_APP_API_URL}/api/orders/${orderId}`,
          {
            headers: { authorization: `Bearer ${userInfo.token}` },
          },
        );
        dispatch({ type: 'FETCH_SUCCESS', payload: data });

        // Generate tracking steps based on order status
        const steps = generateTrackingSteps(data);
        setTrackingSteps(steps);
      } catch (err) {
        dispatch({ type: 'FETCH_FAIL', payload: getError(err) });
      }
    };
    if (!userInfo) {
      navigate('/signin');
    } else {
      fetchOrder();
    }
  }, [orderId, userInfo, navigate]);

  const generateTrackingSteps = (orderData) => {
    const steps = [
      {
        title: 'Order Placed',
        description: 'Your order has been placed successfully',
        completed: true,
        date: orderData.createdAt,
      },
      {
        title: 'Order Confirmed',
        description: 'Your order has been confirmed',
        completed: orderData.isPaid,
        date: orderData.paidAt,
      },
      {
        title: 'Shipped',
        description: 'Your order has been shipped',
        completed: false,
        date: null,
      },
      {
        title: 'Out for Delivery',
        description: 'Your order is out for delivery',
        completed: false,
        date: null,
      },
      {
        title: 'Delivered',
        description: 'Your order has been delivered',
        completed: orderData.isDelivered,
        date: orderData.deliveredAt,
      },
    ];
    return steps;
  };

  const handleTrackNavigation = () => {
    if (order.shippingAddress && order.shippingAddress.location) {
      const { lat, lng } = order.shippingAddress.location;
      window.open(
        `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`,
        '_blank',
      );
    } else {
      // Use address for navigation if location not available
      const address = `${order.shippingAddress.address}, ${order.shippingAddress.city}, ${order.shippingAddress.postalCode}, ${order.shippingAddress.country}`;
      window.open(
        `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`,
        '_blank',
      );
    }
  };

  return loading ? (
    <LoadingBox />
  ) : error ? (
    <MessageBox variant="danger">{error}</MessageBox>
  ) : (
    <Container className="mt-3">
      <Helmet>
        <title>Track Delivery - Order {orderId}</title>
      </Helmet>
      <h1 className="my-3">Track Your Delivery</h1>
      <Row>
        <Col md={8}>
          <Card className="mb-3">
            <Card.Body>
              <Card.Title>Order {orderId}</Card.Title>
              <Card.Text>
                <strong>Status:</strong>{' '}
                {order.isDelivered ? (
                  <Badge bg="success">Delivered</Badge>
                ) : order.isPaid ? (
                  <Badge bg="info">In Transit</Badge>
                ) : (
                  <Badge bg="warning">Pending</Badge>
                )}
              </Card.Text>
            </Card.Body>
          </Card>

          <Card className="mb-3">
            <Card.Body>
              <Card.Title>Delivery Tracking</Card.Title>
              <ListGroup variant="flush">
                {trackingSteps.map((step, index) => (
                  <ListGroup.Item
                    key={index}
                    className="d-flex align-items-start"
                  >
                    <div className="me-3">
                      <div
                        className={`rounded-circle d-flex align-items-center justify-content-center ${
                          step.completed ? 'bg-success' : 'bg-secondary'
                        }`}
                        style={{ width: '30px', height: '30px' }}
                      >
                        {step.completed && (
                          <i className="fas fa-check text-white"></i>
                        )}
                      </div>
                    </div>
                    <div className="flex-grow-1">
                      <h6
                        className={
                          step.completed ? 'text-success' : 'text-muted'
                        }
                      >
                        {step.title}
                      </h6>
                      <p className="mb-0 text-muted">{step.description}</p>
                      {step.date && (
                        <small className="text-muted">
                          {new Date(step.date).toLocaleString()}
                        </small>
                      )}
                    </div>
                  </ListGroup.Item>
                ))}
              </ListGroup>
            </Card.Body>
          </Card>

          <Card className="mb-3">
            <Card.Body>
              <Card.Title>Shipping Address</Card.Title>
              <Card.Text>
                <strong>Name:</strong> {order.shippingAddress?.fullName} <br />
                <strong>Address:</strong> {order.shippingAddress?.address},{' '}
                {order.shippingAddress?.city},{' '}
                {order.shippingAddress?.postalCode},{' '}
                {order.shippingAddress?.country}
              </Card.Text>
              <Button variant="primary" onClick={handleTrackNavigation}>
                <i className="fas fa-map-marker-alt me-2"></i>
                Track on Map
              </Button>
            </Card.Body>
          </Card>
        </Col>

        <Col md={4}>
          <Card className="mb-3">
            <Card.Body>
              <Card.Title>Order Summary</Card.Title>
              <ListGroup variant="flush">
                <ListGroup.Item>
                  <Row>
                    <Col>Items</Col>
                    <Col>${order.itemsPrice?.toFixed(2)}</Col>
                  </Row>
                </ListGroup.Item>
                <ListGroup.Item>
                  <Row>
                    <Col>Shipping</Col>
                    <Col>${order.shippingPrice?.toFixed(2)}</Col>
                  </Row>
                </ListGroup.Item>
                <ListGroup.Item>
                  <Row>
                    <Col>Tax</Col>
                    <Col>${order.taxPrice?.toFixed(2)}</Col>
                  </Row>
                </ListGroup.Item>
                <ListGroup.Item>
                  <Row>
                    <Col>
                      <strong>Total</strong>
                    </Col>
                    <Col>
                      <strong>${order.totalPrice?.toFixed(2)}</strong>
                    </Col>
                  </Row>
                </ListGroup.Item>
              </ListGroup>
            </Card.Body>
          </Card>

          <Card className="mb-3">
            <Card.Body>
              <Card.Title>Order Items</Card.Title>
              <ListGroup variant="flush">
                {order.orderItems?.map((item) => (
                  <ListGroup.Item key={item._id}>
                    <Row className="align-items-center">
                      <Col md={6}>
                        <img
                          src={
                            item.image.startsWith('/')
                              ? item.image
                              : `/${item.image}`
                          }
                          alt={item.name}
                          className="img-fluid rounded img-thumbnail"
                          style={{ maxWidth: '50px' }}
                        />
                        <Link to={`/product/${item.slug}`} className="ms-2">
                          {item.name}
                        </Link>
                      </Col>
                      <Col md={3}>
                        <span>
                          {item.quantity} x ${Number(item.price).toFixed(2)}
                        </span>
                      </Col>
                      <Col md={3}>
                        <strong>
                          ${(item.quantity * item.price).toFixed(2)}
                        </strong>
                      </Col>
                    </Row>
                  </ListGroup.Item>
                ))}
              </ListGroup>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}
