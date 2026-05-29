import React, { useEffect, useReducer, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { getError } from '../utils';
import { Helmet } from 'react-helmet-async';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Rating from '../components/Rating';
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';
import Button from 'react-bootstrap/Button';
import Product from '../components/Product';
import { LinkContainer } from 'react-router-bootstrap';
import './SearchScreen.css';

const reducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true };
    case 'FETCH_SUCCESS':
      return {
        ...state,
        products: action.payload.products,
        page: action.payload.page,
        pages: action.payload.pages,
        countProducts: action.payload.countProducts,
        loading: false,
      };
    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};

const prices = [
  { name: '$1 to $50', value: '1-50' },
  { name: '$51 to $200', value: '51-200' },
  { name: '$201 to $1000', value: '201-1000' },
  { name: '$1001 to $5000', value: '1001-5000' },
  { name: '$5001 & above', value: '5001-' },
];

export const ratings = [
  { name: '4stars & up', rating: 4 },
  { name: '3stars & up', rating: 3 },
  { name: '2stars & up', rating: 2 },
  { name: '1stars & up', rating: 1 },
];

export default function SearchScreen() {
  const navigate = useNavigate();
  const { search } = useLocation();
  const sp = new URLSearchParams(search);

  const category = sp.get('category') || 'all';
  const query = sp.get('query') || 'all';
  const price = sp.get('price') || 'all';
  const rating = sp.get('rating') || 'all';
  const order = sp.get('order') || 'newest';
  const page = sp.get('page') || 1;
  const image = sp.get('image') || null;

  const API = process.env.REACT_APP_API_URL;

  const [{ loading, error, products, pages, countProducts }, dispatch] =
    useReducer(reducer, {
      loading: true,
      error: '',
      products: [],
    });

  useEffect(() => {
    const fetchData = async () => {
      try {
        let url;
        if (image) {
          url = `${API}/api/products/image-search`;
          const { data } = await axios.post(url, { image });
          dispatch({
            type: 'FETCH_SUCCESS',
            payload: {
              products: data,
              page: 1,
              pages: 1,
              countProducts: data.length,
            },
          });
        } else {
          url = `${API}/api/products/search?page=${page}&query=${query}&category=${category}&price=${price}&rating=${rating}&order=${order}`;
          const { data } = await axios.get(url);
          dispatch({ type: 'FETCH_SUCCESS', payload: data });
        }
      } catch (err) {
        dispatch({
          type: 'FETCH_FAIL',
          payload: getError(err),
        });
      }
    };
    fetchData();
  }, [API, category, order, page, price, query, rating, image]);

  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data } = await axios.get(
          `${process.env.REACT_APP_API_URL}/api/products/categories`,
        );
        setCategories(data);
      } catch (err) {
        toast.error(getError(err));
      }
    };
    fetchCategories();
  }, [API]);

  const getFilterUrl = (filter) => {
    const filterPage = filter.page || page;
    const filterCategory = filter.category || category;
    const filterQuery = filter.query || query;
    const filterRating = filter.rating || rating;
    const filterPrice = filter.price || price;
    const sortOrder = filter.order || order;

    return `/search?category=${filterCategory}&query=${filterQuery}&price=${filterPrice}&rating=${filterRating}&order=${sortOrder}&page=${filterPage}`;
  };

  return (
    <div>
      <Helmet>
        <title>Search Products</title>
      </Helmet>

      <Row>
        <Col md={3}>
          <div className="filter-sidebar">
            <div className="filter-section">
              <h4 className="filter-section-title">
                <i className="fas fa-th-large me-2"></i>Department
              </h4>
              <div className="filter-options">
                <Link
                  to={getFilterUrl({ category: 'all' })}
                  className={`filter-option ${category === 'all' ? 'active' : ''}`}
                >
                  All Categories
                </Link>
                {categories.map((c) => (
                  <Link
                    key={c}
                    to={getFilterUrl({ category: c })}
                    className={`filter-option ${category === c ? 'active' : ''}`}
                  >
                    {c}
                  </Link>
                ))}
              </div>
            </div>

            <div className="filter-section">
              <h4 className="filter-section-title">
                <i className="fas fa-dollar-sign me-2"></i>Price Range
              </h4>
              <div className="filter-options">
                {prices.map((p) => (
                  <Link
                    key={p.value}
                    to={getFilterUrl({ price: p.value })}
                    className={`filter-option ${price === p.value ? 'active' : ''}`}
                  >
                    {p.name}
                  </Link>
                ))}
              </div>
            </div>

            <div className="filter-section">
              <h4 className="filter-section-title">
                <i className="fas fa-star me-2"></i>Customer Rating
              </h4>
              <div className="filter-options">
                {ratings.map((r) => (
                  <Link
                    key={r.name}
                    to={getFilterUrl({ rating: r.rating })}
                    className={`filter-option ${rating === r.rating.toString() ? 'active' : ''}`}
                  >
                    <Rating rating={r.rating} caption=" & up" />
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </Col>

        <Col md={9}>
          {loading ? (
            <LoadingBox />
          ) : error ? (
            <MessageBox variant="danger">{error}</MessageBox>
          ) : (
            <>
              <Row className="mb-3">
                <Col>
                  <div className="results-header">
                    <h5>{countProducts} Results</h5>
                    {category !== 'all' && (
                      <span className="active-filter-badge">
                        {category}
                        <Link
                          to={getFilterUrl({ category: 'all' })}
                          className="filter-remove"
                        >
                          <i className="fas fa-times"></i>
                        </Link>
                      </span>
                    )}
                  </div>
                </Col>
              </Row>

              <Row>
                {products.map((product) => (
                  <Col key={product._id} sm={6} lg={4}>
                    <Product product={product} />
                  </Col>
                ))}
              </Row>

              {pages > 1 && (
                <div className="pagination-container">
                  {[...Array(pages).keys()].map((x) => (
                    <Link
                      key={x + 1}
                      className={`pagination-link ${page === x + 1 ? 'active' : ''}`}
                      to={getFilterUrl({ page: x + 1 })}
                    >
                      {x + 1}
                    </Link>
                  ))}
                </div>
              )}
            </>
          )}
        </Col>
      </Row>
    </div>
  );
}
