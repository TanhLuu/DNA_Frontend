import React, { useEffect, useState } from 'react';
import {
  fetchAccountInfo,
  getCustomerByAccountId
} from '../api/accountApi';
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
  const [sampleCount, setSampleCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

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
      } catch (err) {
        console.error('Error fetching customer info:', err);
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
    for (let i = 1; i <= sampleCount; i++) {
      fields.push(
        <div className="adn-sample-block" key={i}>
          <h4 className="adn-sample-title">Người cần phân tích mẫu {i}</h4>
          <label>Họ và tên:</label>
          <input type="text" name={`person${i}Name`} />
          <label>Ngày sinh:</label>
          <input type="date" name={`person${i}Dob`} />
          <label>Giới tính:</label>
          <select name={`person${i}Gender`}>
            <option>Nam</option>
            <option>Nữ</option>
            <option>Khác</option>
          </select>
          
        </div>
      );
    }
    return fields;
  };

  if (isLoading) return <div className="adn-loading">Đang tải thông tin...</div>;

  return (
    <div className="adn-form-wrapper">
      <h2 className="adn-form-title">ĐƠN YÊU CẦU PHÂN TÍCH ADN DÂN SỰ</h2>
      <form className="adn-form">

        <label>Họ tên người yêu cầu:</label>
        <input type="text" name="requesterName" value={customer.requesterName} disabled />

        <label>Giới tính:</label>
        <select name="gender" value={customer.gender} disabled>
          <option>Nam</option>
          <option>Nữ</option>
          <option>Khác</option>
        </select>

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
        <div className="adn-radio-group">
          <label><input type="radio" name="method" value="center" /> Tại trung tâm</label>
          <label><input type="radio" name="method" value="home" /> Tự lấy tại nhà</label>
        </div>

        <label>Loại xét nghiệm:</label>
        <select name="testType">
          <option value="">-- Chọn loại xét nghiệm --</option>
          <option>Dân sự</option>
          <option>Hành chính</option>
        </select>

        <label>Mối quan hệ:</label>
        <select name="relationship">
          <option>Cha - Con</option>
          <option>Mẹ - Con</option>
          <option>Ông/Bà - Cháu</option>
          <option>Khác</option>
        </select>

        <label>Thời gian nhận kết quả:</label>
        <input type="text" name="resultTime" />

        <label>Số mẫu cần phân tích:</label>
        <select onChange={handleSampleChange} name="sampleCount">
          <option value="">-- Chọn số mẫu --</option>
          {[1, 2, 3, 4, 5].map((num) => (
            <option value={num} key={num}>{num} người</option>
          ))}
        </select>

        {renderSampleFields()}

        <label>Mẫu xét nghiệm:</label>
        <select name="sampleType">
          <option>Tóc</option>
          <option>Móng tay/chân</option>
          <option>Máu</option>
          <option>Cuống rốn</option>
        </select>

        <label>Có tiền sử bệnh về máu hoặc cấy ghép tủy?</label>
        <div className="adn-radio-group">
          <label><input type="radio" name="bloodHistory" value="yes" /> Có</label>
          <label><input type="radio" name="bloodHistory" value="no" /> Không</label>
        </div>

        <label>Có nhận máu trong 6 tháng gần đây?</label>
        <div className="adn-radio-group">
          <label><input type="radio" name="recentTransfusion" value="yes" /> Có</label>
          <label><input type="radio" name="recentTransfusion" value="no" /> Không</label>
        </div>

        <label>Hình thức nhận kết quả:</label>
        <div className="adn-checkbox-group">
          <label><input type="checkbox" name="receiveAt" value="office" /> Tại văn phòng</label>
          <label><input type="checkbox" name="receiveAt" value="home" /> Tại nhà</label>
          <label><input type="checkbox" name="receiveAt" value="email" /> Qua Email</label>
        </div>

        <label>Địa chỉ nhận kết quả:</label>
        <input type="text" name="resultAddress" />

        <div className="adn-total-cost">TỔNG CHI PHÍ: ............. VNĐ</div>

        <button type="submit" className="adn-submit-btn">Gửi Yêu Cầu</button>
      </form>
    </div>
  );
};

export default ADNRequestCivilForm;