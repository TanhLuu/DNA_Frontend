import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getBlogById, updateBlog } from '../api/blogApi';
import '../styles/editblog.css';

function EditBlog() {
  const { id } = useParams();
  const navigate = useNavigate();
  const blogId = id;

  // State for form data
  const [formData, setFormData] = useState({
    blogName: '',
    blogContent: '',
    urlImage: '',
    blogDate: ''
  });

  // State for UI feedback
  const [loading, setLoading] = useState(false);
  const [fetchingBlog, setFetchingBlog] = useState(true);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [errors, setErrors] = useState({});
  const [apiResponse, setApiResponse] = useState(null);

  // Fetch blog data on component mount
  useEffect(() => {
    const fetchBlogData = async () => {
      if (!blogId) {
        setFetchingBlog(false);
        setMessage({
          type: 'error',
          text: 'No blog ID provided'
        });
        return;
      }

      try {
        setFetchingBlog(true);
        const blogData = await getBlogById(blogId);
        
        setFormData({
          blogName: blogData.blogName || '',
          blogContent: blogData.blogContent || '',
          urlImage: blogData.urlImage || '',
          blogDate: blogData.blogDate ? new Date(blogData.blogDate).toISOString().split('T')[0] : new Date().toISOString().split('T')[0]
        });
        
        setMessage({ type: '', text: '' });
      } catch (error) {
        console.error('Error fetching blog:', error);
        setMessage({
          type: 'error',
          text: `Failed to load blog: ${error.message || 'Unknown error'}`
        });
      } finally {
        setFetchingBlog(false);
      }
    };

    fetchBlogData();
  }, [blogId]);

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
      // Prepare blog data
      const blogData = {
        blogName: formData.blogName.trim(),
        blogContent: formData.blogContent.trim(),
        urlImage: formData.urlImage.trim() || null,
        blogDate: formData.blogDate
      };
      
      // Pass blogId and blogData as separate parameters
      const result = await updateBlog(blogId, blogData);
      setApiResponse(result);
      
      setMessage({
        type: 'success',
        text: 'Blog updated successfully!'
      });

      // Navigate after successful update
      setTimeout(() => {
        navigate(`/blog/${blogId}`);
      }, 1500);

    } catch (error) {
      console.error('Error updating blog:', error);
      
      let errorMessage = 'Failed to update blog. Please try again.';
      
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

  // Get current user time
  const currentTime = () => {
    const now = new Date();
    return now.toISOString().replace('T', ' ').substring(0, 19);
  };

  // If still loading blog data, show loading indicator
  if (fetchingBlog) {
    return (
      <div className="loading-container">
        <h2>Loading blog data...</h2>
      </div>
    );
  }

  return (
    <div className="edit-blog-container">
      <div className="edit-blog-header">
        <h2>Edit Blog</h2>
        <p>Editing blog ID: <strong>{blogId}</strong></p>
        <p>Logged in as: <strong>trihqse184859</strong></p>
        <p>Current time: {currentTime()} UTC</p>
      </div>

      {message.text && (
        <div className={`message ${message.type}`}>
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit} className="form-container">
        <div className="form-group">
          <label htmlFor="blogName" className="form-label">
            Blog Name <span className="required">*</span>
          </label>
          <input
            type="text"
            id="blogName"
            name="blogName"
            value={formData.blogName}
            onChange={handleChange}
            placeholder="Enter blog title"
            className={`form-input ${errors.blogName ? 'error' : ''}`}
            maxLength="255"
          />
          {errors.blogName && (
            <span className="error-text">{errors.blogName}</span>
          )}
          <small className="helper-text">
            {formData.blogName.length}/255 characters
          </small>
        </div>

        <div className="form-group">
          <label htmlFor="blogContent" className="form-label">
            Blog Content <span className="required">*</span>
          </label>
          <textarea
            id="blogContent"
            name="blogContent"
            value={formData.blogContent}
            onChange={handleChange}
            placeholder="Write your blog content here..."
            rows="8"
            className={`form-textarea ${errors.blogContent ? 'error' : ''}`}
          />
          {errors.blogContent && (
            <span className="error-text">{errors.blogContent}</span>
          )}
          <small className="helper-text">
            {formData.blogContent.length} characters
          </small>
        </div>

        <div className="form-group">
          <label htmlFor="urlImage" className="form-label">
            Image URL
          </label>
          <input
            type="url"
            id="urlImage"
            name="urlImage"
            value={formData.urlImage}
            onChange={handleChange}
            placeholder="https://example.com/image.jpg"
            className={`form-input ${errors.urlImage ? 'error' : ''}`}
          />
          {errors.urlImage && (
            <span className="error-text">{errors.urlImage}</span>
          )}
          
          {formData.urlImage && isValidUrl(formData.urlImage) && (
            <div className="image-preview">
              <img 
                src={formData.urlImage} 
                alt="Preview" 
                className="preview-image"
                style={{ display: 'none' }}
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

        <div className="form-group">
          <label htmlFor="blogDate" className="form-label">
            Blog Date <span className="required">*</span>
          </label>
          <input
            type="date"
            id="blogDate"
            name="blogDate"
            value={formData.blogDate}
            onChange={handleChange}
            className={`form-input ${errors.blogDate ? 'error' : ''}`}
          />
          {errors.blogDate && (
            <span className="error-text">{errors.blogDate}</span>
          )}
          <small className="helper-text">
            Format: YYYY-MM-DD (Current value: {formData.blogDate})
          </small>
        </div>

        <div className="button-container">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="btn btn-secondary"
            disabled={loading}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="btn btn-primary"
            disabled={loading}
          >
            {loading ? 'Updating...' : 'Update Blog'}
          </button>
        </div>
      </form>

      {apiResponse && (
        <div className="api-response">
          <h3>API Response:</h3>
          <pre className="response-code">
            {JSON.stringify(apiResponse, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}

export default EditBlog;