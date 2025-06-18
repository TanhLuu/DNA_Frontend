import React, { useEffect, useState, useRef } from "react";
import { getCustomerByAccountId } from '../api/accountApi';
import { fetchAccountInfo } from '../api/accountApi';
import { getTestOrdersByCustomerId } from '../api/testorder';
import { getTestSamplesByOrderId } from '../api/testSample';
import { getAllServices } from '../api/serviceApi';
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import '../styles/formstep1.css';

function FormStep1() {
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
                                            s => s.id === latestOrder.serviceId || 
                                                 Number(s.id) === Number(latestOrder.serviceId)
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

    const downloadAsPDF = () => {
        const input = formRef.current;
        if (!input) return;

        html2canvas(input).then((canvas) => {
            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF('p', 'mm', 'a4');
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = pdf.internal.pageSize.getHeight();
            const imgWidth = canvas.width;
            const imgHeight = canvas.height;
            const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
            const imgX = (pdfWidth - imgWidth * ratio) / 2;
            const imgY = 30;

            pdf.addImage(imgData, 'PNG', imgX, imgY, imgWidth * ratio, imgHeight * ratio);
            pdf.save(`Test_Order_${testOrder?.orderId || 'Form'}.pdf`);
        });
    };

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
                <div className="form-header">
                    <h2>Chi tiết Đặt lịch</h2>
                </div>

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
                    <span>{service?.serviceName || testOrder?.sampleType}</span>
                </div>

                <div className="info-row">
                    <span className="label">Mục đích:</span>
                    <span>{service?.servicePurpose || testOrder?.orderStatus}</span>
                </div>

                <div className="info-row">
                    <span className="label">Người tham gia:</span>
                    <div className="participants-list">
                        {testSamples.length > 0 ? (
                            <ul>
                                {testSamples.map((sample, index) => (
                                    <li key={sample.id || index}>
                                        {sample.name} - {sample.relationship} ({formatDate(sample.dateOfBirth)}) - mẫu {sample.sampleType?.toLowerCase()}
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <span>Chưa có dữ liệu người tham gia</span>
                        )}
                    </div>
                </div>

                <div className="info-row">
                    <span className="label">Hình thức thu mẫu:</span>
                    <span>{testOrder?.resultDeliveryMethod}</span>
                </div>

                <div className="info-row">
                    <span className="label">Nhận kết quả:</span>
                    <span>{testOrder?.resultDeliverAddress}</span>
                </div>

                <div className="download-button-container">
                    <button
                        className="download-button"
                        onClick={downloadAsPDF}
                    >
                        Tải phiếu đăng ký
                    </button>
                </div>
            </div>
        </div>
    );
}

export default FormStep1;