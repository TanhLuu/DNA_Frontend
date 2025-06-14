import React, { useState, useEffect, useRef } from "react";
import axios from "axios";

export default function FormStep3({ bookingId }) {
    const formRef = useRef(null);
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchBookingData = async () => {
            try {
                setLoading(true);
                // Replace with your actual API endpoint
                const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/bookings/${bookingId}`);
                setData(response.data);
                setLoading(false);
            } catch (err) {
                console.error("Error fetching booking data:", err);
                setError("Failed to load booking information");
                setLoading(false);
            }
        };

        if (bookingId) {
            fetchBookingData();
        } else {
            setLoading(false);
            setError("No booking ID provided");
        }
    }, [bookingId]);

    if (loading) return <div className="loading-indicator">Loading...</div>;
    if (error) return <div className="error-message">{error}</div>;
    if (!data) return <div>No booking data available</div>;

    return (
        <div>
            <div className="booking-info-form" ref={formRef}>
                <div className="info-row">
                    <span className="label">Mã hồ sơ:</span>
                    <span>{data.maHoSo || ""}</span>
                </div>
                <div className="info-row">
                    <span className="label">Người đăng ký:</span>
                    <span>{data.nguoiDangKy || ""}</span>
                </div>
                <div className="info-row">
                    <span className="label">Liên hệ:</span>
                    <span>{data.lienHe || ""}</span>
                </div>
                <div className="info-row">
                    <span className="label">Địa chỉ:</span>
                    <span>{data.diaChi || ""}</span>
                </div>
                <div className="info-row">
                    <span className="label">Loại xét nghiệm:</span>
                    <span>{data.loaiXetNghiem || ""}</span>
                </div>
                <div className="info-row">
                    <span className="label">Mục đích :</span>
                    <span>{data.mucDich || ""}</span>
                </div>
                <div className="info-row">
                    <span className="label">Người tham gia:</span>
                    <ul className="participants">
                        {(data.nguoiThamGia || []).map((item, idx) => (
                            <li key={idx}>{item}</li>
                        ))}
                    </ul>
                </div>
                <div className="info-row">
                    <span className="label">Loại mẫu:</span>
                    <span>{data.loaiMau || ""}</span>
                </div>
                <div className="info-row">
                    <span className="label">Hình thức mẫu:</span>
                    <span>{data.hinhThucMau || ""}</span>
                </div>
                    <div className="info-row">
                    <span className="label">Trạng thái:</span>
                    <span>{data.trangThai || ""}</span>
                </div>
                <div className="info-row">
                    <span className="label">Nhân viên lấy mẫu:</span>
                    <span>{data.nhanVienLayMau || ""}</span>
                </div>
                <div className="info-row">
                    <span className="label">Thời gian lấy mẫu:</span>
                    <span>{data.thoiGianLayMau || ""}</span>
                </div>
            </div>
        </div>
    );
}