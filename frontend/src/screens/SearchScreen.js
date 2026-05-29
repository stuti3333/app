import React, { useEffect, useReducer, useState, useRef } from 'react';
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
import Product from '../components/Product';
import { RealtimeTranscriber } from 'assemblyai';
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

  // Voice search state
  const [searchQuery, setSearchQuery] = useState(query === 'all' ? '' : query);
  const [listening, setListening] = useState(false);
  const [voiceError, setVoiceError] = useState('');
  const transcriberRef = useRef(null);
  const microphoneRef = useRef(null);

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

  const handleSearch = (searchText) => {
    if (searchText.trim()) {
      navigate(getFilterUrl({ query: searchText, page: 1 }));
    }
  };

  const startVoiceSearch = async () => {
    setVoiceError('');
    try {
      const { token } = await fetch(`${API}/api/assemblyai-token`).then((r) =>
        r.json(),
      );

      const transcriber = new RealtimeTranscriber({
        token,
        sampleRate: 16000,
        onTranscript: (transcript) => {
          if (transcript.message_type === 'FinalTranscript') {
            const text = transcript.text;
            setSearchQuery(text);
            handleSearch(text);
            stopVoiceSearch();
          } else {
            setSearchQuery(transcript.text);
          }
        },
        onError: (err) => {
          console.error('AssemblyAI error:', err);
          setVoiceError('Voice search unavailable. Please try again.');
          stopVoiceSearch();
        },
      });

      await transcriber.connect();
      transcriberRef.current = transcriber;

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const microphone = new MediaRecorder(stream, { mimeType: 'audio/webm' });
      microphone.ondataavailable = (e) => transcriber.sendAudio(e.data);
      microphone.start(250);
      microphoneRef.current = microphone;

      setListening(true);
    } catch (err) {
      console.error('Voice search error:', err);
      if (
        err.name === 'NotAllowedError' ||
        err.name === 'PermissionDeniedError'
      ) {
        setVoiceError(
          'Microphone access denied. Please allow mic access in your browser settings.',
        );
      } else {
        setVoiceError('Voice search unavailable. Please try again.');
      }
    }
  };

  const stopVoiceSearch = async () => {
    if (microphoneRef.current) {
      microphoneRef.current.stop();
      microphoneRef.current = null;
    }
    if (transcriberRef.current) {
      await transcriberRef.current.close();
      transcriberRef.current = null;
    }
    setListening(false);
  };

  const toggleVoiceSearch = () => {
    if (listening) {
      stopVoiceSearch();
    } else {
      startVoiceSearch();
    }
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopVoiceSearch();
    };
  }, []);

  return (
    <div>
      <Helmet>
        <title>Search Products</title>
      </Helmet>

      <div className="search-bar-container">
        <div className="search-wrapper">
          <input
            type="text"
            className="search-input"
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleSearch(searchQuery);
              }
            }}
          />
          <button
            className={`mic-btn ${listening ? 'listening' : ''}`}
            onClick={toggleVoiceSearch}
            aria-label="Voice search"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"></path>
              <path d="M19 10v2a7 7 0 0 1-14 0v-2"></path>
              <line x1="12" y1="19" x2="12" y2="23"></line>
              <line x1="8" y1="23" x2="16" y2="23"></line>
            </svg>
          </button>
          <div className={`listening-badge ${listening ? 'active' : ''}`}>
            <span className="pulse-dot"></span> Listening...
          </div>
        </div>
        {voiceError && <div className="voice-error">{voiceError}</div>}
      </div>

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
