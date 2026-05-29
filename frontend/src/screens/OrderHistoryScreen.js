import React from 'react';
import { Helmet } from 'react-helmet-async';
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';
import { useReducer, useEffect } from 'react';
import axios from 'axios';
import { useContext } from 'react';
import { Store } from '../Store';
import { useNavigate } from 'react-router-dom';
import { Button } from 'react-bootstrap';
import { getError } from '../utils';
import AdminTable from '../components/AdminTable';

const reducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true };
    case 'FETCH_SUCCESS':
      return { ...state, loading: false, orders: action.payload };
    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};

export default function OrderHistoryScreen() {
  const { state } = useContext(Store);
  const { userInfo } = state;
  const navigate = useNavigate();
  const [{ loading, error, orders }, dispatch] = useReducer(reducer, {
    loading: true,
    error: '',
  });
  useEffect(() => {
    const fetchData = async () => {
      dispatch({ type: 'FETCH_REQUEST' });
      try {
        const { data } = await axios.get(
          `${process.env.REACT_APP_API_URL}/api/orders/mine`,
          {
            headers: { authorization: `Bearer ${userInfo.token}` },
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
    fetchData();
  }, [userInfo]);
  return (
    <div>
      <Helmet>
        <title>Order History</title>
      </Helmet>
      <h1>Order History</h1>
      {loading ? (
        <LoadingBox></LoadingBox>
      ) : error ? (
        <MessageBox variant="danger">{error}</MessageBox>
      ) : (
        <AdminTable
          columns={[
            {
              key: 'id',
              label: 'ID',
              flex: 1,
              render: (row) => row._id.substring(row._id.length - 6),
            },
            {
              key: 'date',
              label: 'DATE',
              flex: 1,
              render: (row) => row.createdAt.substring(0, 10),
            },
            {
              key: 'total',
              label: 'TOTAL',
              flex: 1,
              render: (row) => `$${row.totalPrice.toFixed(2)}`,
            },
            {
              key: 'paid',
              label: 'PAID',
              flex: 1,
              render: (row) =>
                row.isPaid ? row.paidAt.substring(0, 10) : 'No',
            },
            {
              key: 'delivered',
              label: 'DELIVERED',
              flex: 1,
              render: (row) =>
                row.isDelivered ? row.deliveredAt.substring(0, 10) : 'No',
            },
            {
              key: 'actions',
              label: 'ACTIONS',
              flex: 1,
              render: (row) => (
                <Button
                  type="button"
                  variant="light"
                  className="admin-btn-primary"
                  onClick={() => {
                    navigate(`/order/${row._id}`);
                  }}
                >
                  Details
                </Button>
              ),
            },
          ]}
          data={orders}
        />
      )}
    </div>
  );
}
