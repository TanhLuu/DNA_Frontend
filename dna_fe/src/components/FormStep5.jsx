import React, { useEffect, useState, useRef } from "react";
import { getCustomerByAccountId, fetchAccountInfo, getStaffByAccountId, getStaffById, getAccountById } from '../api/accountApi';
import { getTestOrdersByCustomerId } from '../api/testorder';
import { getTestSamplesByOrderId } from '../api/testSample';
import { getAllServices } from '../api/serviceApi';
import * as assets from '../assets';
import '../styles/formstep5.css';

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
                // Code fetch data hiện tại của bạn...
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
            <div>
                <div><img src={assets.Bsi} alt="Bác sĩ" /></div>
                <p>TTND.PGS.TS.BSCKII.BSCC Đoàn Hữu Nghị</p>
            </div>
        </div>
    );
}


export default FormStep5;