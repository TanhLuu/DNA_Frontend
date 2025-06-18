import React, { useEffect, useState, useRef } from "react";
import { getCustomerByAccountId, fetchAccountInfo } from '../api/accountApi';
import { getTestOrdersByCustomerId } from '../api/testorder';
import { getTestSamplesByOrderId } from '../api/testSample';
import { getAllServices } from '../api/serviceApi';

export default function FormStep6({ data }) {
    const [accountData, setAccountData] = useState(null);
    const [customer, setCustomer] = useState({});
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [testOrder, setTestOrder] = useState(null);
    const [testSamples, setTestSamples] = useState([]);
    const [service, setService] = useState({});
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

    // const handleViewResult = () => {
    //     //Di chuyển sang trang kết quả
    //     setShowPdf(true);
    // };

    // const handleReview = () => {
    //     // Di chuyển sang trang đánh giá
    //     if (data && data.maHoSo) {
    //         navigate(`/review/${data.maHoSo}`);
    //     } else {
    //         alert("Không tìm thấy mã hồ sơ");
    //     }
    // };

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

    if (loading) return <div className="loading">Đang tải dữ liệu...</div>;
    if (error) return <div className="error-message">{error}</div>;
    if (!testOrder && !accountData) return <div>Không có dữ liệu</div>;

    return (
        <div>
            <div ref={formRef} className="booking-info-form">


                <div className="info-row">
                    <span className="label">Mã hồ sơ:</span>
                    <span>{testOrder?.orderId}</span>
                </div>

                <div className="info-row">
                    <span className="label">Người đăng ký:</span>
                    <span>{accountData?.fullName}{accountData?.dateOfBirth ? `, ${formatDate(accountData.dateOfBirth)}` : ''}</span>
                </div>

                <div className="info-row">
                    <span className="label">Liên hệ:</span>
                    <span>{accountData?.phone}{accountData?.email ? ` - ${accountData.email}` : ''}</span>
                </div>

                <div className="info-row">
                    <span className="label">Địa chỉ:</span>
                    <span>{customer?.address || testOrder?.resultDeliverAddress}</span>
                </div>

                <div className="info-row">
                    <span className="label">Loại xét nghiệm:</span>
                    <span>{service?.serviceName}</span>
                </div>

                <div className="info-row">
                    <span className="label">Mục đích:</span>
                    <span>{service?.servicePurpose}</span>
                </div>

                <div className="info-row">
                    <span className="label">Người tham gia:</span>
                    <div className="participants-list">
                        {testSamples.length > 0 ? (
                            <ul>
                                {testSamples.map((sample, index) => (
                                    <li key={sample.id || index}>
                                        {sample.name} - {sample.relationship} ({formatDate(sample.dateOfBirth)})
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <span>Chưa có dữ liệu người tham gia</span>
                        )}
                    </div>
                </div>
                <div className="info-row">
                    <span className="label">Loại mẫu:</span>
                    <span>{testSamples[0]?.sampleType?.toLowerCase()}</span>
                </div>
                <div className="info-row">
                    <span className="label">Hình thức thu mẫu:</span>
                    <span>{testOrder?.resultDeliveryMethod}</span>
                </div>
                <div className="info-row">
                    <span className="label">Kết quả:</span>

                </div>
            </div>

            {/* {showPdf && (data.ketQuaFileUrl || testResult?.fileUrl) && (
                <div className="pdf-container">
                    <div className="pdf-header">
                        <h3>Kết quả xét nghiệm</h3>
                        <button
                            className="close-button"
                            onClick={() => setShowPdf(false)}>
                            X
                        </button>
                    </div>
                    <iframe
                        src={data.ketQuaFileUrl || testResult?.fileUrl}
                        title="Kết quả xét nghiệm"
                        width="100%"
                        height="600px"
                        className="pdf-iframe"
                    />
                </div>
            )}
            
            <div className="action-buttons">
                <button
                    className="view-result-button"
                    onClick={handleViewResult}
                    disabled={!data.ketQuaFileUrl && !testResult?.fileUrl}>
                    Xem kết quả
                </button>
                <button
                    className="review-button"
                    onClick={handleReview}>
                    Đánh giá
                </button>
            </div> */}
        </div>
    );
}