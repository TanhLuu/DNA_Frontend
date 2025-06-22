import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import '../../styles/auth/BlogPage.css';

const BlogDetail = () => {
  const { id } = useParams();
  const [blog, setBlog] = useState(null);

  useEffect(() => {
    fetch(`http://localhost:8080/api/blogs/${id}`)
      .then(res => {
        if (!res.ok) throw new Error('Không tìm thấy blog');
        return res.json();
      })
      .then(data => setBlog(data))
      .catch(err => {
        setBlog(null);
        console.error("Lỗi khi fetch blog:", err);
      });
  }, [id]);

  if (!blog) return <div style={{ padding: 40 }}>Không tìm thấy bài viết.</div>;

  return (
    <div className="container" style={{ maxWidth: 800, margin: 'auto', padding: 40 }}>
      <Link to="/blog" style={{ display: 'inline-block', marginBottom: 16 }}>← Quay lại danh sách</Link>
      <h1>{blog.title}</h1>
      {blog.blogImg && (
        <img
          src={blog.blogImg}
          alt={blog.title}
          style={{ width: '100%', maxHeight: 350, objectFit: 'cover', borderRadius: 10, marginBottom: 20 }}
        />
      )}
      <div style={{ color: '#888', marginBottom: 16 }}>
        {blog.blogDate && (new Date(blog.blogDate)).toLocaleDateString('vi-VN')}
      </div>
      <div className="markdown-content">
        <ReactMarkdown>{blog.content}</ReactMarkdown>
      </div>
    </div>
  );
};

export default BlogDetail;
