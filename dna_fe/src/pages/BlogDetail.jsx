import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getBlogById, deleteBlog } from '../api/blogApi';
import BlogImage from './BlogImage';
import '../styles/blogdetail.css';

function BlogDetail() {
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

                // Nếu nội dung blog quá dài mà không có xuống dòng, thêm xuống dòng sau mỗi câu
                if (data && data.blogContent) {
                    // Thêm xuống dòng sau dấu chấm, hỏi, chấm than nếu theo sau là khoảng trắng và chữ cái viết hoa
                    const formattedContent = data.blogContent
                        .replace(/([.!?])\s+([A-Z])/g, "$1\n\n$2");

                    data.blogContent = formattedContent;
                }

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

    function handleDelete() {
        if (window.confirm('Are you sure you want to delete this blog?')) {
            deleteBlog(id)
                .then(() => {
                    navigate('/blogs');
                })
                .catch((err) => {
                    console.error('Error deleting blog:', err);
                    alert('Failed to delete blog. Please try again.');
                });
        }
    }

    // Format date
    function formatDate(dateString) {
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
    }

    // Format content to add paragraph breaks
    function formatContent(content) {
        if (!content) return '';

        // Nếu nội dung không chứa thẻ HTML, xử lý văn bản thường
        if (!/<\/?[a-z][\s\S]*>/i.test(content)) {
            // Tách nội dung thành các đoạn dựa trên ký tự xuống dòng
            const paragraphs = content.split(/\n+/);

            if (paragraphs.length === 1 && paragraphs[0].length > 100) {
                // Nếu chỉ có một đoạn dài, thêm xuống dòng sau các dấu câu
                return content
                    .replace(/([.!?])\s+/g, "$1\n\n")
                    .split(/\n+/)
                    .map((p, index) => <p key={index}>{p}</p>);
            }

            // Tạo các thẻ đoạn văn
            return paragraphs.map((p, index) =>
                <p key={index} className="blog-paragraph">{p}</p>
            );
        }

        // Nếu nội dung có thẻ HTML, trả về như vậy
        return content;
    }

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
                <div className="blog-detail-image-wrapper">
                    <BlogImage
                        src={blog.urlImage}
                        alt=''
                        currentTime={currentDateTime}
                        isDetailView={true} // Thêm prop này để kích hoạt chế độ hiển thị chi tiết
                        hideDetails={true}
                    />
                </div>
            )}

            <div className="blog-content">
                {formatContent(blog.blogContent)}
            </div>
        </div>
    );
}

export default BlogDetail;