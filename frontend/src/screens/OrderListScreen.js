import React, { useContext, useEffect, useReducer, useState } from 'react';
import axios from 'axios';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { toast } from 'react-toastify';
import { getError } from '../utils';
import { Store } from '../Store';
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';
import Form from 'react-bootstrap/Form';
import OrderCard from '../components/OrderCard';

const reducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true };
    case 'FETCH_SUCCESS':
      return {
        ...state,
        orders: action.payload,
        loading: false,
      };
    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload };
    case 'DELETE_REQUEST':
      return { ...state, loadingDelete: true, successDelete: false };
    case 'DELETE_SUCCESS':
      return {
        ...state,
        loadingDelete: false,
        successDelete: true,
      };
    case 'DELETE_FAIL':
      return {
        ...state,
        loadingDelete: false,
        successDelete: false,
      };
    case 'DELETE_RESET':
      return { ...state, loadingDelete: false, successDelete: false };
    default:
      return state;
  }
};

export default function OrderListScreen() {
  const [{ loading, error, orders, loadingDelete, successDelete }, dispatch] =
    useReducer(reducer, {
      loading: true,
      error: '',
      orders: [],
      loadingDelete: false,
      successDelete: false,
    });

  const { state } = useContext(Store);
  const { userInfo } = state;
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        dispatch({ type: 'FETCH_REQUEST' });
        const { data } = await axios.get(
          `${process.env.REACT_APP_API_URL}/api/orders`,
          {
            headers: { Authorization: `Bearer ${userInfo.token}` },
          },
        );
        dispatch({ type: 'FETCH_SUCCESS', payload: data });
      } catch (err) {
        dispatch({
          type: 'FETCH_FAIL',
          payload: getError(err),
        });
      }
    };
    if (successDelete) {
      dispatch({ type: 'DELETE_RESET' });
    } else {
      fetchData();
    }
  }, [userInfo, successDelete]);

  const deleteHandler = async (order) => {
    if (window.confirm('Are you sure to delete?')) {
      try {
        dispatch({ type: 'DELETE_REQUEST' });
        await axios.delete(
          `${process.env.REACT_APP_API_URL}/api/orders/${order._id}`,
          {
            headers: { Authorization: `Bearer ${userInfo.token}` },
          },
        );
        toast.success('Order deleted successfully');
        dispatch({ type: 'DELETE_SUCCESS' });
      } catch (err) {
        toast.error(getError(err));
        dispatch({
          type: 'DELETE_FAIL',
        });
      }
    }
  };

  const filteredOrders = orders.filter(
    (order) =>
      order._id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (order.user &&
        order.user.name &&
        order.user.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (order.user &&
        order.user.email &&
        order.user.email.toLowerCase().includes(searchQuery.toLowerCase())),
  );

  return (
    <div>
      <Row>
        <Col>
          <h1>Orders</h1>
        </Col>
        <Col className="col text-end">
          <Form.Control
            type="text"
            placeholder="Search orders..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="admin-search"
            style={{ maxWidth: '300px' }}
          />
        </Col>
      </Row>

      {loadingDelete && <LoadingBox></LoadingBox>}
      {loading ? (
        <LoadingBox></LoadingBox>
      ) : error ? (
        <MessageBox variant="danger">{error}</MessageBox>
      ) : (
        <div className="orders-container">
          {filteredOrders.map((order) => (
            <OrderCard key={order._id} order={order} onDelete={deleteHandler} />
          ))}
        </div>
      )}
    </div>
  );
}
