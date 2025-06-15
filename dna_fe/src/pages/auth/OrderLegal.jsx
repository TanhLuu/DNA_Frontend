import React, { useState } from 'react';
import '../../styles/auth/OrderForm.css';

function OrderLegal() {
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
    samples: {
      person1: {
        name: '',
        dob: '',
        documentType: '',
        documentNumber: '',
        issueDate: '',
        issuePlace: '',
        nationality: '',
        address: ''
      },
      person2: {
        name: '',
        dob: '',
        documentType: '',
        documentNumber: '',
        issueDate: '',
        issuePlace: '',
        nationality: '',
        address: ''
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
    <div className="order-form">
      <h2 className="form-title">ĐƠN YÊU CẦU PHÂN TÍCH ADN HÀNH CHÍNH</h2>

      <div className="form-row">
        <div className="form-group">
          <label>Họ tên người yêu cầu:</label>
          <input type="text" value={formData.requesterName} 
            onChange={(e) => setFormData({...formData, requesterName: e.target.value})}
          />
        </div>
        <div className="form-group gender">
          <label>Giới tính:</label>
          <div className="radio-group">
            <label>
              <input type="radio" name="gender" checked={formData.gender === 'Nam'}
                onChange={() => setFormData({...formData, gender: 'Nam'})}
              /> Nam
            </label>
            <label>
              <input type="radio" name="gender" checked={formData.gender === 'Nữ'}
                onChange={() => setFormData({...formData, gender: 'Nữ'})}
              /> Nữ
            </label>
          </div>
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label>Số CMND/CCCD:</label>
          <input type="text" value={formData.idCard}
            onChange={(e) => setFormData({...formData, idCard: e.target.value})}
          />
        </div>
        <div className="form-group">
          <label>Ngày cấp:</label>
          <input type="date" value={formData.issueDate}
            onChange={(e) => setFormData({...formData, issueDate: e.target.value})}
          />
        </div>
      </div>

      <div className="form-group">
        <label>Nơi cấp:</label>
        <input type="text" value={formData.issuePlace}
          onChange={(e) => setFormData({...formData, issuePlace: e.target.value})}
        />
      </div>

      <div className="form-group">
        <label>Địa chỉ:</label>
        <input type="text" value={formData.address}
          onChange={(e) => setFormData({...formData, address: e.target.value})}
        />
      </div>

      <div className="form-group">
        <label>Số điện thoại:</label>
        <input type="tel" value={formData.phone}
          onChange={(e) => setFormData({...formData, phone: e.target.value})}
        />
      </div>

      <div className="form-group">
        <label>Email:</label>
        <input type="email" value={formData.email}
          onChange={(e) => setFormData({...formData, email: e.target.value})}
        />
      </div>

      <div className="form-group">
        <label>Loại xét nghiệm:</label>
        <input type="text" value={formData.testType}
          onChange={(e) => setFormData({...formData, testType: e.target.value})}
        />
      </div>

      <div className="samples-grid">
        <div className="sample-column">
          <h3>Người cần phân tích mẫu 1:</h3>
          <div className="form-group">
            <label>Họ và tên:</label>
            <input type="text" value={formData.samples.person1.name}
              onChange={(e) => setFormData({
                ...formData,
                samples: {
                  ...formData.samples,
                  person1: {...formData.samples.person1, name: e.target.value}
                }
              })}
            />
          </div>
          <div className="form-group">
            <label>Ngày sinh:</label>
            <input type="date" value={formData.samples.person1.dob}
              onChange={(e) => setFormData({
                ...formData,
                samples: {
                  ...formData.samples,
                  person1: {...formData.samples.person1, dob: e.target.value}
                }
              })}
            />
          </div>
          <div className="form-group">
            <label>Loại giấy tờ:</label>
            <input type="text" value={formData.samples.person1.documentType}
              onChange={(e) => setFormData({
                ...formData,
                samples: {
                  ...formData.samples,
                  person1: {...formData.samples.person1, documentType: e.target.value}
                }
              })}
            />
          </div>
          <div className="form-group">
            <label>Số/Quyển số:</label>
            <input type="text" value={formData.samples.person1.documentNumber}
              onChange={(e) => setFormData({
                ...formData,
                samples: {
                  ...formData.samples,
                  person1: {...formData.samples.person1, documentNumber: e.target.value}
                }
              })}
            />
          </div>
          <div className="form-group">
            <label>Ngày cấp:</label>
            <input type="date" value={formData.samples.person1.issueDate}
              onChange={(e) => setFormData({
                ...formData,
                samples: {
                  ...formData.samples,
                  person1: {...formData.samples.person1, issueDate: e.target.value}
                }
              })}
            />
          </div>
          <div className="form-group">
            <label>Nơi cấp:</label>
            <input type="text" value={formData.samples.person1.issuePlace}
              onChange={(e) => setFormData({
                ...formData,
                samples: {
                  ...formData.samples,
                  person1: {...formData.samples.person1, issuePlace: e.target.value}
                }
              })}
            />
          </div>
          <div className="form-group">
            <label>Quốc tịch:</label>
            <input type="text" value={formData.samples.person1.nationality}
              onChange={(e) => setFormData({
                ...formData,
                samples: {
                  ...formData.samples,
                  person1: {...formData.samples.person1, nationality: e.target.value}
                }
              })}
            />
          </div>
          <div className="form-group">
            <label>Địa chỉ:</label>
            <input type="text" value={formData.samples.person1.address}
              onChange={(e) => setFormData({
                ...formData,
                samples: {
                  ...formData.samples,
                  person1: {...formData.samples.person1, address: e.target.value}
                }
              })}
            />
          </div>
        </div>

        <div className="sample-column">
          <h3>Người cần phân tích mẫu 2:</h3>
          <div className="form-group">
            <label>Họ và tên:</label>
            <input type="text" value={formData.samples.person2.name}
              onChange={(e) => setFormData({
                ...formData,
                samples: {
                  ...formData.samples,
                  person2: {...formData.samples.person2, name: e.target.value}
                }
              })}
            />
          </div>
          <div className="form-group">
            <label>Ngày sinh:</label>
            <input type="date" value={formData.samples.person2.dob}
              onChange={(e) => setFormData({
                ...formData,
                samples: {
                  ...formData.samples,
                  person2: {...formData.samples.person2, dob: e.target.value}
                }
              })}
            />
          </div>
          <div className="form-group">
            <label>Loại giấy tờ:</label>
            <input type="text" value={formData.samples.person2.documentType}
              onChange={(e) => setFormData({
                ...formData,
                samples: {
                  ...formData.samples,
                  person2: {...formData.samples.person2, documentType: e.target.value}
                }
              })}
            />
          </div>
          <div className="form-group">
            <label>Số/Quyển số:</label>
            <input type="text" value={formData.samples.person2.documentNumber}
              onChange={(e) => setFormData({
                ...formData,
                samples: {
                  ...formData.samples,
                  person2: {...formData.samples.person2, documentNumber: e.target.value}
                }
              })}
            />
          </div>
          <div className="form-group">
            <label>Ngày cấp:</label>
            <input type="date" value={formData.samples.person2.issueDate}
              onChange={(e) => setFormData({
                ...formData,
                samples: {
                  ...formData.samples,
                  person2: {...formData.samples.person2, issueDate: e.target.value}
                }
              })}
            />
          </div>
          <div className="form-group">
            <label>Nơi cấp:</label>
            <input type="text" value={formData.samples.person2.issuePlace}
              onChange={(e) => setFormData({
                ...formData,
                samples: {
                  ...formData.samples,
                  person2: {...formData.samples.person2, issuePlace: e.target.value}
                }
              })}
            />
          </div>
          <div className="form-group">
            <label>Quốc tịch:</label>
            <input type="text" value={formData.samples.person2.nationality}
              onChange={(e) => setFormData({
                ...formData,
                samples: {
                  ...formData.samples,
                  person2: {...formData.samples.person2, nationality: e.target.value}
                }
              })}
            />
          </div>
          <div className="form-group">
            <label>Địa chỉ:</label>
            <input type="text" value={formData.samples.person2.address}
              onChange={(e) => setFormData({
                ...formData,
                samples: {
                  ...formData.samples,
                  person2: {...formData.samples.person2, address: e.target.value}
                }
              })}
            />
          </div>
        </div>
      </div>

      <div className="form-group">
        <label>Mối quan hệ:</label>
        <input type="text" value={formData.relationship}
          onChange={(e) => setFormData({...formData, relationship: e.target.value})}
        />
      </div>

      <div className="form-group">
        <label>Mẫu xét nghiệm:</label>
        <input type="text" value={formData.sampleType}
          onChange={(e) => setFormData({...formData, sampleType: e.target.value})}
        />
      </div>

      <div className="form-group">
        <label>Có tiền sử bệnh về máu, cấy ghép tủy không?</label>
        <div className="radio-group">
          <label>
            <input type="radio" name="diseaseHistory" checked={formData.hasDiseaseHistory}
              onChange={(e) => setFormData({...formData, hasDiseaseHistory: true})}
            /> Có
          </label>
          <label>
            <input type="radio" name="diseaseHistory" checked={!formData.hasDiseaseHistory}
              onChange={(e) => setFormData({...formData, hasDiseaseHistory: false})}
            /> Không
          </label>
        </div>
      </div>

      <div className="form-group">
        <label>Có nhận máu trong 06 tháng gần đây không?</label>
        <div className="radio-group">
          <label>
            <input type="radio" name="bloodTransfusion" checked={formData.hasRecentTransfusion}
              onChange={(e) => setFormData({...formData, hasRecentTransfusion: true})}
            /> Có
          </label>
          <label>
            <input type="radio" name="bloodTransfusion" checked={!formData.hasRecentTransfusion}
              onChange={(e) => setFormData({...formData, hasRecentTransfusion: false})}
            /> Không
          </label>
        </div>
      </div>

      <div className="form-group">
        <label>Kết quả nhận tại:</label>
        <div className="checkbox-group">
          <label>
            <input type="checkbox" checked={formData.resultDelivery.inPerson}
              onChange={(e) => setFormData({
                ...formData,
                resultDelivery: {...formData.resultDelivery, inPerson: e.target.checked}
              })}
            /> Nhận tại văn phòng
          </label>
          <label>
            <input type="checkbox" checked={formData.resultDelivery.mail}
              onChange={(e) => setFormData({
                ...formData,
                resultDelivery: {...formData.resultDelivery, mail: e.target.checked}
              })}
            /> Thư đảm bảo
          </label>
          <label>
            <input type="checkbox" checked={formData.resultDelivery.emailZalo}
              onChange={(e) => setFormData({
                ...formData,
                resultDelivery: {...formData.resultDelivery, emailZalo: e.target.checked}
              })}
            /> Email/zalo
          </label>
        </div>
      </div>

      <div className="form-group">
        <label>Địa chỉ nhận kết quả:</label>
        <input type="text" value={formData.deliveryAddress}
          onChange={(e) => setFormData({...formData, deliveryAddress: e.target.value})}
        />
      </div>

      <div className="form-group">
        <label>Thời gian nhận kết quả:</label>
        <div className="radio-group">
          <label>
            <input type="radio" name="deliveryTime" checked={formData.deliveryTime === '3ngay'}
              onChange={(e) => setFormData({...formData, deliveryTime: '3ngay'})}
            /> 3 ngày
          </label>
          <label>
            <input type="radio" name="deliveryTime" checked={formData.deliveryTime === '24h'}
              onChange={(e) => setFormData({...formData, deliveryTime: '24h'})}
            /> 24h
          </label>
        </div>
      </div>

      <div className="total-amount">
        TỔNG CHI PHÍ: ................VNĐ
      </div>

      <button type="submit" className="submit-button">Thanh toán</button>
    </div>
  );
}

export default OrderLegal;