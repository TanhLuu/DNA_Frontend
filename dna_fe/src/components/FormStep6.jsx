import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function FormStep6({ data }) {
    const navigate = useNavigate();
    const [showPdf, setShowPdf] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [testResult, setTestResult] = useState(null);
    
    useEffect(() => {
        // Fetch test result when component mounts if we have maHoSo
        if (data && data.maHoSo) {
            fetchTestResult(data.maHoSo);
        }
    }, [data]);

    const fetchTestResult = async (maHoSo) => {
        setLoading(true);
        setError(null);
        try {
            const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/test-results/${maHoSo}`);
            setTestResult(response.data);
        } catch (err) {
            console.error("Error fetching test result:", err);
            setError("Không thể tải kết quả xét nghiệm. Vui lòng thử lại sau.");
        } finally {
            setLoading(false);
        }
    };

    const handleViewResult = () => {
        //Di chuyển sang trang kết quả
        setShowPdf(true);
    };

    const handleReview = () => {
        // Di chuyển sang trang đánh giá
        if (data && data.maHoSo) {
            navigate(`/review/${data.maHoSo}`);
        } else {
            alert("Không tìm thấy mã hồ sơ");
        }
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div className="error-message">{error}</div>;
    if (!data) return <div>Không có dữ liệu hồ sơ</div>;

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
                    <span>{data.ketQua || testResult?.ketQua || ""}</span>
                </div>
            </div>
            
            {showPdf && (data.ketQuaFileUrl || testResult?.fileUrl) && (
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
            </div>
        </div>
    );
}