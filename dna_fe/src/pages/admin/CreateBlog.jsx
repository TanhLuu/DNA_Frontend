import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../styles/auth/BlogPage.css';

const CreateBlog = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [img, setImg] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const blog = {
      title,
      content,
      img,
      date: new Date().toISOString().split('T')[0] // yyyy-MM-dd
    };

    await fetch('http://localhost:8080/api/blogs', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(blog),
    });

    navigate('/admin/blogs');
  };

  return (
    <div className="blog-form-container">
      <h2 className="blog-form-title">Tạo Blog Mới</h2>
      <form className="blog-form" onSubmit={handleSubmit}>
        <div className="blog-form-group">
          <label>Tiêu đề</label>
          <input
            className="blog-form-input"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        <div className="blog-form-group">
          <label>Ảnh (URL)</label>
          <input
            className="blog-form-input"
            value={img}
            onChange={(e) => setImg(e.target.value)}
          />
        </div>

        <div className="blog-form-group">
          <label>Nội dung</label>
          <textarea
            className="blog-form-textarea"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
            rows={10}
          />
        </div>

        <button className="blog-form-submit" type="submit">
          Tạo blog
        </button>
      </form>
    </div>
  );
};

export default CreateBlog;
