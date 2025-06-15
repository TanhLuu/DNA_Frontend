import React, { useState } from 'react';
import '../../styles/auth/OrderForm.css';

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
    sampleCollection: 'center', // center or home
    samples: {
      person1: {
        name: '',
        dob: '',
        gender: '',
        birthYear: ''
      },
      person2: {
        name: '',
        dob: '',
        gender: '',
        birthYear: ''
      }
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

  return (
    <form className="order-form">
      <h2 className="form-title">ĐƠN YÊU CẦU PHÂN TÍCH ADN DÂN SỰ</h2>

      <div className="form-row">
        <div className="form-group">
          <label>Họ tên người yêu cầu:</label>
          <input type="text" />
        </div>
        <div className="form-group gender">
          <label>Giới tính:</label>
          <div className="radio-group">
            <label><input type="radio" name="gender" /> Nam</label>
            <label><input type="radio" name="gender" /> Nữ</label>
          </div>
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label>Số CMND/CCCD:</label>
          <input type="text" />
        </div>
        <div className="form-group">
          <label>Ngày cấp:</label>
          <input type="date" placeholder="mm/dd/yyyy" />
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label>Nơi cấp:</label>
          <input type="text" />
        </div>
        <div className="form-group">
          <label>Chọn phương thức lấy mẫu:</label>
          <div className="radio-group">
            <label>
              <input type="radio" name="sampleCollection" /> Lấy mẫu tại trung tâm
            </label>
            <label>
              <input type="radio" name="sampleCollection" /> Tự lấy mẫu tại nhà và gửi mẫu
            </label>
          </div>
        </div>
      </div>

      <div className="form-group">
        <label>Địa chỉ:</label>
        <input type="text" />
      </div>

      <div className="form-group">
        <label>Số điện thoại:</label>
        <input type="tel" />
      </div>

      <div className="form-group">
        <label>Email:</label>
        <input type="email" />
      </div>

      <div className="form-group">
        <label>Loại xét nghiệm:</label>
        <input type="text" />
      </div>

      <div className="samples-grid">
        <div className="sample-title">Người cần phân tích mẫu 1:</div>
        <div className="sample-title">Người cần phân tích mẫu 2:</div>
        
        <div className="form-group">
          <label>Họ và tên:</label>
          <input type="text" />
        </div>
        <div className="form-group">
          <label>Họ và tên:</label>
          <input type="text" />
        </div>

        <div className="form-group">
          <label>Ngày sinh:</label>
          <input type="date" />
        </div>
        <div className="form-group">
          <label>Ngày sinh:</label>
          <input type="date" />
        </div>

        <div className="form-group">
          <label>Giới tính:</label>
          <input type="text" />
        </div>
        <div className="form-group">
          <label>Giới tính:</label>
          <input type="text" />
        </div>

        <div className="form-group">
          <label>Năm sinh:</label>
          <input type="text" />
        </div>
        <div className="form-group">
          <label>Năm sinh:</label>
          <input type="text" />
        </div>
      </div>

      <div className="form-group">
        <label>Mối quan hệ:</label>
        <input type="text" />
      </div>

      <div className="form-group">
        <label>Mẫu xét nghiệm:</label>
        <input type="text" />
      </div>

      <div className="form-group">
        <label>Có tiền sử bệnh về máu, cấy ghép tủy không?</label>
        <div className="radio-group">
          <label><input type="radio" name="diseaseHistory" /> Có</label>
          <label><input type="radio" name="diseaseHistory" defaultChecked /> Không</label>
        </div>
      </div>

      <div className="form-group">
        <label>Có nhận máu trong 06 tháng gần đây không?</label>
        <div className="radio-group">
          <label><input type="radio" name="bloodTransfusion" /> Có</label>
          <label><input type="radio" name="bloodTransfusion" defaultChecked /> Không</label>
        </div>
      </div>

      <div className="form-group">
        <label>Kết quả nhận tại:</label>
        <div className="checkbox-group">
          <label><input type="checkbox" /> Nhận tại văn phòng</label>
          <label><input type="checkbox" /> Thư đảm bảo</label>
          <label><input type="checkbox" /> Email/zalo</label>
        </div>
      </div>

      <div className="form-group">
        <label>Địa chỉ nhận kết quả:</label>
        <input type="text" />
      </div>

      <div className="form-group">
        <label>Thời gian nhận kết quả:</label>
        <div className="radio-group">
          <label><input type="radio" name="deliveryTime" defaultChecked /> 3 ngày</label>
          <label><input type="radio" name="deliveryTime" /> 24h</label>
          <label><input type="radio" name="deliveryTime" /> 6h</label>
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