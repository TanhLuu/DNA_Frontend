import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getBlogById, deleteBlog } from '../api/blogApi';
import '../styles/deleteblog.css';

function DeleteBlog() {
  const { id } = useParams();
  const navigate = useNavigate();
  const blogId = id;

  // State variables
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  // Fetch blog data when component mounts
  useEffect(() => {
    const fetchBlogData = async () => {
      try {
        setLoading(true);
        const data = await getBlogById(blogId);
        setBlog(data);
        setError(null);
      } catch (err) {
        console.error('Error fetching blog:', err);
        setError('Could not load blog details. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchBlogData();
  }, [blogId]);

  // Handle blog deletion
  const handleDelete = async () => {
    try {
      setDeleting(true);
      await deleteBlog(blogId);
      setSuccess(true);
      setError(null);
      
      // Redirect after a delay to show the success message
      setTimeout(() => {
        navigate('/blogs');
      }, 2000);
    } catch (err) {
      console.error('Error deleting blog:', err);
      setError('Failed to delete blog. Please try again later.');
      setSuccess(false);
    } finally {
      setDeleting(false);
    }
  };

  // Get current date and time
  const currentTime = () => {
    const now = new Date();
    return now.toISOString().replace('T', ' ').substring(0, 19);
  };
  
  // Show loading state
  if (loading) {
    return (
      <div className="delete-blog-container loading-container">
        <h2>Loading blog details...</h2>
      </div>
    );
  }

  // Show error state
  if (error && !blog) {
    return (
      <div className="delete-blog-container">
        <div className="error-container">
          <h3>Error</h3>
          <p>{error}</p>
        </div>
        <div className="center">
          <button 
            onClick={() => navigate('/blogs')}
            className="back-button"
          >
            Back to Blogs
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="delete-blog-container">
      <div className="delete-blog-header">
        <h2>Delete Blog</h2>
        <p>
          Blog ID: <strong>{blogId}</strong>
        </p>
        <p>
          Logged in as: <strong>trihqse184859</strong>
        </p>
        <p>
          Current time: {currentTime()} UTC
        </p>
      </div>

      {success ? (
        <div className="success-message">
          <h3>Blog Deleted Successfully!</h3>
          <p>Redirecting to blog list...</p>
        </div>
      ) : (
        <>
          {error && (
            <div className="error-message">
              <p>{error}</p>
            </div>
          )}

          <div className="warning-container">
            <h3>Warning</h3>
            <p>You are about to delete the following blog:</p>
            <div className="blog-preview">
              <h4>{blog?.blogName}</h4>
              <p className="blog-preview-date">
                Date: {new Date(blog?.blogDate).toLocaleDateString()}
              </p>
              <div className="blog-preview-content">
                <p>
                  {blog?.blogContent.length > 150 
                    ? blog?.blogContent.substring(0, 150) + '...' 
                    : blog?.blogContent}
                </p>
                {blog?.blogContent.length > 150 && (
                  <div className="content-fade"></div>
                )}
              </div>
            </div>
            <p className="warning-text">
              This action cannot be undone!
            </p>
          </div>

          <div className="button-container">
            <button
              onClick={() => navigate(-1)}
              className="btn btn-secondary"
              disabled={deleting}
            >
              Cancel
            </button>
            <button
              onClick={handleDelete}
              className="btn btn-danger"
              disabled={deleting}
            >
              {deleting ? 'Deleting...' : 'Confirm Delete'}
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default DeleteBlog;