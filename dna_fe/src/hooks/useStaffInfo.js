import { useEffect, useState } from 'react';
import { getStaffByAccountId } from '../api/accountApi';

export const useStaffInfo = () => {
  const [staffInfo, setStaffInfo] = useState({
    name: '',
    role: '',
    staffId: null
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fullName = localStorage.getItem('fullName');
    const role = localStorage.getItem('role');
    const accountId = localStorage.getItem('accountId');
    const staffId = localStorage.getItem('staffId'); // Lấy staffId từ localStorage

    // Ghi log để kiểm tra dữ liệu localStorage
    console.log('localStorage:', { fullName, role, accountId, staffId });

    if (!role || !fullName || !accountId) {
      setError('Thiếu thông tin đăng nhập (fullName, role, hoặc accountId). Vui lòng đăng nhập lại.');
      setIsLoading(false);
      return;
    }

    const fetchStaffInfo = async () => {
      try {
        setIsLoading(true);
        let translatedRole = 'Nhân viên';

        if (role === 'STAFF' || role === 'MANAGER') {
          const staff = await getStaffByAccountId(accountId);
          console.log('API getStaffByAccountId response:', staff);

          translatedRole =
            staff.role === 'NORMAL_STAFF'
              ? 'NORMAL STAFF'
              : staff.role === 'LAB_STAFF'
              ? 'LAB STAFF'
              : role === 'MANAGER'
              ? 'Quản lý'
              : 'Nhân viên';
        } else {
          translatedRole = 'Người dùng';
        }

        setStaffInfo({
          name: fullName,
          role: translatedRole,
          staffId: staffId ? parseInt(staffId) : null // Sử dụng staffId từ localStorage
        });
      } catch (err) {
        console.error('Lỗi khi lấy thông tin nhân viên:', err);
        setError('Không thể tải thông tin nhân viên: ' + (err.response?.data?.message || err.message));
        setStaffInfo({
          name: fullName || 'Nhân viên',
          role: 'Nhân viên',
          staffId: staffId ? parseInt(staffId) : null
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchStaffInfo();
  }, []);

  return { ...staffInfo, isLoading, error };
};