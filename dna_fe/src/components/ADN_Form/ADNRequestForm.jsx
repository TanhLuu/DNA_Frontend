import React, { useEffect } from 'react';
import '../../styles/components/ADNRequestForm.css';

const ADNRequestForm = ({
  title,
  isCivil,
  customer,
  sampleCount,
  isLoading,
  services,
  selectedService,
  setSelectedService,
  formData,
  error,
  success,
  handleSampleChange,
  handleInputChange,
  handleSubmit,
  calculateTotalPrice,
}) => {
  const totalPrice = calculateTotalPrice(isCivil);
  
  // Log khi services thay đổi
  useEffect(() => {
    console.log('ADNRequestForm services:', services);
  }, [services]);
  
  // Đặt selectedService khi services thay đổi và selectedService chưa được thiết lập
  useEffect(() => {
    if (Array.isArray(services) && services.length > 0 && !selectedService) {
      console.log('Auto select first service:', services[0]);
      setSelectedService(services[0]);
    }
  }, [services, selectedService, setSelectedService]);

  if (isLoading) return <div className="adn-loading">Đang tải thông tin...</div>;

  return (
    <div className="adn-form-wrapper">
      <h2 className="adn-form-title">{title}</h2>
      {error && <div className="text-red-500 mb-4">{error}</div>}
      {success && <div className="text-green-500 mb-4">{success}</div>}
      <form className="adn-form" onSubmit={(e) => handleSubmit(e, isCivil)}>
        <label>Họ tên người yêu cầu:</label>
        <input type="text" name="requesterName" value={customer.requesterName || ''} disabled />

        <label>Giới tính:</label>
        <input type="text" name="gender" value={customer.gender || ''} disabled />

        <div className="adn-flex-row">
          <div>
            <label>Số CMND/CCCD:</label>
            <input type="text" name="idCard" value={customer.idCard || ''} disabled />
          </div>
          <div>
            <label>Ngày cấp:</label>
            <input type="date" name="issueDate" value={customer.issueDate || ''} disabled />
          </div>
        </div>

        <label>Nơi cấp:</label>
        <input type="text" name="issuePlace" value={customer.issuePlace || ''} disabled />

        <label>Địa chỉ:</label>
        <input type="text" name="address" value={customer.address || ''} disabled />

        <div className="adn-flex-row">
          <div>
            <label>Số điện thoại:</label>
            <input type="tel" name="phone" value={customer.phone || ''} disabled />
          </div>
          <div>
            <label>Email:</label>
            <input type="email" name="email" value={customer.email || ''} disabled />
          </div>
        </div>

        <div className="adn-section-heading">Thông tin xét nghiệm</div>

        <label>Phương thức lấy mẫu:</label>
        {isCivil ? (
          <select name="method" value={formData.method || ''} onChange={handleInputChange} required>
            <option value="">-- Chọn phương thức lấy mẫu --</option>
            <option value="center">Tại trung tâm</option>
            <option value="home">Tự lấy tại nhà</option>
          </select>
        ) : (
          <>
            <input type="hidden" name="method" value="center" />
            <select value="center" disabled>
              <option value="center">Tại trung tâm</option>
            </select>
          </>
        )}

        <label>Hình thức nhận kết quả:</label>
        <select name="receiveAt" value={formData.receiveAt || ''} onChange={handleInputChange} required>
          <option value="">-- Chọn hình thức nhận kết quả --</option>
          <option value="office">Tại văn phòng</option>
          <option value="home">Tại nhà</option>
          <option value="email">Qua Email</option>
        </select>

        <label>Địa chỉ nhận kết quả:</label>
        <input type="text" name="resultAddress" value={formData.resultAddress || ''} onChange={handleInputChange} />

        {/* Console log để debug */}
        {console.log('Rendering dropdown with services:', services)}
        
        <label>Tên xét nghiệm:</label>
        {/* Hard-coded dropdown để kiểm tra UI render */}
        {services && services.length > 0 ? (
          <select
            name="testType"
            value={selectedService?.serviceID || ''}
            onChange={(e) => {
              console.log('Selected value:', e.target.value);
              console.log('Available services:', services);
              const selected = services.find(s => String(s.serviceID) === e.target.value);
              console.log('Found service:', selected);
              setSelectedService(selected);
              handleInputChange(e);
            }}
            required
          >
            <option value="">-- Chọn --</option>
            {services.map(service => (
              <option key={service.serviceID || Math.random()} value={String(service.serviceID || '')}>
                {service.serviceName} - {service.timeTest} ngày - {parseFloat(service.price).toLocaleString('vi-VN')} VNĐ
              </option>
            ))}
          </select>
        ) : (
          <>
            <select disabled>
              <option>Không có dịch vụ nào</option>
            </select>
            <div style={{color: 'red', fontSize: '0.8rem'}}>
              {services ? 'Không tìm thấy dịch vụ' : 'Đang tải dịch vụ...'}
            </div>
          </>
        )}

        <label>Thời gian nhận kết quả:</label>
        <input
          type="text"
          name="resultTime"
          value={selectedService ? `${selectedService.timeTest} ngày` : ''}
          disabled
        />

        <label>Số người cần phân tích:</label>
        <select onChange={handleSampleChange} name="sampleCount" value={sampleCount || ''} required>
          <option value="">-- Chọn số mẫu --</option>
          {[2, 3, 4, 5].map((num) => (
            <option value={num} key={num}>{num} người</option>
          ))}
        </select>

        <div className="adn-total-cost">
          TỔNG CHI PHÍ: {totalPrice !== null ? `${totalPrice.toLocaleString('vi-VN')} VNĐ` : '.........'}
        </div>

        <button
          type="submit"
          className="adn-submit-btn"
        >
          Gửi Yêu Cầu
        </button>
      </form>
    </div>
  );
};

export default ADNRequestForm;