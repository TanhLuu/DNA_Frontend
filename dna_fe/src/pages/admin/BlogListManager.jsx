import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import 'tailwindcss/tailwind.css';

const BlogListManager = () => {
  const [blogs, setBlogs] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      const response = await axios.get('http://localhost:8080/api/blogs');
      setBlogs(response.data);
    } catch (error) {
      console.error('Error fetching blogs:', error);
      alert('Failed to load blogs!');
    }
  };

  const handleAddBlog = () => {
    navigate('/blog-editor');
  };

  const handleEditBlog = (blogId) => {
    navigate(`/blog-editor/${blogId}`);
  };

  const handleDeleteBlog = async (blogId) => {
    if (window.confirm('Are you sure you want to delete this blog?')) {
      try {
        await axios.delete(`http://localhost:8080/api/blogs/${blogId}`);
        setBlogs(blogs.filter(blog => blog.id !== blogId));
        alert('Blog deleted successfully!');
      } catch (error) {
        console.error('Error deleting blog:', error);
        alert('Failed to delete blog!');
      }
    }
  };
  const handleToggleActive = async (blogId) => {
  try {
    await axios.put(`http://localhost:8080/api/blogs/${blogId}/toggle-active`);
    fetchBlogs(); // Cập nhật lại danh sách blog
  } catch (error) {
    console.error('Error toggling active state:', error);
    alert('Không thể thay đổi trạng thái bài viết!');
  }
};


  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6 text-center">QUẢN LÍ BÀI VIẾT</h1>
      <div className="mb-4">
        <button
          onClick={handleAddBlog}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Thêm bài viết
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {blogs.length === 0 ? (
          <p className="text-center col-span-full">No blogs found.</p>
        ) : (
          blogs.map(blog => (
            <div key={blog.id} className="border rounded-lg shadow-lg p-4 bg-white">
              {blog.titleImageBase64 && (
                <img
                  src={blog.titleImageBase64}
                  alt={blog.title}
                  className="w-full h-48 object-cover rounded mb-4"
                />
              )}
              <h2 className="text-xl font-semibold mb-2">{blog.title}</h2>
              <p className="text-gray-600 mb-2">Type: {blog.blogType}</p>
              <p className="text-gray-600 mb-4">Date: {blog.blogDate}</p>
              {/* <div className="ql-snow">
                <div
                  className="ql-editor line-clamp-3"
                  dangerouslySetInnerHTML={{ __html: blog.contentHtml }}
                />
              </div> */}
              <div className="flex justify-between items-center mt-4">
  <div>
    <p className={`font-bold ${blog.isActive ? 'text-green-600' : 'text-red-600'}`}>
      Trạng thái: {blog.isActive ? 'Đang hiển thị' : 'Đã ẩn'}
    </p>
    <button
      onClick={() => handleToggleActive(blog.id)}
      className={`mt-2 px-3 py-1 rounded text-white font-semibold 
        ${blog.isActive ? 'bg-gray-500 hover:bg-gray-700' : 'bg-green-500 hover:bg-green-700'}`}
    >
      {blog.isActive ? 'Ẩn bài viết' : 'Hiện bài viết'}
    </button>
  </div>
  <div className="flex space-x-2">
    <button
      onClick={() => handleEditBlog(blog.id)}
      className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded"
    >
      Sửa
    </button>
    <button
      onClick={() => handleDeleteBlog(blog.id)}
      className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
    >
      Xóa
    </button>
  </div>
</div>

            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default BlogListManager;