import React from "react";
import { Link } from "react-router-dom";

const BlogCard = ({ blog, isAdmin, onDelete }) => (
  <div
    style={{
      border: "1px solid #e0e0e0",
      borderRadius: 12,
      background: "#fff",
      padding: 18,
      boxShadow: "0 2px 8px rgba(0,0,0,0.03)",
      transition: "box-shadow 0.2s",
      display: "flex",
      flexDirection: "column",
      height: "100%",
    }}
  >
    {blog.blogImg && (
      <img
        src={blog.blogImg}
        alt={blog.title}
        style={{
          width: "100%",
          maxHeight: 180,
          objectFit: "cover",
          borderRadius: 8,
          marginBottom: 12,
        }}
      />
    )}
    <h3 style={{ margin: "12px 0 8px", fontSize: "1.2rem" }}>{blog.title}</h3>
    <p style={{ color: "#444", flex: 1 }}>{blog.content.slice(0, 100)}...</p>
    <div style={{ marginTop: 8, display: "flex", gap: 12, alignItems: "center" }}>
      <Link to={`/blog/${blog.blogId}`}>Đọc thêm →</Link>
      {isAdmin && (
        <>
          <Link to={`/admin/edit/${blog.blogId}`}>✏</Link>
          <button
            onClick={() => onDelete && onDelete(blog.blogId)}
            title="Xóa"
            style={{
              background: "none",
              border: "none",
              color: "red",
              cursor: "pointer",
              marginLeft: 8,
            }}
          >🗑</button>
        </>
      )}
    </div>
  </div>
);

export default BlogCard;
