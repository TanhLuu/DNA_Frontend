import React from "react";
import { useNavigate } from "react-router-dom";

export default function FormStep6({ data }) {
    const navigate = useNavigate();
    const [showPdf, setShowPdf] = useState(false);
    if (!data) return <div>Loading...</div>;


    const handleViewResult = () => {
        //Di chuyển sang trang kết quả
        setShowPdf(true);
    };

    const handleReview = () => {
        // Di chuyển sang trang đánh giá
        navigate(`/review/${data.maHoSo}`);
    };
    return (
        <div>
            <div className="result-info-form">
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
                    <span className="label">Mục đích:</span>
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
                    <span className="label">Kết quả:</span>
                    <span>{data.ketQua || ""}</span>
                </div>
            </div>
            {showPdf && data.ketQuaFileUrl && (
                <div className="pdf-container">
                    <div className="pdf-header">
                        <h3>Kết quả xét nghiệm</h3>
                        <button
                        className="close-button"
                        onClick={()=> setShowPdf}>
                            X
                        </button>
                    </div>
                    <iframe
                    src={Date.ketQuaFileUrl}
                    title="Kết quả xét nghiệm"
                    width="100%"
                    height="600px"
                    className="pdf-iframe"
                    />
                </div>

            )}
            <div className="action-button">
                <button
                    className="view-result-button"
                    onClick={handleViewResult}>Xem kết quả
                </button>
                <button
                    className="review-button"
                    onClick={handleReview}>
                    Đánh giá
                </button>
            </div>
        </div>
    );
}