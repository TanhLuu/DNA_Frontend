import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../styles/components/shared/profile.css';
import { createCustomer, getCustomerByAccountId, saveCustomerProfile } from '../../api/customerApi';

const Profile = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    birthDate: '',
    gender: '',
    documentType: '',
    issueDate: '',
    issuePlace: '',
    address: '',
  });

  const [accountInfo, setAccountInfo] = useState({
    name: '',
    phone: '',
    email: '',
  });

  useEffect(() => {
    const name = localStorage.getItem('fullName') || '';
    const phone = localStorage.getItem('phone') || '';
    const email = localStorage.getItem('email') || '';
    setAccountInfo({ name, phone, email });
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
  e.preventDefault();

  const requiredFields = ['birthDate', 'gender', 'documentType', 'address'];
  if (formData.documentType) {
    requiredFields.push('issueDate', 'issuePlace');
  }

  const isValid = requiredFields.every((field) => formData[field]?.trim());
  if (!isValid) {
    alert('Vui lòng điền đầy đủ tất cả thông tin cần thiết.');
    return;
  }

  try {
    const accountId = localStorage.getItem('accountId');
    if (!accountId) {
      alert('Không tìm thấy ID tài khoản. Vui lòng đăng nhập lại.');
      return;
    }

    const payload = {
      accountId: parseInt(accountId),
      dateOfBirth: formData.birthDate,
      gender: formData.gender,
      documentType: formData.documentType,
      address: formData.address,
      dateOfIssue: formData.issueDate,
      placeOfIssue: formData.issuePlace,
    };

    // 🔍 Kiểm tra khách hàng đã tồn tại chưa
    const existingCustomer = await getCustomerByAccountId(accountId);

    if (existingCustomer?.id) {
      // ✅ Nếu đã có → gọi PUT để cập nhật
      await saveCustomerProfile({ ...payload, id: existingCustomer.id });
    } else {
      // ✅ Nếu chưa có → gọi POST để tạo mới
      await createCustomer(payload);
    }

    alert('Hồ sơ đã được cập nhật thành công!');
    navigate('/');
  } catch (err) {
    console.error(err);
    alert('Lỗi khi lưu hồ sơ. Vui lòng thử lại.');
  }
};

  return (
    <div className="profile-container">
      <div className="profile-card">
        <h2>Cập nhật hồ sơ cá nhân</h2>
        <form onSubmit={handleSubmit} className="profile-form">
          <div>
            <label>Họ tên</label>
            <input type="text" value={accountInfo.name} disabled />
          </div>

          <div>
            <label>Số điện thoại</label>
            <input type="text" value={accountInfo.phone} disabled />
          </div>

          <div>
            <label>Email</label>
            <input type="email" value={accountInfo.email} disabled />
          </div>

          <div>
            <label>Ngày sinh</label>
            <input type="date" name="birthDate" value={formData.birthDate} onChange={handleChange} />
          </div>

          <div>
            <label>Giới tính</label>
            <select name="gender" value={formData.gender} onChange={handleChange}>
              <option value="">-- Chọn --</option>
              <option value="Nam">Nam</option>
              <option value="Nữ">Nữ</option>
            </select>
          </div>

          <div>
            <label>Địa chỉ</label>
            <input type="text" name="address" value={formData.address} onChange={handleChange} />
          </div>

          <div>
            <label>Loại giấy tờ</label>
            <select name="documentType" value={formData.documentType} onChange={handleChange}>
              <option value="">-- Chọn --</option>
              <option value="CCCD">CCCD</option>
              <option value="Hộ chiếu">Hộ chiếu</option>
              <option value="Giấy khai sinh">Giấy khai sinh</option>
            </select>
          </div>

          {formData.documentType && (
            <>
              <div>
                <label>Ngày cấp</label>
                <input type="date" name="issueDate" value={formData.issueDate} onChange={handleChange} />
              </div>

              <div>
                <label>Nơi cấp</label>
                <input type="text" name="issuePlace" value={formData.issuePlace} onChange={handleChange} />
              </div>
            </>
          )}

          <div className="profile-actions">
            <button type="submit" className="btn-save">Lưu hồ sơ</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Profile;
