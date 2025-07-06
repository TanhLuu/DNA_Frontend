import React, { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import Quill from 'quill';
import 'quill/dist/quill.snow.css';
import ImageResize from 'quill-image-resize-module-react';
import axios from 'axios';
import '../../styles/blog/BlogEditor.css';

Quill.register('modules/imageResize', ImageResize);

const BlogEditor = () => {
  const { blogId } = useParams();
  const quillRef = useRef(null);
  const quillInstance = useRef(null);
  const [title, setTitle] = useState('');
  const [blogType, setBlogType] = useState('Tin tức');
  const [blogDate, setBlogDate] = useState(new Date().toISOString().split('T')[0]);
  const [previewContent, setPreviewContent] = useState('');
  const [previewTitleImage, setPreviewTitleImage] = useState('');

  useEffect(() => {
    console.log('Initializing Quill with blogId:', blogId);
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
      formats: ['size', 'bold', 'italic', 'underline', 'strike', 'color', 'align', 'image'],
    });

    const handleSizeChange = (value) => {
      quillInstance.current.format('size', value);
    };
    const sizeSelect = document.querySelector('.ql-size');
    if (sizeSelect) {
      sizeSelect.addEventListener('change', (e) => handleSizeChange(e.target.value));
    }

    quillInstance.current.getModule('toolbar').addHandler('color', (value) => {
      quillInstance.current.format('color', value);
    });

    return () => {
      if (quillInstance.current) {
        quillInstance.current.root.innerHTML = '';
      }
      if (sizeSelect) {
        sizeSelect.removeEventListener('change', handleSizeChange);
      }
    };
  }, []);

  useEffect(() => {
    if (blogId && quillInstance.current) {
      console.log('Fetching blog with ID:', blogId);
      axios
        .get(`http://localhost:8080/api/blogs/${blogId}`)
        .then((response) => {
          console.log('Blog data:', response.data);
          const blog = response.data;
          setTitle(blog.title || '');
          setBlogType(blog.blogType || 'Tin tức');
          setBlogDate(blog.blogDate || new Date().toISOString().split('T')[0]);
          setPreviewTitleImage(blog.titleImageBase64 || '');
          setPreviewContent(blog.contentHtml || '');
          quillInstance.current.root.innerHTML = blog.contentHtml || '';
        })
        .catch((error) => {
          console.error('Error fetching blog:', error);
          alert('Lỗi khi tải dữ liệu blog!');
        });
    }
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
        const base64 = await toBase64(file

);
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

  console.log('Rendering BlogEditor with title:', title, 'blogType:', blogType, 'blogDate:', blogDate);
  return (
    <div className="blog-editor-container max-w-4xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">✍️ Thêm/Sửa bài viết</h2>
      <input
        type="text"
        placeholder="Blog Title..."
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="w-full p-2 mb-4 border rounded"
      />
      <label className="block mb-2">Loại bài viết:</label>
      <select
        value={blogType}
        onChange={(e) => setBlogType(e.target.value)}
        className="w-full p-2 mb-4 border rounded"
      >
        <option value="Tin tức">Tin tức</option>
        <option value="Hướng dẫn">Hướng dẫn</option>
        <option value="Dịch vụ">Dịch vụ</option>
      </select>
      <label className="block mb-2">Ngày đăng:</label>
      <input
        type="date"
        value={blogDate}
        onChange={(e) => setBlogDate(e.target.value)}
        className="w-full p-2 mb-4 border rounded"
        readOnly
      />
      <label className="block mb-2">Ảnh tiêu đề:</label>
      {previewTitleImage && (
        <img src={previewTitleImage} alt="title image" className="w-32 h-32 object-cover mb-2" />
      )}
      <input type="file" id="titleImageInput" className="mb-4" />
      <div id="toolbar" className="mb-4">
        <span className="ql-formats">
          <select className="ql-size">
            <option value="normal" defaultValue>Bình thường</option>
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
      <label className="block mb-2">Chèn nhiều ảnh nội dung:</label>
      <input type="file" id="uploadImages" multiple className="mb-4" />
      <button
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-2"
        onClick={insertImages}
      >
        Chèn ảnh
      </button>
      <button
        className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
        onClick={saveBlog}
      >
        Lưu Blog
      </button>
      <div className="mt-6">
        <h2 className="text-xl font-semibold mb-2">{title}</h2>
        {previewTitleImage && (
          <img src={previewTitleImage} alt="title image" className="w-full h-48 object-cover rounded mb-4" />
        )}
        <div className="ql-snow">
          <div className="ql-editor" dangerouslySetInnerHTML={{ __html: previewContent }} />
        </div>
      </div>
    </div>
  );
};

export default BlogEditor;