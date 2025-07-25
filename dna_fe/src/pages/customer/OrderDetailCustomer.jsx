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
import RatingFeedbackForm from "../../components/Order/RatingFeedbackForm";
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
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [feedback, setFeedback] = useState(null);

  const formatDate = (date) =>
    date ? new Date(date).toLocaleDateString("vi-VN") : "Không có";

  const formatPrice = (p) => (p ? p.toLocaleString("vi-VN") + " VNĐ" : "Không có");

  const STATUS_LABELS = {
    CONFIRM: "Đặt lịch / Đăng ký",
    SEND_KIT: "Đã gửi kit",
    SEND_SAMPLE: "Đã gửi mẫu lại trung tâm",
    COLLECT_SAMPLE: "Đã thu mẫu",
    TESTED: "Đã xét nghiệm",
    COMPLETED: "Hoàn thành",
    CANCEL: "Đã hủy",
  };

  const shouldShowTestSampleForm = () =>
    service?.serviceType === "Dân sự" &&
    order?.sampleMethod === "home" &&
    order?.orderStatus === "SEND_KIT";

  const shouldShowUpdateStatusButton = () =>
    service?.serviceType === "Dân sự" &&
    order?.sampleMethod === "home" &&
    order?.orderStatus === "SEND_KIT" &&
    order?.orderStatus !== "CANCEL";

  const shouldShowCancelButton = () =>
    order?.orderStatus === "CONFIRM";

  const shouldShowViewResultButton = () =>
    order?.orderStatus === "COMPLETED";

  const shouldShowFeedbackButton = () =>
    order?.orderStatus === "COMPLETED" && !feedback;

  const shouldShowViewFeedbackButton = () =>
    order?.orderStatus === "COMPLETED" && feedback;

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

  const handleCancelOrder = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setUpdateError("Không tìm thấy token xác thực. Vui lòng đăng nhập lại.");
      return;
    }

    if (window.confirm("Bạn có chắc chắn muốn hủy đơn hàng này?")) {
      try {
        await updateTestOrder(orderId, {
          orderStatus: "CANCEL",
        });
        setOrder({ ...order, orderStatus: "CANCEL" });
        setUpdateError(null);
        alert("Hủy đơn hàng thành công");
      } catch (error) {
        console.error("Lỗi khi hủy đơn hàng:", error);
        if (error.response?.status === 403) {
          setUpdateError(
            error.response.data ||
              "Không có quyền hủy đơn hàng."
          );
        } else if (error.response?.status === 400) {
          setUpdateError(error.response.data || "Yêu cầu không hợp lệ.");
        } else if (error.response?.status === 500) {
          setUpdateError("Lỗi server khi hủy đơn hàng.");
        } else {
          setUpdateError(`Lỗi khi hủy đơn hàng: ${error.message}`);
        }
      }
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const orderData = await getTestOrderById(orderId);
        setOrder(orderData);

        const accountInfo = await getAccountByCustomerId(orderData.customerId);
        const userInfo = await getCustomerById(orderData.customerId);
        setAccount(accountInfo);
        setCustomer(userInfo);

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

        try {
          const feedbackResponse = await axios.get(
            `http://localhost:8080/api/rating-feedbacks/order/${orderId}`,
            {
              headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
            }
          );
          setFeedback(feedbackResponse.data);
        } catch (err) {
          console.log("Chưa có feedback hoặc lỗi khi lấy feedback:", err);
          setFeedback(null);
        }
      } catch (err) {
        console.error("Lỗi khi tải dữ liệu:", err);
        setUpdateError("Lỗi khi tải dữ liệu đơn hàng hoặc TestSample.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [orderId]);

  useEffect(() => {
  if (!showModal) {
    // Modal vừa đóng, làm mới danh sách testSamples
    const fetchTestSamples = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8080/api/testSamples/order/${orderId}`,
          {
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
          }
        );
        setTestSamples(response.data); // Cập nhật danh sách testSamples
      } catch (err) {
        console.error("Lỗi khi tải danh sách mẫu xét nghiệm:", err);
        setUpdateError("Lỗi khi tải danh sách mẫu xét nghiệm.");
      }
    };
    fetchTestSamples();
  }
}, [showModal, orderId]);

  const handleBack = () => navigate(-1);

  const handleShowDetail = (testSampleId) => {
    setSelectedTestSampleId(testSampleId);
  };

  const handleShowTestResult = () => {
    setShowTestResultModal(true);
  };

  const handleShowFeedback = () => {
    setShowFeedbackModal(true);
  };

  const handleFeedbackSubmitted = (newFeedback) => {
    setFeedback(newFeedback);
  };

  if (loading) return <div className="order-detail-container">Đang tải...</div>;
  if (!order)
    return <div className="order-detail-container">Không tìm thấy đơn hàng</div>;

  const getRelationships = (sampleId1, sampleId2) => {
    const sample1 = testSamples.find((s) => s.id === sampleId1);
    const sample2 = testSamples.find((s) => s.id === sampleId2);
    return {
      relationship1: sample1?.relationship || "Không có",
      relationship2: sample2?.relationship || "Không có",
    };
  };

  const { relationship1, relationship2 } =
    order && getRelationships(order.sampleId1, order.sampleId2);

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
            <p><strong>Họ tên:</strong> {account?.fullName || "Không có"}</p>
            <p><strong>SĐT:</strong> {account?.phone || "Không có"}</p>
            <p><strong>Email:</strong> {account?.email || "Không có"}</p>
            <p><strong>Giới tính:</strong> {customer?.gender || "Không có"}</p>
            <p><strong>Địa chỉ:</strong> {customer?.address || "Không có"}</p>
            <p><strong>Loại giấy tờ:</strong> {customer?.documentType || "Không có"}</p>
            <p><strong>Số giấy tờ:</strong> {customer?.cccd || "Không có"}</p>
            <p><strong>Nơi cấp:</strong> {customer?.placeOfIssue || "Không có"}</p>
            <p><strong>Ngày cấp:</strong> {formatDate(customer?.dateOfIssue)}</p>
          </div>
        </section>

        <section className="order-detail-section">
          <h3>Thông tin dịch vụ</h3>
          <div>
            <p><strong>Tên dịch vụ:</strong> {service?.serviceName || "Không có"}</p>
            <p><strong>Loại dịch vụ:</strong> {service?.serviceType || "Không có"}</p>
            <p><strong>Thời gian xét nghiệm:</strong>{" "}
              {service?.timeTest ? `${service.timeTest} ngày` : "Không có"}
            </p>
          </div>
          <h3>Thông tin nhân viên phụ trách</h3>
          <div>
            <p><strong>Nhân viên đăng ký:</strong>{" "}
              {registrationStaff?.fullName || "Chưa có"}
            </p>
            <p><strong>Nhân viên xét nghiệm:</strong>{" "}
              {testingStaff?.fullName || "Chưa có"}
            </p>
          </div>
        </section>

        <section className="order-detail-section">
          <h3>Thông tin đơn hàng</h3>
          <div>
            <p><strong>Trạng thái:</strong>{" "}
              {STATUS_LABELS[order?.orderStatus] || "Không có"}
            </p>
            <p><strong>Ngày đặt:</strong> {formatDate(order?.orderDate)}</p>
            <p><strong>Hình thức thu mẫu:</strong>{" "}
              {order?.sampleMethod === "center" ? "Tại trung tâm" : "Tại nhà"}
            </p>
            <p><strong>Số lượng mẫu:</strong> {order?.sampleQuantity || "Không có"}</p>
            <p><strong>Phương thức nhận kết quả:</strong> {
                  order?.resultDeliverMethod ||
                  (order?.resultDeliveryMethod === "home" ? "Tại nhà" :
                    order?.resultDeliveryMethod === "office" ? "Tại văn phòng" :
                      order?.resultDeliveryMethod === "email" ? "Email" :
                        "Không có")
                }</p>
            <p><strong>Địa chỉ nhận kết quả:</strong>{" "}
              {order?.resultDeliverAddress || "Không có"}
            </p>
            <p><strong>Giá:</strong> {formatPrice(order?.amount)}</p>
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
              Nhập mẫu xét nghiệm
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
          {shouldShowCancelButton() && (
            <button
              className="order-detail-button cancel"
              onClick={handleCancelOrder}
            >
              Hủy đơn hàng
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
          {shouldShowFeedbackButton() && (
            <button
              className="order-detail-button"
              onClick={handleShowFeedback}
            >
              Phản hồi
            </button>
          )}
          {shouldShowViewFeedbackButton() && (
            <button
              className="order-detail-button"
              onClick={handleShowFeedback}
            >
              Xem phản hồi
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
                    <td>{sample.name || "Không có"}</td>
                    <td>{sample.relationship || "Không có"}</td>
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
          address = {customer.address}
          relationship1={relationship1}
          relationship2={relationship2}
          onClose={() => setShowTestResultModal(false)}
        />
      )}
      {showFeedbackModal && (shouldShowFeedbackButton() || shouldShowViewFeedbackButton()) && (
        <RatingFeedbackForm
          orderId={orderId}
          onClose={() => setShowFeedbackModal(false)}
          onSubmit={handleFeedbackSubmitted}
          feedback={feedback}
        />
      )}
    </div>
  );
};

export default OrderDetailCustomer;