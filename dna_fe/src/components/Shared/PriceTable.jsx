import React from 'react';
import '../../styles/components/PriceTable.css';

const PriceTable = ({ title, items }) => {
  return (
    <div className="price-table-container">
      <div className="price-table-header">
        <h2>{title}</h2>
      </div>
      {items.map((section, index) => (
        <div key={index} className="price-section">
          <h3 className="section-title">{section.title}</h3>
          <p className="section-description">{section.description}</p>
          <div className="price-grid">
            <div className="price-row header">
              <div>Thời gian</div>
              <div>Chi phí</div>
            </div>
            {section.prices.map((price, idx) => (
              <div key={idx} className="price-row">
                <div>{price.time}</div>
                <div>{price.cost.toLocaleString()} VNĐ</div>
              </div>
            ))}
          </div>
        </div>
      ))}
      <button className="book-button">ĐẶT LỊCH NGAY</button>
    </div>
  );
};

export default PriceTable;