import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import '../../styles/blog/BlogList.css';

const BlogList = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await axios.get('http://localhost:8080/api/blogs');
        setBlogs(response.data);
        setLoading(false);
      } catch (err) {
        setError('Lỗi khi tải danh sách blog!');
        setLoading(false);
      }
    };
    fetchBlogs();
  }, []);

  if (loading) {
    return <div className="blog-list-loading">Đang tải...</div>;
  }

  if (error) {
    return <div className="blog-list-error">{error}</div>;
  }

  return (
    <div className='BlogList'>
    <div className="blog-list-container">
      <h1 className="blog-list-title">TIN TỨC</h1>
      <div className="blog-list-grid">
        {blogs.map((blog) => (
          <Link
            key={blog.id}
            to={`/blog/${blog.id}`}
            className="blog-list-card"
          >
            {blog.titleImageBase64 && (
              <img
                src={blog.titleImageBase64}
                alt={blog.title}
                className="blog-list-card-image"
              />
            )}
            <div className="blog-list-card-content">
              <h2 className="blog-list-card-title">{blog.title}</h2>
              <p className="blog-list-card-meta">Ngày đăng: {blog.blogDate}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
    </div>
  );
};

export default BlogList;
