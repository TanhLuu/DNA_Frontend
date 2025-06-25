// components/Order/OrderActions.js
import React from "react";
import { Link } from "react-router-dom";

const OrderActions = ({
  order,
  submitted,
  isCivilHomePending,
  testSamples,
  canUpdateOrder,
  getNextStatus,
  handleUpdateAll,
  handleBack,
  isFormValid,
  staffRole,
}) => {
  const isLabStaff = staffRole === "LAB_STAFF";
  const isValid = isFormValid ? isFormValid() : true; // Nếu không có isFormValid (cho admin), mặc định là true

  return (
    <div className="flex justify-center mb-6">
      {order.orderStatus === "COLLECT_SAMPLE" && submitted && isLabStaff && (
        <Link
          to={`/admin/test-result-input/${order.orderId}`}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 mr-2"
        >
          Nhập số liệu
        </Link>
      )}
      {canUpdateOrder?.(order.orderStatus, staffRole) &&
        getNextStatus?.(order.orderStatus) !== order.orderStatus && (
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 mr-2"
            onClick={handleUpdateAll}
            disabled={isCivilHomePending && testSamples.some((sample) => !sample.kitCode?.trim())}
            style={{
              opacity:
                (isCivilHomePending && testSamples.some((sample) => !sample.kitCode?.trim())) ||
                !isValid
                  ? 0.5
                  : 1,
              cursor:
                (isCivilHomePending && testSamples.some((sample) => !sample.kitCode?.trim())) ||
                !isValid
                  ? "not-allowed"
                  : "pointer",
            }}
          >
            {isCivilHomePending ? "Xác nhận đã gửi kit cho khách hàng" : "Cập nhật"}
          </button>
        )}
      {order.orderStatus === "SEND_KIT" && !isValid && (
        <button
          className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 mr-2"
          onClick={handleUpdateAll}
          disabled={!isValid}
          style={{
            opacity: !isValid ? 0.5 : 1,
            cursor: !isValid ? "not-allowed" : "pointer",
          }}
        >
          Lưu thông tin và xác nhận đã gửi mẫu
        </button>
      )}
      <button
        className="bg-gray-300 text-gray-800 px-6 py-2 rounded-md hover:bg-gray-400"
        onClick={handleBack}
      >
        Quay lại
      </button>
    </div>
  );
};

export default OrderActions;