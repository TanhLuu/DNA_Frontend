import { useState, useEffect } from 'react';
import { fetchBlogs, fetchBlogById, saveBlog, deleteBlog } from '../api/blogApi';

export const useBlogManagement = () => {
  const [blogs, setBlogs] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingBlogId, setEditingBlogId] = useState(null);
  const [title, setTitle] = useState('');
  const [blogType, setBlogType] = useState('Tin tức');
  const [headerImage, setHeaderImage] = useState(null);
  const [contentSections, setContentSections] = useState([{ content: '', image: null }]);
  const [error, setError] = useState('');
  const [filterType, setFilterType] = useState('');

  // Chuyển file ảnh thành base64
  const toBase64 = (file) => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result.split(',')[1]);
    reader.onerror = error => reject(error);
  });

  // Lấy danh sách blog
  useEffect(() => {
    const loadBlogs = async () => {
      try {
        const data = await fetchBlogs(filterType);
        setBlogs(data);
      } catch (error) {
        setError(error.message);
      }
    };
    loadBlogs();
  }, [filterType]);

  // Mở modal tạo blog
  const openCreateModal = () => {
    setIsEditing(false);
    setEditingBlogId(null);
    setTitle('');
    setBlogType('Tin tức');
    setHeaderImage(null);
    setContentSections([{ content: '', image: null }]);
    setError('');
    setShowModal(true);
  };

  // Mở modal chỉnh sửa blog
  const openEditModal = async (blogId) => {
    try {
      const blog = await fetchBlogById(blogId);
      setTitle(blog.blogName);
      setBlogType(blog.blogType || 'Tin tức');
      setHeaderImage(blog.imgDetailBase64 ? `data:image/jpeg;base64,${blog.imgDetailBase64}` : null);
      setError('');

      let content = blog.content || '';
      let sections = [];
      let currentContent = '';
      let imageIndex = 0;

      const parser = new DOMParser();
      const doc = parser.parseFromString(`<div>${content}</div>`, 'text/html');
      const nodes = doc.querySelector('div').childNodes;
      nodes.forEach((node) => {
        if (node.nodeName === 'P') {
          if (currentContent) {
            sections.push({ content: currentContent, image: null });
            currentContent = '';
          }
          currentContent = node.textContent;
        } else if (node.nodeName === 'IMG') {
          sections.push({ content: currentContent, image: null });
          currentContent = '';
          sections.push({ content: '', image: blog.imagesBase64[imageIndex] ? `data:image/jpeg;base64,${blog.imagesBase64[imageIndex]}` : null });
          imageIndex++;
        }
      });
      if (currentContent) {
        sections.push({ content: currentContent, image: null });
      }

      setContentSections(sections.length ? sections : [{ content: '', image: null }]);
      setEditingBlogId(blogId);
      setIsEditing(true);
      setShowModal(true);
    } catch (error) {
      setError(error.message);
    }
  };

  // Đóng modal
  const closeModal = () => {
    setShowModal(false);
  };

  // Thêm section nội dung
  const addContentSection = () => {
    setContentSections([...contentSections, { content: '', image: null }]);
  };

  // Cập nhật section nội dung
  const updateContentSection = (index, field, value) => {
    const updatedSections = [...contentSections];
    updatedSections[index][field] = value;
    setContentSections(updatedSections);
  };

  // Xóa section nội dung
  const deleteContentSection = (index) => {
    const updatedSections = contentSections.filter((_, i) => i !== index);
    setContentSections(updatedSections.length ? updatedSections : [{ content: '', image: null }]);
  };

  // Xóa ảnh tiêu đề
  const deleteHeaderImage = () => {
    setHeaderImage(null);
  };

  // Lưu blog
  const handleSaveBlog = async () => {
    setError('');
    let content = '';
    let imagesBase64 = [];
    let hasContent = false;

    let headerImageBase64 = '';
    if (headerImage) {
      try {
        if (typeof headerImage === 'string' && headerImage.startsWith('data:image')) {
          headerImageBase64 = headerImage.split(',')[1];
        } else if (headerImage instanceof File) {
          headerImageBase64 = await toBase64(headerImage);
        }
      } catch (error) {
        setError(`Lỗi khi xử lý ảnh tiêu đề: ${error.message}`);
        return;
      }
    }

    for (let i = 0; i < contentSections.length; i++) {
      const section = contentSections[i];
      if (section.content) {
        content += `<p>${section.content}</p>`;
        hasContent = true;
      }
      if (section.image) {
        try {
          if (typeof section.image === 'string' && section.image.startsWith('data:image')) {
            imagesBase64.push(section.image.split(',')[1]);
            content += `<img src="{${imagesBase64.length - 1}}" />`;
          } else if (section.image instanceof File) {
            const imageBase64 = await toBase64(section.image);
            imagesBase64.push(imageBase64);
            content += `<img src="{${imagesBase64.length - 1}}" />`;
          }
        } catch (error) {
          setError(`Lỗi khi xử lý ảnh ${i + 1}: ${error.message}`);
          return;
        }
      }
    }

    if (!title || !hasContent) {
      setError('Vui lòng nhập tiêu đề và ít nhất một đoạn nội dung!');
      return;
    }

    const blogData = {
      blogName: title,
      content: content,
      imgDetailBase64: headerImageBase64,
      imagesBase64: imagesBase64,
      blogType: blogType,
      blogDate: new Date().toISOString().split('T')[0],
    };

    try {
      await saveBlog(blogData, isEditing, editingBlogId);
      closeModal();
      const data = await fetchBlogs(filterType);
      setBlogs(data);
    } catch (error) {
      setError(error.message);
    }
  };

  // Xóa blog
  const handleDeleteBlog = async (blogId) => {
    if (!window.confirm('Bạn có chắc muốn xóa bài blog này?')) return;
    try {
      await deleteBlog(blogId);
      const data = await fetchBlogs(filterType);
      setBlogs(data);
    } catch (error) {
      setError(error.message);
    }
  };

  return {
    blogs,
    showModal,
    isEditing,
    editingBlogId,
    title,
    blogType,
    headerImage,
    contentSections,
    error,
    filterType,
    setTitle,
    setBlogType,
    setHeaderImage,
    setContentSections,
    setFilterType,
    openCreateModal,
    openEditModal,
    closeModal,
    addContentSection,
    updateContentSection,
    deleteContentSection,
    deleteHeaderImage,
    handleSaveBlog,
    handleDeleteBlog,
  };
};