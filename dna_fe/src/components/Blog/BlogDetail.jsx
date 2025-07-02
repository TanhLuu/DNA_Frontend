import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import '../../styles/blog/BlogDetail.css';

const BlogDetail = () => {
  const { id } = useParams();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/api/blogs/${id}`);
        setBlog(response.data);
        setLoading(false);
      } catch (err) {
        setError('Lỗi khi tải chi tiết blog!');
        setLoading(false);
      }
    };
    fetchBlog();
  }, [id]);

  if (loading) return <div className="blog-detail-loading">Đang tải...</div>;
  if (error) return <div className="blog-detail-error">{error}</div>;
  if (!blog) return <div className="blog-detail-notfound">Không tìm thấy blog!</div>;

  return (
    <div className='BlogDetail'>
    <div className="blog-detail-container">
      <h1 className="blog-detail-title">{blog.title}</h1>

      <div className="blog-detail-meta">
        <p>Ngày đăng: {blog.blogDate}</p>
      </div>

      <div
        className="blog-detail-content"
        dangerouslySetInnerHTML={{ __html: blog.contentHtml }}
      />
    </div>
    </div>
  );
};

export default BlogDetail;
