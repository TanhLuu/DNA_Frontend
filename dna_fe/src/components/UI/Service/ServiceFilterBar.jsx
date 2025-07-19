import React from 'react';
import "../../../styles/components/ServiceFilterBar.css"

const ServiceFilterBar = ({ searchTerm, setSearchTerm, sortOption, setSortOption }) => {
  return (
    <div className="controls">
      <input
        type="text"
        placeholder="Tìm theo tên dịch vụ..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="search-input"
      />

      <select
        value={sortOption}
        onChange={(e) => setSortOption(e.target.value)}
        className="sort-select"
      >
        <option value="">-- Sắp xếp theo --</option>
        <option value="name">Tên dịch vụ (A-Z)</option>
        <option value="timeTest">Thời gian xét nghiệm (tăng dần)</option>
      </select>
    </div>
  );
};

export default ServiceFilterBar;
