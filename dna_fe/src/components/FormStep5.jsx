import React, { useEffect, useState, useRef } from "react";
import { getCustomerByAccountId, fetchAccountInfo, getStaffByAccountId, getStaffById, getAccountById } from '../api/accountApi';
import { getTestOrdersByCustomerId } from '../api/testorder';
import { getTestSamplesByOrderId } from '../api/testSample';
import { getAllServices } from '../api/serviceApi';
import * as assets from '../assets';
function FormStep5() {
    const [accountData, setAccountData] = useState(null);
    const [customer, setCustomer] = useState({});
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [testOrder, setTestOrder] = useState(null);
    const [testSamples, setTestSamples] = useState([]);
    const [service, setService] = useState({});
    const [staff, setStaff] = useState({});
    const formRef = useRef(null);

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
                                const latestOrder = sortedOrders[0];
                                setTestOrder(latestOrder);

                                // 4. Lấy test samples cho order này
                                try {
                                    const samplesResponse = await getTestSamplesByOrderId(latestOrder.orderId);
                                    console.log("Test samples for order:", samplesResponse);

                                    if (samplesResponse && samplesResponse.length > 0) {
                                        setTestSamples(samplesResponse);
                                    }
                                } catch (sampleErr) {
                                    console.error("Error fetching test samples:", sampleErr);
                                }

                                // 5. Lấy thông tin dịch vụ nếu có serviceId
                                if (latestOrder.serviceId) {
                                    try {
                                        const servicesResponse = await getAllServices();
                                        console.log("Services:", servicesResponse);

                                        const matchedService = servicesResponse.find(
                                            s => s.serviceID === latestOrder.serviceId ||
                                                Number(s.serviceID) === Number(latestOrder.serviceId)
                                        );

                                        if (matchedService) {
                                            setService(matchedService);
                                            console.log("Matched service:", matchedService);
                                        }
                                    } catch (serviceErr) {
                                        console.error("Error fetching services:", serviceErr);
                                    }
                                }

                                // Trong hàm fetchData của FormStep5.jsx
                                if (latestOrder.staffId) {
                                    try {
                                        // 1. Lấy thông tin staff bằng staffId
                                        const staffResponse = await getStaffById(latestOrder.staffId);
                                        console.log("Staff data:", staffResponse);

                                        // Lưu thông tin staff
                                        setStaff(staffResponse || {});

                                        // 2. Nếu có thông tin staff và staffResponse có accountId
                                        if (staffResponse && staffResponse.accountId) {
                                            try {
                                                // 3. Lấy thông tin account bằng accountId từ staff
                                                const accountResponse = await getAccountById(staffResponse.accountId);
                                                console.log("Account data for staff:", accountResponse);

                                                if (accountResponse && (accountResponse.fullName || accountResponse.username)) {
                                                    // 4. Cập nhật thông tin staff với tên từ account
                                                    setStaff(prev => ({
                                                        ...prev,
                                                        name: accountResponse.fullName || accountResponse.username
                                                    }));
                                                }
                                            } catch (accountErr) {
                                                console.error("Error fetching account info:", accountErr);
                                            }
                                        }
                                    } catch (staffErr) {
                                        console.error("Error fetching staff info:", staffErr);
                                        setStaff({ name: `Staff ID: ${latestOrder.staffId}` });
                                    }
                                }
                            }
                        } catch (orderErr) {
                            console.error("Error fetching test orders:", orderErr);
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


    if (loading) return <div className="loading-indicator">Loading...</div>;
    if (error) return <div className="error-message">{error}</div>;
    // Format date for display
    const formatDate = (dateString) => {
        if (!dateString) return "";
        try {
            const date = new Date(dateString);
            return date.toLocaleDateString('vi-VN', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric'
            }).replace(/\//g, '/');
        } catch (error) {
            return dateString;
        }
    };

    return (
        <div>
            <div className="booking-info-form">
                <div className="info-row">
                    <span className="label">Bác sĩ xét nghiệm:</span>
                    <span>{staff?.name || staff?.fullName || `ID: ${testOrder?.staffId}` || "Chưa phân công"}</span>
                </div>
                <div className="info-row">
                    <span className="label">Trạng thái:</span>
                    <span>{testOrder?.orderStatus || ""}</span>
                </div>
                <div className="info-row">
                    <span className="label">Mã Đơn:</span>
                    <span>{testOrder?.orderId}</span>
                </div>
                <div className="info-row">
                    <span className="label">Loại xét nghiệm:</span>
                    <span>{service?.serviceName}</span>
                </div>

               
            </div>
        </div>
    );

}


export default FormStep5;