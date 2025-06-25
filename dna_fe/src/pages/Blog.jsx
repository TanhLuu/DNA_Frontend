import React, { useState } from 'react';
import { createBlog } from '../api/blogApi';
import { useNavigate } from 'react-router-dom';
import '../styles/blog.css';

function Blog() {
  const navigate = useNavigate(); // Hook để điều hướng trang

  // Luôn sử dụng ngày hiện tại ở định dạng chuẩn
  function getCurrentDate() {
    return new Date().toISOString().split('T')[0]; // YYYY-MM-DD
  }

  const [formData, setFormData] = useState({
    blogName: '',
    blogContent: '',
    urlImage: '',
    blogDate: getCurrentDate(),
    blogType: '' // Đổi từ typeBlog thành blogType
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [errors, setErrors] = useState({});

  // Danh sách các loại blog để hiển thị trong dropdown
  const blogTypes = [
    { value: 'news', label: 'News' },
    { value: 'technology', label: 'Technology' },
    { value: 'lifestyle', label: 'Lifestyle' },
    { value: 'travel', label: 'Travel' },
    { value: 'food', label: 'Food & Cooking' },
    { value: 'health', label: 'Health & Wellness' },
    { value: 'business', label: 'Business' },
    { value: 'education', label: 'Education' },
    { value: 'entertainment', label: 'Entertainment' },
    { value: 'other', label: 'Other' }
  ];

  // Handle input changes
  function handleChange(e) {
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
  }

  // Validate form data
  function validateForm() {
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

    // Validate blog type
    if (!formData.blogType) {  // Đổi từ typeBlog thành blogType
      newErrors.blogType = 'Please select a blog type';  // Đổi từ typeBlog thành blogType
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  // Check if URL is valid
  function isValidUrl(string) {
    try {
      new URL(string);
      return true;
    } catch (_) {
      return false;
    }
  }

  // Handle form submission
  async function handleSubmit(e) {
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

    try {
      const blogData = {
        blogName: formData.blogName.trim(),
        blogContent: formData.blogContent.trim(),
        urlImage: formData.urlImage.trim() || null,
        blogDate: formData.blogDate, // Date is already in YYYY-MM-DD format
        blogType: formData.blogType // Đổi từ typeBlog thành blogType
      };
      
      console.log('Sending blog data:', blogData);
      
      const result = await createBlog(blogData);
      
      console.log('Blog creation response:', result);
      
      setMessage({
        type: 'success',
        text: `Blog created successfully! ID: ${result.blogId}`
      });

      // Reset form after successful submission
      setFormData({
        blogName: '',
        blogContent: '',
        urlImage: '',
        blogDate: getCurrentDate(),
        blogType: ''  // Đổi từ typeBlog thành blogType
      });

      // Chuyển hướng về trang BlogList sau khi tạo thành công
      setTimeout(() => {
        navigate('/blogs'); // Thay đổi đường dẫn này nếu route của BlogList khác
      }, 1500); // Đợi 1.5 giây để người dùng thấy thông báo thành công

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
  }

  // Handle reset form
  function handleReset() {
    setFormData({
      blogName: '',
      blogContent: '',
      urlImage: '',
      blogDate: getCurrentDate(),
      blogType: ''  // Đổi từ typeBlog thành blogType
    });
    setErrors({});
    setMessage({ type: '', text: '' });
  }

  // Get current user time
  function currentTime() {
    return '2025-06-25 09:17:01'; // Lấy thời gian từ thông tin bạn cung cấp
  }

  return (
    <div className="blog-form-container">
      <div className="form-header">
        <h2>Create New Blog</h2>
        <p>Current time: {currentTime()} UTC</p>
        <p>User: trihqse184859</p>
      </div>

      {message.text && (
        <div className={`form-message ${message.type}`}>
          {message.text}
          {message.type === 'success' && (
            <div className="redirect-message">Redirecting to blogs list...</div>
          )}
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
            <span className="form-error">{errors.blogName}</span>
          )}
          <small className="form-helper">
            {formData.blogName.length}/255 characters
          </small>
        </div>

        {/* Blog Type dropdown - đổi từ typeBlog thành blogType */}
        <div className="form-group">
          <label htmlFor="blogType" className="form-label">
            Blog Type <span className="required">*</span>
          </label>
          <select
            id="blogType"
            name="blogType"
            value={formData.blogType}
            onChange={handleChange}
            className={`form-select ${errors.blogType ? 'error' : ''}`}
          >
            <option value="">-- Select Blog Type --</option>
            {blogTypes.map(type => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
          {errors.blogType && (
            <span className="form-error">{errors.blogType}</span>
          )}
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
            <span className="form-error">{errors.blogContent}</span>
          )}
          <small className="form-helper">
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
            <span className="form-error">{errors.urlImage}</span>
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
            <span className="form-error">{errors.blogDate}</span>
          )}
          <small className="form-helper">
            Format: YYYY-MM-DD (Current value: {formData.blogDate})
          </small>
        </div>

        <div className="form-actions">
          <button
            type="button"
            onClick={handleReset}
            className="btn btn-secondary"
            disabled={loading}
          >
            Reset
          </button>
          <button
            type="submit"
            className="btn btn-primary"
            disabled={loading}
          >
            {loading ? 'Creating...' : 'Create Blog'}
          </button>
        </div>
      </form>

      <div className="form-footer">
        <button
          onClick={() => navigate('/blogs')}
          className="btn btn-link"
          type="button"
        >
          ← Back to All Blogs
        </button>
      </div>
    </div>
  );
}

export default Blog;