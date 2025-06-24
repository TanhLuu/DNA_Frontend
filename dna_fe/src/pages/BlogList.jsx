import React, { useState, useEffect } from 'react';
import { getAllBlogs, deleteBlog } from '../api/blogApi';
import { useNavigate } from 'react-router-dom';
import BlogImage from './BlogImage';
import '../styles/bloglist.css';
import Sidebar from '../components/Share/Slidebar';
function BlogList({ role: propRole }) {
  const role = propRole || localStorage.getItem('role')?.toLowerCase();
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchBlogs();
  }, []);

  function fetchBlogs() {
    setLoading(true);
    getAllBlogs()
      .then(data => {
        setBlogs(data);
        setError(null);
      })
      .catch(err => {
        setError('Failed to load blogs. Please try again later.');
      })
      .finally(() => setLoading(false));
  }

  function handleDelete(id, e) {
    e.stopPropagation();
    
    if (window.confirm('Are you sure you want to delete this blog?')) {
      deleteBlog(id)
        .then(() => setBlogs(blogs.filter(blog => blog.blogId !== id)))
        .catch(() => alert('Failed to delete blog. Please try again.'));
    }
  }

  function handleEdit(id, e) {
    e.stopPropagation();
    navigate(`/edit-blog/${id}`);
  }

  function handleBlogClick(id) {
    navigate(`/blog/${id}`);
  }

  function formatDate(dateString) {
    if (!dateString) return 'N/A';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch {
      return dateString;
    }
  }

  const isStaff = role === 'staff';

  // Blog list content component
  const BlogListContent = () => (
    <div className="blog-list-content">
      {isStaff && (
        <div className="blog-list-header">
          <h1 className="blog-list-title">All Blogs</h1>
        </div>
      )}
      
      {isStaff && (
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
      )}
      
      {loading && (
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading blogs...</p>
        </div>
      )}
      
      {error && (
        <div className="error-container">
          {error}
          <button onClick={fetchBlogs} className="retry-button">Try Again</button>
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
          <div 
            key={blog.blogId} 
            className="blog-card"
            onClick={() => handleBlogClick(blog.blogId)}
            style={{ cursor: 'pointer' }}
          >
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
              <h2 className="blog-title">{blog.blogName}</h2>
              <div className="blog-date">{formatDate(blog.blogDate)}</div>
            </div>
            
            {isStaff && (
              <div className="blog-actions">
                <button 
                  onClick={(e) => handleEdit(blog.blogId, e)}
                  className="edit-button"
                >
                  Edit
                </button>
                <button 
                  onClick={(e) => handleDelete(blog.blogId, e)}
                  className="delete-button"
                >
                  Delete
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );

  // Nếu là staff, hiển thị layout với sidebar
  if (isStaff) {
    return (
      <div className="admin-layout">
        <Sidebar />
        <div className="admin-main-content">
          <BlogListContent />
        </div>
      </div>
    );
  }

  // Nếu không phải staff, chỉ hiển thị nội dung blog
  return <div className="blog-list-container"><BlogListContent /></div>;
}

export default BlogList;