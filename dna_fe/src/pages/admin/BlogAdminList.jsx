import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import '../../styles/auth/BlogPage.css';

const BlogAdminList = () => {
  const [blogs, setBlogs] = useState([]);

  useEffect(() => {
    fetch('http://localhost:8080/api/blogs')
      .then(res => res.json())
      .then(data => setBlogs(data));
  }, []);

  const handleDelete = async (id) => {
    await fetch(`http://localhost:8080/api/blogs/${id}`, { method: 'DELETE' });
    setBlogs(blogs.filter(b => b.blogId !== id));
  };

  return (
    <div style={{ padding: 40 }}>
      <h2>Quản lý blog</h2>
      <Link to="/admin/create">+ Tạo mới</Link>
      {blogs.map(blog => (
        <div key={blog.blogId} style={{ borderBottom: '1px solid #ccc', margin: 10 }}>
          <strong>{blog.title}</strong>
          <Link to={`/admin/edit/${blog.blogId}`}>✏</Link>
          <button onClick={() => handleDelete(blog.blogId)}>🗑</button>
        </div>
      ))}
    </div>
  );
};

export default BlogAdminList;
