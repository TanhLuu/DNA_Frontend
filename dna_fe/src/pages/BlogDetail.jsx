import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getBlogById, deleteBlog } from '../api/blogApi';
import BlogImage from './BlogImage';
import '../styles/blogdetail.css';

const BlogDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [blog, setBlog] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    
    useEffect(() => {
        const fetchBlog = async () => {
            setLoading(true);
            try {
                const data = await getBlogById(id);
                setBlog(data);
                setError(null);
            } catch (err) {
                console.error('Error fetching blog:', err);
                setError('Failed to load blog. It may have been deleted or does not exist.');
            } finally {
                setLoading(false);
            }
        };

        fetchBlog();
    }, [id]);

    const handleDelete = async () => {
        if (window.confirm('Are you sure you want to delete this blog?')) {
            try {
                await deleteBlog(id);
                navigate('/blogs');
            } catch (err) {
                console.error('Error deleting blog:', err);
                alert('Failed to delete blog. Please try again.');
            }
        }
    };

    // Format date
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
            return dateString;
        }
    };

    if (loading) {
        return (
            <div className="loading-container">
                <div className="loading-spinner"></div>
                <p>Loading blog...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="error-container">
                <h2>Error</h2>
                <p>{error}</p>
                <button
                    onClick={() => navigate('/blogs')}
                    className="back-button"
                >
                    Back to All Blogs
                </button>
            </div>
        );
    }

    if (!blog) {
        return (
            <div className="not-found-container">
                <h2>Blog Not Found</h2>
                <p>The blog you're looking for doesn't exist or has been removed.</p>
                <button
                    onClick={() => navigate('/blogs')}
                    className="back-button"
                >
                    Back to All Blogs
                </button>
            </div>
        );
    }

    // Tạo thời gian hiện tại theo định dạng YYYY-MM-DD HH:MM:SS
    const currentDateTime = new Date().toISOString().replace('T', ' ').substring(0, 19);

    return (
        <div className="blog-detail-container">
            <div className="blog-detail-header">
                <button
                    onClick={() => navigate('/blogs')}
                    className="back-button"
                >
                    ← Back to All Blogs
                </button>

                <div className="blog-detail-actions">
                    <button
                        onClick={() => navigate(`/edit-blog/${blog.blogId}`)}
                        className="edit-button"
                    >
                        Edit
                    </button>

                    <button
                        onClick={handleDelete}
                        className="delete-button"
                    >
                        Delete
                    </button>
                </div>
            </div>

            <h1 className="blog-title">
                {blog.blogName}
            </h1>

            <div className="blog-date">
                Posted on {formatDate(blog.blogDate)}
            </div>

            {blog.urlImage && (
                <BlogImage 
                    src={blog.urlImage}
                    alt={blog.blogName}
                    currentTime={currentDateTime}
                />
            )}

            <div className="blog-content">
                {blog.blogContent}
            </div>
            
          
        </div>
    );
};

export default BlogDetail;