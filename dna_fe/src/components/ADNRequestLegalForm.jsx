import React, { useEffect, useState } from 'react';
import { fetchAccountInfo, getCustomerByAccountId } from '../api/accountApi';
import '../styles/components/ADNRequestForm.css';

const ADNRequestLegalForm = () => {
  const [customer, setCustomer] = useState({
    requesterName: '', gender: '', idCard: '', issueDate: '',
    issuePlace: '', address: '', phone: '', email: ''
  });
  const [sampleCount, setSampleCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  const formatDate = (iso) => iso?.split('T')[0] || '';

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data: acc } = await fetchAccountInfo();
        const { data: cus } = await getCustomerByAccountId(acc.id);
        setCustomer({
          requesterName: acc.fullName || '',
          gender: cus.gender || 'Nam',
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

  const handleSampleChange = (e) => setSampleCount(+e.target.value || 0);

  const renderSampleFields = () => Array.from({ length: sampleCount }, (_, i) => (
    <div className="adn-sample-block" key={i + 1}>
      <h4 className="adn-sample-title">Người cần phân tích mẫu {i + 1}</h4>
      {[
        ['Họ và tên:', 'text', 'Name'],
        ['Ngày sinh:', 'date', 'Dob'],
        ['Giới tính:', 'select', 'Gender', ['Nam', 'Nữ', 'Khác']],
        ['Địa chỉ:', 'text', 'Address'],
        ['Loại giấy tờ:', 'select', 'DocumentType', ['CCCD', 'Hộ chiếu', 'Giấy khai sinh']],
        ['Số/quyển số:', 'text', 'DocumentNumber'],
        ['Ngày cấp:', 'date', 'IssueDate'],
        ['Ngày hết hạn:', 'date', 'ExpiryDate'],
        ['Nơi cấp:', 'text', 'IssuePlace'],
        ['Quốc tịch:', 'text', 'Nationality']
      ].map(([label, type, name, options]) => (
        <div key={name}>
          <label>{label}</label>
          {type === 'select' ? (
            <select name={`person${i + 1}${name}`}>
              {options.map(opt => <option key={opt}>{opt}</option>)}
            </select>
          ) : (
            <input type={type} name={`person${i + 1}${name}`} />
          )}
        </div>
      ))}
    </div>
  ));

  if (isLoading) return <div className="adn-loading">Đang tải thông tin...</div>;

  return (
    <div className="adn-form-wrapper">
      <h2 className="adn-form-title">ĐƠN YÊU CẦU PHÂN TÍCH ADN HÀNH CHÍNH</h2>
      <form className="adn-form">
        {[
          ['Họ tên người yêu cầu:', 'requesterName'],
          ['Giới tính:', 'gender'],
          ['Nơi cấp:', 'issuePlace'],
          ['Địa chỉ:', 'address']
        ].map(([label, name]) => (
          <div key={name}>
            <label>{label}</label>
            <input type="text" name={name} value={customer[name]} disabled />
          </div>
        ))}

        <div className="adn-flex-row">
          {[
            ['Số CMND/CCCD:', 'idCard', 'text'],
            ['Ngày cấp:', 'issueDate', 'date']
          ].map(([label, name, type]) => (
            <div key={name}>
              <label>{label}</label>
              <input type={type} name={name} value={customer[name]} disabled />
            </div>
          ))}
        </div>

        <div className="adn-flex-row">
          {[
            ['Số điện thoại:', 'phone', 'tel'],
            ['Email:', 'email', 'email']
          ].map(([label, name, type]) => (
            <div key={name}>
              <label>{label}</label>
              <input type={type} name={name} value={customer[name]} disabled />
            </div>
          ))}
        </div>

        <div className="adn-section-heading">Thông tin xét nghiệm</div>

        <label>Phương thức lấy mẫu:</label>
        <div className="adn-radio-group">
          {['Tại trung tâm', 'Tự lấy tại nhà'].map((label, i) => (
            <label key={i}><input type="radio" name="method" value={i === 0 ? 'center' : 'home'} /> {label}</label>
          ))}
        </div>

        <label>Loại xét nghiệm:</label>
        <input type="text" name="testType" value="Dân sự" disabled />

        <label>Mối quan hệ:</label>
        <select name="relationship">
          {['Cha - Con', 'Mẹ - Con', 'Ông/Bà - Cháu', 'Khác'].map(opt => <option key={opt}>{opt}</option>)}
        </select>

        <label>Thời gian nhận kết quả:</label>
        <select name="testDuration">
          <option value="">-- Thời gian --</option>
          {['3 ngày', '6 ngày'].map(day => <option key={day}>{day}</option>)}
        </select>

        <label>Số mẫu cần phân tích:</label>
        <select onChange={handleSampleChange} name="sampleCount">
          <option value="">-- Chọn số mẫu --</option>
          {[1, 2, 3, 4, 5].map(num => (
            <option key={num} value={num}>{num} người</option>
          ))}
        </select>

        {renderSampleFields()}

        <label>Mẫu xét nghiệm:</label>
        <select name="sampleType">
          {['Tóc', 'Móng tay/chân', 'Máu', 'Cuống rốn'].map(type => <option key={type}>{type}</option>)}
        </select>

        {[
          ['Có tiền sử bệnh về máu hoặc cấy ghép tủy?', 'bloodHistory'],
          ['Có nhận máu trong 6 tháng gần đây?', 'recentTransfusion']
        ].map(([label, name]) => (
          <div key={name}>
            <label>{label}</label>
            <div className="adn-radio-group">
              <label><input type="radio" name={name} value="yes" /> Có</label>
              <label><input type="radio" name={name} value="no" /> Không</label>
            </div>
          </div>
        ))}

        <label>Hình thức nhận kết quả:</label>
        <div className="adn-checkbox-group">
          {['office', 'home', 'email'].map((val, i) => (
            <label key={val}>
              <input type="checkbox" name="receiveAt" value={val} /> {['Tại văn phòng', 'Tại nhà', 'Qua Email'][i]}
            </label>
          ))}
        </div>

        <label>Địa chỉ nhận kết quả:</label>
        <input type="text" name="resultAddress" />

        <div className="adn-total-cost">TỔNG CHI PHÍ: ............. VNĐ</div>
        <button type="submit" className="adn-submit-btn">Gửi Yêu Cầu</button>
      </form>
    </div>
  );
};

export default ADNRequestLegalForm;
