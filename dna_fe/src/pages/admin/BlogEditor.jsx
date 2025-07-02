import React, { useEffect, useRef, useState } from 'react';
import Quill from 'quill';
import 'quill/dist/quill.snow.css';
import ImageResize from 'quill-image-resize-module-react';
import axios from 'axios';
import '../../styles/blog/BlogEditor.css';

Quill.register('modules/imageResize', ImageResize);

const BlogEditor = ({ blogId }) => {
  const quillRef = useRef(null);
  const quillInstance = useRef(null);
  const [title, setTitle] = useState('');
  const [blogType, setBlogType] = useState('Tin tức');
  const [blogDate, setBlogDate] = useState(new Date().toISOString().split('T')[0]);
  const [previewContent, setPreviewContent] = useState('');
  const [previewTitleImage, setPreviewTitleImage] = useState('');

  useEffect(() => {
    const handleSizeChange = (value) => {
      const quill = quillInstance.current;
      quill.format('size', value);
    };

    // Thêm sự kiện cho select cỡ chữ
    document.querySelector('.ql-size').addEventListener('change', (e) => {
      handleSizeChange(e.target.value);
    });

    // Danh sách màu tùy chỉnh
    const colors = ['#000000', '#e60000', '#ff9900', '#ffff00', '#008a00', '#0066cc', '#9933ff', '#ffffff'];

    // Khởi tạo Quill
    quillInstance.current = new Quill(quillRef.current, {
      theme: 'snow',
      modules: {
        toolbar: {
          container: '#toolbar',
          handlers: {
            image: function () {
              const quill = quillInstance.current;
              quill.focus();
              let range = quill.getSelection();
              if (!range) {
                quill.setSelection(0);
                range = quill.getSelection();
              }

              const input = document.createElement('input');
              input.setAttribute('type', 'file');
              input.setAttribute('accept', 'image/*');
              input.click();

              input.onchange = async () => {
                const file = input.files[0];
                if (file) {
                  try {
                    const base64 = await toBase64(file);
                    quill.insertEmbed(range.index, 'image', base64);
                    quill.setSelection(range.index + 1);
                  } catch (error) {
                    console.error('Lỗi khi chèn ảnh:', error);
                    alert('Lỗi khi chèn ảnh!');
                  }
                } else {
                  alert('Vui lòng chọn một ảnh!');
                }
              };
            },
          },
        },
        imageResize: {
          parchment: Quill.import('parchment'),
          modules: ['Resize', 'DisplaySize'],
        },
      },
      formats: [
        'size', 'bold', 'italic', 'underline', 'strike',
        'color', 'align', 'image'
      ],
    });

    // Thêm cấu hình màu chữ vào Quill
    quillInstance.current.getModule('toolbar').addHandler('color', (value) => {
      quillInstance.current.format('color', value);
    });

    if (blogId) {
      axios
        .get(`http://localhost:8080/api/blogs/${blogId}`)
        .then((response) => {
          const blog = response.data;
          setTitle(blog.title);
          setBlogType(blog.blogType);
          setBlogDate(blog.blogDate);
          setPreviewTitleImage(blog.titleImageBase64);
          quillInstance.current.root.innerHTML = blog.contentHtml;
        })
        .catch((error) => console.error('Lỗi khi lấy dữ liệu blog:', error));
    }

    return () => (quillInstance.current.root.innerHTML = '');
  }, [blogId]);

  const toBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });

  const insertImages = async () => {
    const files = document.getElementById('uploadImages').files;
    if (!files || files.length === 0) {
      alert('Vui lòng chọn ít nhất một ảnh để chèn!');
      return;
    }

    const quill = quillInstance.current;
    quill.focus();
    let range = quill.getSelection();
    if (!range) {
      quill.setSelection(0);
      range = quill.getSelection();
    }

    for (let file of files) {
      try {
        const base64 = await toBase64(file);
        quill.insertEmbed(range.index, 'image', base64);
        quill.setSelection(range.index + 1);
        range = quill.getSelection();
      } catch (error) {
        console.error('Lỗi khi chèn ảnh:', error);
        alert('Lỗi khi chèn ảnh!');
      }
    }
  };

  const saveBlog = async () => {
    const quill = quillInstance.current;
    const content = quill.root.innerHTML;
    const titleImageFile = document.getElementById('titleImageInput').files[0];
    const titleImageBase64 = titleImageFile ? await toBase64(titleImageFile) : previewTitleImage;

    const blogData = {
      title,
      contentHtml: content,
      titleImageBase64,
      blogType,
      blogDate,
    };

    try {
      let response;
      if (blogId) {
        response = await axios.put(`http://localhost:8080/api/blogs/${blogId}`, blogData);
      } else {
        response = await axios.post('http://localhost:8080/api/blogs', blogData);
      }
      setPreviewContent(content);
      setPreviewTitleImage(titleImageBase64);
      alert(blogId ? 'Cập nhật blog thành công!' : 'Tạo blog thành công!');
    } catch (error) {
      console.error('Lỗi khi lưu blog:', error);
      alert('Lỗi khi lưu blog!');
    }
  };

  return (
    <div className="blog-editor-container">
      <h2>✍️ Blog Editor - Full Features</h2>
      <input
        type="text"
        placeholder="Blog Title..."
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <label>Loại bài viết:</label>
      <select
        value={blogType}
        onChange={(e) => setBlogType(e.target.value)}
      >
        <option value="Tin tức">Tin tức</option>
        <option value="Hướng dẫn">Hướng dẫn</option>
      </select>
      <label>Ngày đăng:</label>
      <input
        type="date"
        value={blogDate}
        onChange={(e) => setBlogDate(e.target.value)}
        readOnly
      />
      <label>Ảnh tiêu đề:</label>
      <input type="file" id="titleImageInput" />
      <div id="toolbar">
        <span className="ql-formats">
          <select className="ql-size">
            <option value="normal" selected>Bình thường</option>
            <option value="large">Lớn</option>
            <option value="huge">Rất lớn</option>
          </select>
        </span>
        <span className="ql-formats">
          <button className="ql-bold"></button>
          <button className="ql-italic"></button>
          <button className="ql-underline"></button>
          <button className="ql-strike"></button>
        </span>
        <span className="ql-formats">
          <select className="ql-color">
            <option value="#000000"></option>
            <option value="#e60000"></option>
            <option value="#ff9900"></option>
            <option value="#ffff00"></option>
            <option value="#008a00"></option>
            <option value="#0066cc"></option>
            <option value="#9933ff"></option>
            <option value="#ffffff"></option>
          </select>
        </span>
        <span className="ql-formats">
          <button className="ql-align" value=""></button>
          <button className="ql-align" value="center"></button>
          <button className="ql-align" value="right"></button>
        </span>
        <span className="ql-formats">
          <button className="ql-image"></button>
        </span>
      </div>

      <div
        ref={quillRef}
        style={{ height: '400px', backgroundColor: 'white', marginBottom: '20px' }}
      ></div>
      <label>Chèn nhiều ảnh nội dung:</label>
      <input type="file" id="uploadImages" multiple />
      <button className="btn" onClick={insertImages}>
        Chèn ảnh
      </button>
      <button className="btn" onClick={saveBlog}>
        Lưu Blog
      </button>
      <div>
        <h2>{title}</h2>
        {previewTitleImage && <img src={previewTitleImage} alt="title image" />}
        <div className="ql-snow">
          <div className="ql-editor" dangerouslySetInnerHTML={{ __html: previewContent }} />
        </div>
      </div>
    </div>
  );
};

export default BlogEditor;