import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import '../../styles/auth/BlogPage.css';

const EditBlog = () => {
  const { id } = useParams();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [img, setImg] = useState('');
  const [date, setDate] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`http://localhost:8080/api/blogs/${id}`)
      .then(res => res.json())
      .then(data => {
        setTitle(data.title);
        setContent(data.content);
        setImg(data.img || '');
        setDate(data.date); // giữ nguyên ngày cũ
      });
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    await fetch(`http://localhost:8080/api/blogs/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ blogId: id, title, content, img, date })
    });

    navigate('/admin/blogs');
  };

  return (
    <div className="blog-form-container">
      <h2 className="blog-form-title">Chỉnh sửa Blog</h2>
      <form className="blog-form" onSubmit={handleSubmit}>
        <div className="blog-form-group">
          <label>Tiêu đề</label>
          <input className="blog-form-input" value={title} onChange={e => setTitle(e.target.value)} required />
        </div>
        <div className="blog-form-group">
          <label>Ảnh (URL)</label>
          <input className="blog-form-input" value={img} onChange={e => setImg(e.target.value)} />
        </div>
        <div className="blog-form-group">
          <label>Nội dung</label>
          <textarea className="blog-form-textarea" value={content} onChange={e => setContent(e.target.value)} required rows={10} />
        </div>
        <button className="blog-form-submit" type="submit">Lưu thay đổi</button>
      </form>
    </div>
  );
};

export default EditBlog;
