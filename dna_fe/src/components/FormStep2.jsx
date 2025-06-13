import React, { useState } from "react";
import axios from "axios";

export default function FormStep2({ data }) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState(null);
    if (!data) return <div>Loading...</div>
    const handleKitReceived = async () => {
        try {
            setIsSubmitting(true);
            setError(null);

            // Gửi request đến API backend
            const response = await axios.post('api/confirm-kit-received', {
                maHoSo: data.maHoSo,
                ngayNhanBoKit: new Date().toISOString().split('T')[0]
            });

            if (response.status === 200) {
                setSuccess(true);
            }
        } catch (error) {
            console.error("Lỗi khi xác nhận nhận bộ kit:", error);
            setError("Có lỗi xảy ra khi xác nhận. Vui lòng thử lại sau.");
        } finally {
            setIsSubmitting(false);
        }
    };
    return (
        <div>
            < div className="booking-info-form" >
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
                    <span>{data.trangThai || ""}</span>
                </div>
                <div className="info-row">
                    <span className="label">Ngày nhận bộ kit:</span>
                    <span>{data.ngayNhanBoKit || ""}</span>
                </div>
            </div>
            {success &&(
                <div className="success-message">Xác nhận nhận bộ kit thành công!</div>
            )}
            {error && (
                <div className="error-message">{error}</div>
            )}

            <div className="confirm-button-container">
                <button 
                className="confirm-button"
                onClick={handleKitReceived}
                disabled={isSubmitting || success || data.ngayNhanBoKit}>
                    {isSubmitting ? "Đang xử lý..." : "Xác nhận đã nhận bộ kit"}
                </button>
                

            </div>
        </div>
    );
}