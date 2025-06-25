import React from "react";

const OrderInfoSections = ({
  account,
  customer,
  service,
  order,
  registrationStaff,
  testingStaff,
  formatDate,
  formatPrice,
  STATUS_LABELS,
}) => {
  return (
    <>
      <section className="mb-6">
        <h3 className="text-xl font-semibold mb-2">Thông tin khách hàng</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <p><strong>Họ tên:</strong> {account?.fullName || "N/A"}</p>
          <p><strong>SĐT:</strong> {account?.phone || "N/A"}</p>
          <p><strong>Email:</strong> {account?.email || "N/A"}</p>
          <p><strong>Giới tính:</strong> {customer?.gender || "N/A"}</p>
          <p><strong>Ngày sinh:</strong> {formatDate(customer?.dateOfBirth)}</p>
          <p><strong>Địa chỉ:</strong> {customer?.address || "N/A"}</p>
          <p><strong>Loại giấy tờ:</strong> {customer?.documentType || "N/A"}</p>
          <p><strong>Số giấy tờ:</strong> {customer?.cccd || "N/A"}</p>
          <p><strong>Nơi cấp:</strong> {customer?.placeOfIssue || "N/A"}</p>
          <p><strong>Ngày cấp:</strong> {formatDate(customer?.dateOfIssue)}</p>
        </div>
      </section>

      <section className="mb-6">
        <h3 className="text-xl font-semibold mb-2">Thông tin dịch vụ</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <p><strong>Tên dịch vụ:</strong> {service?.serviceName || "N/A"}</p>
          <p><strong>Loại dịch vụ:</strong> {service?.serviceType || "N/A"}</p>
          <p>
            <strong>Thời gian xét nghiệm:</strong>{" "}
            {service?.timeTest ? `${service.timeTest} ngày` : "N/A"}
          </p>
        </div>
      </section>

      <section className="mb-6">
        <h3 className="text-xl font-semibold mb-2">Thông tin đơn hàng</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <p>
            <strong>Trạng thái:</strong>{" "}
            {STATUS_LABELS[order?.orderStatus] || "N/A"}
          </p>
          <p><strong>Ngày đặt:</strong> {formatDate(order?.orderDate)}</p>
          <p>
            <strong>Hình thức thu mẫu:</strong>{" "}
            {order?.sampleMethod === "center" ? "Tại trung tâm" : "Tại nhà"}
          </p>
          <p><strong>Số lượng mẫu:</strong> {order?.sampleQuantity || "N/A"}</p>
          <p>
            <strong>Phương thức nhận kết quả:</strong>{" "}
            {order?.resultDeliveryMethod || "N/A"}
          </p>
          <p>
            <strong>Địa chỉ nhận kết quả:</strong>{" "}
            {order?.resultDeliverAddress || "N/A"}
          </p>
          <p><strong>Giá:</strong> {formatPrice(order?.amount)}</p>
        </div>
      </section>

      <section className="mb-6">
        <h3 className="text-xl font-semibold mb-2">Thông tin nhân viên phụ trách</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <p>
            <strong>Nhân viên đăng ký:</strong>{" "}
            {registrationStaff?.fullName || "Chưa có"}
          </p>
          <p>
            <strong>Nhân viên xét nghiệm:</strong>{" "}
            {testingStaff?.fullName || "Chưa có"}
          </p>
        </div>
      </section>
    </>
  );
};

export default OrderInfoSections;