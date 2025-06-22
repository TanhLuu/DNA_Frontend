import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getBlogById, deleteBlog } from '../api/blogApi';
import BlogImage from './BlogImage';

const BlogDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [blog, setBlog] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    
    // Loại bỏ định nghĩa fetchBlog bằng useCallback mà không được sử dụng
    
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
            <div style={{ textAlign: 'center', padding: '50px' }}>
                <div style={{
                    border: '4px solid #f3f3f3',
                    borderTop: '4px solid #3498db',
                    borderRadius: '50%',
                    width: '40px',
                    height: '40px',
                    animation: 'spin 2s linear infinite',
                    margin: '0 auto'
                }}></div>
                <p>Loading blog...</p>
                <style>{`
                    @keyframes spin {
                        0% { transform: rotate(0deg); }
                        100% { transform: rotate(360deg); }
                    }
                `}</style>
            </div>
        );
    }

    if (error) {
        return (
            <div style={{
                maxWidth: '800px',
                margin: '40px auto',
                padding: '20px',
                backgroundColor: '#f8d7da',
                color: '#721c24',
                borderRadius: '4px',
                textAlign: 'center'
            }}>
                <h2>Error</h2>
                <p>{error}</p>
                <button
                    onClick={() => navigate('/blogs')}
                    style={{
                        padding: '10px 20px',
                        backgroundColor: '#6c757d',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        marginTop: '15px'
                    }}
                >
                    Back to All Blogs
                </button>
            </div>
        );
    }

    if (!blog) {
        return (
            <div style={{
                maxWidth: '800px',
                margin: '40px auto',
                padding: '20px',
                backgroundColor: '#f8f9fa',
                borderRadius: '4px',
                textAlign: 'center'
            }}>
                <h2>Blog Not Found</h2>
                <p>The blog you're looking for doesn't exist or has been removed.</p>
                <button
                    onClick={() => navigate('/blogs')}
                    style={{
                        padding: '10px 20px',
                        backgroundColor: '#6c757d',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        marginTop: '15px'
                    }}
                >
                    Back to All Blogs
                </button>
            </div>
        );
    }

    // Tạo thời gian hiện tại theo định dạng YYYY-MM-DD HH:MM:SS
    const currentDateTime = new Date().toISOString().replace('T', ' ').substring(0, 19);
    const currentUser = 'trihqse184859'; // Hoặc lấy từ context/state nếu bạn có

    return (
        <div style={{
            maxWidth: '800px',
            margin: '40px auto',
            padding: '20px',
            backgroundColor: '#fff',
            borderRadius: '8px',
            boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
        }}>
            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '20px'
            }}>
                <button
                    onClick={() => navigate('/blogs')}
                    style={{
                        padding: '8px 16px',
                        backgroundColor: '#6c757d',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer'
                    }}
                >
                    ← Back to All Blogs
                </button>

                <div>
                    <button
                        onClick={() => navigate(`/edit-blog/${blog.blogId}`)}
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
                        onClick={handleDelete}
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

            <h1 style={{
                marginBottom: '10px',
                color: '#333'
            }}>
                {blog.blogName}
            </h1>

            <div style={{
                color: '#666',
                marginBottom: '20px',
                fontSize: '0.9rem'
            }}>
                Posted on {formatDate(blog.blogDate)}
            </div>

            {/* Truyền thêm thông tin hiện tại cho BlogImage */}
            {blog.urlImage && (
                <BlogImage 
                    src={blog.urlImage} 
                    alt={blog.blogName} 
                    currentUser={currentUser}
                    currentTime={currentDateTime}
                />
            )}

            <div style={{
                lineHeight: '1.8',
                color: '#333',
                fontSize: '1.1rem',
                whiteSpace: 'pre-wrap',
                marginTop: '20px'
            }}>
                {blog.blogContent}
            </div>
            
            {/* Thông tin người dùng và thời gian */}
            <div style={{ 
                marginTop: '30px', 
                borderTop: '1px solid #eee', 
                paddingTop: '15px',
                color: '#666',
                fontSize: '0.8rem',
                textAlign: 'right'
            }}>
                <p>Current Date and Time (UTC): {currentDateTime}</p>
                <p>User: {currentUser}</p>
            </div>
        </div>
    );
};

export default BlogDetail;