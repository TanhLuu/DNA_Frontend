import React from "react";



export default function FormStep1({ data }) {
    const formRef = useRef(null);
    if (!data) return <div>Loading...</div>;

    return (
        <div>
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
                </div>
                <div className="info-row">
                    <span className="label">Tên bộ kit:</span>
                    <span>{data.tenBoKit || ""}</span>
                </div>
                <div className="info-row">
                    <span className="label">Ngày gửi bộ kit:</span>
                    <span>{data.ngayguibokit || ""}</span>
                </div>
                <div className="info-row">
                    <span className="label">Trạng thái:</span>
                    <span>{data.trangThai || ""}</span>
                </div>
                <div className="info-row">
                    <span className="label">Nhân viên tiếp nhận:</span>
                    <span>{data.nhanVienTiepNhan || ""}</span>
                </div>
            </div>
        </div>
    );
}