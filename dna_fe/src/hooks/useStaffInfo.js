import { useEffect, useState } from 'react';
import { getStaffByAccountId } from '../api/accountApi';

export const useStaffInfo = () => {
  const [staffInfo, setStaffInfo] = useState({ name: '', role: '' });

  useEffect(() => {
    const fullName = localStorage.getItem('fullName');
    const role = localStorage.getItem('role');
    const accountId = localStorage.getItem('accountId');

    if (!role || !fullName) return;

    if (role === 'STAFF') {
      getStaffByAccountId(accountId)
        .then((staff) => {
          const translated =
            staff.role === 'NORMAL_STAFF'
              ? 'NORMAL STAFF'
              : staff.role === 'LAB_STAFF'
              ? 'LAB STAFF'
              : 'Nhân viên';
          setStaffInfo({ name: fullName, role: translated });
        })
        .catch(() => {
          setStaffInfo({ name: fullName, role: 'Nhân viên' });
        });
    } else if (role === 'MANAGER') {
      setStaffInfo({ name: fullName, role: 'Quản lý' });
    } else {
      setStaffInfo({ name: fullName, role: 'Người dùng' });
    }
  }, []);

  return staffInfo;
};
