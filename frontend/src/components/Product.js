import { Link } from 'react-router-dom';
import { Card, Button } from 'react-bootstrap';
import Rating from './Rating';
import { useContext, useState } from 'react';
import { Store } from '../Store';
import axios from 'axios';
import './Product.css';

function Product(props) {
  const { product } = props;
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const {
    cart: { items },
  } = state;
  const [isWishlisted, setIsWishlisted] = useState(false);

  const addToCartHandler = async (item) => {
    const existItem = items.find((x) => x._id === product._id);

    const quantity = existItem ? existItem.quantity + 1 : 1;
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

  const toggleWishlistHandler = () => {
    setIsWishlisted(!isWishlisted);
    ctxDispatch({
      type: isWishlisted ? 'WISHLIST_REMOVE_ITEM' : 'WISHLIST_ADD_ITEM',
      payload: product,
    });
  };

  return (
    <Card className="modern-product-card">
      <div className="product-image-container">
        <Link to={`/product/${product.slug}`}>
          <img
            src={product.image}
            className="card-img-top product-image"
            alt={product.name}
          />
        </Link>
        <button
          className={`wishlist-btn ${isWishlisted ? 'active' : ''}`}
          onClick={toggleWishlistHandler}
          aria-label="Add to wishlist"
        >
          <i className={`${isWishlisted ? 'fas' : 'far'} fa-heart`}></i>
        </button>
        {product.countInStock > 0 && (
          <div
            className="quick-add-btn"
            onClick={() => addToCartHandler(product)}
          >
            <i className="fas fa-shopping-cart"></i>
          </div>
        )}
      </div>
      <Card.Body>
        <Link to={`/product/${product.slug}`} className="product-link">
          <Card.Title className="product-title">{product.name}</Card.Title>
        </Link>
        <Rating
          rating={product.rating}
          numReviews={product.numReviews}
        ></Rating>
        <div className="product-price-section">
          <Card.Text className="product-price">
            ${product.price.toFixed(2)}
          </Card.Text>
          {product.countInStock < 10 && product.countInStock > 0 && (
            <span className="low-stock">Only {product.countInStock} left!</span>
          )}
        </div>
        {product.countInStock === 0 ? (
          <Button variant="light" className="out-of-stock-btn" disabled>
            Out of Stock
          </Button>
        ) : (
          <Button
            variant="primary"
            className="add-to-cart-btn"
            onClick={() => addToCartHandler(product)}
          >
            Add to Cart
          </Button>
        )}
      </Card.Body>
    </Card>
  );
}
export default Product;
