import React, { useState, useEffect } from 'react';
import { fetchAccountInfo, getCustomerByAccountId } from 'src/api/accountApi';
import { getTestOrderById, createTestOrder } from 'src/api/testorder';
import axiosInstance from '../api/axiosInstance'; // fallback nếu cần
import "../styles/tuthu&guimau.css";

function formatDate(dateString) {
    if (!dateString) return "";
    const date = new Date(dateString);
    if (isNaN(date)) return dateString;
    return date.toLocaleDateString('vi-VN');
}

function TuThuGuiMau({ orderId }) {
    const [displayData, setDisplayData] = useState({
        fullName: "",
        dateOfBirth: "",
        gender: "",
        phone: "",
        address: "",
        email: "",
        orderId: "",
        orderDate: "",
    });

    const [kitInfo, setKitInfo] = useState({
        serviceId: "",
        tenBoKit: "",
        maBoKit: "",
        tenKhachHang: "",
        soDienThoai: "",
        diaChiNhan: "",
        ngayGui: "",
    });

    const [services, setServices] = useState([]);
    const [confirmed, setConfirmed] = useState(false);

    // Lấy thông tin account, customer, testorder
    useEffect(() => {
        const fetchData = async () => {
            try {
                // 1. Lấy account info
                const account = await fetchAccountInfo();
                // 2. Lấy customer info theo accountId
                const customerRes = await getCustomerByAccountId(account.id);
                const customer = customerRes.data || customerRes; // fallback cho kiểu trả về
                // 3. Lấy testorder (nếu có orderId)
                let testOrder = {};
                if (orderId) {
                    testOrder = await getTestOrderById(orderId);
                }

                setDisplayData({
                    fullName: account.fullName || "",
                    email: account.email || "",
                    phone: account.phone || "",
                    gender: customer.gender || "",
                    dateOfBirth: customer.dateOfBirth || "",
                    address: customer.address || "",
                    orderId: testOrder.id || "",
                    orderDate: testOrder.orderDate || "",
                });

                // Nếu bạn muốn cập nhật luôn kitInfo với tên KH, SDT, địa chỉ mặc định
                setKitInfo((prev) => ({
                    ...prev,
                    tenKhachHang: account.fullName || "",
                    soDienThoai: account.phone || "",
                    diaChiNhan: customer.address || "",
                }));
            } catch (err) {
                console.log("Lỗi lấy thông tin user:", err);
            }
        };
        fetchData();
    }, [orderId]);

    // Lấy danh sách dịch vụ
    useEffect(() => {
        const fetchServices = async () => {
            try {
                const res = await axiosInstance.get('/api/services');
                setServices(res.data || []);
            } catch (err) {
                setServices([]);
            }
        };
        fetchServices();
    }, []);

    // Xử lý form
    const handleChange = (e) => {
        const { name, value } = e.target;
        setKitInfo((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Gửi đơn hàng test order mới
            await createTestOrder({
                ...kitInfo,
                customerId: displayData.orderId ? undefined : displayData.id,
                orderDate: kitInfo.ngayGui,
            });
            setConfirmed(true);
        } catch (err) {
            alert("Gửi đơn thất bại");
        }
    };

    return (
        <div className="container">
            {/* Customer Information */}
            <div className="customer-info">
                <h3>Thông tin Khách hàng</h3>
                <div>
                    <div><b>Họ và tên:</b> {displayData.fullName}</div>
                    <div><b>Ngày sinh:</b> {formatDate(displayData.dateOfBirth)}</div>
                    <div><b>Giới tính:</b> {displayData.gender}</div>
                    <div><b>Số điện thoại:</b> {displayData.phone}</div>
                    <div><b>Địa chỉ:</b> {displayData.address}</div>
                    <div><b>Email:</b> {displayData.email}</div>
                    <div><b>Mã đơn:</b> {displayData.orderId}</div>
                    <div><b>Ngày đặt lịch:</b> {formatDate(displayData.orderDate)}</div>
                </div>
            </div>
            {/* Sample Collection Form */}
            <form className="form-section" onSubmit={handleSubmit}>
                <h2 className="form-title">Chuẩn bị lấy mẫu</h2>
                <div className="form-row">
                    <label><b>Chọn dịch vụ:</b></label>
                    <select
                        name="serviceId"
                        value={kitInfo.serviceId}
                        onChange={handleChange}
                        className="form-input"
                        required
                    >
                        <option value="">-- Chọn dịch vụ --</option>
                        {services.map(service => (
                            <option key={service.serviceID || service.id} value={service.serviceID || service.id}>
                                {service.serviceName}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="form-row">
                    <label><b>Tên bộ kit:</b></label>
                    <input
                        name="tenBoKit"
                        value={kitInfo.tenBoKit}
                        onChange={handleChange}
                        className="form-input"
                        required
                    />
                </div>
                <div className="form-row">
                    <label><b>Mã bộ kit:</b></label>
                    <input
                        name="maBoKit"
                        value={kitInfo.maBoKit}
                        onChange={handleChange}
                        className="form-input"
                        required
                    />
                </div>
                <div className="form-row">
                    <label><b>Tên khách hàng:</b></label>
                    <input
                        name="tenKhachHang"
                        value={kitInfo.tenKhachHang}
                        onChange={handleChange}
                        className="form-input"
                        required
                    />
                </div>
                <div className="form-row">
                    <label><b>Số điện thoại:</b></label>
                    <input
                        name="soDienThoai"
                        value={kitInfo.soDienThoai}
                        onChange={handleChange}
                        className="form-input"
                        required
                    />
                </div>
                <div className="form-row">
                    <label><b>Địa chỉ nhận:</b></label>
                    <input
                        name="diaChiNhan"
                        value={kitInfo.diaChiNhan}
                        onChange={handleChange}
                        className="form-input"
                        required
                    />
                </div>
                <div className="form-row">
                    <label><b>Ngày gửi:</b></label>
                    <input
                        type="date"
                        name="ngayGui"
                        value={kitInfo.ngayGui}
                        onChange={handleChange}
                        className="form-input"
                        required
                    />
                </div>
                <div className="form-actions">
                    {!confirmed ? (
                        <>
                            <button type="submit" className="btn btn-primary">Xác nhận gửi</button>
                            <button type="button" className="btn btn-cancel">Hủy</button>
                        </>
                    ) : (
                        <button type="button" className="btn btn-primary">Xác nhận</button>
                    )}
                </div>
                {confirmed && (
                    <div className="confirm-message">
                        <b>
                            Xác nhận trung tâm đã nhận lại thành công bộ kit<br />
                            có mẫu xét nghiệm của khách gửi lại
                        </b>
                    </div>
                )}
            </form>
        </div>
    );
}

export default TuThuGuiMau;