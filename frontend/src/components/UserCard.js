import React from 'react';
import { Card, Badge, Button, Row, Col } from 'react-bootstrap';

export default function UserCard({ user, onToggleAdmin, onDelete }) {
  return (
    <Card className="user-card mb-3">
      <Card.Body>
        <Row className="align-items-center">
          <Col xs={12} md={3} className="mb-3 mb-md-0">
            <div className="user-avatar">
              <i className="fas fa-user-circle fa-3x text-primary"></i>
            </div>
          </Col>
          <Col xs={12} md={3} className="mb-3 mb-md-0">
            <div className="user-info">
              <h5 className="user-name">{user.name}</h5>
              <p className="user-email text-muted mb-0">{user.email}</p>
            </div>
          </Col>
          <Col xs={12} md={2} className="mb-3 mb-md-0">
            <div className="user-role">
              {user.isAdmin ? (
                <Badge bg="success" className="role-badge">
                  Admin
                </Badge>
              ) : (
                <Badge bg="secondary" className="role-badge">
                  User
                </Badge>
              )}
            </div>
          </Col>
          <Col xs={12} md={4} className="text-md-end">
            <div className="user-actions">
              <Button
                variant={user.isAdmin ? 'warning' : 'primary'}
                size="sm"
                className="action-btn me-2"
                onClick={() => onToggleAdmin(user)}
              >
                {user.isAdmin ? 'Remove Admin' : 'Make Admin'}
              </Button>
              <Button
                variant="danger"
                size="sm"
                className="action-btn"
                onClick={() => onDelete(user)}
              >
                Delete
              </Button>
            </div>
          </Col>
        </Row>
      </Card.Body>
    </Card>
  );
}
