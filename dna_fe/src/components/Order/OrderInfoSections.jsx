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
          <p><strong>Họ tên:</strong> {account?.fullName || "Không có"}</p>
          <p><strong>SĐT:</strong> {account?.phone || "Không có"}</p>
          <p><strong>Email:</strong> {account?.email || "Không có"}</p>
          <p><strong>Giới tính:</strong> {customer?.gender || "Không có"}</p>
          <p><strong>Ngày sinh:</strong> {formatDate(customer?.dateOfBirth)}</p>
          <p><strong>Địa chỉ:</strong> {customer?.address || "Không có"}</p>
          <p><strong>Loại giấy tờ:</strong> {customer?.documentType || "Không có"}</p>
          <p><strong>Số giấy tờ:</strong> {customer?.cccd || "Không có"}</p>
          <p><strong>Nơi cấp:</strong> {customer?.placeOfIssue || "Không có"}</p>
          <p><strong>Ngày cấp:</strong> {formatDate(customer?.dateOfIssue)}</p>
        </div>
      </section>

      <section className="mb-6">
        <h3 className="text-xl font-semibold mb-2">Thông tin dịch vụ</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <p><strong>Tên dịch vụ:</strong> {service?.serviceName || "Không có"}</p>
          <p><strong>Loại dịch vụ:</strong> {service?.serviceType || "Không có"}</p>
          <p>
            <strong>Thời gian xét nghiệm:</strong>{" "}
            {service?.timeTest ? `${service.timeTest} ngày` : "Không có"}
          </p>
        </div>
      </section>

      <section className="mb-6">
        <h3 className="text-xl font-semibold mb-2">Thông tin đơn hàng</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <p>
            <strong>Trạng thái:</strong>{" "}
            {STATUS_LABELS[order?.orderStatus] || "Không có"}
          </p>
          <p><strong>Ngày đặt:</strong> {formatDate(order?.orderDate)}</p>
          <p>
            <strong>Hình thức thu mẫu:</strong>{" "}
            {order?.sampleMethod === "center" ? "Tại trung tâm" : "Tại nhà"}
          </p>
          <p><strong>Số lượng mẫu:</strong> {order?.sampleQuantity || "Không có"}</p>
          <p>
            <strong>Phương thức nhận kết quả:</strong>{" "}
            {order?.resultDeliveryMethod || "Không có"}
          </p>
          <p>
            <strong>Địa chỉ nhận kết quả:</strong>{" "}
            {order?.resultDeliverAddress || "Không có"}
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