import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useOrderData } from "../../hooks/Order/useOrderData";
import { useFormatUtils } from "../../hooks/Order/useFormatUtils";
import { useAdminSampleManagement } from "../../hooks/Order/useAdminSampleManagement";
import { useOrderConditions } from "../../hooks/Order/useOrderConditions";
import { useSampleData } from "../../hooks/Order/useSampleData";
import STATUS_LABELS from "../../constants/orderStatusLabels";
import OrderInfoSections from "../../components/OrderDetail/OrderInfoSections";
import TestResultsAndSamples from "../../components/OrderDetail/TestResultsAndSamples";
import TestSampleSection from "../../components/OrderDetail/TestSampleSection";
import TestSampleInput from "../../components/OrderDetail/TestSampleInput";
import OrderActions from "../../components/OrderDetail/OrderActions";

const OrderDetailAdmin = () => {
  const { orderId } = useParams();
  const {
    order,
    setOrder,
    customer,
    account,
    service,
    testSamples: savedSamplesFromApi,
    testResults,
    testResultSamples,
    registrationStaff,
    testingStaff,
    loading,
    error,
  } = useOrderData(orderId);
  const { formatDate, formatPrice } = useFormatUtils();
  const {
    testSamples,
    savedSamples,
    submitted,
    updateError,
    kitCodeError,
    initializeSamples,
    handleChange,
    handleUpdateAll,
    canUpdateOrder,
    getNextStatus,
  } = useAdminSampleManagement(order, setOrder);
  const { shouldShowFullFields, shouldShowKitCode, isCivilHomePending } = useOrderConditions(order, service);
  const { uniqueSamples, uniqueLoci } = useSampleData(testResultSamples, savedSamples);

  useEffect(() => {
    if (order && savedSamplesFromApi) {
      initializeSamples(savedSamplesFromApi, order.sampleQuantity);
    }
  }, [order, savedSamplesFromApi, initializeSamples]);

  const handleBack = () => window.history.back();

  if (loading) return <div className="text-center p-6">Đang tải...</div>;
  if (!order || error) return (
    <div className="text-center p-6 text-red-500">{error || "Không tìm thấy đơn hàng"}</div>
  );

  return (
    <div className="container mx-auto p-6 bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-lg">
        {(updateError || error) && (
          <div className="text-red-500 mb-4 text-center">{updateError || error}</div>
        )}
        {kitCodeError && <div className="text-red-500 mb-4 text-center">{kitCodeError}</div>}
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
          <TestSampleSection
            samples={savedSamples}
            formatDate={formatDate}
            shouldShowKitCode={shouldShowKitCode}
            shouldShowFullFields={shouldShowFullFields}
          />
          {!submitted &&
            testSamples.map((sample, index) => (
              <TestSampleInput
                key={index}
                sample={sample}
                index={index}
                onChange={handleChange}
                isDisabled={false}
                shouldShowKitCode={shouldShowKitCode}
                shouldShowFullFields={shouldShowFullFields}
              />
            ))}
        </section>

        {order.orderStatus === "COMPLETED" && (
          <TestResultsAndSamples
            testResults={testResults}
            testResultSamples={testResultSamples}
            testSamples={savedSamples}
            uniqueSamples={uniqueSamples}
            uniqueLoci={uniqueLoci}
          />
        )}

        <OrderActions
          order={order}
          submitted={submitted}
          isCivilHomePending={isCivilHomePending}
          testSamples={testSamples}
          canUpdateOrder={canUpdateOrder}
          getNextStatus={getNextStatus}
          handleUpdateAll={handleUpdateAll}
          handleBack={handleBack}
          staffRole={localStorage.getItem("staffRole")}
        />
      </div>
    </div>
  );
};

export default OrderDetailAdmin;
