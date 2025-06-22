import React, { useState, useEffect } from 'react';
import { createBlog } from '../api/blogApi';
//import './BlogForm.css';

const BlogForm = () => {
  // Luôn sử dụng ngày hiện tại ở định dạng chuẩn
  const getCurrentDate = () => {
    return new Date().toISOString().split('T')[0]; // YYYY-MM-DD
  };

  const [formData, setFormData] = useState({
    blogName: '',
    blogContent: '',
    urlImage: '',
    blogDate: getCurrentDate()
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [errors, setErrors] = useState({});
  const [apiResponse, setApiResponse] = useState(null);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  // Validate form data
  const validateForm = () => {
    const newErrors = {};

    if (!formData.blogName.trim()) {
      newErrors.blogName = 'Blog name is required';
    } else if (formData.blogName.length > 255) {
      newErrors.blogName = 'Blog name must be less than 255 characters';
    }

    if (!formData.blogContent.trim()) {
      newErrors.blogContent = 'Blog content is required';
    }

    if (!formData.blogDate) {
      newErrors.blogDate = 'Blog date is required';
    } else {
      // Validate date format
      const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
      if (!dateRegex.test(formData.blogDate)) {
        newErrors.blogDate = 'Date must be in YYYY-MM-DD format';
      }
    }

    if (formData.urlImage && !isValidUrl(formData.urlImage)) {
      newErrors.urlImage = 'Please enter a valid URL';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Check if URL is valid
  const isValidUrl = (string) => {
    try {
      new URL(string);
      return true;
    } catch (_) {
      return false;
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      setMessage({
        type: 'error',
        text: 'Please fix the errors above'
      });
      return;
    }

    setLoading(true);
    setMessage({ type: '', text: '' });
    setApiResponse(null);

    try {
      const blogData = {
        blogName: formData.blogName.trim(),
        blogContent: formData.blogContent.trim(),
        urlImage: formData.urlImage.trim() || null,
        blogDate: formData.blogDate // Date is already in YYYY-MM-DD format
      };

      console.log('Submitting blog data:', blogData);
      
      const result = await createBlog(blogData);
      
      console.log('API Response:', result);
      setApiResponse(result);
      
      setMessage({
        type: 'success',
        text: `Blog created successfully! ID: ${result.blogId}`
      });

      // Reset form after successful submission
      setFormData({
        blogName: '',
        blogContent: '',
        urlImage: '',
        blogDate: getCurrentDate()
      });

    } catch (error) {
      console.error('Error creating blog:', error);
      
      let errorMessage = 'Failed to create blog. Please try again.';
      
      if (error.response && error.response.data) {
        if (typeof error.response.data === 'string') {
          errorMessage = error.response.data;
        } else if (error.response.data.message) {
          errorMessage = error.response.data.message;
        } else {
          errorMessage = `Server error: ${error.response.status}`;
        }
      } else if (error.message) {
        errorMessage = error.message;
      }

      setMessage({
        type: 'error',
        text: errorMessage
      });
    } finally {
      setLoading(false);
    }
  };

  // Handle reset form
  const handleReset = () => {
    setFormData({
      blogName: '',
      blogContent: '',
      urlImage: '',
      blogDate: getCurrentDate()
    });
    setErrors({});
    setMessage({ type: '', text: '' });
    setApiResponse(null);
  };

  // Get current user time
  const currentTime = () => {
    const now = new Date();
    return now.toISOString().replace('T', ' ').substring(0, 19);
  };

  return (
    <div style={{
      maxWidth: '800px',
      margin: '0 auto',
      padding: '20px',
      backgroundColor: '#fff',
      borderRadius: '8px',
      boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)'
    }}>
      <div style={{
        textAlign: 'center',
        marginBottom: '30px',
        paddingBottom: '20px',
        borderBottom: '1px solid #eee'
      }}>
        <h2 style={{ color: '#333', marginBottom: '10px' }}>Create New Blog</h2>
        <p style={{ color: '#666', fontSize: '14px', margin: '5px 0' }}>
          Logged in as: <strong>trihqse184859</strong>
        </p>
        <p style={{ color: '#666', fontSize: '14px', margin: '5px 0' }}>
          Current time: {currentTime()} UTC
        </p>
      </div>

      {message.text && (
        <div style={{
          padding: '12px',
          borderRadius: '4px',
          marginBottom: '20px',
          fontWeight: '500',
          backgroundColor: message.type === 'success' ? '#d4edda' : '#f8d7da',
          color: message.type === 'success' ? '#155724' : '#721c24',
          border: `1px solid ${message.type === 'success' ? '#c3e6cb' : '#f5c6cb'}`
        }}>
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <label htmlFor="blogName" style={{ fontWeight: '600', marginBottom: '8px', color: '#333' }}>
            Blog Name <span style={{ color: '#dc3545' }}>*</span>
          </label>
          <input
            type="text"
            id="blogName"
            name="blogName"
            value={formData.blogName}
            onChange={handleChange}
            placeholder="Enter blog title"
            style={{
              padding: '12px',
              border: `2px solid ${errors.blogName ? '#dc3545' : '#ddd'}`,
              borderRadius: '4px',
              fontSize: '16px'
            }}
            maxLength="255"
          />
          {errors.blogName && (
            <span style={{ color: '#dc3545', fontSize: '14px', marginTop: '5px' }}>
              {errors.blogName}
            </span>
          )}
          <small style={{ color: '#666', fontSize: '12px', marginTop: '5px', textAlign: 'right' }}>
            {formData.blogName.length}/255 characters
          </small>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <label htmlFor="blogContent" style={{ fontWeight: '600', marginBottom: '8px', color: '#333' }}>
            Blog Content <span style={{ color: '#dc3545' }}>*</span>
          </label>
          <textarea
            id="blogContent"
            name="blogContent"
            value={formData.blogContent}
            onChange={handleChange}
            placeholder="Write your blog content here..."
            rows="8"
            style={{
              padding: '12px',
              border: `2px solid ${errors.blogContent ? '#dc3545' : '#ddd'}`,
              borderRadius: '4px',
              fontSize: '16px',
              fontFamily: 'inherit',
              resize: 'vertical'
            }}
          />
          {errors.blogContent && (
            <span style={{ color: '#dc3545', fontSize: '14px', marginTop: '5px' }}>
              {errors.blogContent}
            </span>
          )}
          <small style={{ color: '#666', fontSize: '12px', marginTop: '5px', textAlign: 'right' }}>
            {formData.blogContent.length} characters
          </small>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <label htmlFor="urlImage" style={{ fontWeight: '600', marginBottom: '8px', color: '#333' }}>
            Image URL
          </label>
          <input
            type="url"
            id="urlImage"
            name="urlImage"
            value={formData.urlImage}
            onChange={handleChange}
            placeholder="https://example.com/image.jpg"
            style={{
              padding: '12px',
              border: `2px solid ${errors.urlImage ? '#dc3545' : '#ddd'}`,
              borderRadius: '4px',
              fontSize: '16px'
            }}
          />
          {errors.urlImage && (
            <span style={{ color: '#dc3545', fontSize: '14px', marginTop: '5px' }}>
              {errors.urlImage}
            </span>
          )}
          
          {formData.urlImage && isValidUrl(formData.urlImage) && (
            <div style={{ marginTop: '10px', textAlign: 'center' }}>
              <img 
                src={formData.urlImage} 
                alt="Preview" 
                style={{ 
                  maxWidth: '100%', 
                  maxHeight: '200px', 
                  borderRadius: '4px', 
                  border: '1px solid #ddd', 
                  display: 'none' 
                }}
                onError={(e) => {
                  e.target.style.display = 'none';
                }}
                onLoad={(e) => {
                  e.target.style.display = 'block';
                }}
              />
            </div>
          )}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <label htmlFor="blogDate" style={{ fontWeight: '600', marginBottom: '8px', color: '#333' }}>
            Blog Date <span style={{ color: '#dc3545' }}>*</span>
          </label>
          <input
            type="date"
            id="blogDate"
            name="blogDate"
            value={formData.blogDate}
            onChange={handleChange}
            style={{
              padding: '12px',
              border: `2px solid ${errors.blogDate ? '#dc3545' : '#ddd'}`,
              borderRadius: '4px',
              fontSize: '16px'
            }}
          />
          {errors.blogDate && (
            <span style={{ color: '#dc3545', fontSize: '14px', marginTop: '5px' }}>
              {errors.blogDate}
            </span>
          )}
          <small style={{ color: '#666', fontSize: '12px', marginTop: '5px' }}>
            Format: YYYY-MM-DD (Current value: {formData.blogDate})
          </small>
        </div>

        <div style={{ 
          display: 'flex', 
          gap: '15px', 
          justifyContent: 'flex-end', 
          marginTop: '30px', 
          paddingTop: '20px', 
          borderTop: '1px solid #eee' 
        }}>
          <button
            type="button"
            onClick={handleReset}
            style={{
              padding: '12px 24px',
              border: 'none',
              borderRadius: '4px',
              fontSize: '16px',
              fontWeight: '600',
              cursor: loading ? 'not-allowed' : 'pointer',
              backgroundColor: '#6c757d',
              color: 'white',
              opacity: loading ? 0.6 : 1,
              minWidth: '120px'
            }}
            disabled={loading}
          >
            Reset
          </button>
          <button
            type="submit"
            style={{
              padding: '12px 24px',
              border: 'none',
              borderRadius: '4px',
              fontSize: '16px',
              fontWeight: '600',
              cursor: loading ? 'not-allowed' : 'pointer',
              backgroundColor: '#007bff',
              color: 'white',
              opacity: loading ? 0.6 : 1,
              minWidth: '120px'
            }}
            disabled={loading}
          >
            {loading ? 'Creating...' : 'Create Blog'}
          </button>
        </div>
      </form>

      {apiResponse && (
        <div style={{
          marginTop: '30px',
          padding: '15px',
          backgroundColor: '#f8f9fa',
          border: '1px solid #ddd',
          borderRadius: '4px'
        }}>
          <h3 style={{ marginTop: 0 }}>API Response:</h3>
          <pre style={{ 
            whiteSpace: 'pre-wrap', 
            backgroundColor: '#eee', 
            padding: '10px', 
            borderRadius: '4px',
            overflow: 'auto'
          }}>
            {JSON.stringify(apiResponse, null, 2)}
          </pre>
        </div>
      )}

      <div style={{
        marginTop: '30px',
        padding: '15px',
        backgroundColor: '#f8f9fa',
        border: '1px solid #ddd',
        borderRadius: '4px'
      }}>
        <h3 style={{ marginTop: 0 }}>Debugging Tips:</h3>
        <ul style={{ paddingLeft: '20px' }}>
          <li>Check browser console (F12) for detailed error messages</li>
          <li>Verify your backend server is running at http://localhost:8080</li>
          <li>Ensure backend has CORS enabled for cross-origin requests</li>
          <li>Validate that Date format matches what your Java backend expects</li>
          <li>If authentication is required, check that token is valid</li>
        </ul>
      </div>
    </div>
  );
};

export default BlogForm;