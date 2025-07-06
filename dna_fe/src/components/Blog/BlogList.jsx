import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useSearchParams } from 'react-router-dom';
import '../../styles/blog/BlogList.css';

const BlogList = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchParams] = useSearchParams();
  const blogType = searchParams.get('type'); // Lấy giá trị type từ URL

  useEffect(() => {
    const fetchBlogs = async () => {
      setLoading(true);
      setError(null);
      try {
        let url = 'http://localhost:8080/api/blogs';
        if (blogType) {
          url += `?type=${encodeURIComponent(blogType)}`;
        }
        const response = await axios.get(url);
        setBlogs(response.data);
      } catch (err) {
        console.error(err);
        setError('Lỗi khi tải danh sách blog!');
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, [blogType]);

  if (loading) return <div className="blog-list-loading">Đang tải...</div>;
  if (error) return <div className="blog-list-error">{error}</div>;

  return (
    <div className="BlogList">
      <div className="blog-list-container">
        <h1 className="blog-list-title">
          {blogType ? blogType.toUpperCase() : 'TẤT CẢ BÀI VIẾT'}
        </h1>
        {blogs.length === 0 ? (
          <p className="blog-list-empty">Không có bài viết nào thuộc loại: {blogType}</p>
        ) : (
          <div className="blog-list-grid">
            {blogs.map((blog) => (
              <Link key={blog.blogId} to={`/blog/${blog.blogId}`} className="blog-list-card">
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
        )}
      </div>
    </div>
  );
};

export default BlogList;
