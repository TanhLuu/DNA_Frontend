import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  getTestOrderById,
  getAccountByCustomerId,
  getCustomerById,
  getServiceById,
} from "../../api/customerOrderApi";
import { getStaffById, getAccountById } from "../../api/adminOrderApi";
import TestSampleForm from "../../pages/admin/TestSampleForm";
import '../../styles/customer/OrderDetail.css';

const OrderDetailCustomer = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
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
    PENDING: "Đặt lịch / Đăng ký",
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

  const handleBack = () => navigate(-1);

  const shouldShowTestSampleForm = () =>
    service?.serviceType === "Dân sự" &&
    order?.sampleMethod === "home" &&
    order?.orderStatus === "SEND_KIT";

  if (loading) return <div>Đang tải...</div>;
  if (!order) return <div>Không tìm thấy đơn hàng</div>;

  return (
    <div className="OrderDetailCustomer">
      <div>
        {updateError && (
          <div className="text-red-500">{updateError}</div>
        )}
        <h2 className="text-2xl font-bold mb-4">
          Chi tiết đơn hàng #{order.orderId}
        </h2>

        <section className="mb-6">
          <h3 className="text-lg font-semibold">Thông tin khách hàng</h3>
          <div className="grid grid-cols-2 gap-4">
            <p><strong>Họ tên:</strong> {account?.fullName || "N/A"}</p>
            <p><strong>SĐT:</strong> {account?.phone || "N/A"}</p>
            <p><strong>Email:</strong> {account?.email || "N/A"}</p>
            <p><strong>Giới tính:</strong> {customer?.gender || "N/A"}</p>
            <p><strong>Ngày sinh:</strong> {formatDate(customer?.dateOfBirth)}</p>
            <p><strong>Địa chỉ:</strong> {customer?.address || "N/A"}</p>
            <p><strong>Loại giấy tờ:</strong> {customer?.documentType || "N/A"}</p>
            <p><strong>Số giấy tờ:</strong> {customer?.cccd || "N/A"}</p>
            <p><strong>Nơi cấp:</strong> {customer?.placeOfIssue || "N/A"}</p>
            <p><strong>Ngày cấp:</strong> {formatDate(customer?.dateOfIssue)}</p>
          </div>
        </section>

        <section className="mb-6">
          <h3 className="text-lg font-semibold">Thông tin dịch vụ</h3>
          <div className="grid grid-cols-2 gap-4">
            <p><strong>Tên dịch vụ:</strong> {service?.serviceName || "N/A"}</p>
            <p><strong>Loại dịch vụ:</strong> {service?.serviceType || "N/A"}</p>
            <p>
              <strong>Thời gian xét nghiệm:</strong>{" "}
              {service?.timeTest ? `${service.timeTest} ngày` : "N/A"}
            </p>
          </div>
        </section>

        <section className="mb-6">
          <h3 className="text-lg font-semibold">Thông tin đơn hàng</h3>
          <div className="grid grid-cols-2 gap-4">
            <p>
              <strong>Trạng thái:</strong>{" "}
              {STATUS_LABELS[order?.orderStatus] || "N/A"}
            </p>
            <p><strong>Ngày đặt:</strong> {formatDate(order?.orderDate)}</p>
            <p>
              <strong>Hình thức thu mẫu:</strong>{" "}
              {order?.sampleMethod === "center" ? "Tại trung tâm" : "Tại nhà"}
            </p>
            <p><strong>Số lượng mẫu:</strong> {order?.sampleQuantity || "N/A"}</p>
            <p>
              <strong>Phương thức nhận kết quả:</strong>{" "}
              {order?.resultDeliveryMethod || "N/A"}
            </p>
            <p>
              <strong>Địa chỉ nhận kết quả:</strong>{" "}
              {order?.resultDeliverAddress || "N/A"}
            </p>
            <p><strong>Giá:</strong> {formatPrice(order?.amount)}</p>
          </div>
        </section>

        <section className="mb-6">
          <h3 className="text-lg font-semibold">Thông tin nhân viên phụ trách</h3>
          <div className="grid grid-cols-2 gap-4">
            <p>
              <strong>Nhân viên đăng ký:</strong>{" "}
              {registrationStaff?.fullName || "Chưa có"}
            </p>
            <p>
              <strong>Nhân viên xét nghiệm:</strong>{" "}
              {testingStaff?.fullName || "Chưa có"}
            </p>
          </div>
        </section>

        {shouldShowTestSampleForm() && (
          <section className="mb-6">
            <button
              className="bg-blue-500 text-white p-2 rounded mt-4 hover:bg-blue-600"
              onClick={() => setShowModal(true)}
            >
              Điền Test Samples
            </button>
          </section>
        )}

        <div>
          <button
            className="bg-gray-500 text-white p-2 rounded hover:bg-gray-600"
            onClick={handleBack}
          >
            Quay lại
          </button>
        </div>
      </div>
      {showModal && shouldShowTestSampleForm() && (
        <TestSampleForm
          orderId={orderId}
          customerId={order.customerId}
          sampleQuantity={order.sampleQuantity || 0}
          serviceType={service?.serviceType}
          sampleMethod={order?.sampleMethod}
          isCustomer={true}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  );
};

export default OrderDetailCustomer;