import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import '../../styles/customer/OrderDetail.css';
import { useOrderDetail } from '../../hooks/useOrderDetail';

const OrderDetail = () => {
    const navigate = useNavigate();
    const { orderId } = useParams();
    const {
  order,
  service,
  customer,
  samples,
  registrationStaff,
  registrationStaffAccount,
  testingStaff,
  testingStaffAccount,
  loading
} = useOrderDetail(orderId);


    const formatDate = (dateStr) => dateStr ? new Date(dateStr).toLocaleDateString('vi-VN') : 'N/A';

    if (loading) return <div>Đang tải dữ liệu chi tiết đơn hàng...</div>;
    if (!order) return <div>Không tìm thấy đơn hàng.</div>;


    return (
        <div className="order-detail-container">
            <h2>Chi tiết đơn hàng #{orderId}</h2>

            <div className="order-section">
                <h3>Thông tin đơn hàng</h3>
                <p><strong>Trạng thái:</strong> {{
                    PENDING: 'Đặt lịch/Đăng ký',
                    PREPARING: 'Chuẩn bị lấy mẫu',
                    COLLECTING: 'Thu thập mẫu',
                    TRANSFERRING: 'Chuyển mẫu',
                    TESTING: 'Xét nghiệm',
                    COMPLETED: 'Hoàn thành'
                }[order.orderStatus] || 'N/A'}</p>

                <p><strong>Ngày đăng ký:</strong> {formatDate(order.orderDate)}</p>
                <p><strong>Hình thức thu mẫu:</strong> {order.sampleType === 'center' ? 'Tại trung tâm' : 'Tự lấy mẫu tại nhà'}</p>
                {order.sampleType === 'home' && (
                    <p><strong>Mã kit:</strong> {order.kitCode || 'Không có'}</p>
                )}
                <p><strong>Hình thức nhận kết quả:</strong> {{
                    office: 'Tại văn phòng',
                    home: 'Gửi kết quả về nhà',
                    email: 'Nhận kết quả qua email',
                }[order.resultDeliveryMethod]}</p>
                
                <p><strong>Địa chỉ nhận kết quả:</strong> {order.resultDeliverAddress}</p>
                <p><strong>Số lượng mẫu:</strong> {order.sampleQuantity}</p>
                <p><strong>Tổng phí:</strong> {order.amount.toLocaleString('vi-VN')} VNĐ</p>
            </div>

            <div className="order-section">
                <h3>Thông tin dịch vụ</h3>
                {service ? (
                    <>
                        <p><strong>Tên dịch vụ:</strong> {service.serviceName}</p>
                        <p><strong>Mục đích:</strong> {service.servicePurpose}</p>
                        <p><strong>Mô tả:</strong> {service.describe}</p>
                        <p><strong>Thời gian trả kết quả:</strong> {service.timeTest} ngày</p>
                    </>
                ) : (
                    <p>Không tìm thấy dịch vụ.</p>
                )}
            </div>

            <div className="order-section">
                <h3>Khách hàng</h3>
                {customer ? (
                    <>
                        <p><strong>Tên khách hàng:</strong> {customer.fullName}</p>
                        <p><strong>Email:</strong> {customer.email}</p>
                        <p><strong>Số điện thoại:</strong> {customer.phone}</p>
                    </>
                ) : (
                    <p>Không tìm thấy khách hàng.</p>
                )}
            </div>

            <div className="order-section">
  <h3>Nhân viên xử lý</h3>
  <p><strong>Nhân viên thu mẫu:</strong> {registrationStaffAccount ? registrationStaffAccount.fullName : 'Chưa có'}</p>
  <p><strong>Nhân viên xét nghiệm:</strong> {testingStaffAccount ? testingStaffAccount.fullName : 'Chưa có'}</p>
</div>

            <div className="order-section">
                <h3>Danh sách mẫu xét nghiệm</h3>
                {samples.length > 0 ? (
                    samples.map((sample, index) => (
                        <div key={sample.id || index} className="sample-box">
                            <h4>Người phân tích thứ {index + 1}</h4>
                            <p><strong>Họ tên:</strong> {sample.name}</p>
                            <p><strong>Ngày sinh:</strong> {formatDate(sample.dateOfBirth)}</p>
                            <p><strong>Giới tính:</strong> {sample.gender}</p>
                            <p><strong>Mối quan hệ:</strong> {sample.relationship}</p>
                            <p><strong>Loại mẫu:</strong> {sample.sampleType}</p>

                            {/* Ẩn nếu mục đích là Dân sự */}
                            {service?.servicePurpose?.toLowerCase() !== 'dân sự' && (
                                <>
                                    <p><strong>Loại giấy tờ:</strong> {sample.documentType}</p>
                                    <p><strong>Số giấy tờ:</strong> {sample.documentNumber}</p>
                                    <p><strong>Ngày cấp:</strong> {formatDate(sample.dateOfIssue)}</p>
                                    <p><strong>Ngày hết hạn:</strong> {formatDate(sample.expirationDate)}</p>
                                    <p><strong>Nơi cấp:</strong> {sample.placeOfIssue}</p>
                                    <p><strong>Quốc tịch:</strong> {sample.nationality}</p>
                                    <p><strong>Địa chỉ:</strong> {sample.address}</p>
                                    <p><strong>Số lượng mẫu:</strong> {sample.numberOfSample}</p>
                                    <p><strong>Tiền sử bệnh:</strong> {sample.medicalHistory}</p>
                                </>
                            )}
                        </div>
                    ))
                ) : (
                    <p>Chưa có mẫu xét nghiệm nào.</p>
                )}

            </div>
            <button className="back-button" onClick={() => navigate(-1)}>← Trở về</button>
        </div>
    );
};

export default OrderDetail;