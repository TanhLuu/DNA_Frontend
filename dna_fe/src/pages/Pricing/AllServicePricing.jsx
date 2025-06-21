import React, { useEffect, useState, useRef, useCallback } from 'react';
import { getAllServices } from '../../api/serviceApi';
import useFilteredServices from '../../hooks/useFilteredServices';
import ServiceFilterBar from '../../components/UI/Service/ServiceFilterBar';
import '../../styles/components/ServicePricing.css';

const ITEMS_PER_PAGE = 9;

const AllServicePricing = () => {
  const {
    filteredServices,
    searchTerm,
    setSearchTerm,
    sortOption,
    setSortOption
  } = useFilteredServices(getAllServices);

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
      <h2 className="title">BẢNG GIÁ TẤT CẢ CÁC DỊCH VỤ XÉT NGHIỆM ADN</h2>
      <div className="pricing-description">
  <p>
    Giá xét nghiệm ADN hiện tại đang không có mức giá cố định cụ thể nhưng sẽ dao động trong khoảng 
    <strong> 8.000.000 VNĐ – 30.000.000 VNĐ</strong>. Lý do có mức giá như này thường ảnh hưởng bởi nhiều yếu tố:
  </p>
  <p><strong>Loại xét nghiệm:</strong> Mỗi loại xét nghiệm ADN có mục đích và độ phức tạp khác nhau, dẫn đến mức giá khác nhau. 
  </p>
  <p><strong>Thời gian xét nghiệm:</strong> Thời gian xét nghiệm ngắn hơn sẽ có giá cao hơn.
  </p>
</div>


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

export default AllServicePricing;
