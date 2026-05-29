import React, { useState } from 'react';
import { Form, InputGroup, FormControl, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

export default function SearchBox() {
  const [query, setQuery] = useState('');
  const [image, setImage] = useState(null);
  const [showImageSearch, setShowImageSearch] = useState(false);
  const navigate = useNavigate();

  const submitHandler = (e) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/search?query=${query.trim()}`);
    } else {
      navigate('/search');
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result;
        navigate(`/search?image=${encodeURIComponent(base64String)}`);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="d-flex me-auto align-items-center">
      <Form className="d-flex" onSubmit={submitHandler}>
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
      <Button
        variant="outline-secondary"
        className="ms-2"
        onClick={() => setShowImageSearch(!showImageSearch)}
        title="Search by Image"
      >
        <i className="fas fa-camera"></i>
      </Button>
      {showImageSearch && (
        <div className="ms-2">
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            style={{ display: 'none' }}
            id="imageSearchInput"
          />
          <label htmlFor="imageSearchInput" className="btn btn-outline-primary">
            <i className="fas fa-upload"></i> Upload Image
          </label>
        </div>
      )}
    </div>
  );
}
