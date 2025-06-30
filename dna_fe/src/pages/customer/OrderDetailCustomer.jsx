import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  getTestOrderById,
  getAccountByCustomerId,
  getCustomerById,
  getServiceById,
  updateTestOrder,
} from "../../api/customerOrderApi";
import { getStaffById, getAccountById } from "../../api/adminOrderApi";
import TestSampleForm from "../../components/Order/TestSampleForm";
import TestSampleDetail from "../../components/Order/TestSampleDetail";
import TestResultDetail from "../../components/Order/TestResultDetail";
import "../../styles/customer/OrderDetailCustomer.css";

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
  const [testSamples, setTestSamples] = useState([]);
  const [selectedTestSampleId, setSelectedTestSampleId] = useState(null);
  const [showTestResultModal, setShowTestResultModal] = useState(false);

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

  const shouldShowTestSampleForm = () =>
    service?.serviceType === "Dân sự" &&
    order?.sampleMethod === "home" &&
    order?.orderStatus === "SEND_KIT";

  const shouldShowUpdateStatusButton = () =>
    service?.serviceType === "Dân sự" &&
    order?.sampleMethod === "home" &&
    order?.orderStatus === "SEND_KIT";

  const shouldShowViewResultButton = () =>
    order?.orderStatus === "COMPLETED" || order?.orderStatus === "TESTED";

  const handleUpdateStatus = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setUpdateError("Không tìm thấy token xác thực. Vui lòng đăng nhập lại.");
      return;
    }

    try {
      const response = await updateTestOrder(orderId, {
        orderStatus: "SEND_SAMPLE",
      });
      setOrder({ ...order, orderStatus: "SEND_SAMPLE" });
      setUpdateError(null);
      alert("Cập nhật trạng thái thành công: Đã gửi mẫu lại trung tâm");
    } catch (error) {
      console.error("Lỗi khi cập nhật trạng thái:", error);
      if (error.response?.status === 403) {
        setUpdateError(
          error.response.data ||
            "Không có quyền cập nhật trạng thái đơn hàng."
        );
      } else if (error.response?.status === 400) {
        setUpdateError(error.response.data || "Yêu cầu không hợp lệ.");
      } else if (error.response?.status === 500) {
        setUpdateError("Lỗi server khi cập nhật trạng thái đơn hàng.");
      } else {
        setUpdateError(`Lỗi khi cập nhật trạng thái đơn hàng: ${error.message}`);
      }
    }
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

        const response = await axios.get(
          `http://localhost:8080/api/testSamples/order/${orderId}`
        );
        setTestSamples(response.data);
      } catch (err) {
        console.error("Lỗi khi tải dữ liệu:", err);
        setUpdateError("Lỗi khi tải dữ liệu đơn hàng hoặc TestSample.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [orderId]);

  const handleBack = () => navigate(-1);

  const handleShowDetail = (testSampleId) => {
    setSelectedTestSampleId(testSampleId);
  };

  const handleShowTestResult = () => {
    setShowTestResultModal(true);
  };

  if (loading) return <div className="order-detail-container">Đang tải...</div>;
  if (!order)
    return <div className="order-detail-container">Không tìm thấy đơn hàng</div>;

  // Lấy relationship của sampleId1 và sampleId2
  const getRelationships = (sampleId1, sampleId2) => {
    const sample1 = testSamples.find(s => s.id === sampleId1);
    const sample2 = testSamples.find(s => s.id === sampleId2);
    return {
      relationship1: sample1?.relationship || "N/A",
      relationship2: sample2?.relationship || "N/A",
    };
  };

  const { relationship1, relationship2 } = order && getRelationships(order.sampleId1, order.sampleId2);

  return (
    <div className="order-detail-container">
      {updateError && (
        <div className="order-detail-error">{updateError}</div>
      )}
      <h2 className="order-detail-title">Chi tiết đơn hàng #{order.orderId}</h2>

      <div className="order-detail-grid">
        <section className="order-detail-section">
          <h3>Thông tin khách hàng</h3>
          <div>
            <p>
              <strong>Họ tên:</strong> {account?.fullName || "N/A"}
            </p>
            <p>
              <strong>SĐT:</strong> {account?.phone || "N/A"}
            </p>
            <p>
              <strong>Email:</strong> {account?.email || "N/A"}
            </p>
            <p>
              <strong>Giới tính:</strong> {customer?.gender || "N/A"}
            </p>
            <p>
              <strong>Địa chỉ:</strong> {customer?.address || "N/A"}
            </p>
            <p>
              <strong>Loại giấy tờ:</strong> {customer?.documentType || "N/A"}
            </p>
            <p>
              <strong>Số giấy tờ:</strong> {customer?.cccd || "N/A"}
            </p>
            <p>
              <strong>Nơi cấp:</strong> {customer?.placeOfIssue || "N/A"}
            </p>
            <p>
              <strong>Ngày cấp:</strong> {formatDate(customer?.dateOfIssue)}
            </p>
          </div>
        </section>

        <section className="order-detail-section">
          <h3>Thông tin dịch vụ</h3>
          <div>
            <p>
              <strong>Tên dịch vụ:</strong> {service?.serviceName || "N/A"}
            </p>
            <p>
              <strong>Loại dịch vụ:</strong> {service?.serviceType || "N/A"}
            </p>
            <p>
              <strong>Thời gian xét nghiệm:</strong>{" "}
              {service?.timeTest ? `${service.timeTest} ngày` : "N/A"}
            </p>
          </div>
          <h3>Thông tin nhân viên phụ trách</h3>
          <div>
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

        <section className="order-detail-section">
          <h3>Thông tin đơn hàng</h3>
          <div>
            <p>
              <strong>Trạng thái:</strong>{" "}
              {STATUS_LABELS[order?.orderStatus] || "N/A"}
            </p>
            <p>
              <strong>Ngày đặt:</strong> {formatDate(order?.orderDate)}
            </p>
            <p>
              <strong>Hình thức thu mẫu:</strong>{" "}
              {order?.sampleMethod === "center" ? "Tại trung tâm" : "Tại nhà"}
            </p>
            <p>
              <strong>Số lượng mẫu:</strong> {order?.sampleQuantity || "N/A"}
            </p>
            <p>
              <strong>Phương thức nhận kết quả:</strong>{" "}
              {order?.resultDeliveryMethod || "N/A"}
            </p>
            <p>
              <strong>Địa chỉ nhận kết quả:</strong>{" "}
              {order?.resultDeliverAddress || "N/A"}
            </p>
            <p>
              <strong>Giá:</strong> {formatPrice(order?.amount)}
            </p>
          </div>
        </section>
      </div>

      <section className="order-detail-section test-sample-container">
        <div className="order-detail-actions">
          {shouldShowTestSampleForm() && (
            <button
              className="order-detail-button"
              onClick={() => setShowModal(true)}
            >
              Điền Test Samples
            </button>
          )}
          {shouldShowUpdateStatusButton() && (
            <button
              className="order-detail-button"
              onClick={handleUpdateStatus}
            >
              Cập nhật trạng thái
            </button>
          )}
          {shouldShowViewResultButton() && (
            <button
              className="order-detail-button"
              onClick={handleShowTestResult}
            >
              Xem kết quả
            </button>
          )}
          <button
            className="order-detail-button back"
            onClick={handleBack}
          >
            Quay lại
          </button>
        </div>
        {testSamples.length > 0 && (
          <div className="test-sample-table-wrapper">
            <h3 className="test-sample-title">Danh sách mẫu xét nghiệm</h3>
            <table className="test-sample-table">
              <thead>
                <tr>
                  <th>Họ tên</th>
                  <th>Mối quan hệ</th>
                  <th>Chi tiết</th>
                </tr>
              </thead>
              <tbody>
                {testSamples.map((sample) => (
                  <tr key={sample.id}>
                    <td>{sample.name || "N/A"}</td>
                    <td>{sample.relationship || "N/A"}</td>
                    <td>
                      <button
                        className="test-sample-detail-button"
                        onClick={() => handleShowDetail(sample.id)}
                      >
                        Chi tiết
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

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
      {selectedTestSampleId && (
        <TestSampleDetail
          orderId={orderId}
          testSampleId={selectedTestSampleId}
          serviceType={service?.serviceType}
          sampleMethod={order?.sampleMethod}
          onClose={() => setSelectedTestSampleId(null)}
        />
      )}
      {showTestResultModal && account && customer && (
        <TestResultDetail
          orderId={orderId}
          fullName={account.fullName}
          address={customer.address}
          relationship1={relationship1} // Truyền relationship của sampleId1
          relationship2={relationship2} // Truyền relationship của sampleId2
          onClose={() => setShowTestResultModal(false)}
        />
      )}
    </div>
  );
};

export default OrderDetailCustomer;