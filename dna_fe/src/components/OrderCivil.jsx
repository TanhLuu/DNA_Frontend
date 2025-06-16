import React, { useEffect, useState } from 'react';
import {
  fetchAccountInfo,
  getCustomerByAccountId
} from '../api/accountApi';
import '../styles/components/OrderForm.css';

function OrderCivil() {
  const [formData, setFormData] = useState({
    requesterName: '',
    gender: 'Nam',
    idCard: '',
    issueDate: '',
    issuePlace: '',
    address: '',
    phone: '',
    email: '',
    testType: '',
    sampleCollection: 'center',
    samples: {
      person1: { name: '', dob: '', gender: '', birthYear: '' },
      person2: { name: '', dob: '', gender: '', birthYear: '' }
    },
    relationship: '',
    sampleType: '',
    hasDiseaseHistory: false,
    hasRecentTransfusion: false,
    resultDelivery: {
      inPerson: false,
      mail: false,
      emailZalo: false
    },
    deliveryAddress: '',
    deliveryTime: '3ngay'
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const accRes = await fetchAccountInfo();
        const acc = accRes.data;

        setFormData(prev => ({
          ...prev,
          requesterName: acc.fullName || '',
          phone: acc.phone || '',
          email: acc.email || ''
        }));

        const cusRes = await getCustomerByAccountId(acc.id);
        const cus = cusRes.data;

        setFormData(prev => ({
          ...prev,
          gender: cus.gender || 'Nam',
          address: cus.address || '',
          idCard: cus.documentNumber || '',
          issuePlace: cus.placeOfIssue || '',
          issueDate: cus.dateOfIssue?.split('T')[0] || ''
        }));
      } catch (error) {
        console.error('Lỗi khi lấy dữ liệu:', error);
      }
    };

    fetchData();
  }, []);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (name.includes('resultDelivery.')) {
      const field = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        resultDelivery: {
          ...prev.resultDelivery,
          [field]: checked
        }
      }));
    } else if (name.includes('samples.person')) {
      const [_, personKey, field] = name.split('.');
      setFormData(prev => ({
        ...prev,
        samples: {
          ...prev.samples,
          [personKey]: {
            ...prev.samples[personKey],
            [field]: value
          }
        }
      }));
    } else if (type === 'radio') {
      setFormData(prev => ({ ...prev, [name]: value }));
    } else if (type === 'checkbox') {
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  return (
    <form className="order-form">
      <h2 className="form-title">ĐƠN YÊU CẦU PHÂN TÍCH ADN DÂN SỰ</h2>

      <div className="form-row">
        <div className="form-group">
          <label>Họ tên người yêu cầu:</label>
          <input type="text" name="requesterName" value={formData.requesterName} onChange={handleInputChange} />
        </div>
        <div className="form-group gender">
          <label>Giới tính:</label>
          <div className="radio-group">
            <label><input type="radio" name="gender" value="Nam" checked={formData.gender === 'Nam'} onChange={handleInputChange} /> Nam</label>
            <label><input type="radio" name="gender" value="Nữ" checked={formData.gender === 'Nữ'} onChange={handleInputChange} /> Nữ</label>
          </div>
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label>Số CMND/CCCD:</label>
          <input type="text" name="idCard" value={formData.idCard} onChange={handleInputChange} />
        </div>
        <div className="form-group">
          <label>Ngày cấp:</label>
          <input type="date" name="issueDate" value={formData.issueDate} onChange={handleInputChange} />
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label>Nơi cấp:</label>
          <input type="text" name="issuePlace" value={formData.issuePlace} onChange={handleInputChange} />
        </div>
        <div className="form-group">
          <label>Chọn phương thức lấy mẫu:</label>
          <div className="radio-group">
            <label>
              <input type="radio" name="sampleCollection" value="center" checked={formData.sampleCollection === 'center'} onChange={handleInputChange} />
              Lấy mẫu tại trung tâm
            </label>
            <label>
              <input type="radio" name="sampleCollection" value="home" checked={formData.sampleCollection === 'home'} onChange={handleInputChange} />
              Tự lấy mẫu tại nhà và gửi mẫu
            </label>
          </div>
        </div>
      </div>

      <div className="form-group">
        <label>Địa chỉ:</label>
        <input type="text" name="address" value={formData.address} onChange={handleInputChange} />
      </div>

      <div className="form-group">
        <label>Số điện thoại:</label>
        <input type="tel" name="phone" value={formData.phone} onChange={handleInputChange} />
      </div>

      <div className="form-group">
        <label>Email:</label>
        <input type="email" name="email" value={formData.email} onChange={handleInputChange} />
      </div>

      <div className="form-group">
        <label>Loại xét nghiệm:</label>
        <input type="text" name="testType" value={formData.testType} onChange={handleInputChange} />
      </div>

      <div className="samples-grid">
        <div className="sample-title">Người cần phân tích mẫu 1:</div>
        <div className="sample-title">Người cần phân tích mẫu 2:</div>

        {['person1', 'person2'].map((p, i) => (
          <React.Fragment key={p}>
            <div className="form-group">
              <label>Họ và tên:</label>
              <input type="text" name={`samples.${p}.name`} value={formData.samples[p].name} onChange={handleInputChange} />
            </div>
            <div className="form-group">
              <label>Ngày sinh:</label>
              <input type="date" name={`samples.${p}.dob`} value={formData.samples[p].dob} onChange={handleInputChange} />
            </div>
            <div className="form-group">
              <label>Giới tính:</label>
              <input type="text" name={`samples.${p}.gender`} value={formData.samples[p].gender} onChange={handleInputChange} />
            </div>
            <div className="form-group">
              <label>Năm sinh:</label>
              <input type="text" name={`samples.${p}.birthYear`} value={formData.samples[p].birthYear} onChange={handleInputChange} />
            </div>
          </React.Fragment>
        ))}
      </div>

      <div className="form-group">
        <label>Mối quan hệ:</label>
        <input type="text" name="relationship" value={formData.relationship} onChange={handleInputChange} />
      </div>

      <div className="form-group">
        <label>Mẫu xét nghiệm:</label>
        <input type="text" name="sampleType" value={formData.sampleType} onChange={handleInputChange} />
      </div>

      <div className="form-group">
        <label>Có tiền sử bệnh về máu, cấy ghép tủy không?</label>
        <div className="radio-group">
          <label><input type="radio" name="hasDiseaseHistory" checked={formData.hasDiseaseHistory === true} onChange={() => setFormData(prev => ({ ...prev, hasDiseaseHistory: true }))} /> Có</label>
          <label><input type="radio" name="hasDiseaseHistory" checked={formData.hasDiseaseHistory === false} onChange={() => setFormData(prev => ({ ...prev, hasDiseaseHistory: false }))} /> Không</label>
        </div>
      </div>

      <div className="form-group">
        <label>Có nhận máu trong 06 tháng gần đây không?</label>
        <div className="radio-group">
          <label><input type="radio" name="hasRecentTransfusion" checked={formData.hasRecentTransfusion === true} onChange={() => setFormData(prev => ({ ...prev, hasRecentTransfusion: true }))} /> Có</label>
          <label><input type="radio" name="hasRecentTransfusion" checked={formData.hasRecentTransfusion === false} onChange={() => setFormData(prev => ({ ...prev, hasRecentTransfusion: false }))} /> Không</label>
        </div>
      </div>

      <div className="form-group">
        <label>Kết quả nhận tại:</label>
        <div className="checkbox-group">
          <label><input type="checkbox" name="resultDelivery.inPerson" checked={formData.resultDelivery.inPerson} onChange={handleInputChange} /> Nhận tại văn phòng</label>
          <label><input type="checkbox" name="resultDelivery.mail" checked={formData.resultDelivery.mail} onChange={handleInputChange} /> Thư đảm bảo</label>
          <label><input type="checkbox" name="resultDelivery.emailZalo" checked={formData.resultDelivery.emailZalo} onChange={handleInputChange} /> Email/zalo</label>
        </div>
      </div>

      <div className="form-group">
        <label>Địa chỉ nhận kết quả:</label>
        <input type="text" name="deliveryAddress" value={formData.deliveryAddress} onChange={handleInputChange} />
      </div>

      <div className="form-group">
        <label>Thời gian nhận kết quả:</label>
        <div className="radio-group">
          <label><input type="radio" name="deliveryTime" value="3ngay" checked={formData.deliveryTime === '3ngay'} onChange={handleInputChange} /> 3 ngày</label>
          <label><input type="radio" name="deliveryTime" value="24h" checked={formData.deliveryTime === '24h'} onChange={handleInputChange} /> 24h</label>
          <label><input type="radio" name="deliveryTime" value="6h" checked={formData.deliveryTime === '6h'} onChange={handleInputChange} /> 6h</label>
        </div>
      </div>

      <div className="total-amount">
        TỔNG CHI PHÍ: ...................VNĐ
      </div>

      <button type="submit" className="submit-button">Thanh toán</button>
    </form>
  );
}

export default OrderCivil;
