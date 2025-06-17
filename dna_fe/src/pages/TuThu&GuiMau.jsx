import React, { useEffect, useState } from "react";
import { getCustomerByAccountId } from '../api/accountApi';
import { getAllServices } from '../api/serviceApi';
import axiosInstance from '../api/axiosInstance'; // Add this import
import "../styles/tuthu&guimau.css";

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

    // First, add a console.log to see what fields are available
    useEffect(() => {
        const fetchData = async () => {
            try {
                // Get the account ID from localStorage
                const accountId = localStorage.getItem('accountId');

                if (accountId) {
                    const customerRes = await getCustomerByAccountId(accountId);
                    const customerData = customerRes.data;

                    // Debug what fields are actually available
                    console.log("Customer data fields:", Object.keys(customerData));
                    console.log("Full customer data:", customerData);

                    setCustomer(customerData);

                    // Pre-fill form based on available fields
                    setKitInfo(prev => ({
                        ...prev,
                        // Use appropriate field names based on your API response
                        tenKhachHang: customerData.accountId ? customerData.accountId : "",
                        soDienThoai: "",  // You may need to fetch this from a different API
                        diaChiNhan: customerData.address || ""
                    }));
                } else {
                    console.warn("No account ID found");
                }
            } catch (error) {
                console.error("Error fetching customer:", error);
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
                        <div><b>Họ và tên:</b> {/* Need to fetch from account */}</div>
                        <div><b>Ngày sinh:</b> {formatDate(customer.dateOfBirth) || "N/A"}</div>
                        <div><b>Giới tính:</b> {customer.gender || "N/A"}</div>
                        <div><b>Số điện thoại:</b> {/* Need to fetch from account */}</div>
                        <div><b>Địa chỉ:</b> {customer.address || "N/A"}</div>
                        <div><b>Email:</b> {/* Need to fetch from account */}</div>
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