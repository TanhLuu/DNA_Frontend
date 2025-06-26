import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
  getTestOrderById,
  getTestSamplesByOrderId,
  getTestResultsByOrderId,
  getTestResultSamplesByOrderId,
  getAccountByCustomerId,
  getCustomerById,
  getServiceById,
  getStaffById,
  getAccountById,
  createTestSample,
  updateTestOrder,
} from "../../api/adminOrderApi";
import OrderInfoSections from "../../components/Order/OrderInfoSections";
import TestResultsAndSamples from "../../components/Order/TestResultsAndSamples";

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
  const [testResults, setTestResults] = useState([]);
  const [testResultSamples, setTestResultSamples] = useState([]);

  const formatDate = (date) =>
    date ? new Date(date).toLocaleDateString("vi-VN") : "N/A";

  const formatPrice = (p) => (p ? p.toLocaleString("vi-VN") + " VNĐ" : "N/A");

  const getNextStatus = (currentStatus) => {
    if (order?.sampleMethod === "center" && currentStatus === "PENDING") {
      return "COLLECT_SAMPLE";
    }
    const flow = [
      "CONFIRM",
      "SEND_KIT",
      "SEND_SAMPLE",
      "COLLECT_SAMPLE",
      "TESTED",
      "COMPLETED",
    ];
    const i = flow.indexOf(currentStatus);
    return i >= 0 && i < flow.length - 1 ? flow[i + 1] : currentStatus;
  };

  const canUpdateOrder = (status, role) => {
    const nextStatus = getNextStatus(status);
    if (role === "NORMAL_STAFF") {
      if (status === "SEND_KIT" && nextStatus === "SEND_SAMPLE") return false;
      if (status === "COLLECT_SAMPLE" && nextStatus === "TESTED") return false;
      const normal = [
        "CONFIRM",
        "SEND_KIT",
        "SEND_SAMPLE",
        "COLLECT_SAMPLE",
        "TESTED",
      ];
      return normal.includes(status);
    }
    if (role === "LAB_STAFF") {
      if (status === "TESTED" && nextStatus === "COMPLETED") return false;
      const lab = ["COLLECT_SAMPLE", "TESTED"];
      return lab.includes(status);
    }
    return false;
  };

  const shouldShowFullFields = () => service?.serviceType === "Hành chính";
  const shouldShowKitCode =
    service?.serviceType === "Dân sự" && order?.sampleMethod === "home";
  const isCivilHomePending =
    service?.serviceType === "Dân sự" &&
    order?.sampleMethod === "home" &&
    order?.orderStatus === "CONFIRM";

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

        const existingSamples = await getTestSamplesByOrderId(orderData.orderId);
        setSavedSamples(existingSamples);
        if (existingSamples.length >= orderData.sampleQuantity) {
          setSubmitted(true);
        }

        const samplesToInit = orderData.sampleQuantity - existingSamples.length;
        setTestSamples(
          Array(samplesToInit)
            .fill()
            .map(() => ({
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
              kitCode: "",
            }))
        );

        const resultsResponse = await getTestResultsByOrderId(orderId);
        setTestResults(resultsResponse);

        const resultSamplesResponse = await getTestResultSamplesByOrderId(orderId);
        setTestResultSamples(resultSamplesResponse);
      } catch (err) {
        console.error("Lỗi khi tải dữ liệu:", err);
        setUpdateError("Lỗi khi tải dữ liệu đơn hàng.");
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
      setKitCodeError("");
    }
  };

  const handleUpdateAll = async () => {
    setUpdateError(null);
    const staffRole = localStorage.getItem("staffRole");
    const staffId = localStorage.getItem("staffId");

    if (!staffRole || !staffId) {
      setUpdateError(
        "Không tìm thấy thông tin nhân viên. Vui lòng đăng nhập lại."
      );
      return;
    }

    if (!canUpdateOrder(order.orderStatus, staffRole)) {
      setUpdateError(
        `Bạn không có quyền cập nhật đơn hàng ở trạng thái ${order.orderStatus}`
      );
      return;
    }

    const nextStatus = getNextStatus(order.orderStatus);
    if (nextStatus === order.orderStatus) {
      setUpdateError("Đơn hàng đã ở trạng thái cuối cùng!");
      return;
    }

    if (isCivilHomePending) {
      const missingKit = testSamples.some((sample) => !sample.kitCode?.trim());
      if (missingKit) {
        setKitCodeError("Vui lòng nhập mã kit cho tất cả các mẫu.");
        return;
      }
    }

    try {
      if (!submitted && testSamples.length > 0) {
        const requests = testSamples.map((sample) =>
          createTestSample({
            ...sample,
            orderId: order.orderId,
            customerId: order.customerId,
          })
        );

        await Promise.all(requests);
        const newSavedSamples = await getTestSamplesByOrderId(order.orderId);
        setSavedSamples(newSavedSamples);
        setSubmitted(true);
      }

      await updateTestOrder(order.orderId, {
        staffId,
        orderStatus: nextStatus,
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
    CONFIRM: "Đặt lịch / Đăng ký",
    SEND_KIT: "Đã gửi kit",
    SEND_SAMPLE: "Đã gửi mẫu lại trung tâm",
    COLLECT_SAMPLE: "Đã thu mẫu",
    TESTED: "Đã xét nghiệm",
    COMPLETED: "Hoàn thành",
  };

  const uniqueSamples = [
    ...new Set(testResultSamples.map((sample) => sample.testSampleId)),
  ].map((id) => {
    const sample = savedSamples.find((s) => s.id === id);
    return { id, name: sample?.name || "N/A" };
  });

  const uniqueLoci = [
    ...new Set(testResultSamples.map((sample) => sample.locusName)),
  ];

  if (loading) return <div className="text-center p-6">Đang tải...</div>;
  if (!order) return <div className="text-center p-6 text-red-500">Không tìm thấy đơn hàng</div>;

  return (
    <div className="container mx-auto p-6 bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-lg">
        {updateError && (
          <div className="text-red-500 mb-4 text-center">{updateError}</div>
        )}
        {kitCodeError && (
          <div className="text-red-500 mb-4 text-center">{kitCodeError}</div>
        )}
        <h2 className="text-2xl font-bold text-center mb-6">
          Chi tiết đơn hàng #{order.orderId}
        </h2>

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
          {isCivilHomePending && (
            <div className="text-yellow-600 font-semibold mb-4">
              ⚠️ Vui lòng nhập mã kit cho từng mẫu trước khi gửi cho khách hàng.
            </div>
          )}
          {savedSamples.map((sample, idx) => (
            <div key={idx} className="border p-4 mb-4 rounded">
              <h4 className="font-semibold">Mẫu #{idx + 1}</h4>
              {shouldShowKitCode && (
                <p>
                  <strong>Kit:</strong> {sample.kitCode || "N/A"}
                </p>
              )}
              <p>
                <strong>Họ tên:</strong> {sample.name || "N/A"}
              </p>
              <p>
                <strong>Giới tính:</strong> {sample.gender || "N/A"}
              </p>
              <p>
                <strong>Ngày sinh:</strong> {formatDate(sample.dateOfBirth)}
              </p>
              <p>
                <strong>Quan hệ:</strong> {sample.relationship || "N/A"}
              </p>
              <p>
                <strong>Loại mẫu:</strong> {sample.sampleType || "N/A"}
              </p>
              {shouldShowFullFields() && (
                <>
                  <p>
                    <strong>Số mẫu:</strong> {sample.sampleNumber || "N/A"}
                  </p>
                  <p>
                    <strong>Địa chỉ:</strong> {sample.address || "N/A"}
                  </p>
                  <p>
                    <strong>Loại giấy tờ:</strong> {sample.documentType || "N/A"}
                  </p>
                  <p>
                    <strong>Số giấy tờ:</strong> {sample.documentNumber || "N/A"}
                  </p>
                  <p>
                    <strong>Ngày cấp:</strong> {formatDate(sample.dateOfIssue)}
                  </p>
                  <p>
                    <strong>Hết hạn:</strong> {formatDate(sample.expirationDate)}
                  </p>
                  <p>
                    <strong>Nơi cấp:</strong> {sample.placeOfIssue || "N/A"}
                  </p>
                  <p>
                    <strong>Quốc tịch:</strong> {sample.nationality || "N/A"}
                  </p>
                  <p>
                    <strong>Vân tay:</strong> {sample.fingerprint || "N/A"}
                  </p>
                </>
              )}
              <p>
                <strong>Tiền sử bệnh:</strong> {sample.medicalHistory || "N/A"}
              </p>
            </div>
          ))}

          {!submitted &&
            testSamples.map((sample, index) => (
              <div
                key={index}
                className="border border-dashed border-gray-400 p-4 mb-4 rounded"
              >
                <h4 className="font-semibold mb-3">Mẫu #{index + 1}</h4>
                {shouldShowKitCode && (
                  <div className="mb-2">
                    <input
                      placeholder="Kit Code"
                      value={sample.kitCode || ""}
                      onChange={(e) =>
                        handleChange(index, "kitCode", e.target.value)
                      }
                      className="border p-2 w-full rounded"
                    />
                  </div>
                )}
                <div className="mb-2">
                  <input
                    placeholder="Họ tên"
                    value={sample.name || ""}
                    onChange={(e) => handleChange(index, "name", e.target.value)}
                    className="border p-2 w-full rounded"
                  />
                </div>
                <div className="mb-2">
                  <select
                    value={sample.gender || ""}
                    onChange={(e) => handleChange(index, "gender", e.target.value)}
                    className="border p-2 w-full rounded"
                  >
                    <option value="">Chọn giới tính</option>
                    <option value="Nam">Nam</option>
                    <option value="Nữ">Nữ</option>
                  </select>
                </div>
                <div className="mb-2">
                  <input
                    type="date"
                    value={sample.dateOfBirth || ""}
                    onChange={(e) =>
                      handleChange(index, "dateOfBirth", e.target.value)
                    }
                    className="border p-2 w-full rounded"
                  />
                </div>
                <div className="mb-2">
                  <select
                    value={sample.relationship || ""}
                    onChange={(e) =>
                      handleChange(index, "relationship", e.target.value)
                    }
                    className="border p-2 w-full rounded"
                  >
                    <option value="">Chọn quan hệ</option>
                    <option value="CHA">Cha</option>
                    <option value="MẸ">Mẹ</option>
                    <option value="CON">Con</option>
                    <option value="ÔNG">Ông</option>
                    <option value="BÀ">Bà</option>
                    <option value="CHÁU">Cháu</option>
                    <option value="ANH">Anh</option>
                    <option value="CHỊ">Chị</option>
                    <option value="EM">Em</option>
                  </select>
                </div>
                <div className="mb-2">
                  <select
                    value={sample.sampleType || ""}
                    onChange={(e) =>
                      handleChange(index, "sampleType", e.target.value)
                    }
                    className="border p-2 w-full rounded"
                  >
                    <option value="">Chọn loại mẫu</option>
                    <option value="Mau">Mẫu máu</option>
                    <option value="Toc">Mẫu tóc</option>
                    <option value="Mong">Mẫu móng</option>
                    <option value="NiemMac">Mẫu niêm mạc</option>
                  </select>
                </div>
                {shouldShowFullFields() && (
                  <>
                    <div className="mb-2">
                      <input
                        placeholder="Số mẫu"
                        value={sample.sampleNumber || ""}
                        onChange={(e) =>
                          handleChange(index, "sampleNumber", e.target.value)
                        }
                        className="border p-2 w-full rounded"
                      />
                    </div>
                    <div className="mb-2">
                      <input
                        placeholder="Địa chỉ"
                        value={sample.address || ""}
                        onChange={(e) =>
                          handleChange(index, "address", e.target.value)
                        }
                        className="border p-2 w-full rounded"
                      />
                    </div>
                    <div className="mb-2">
                      <select
                        value={sample.documentType || ""}
                        onChange={(e) =>
                          handleChange(index, "documentType", e.target.value)
                        }
                        className="border p-2 w-full rounded"
                      >
                        <option value="CCCD">CCCD</option>
                        <option value="GKS">Giấy khai sinh</option>
                        <option value="HoChieu">Hộ chiếu</option>
                      </select>
                    </div>
                    <div className="mb-2">
                      <input
                        placeholder="Số giấy tờ"
                        value={sample.documentNumber || ""}
                        onChange={(e) =>
                          handleChange(index, "documentNumber", e.target.value)
                        }
                        className="border p-2 w-full rounded"
                      />
                    </div>
                    <div className="mb-2">
                      <input
                        type="date"
                        value={sample.dateOfIssue || ""}
                        onChange={(e) =>
                          handleChange(index, "dateOfIssue", e.target.value)
                        }
                        className="border p-2 w-full rounded"
                      />
                    </div>
                    <div className="mb-2">
                      <input
                        type="date"
                        value={sample.expirationDate || ""}
                        onChange={(e) =>
                          handleChange(index, "expirationDate", e.target.value)
                        }
                        className="border p-2 w-full rounded"
                      />
                    </div>
                    <div className="mb-2">
                      <input
                        placeholder="Nơi cấp"
                        value={sample.placeOfIssue || ""}
                        onChange={(e) =>
                          handleChange(index, "placeOfIssue", e.target.value)
                        }
                        className="border p-2 w-full rounded"
                      />
                    </div>
                    <div className="mb-2">
                      <input
                        placeholder="Quốc tịch"
                        value={sample.nationality || ""}
                        onChange={(e) =>
                          handleChange(index, "nationality", e.target.value)
                        }
                        className="border p-2 w-full rounded"
                      />
                    </div>
                    <div className="mb-2">
                      <input
                        placeholder="Vân tay"
                        value={sample.fingerprint || ""}
                        onChange={(e) =>
                          handleChange(index, "fingerprint", e.target.value)
                        }
                        className="border p-2 w-full rounded"
                      />
                    </div>
                  </>
                )}
                <div className="mb-2">
                  <select
                    value={sample.medicalHistory || ""}
                    onChange={(e) =>
                      handleChange(index, "medicalHistory", e.target.value)
                    }
                    className="border p-2 w-full rounded"
                  >
                    <option value="">Chọn tiền sử bệnh</option>
                    <option value="Khong">Không</option>
                    <option value="Co">Có</option>
                  </select>
                </div>
              </div>
            ))}

          {order.orderStatus === "COLLECT_SAMPLE" &&
            submitted &&
            localStorage.getItem("staffRole") === "LAB_STAFF" && (
              <Link
                to={`/admin/test-result-input/${order.orderId}`}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 mt-4 inline-block"
              >
                Nhập số liệu
              </Link>
            )}

          {canUpdateOrder(order.orderStatus, localStorage.getItem("staffRole")) &&
            getNextStatus(order.orderStatus) !== order.orderStatus && (
              <button
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 mt-4"
                onClick={handleUpdateAll}
                disabled={
                  isCivilHomePending &&
                  testSamples.some((sample) => !sample.kitCode?.trim())
                }
                style={{
                  opacity:
                    isCivilHomePending &&
                    testSamples.some((sample) => !sample.kitCode?.trim())
                      ? 0.5
                      : 1,
                  cursor:
                    isCivilHomePending &&
                    testSamples.some((sample) => !sample.kitCode?.trim())
                      ? "not-allowed"
                      : "pointer",
                }}
              >
                {isCivilHomePending
                  ? "Xác nhận đã gửi kit cho khách hàng"
                  : "Cập nhật"}
              </button>
            )}
        </section>

        <TestResultsAndSamples
          testResults={testResults}
          testResultSamples={testResultSamples}
          testSamples={savedSamples}
          uniqueSamples={uniqueSamples}
          uniqueLoci={uniqueLoci}
        />
      </div>
    </div>
  );
};

export default OrderDetailAdmin;