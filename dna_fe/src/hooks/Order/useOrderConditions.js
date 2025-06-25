// hooks/Order/useOrderConditions.js
export const useOrderConditions = (order, service) => {
  const shouldShowFullFields = () => service?.serviceType === "Hành chính";

  const shouldShowKitCode = () =>
    service?.serviceType === "Dân sự" && order?.sampleMethod === "home";

  const isCivilHomePending = () =>
    service?.serviceType === "Dân sự" &&
    order?.sampleMethod === "home" &&
    order?.orderStatus === "CONFIRM";

  return { shouldShowFullFields, shouldShowKitCode, isCivilHomePending };
};