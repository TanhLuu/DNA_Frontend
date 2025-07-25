import React from 'react';
import '../../styles/components/ADNRequestForm.css';

const ADNRequestForm = ({
  title,
  fetchServices,
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
  const totalPrice = calculateTotalPrice();

  if (isLoading) return <div className="adn-loading">Đang tải thông tin...</div>;

  return (
    <div className="adn-form-wrapper">
      <h2 className="adn-form-title">{title}</h2>
      {error && <div className="adn-error">{error}</div>}
      {success && <div className="adn-success">{success}</div>}
      <form className="adn-form" onSubmit={(e) => handleSubmit(e, isCivil)}>
        <div className="adn-flex-group">
          <div className="adn-field">
            <label>Họ tên người yêu cầu:</label>
            <input type="text" name="requesterName" value={customer.requesterName} disabled />
          </div>
          <div className="adn-field">
            <label>Giới tính:</label>
            <input type="text" name="gender" value={customer.gender} disabled />
          </div>
          <div className="adn-field">
            <label>Địa chỉ:</label>
            <input type="text" name="address" value={customer.address} disabled />
          </div>
          <div className="adn-field">
            <label>Số điện thoại:</label>
            <input type="tel" name="phone" value={customer.phone} disabled />
          </div>
        </div>

        <div className="adn-flex-group">
          <div className="adn-field">
            <label>Số CMND/CCCD:</label>
            <input type="text" name="idCard" value={customer.idCard} disabled />
          </div>
          <div className="adn-field">
            <label>Nơi cấp:</label>
            <input type="text" name="issuePlace" value={customer.issuePlace} disabled />
          </div>
          <div className="adn-field">
            <label>Ngày cấp:</label>
            <input type="date" name="issueDate" value={customer.issueDate} disabled />
          </div>
        </div>

        <div className="adn-section-heading">Thông tin xét nghiệm</div>

        <div className="adn-flex-group">
          <div className="adn-field">
            <label>Phương thức lấy mẫu:</label>
            {isCivil ? (
              <select name="method" onChange={handleInputChange} required>
                <option value="">-- Chọn phương thức lấy mẫu --</option>
                <option value="center">Tại trung tâm</option>
                <option value="home">Tự lấy tại nhà</option>
              </select>
            ) : (
              <>
                <input type="hidden" name="method" value="center" />
                <input type="text" value="Tại trung tâm" disabled />
              </>
            )}
          </div>
          <div className="adn-field">
            <label>Hình thức nhận kết quả:</label>
            <select name="receiveAt" onChange={handleInputChange} required>
              <option value="">-- Chọn hình thức nhận kết quả --</option>
              <option value="office">Tại văn phòng</option>
              <option value="home">Tại nhà</option>
              <option value="email">Qua Email</option>
            </select>
          </div>
          <div className="adn-field">
            <label>Địa chỉ nhận kết quả:</label>
            <input type="text" name="resultAddress" onChange={handleInputChange} />
          </div>
        </div>

        <div className="adn-flex-group">
          <div className="adn-field">
            <label>Tên xét nghiệm:</label>
            <select
              name="testType"
              value={selectedService?.serviceID || ''}
              onChange={(e) => {
                const selected = services.find(s => s.serviceID.toString() === e.target.value);
                setSelectedService(selected);
                handleInputChange(e);
              }}
              required
            >
              <option value="">-- Chọn --</option>
              {services.map(service => (
                <option key={service.serviceID} value={service.serviceID}>
                  {`${service.serviceName} - ${service.timeTest} ngày - ${service.price.toLocaleString('vi-VN')} VNĐ`}
                </option>
              ))}
            </select>
          </div>
          <div className="adn-field">
            <label>Thời gian nhận kết quả:</label>
            <input
              type="text"
              name="resultTime"
              value={selectedService ? `${selectedService.timeTest} ngày` : ''}
              disabled
            />
          </div>
        </div>

        <div className="adn-field">
          <label>Số mẫu phân tích:</label>
          <select onChange={handleSampleChange} name="sampleCount" value={sampleCount} required>
            <option value="">-- Chọn số mẫu --</option>
            {[2, 3, 4, 5].map((num) => (
              <option value={num} key={num}>{num} mẫu</option>
            ))}
          </select>
        </div>

        <div className="adn-total-cost">
          TỔNG CHI PHÍ: {totalPrice !== null ? `${totalPrice.toLocaleString('vi-VN')} VNĐ` : '.........'}
        </div>

        <button type="submit" className="adn-submit-btn">
          Gửi Yêu Cầu
        </button>
      </form>
    </div>
  );
};

export default ADNRequestForm;