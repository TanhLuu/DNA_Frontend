export const fetchBlogs = async (filterType = '') => {
  const url = filterType ? `http://localhost:8080/api/blogs/type/${filterType}` : 'http://localhost:8080/api/blogs';
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Lỗi khi lấy danh sách blog: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    throw new Error(`Lỗi khi lấy danh sách blog: ${error.message}`);
  }
};

export const fetchBlogById = async (blogId) => {
  try {
    const response = await fetch(`http://localhost:8080/api/blogs/${blogId}`);
    if (!response.ok) {
      throw new Error(`Lỗi khi lấy thông tin blog: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    throw new Error(`Lỗi khi lấy thông tin blog: ${error.message}`);
  }
};

export const saveBlog = async (blogData, isEditing, editingBlogId) => {
  try {
    const url = isEditing ? `http://localhost:8080/api/blogs/${editingBlogId}` : 'http://localhost:8080/api/blogs';
    const method = isEditing ? 'PUT' : 'POST';
    const response = await fetch(url, {
      method: method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(blogData),
    });
    if (!response.ok) {
      throw new Error(`Lỗi khi lưu bài blog: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    throw new Error(`Lỗi kết nối đến server: ${error.message}`);
  }
};

export const deleteBlog = async (blogId) => {
  try {
    const response = await fetch(`http://localhost:8080/api/blogs/${blogId}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new Error(`Lỗi khi xóa bài blog: ${response.status}`);
    }
    return true;
  } catch (error) {
    throw new Error(`Lỗi kết nối đến server: ${error.message}`);
  }
};