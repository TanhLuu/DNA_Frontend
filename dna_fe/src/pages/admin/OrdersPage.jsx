import React from "react";
import '../../styles/admin/ordersPage.css';


const OrdersPage = () => {
  return (
    <div className="orders-container">
      {/* Buttons */}
      <div className="orders-buttons">
        <button className="btn btn-red">Đặt lịch/Đăng ký</button>
        <button className="btn btn-gray">Chuẩn bị lấy mẫu</button>
        <button className="btn btn-yellow">Thu thập mẫu</button>
        <button className="btn btn-light-blue">Chuyển mẫu</button>
        <button className="btn btn-blue">Xét nghiệm</button>
        <button className="btn btn-green">Hoàn thành</button>
        <button className="btn btn-dark-blue">Tất cả</button>
      </div>

      {/* Table */}
      <div className="orders-table-wrapper">
        <table className="orders-table">
          <thead>
            <tr>
              <th>Mã đơn</th>
              <th>Họ tên</th>
              <th>SĐT</th>
              <th>Email</th>
              <th>Loại XN ADN</th>
              <th>Mục đích</th>
              <th>Địa chỉ</th>
              <th>Hình thức thu mẫu</th>
              <th>Thời gian trả kết quả</th>
              <th>Ngày đăng ký</th>
              <th>Tổng phí</th>
              <th>Trạng thái</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>...</td>
              <td>...</td>
              <td>...</td>
              <td>...</td>
              <td>...</td>
              <td>...</td>
              <td>...</td>
              <td><span className="pill">Tại trung tâm</span></td>
              <td>...</td>
              <td>...</td>
              <td>...</td>
              <td className="status">Xét nghiệm</td>
              <td>
                <button className="action-btn">Cập nhật đơn</button>
                <button className="action-btn">Chi tiết đơn</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OrdersPage;
