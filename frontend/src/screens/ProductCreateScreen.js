import React, { useContext, useReducer, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Store } from '../Store';
import { toast } from 'react-toastify';
import { getError } from '../utils';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import { Helmet } from 'react-helmet-async';
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';
import Button from 'react-bootstrap/Button';

const reducer = (state, action) => {
  switch (action.type) {
    case 'CREATE_REQUEST':
      return { ...state, loadingCreate: true };
    case 'CREATE_SUCCESS':
      return { ...state, loadingCreate: false };
    case 'CREATE_FAIL':
      return { ...state, loadingCreate: false, error: action.payload };
    default:
      return state;
  }
};

export default function ProductCreateScreen() {
  const navigate = useNavigate();
  const { state } = useContext(Store);
  const { userInfo } = state;
  const [{ loadingCreate, error }, dispatch] = useReducer(reducer, {
    loadingCreate: false,
    error: '',
  });

  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [price, setPrice] = useState('');
  const [image, setImage] = useState('');
  const [category, setCategory] = useState('');
  const [countInStock, setCountInStock] = useState('');
  const [brand, setBrand] = useState('');
  const [rating, setRating] = useState('');
  const [numReviews, setNumReviews] = useState('');
  const [description, setDescription] = useState('');

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      dispatch({ type: 'CREATE_REQUEST' });
      await axios.post(
        `${process.env.REACT_APP_API_URL}/api/products`,
        {
          name,
          slug,
          price,
          image,
          category,
          brand,
          countInStock,
          rating,
          numReviews,
          description,
        },
        {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        },
      );
      dispatch({
        type: 'CREATE_SUCCESS',
      });
      toast.success('Product created successfully');
      navigate('/admin/products');
    } catch (err) {
      toast.error(getError(err));
      dispatch({
        type: 'CREATE_FAIL',
        payload: getError(err),
      });
    }
  };

  return (
    <Container className="small-container">
      <Helmet>
        <title>Create New Product</title>
      </Helmet>
      <h1>Create New Product</h1>

      {error && <MessageBox variant="danger">{error}</MessageBox>}

      <Form onSubmit={submitHandler}>
        <Form.Group className="mb-3" controlId="name">
          <Form.Label>Name</Form.Label>
          <Form.Control
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="slug">
          <Form.Label>Slug</Form.Label>
          <Form.Control
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="price">
          <Form.Label>Price</Form.Label>
          <Form.Control
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="image">
          <Form.Label>Image URL</Form.Label>
          <Form.Control
            value={image}
            onChange={(e) => setImage(e.target.value)}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="category">
          <Form.Label>Category</Form.Label>
          <Form.Control
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="brand">
          <Form.Label>Brand</Form.Label>
          <Form.Control
            value={brand}
            onChange={(e) => setBrand(e.target.value)}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="countInStock">
          <Form.Label>Count In Stock</Form.Label>
          <Form.Control
            value={countInStock}
            onChange={(e) => setCountInStock(e.target.value)}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="rating">
          <Form.Label>Rating</Form.Label>
          <Form.Control
            value={rating}
            onChange={(e) => setRating(e.target.value)}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="numReviews">
          <Form.Label>Number of Reviews</Form.Label>
          <Form.Control
            value={numReviews}
            onChange={(e) => setNumReviews(e.target.value)}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="description">
          <Form.Label>Description</Form.Label>
          <Form.Control
            as="textarea"
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </Form.Group>

        <div className="mb-3">
          <Button disabled={loadingCreate} type="submit">
            Create Product
          </Button>
          {loadingCreate && <LoadingBox></LoadingBox>}
        </div>
      </Form>
    </Container>
  );
}
