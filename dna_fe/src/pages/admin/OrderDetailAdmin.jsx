import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  getTestOrderById,
  getAccountByCustomerId,
  getCustomerById,
  getServiceById,
  getStaffById,
  getAccountById,
} from "../../api/adminOrderApi";
import '../../styles/admin/OrderDetailAdmin.css';
import TestSampleForm from "./TestSampleForm";

const OrderDetailAdmin = () => {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [customer, setCustomer] = useState(null);
  const [account, setAccount] = useState(null);
  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updateError, setUpdateError] = useState(null);
  const [registrationStaff, setRegistrationStaff] = useState(null);
  const [testingStaff, setTestingStaff] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const formatDate = (date) =>
    date ? new Date(date).toLocaleDateString("vi-VN") : "N/A";

  const formatPrice = (p) => (p ? p.toLocaleString("vi-VN") + " VNĐ" : "N/A");

  const STATUS_LABELS = {
    CONFIRM: "Đặt lịch / Đăng ký",
    SEND_KIT: "Đã gửi kit",
    SEND_SAMPLE: "Đã gửi mẫu lại trung tâm",
    COLLECT_SAMPLE: "Đã thu mẫu",
    TESTED: "Đã xét nghiệm",
    COMPLETED: "Hoàn thành",
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const orderData = await getTestOrderById(orderId);
        setOrder(orderData);

        const accountInfo = await getAccountByCustomerId(orderData.customerId);
        const customerInfo = await getCustomerById(orderData.customerId);
        setAccount(accountInfo);
        setCustomer(customerInfo);

        const serviceInfo = await getServiceById(orderData.serviceId);
        setService(serviceInfo);

        if (orderData.registrationStaffId) {
          const regStaffInfo = await getStaffById(orderData.registrationStaffId);
          const regAccountInfo = await getAccountById(regStaffInfo.accountId);
          setRegistrationStaff(regAccountInfo);
        }
        if (orderData.testingStaffId) {
          const testStaffInfo = await getStaffById(orderData.testingStaffId);
          const testAccountInfo = await getAccountById(testStaffInfo.accountId);
          setTestingStaff(testAccountInfo);
        }
      } catch (err) {
        console.error("Lỗi khi tải dữ liệu:", err);
        setUpdateError("Lỗi khi tải dữ liệu đơn hàng.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [orderId]);

  if (loading) return <div>Đang tải...</div>;
  if (!order) return <div>Không tìm thấy đơn hàng</div>;

  return (
    <div className="OrderDetailAdmin">
      <div>
        {updateError && (
          <div className="text-red-500">{updateError}</div>
        )}
        <div className="OrderDetailTitle">
          <div className="DetailHeader">
            <div className="DetailItem">
              <span className="label">MÃ ĐƠN</span>
              <span className="value">#{order.orderId}</span>
            </div>
            <div className="divider" />
            <div className="DetailItem">
              <span className="label">TÊN DỊCH VỤ</span>
              <span className="value">{service?.serviceName || "N/A"}</span>
            </div>
            <div className="divider" />
            <div className="DetailItem">
              <span className="label">LOẠI DỊCH VỤ</span>
              <span className="value">{service?.serviceType || "N/A"}</span>
            </div>
            <div className="divider" />
            <div className="DetailItem">
              <span className="label">THỜI GIAN XÉT NGHIỆM</span>
              <span className="value">{service?.timeTest ? `${service.timeTest} ngày` : "N/A"}</span>
            </div>
            <div className="divider" />
            <div className="DetailItem">
              <span className="label">NGÀY ĐẶT</span>
              <span className="value">{formatDate(order?.orderDate)}</span>
            </div>
            <div className="divider" />
            <div className="DetailItem">
              <span className="label">NHÂN VIÊN THU MẪU</span>
              <span className="value">{registrationStaff?.fullName || "Chưa có"}</span>
            </div>
            <div className="divider" />
            <div className="DetailItem">
              <span className="label">NHÂN VIÊN XÉT NGHIỆM</span>
              <span className="value">{testingStaff?.fullName || "Chưa có"}</span>
            </div>
            <div className="divider" />
            <div className="DetailItem">
              <span className="label">TRẠNG THÁI</span>
              <span className="value">{STATUS_LABELS[order?.orderStatus] || "N/A"}</span>
            </div>
          </div>
          <div className="OrderDetailSections">
            <div className="OrderColumn">
              <h3>Thông tin khách hàng</h3>
              <div className="customer-info-3col">
                <p><strong>Họ tên:</strong> {account?.fullName || "N/A"}</p>
                <p><strong>Ngày sinh:</strong> {formatDate(customer?.dateOfBirth)}</p>
                <p><strong>Giới tính:</strong> {customer?.gender || "N/A"}</p>
                <p><strong>SĐT:</strong> {account?.phone || "N/A"}</p>
                <p><strong>Loại giấy tờ:</strong> {customer?.documentType || "N/A"}</p>
                <p><strong>Số giấy tờ:</strong> {customer?.cccd || "N/A"}</p>
                <p><strong>Ngày cấp:</strong> {formatDate(customer?.dateOfIssue)}</p>
                <p><strong>Nơi cấp:</strong> {customer?.placeOfIssue || "N/A"}</p>
                <p><strong>Email:</strong> {account?.email || "N/A"}</p>
                <p><strong>Địa chỉ:</strong> {customer?.address || "N/A"}</p>
              </div>
            </div>
            <div className="OrderColumn order-info-right">
              <h3>Thông tin đơn hàng</h3>
              <div>
                
                <p><strong>Hình thức thu mẫu:</strong> {order?.sampleMethod === "center" ? "Tại trung tâm" : "Tại nhà"}</p>
                <p><strong>Số lượng mẫu:</strong> {order?.sampleQuantity || "N/A"}</p>
                <p><strong>Phương thức nhận kết quả:</strong> {order?.resultDeliveryMethod || "N/A"}</p>
                <p><strong>Địa chỉ nhận kết quả:</strong> {order?.resultDeliverAddress || "N/A"}</p>
                <p><strong>Giá:</strong> {formatPrice(order?.amount)}</p>
                <button
                  className="bg-blue-500 text-white p-2 rounded mt-4 hover:bg-blue-600"
                  onClick={() => setShowModal(true)}
                >
                  Điền Test Samples
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      {showModal && (
        <TestSampleForm
          orderId={orderId}
          customerId={order.customerId}
          sampleQuantity={order.sampleQuantity || 0}
          serviceType={service?.serviceType}
          sampleMethod={order?.sampleMethod}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  );
};

export default OrderDetailAdmin;