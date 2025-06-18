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
  const renderSampleFields = () => {
    const fields = [];
    for (let i = 1; i <= sampleCount; i++) {
      const index = i;
      fields.push(
        <div className="adn-sample-block" key={index}>
          <h4 className="adn-sample-title">Người cần phân tích mẫu {index}</h4>

          <label>Họ và tên:</label>
          <input
            type="text"
            name={`person${index}Name`}
            onChange={handleInputChange}
            required
          />

          <label>Ngày sinh:</label>
          <input
            type="date"
            name={`person${index}Dob`}
            onChange={handleInputChange}
          />

          <label>Giới tính:</label>
          <select
            name={`person${index}Gender`}
            onChange={handleInputChange}
            required
          >
            <option value="">Chọn giới tính</option>
            <option value="Nam">Nam</option>
            <option value="Nữ">Nữ</option>
          </select>

          {isCivil ? (
            <>
              <label>Mối quan hệ:</label>
              <input
                type="text"
                name={`person${index}Relationship`}
                placeholder="Nhập mối quan hệ"
                onChange={handleInputChange}
              />
            </>
          ) : (
            <>
              <label>Địa chỉ:</label>
              <input
                type="text"
                name={`person${index}Address`}
                placeholder="Nhập địa chỉ"
                onChange={handleInputChange}
              />

              <label>Quốc tịch:</label>
              <input
                type="text"
                name={`person${index}Nationality`}
                onChange={handleInputChange}
              />

              <label>Loại giấy tờ:</label>
              <select
                name={`person${index}DocumentType`}
                onChange={handleInputChange}
              >
                <option value="">Chọn loại giấy tờ</option>
                <option value="CCCD">CCCD</option>
                <option value="Hộ chiếu">Hộ chiếu</option>
                <option value="Giấy khai sinh">Giấy khai sinh</option>
              </select>

              <label>Số / Quyển số:</label>
              <input
                type="text"
                name={`person${index}DocumentNumber`}
                onChange={handleInputChange}
              />

              <div className="adn-flex-row">
                <div>
                  <label>Ngày cấp:</label>
                  <input
                    type="date"
                    name={`person${index}IssueDate`}
                    onChange={handleInputChange}
                  />
                </div>
                <div>
                  <label>Ngày hết hạn:</label>
                  <input
                    type="date"
                    name={`person${index}ExpiryDate`}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              <label>Nơi cấp:</label>
              <input
                type="text"
                name={`person${index}IssuePlace`}
                onChange={handleInputChange}
              />

              <label>Mối quan hệ:</label>
              <input
                type="text"
                name={`person${index}Relationship`}
                placeholder="Nhập mối quan hệ"
                onChange={handleInputChange}
              />
            </>
          )}

          <label>Mẫu xét nghiệm:</label>
          <select
            name={`person${index}SampleType`}
            onChange={handleInputChange}
            required
          >
            <option value="">Chọn loại mẫu</option>
            <option value="Tóc">Tóc</option>
            <option value="Móng tay/chân">Móng tay/chân</option>
            <option value="Máu">Máu</option>
            <option value="Niêm mạc">Niêm mạc</option>
          </select>

          {isCivil ? null : (
            <>
              <label>Số mẫu xét nghiệm:</label>
              <input
                type="number"
                name={`person${index}SampleAmount`}
                placeholder="Nhập số mẫu xét nghiệm"
                onChange={handleInputChange}
                min="1"
                required
              />
            </>
          )}

          <label>Có tiền sử bệnh về máu hoặc cấy ghép tủy và nhận máu trong 6 tháng gần đây?</label>
          <div className="adn-radio-group">
            <label>
              <input
                type="radio"
                name={`person${index}BloodHistory`}
                value="yes"
                onChange={handleInputChange}
              /> Có
            </label>
            <label>
              <input
                type="radio"
                name={`person${index}BloodHistory`}
                value="no"
                onChange={handleInputChange}
              /> Không
            </label>
          </div>
        </div>
      );
    }
    return fields;
  };

  const totalPrice = calculateTotalPrice(isCivil);

  if (isLoading) return <div className="adn-loading">Đang tải thông tin...</div>;

  return (
    <div className="adn-form-wrapper">
      <h2 className="adn-form-title">{title}</h2>
      {error && <div className="text-red-500 mb-4">{error}</div>}
      {success && <div className="text-green-500 mb-4">{success}</div>}
      <form className="adn-form" onSubmit={(e) => handleSubmit(e, isCivil)}>
        <label>Họ tên người yêu cầu:</label>
        <input type="text" name="requesterName" value={customer.requesterName} disabled />

        <label>Giới tính:</label>
        <input type="text" name="gender" value={customer.gender} disabled />

        <div className="adn-flex-row">
          <div>
            <label>Số CMND/CCCD:</label>
            <input type="text" name="idCard" value={customer.idCard} disabled />
          </div>
          <div>
            <label>Ngày cấp:</label>
            <input type="date" name="issueDate" value={customer.issueDate} disabled />
          </div>
        </div>

        <label>Nơi cấp:</label>
        <input type="text" name="issuePlace" value={customer.issuePlace} disabled />

        <label>Địa chỉ:</label>
        <input type="text" name="address" value={customer.address} disabled />

        <div className="adn-flex-row">
          <div>
            <label>Số điện thoại:</label>
            <input type="tel" name="phone" value={customer.phone} disabled />
          </div>
          <div>
            <label>Email:</label>
            <input type="email" name="email" value={customer.email} disabled />
          </div>
        </div>

        <div className="adn-section-heading">Thông tin xét nghiệm</div>

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
            <select value="center" disabled>
              <option value="center">Tại trung tâm</option>
            </select>
          </>
        )}

        <label>Hình thức nhận kết quả:</label>
        <select name="receiveAt" onChange={handleInputChange} required>
          <option value="">-- Chọn hình thức nhận kết quả --</option>
          <option value="office">Tại văn phòng</option>
          <option value="home">Tại nhà</option>
          <option value="email">Qua Email</option>
        </select>

        <label>Địa chỉ nhận kết quả:</label>
        <input type="text" name="resultAddress" onChange={handleInputChange} />

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

        <label>Thời gian nhận kết quả:</label>
        <input
          type="text"
          name="resultTime"
          value={selectedService ? `${selectedService.timeTest} ngày` : ''}
          disabled
        />

        <label>Số người cần phân tích:</label>
        <select onChange={handleSampleChange} name="sampleCount" value={sampleCount} required>
          <option value="">-- Chọn số mẫu --</option>
          {[2, 3, 4, 5].map((num) => (
            <option value={num} key={num}>{num} người</option>
          ))}
        </select>

        {sampleCount >= 2 && renderSampleFields()}

        <div className="adn-total-cost">
          TỔNG CHI PHÍ: {totalPrice !== null ? `${totalPrice.toLocaleString('vi-VN')} VNĐ` : '.........'}
        </div>

        <button type="submit" className="adn-submit-btn">Gửi Yêu Cầu</button>
      </form>
    </div>
  );
};

export default ADNRequestForm;