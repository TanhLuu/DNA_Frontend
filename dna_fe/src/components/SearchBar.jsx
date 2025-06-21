import React from "react";

const SearchBar = ({
  keyword,
  onChange,
  onSearch,
  placeholder = "Tìm kiếm tiêu đề blog..."
}) => (
  <form
    style={{
      display: "flex",
      alignItems: "center",
      maxWidth: 350,
      marginBottom: 24,
      background: "#fff",
      borderRadius: 24,
      border: "1px solid #e0e0e0",
      padding: "4px 8px",
    }}
    onSubmit={e => {
      e.preventDefault();
      if (onSearch) onSearch(keyword);
    }}
    autoComplete="off"
  >
    <input
      type="text"
      value={keyword}
      onChange={e => onChange(e.target.value)}
      placeholder={placeholder}
      style={{
        border: "none",
        outline: "none",
        padding: "8px 12px",
        borderRadius: 24,
        flex: 1,
        fontSize: "1rem",
        background: "transparent",
      }}
      autoFocus
    />
    <button
      type="submit"
      title="Tìm kiếm"
      style={{
        background: "#00bcd4",
        border: "none",
        borderRadius: "50%",
        width: 36,
        height: 36,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "#fff",
        cursor: "pointer",
        marginLeft: 4,
        fontSize: "1.2rem",
        transition: "background 0.2s",
      }}
    >
      <span role="img" aria-label="search">🔍</span>
    </button>
  </form>
);

export default SearchBar;