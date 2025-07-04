import React, { useState, useEffect } from 'react';
import '../../styles/components/profile.css';
import { fetchAccountInfo, updateAccountInfo, getStaffByAccountId, updateStaff } from '../../api/accountApi';
import { useAuth } from '../../hooks/Account/useAuth';

const AdminProfile = ({ isOpen, onClose }) => {
  const [account, setAccount] = useState({
    id: null,
    fullName: '',
    email: '',
    phone: ''
  });
  const [fingerprintImage, setFingerprintImage] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const { resetPassword, error: authError, setError: setAuthError, setSuccess: setAuthSuccess } = useAuth();

  const [passwordModalOpen, setPasswordModalOpen] = useState(false);
  const [newPass, setNewPass] = useState('');
  const [confirmPass, setConfirmPass] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');

  useEffect(() => {
    if (isOpen) {
      const loadAccountInfo = async () => {
        try {
          setIsLoading(true);
          const accountData = await fetchAccountInfo();
          const staffData = await getStaffByAccountId(accountData.id);
          setAccount({
            id: accountData.id || null,
            fullName: accountData.fullName || '',
            email: accountData.email || '',
            phone: accountData.phone || ''
          });
          setFingerprintImage(staffData.fingerprint || '');
        } catch (err) {
          setError('Không thể tải thông tin tài khoản: ' + (err.response?.data?.message || err.message));
        } finally {
          setIsLoading(false);
        }
      };
      loadAccountInfo();
    }
  }, [isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAccount((prev) => ({ ...prev, [name]: value }));
  };

  const handleFingerprintImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFingerprintImage(reader.result); // Lưu base64 của ảnh
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    try {
      setIsSubmitting(true);
      // Cập nhật thông tin tài khoản
      await updateAccountInfo(account.id, {
        fullName: account.fullName,
        email: account.email,
        phone: account.phone
      });
      // Cập nhật thông tin nhân viên (bao gồm fingerprint)
      const staffData = await getStaffByAccountId(account.id);
      await updateStaff(staffData.id, {
        accountId: account.id,
        fingerprint: fingerprintImage, // Sử dụng ảnh base64
        role: staffData.role
      });
      setSuccess('Cập nhật hồ sơ thành công!');
      // Cập nhật localStorage
      localStorage.setItem('fullName', account.fullName);
      localStorage.setItem('email', account.email);
      localStorage.setItem('phone', account.phone);
      setTimeout(() => {
        setSuccess('');
      }, 1500);
    } catch (err) {
      setError('Lưu thông tin thất bại: ' + (err.response?.data?.message || err.message));
    } finally {
      setIsSubmitting(false);
    }
  };

  const closePasswordModal = () => {
    setPasswordModalOpen(false);
    setNewPass('');
    setConfirmPass('');
    setPasswordSuccess('');
    setAuthError('');
  };

  const handlePasswordChange = async () => {
    if (newPass !== confirmPass) {
      setAuthError('Mật khẩu không khớp.');
      return;
    }
    try {
      await resetPassword(newPass);
      setPasswordSuccess('Đổi mật khẩu thành công!');
      setTimeout(closePasswordModal, 1500);
    } catch (err) {
      setAuthError('Đổi mật khẩu thất bại: ' + (err.response?.data?.message || err.message));
    }
  };

  if (!isOpen) return null;

  return (
    <div className="profile-modal-overlay" onClick={onClose}>
      <div className="profile-modal" onClick={(e) => e.stopPropagation()}>
        <button className="profile-modal-close" onClick={onClose}>×</button>
        {isLoading ? (
          <div style={{ padding: '2rem', textAlign: 'center' }}>Đang tải dữ liệu...</div>
        ) : (
          <>
            <h3>Thông tin cá nhân</h3>
            {error && <p className="profile-error">{error}</p>}
            {success && <p className="profile-success">{success}</p>}

            <div className="profile-grid">
              <div className="profile-field">
                <label>Họ tên</label>
                <input type="text" name="fullName" value={account.fullName} onChange={handleChange} />
              </div>
              <div className="profile-field">
                <label>Số điện thoại</label>
                <input type="text" name="phone" value={account.phone} onChange={handleChange} />
              </div>
              <div className="profile-field">
                <label>Email</label>
                <input type="email" name="email" value={account.email} onChange={handleChange} />
              </div>
              <div className="profile-field">
                <label>Ảnh vân tay</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFingerprintImageChange}
                />
                {fingerprintImage && (
                  <img
                    src={fingerprintImage}
                    alt="Ảnh vân tay"
                    style={{ maxWidth: '100px', marginTop: '10px' }}
                  />
                )}
              </div>
            </div>

            <div className="profile-actions">
              <button className="profile-btn profile-btn-dark" onClick={() => setPasswordModalOpen(true)}>
                Đổi mật khẩu
              </button>
              <button
                className="profile-btn profile-btn-accent"
                onClick={handleSave}
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Đang lưu...' : 'Lưu hồ sơ'}
              </button>
            </div>

            {passwordModalOpen && (
              <div className="profile-modal-overlay" onClick={closePasswordModal}>
                <div className="profile-modal" onClick={(e) => e.stopPropagation()}>
                  <button className="profile-modal-close" onClick={closePasswordModal}>×</button>
                  <h3>Đổi mật khẩu</h3>
                  <input
                    type="password"
                    placeholder="Mật khẩu mới"
                    value={newPass}
                    onChange={(e) => setNewPass(e.target.value)}
                  />
                  <input
                    type="password"
                    placeholder="Xác nhận mật khẩu"
                    value={confirmPass}
                    onChange={(e) => setConfirmPass(e.target.value)}
                  />
                  <button className="profile-btn profile-btn-accent" onClick={handlePasswordChange}>
                    Cập nhật
                  </button>
                  {passwordSuccess && <p className="profile-success">{passwordSuccess}</p>}
                  {authError && <p className="profile-error">{authError}</p>}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default AdminProfile;