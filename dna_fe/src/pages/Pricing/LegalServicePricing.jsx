import React from 'react';
import { getAllLegalServices } from '../../api/serviceApi';
import useFilteredServices from '../../hooks/useFilteredServices';
import ServiceFilterBar from '../../components/UI/Service/ServiceFilterBar';
import '../../styles/components/ServicePricing.css';

const LegalServicePricing = () => {
  const {
    filteredServices,
    searchTerm,
    setSearchTerm,
    sortOption,
    setSortOption
  } = useFilteredServices(getAllLegalServices);

  return (
    <div className="civil-pricing-container">
      <h2 className="title">BẢNG GIÁ DỊCH VỤ XÉT NGHIỆM ADN HÀNH CHÍNH</h2>
      <p className="subtitle">Danh sách các dịch vụ xét nghiệm ADN hành chính hiện có</p>

      <ServiceFilterBar
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        sortOption={sortOption}
        setSortOption={setSortOption}
      />

      <div className="service-grid">
        {filteredServices.map((service) => (
          <div className="service-card" key={service.serviceID}>
            <h3 className="service-name">{service.serviceName}</h3>
            <p className="service-description">{service.describe || 'Không có mô tả chi tiết.'}</p>
            <div className="service-info">
              <p><strong>Thời gian xét nghiệm:</strong> {service.timeTest} ngày</p>
              <p><strong>Giá:</strong> {service.price.toLocaleString('vi-VN')} VNĐ</p>
              <p><strong>Mục đích:</strong> {service.servicePurpose}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LegalServicePricing;
