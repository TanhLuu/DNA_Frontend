import React, { useState, useEffect } from 'react';
import { getAllBlogs, deleteBlog } from '../api/blogApi';
import { useNavigate } from 'react-router-dom'; // Nếu bạn sử dụng React Router

const BlogList = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentTime, setCurrentTime] = useState('2025-06-22 14:25:01');
  const [currentUser] = useState('trihqse184859');
  const navigate = useNavigate(); // Nếu bạn sử dụng React Router

  // Fetch blogs khi component mount
  useEffect(() => {
    fetchBlogs();
    
    // Cập nhật thời gian hiện tại
    const now = new Date();
    const formattedTime = now.toISOString().replace('T', ' ').substr(0, 19);
    setCurrentTime(formattedTime);
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
    // Chuyển hướng đến trang edit (nếu sử dụng React Router)
    navigate(`/edit-blog/${id}`);
    // Hoặc mở form edit blog
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
    <div style={{
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '20px'
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '20px'
      }}>
        <h1 style={{ margin: 0 }}>All Blogs</h1>
        <div>
          <div style={{ fontSize: '14px', color: '#666' }}>
            Current Date: {currentTime}
          </div>
          <div style={{ fontSize: '14px', color: '#666' }}>
            User: {currentUser}
          </div>
        </div>
      </div>

      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        marginBottom: '20px'
      }}>
        <button 
          onClick={() => navigate('/create-blog')} 
          style={{
            padding: '10px 20px',
            backgroundColor: '#28a745',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Create New Blog
        </button>
        
        <button 
          onClick={fetchBlogs}
          style={{
            padding: '10px 20px',
            backgroundColor: '#17a2b8',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Refresh Blogs
        </button>
      </div>

      {loading && (
        <div style={{ textAlign: 'center', padding: '30px' }}>
          <div style={{ 
            border: '4px solid #f3f3f3',
            borderTop: '4px solid #3498db',
            borderRadius: '50%',
            width: '40px',
            height: '40px',
            animation: 'spin 2s linear infinite',
            margin: '0 auto'
          }}></div>
          <p>Loading blogs...</p>
          <style>{`
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
          `}</style>
        </div>
      )}

      {error && (
        <div style={{
          padding: '15px',
          backgroundColor: '#f8d7da',
          color: '#721c24',
          borderRadius: '4px',
          marginBottom: '20px'
        }}>
          {error}
          <button 
            onClick={fetchBlogs}
            style={{
              marginLeft: '10px',
              padding: '5px 10px',
              backgroundColor: '#dc3545',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Try Again
          </button>
        </div>
      )}

      {!loading && !error && blogs.length === 0 && (
        <div style={{
          padding: '30px',
          textAlign: 'center',
          backgroundColor: '#f8f9fa',
          borderRadius: '4px'
        }}>
          <h3>No blogs found</h3>
          <p>Be the first to create a blog!</p>
        </div>
      )}

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
        gap: '20px'
      }}>
        {blogs.map(blog => (
          <div key={blog.blogId} style={{
            border: '1px solid #ddd',
            borderRadius: '8px',
            overflow: 'hidden',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
            display: 'flex',
            flexDirection: 'column'
          }}>
            {blog.urlImage && (
              <div style={{
                height: '200px',
                overflow: 'hidden',
                position: 'relative'
              }}>
                <img 
                  src={blog.urlImage}
                  alt={blog.blogName}
                  onError={(e) => {
                    e.target.src = 'https://via.placeholder.com/350x200?text=No+Image';
                  }}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover'
                  }}
                />
              </div>
            )}
            
            <div style={{ padding: '15px', flex: 1 }}>
              <h2 style={{ margin: '0 0 10px 0', fontSize: '1.5rem' }}>
                {blog.blogName}
              </h2>
              
              <div style={{ 
                color: '#666', 
                fontSize: '0.9rem',
                marginBottom: '10px'
              }}>
                {formatDate(blog.blogDate)}
              </div>
              
              <p style={{ 
                margin: '10px 0', 
                color: '#333',
                lineHeight: '1.6'
              }}>
                {truncateText(blog.blogContent)}
              </p>
            </div>
            
            <div style={{
              padding: '10px 15px',
              borderTop: '1px solid #eee',
              display: 'flex',
              justifyContent: 'space-between'
            }}>
              <button 
                onClick={() => navigate(`/blog/${blog.blogId}`)}
                style={{
                  padding: '8px 16px',
                  backgroundColor: '#007bff',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                View
              </button>
              
              <div>
                <button 
                  onClick={() => handleEdit(blog.blogId)}
                  style={{
                    padding: '8px 16px',
                    backgroundColor: '#ffc107',
                    color: '#212529',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    marginRight: '10px'
                  }}
                >
                  Edit
                </button>
                
                <button 
                  onClick={() => handleDelete(blog.blogId)}
                  style={{
                    padding: '8px 16px',
                    backgroundColor: '#dc3545',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer'
                  }}
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