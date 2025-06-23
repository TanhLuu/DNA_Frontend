import axiosInstance from './axiosInstance';

// Create new blog
export const createBlog = async (blogData) => {
  try {
    console.log('Creating blog with data:', blogData);
    
    // Format date to ensure it's in YYYY-MM-DD format
    if (blogData.blogDate) {
      const formattedDate = new Date(blogData.blogDate).toISOString().split('T')[0];
      blogData = { ...blogData, blogDate: formattedDate };
    }
    
    console.log('Sending formatted data:', blogData);
    
    const response = await axiosInstance.post('/api/blogs', blogData);
    console.log('Blog created successfully:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error in createBlog API call:');
    
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.error('Response data:', error.response.data);
      console.error('Response status:', error.response.status);
      console.error('Response headers:', error.response.headers);
    } else if (error.request) {
      // The request was made but no response was received
      console.error('No response received:', error.request);
    } else {
      // Something happened in setting up the request
      console.error('Error message:', error.message);
    }
    
    throw error;
  }
};

// Get all blogs
export const getAllBlogs = async () => {
  try {
    const response = await axiosInstance.get('/api/blogs');
    return response.data;
  } catch (error) {
    console.error('Error fetching blogs:', error);
    throw error;
  }
};

// Get blog by ID
export const getBlogById = async (id) => {
  try {
    const response = await axiosInstance.get(`/api/blogs/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching blog with ID ${id}:`, error);
    throw error;
  }
};

// Update existing blog
export const updateBlog = async (id, blogData) => {
  try {
    // Format date to ensure it's in YYYY-MM-DD format
    if (blogData.blogDate) {
      const formattedDate = new Date(blogData.blogDate).toISOString().split('T')[0];
      blogData = { ...blogData, blogDate: formattedDate };
    }
    
    const response = await axiosInstance.put(`/api/blogs/${id}`, blogData);
    return response.data;
  } catch (error) {
    console.error(`Error updating blog with ID ${id}:`, error);
    throw error;
  }
};

// Delete blog
export const deleteBlog = async (id) => {
  try {
    const response = await axiosInstance.delete(`/api/blogs/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error deleting blog with ID ${id}:`, error);
    throw error;
  }
};
export const uploadBlogImage = async (file) => {
  try {
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await axiosInstance.post('/api/blogs/upload-image', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    
    return response.data;
  } catch (error) {
    console.error('Error uploading blog image:', error);
    throw error;
  }
};

// API mới để proxy ảnh từ URL bên ngoài
export const proxyBlogImage = async (imageUrl) => {
  try {
    // Xử lý Google URL redirect nếu có
    let processedUrl = imageUrl;
    if (imageUrl.includes('google.com/url') && imageUrl.includes('url=')) {
      try {
        const match = imageUrl.match(/url=([^&]+)/);
        if (match && match[1]) {
          processedUrl = decodeURIComponent(match[1]);
          console.log('Extracted URL from Google redirect:', processedUrl);
        }
      } catch (e) {
        console.error('Error extracting URL from Google redirect:', e);
      }
    }
    
    const response = await axiosInstance.post('/api/blogs/proxy-image', { 
      url: processedUrl,
      timestamp: new Date().toISOString(),
      user: 'trihqse184859'  // Thêm thông tin user nếu cần
    });
    
    return response.data;
  } catch (error) {
    console.error('Error proxying blog image:', error);
    throw error;
  }
};