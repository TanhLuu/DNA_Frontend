import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import {
  getAccountByCustomerId,
  getCustomerById,
  getServiceById,
  getTestSamplesByOrderId,
  getStaffById,
  getAccountById
} from "../../api/accountApi";

const OrderDetailAdmin = () => {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [customer, setCustomer] = useState(null);
  const [account, setAccount] = useState(null);
  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);
  const [testSamples, setTestSamples] = useState([]);
  const [savedSamples, setSavedSamples] = useState([]);
  const [submitted, setSubmitted] = useState(false);
  const [updateError, setUpdateError] = useState(null);
  const [kitCodeError, setKitCodeError] = useState("");
  const [registrationStaff, setRegistrationStaff] = useState(null);
  const [testingStaff, setTestingStaff] = useState(null);

  const formatDate = (date) =>
    date ? new Date(date).toLocaleDateString("vi-VN") : "N/A";

  const formatPrice = (p) =>
    p ? p.toLocaleString("vi-VN") + " VNĐ" : "N/A";

  const getNextStatus = (currentStatus) => {
  if (order?.sampleType === "center" && currentStatus === "PENDING") {
    return "COLLECT_SAMPLE"; // Nhảy trực tiếp
  }

  const flow = ['PENDING', 'SEND_KIT', 'SEND_SAMPLE', 'COLLECT_SAMPLE', 'TESTED', 'COMPLETED'];
  const i = flow.indexOf(currentStatus);
  return i >= 0 && i < flow.length - 1 ? flow[i + 1] : currentStatus;
};

  const canUpdateOrder = (status, role) => {
  const nextStatus = getNextStatus(status);

  if (role === 'NORMAL_STAFF') {
    // ❌ Chặn: SEND_KIT → SEND_SAMPLE
    if (status === 'SEND_KIT' && nextStatus === 'SEND_SAMPLE') return false;

    // ❌ Chặn: COLLECT_SAMPLE → TESTED
    if (status === 'COLLECT_SAMPLE' && nextStatus === 'TESTED') return false;

    // ✅ Cho phép: TESTED → COMPLETED
    if (status === 'TESTED' && nextStatus === 'COMPLETED') return true;

    // ✅ Các bước thường
    const normal = ['PENDING', 'SEND_KIT', 'SEND_SAMPLE', 'COLLECT_SAMPLE'];
    return normal.includes(status);
  }

  if (role === 'LAB_STAFF') {
    // ❌ Chặn: TESTED → COMPLETED
    if (status === 'TESTED' && nextStatus === 'COMPLETED') return false;

    // ✅ Cho phép các bước: COLLECT_SAMPLE → TESTED
    const lab = ['COLLECT_SAMPLE', 'TESTED'];
    return lab.includes(status);
  }

  return false;
};

  const shouldShowFullFields = () =>
    service?.serviceType === "Hành chính";

  const shouldShowKitCode =
    service?.serviceType === "Dân sự" && order?.sampleType === "home";

  const isCivilHomePending =
    service?.serviceType === "Dân sự" &&
    order?.sampleType === "home" &&
    order?.orderStatus === "PENDING";

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(`http://localhost:8080/api/testorders/${orderId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        const orderData = res.data;
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

        const existingSamples = await getTestSamplesByOrderId(orderData.orderId);
        setSavedSamples(existingSamples);
        if (existingSamples.length >= orderData.sampleQuantity) {
          setSubmitted(true);
        }

        const samplesToInit = orderData.sampleQuantity - existingSamples.length;
        setTestSamples(Array(samplesToInit).fill().map(() => ({
          name: "",
          gender: "",
          dateOfBirth: "",
          documentType: "CCCD",
          documentNumber: "",
          dateOfIssue: "",
          expirationDate: "",
          placeOfIssue: "",
          nationality: "",
          address: "",
          sampleType: "",
          numberOfSample: 1,
          relationship: "",
          medicalHistory: "",
          fingerprint: "",
          kitCode: ""
        })));
      } catch (err) {
        console.error("Lỗi khi tải dữ liệu:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [orderId]);

  const handleChange = (index, field, value) => {
    const updatedSamples = [...testSamples];
    updatedSamples[index][field] = value;
    setTestSamples(updatedSamples);
    if (field === "kitCode") {
      setKitCodeError(""); // clear warning when user types kitCode
    }
  };

  const handleUpdateAll = async () => {
    setUpdateError(null);
    const staffRole = localStorage.getItem('staffRole');
    const staffId = localStorage.getItem('staffId');

    if (!staffRole || !staffId) {
      setUpdateError('Không tìm thấy thông tin nhân viên. Vui lòng đăng nhập lại.');
      return;
    }

    if (!canUpdateOrder(order.orderStatus, staffRole)) {
      setUpdateError(`Bạn không có quyền cập nhật đơn hàng ở trạng thái ${order.orderStatus}`);
      return;
    }

    const nextStatus = getNextStatus(order.orderStatus);
    if (nextStatus === order.orderStatus) {
      setUpdateError('Đơn hàng đã ở trạng thái cuối cùng!');
      return;
    }

    if (isCivilHomePending) {
      const missingKit = testSamples.some(sample => !sample.kitCode?.trim());
      
    }

    try {
      if (!submitted && testSamples.length > 0) {
        const requests = testSamples.map((sample) =>
          axios.post("http://localhost:8080/api/testSamples", {
            ...sample,
            orderId: order.orderId,
            customerId: order.customerId,
          }, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          })
        );

        await Promise.all(requests);

        const newSavedSamples = await getTestSamplesByOrderId(order.orderId);
        setSavedSamples(newSavedSamples);
        setSubmitted(true);
      }

      await axios.put(`http://localhost:8080/api/testorders/${order.orderId}`, {
        staffId,
        orderStatus: nextStatus,
      }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      setOrder({ ...order, orderStatus: nextStatus });
      setKitCodeError("");
      alert("Cập nhật mẫu và trạng thái đơn hàng thành công!");
    } catch (error) {
      console.error("Lỗi khi cập nhật:", error);
      setUpdateError("Đã xảy ra lỗi khi cập nhật đơn hàng hoặc mẫu xét nghiệm.");
    }
  };

  const STATUS_LABELS = {
  PENDING: "Đặt lịch / Đăng ký",           // Đơn hàng vừa được tạo, chờ xử lý
  SEND_KIT: "Đã gửi kit",                  // Đã gửi bộ kit lấy mẫu cho khách hàng
  SEND_SAMPLE: "Đã gửi mẫu lại trung tâm", // Khách hàng đã gửi mẫu về trung tâm
  COLLECT_SAMPLE: "Đã thu mẫu",            // Đã thu mẫu tại trung tâm hoặc tại nhà
  TESTED: "Đã xét nghiệm",                 // Đã hoàn thành xét nghiệm
  COMPLETED: "Hoàn thành"                  // Đã trả kết quả, hoàn tất đơn hàng
};

  if (loading) return <div>Đang tải...</div>;
  if (!order) return <div>Không tìm thấy đơn hàng</div>;

  return (
    <div className="order-detail-container">
      {updateError && <div className="text-red-500 mb-4">{updateError}</div>}
      <h2>Chi tiết đơn hàng #{order.orderId}</h2>

      <section>
        <h3>Thông tin khách hàng</h3>
        <p><strong>Họ tên:</strong> {account?.fullName}</p>
        <p><strong>SĐT:</strong> {account?.phone}</p>
        <p><strong>Email:</strong> {account?.email}</p>
        <p><strong>Giới tính:</strong> {customer?.gender}</p>
        <p><strong>Ngày sinh:</strong> {formatDate(customer?.dateOfBirth)}</p>
        <p><strong>Địa chỉ:</strong> {customer?.address}</p>
        <p><strong>Loại giấy tờ:</strong> {customer?.documentType}</p>
        <p><strong>Số giấy tờ:</strong> {customer?.cccd}</p>
        <p><strong>Nơi cấp:</strong> {customer?.placeOfIssue}</p>
        <p><strong>Ngày cấp:</strong> {formatDate(customer?.dateOfIssue)}</p>
      </section>

      <section>
        <h3>Thông tin dịch vụ</h3>
        <p><strong>Tên dịch vụ:</strong> {service?.serviceName}</p>
        <p><strong>Loại dịch vụ:</strong> {service?.serviceType}</p>
        <p><strong>Thời gian xét nghiệm:</strong> {service?.timeTest} ngày</p>
      </section>

      <section>
        <h3>Thông tin đơn hàng</h3>
        <p><strong>Trạng thái:</strong> {STATUS_LABELS[order.orderStatus] || order.orderStatus}</p>

        <p><strong>Ngày đặt:</strong> {formatDate(order.orderDate)}</p>
        <p><strong>Hình thức thu mẫu:</strong> {order.sampleType === "center" ? "Tại trung tâm" : "Tại nhà"}</p>
        <p><strong>Số lượng mẫu:</strong> {order.sampleQuantity}</p>
        <p><strong>Phương thức nhận kết quả:</strong> {order.resultDeliveryMethod}</p>
        <p><strong>Địa chỉ nhận kết quả:</strong> {order.resultDeliverAddress}</p>
        <p><strong>Giá:</strong> {formatPrice(order.amount)}</p>
      </section>

      <section>
  <h3>Thông tin nhân viên phụ trách</h3>
  <p><strong>Nhân viên đăng ký:</strong> {registrationStaff?.fullName || "Chưa có"}</p>
  <p><strong>Nhân viên xét nghiệm:</strong> {testingStaff?.fullName || "Chưa có"}</p>
</section>

      <section>
        <h3>Thông tin mẫu xét nghiệm</h3>

        {isCivilHomePending && (
          <div className="text-yellow-600 font-semibold mb-4">
            ⚠️ Vui lòng nhập mã kit cho từng mẫu trước khi gửi cho khách hàng.
          </div>
        )}

        {savedSamples.map((sample, idx) => (
          <div key={idx} style={{ border: "1px solid #ccc", padding: "10px", marginBottom: "10px" }}>
            {shouldShowKitCode && <p><strong>Kit:</strong> {sample.kitCode}</p>}
            <p><strong>Họ tên:</strong> {sample.name}</p>
            <p><strong>Giới tính:</strong> {sample.gender}</p>
            <p><strong>Ngày sinh:</strong> {formatDate(sample.dateOfBirth)}</p>
            <p><strong>Quan hệ:</strong> {sample.relationship}</p>
            <p><strong>Loại mẫu:</strong> {sample.sampleType}</p>
            {shouldShowFullFields() && (
              <>
                <p><strong>Số mẫu:</strong> {sample.sampleNumber}</p>
                <p><strong>Địa chỉ:</strong> {sample.address}</p>
                <p><strong>Loại giấy tờ:</strong> {sample.documentType}</p>
                <p><strong>Số giấy tờ:</strong> {sample.documentNumber}</p>
                <p><strong>Ngày cấp:</strong> {formatDate(sample.dateOfIssue)}</p>
                <p><strong>Hết hạn:</strong> {formatDate(sample.expirationDate)}</p>
                <p><strong>Nơi cấp:</strong> {sample.placeOfIssue}</p>
                <p><strong>Quốc tịch:</strong> {sample.nationality}</p>
                <p><strong>Vân tay:</strong> {sample.fingerprint}</p>
              </>
            )}
            <p><strong>Tiền sử bệnh:</strong> {sample.medicalHistory}</p>
          </div>
        ))}

        {!submitted && testSamples.map((sample, index) => (
          <div key={index} style={{ border: "1px dashed gray", padding: "10px", marginBottom: "20px" }}>
            <h4>Mẫu #{index + 1}</h4>
            {shouldShowKitCode && (
              <input placeholder="Kit Code" value={sample.kitCode} onChange={(e) => handleChange(index, "kitCode", e.target.value)} />
            )}
            <input placeholder="Họ tên" value={sample.name} onChange={(e) => handleChange(index, "name", e.target.value)} />
            <select value={sample.gender} onChange={(e) => handleChange(index, "gender", e.target.value)}>
              <option value="">Chọn giới tính</option>
              <option value="Nam">Nam</option>
              <option value="Nữ">Nữ</option>
            </select>
            <input type="date" value={sample.dateOfBirth} onChange={(e) => handleChange(index, "dateOfBirth", e.target.value)} />
            <select value={sample.relationship} onChange={(e) => handleChange(index, "relationship", e.target.value)}>
              <option value="">Chọn quan hệ</option>
              <option value="Ong">Ông</option>
              <option value="Ba">Bà</option>
              <option value="Chau">Cháu</option>
              <option value="Bo">Bố</option>
              <option value="Me">Mẹ</option>
              <option value="Anh">Anh</option>
              <option value="Chi">Chị</option>
              <option value="Em">Em</option>
            </select>
            <select value={sample.sampleType} onChange={(e) => handleChange(index, "sampleType", e.target.value)}>
              <option value="">Chọn loại mẫu</option>
              <option value="Mau">Mẫu máu</option>
              <option value="Toc">Mẫu tóc</option>
              <option value="Mong">Mẫu móng</option>
              <option value="NiemMac">Mẫu niêm mạc</option>
            </select>
            {shouldShowFullFields() && (
              <>
                <input placeholder="Số mẫu" value={sample.sampleNumber} onChange={(e) => handleChange(index, "sampleNumber", e.target.value)} />
                <input placeholder="Địa chỉ" value={sample.address} onChange={(e) => handleChange(index, "address", e.target.value)} />
                <select value={sample.documentType} onChange={(e) => handleChange(index, "documentType", e.target.value)}>
                  <option value="CCCD">CCCD</option>
                  <option value="CMND">CMND</option>
                  <option value="HoChieu">Hộ chiếu</option>
                </select>
                <input placeholder="Số giấy tờ" value={sample.documentNumber} onChange={(e) => handleChange(index, "documentNumber", e.target.value)} />
                <input type="date" value={sample.dateOfIssue} onChange={(e) => handleChange(index, "dateOfIssue", e.target.value)} />
                <input type="date" value={sample.expirationDate} onChange={(e) => handleChange(index, "expirationDate", e.target.value)} />
                <input placeholder="Nơi cấp" value={sample.placeOfIssue} onChange={(e) => handleChange(index, "placeOfIssue", e.target.value)} />
                <input placeholder="Quốc tịch" value={sample.nationality} onChange={(e) => handleChange(index, "nationality", e.target.value)} />
                <input placeholder="Vân tay" value={sample.fingerprint} onChange={(e) => handleChange(index, "fingerprint", e.target.value)} />
              </>
            )}
            <select value={sample.medicalHistory} onChange={(e) => handleChange(index, "medicalHistory", e.target.value)}>
              <option value="">Chọn tiền sử bệnh</option>
              <option value="Khong">Không</option>
              <option value="Co">Có</option>
            </select>
          </div>
        ))}

        {canUpdateOrder(order.orderStatus, localStorage.getItem('staffRole')) &&
          getNextStatus(order.orderStatus) !== order.orderStatus && (
            <button
              className="action-btn"
              onClick={handleUpdateAll}
              disabled={isCivilHomePending && testSamples.some(sample => !sample.kitCode?.trim())}
              style={{
                opacity: isCivilHomePending && testSamples.some(sample => !sample.kitCode?.trim()) ? 0.5 : 1,
                cursor: isCivilHomePending && testSamples.some(sample => !sample.kitCode?.trim()) ? 'not-allowed' : 'pointer'
              }}
            >
              {isCivilHomePending ? "Xác nhận đã gửi kit cho khách hàng" : "Cập nhật"}
            </button>
          )}
      </section>
    </div>
  );
};

export default OrderDetailAdmin;
