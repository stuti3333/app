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
import UserCard from '../components/UserCard';

const reducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true };
    case 'FETCH_SUCCESS':
      return {
        ...state,
        users: action.payload,
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

export default function UserListScreen() {
  const [{ loading, error, users, loadingDelete, successDelete }, dispatch] =
    useReducer(reducer, {
      loading: true,
      error: '',
      users: [],
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
          `${process.env.REACT_APP_API_URL}/api/users`,
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

  const deleteHandler = async (user) => {
    if (window.confirm('Are you sure to delete?')) {
      try {
        dispatch({ type: 'DELETE_REQUEST' });
        await axios.delete(
          `${process.env.REACT_APP_API_URL}/api/users/${user._id}`,
          {
            headers: { Authorization: `Bearer ${userInfo.token}` },
          },
        );
        toast.success('User deleted successfully');
        dispatch({ type: 'DELETE_SUCCESS' });
      } catch (err) {
        toast.error(getError(err));
        dispatch({
          type: 'DELETE_FAIL',
        });
      }
    }
  };

  const toggleAdminHandler = async (user) => {
    try {
      await axios.put(
        `${process.env.REACT_APP_API_URL}/api/users/${user._id}`,
        { isAdmin: !user.isAdmin },
        {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        },
      );
      toast.success(
        `User ${user.isAdmin ? 'removed from' : 'promoted to'} admin`,
      );
      dispatch({ type: 'DELETE_SUCCESS' });
    } catch (err) {
      toast.error(getError(err));
    }
  };

  const filteredUsers = users.filter(
    (user) =>
      user._id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <div>
      <Row>
        <Col>
          <h1>Users</h1>
        </Col>
        <Col className="col text-end">
          <Form.Control
            type="text"
            placeholder="Search users..."
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
        <div className="users-container">
          {filteredUsers.map((user) => (
            <UserCard
              key={user._id}
              user={user}
              onToggleAdmin={toggleAdminHandler}
              onDelete={deleteHandler}
            />
          ))}
        </div>
      )}
    </div>
  );
}
