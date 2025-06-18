import React, { useEffect, useState } from "react";
import { getCustomerByAccountId } from '../api/accountApi';
import { getAllServices } from '../api/serviceApi';
import axiosInstance from '../api/axiosInstance'; // Add this import
import '../styles/tuthu&guimau.css';

const TuThuGuiMau = () => {
    const [customer, setCustomer] = useState(null);
    const [services, setServices] = useState([]);
    const [kitInfo, setKitInfo] = useState({
        tenBoKit: "",
        maBoKit: "",
        tenKhachHang: "",
        soDienThoai: "",
        diaChiNhan: "",
        ngayGui: "",
        serviceId: "",
    });
    const [confirmed, setConfirmed] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);


    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                // Lấy accountId từ localStorage
                const accountId = localStorage.getItem('accountId');

                if (!accountId) {
                    setError("Không tìm thấy thông tin tài khoản");
                    setLoading(false);
                    return;
                }

                // Lấy thông tin customer và account
                const customerResponse = await getCustomerByAccountId(accountId);
                console.log("Customer data:", customerResponse); // Debug để xem cấu trúc dữ liệu

                if (customerResponse && customerResponse.data) {
                    setCustomer(customerResponse.data);

                    // Debug: kiểm tra cấu trúc dữ liệu
                    console.log("Customer data structure:", JSON.stringify(customerResponse.data, null, 2));

                    // Điền thông tin từ customer vào form
                    setKitInfo(prev => ({
                        ...prev,
                        tenKhachHang: customerResponse.data.fullName || "",
                        soDienThoai: customerResponse.data.phoneNumber || "",
                        diaChiNhan: customerResponse.data.address || ""
                    }));
                }

                // Lấy danh sách dịch vụ
                const servicesData = await getAllServices();
                setServices(servicesData || []);

                setLoading(false);
            } catch (err) {
                console.error("Error fetching data:", err);
                setError("Lỗi khi tải dữ liệu: " + (err.response?.data?.message || err.message));
                setLoading(false);
            }
        };

        fetchData();
    }, []);
    // Handle input changes
    const handleChange = (e) => {
        setKitInfo({
            ...kitInfo,
            [e.target.name]: e.target.value
        });
    };

    // Handle form submission - create a test order
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!customer) {
            setError("Customer information is required");
            return;
        }

        try {
            // Convert the form data to a TestOrderDTO
            const testOrderData = {
                customerId: customer.id,
                accountId: localStorage.getItem('accountId') || "1",
                serviceId: kitInfo.serviceId,
                orderDate: new Date().toISOString().split('T')[0],
                sampleType: "DNA Sample",
                orderStatus: "PENDING",
                resultDeliveryMethod: "Email",
                resultDeliverAddress: kitInfo.diaChiNhan,
                kitCode: kitInfo.maBoKit,
                sampleQuantity: 1,
                amount: 1
            };

            // Send POST request to create a test order
            const response = await axiosInstance.post("/api/orders", testOrderData);
            console.log("Order created:", response.data);
            setConfirmed(true);
        } catch (err) {
            console.error("Error creating order:", err);
            setError("Failed to submit the order: " + (err.response?.data?.message || err.message));
        }
    };
    const formatDate = (dateString) => {
        if (!dateString) return "N/A";
        try {
            const date = new Date(dateString);
            if (isNaN(date.getTime())) return dateString; // If parsing fails, return the original string
            return date.toLocaleDateString('vi-VN'); // Format for Vietnamese locale
        } catch (error) {
            console.error("Error formatting date:", error);
            return dateString;
        }
    };

    if (loading) return <div className="loading">Loading...</div>;
    if (error) return <div className="error-message">{error}</div>;

    return (

        <div className="container">
            {/* Customer Information */}
            <div className="customer-info">
                <h3>Thông tin Khách hàng</h3>
                {customer ? (
                    <div>
                        <div><b>Họ và tên:</b> {customer.fullName || "N/A"}</div>
                        <div><b>Ngày sinh:</b> {formatDate(customer.dateOfBirth) || "N/A"}</div>
                        <div><b>Giới tính:</b> {customer.gender || "N/A"}</div>
                        <div><b>Số điện thoại:</b> {customer.phoneNumber || "N/A"}</div>
                        <div><b>Địa chỉ:</b> {customer.address || "N/A"}</div>
                        <div><b>Email:</b> {customer.email || "N/A"}</div>
                        <div><b>Mã đơn:</b> {customer.id || "N/A"}</div>
                        <div><b>Ngày đặt lịch:</b> {formatDate(customer.dateOfIssue) || "N/A"}</div>
                    </div>
                ) : <div>Loading customer information...</div>}
            </div>

            {/* Sample Collection Form */}
            <form className="form-section" onSubmit={handleSubmit}>
                <h2 className="form-title">Chuẩn bị lấy mẫu</h2>

                {/* Service Selection */}
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
                            <option key={service.serviceID} value={service.serviceID}>
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
};

export default TuThuGuiMau;