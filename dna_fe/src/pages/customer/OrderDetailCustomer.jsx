import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  getTestOrderById,
  getTestSamplesByOrderId,
  getTestResultsByOrderId,
  getTestResultSamplesByOrderId,
  getAccountByCustomerId,
  getCustomerById,
  getServiceById,
  updateAccountInfo,
  updateTestOrder,
  updateTestSample,
} from "../../api/customerOrderApi";
import { getStaffById, getAccountById } from "../../api/adminOrderApi";
import OrderInfoSections from "../../components/Order/OrderInfoSections";
import TestResultsAndSamples from "../../components/Order/TestResultsAndSamples";

const OrderDetailCustomer = () => {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [customer, setCustomer] = useState(null);
  const [account, setAccount] = useState(null);
  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);
  const [testSamples, setTestSamples] = useState([]);
  const [testResults, setTestResults] = useState([]);
  const [testResultSamples, setTestResultSamples] = useState([]);
  const [updateError, setUpdateError] = useState(null);
  const [registrationStaff, setRegistrationStaff] = useState(null);
  const [testingStaff, setTestingStaff] = useState(null);
  const [userInfo, setUserInfo] = useState({
    fullName: "",
    phone: "",
    email: "",
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const navigate = useNavigate();

  const formatDate = (date) =>
    date ? new Date(date).toLocaleDateString("vi-VN") : "N/A";

  const formatPrice = (p) => (p ? p.toLocaleString("vi-VN") + " VNĐ" : "N/A");

  const shouldShowFullFields = () => service?.serviceType === "Hành chính";

  const shouldShowKitCode =
    service?.serviceType === "Dân sự" && order?.sampleMethod === "home";

  useEffect(() => {
    const fetchData = async () => {
      try {
        const orderData = await getTestOrderById(orderId);
        setOrder(orderData);

        const accountInfo = await getAccountByCustomerId(orderData.customerId);
        const customerInfo = await getCustomerById(orderData.customerId);
        setAccount(accountInfo);
        setCustomer(customerInfo);
        setUserInfo({
          fullName: accountInfo?.fullName || "",
          phone: accountInfo?.phone || "",
          email: accountInfo?.email || "",
        });

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
        setTestSamples(existingSamples);
        if (orderData.orderStatus !== "SEND_KIT") {
          setIsSubmitted(true);
        }

        const resultsResponse = await getTestResultsByOrderId(orderId);
        setTestResults(resultsResponse);

        const resultSamplesResponse = await getTestResultSamplesByOrderId(orderId);
        setTestResultSamples(resultSamplesResponse);
      } catch (err) {
        console.error("Lỗi khi tải dữ liệu:", err);
        setUpdateError("Đã xảy ra lỗi khi tải dữ liệu đơn hàng.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [orderId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserInfo((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSampleInputChange = (index, field, value) => {
    setTestSamples((prevSamples) => {
      const updated = [...prevSamples];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  const handleSaveAndConfirm = async () => {
    setUpdateError(null);

    if (order.orderStatus !== "SEND_KIT") {
      setUpdateError("Đơn hàng không ở trạng thái cho phép cập nhật.");
      return;
    }

    try {
      for (const sample of testSamples) {
        await updateTestSample(sample.id, sample);
      }

      await updateAccountInfo(account?.id, {
        fullName: userInfo.fullName,
        phone: userInfo.phone,
        email: userInfo.email,
      });

      await updateTestOrder(orderId, {
        orderStatus: "SEND_SAMPLE",
      });

      setOrder({ ...order, orderStatus: "SEND_SAMPLE" });
      setIsSubmitted(true);
      alert("Lưu mẫu và cập nhật trạng thái thành công!");
    } catch (error) {
      console.error("Lỗi khi lưu:", error);
      setUpdateError("Lỗi khi lưu mẫu hoặc cập nhật đơn hàng.");
    }
  };

  const isFormValid = () =>
    userInfo.fullName.trim() && userInfo.phone.trim() && userInfo.email.trim();

  const STATUS_LABELS = {
    CONFIRM: "Đặt lịch / Đăng ký",
    SEND_KIT: "Đã gửi kit",
    SEND_SAMPLE: "Đã gửi mẫu lại trung tâm",
    COLLECT_SAMPLE: "Đã thu mẫu",
    TESTED: "Đã xét nghiệm",
    COMPLETED: "Hoàn thành",
  };

  const handleBack = () => navigate(-1);

  const uniqueSamples = [
    ...new Set(testResultSamples.map((sample) => sample.testSampleId)),
  ].map((id) => {
    const sample = testSamples.find((s) => s.id === id);
    return { id, name: sample?.name || "N/A" };
  });

  const uniqueLoci = [
    ...new Set(testResultSamples.map((sample) => sample.locusName)),
  ];

  if (loading) return <div className="text-center text-lg">Đang tải...</div>;
  if (!order) return <div className="text-center text-red-500">Không tìm thấy đơn hàng</div>;

  return (
    <div className="order-detail-container max-w-4xl mx-auto p-6 bg-white shadow-md rounded-lg">
      {updateError && <div className="text-red-500 mb-4 text-center">{updateError}</div>}
      <h2 className="text-2xl font-bold mb-6">Chi tiết đơn hàng #{order.orderId}</h2>

      <OrderInfoSections
        account={account}
        customer={customer}
        service={service}
        order={order}
        registrationStaff={registrationStaff}
        testingStaff={testingStaff}
        formatDate={formatDate}
        formatPrice={formatPrice}
        STATUS_LABELS={STATUS_LABELS}
      />

      <section className="mb-6">
        <h3 className="text-xl font-semibold mb-2">Thông tin mẫu xét nghiệm</h3>
        {testSamples.length === 0 && <p className="text-gray-500">Chưa có mẫu xét nghiệm nào.</p>}
        {testSamples.map((sample, idx) => (
          <div key={idx} className="border border-gray-300 p-4 mb-4 rounded-md">
            <h4 className="font-medium mb-2">Mẫu #{idx + 1}</h4>
            {shouldShowKitCode && <p><strong>Mã kit:</strong> {sample.kitCode || "N/A"}</p>}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                value={sample.name || ""}
                onChange={(e) => handleSampleInputChange(idx, "name", e.target.value)}
                placeholder="Họ tên"
                className="border p-2 rounded"
                disabled={isSubmitted}
              />
              <input
                type="text"
                value={sample.gender || ""}
                onChange={(e) => handleSampleInputChange(idx, "gender", e.target.value)}
                placeholder="Giới tính"
                className="border p-2 rounded"
                disabled={isSubmitted}
              />
              <input
                type="date"
                value={sample.dateOfBirth || ""}
                onChange={(e) => handleSampleInputChange(idx, "dateOfBirth", e.target.value)}
                className="border p-2 rounded"
                disabled={isSubmitted}
              />
              <input
                type="text"
                value={sample.relationship || ""}
                onChange={(e) => handleSampleInputChange(idx, "relationship", e.target.value)}
                placeholder="Quan hệ"
                className="border p-2 rounded"
                disabled={isSubmitted}
              />
              <input
                type="text"
                value={sample.sampleType || ""}
                onChange={(e) => handleSampleInputChange(idx, "sampleType", e.target.value)}
                placeholder="Loại mẫu"
                className="border p-2 rounded"
                disabled={isSubmitted}
              />
              {shouldShowFullFields() && (
                <>
                  <input
                    type="text"
                    value={sample.sampleNumber || ""}
                    onChange={(e) => handleSampleInputChange(idx, "sampleNumber", e.target.value)}
                    placeholder="Số mẫu"
                    className="border p-2 rounded"
                    disabled={isSubmitted}
                  />
                  <input
                    type="text"
                    value={sample.address || ""}
                    onChange={(e) => handleSampleInputChange(idx, "address", e.target.value)}
                    placeholder="Địa chỉ"
                    className="border p-2 rounded"
                    disabled={isSubmitted}
                  />
                  <input
                    type="text"
                    value={sample.documentType || ""}
                    onChange={(e) => handleSampleInputChange(idx, "documentType", e.target.value)}
                    placeholder="Loại giấy tờ"
                    className="border p-2 rounded"
                    disabled={isSubmitted}
                  />
                  <input
                    type="text"
                    value={sample.documentNumber || ""}
                    onChange={(e) => handleSampleInputChange(idx, "documentNumber", e.target.value)}
                    placeholder="Số giấy tờ"
                    className="border p-2 rounded"
                    disabled={isSubmitted}
                  />
                  <input
                    type="date"
                    value={sample.dateOfIssue || ""}
                    onChange={(e) => handleSampleInputChange(idx, "dateOfIssue", e.target.value)}
                    className="border p-2 rounded"
                    disabled={isSubmitted}
                  />
                  <input
                    type="date"
                    value={sample.expirationDate || ""}
                    onChange={(e) => handleSampleInputChange(idx, "expirationDate", e.target.value)}
                    className="border p-2 rounded"
                    disabled={isSubmitted}
                  />
                  <input
                    type="text"
                    value={sample.placeOfIssue || ""}
                    onChange={(e) => handleSampleInputChange(idx, "placeOfIssue", e.target.value)}
                    placeholder="Nơi cấp"
                    className="border p-2 rounded"
                    disabled={isSubmitted}
                  />
                  <input
                    type="text"
                    value={sample.nationality || ""}
                    onChange={(e) => handleSampleInputChange(idx, "nationality", e.target.value)}
                    placeholder="Quốc tịch"
                    className="border p-2 rounded"
                    disabled={isSubmitted}
                  />
                  <input
                    type="text"
                    value={sample.fingerprint || ""}
                    onChange={(e) => handleSampleInputChange(idx, "fingerprint", e.target.value)}
                    placeholder="Vân tay"
                    className="border p-2 rounded"
                    disabled={isSubmitted}
                  />
                </>
              )}
              <input
                type="text"
                value={sample.medicalHistory || ""}
                onChange={(e) => handleSampleInputChange(idx, "medicalHistory", e.target.value)}
                placeholder="Tiền sử bệnh"
                className="border p-2 rounded col-span-full"
                disabled={isSubmitted}
              />
            </div>
          </div>
        ))}
      </section>

      {order.orderStatus === "COMPLETED" && (
      <TestResultsAndSamples
        testResults={testResults}
        testResultSamples={testResultSamples}
        testSamples={testSamples}
        uniqueSamples={uniqueSamples}
        uniqueLoci={uniqueLoci}
      />
    )}

      {order.orderStatus === "SEND_KIT" && !isSubmitted && (
        <div className="flex justify-center mb-6">
          <button
            className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition"
            onClick={handleSaveAndConfirm}
            disabled={!isFormValid()}
            style={{
              opacity: !isFormValid() ? 0.5 : 1,
              cursor: !isFormValid() ? "not-allowed" : "pointer",
            }}
          >
            Lưu thông tin và xác nhận đã gửi mẫu
          </button>
        </div>
      )}

      <div className="flex justify-center">
        <button
          className="bg-gray-300 text-gray-800 px-6 py-2 rounded-md hover:bg-gray-400 transition"
          onClick={handleBack}
        >
          Quay lại
        </button>
      </div>
    </div>
  );
};

export default OrderDetailCustomer;