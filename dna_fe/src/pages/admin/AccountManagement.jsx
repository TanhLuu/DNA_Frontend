import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useStaffInfo } from '../../hooks/Account/useStaffInfo';
import CreateStaff from '../../components/UI/Auth/CreateStaff';

const AccountManagement = () => {
  const [showPopup, setShowPopup] = useState(false);
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { id: currentUserId } = useStaffInfo();

  // Lấy danh sách tài khoản khi component mount
  useEffect(() => {
    fetchAccounts();
  }, []);

  const fetchAccounts = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:8080/api/account');
      setAccounts(response.data);
      setLoading(false);
    } catch (err) {
      setError('Lỗi khi tải danh sách tài khoản');
      console.error(err);
      setLoading(false);
    }
  };

  // Xử lý vô hiệu hóa tài khoản (set active = false)
  const handleDeactivate = async (id) => {
    if (window.confirm('Bạn có chắc muốn vô hiệu hóa tài khoản này?')) {
      try {
        await axios.delete(`http://localhost:8080/api/account/${id}`);
        setAccounts(accounts.map(account => 
          account.id === id ? { ...account, active: false } : account
        ));
        if (id === currentUserId) {
          localStorage.clear();
          window.location.href = '/';
        }
        alert('Tài khoản đã được vô hiệu hóa');
      } catch (err) {
        setError('Lỗi khi vô hiệu hóa tài khoản');
        console.error(err);
      }
    }
  };

  // Xử lý kích hoạt tài khoản (set active = true)
  const handleActivate = async (id) => {
    if (window.confirm('Bạn có chắc muốn kích hoạt lại tài khoản này?')) {
      try {
        await axios.post(`http://localhost:8080/api/account/${id}/activate`);
        setAccounts(accounts.map(account => 
          account.id === id ? { ...account, active: true } : account
        ));
        alert('Tài khoản đã được kích hoạt');
      } catch (err) {
        setError('Lỗi khi kích hoạt tài khoản');
        console.error(err);
      }
    }
  };

  // Xử lý cập nhật thông tin tài khoản
  const handleUpdate = async (id, accountData) => {
    try {
      const response = await axios.put(`http://localhost:8080/api/account/${id}`, {
        email: accountData.email,
        phone: accountData.phone,
        fullName: accountData.fullName
      });
      setAccounts(accounts.map(account => 
        account.id === id ? response.data : account
      ));
      alert('Cập nhật thông tin thành công');
    } catch (err) {
      setError('Lỗi khi cập nhật thông tin');
      console.error(err);
    }
  };

  // Xử lý sau khi tạo tài khoản thành công
  const handleStaffCreated = (newAccount) => {
    setAccounts([...accounts, newAccount]);
    setShowPopup(false);
    alert('Tài khoản đã được tạo thành công');
  };

  if (loading) return <div className="text-center py-8">Đang tải...</div>;
  if (error) return <div className="text-center py-8 text-red-500">{error}</div>;

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Quản lý tài khoản</h1>
        <button
          className="bg-blue-600 text-white px-4 py-3 rounded hover:bg-blue-700"
          onClick={() => setShowPopup(true)}
        >
          Tạo tài khoản
        </button>
      </div>
      
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tên</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Số điện thoại</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vai trò</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Trạng thái</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Hành động</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {accounts.map((account) => (
              <tr key={account.id}>
                <td className="px-6 py-4 whitespace-nowrap">{account.id}</td>
                <td className="px-6 py-4 whitespace-nowrap">{account.fullName}</td>
                <td className="px-6 py-4 whitespace-nowrap">{account.email}</td>
                <td className="px-6 py-4 whitespace-nowrap">{account.phone}</td>
                <td className="px-6 py-4 whitespace-nowrap">{account.role}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    account.active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {account.active ? 'Hoạt động' : 'Đã vô hiệu'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {account.active ? (
                    <button
                      onClick={() => handleDeactivate(account.id)}
                      className="text-red-600 hover:text-red-900 mr-4"
                    >
                      Vô hiệu hóa
                    </button>
                  ) : (
                    <button
                      onClick={() => handleActivate(account.id)}
                      className="text-green-600 hover:text-green-900 mr-4"
                    >
                      Kích hoạt
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {showPopup && <CreateStaff onClose={() => setShowPopup(false)} onSuccess={handleStaffCreated} />}
    </div>
  );
};

export default AccountManagement;