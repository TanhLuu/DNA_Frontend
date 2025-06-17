import React, { useEffect, useState } from 'react';
import { getAllLegalServices } from '../../api/serviceApi';
import ServiceFilterBar from '../../components/Share/ServiceFilterBar';
import '../../styles/components/ServicePricing.css';

const LegalServicePricing = () => {
  const [services, setServices] = useState([]);
  const [filteredServices, setFilteredServices] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOption, setSortOption] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await getAllLegalServices();
        setServices(result);
        setFilteredServices(result);
      } catch (error) {
        console.error('Lỗi khi lấy dịch vụ hành chính:', error);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    let result = [...services];
    if (searchTerm.trim()) {
      result = result.filter(service =>
        service.serviceName.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    if (sortOption === 'name') {
      result.sort((a, b) => a.serviceName.localeCompare(b.serviceName));
    } else if (sortOption === 'timeTest') {
      result.sort((a, b) => a.timeTest - b.timeTest);
    }
    setFilteredServices(result);
  }, [searchTerm, sortOption, services]);

  return (
    <div className="civil-pricing-container">
      <h2 className="title">BẢNG GIÁ DỊCH VỤ XÉT NGHIỆM ADN HÀNH CHÍNH</h2>
      <p className="subtitle">Danh sách các dịch vụ xét nghiệm ADN hành chính hiện có</p>

      <ServiceFilterBar
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        sortOption={sortOption}
        onSortChange={setSortOption}
      />

      <div className="service-grid">
        {filteredServices.map((service) => (
          <div className="service-card" key={service.serviceID}>
            <h3 className="service-name">{service.serviceName}</h3>
            <p className="service-description">{service.serviceBlog || 'Không có mô tả chi tiết.'}</p>
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
