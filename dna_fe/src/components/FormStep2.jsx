import React, { useState, useEffect } from "react";
import axios from "axios";

export default function FormStep2({ bookingId }) {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchBookingData = async () => {
            try {
                setLoading(true);
                // Replace with your actual API endpoint
                const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/bookings/${bookingId}`);
                setData(response.data);
                
                // If the booking already has ngayNhanBoKit, set success to true
                if (response.data.ngayNhanBoKit) {
                    setSuccess(true);
                }
                
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

    const handleKitReceived = async () => {
        try {
            setIsSubmitting(true);
            setError(null);

            // Send request to backend API
           const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/confirm-kit-received`, {
                maHoSo: data.maHoSo,
                ngayNhanBoKit: new Date().toISOString().split('T')[0]
            });

            if (response.status === 200) {
                setSuccess(true);
                // Update the local data with the confirmation date
                setData({
                    ...data,
                    ngayNhanBoKit: new Date().toISOString().split('T')[0],
                    trangThai: "Đã nhận bộ kit"
                });
            }
        } catch (error) {
            console.error("Error confirming kit receipt:", error);
            setError(error.response?.data?.message || "An error occurred while confirming. Please try again later.");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (loading) return <div className="loading">Loading...</div>;
    if (!data) return <div className="error-message">No booking data available</div>;

    return (
        <div className="form-step2-container">
            <div className="booking-info-form">
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
                    <span className="label">Mã bộ kit:</span>
                    <span>{data.maBoKit || ""}</span>
                </div>
                <div className="info-row">
                    <span className="label">Tên bộ kit:</span>
                    <span>{data.tenBoKit || ""}</span>
                </div>
                <div className="info-row">
                    <span className="label">Nhân viên gửi:</span>
                    <span>{data.nhanVienGui || ""}</span>
                </div>
                <div className="info-row">
                    <span className="label">Ngày gửi bộ kit:</span>
                    <span>{data.ngayGuiBoKit || ""}</span>
                </div>
                <div className="info-row">
                    <span className="label">Trạng thái:</span>
                    <span className={`status ${data.trangThai === "Đã nhận bộ kit" ? "status-received" : ""}`}>
                        {data.trangThai || ""}
                    </span>
                </div>
                <div className="info-row">
                    <span className="label">Ngày nhận bộ kit:</span>
                    <span>{data.ngayNhanBoKit || "Chưa nhận"}</span>
                </div>
            </div>
            
            {success && (
                <div className="success-message">
                    <i className="icon-check"></i> Xác nhận nhận bộ kit thành công!
                </div>
            )}
            
            {error && (
                <div className="error-message">
                    <i className="icon-error"></i> {error}
                </div>
            )}

            <div className="confirm-button-container">
                <button 
                    className={`confirm-button ${data.ngayNhanBoKit ? "disabled" : ""}`}
                    onClick={handleKitReceived}
                    disabled={isSubmitting || success || data.ngayNhanBoKit}
                >
                    {isSubmitting ? "Đang xử lý..." : data.ngayNhanBoKit ? "Đã xác nhận nhận bộ kit" : "Xác nhận đã nhận bộ kit"}
                </button>
                
                {data.ngayNhanBoKit && (
                    <div className="confirmation-date">
                        Đã xác nhận vào ngày: {data.ngayNhanBoKit}
                    </div>
                )}
            </div>
        </div>
    );
}