import React, { useState, useContext, useEffect } from 'react';
import {
  Container,
  Navbar,
  Nav,
  Button,
  Badge,
  NavDropdown,
} from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { LinkContainer } from 'react-router-bootstrap';
import { Store } from '../Store';
import { useDarkMode } from '../context/DarkModeContext';
import SearchBox from './SearchBox';
import './ModernNavbar.css';

const ModernNavbar = () => {
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { cart, userInfo } = state;
  const { isDarkMode, toggleDarkMode } = useDarkMode();
  const [expanded, setExpanded] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const signOutHandler = () => {
    ctxDispatch({ type: 'USER_SIGNOUT' });
    localStorage.removeItem('userInfo');
    localStorage.removeItem('shippingAddress');
    localStorage.removeItem('cartItems');
    localStorage.removeItem('paymentMethod');
    window.location.href = '/';
  };

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <Navbar
      expand="lg"
      className={`modern-navbar ${scrolled ? 'scrolled' : ''} ${isDarkMode ? 'dark-mode' : ''}`}
      expanded={expanded}
      onToggle={() => setExpanded(!expanded)}
    >
      <Container>
        <LinkContainer to="/">
          <Navbar.Brand className="brand-logo">
            <i className="fas fa-shopping-bag brand-icon"></i>
            <span>ShopHub</span>
          </Navbar.Brand>
        </LinkContainer>

        <Navbar.Toggle
          aria-controls="basic-navbar-nav"
          className="navbar-toggle-custom"
        >
          <i className={`fas ${expanded ? 'fa-times' : 'fa-bars'}`}></i>
        </Navbar.Toggle>

        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Link
              to="/"
              className="nav-link-custom"
              onClick={() => setExpanded(false)}
            >
              <i className="fas fa-home me-1"></i> Home
            </Link>
            <Link
              to="/search"
              className="nav-link-custom"
              onClick={() => setExpanded(false)}
            >
              <i className="fas fa-search me-1"></i> Products
            </Link>
            <Link
              to="/cart"
              className="nav-link-custom"
              onClick={() => setExpanded(false)}
            >
              <i className="fas fa-shopping-cart me-1"></i> Cart
              {cart.items.length > 0 && (
                <Badge pill bg="danger" className="cart-badge">
                  {cart.items.reduce((a, c) => a + c.quantity, 0)}
                </Badge>
              )}
            </Link>
          </Nav>

          <div className="navbar-actions">
            <SearchBox />

            <Button
              variant="outline-light"
              className="dark-mode-toggle ms-2"
              onClick={toggleDarkMode}
              title={
                isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'
              }
            >
              <i className={`fas ${isDarkMode ? 'fa-sun' : 'fa-moon'}`}></i>
            </Button>

            {userInfo ? (
              <NavDropdown
                title={
                  <span className="user-dropdown">
                    <i className="fas fa-user-circle me-1"></i>
                    {userInfo.name}
                  </span>
                }
                id="basic-nav-dropdown"
                className="user-dropdown-custom"
              >
                <LinkContainer to="/profile" onClick={() => setExpanded(false)}>
                  <NavDropdown.Item>
                    <i className="fas fa-user me-2"></i> User Profile
                  </NavDropdown.Item>
                </LinkContainer>
                <LinkContainer
                  to="/orderhistory"
                  onClick={() => setExpanded(false)}
                >
                  <NavDropdown.Item>
                    <i className="fas fa-history me-2"></i> Order History
                  </NavDropdown.Item>
                </LinkContainer>
                <NavDropdown.Divider />
                <NavDropdown.Item onClick={signOutHandler}>
                  <i className="fas fa-sign-out-alt me-2"></i> Sign Out
                </NavDropdown.Item>
              </NavDropdown>
            ) : (
              <Link
                to="/signin"
                className="btn btn-modern btn-primary ms-2"
                onClick={() => setExpanded(false)}
              >
                <i className="fas fa-sign-in-alt me-1"></i> Sign In
              </Link>
            )}

            {userInfo && userInfo.isAdmin && (
              <NavDropdown
                title={
                  <span className="admin-dropdown">
                    <i className="fas fa-cog me-1"></i> Admin
                  </span>
                }
                id="admin-nav-dropdown"
                className="admin-dropdown-custom ms-2"
              >
                <LinkContainer
                  to="/admin/dashboard"
                  onClick={() => setExpanded(false)}
                >
                  <NavDropdown.Item>
                    <i className="fas fa-tachometer-alt me-2"></i> Dashboard
                  </NavDropdown.Item>
                </LinkContainer>
                <LinkContainer
                  to="/admin/products"
                  onClick={() => setExpanded(false)}
                >
                  <NavDropdown.Item>
                    <i className="fas fa-box me-2"></i> Products
                  </NavDropdown.Item>
                </LinkContainer>
                <LinkContainer
                  to="/admin/orders"
                  onClick={() => setExpanded(false)}
                >
                  <NavDropdown.Item>
                    <i className="fas fa-shopping-bag me-2"></i> Orders
                  </NavDropdown.Item>
                </LinkContainer>
                <LinkContainer
                  to="/admin/users"
                  onClick={() => setExpanded(false)}
                >
                  <NavDropdown.Item>
                    <i className="fas fa-users me-2"></i> Users
                  </NavDropdown.Item>
                </LinkContainer>
              </NavDropdown>
            )}
          </div>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default ModernNavbar;
