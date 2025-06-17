import React, { useEffect, useState } from 'react';
import axios from 'axios';
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
  const [formData, setFormData] = useState({});
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

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
          gender: cus.gender || 'Nam',
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
        console.error('Error fetching info:', err);
        setError('Failed to load customer or service data.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleSampleChange = (e) => {
    const value = e.target.value;
    setSampleCount(value ? parseInt(value) : "");
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    try {
      const customerId = localStorage.getItem('customerId');
      if (!customerId) {
        setError('Customer ID not found in localStorage. Please log in.');
        return;
      }

      const orderData = {
        customerId: parseInt(customerId),
        staffId: null,
        serviceId: parseInt(formData.testType),
        orderDate: formData.orderDate || new Date().toISOString().split('T')[0],
        orderStatus: formData.orderStatus || 'PENDING',
        sampleType: formData.method || '',
        resultDeliveryMethod: formData.receiveAt || '',
        resultDeliverAddress: formData.resultAddress || '',
        kitCode: formData.method === 'home' ? `KIT-${Math.random().toString(36).substr(2, 9)}` : null,
        sampleQuantity: parseInt(sampleCount) || 2,
        amount: calculateTotalPrice() || 0,
      };

      const orderResponse = await axios.post('http://localhost:8080/api/testorders', orderData, {
        headers: { 'Content-Type': 'application/json' },
      });
      const orderId = orderResponse.data.orderId;

      const samples = [];
      for (let i = 1; i <= sampleCount; i++) {
        const index = i;
        const sampleData = {
          orderId,
          customerId: parseInt(customerId),
          staffId: null,
          name: formData[`person${index}Name`] || '',
          gender: formData[`person${index}Gender`] || '',
          dateOfBirth: formData[`person${index}Dob`] || '',
          relationship: formData[`person${index}Relationship`] || '',
          sampleType: formData[`person${index}SampleType`] || '',
          numberOfSample: 1,
          medicalHistory: formData[`person${index}BloodHistory`] || '',
          fingerprint: '',
        };
        samples.push(sampleData);
      }

      const failedSamples = [];
      for (const [index, sample] of samples.entries()) {
        try {
          await axios.post('http://localhost:8080/api/testSamples', sample, {
            headers: { 'Content-Type': 'application/json' },
          });
        } catch (sampleErr) {
          failedSamples.push(`Sample ${index + 1}: ${sampleErr.response?.data?.message || sampleErr.message}`);
        }
      }

      if (failedSamples.length > 0) {
        setError(`Some samples failed to save: ${failedSamples.join('; ')}`);
      } else {
        setSuccess('Bạn đã tạo đơn thành công');
        setFormData({});
        setSampleCount("");
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create Test Order or Samples.');
      console.error('Error:', err);
    }
  };

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

          <label>Mối quan hệ:</label>
          <input
            type="text"
            name={`person${index}Relationship`}
            placeholder="Nhập mối quan hệ"
            onChange={handleInputChange}
          />

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
            <option value="Cuống rốn">Cuống rốn</option>
          </select>

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
      {error && <div className="text-red-500 mb-4">{error}</div>}
      {success && <div className="text-green-500 mb-4">{success}</div>}
      <form className="adn-form" onSubmit={handleSubmit}>
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
        <select name="method" onChange={handleInputChange} required>
          <option value="">-- Chọn phương thức lấy mẫu --</option>
          <option value="center">Tại trung tâm</option>
          <option value="home">Tự lấy tại nhà</option>
        </select>

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

export default ADNRequestCivilForm;