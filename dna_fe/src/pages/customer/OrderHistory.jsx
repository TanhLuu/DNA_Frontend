import React, { useState } from "react";
import "../../styles/customer/OrderHistory.css";
import useCustomerOrders from "../../hooks/Order/useOrderHistory";
import { useNavigate } from "react-router-dom";
import STATUS_LABELS from "../../constants/orderStatusLabels";
import StatusFilterBar from "../../constants/StatusFilterBar"; // ✅ Import filter

const OrderHistory = () => {
  const { filteredOrders, isLoading, error, serviceData } = useCustomerOrders();
  const [selectedStatus, setSelectedStatus] = useState(""); // ✅ trạng thái đang chọn
  const navigate = useNavigate();

  const formatDate = (dateStr) =>
    dateStr ? new Date(dateStr).toLocaleDateString("vi-VN") : "Không có";
  const formatPrice = (amount) =>
    amount ? amount.toLocaleString("vi-VN") + " VNĐ" : "Không có";

  const handleViewDetails = (orderId) => {
    navigate(`/customer/orders/${orderId}`);
  };

  if (isLoading)
    return (
      <div className="customer-order-history-loading">Đang tải dữ liệu...</div>
    );
  if (error) return <div className="customer-order-history-error">{error}</div>;

  // Bỏ đơn PENDING
  let nonPendingOrders = filteredOrders.filter(
    (order) => order.orderStatus !== "PENDING"
  );

  // ✅ Nếu có chọn trạng thái thì lọc thêm
  if (selectedStatus) {
    nonPendingOrders = nonPendingOrders.filter(
      (order) => order.orderStatus === selectedStatus
    );
  }

  return (
    <div className="customer-order-history-container">
      <h2 className="customer-order-history-title">Đơn hàng</h2>

      {/* ✅ Thanh lọc trạng thái */}
      <StatusFilterBar
        selectedStatus={selectedStatus}
        setSelectedStatus={setSelectedStatus}
      />

      <div className="customer-order-history-table-wrapper">
        <table className="customer-order-history-table">
          <thead>
            <tr>
              <th>Mã đơn</th>
              <th>Loại XN ADN</th>
              <th>Mục đích</th>
              <th>Ngày đăng ký</th>
              <th>Tổng phí</th>
              <th>Trạng thái</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {nonPendingOrders.length === 0 ? (
              <tr>
                <td colSpan="7" style={{ textAlign: "center", padding: "1rem" }}>
                  Không có đơn hàng phù hợp
                </td>
              </tr>
            ) : (
              nonPendingOrders.map((order) => (
                <tr key={order.orderId}>
                  <td>{order.orderId}</td>
                  <td>
                    {serviceData[order.serviceId]?.serviceName || "Không có"}
                  </td>
                  <td>
                    {serviceData[order.serviceId]?.serviceType || "Không có"}
                  </td>
                  <td>{formatDate(order.orderDate)}</td>
                  <td>{formatPrice(order.amount)}</td>
                  <td className="status-cell">
                    {STATUS_LABELS[order.orderStatus] || order.orderStatus}
                  </td>
                  <td>
                    <button
                      className="customer-order-history-action-btn"
                      onClick={() => handleViewDetails(order.orderId)}
                    >
                      Chi tiết đơn
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OrderHistory;
