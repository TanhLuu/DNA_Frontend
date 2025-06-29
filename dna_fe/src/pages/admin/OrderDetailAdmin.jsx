import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import {
  getTestOrderById,
  getAccountByCustomerId,
  getCustomerById,
  getServiceById,
  getStaffById,
  getAccountById,
  updateTestOrder,
} from "../../api/adminOrderApi";
import '../../styles/admin/OrderDetailAdmin.css';
import TestSampleForm from "../../components/Order/TestSampleForm";
import TestSampleDetail from "../../components/Order/TestSampleDetail";
import TestResultSampleForm from "../../components/Order/TestResultSampleForm";

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
  const [showResultModal, setShowResultModal] = useState(false);
  const [staffId, setStaffId] = useState(null);
  const [staffRole, setStaffRole] = useState(null);
  const [testSamples, setTestSamples] = useState([]);
  const [selectedTestSampleId, setSelectedTestSampleId] = useState(null);

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

  const disabledStatuses = ["SEND_SAMPLE", "COLLECT_SAMPLE", "TESTED", "COMPLETED"];
  
  const isTestSampleButtonDisabled = () => {
    return disabledStatuses.includes(order?.orderStatus);
  };

  const getNextStatus = () => {
    if (!staffRole || !order?.orderStatus) {
      return null;
    }

    if (staffRole === "NORMAL_STAFF") {
      if (order.orderStatus === "CONFIRM") {
        return order.sampleMethod === "center" ? "COLLECT_SAMPLE" : "SEND_KIT";
      }
      if (order.orderStatus === "SEND_SAMPLE") return "COLLECT_SAMPLE";
      if (order.orderStatus === "TESTED") return "COMPLETED";
    } else if (staffRole === "LAB_STAFF") {
      if (order.orderStatus === "COLLECT_SAMPLE") return "TESTED";
    }
    return null;
  };

  const isUpdateButtonDisabled = () => {
    return !getNextStatus();
  };

  const handleUpdateStatus = async () => {
    const nextStatus = getNextStatus();
    if (!nextStatus || !staffId) {
      setUpdateError("Không thể cập nhật trạng thái: Thiếu thông tin nhân viên hoặc trạng thái không hợp lệ.");
      return;
    }

    try {
      const updateData = {
        orderStatus: nextStatus,
        staffId: parseInt(staffId),
      };
      await updateTestOrder(orderId, updateData);
      const updatedOrder = await getTestOrderById(orderId);
      setOrder(updatedOrder);
      setUpdateError(null);
      alert("Cập nhật trạng thái thành công!");
    } catch (err) {
      console.error("Lỗi khi cập nhật trạng thái:", err);
      setUpdateError(`Lỗi khi cập nhật trạng thái: ${err.message}`);
    }
  };

  useEffect(() => {
    const storedStaffId = localStorage.getItem("staffId");
    const storedStaffRole = localStorage.getItem("staffRole");
    setStaffId(storedStaffId);
    setStaffRole(storedStaffRole);

    if (!storedStaffId || !storedStaffRole) {
      setUpdateError("Không tìm thấy thông tin nhân viên. Vui lòng đăng nhập lại.");
    } else {
      console.log("staffId:", storedStaffId, "staffRole:", storedStaffRole);
    }

    const fetchData = async () => {
      try {
        const orderData = await getTestOrderById(orderId);
        setOrder(orderData);
        console.log("orderStatus:", orderData.orderStatus, "sampleMethod:", orderData.sampleMethod);

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

        const response = await axios.get(`http://localhost:8080/api/testSamples/order/${orderId}`);
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

  if (loading) return <div>Đang tải...</div>;
  if (!order) return <div>Không tìm thấy đơn hàng</div>;

  const handleShowDetail = (testSampleId) => {
    setSelectedTestSampleId(testSampleId);
  };

  return (
    <div className="OrderDetailAdmin">
      <div>
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
              <span className="label">THỜ523I GIAN XÉT NGHIỆM</span>
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
              </div>
            </div>
          </div>

          <div className="button-group mt-4 flex gap-4">
            <button
              className={`bg-green-500 text-white p-2 rounded hover:bg-green-600 ${isUpdateButtonDisabled() ? 'opacity-50 cursor-not-allowed' : ''}`}
              onClick={handleUpdateStatus}
              disabled={isUpdateButtonDisabled()}
              style={isUpdateButtonDisabled() ? { backgroundColor: '#22c55e', color: '#fff' } : {}}
            >
              Cập nhật trạng thái
            </button>

            <button
              className={`bg-blue-500 text-white p-2 rounded hover:bg-blue-600 ${isTestSampleButtonDisabled() ? 'opacity-50 cursor-not-allowed' : ''}`}
              onClick={() => setShowModal(true)}
              disabled={isTestSampleButtonDisabled()}
              style={isTestSampleButtonDisabled() ? { backgroundColor: '#3b82f6', color: '#fff' } : {}}
            >
              Nhập mẫu xét nghiệm
            </button>

            {/* Nút Nhập kết quả (chỉ dành cho LAB_STAFF khi status là COLLECT_SAMPLE) */}
            {staffRole === "LAB_STAFF" && order?.orderStatus === "COLLECT_SAMPLE" && (
              <button
                className="bg-purple-500 text-white p-2 rounded hover:bg-purple-600"
                onClick={() => setShowResultModal(true)}
              >
                Nhập kết quả
              </button>
            )}

            {/* Nút Xem kết quả (dành cho NORMAL_STAFF hoặc khi status là TESTED/COMPLETED) */}
            {(staffRole === "NORMAL_STAFF" || order?.orderStatus === "TESTED" || order?.orderStatus === "COMPLETED") && (
              <button
                className="bg-gray-500 text-white p-2 rounded hover:bg-gray-600"
                onClick={() => setShowResultModal(true)}
              >
                Xem kết quả
              </button>
            )}
          </div>

          <div className="testSampleContainer">
            {testSamples.length > 0 && (
              <div className="testSampleTableWrapper">
                <h3 className="testSampleTitle">Danh sách mẫu xét nghiệm</h3>
                <table className="testSampleTable">
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
                            className="testSampleDetailButton"
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
          isCustomer={false}
          onClose={() => setShowModal(false)}
        />
      )}
      {showResultModal && (
        <TestResultSampleForm
          orderId={orderId}
          testSamples={testSamples}
          sampleQuantity={order.sampleQuantity || 0}
          orderStatus={order?.orderStatus}
          staffRole={staffRole}
          onClose={() => setShowResultModal(false)}
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
    </div>
  );
};

export default OrderDetailAdmin;