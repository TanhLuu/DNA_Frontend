// src/pages/admin/OrderList.jsx
import React, { useEffect, useState } from "react";
import { getOrders } from "../../api/adminApi";
import AdminLayout from "../../components/Shared/AdminLayout";


const OrderList = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    async function fetchOrders() {
      const data = await getOrders();
      setOrders(data);
    }
    fetchOrders();
  }, []);

  return (
    <AdminLayout>
      <div>
        <h1 className="text-2xl font-bold mb-4">Danh sách đơn xét nghiệm</h1>
        <div className="overflow-x-auto bg-white rounded-lg shadow">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-200">
              <tr>
                <th className="px-4 py-2">Mã đơn</th>
                <th className="px-4 py-2">Họ tên</th>
                <th className="px-4 py-2">SĐT</th>
                <th className="px-4 py-2">Email</th>
                <th className="px-4 py-2">Loại XN</th>
                <th className="px-4 py-2">Mục đích</th>
                <th className="px-4 py-2">Địa chỉ</th>
                <th className="px-4 py-2">Hình thức</th>
                <th className="px-4 py-2">Trả kết quả</th>
                <th className="px-4 py-2">Đăng ký</th>
                <th className="px-4 py-2">Phí</th>
                <th className="px-4 py-2">Trạng thái</th>
                <th className="px-4 py-2">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order, index) => (
                <tr key={index} className="border-t">
                  <td className="px-4 py-2">{order.code}</td>
                  <td className="px-4 py-2">{order.fullName}</td>
                  <td className="px-4 py-2">{order.phone}</td>
                  <td className="px-4 py-2">{order.email}</td>
                  <td className="px-4 py-2">{order.testType}</td>
                  <td className="px-4 py-2">{order.purpose}</td>
                  <td className="px-4 py-2">{order.address}</td>
                  <td className="px-4 py-2">{order.method}</td>
                  <td className="px-4 py-2">{order.resultTime}</td>
                  <td className="px-4 py-2">{order.registerDate}</td>
                  <td className="px-4 py-2">{order.price} VND</td>
                  <td className="px-4 py-2 font-semibold">{order.status}</td>
                  <td className="px-4 py-2 space-x-2">
                    <button className="bg-green-500 text-white px-2 py-1 rounded">Cập nhật</button>
                    <button className="bg-blue-500 text-white px-2 py-1 rounded">Chi tiết</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
};

export default OrderList;
