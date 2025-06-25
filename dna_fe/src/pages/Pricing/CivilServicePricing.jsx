import React, { useEffect, useState, useRef, useCallback } from 'react';
import { getAllCivilServices } from '../../api/serviceApi';
import useFilteredServices from '../../hooks/useFilteredServices';
import ServiceFilterBar from '../../components/UI/Service/ServiceFilterBar';
import '../../styles/components/ServicePricing.css';

const ITEMS_PER_PAGE = 9;

const CivilServicePricing = () => {
  const {
    filteredServices,
    searchTerm,
    setSearchTerm,
    sortOption,
    setSortOption
  } = useFilteredServices(getAllCivilServices);

  const [visibleCount, setVisibleCount] = useState(ITEMS_PER_PAGE);
  const observer = useRef();

  const lastItemRef = useCallback(
    (node) => {
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && visibleCount < filteredServices.length) {
          setVisibleCount((prev) => prev + ITEMS_PER_PAGE);
        }
      });
      if (node) observer.current.observe(node);
    },
    [visibleCount, filteredServices.length]
  );

  const visibleServices = filteredServices.slice(0, visibleCount);

  return (
    <div className="civil-pricing-container">
      <h2 className="title">BẢNG GIÁ DỊCH VỤ XÉT NGHIỆM ADN DÂN SỰ</h2>
      <p className="subtitle">Danh sách các dịch vụ xét nghiệm ADN dân sự hiện có</p>

      <ServiceFilterBar
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        sortOption={sortOption}
        setSortOption={setSortOption}
      />

      <div className="service-grid">
        {visibleServices.map((service, index) => {
          const isLast = index === visibleServices.length - 1;
          return (
            <div
              className="service-card"
              key={service.serviceID}
              ref={isLast ? lastItemRef : null}
            >
              <h3 className="service-name">{service.serviceName}</h3>
              <p className="service-description">{service.describe || 'Không có mô tả chi tiết.'}</p>
              <div className="service-info">
                <p><strong>Thời gian xét nghiệm:</strong> {service.timeTest} ngày</p>
                <p><strong>Giá:</strong> {service.price.toLocaleString('vi-VN')} VNĐ</p>
                <p><strong>Loại dịch vụ:</strong> {service.serviceType}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CivilServicePricing;
