import React, { useEffect, useState } from 'react';
import BlogCard from '../../components/BlogCard';
import SearchBar from '../../components/SearchBar';

const BlogList = () => {
  const [blogs, setBlogs] = useState([]);
  const [keyword, setKeyword] = useState('');

  useEffect(() => {
    fetch('http://localhost:8080/api/blogs')
      .then(res => res.json())
      .then(data => setBlogs(Array.isArray(data) ? data : []))
      .catch(() => setBlogs([]));
  }, []);

  // Lọc blog theo tiêu đề (không phân biệt hoa thường)
  const filteredBlogs = blogs.filter(blog =>
    blog.title.toLowerCase().includes(keyword.toLowerCase())
  );

  return (
   <div style={{ padding: 40 }}>
  <SearchBar keyword={keyword} onChange={setKeyword} />
  <div
    style={{
      display: "grid",
      gridTemplateColumns: "repeat(3, 1fr)",
      gap: 24,
      marginTop: 24,
    }}
  >
    {filteredBlogs.map(blog => (
      <BlogCard key={blog.blogId} blog={blog} />
    ))}
  </div>
</div>
  );
};

export default BlogList;