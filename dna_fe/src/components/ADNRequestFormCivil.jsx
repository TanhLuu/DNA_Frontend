import React, { useEffect, useState } from 'react';
import { fetchAccountInfo, getCustomerByAccountId } from '../api/accountApi';
import { getAllCivilServices } from '../api/serviceApi';
import '../styles/components/ADNRequestForm.css';

const ADNRequestCivilForm = () => {
  const [customer, setCustomer] = useState({
    requesterName: '',
    gender: 'Nam',
    idCard: '',
    issueDate: '',
    issuePlace: '',
    address: '',
    phone: '',
    email: ''
  });

  const [sampleCount, setSampleCount] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [services, setServices] = useState([]);
  const [selectedService, setSelectedService] = useState(null);

  const formatDate = (iso) => iso?.split('T')[0] || '';

  useEffect(() => {
    const fetchData = async () => {
      try {
        const accRes = await fetchAccountInfo();
        const acc = accRes.data;
        const cusRes = await getCustomerByAccountId(acc.id);
        const cus = cusRes.data;

        setCustomer({
          requesterName: acc.fullName || '',
          gender: cus.gender || '',
          idCard: cus.cccd || '',
          issueDate: formatDate(cus.dateOfIssue),
          issuePlace: cus.placeOfIssue || '',
          address: cus.address || '',
          phone: acc.phone || '',
          email: acc.email || ''
        });

        const civilServices = await getAllCivilServices();
        setServices(civilServices);
      } catch (err) {
        console.error('Error:', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleSampleChange = (e) => {
    setSampleCount(parseInt(e.target.value));
  };

  const renderSampleFields = () => {
    const fields = [];
    for (let i = 2; i <= sampleCount + 1; i++) {
      const index = i - 1;
      fields.push(
        <div className="adn-sample-block" key={index}>
          <h4 className="adn-sample-title">Người thứ {index} cần phân tích </h4>

          <label>Họ và tên:</label>
          <input type="text" name={`person${index}Name`} />

          <label>Ngày sinh:</label>
          <input type="date" name={`person${index}Dob`} />

          <label>Giới tính:</label>
          <select name={`person${index}Gender`}>
            <option>Nam</option>
            <option>Nữ</option>
          </select>

          <label>Mối quan hệ:</label>
          <input type="text" name={`person${index}Relationship`} placeholder="Nhập mối quan hệ" />

          <label>Mẫu xét nghiệm:</label>
          <select name={`person${index}SampleType`}>
            <option>Tóc</option>
            <option>Móng tay/chân</option>
            <option>Máu</option>
            <option>Cuống rốn</option>
          </select>

          <label>Có tiền sử bệnh về máu hoặc cấy ghép tủy và nhận máu trong 6 tháng gần đây?</label>
          <div className="adn-radio-group">
            <label><input type="radio" name={`person${index}BloodHistory`} value="yes" /> Có</label>
            <label><input type="radio" name={`person${index}BloodHistory`} value="no" /> Không</label>
          </div>
        </div>
      );
    }
    return fields;
  };

  const calculateTotalPrice = () => {
    if (!selectedService || !sampleCount || isNaN(sampleCount)) return null;
    const additionalCost = (sampleCount - 2) * 1500000;
    return selectedService.price + (additionalCost > 0 ? additionalCost : 0);
  };

  const totalPrice = calculateTotalPrice();

  if (isLoading) return <div className="adn-loading">Đang tải thông tin...</div>;

  return (
    <div className="adn-form-wrapper">
      <h2 className="adn-form-title">ĐƠN YÊU CẦU PHÂN TÍCH ADN DÂN SỰ</h2>
      <form className="adn-form">

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
        <select name="method" defaultValue="">
          <option value="">-- Chọn phương thức lấy mẫu --</option>
          <option value="center">Tại trung tâm</option>
          <option value="home">Tự lấy tại nhà</option>
        </select>

        <label>Hình thức nhận kết quả:</label>
        <select name="receiveAt" defaultValue="">
          <option value="">-- Chọn hình thức nhận kết quả --</option>
          <option value="office">Tại văn phòng</option>
          <option value="home">Tại nhà</option>
          <option value="email">Qua Email</option>
        </select>

        <label>Địa chỉ nhận kết quả:</label>
        <input type="text" name="resultAddress" />

        <label>Tên xét nghiệm:</label>
        <select
          name="testType"
          value={selectedService?.serviceID || ''}
          onChange={(e) => {
            const selected = services.find(s => s.serviceID.toString() === e.target.value);
            setSelectedService(selected);
          }}
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
        <select onChange={handleSampleChange} name="sampleCount" value={sampleCount}>
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

export default ADNRequestCivilForm;
