import React from 'react';
import { Card, Badge, Button, Row, Col } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

export default function OrderCard({ order, onDelete }) {
  const navigate = useNavigate();

  return (
    <Card className="order-card mb-3">
      <Card.Body>
        <Row className="align-items-center">
          <Col xs={12} md={2} className="mb-3 mb-md-0">
            <div className="order-id">
              <h6 className="text-muted mb-1">Order ID</h6>
              <p className="order-id-text mb-0">#{order._id.substring(20, 24)}</p>
            </div>
          </Col>
          <Col xs={12} md={3} className="mb-3 mb-md-0">
            <div className="order-customer">
              <h6 className="text-muted mb-1">Customer</h6>
              <p className="customer-name mb-0">{order.user ? order.user.name : 'Unknown User'}</p>
              <small className="customer-email text-muted">{order.user ? order.user.email : ''}</small>
            </div>
          </Col>
          <Col xs={12} md={2} className="mb-3 mb-md-0">
            <div className="order-date">
              <h6 className="text-muted mb-1">Date</h6>
              <p className="order-date-text mb-0">{order.createdAt ? order.createdAt.substring(0, 10) : ''}</p>
            </div>
          </Col>
          <Col xs={12} md={2} className="mb-3 mb-md-0">
            <div className="order-total">
              <h6 className="text-muted mb-1">Total</h6>
              <p className="order-total-text mb-0">${order.totalPrice.toFixed(2)}</p>
            </div>
          </Col>
          <Col xs={12} md={3} className="text-md-end">
            <div className="order-status-actions">
              <div className="order-status mb-2">
                <Badge bg={order.isPaid ? 'success' : 'danger'} className="status-badge me-2">
                  {order.isPaid ? 'Paid' : 'Unpaid'}
                </Badge>
                <Badge bg={order.isDelivered ? 'success' : 'warning'} className="status-badge">
                  {order.isDelivered ? 'Delivered' : 'Pending'}
                </Badge>
              </div>
              <div className="order-actions">
                <Button
                  variant="primary"
                  size="sm"
                  className="action-btn me-2"
                  onClick={() => navigate(`/order/${order._id}`)}
                >
                  View
                </Button>
                <Button
                  variant="danger"
                  size="sm"
                  className="action-btn"
                  onClick={() => onDelete(order)}
                >
                  Delete
                </Button>
              </div>
            </div>
          </Col>
        </Row>
      </Card.Body>
    </Card>
  );
}
