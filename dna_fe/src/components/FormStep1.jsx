import React from "react";

export default function FormStep1({ data }) {
    if (!data) return <div>Loading...</div>;
    return (
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
                <span className="label">Lịch hẹn:</span>
                <span>{data.lichHen || ""}</span>
            </div>
            <div className="info-row">
                <span className="label">Nhận kết quả:</span>
                <span>{data.nhanKetQua || ""}</span>
            </div>
        </div>
    )
}