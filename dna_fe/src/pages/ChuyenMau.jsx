import React, { useEffect, useState } from "react";
import axios from "axios";
import "../styles/chuyenmau.css";

const ChuyenMau = ({ customerId }) => {
  const [customer, setCustomer] = useState(null);
  const [transferInfo, setTransferInfo] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const customerRes = await axios.get(`/api/customer/${customerId}`);
        setCustomer(customerRes.data);

        const transferRes = await axios.get(`/api/transfer/${customerId}`);
        setTransferInfo(transferRes.data);

        setLoading(false);
      } catch (error) {
        setLoading(false);
        alert("Lỗi khi lấy dữ liệu từ server!");
      }
    };

    fetchData();
  }, [customerId]);

  if (loading) return <div>Đang tải dữ liệu...</div>;
  if (!customer || !transferInfo) return <div>Không có dữ liệu.</div>;

  return (
    <div className="chuyenmau-container">
      <div className="customer-info">
        <h3>Thông tin khách hàng</h3>
        <div><b>Họ và tên:</b> {customer.name}</div>
        <div><b>Ngày sinh:</b> {customer.dob}</div>
        <div><b>Giới tính:</b> {customer.gender}</div>
        <div><b>Số điện thoại:</b> {customer.phone}</div>
        <div><b>Địa chỉ:</b> {customer.address}</div>
        <div><b>Email:</b> {customer.email}</div>
        <div><b>Mã đơn:</b> {customer.orderCode}</div>
        <div><b>Ngày đặt lịch:</b> {customer.bookingDate}</div>
      </div>
      <div className="chuyenmau-form-section">
        <h2 className="form-title">Chuyển mẫu</h2>
        <table className="chuyenmau-table">
          <tbody>
            <tr>
              <td className="label">Nhân viên gửi mẫu:</td>
              <td>{transferInfo.staffSend}</td>
            </tr>
            <tr>
              <td className="label">Thời gian chuyển mẫu</td>
              <td>{transferInfo.transferTime}</td>
            </tr>
            <tr>
              <td className="label">Bác sĩ xét nghiệm</td>
              <td>{transferInfo.doctor}</td>
            </tr>
            <tr>
              <td className="label highlight">Thời gian bắt đầu<br />xét nghiệm</td>
              <td className="highlight-value">{transferInfo.startTestTime}</td>
            </tr>
          </tbody>
        </table>
        <div className="chuyenmau-actions">
          <button className="btn btn-primary">Xác nhận</button>
        </div>
      </div>
    </div>
  );
};

export default ChuyenMau;