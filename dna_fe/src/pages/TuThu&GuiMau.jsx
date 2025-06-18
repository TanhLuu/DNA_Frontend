import React, { useEffect, useState } from "react";
import { getCustomerByAccountId } from '../api/accountApi';
import { fetchAccountInfo } from '../api/accountApi';
import { getTestOrdersByCustomerId } from '../api/testorder';
import '../styles/tuthu&guimau.css';

function TuThuGuiMau() {
    const [accountData, setAccountData] = useState(null);
    const [customer, setCustomer] = useState({});
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [testOrder, setTestOrder] = useState(null);

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

                // 1. Lấy thông tin account trước
                const accountResponse = await fetchAccountInfo();
                console.log("Account data:", accountResponse);

                // 2. Sau đó lấy thông tin customer
                const customerResponse = await getCustomerByAccountId(accountId);
                console.log("Customer data:", customerResponse);

                // Lưu thông tin account
                if (accountResponse && accountResponse.data) {
                    setAccountData(accountResponse.data);
                }

                // Lưu thông tin customer
                if (customerResponse && customerResponse.data) {
                    setCustomer(customerResponse.data);
                    
                    // 3. Lấy test orders của customer này
                    if (customerResponse.data.id) {
                        try {
                            const orderResponse = await getTestOrdersByCustomerId(customerResponse.data.id);
                            console.log("Test orders for customer:", orderResponse);
                            
                            // Lấy order gần nhất nếu có
                            if (orderResponse && orderResponse.length > 0) {
                                // Sort by date (most recent first)
                                const sortedOrders = orderResponse.sort((a, b) => 
                                    new Date(b.orderDate) - new Date(a.orderDate)
                                );
                                setTestOrder(sortedOrders[0]);
                            }
                        } catch (orderErr) {
                            console.error("Error fetching test orders:", orderErr);
                            // Không hiển thị lỗi này cho người dùng, chỉ ghi log
                        }
                    }
                }

                setLoading(false);
            } catch (err) {
                console.error("Error fetching data:", err);
                setError("Lỗi khi tải dữ liệu: " + (err.response?.data?.message || err.message));
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) return <div className="loading">Loading...</div>;
    if (error) return <div className="error-message">{error}</div>;

    return (
        <div className="container">
            {/* Customer Information */}
            <div className="customer-info">
                <h3>Thông tin Khách hàng</h3>
                <div>
                    <div><b>Họ và tên:</b> {accountData?.fullName || "N/A"}</div>
                    <div><b>Ngày sinh:</b> {customer?.dateOfBirth || "N/A"}</div>
                    <div><b>Giới tính:</b> {customer?.gender || "N/A"}</div>
                    <div><b>Số điện thoại:</b> {accountData?.phone || "N/A"}</div>
                    <div><b>Địa chỉ:</b> {customer?.address || "N/A"}</div>
                    <div><b>Email:</b> {accountData?.email || "N/A"}</div>
                    <div><b>Mã đơn:</b> {testOrder?.orderId || "N/A"}</div>
                    <div><b>Ngày đặt lịch:</b> {testOrder?.orderDate || "N/A"}</div>
                </div>
            </div>
        </div>
    );
}

export default TuThuGuiMau;