import React, { useState } from 'react';
import { Form, InputGroup, FormControl, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

export default function SearchBox() {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  const submitHandler = (e) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/search?query=${query.trim()}`);
    } else {
      navigate('/search');
    }
  };

  return (
    <Form className="d-flex me-auto" onSubmit={submitHandler}>
      <InputGroup>
        <FormControl
          type="text"
          name="q"
          id="q"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search Products"
          aria-label="Search Products"
        />
        <Button variant="outline-primary" type="submit">
          <i className="fas fa-search"></i>
        </Button>
      </InputGroup>
    </Form>
  );
}
