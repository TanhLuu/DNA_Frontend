// OrderDetailCustomer.js
import React from "react";
import { useParams } from "react-router-dom";
import { useOrderData } from "../../hooks/Order/useOrderData";
import { useFormatUtils } from "../../hooks/Order/useFormatUtils";
import { useSampleManagement } from "../../hooks/Order/useSampleManagement";
import { useOrderConditions } from "../../hooks/Order/useOrderConditions";
import { useSampleData } from "../../hooks/Order/useSampleData";
import OrderInfoSections from "../../components/OrderDetail/OrderInfoSections";
import TestResultsAndSamples from "../../components/OrderDetail/TestResultsAndSamples";
import TestSampleSection from "../../components/OrderDetail/TestSampleSection";
import TestSampleInput from "../../components/OrderDetail/TestSampleInput";
import OrderActions from "../../components/OrderDetail/OrderActions";

const OrderDetailCustomer = () => {
  const { orderId } = useParams();
  const {
    order,
    setOrder,
    customer,
    account,
    service,
    testSamples,
    setTestSamples,
    testResults,
    testResultSamples,
    registrationStaff,
    testingStaff,
    loading,
    error,
  } = useOrderData(orderId);
  const { formatDate, formatPrice } = useFormatUtils();
  const {
    userInfo,
    isSubmitted,
    updateError,
    handleInputChange,
    handleSampleInputChange,
    handleSaveAndConfirm,
    isFormValid,
  } = useSampleManagement(order, account, testSamples, setOrder);
  const { shouldShowFullFields, shouldShowKitCode, isCivilHomePending } = useOrderConditions(
    order,
    service
  );
  const { uniqueSamples, uniqueLoci } = useSampleData(testResultSamples, testSamples);

  const STATUS_LABELS = {
    CONFIRM: "Đặt lịch / Đăng ký",
    SEND_KIT: "Đã gửi kit",
    SEND_SAMPLE: "Đã gửi mẫu lại trung tâm",
    COLLECT_SAMPLE: "Đã thu mẫu",
    TESTED: "Đã xét nghiệm",
    COMPLETED: "Hoàn thành",
  };

  const handleBack = () => window.history.back();

  if (loading) return <div className="text-center text-lg">Đang tải...</div>;
  if (!order) return <div className="text-center text-red-500">Không tìm thấy đơn hàng</div>;

  return (
    <div className="order-detail-container max-w-4xl mx-auto p-6 bg-white shadow-md rounded-lg">
      {(updateError || error) && (
        <div className="text-red-500 mb-4 text-center">{updateError || error}</div>
      )}
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
        <TestSampleSection
          samples={testSamples}
          formatDate={formatDate}
          shouldShowKitCode={shouldShowKitCode}
          shouldShowFullFields={shouldShowFullFields}
        />
        {!isSubmitted &&
          testSamples.map((sample, index) => (
            <TestSampleInput
              key={index}
              sample={sample}
              index={index}
              onChange={(idx, field, value) =>
                setTestSamples(handleSampleInputChange(idx, field, value))
              }
              isDisabled={isSubmitted}
              shouldShowKitCode={shouldShowKitCode}
              shouldShowFullFields={shouldShowFullFields}
            />
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

      <OrderActions
        order={order}
        submitted={isSubmitted}
        isCivilHomePending={isCivilHomePending}
        testSamples={testSamples}
        handleUpdateAll={handleSaveAndConfirm}
        handleBack={handleBack}
        isFormValid={isFormValid}
        staffRole={null} // Không cần staffRole cho customer
      />
    </div>
  );
};

export default OrderDetailCustomer;