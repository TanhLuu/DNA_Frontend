// hooks/useFormatUtils.js
export const useFormatUtils = () => {
  const formatDate = (date) =>
    date ? new Date(date).toLocaleDateString("vi-VN") : "N/A";

  const formatPrice = (price) =>
    price ? price.toLocaleString("vi-VN") + " VNĐ" : "N/A";

  return { formatDate, formatPrice };
};