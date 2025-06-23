import React, { useState, useEffect } from 'react';
import { getAllBlogs, deleteBlog } from '../api/blogApi';
import { useNavigate } from 'react-router-dom';
import BlogImage from './BlogImage';
import '../styles/bloglist.css';

const BlogList = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Fetch blogs khi component mount
  useEffect(() => {
    fetchBlogs();
  }, []);

  // Fetch tất cả blogs từ API
  const fetchBlogs = async () => {
    setLoading(true);
    try {
      const data = await getAllBlogs();
      console.log('Fetched blogs:', data);
      setBlogs(data);
      setError(null);
    } catch (err) {
      console.error('Error fetching blogs:', err);
      setError('Failed to load blogs. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  // Xử lý delete blog
  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this blog?')) {
      try {
        await deleteBlog(id);
        // Cập nhật state sau khi xóa thành công
        setBlogs(blogs.filter(blog => blog.blogId !== id));
      } catch (err) {
        console.error('Error deleting blog:', err);
        alert('Failed to delete blog. Please try again.');
      }
    }
  };

  // Xử lý edit blog
  const handleEdit = (id) => {
    navigate(`/edit-blog/${id}`);
  };

  // Format date để hiển thị
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch (e) {
      console.error('Error formatting date:', e);
      return dateString;
    }
  };

  // Truncate text để hiển thị preview
  const truncateText = (text, maxLength = 150) => {
    if (!text) return '';
    if (text.length <= maxLength) return text;
    return text.substr(0, maxLength) + '...';
  };

  return (
    <div className="blog-list-container">
      <div className="blog-list-header">
        <h1 className="blog-list-title">All Blogs</h1>
      </div>

      <div className="blog-list-actions">
        <button 
          onClick={() => navigate('/create-blog')} 
          className="create-button"
        >
          Create New Blog
        </button>
        
        <button 
          onClick={fetchBlogs}
          className="refresh-button"
        >
          Refresh Blogs
        </button>
      </div>

      {loading && (
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading blogs...</p>
        </div>
      )}

      {error && (
        <div className="error-container">
          {error}
          <button 
            onClick={fetchBlogs}
            className="retry-button"
          >
            Try Again
          </button>
        </div>
      )}

      {!loading && !error && blogs.length === 0 && (
        <div className="empty-container">
          <h3>No blogs found</h3>
          <p>Be the first to create a blog!</p>
        </div>
      )}

      <div className="blog-grid">
        {blogs.map(blog => (
          <div key={blog.blogId} className="blog-card">
            {blog.urlImage && (
              <div className="blog-image-container">
                <BlogImage 
                  src={blog.urlImage}
                  alt={blog.blogName}
                  customStyle={{
                    margin: 0,
                    border: 'none',
                    borderRadius: 0,
                    padding: 0,
                    height: '200px',
                    overflow: 'hidden'
                  }}
                  imageStyle={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    display: 'block'
                  }}
                  hideDetails={true}
                />
              </div>
            )}
            
            <div className="blog-content">
              <h2 className="blog-title">
                {blog.blogName}
              </h2>
              
              <div className="blog-date">
                {formatDate(blog.blogDate)}
              </div>
              
              <p className="blog-excerpt">
                {truncateText(blog.blogContent)}
              </p>
            </div>
            
            <div className="blog-actions">
              <button 
                onClick={() => navigate(`/blog/${blog.blogId}`)}
                className="view-button"
              >
                View
              </button>
              
              <div>
                <button 
                  onClick={() => handleEdit(blog.blogId)}
                  className="edit-button"
                >
                  Edit
                </button>
                
                <button 
                  onClick={() => handleDelete(blog.blogId)}
                  className="delete-button"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BlogList;