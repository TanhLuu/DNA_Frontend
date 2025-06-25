// hooks/useAdminSampleManagement.js
import { useState } from "react";
import {
  createTestSample,
  updateTestOrder,
  getTestSamplesByOrderId,
} from "../../api/adminOrderApi";

export const useAdminSampleManagement = (order, setOrder) => {
  const [testSamples, setTestSamples] = useState([]);
  const [savedSamples, setSavedSamples] = useState([]);
  const [submitted, setSubmitted] = useState(false);
  const [updateError, setUpdateError] = useState(null);
  const [kitCodeError, setKitCodeError] = useState("");

  const initializeSamples = (existingSamples, sampleQuantity) => {
    setSavedSamples(existingSamples);
    if (existingSamples.length >= sampleQuantity) {
      setSubmitted(true);
    }
    const samplesToInit = sampleQuantity - existingSamples.length;
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
  };

  const handleChange = (index, field, value) => {
    const updatedSamples = [...testSamples];
    updatedSamples[index][field] = value;
    setTestSamples(updatedSamples);
    if (field === "kitCode") {
      setKitCodeError("");
    }
  };

  const getNextStatus = (currentStatus) => {
    if (order?.sampleMethod === "center" && currentStatus === "CONFIRM") {
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

    const isCivilHomePending =
      order?.serviceType === "Dân sự" &&
      order?.sampleMethod === "home" &&
      order?.orderStatus === "CONFIRM";

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

  return {
    testSamples,
    savedSamples,
    submitted,
    updateError,
    kitCodeError,
    initializeSamples,
    handleChange,
    handleUpdateAll,
    getNextStatus,
    canUpdateOrder,
  };
};