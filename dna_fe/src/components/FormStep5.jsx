import React, { useRef } from "react";

export default function FormStep5({ data }) {
    const formRef = useRef(null);
    if (!data) return <div>Loading...</div>;

    return (
        <div>
            <div className="booking-info-form">
                <div className="info-row">
                    <span className="label">Bác sĩ xét nghiệm:</span>
                    <span>{data.bacSiXetNghiem || ""}</span>
                </div>
                <div className="info-row">
                    <span className="label">Thời gian bắt đầu xét nghiệm:</span>
                    <span>{data.thoiGianBatDauXetNghiem || ""}</span>
                </div>
                <div className="info-row">
                    <span className="label">Trạng thái:</span>
                    <span>{data.trangThai || ""}</span>
                </div>

                {/* Phần hiển thị ảnh và thông tin bác sĩ */}
                <div className="doctor-info">
                    {data.bacSiAnh && (
                        <div className="doctor-image-container">
                            <img
                                src={data.bacSiAnh}
                                alt={`Bác sĩ ${data.bacSiXetNghiem}`}
                                className="doctor-image"
                            />
                            <p className="doctor-name">
                                {data.bacSiXetNghiem || ""}
                            </p>
                            <p className="doctor-qualification">
                                {data.bacSiChuyenKhoa || ""}
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}