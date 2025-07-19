import React from "react";
import STATUS_LABELS from "../constants/orderStatusLabels";
import "../styles/components/StatusFilterBar.css";

const StatusFilterBar = ({ selectedStatus, setSelectedStatus }) => {
  const statusOptions = Object.entries(STATUS_LABELS);

  const handleClick = (statusKey) => {
    // Nếu click lại cùng trạng thái thì bỏ chọn -> trở về tất cả
    if (selectedStatus === statusKey) {
      setSelectedStatus("");
    } else {
      setSelectedStatus(statusKey);
    }
  };

  return (
    <div className="status-filter-bar">
      {/* ✅ Nút "Tất cả" */}
      <button
        className={`status-btn ${selectedStatus === "" ? "active" : ""}`}
        onClick={() => setSelectedStatus("")}
      >
        Tất cả
      </button>

      {/* ✅ Các nút trạng thái */}
      {statusOptions.map(([key, label]) => (
        <button
          key={key}
          className={`status-btn ${selectedStatus === key ? "active" : ""}`}
          onClick={() => handleClick(key)}
        >
          {label}
        </button>
      ))}
    </div>
  );
};

export default StatusFilterBar;
