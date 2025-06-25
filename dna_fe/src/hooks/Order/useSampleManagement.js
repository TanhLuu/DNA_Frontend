// hooks/useSampleManagement.js
import { useState } from "react";
import {
  updateTestSample,
  updateAccountInfo,
  updateTestOrder,
} from "../../api/customerOrderApi";

export const useSampleManagement = (order, account, testSamples, setOrder) => {
  const [userInfo, setUserInfo] = useState({
    fullName: account?.fullName || "",
    phone: account?.phone || "",
    email: account?.email || "",
  });
  const [isSubmitted, setIsSubmitted] = useState(order?.orderStatus !== "SEND_KIT");
  const [updateError, setUpdateError] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserInfo((prev) => ({ ...prev, [name]: value }));
  };

  const handleSampleInputChange = (index, field, value) => {
    testSamples[index] = { ...testSamples[index], [field]: value };
    return [...testSamples];
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

      await updateTestOrder(order.orderId, {
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

  return {
    userInfo,
    isSubmitted,
    updateError,
    handleInputChange,
    handleSampleInputChange,
    handleSaveAndConfirm,
    isFormValid,
  };
};