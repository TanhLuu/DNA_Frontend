import React, { useEffect, useState, useRef } from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import axios from "axios";

export default function FormStep1({ bookingId }) {
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

    const downloadAsPDF = () => {
        const input = formRef.current;
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
            pdf.save(`Booking_${data.maHoSo || 'Form'}.pdf`);
        });
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;
    if (!data) return <div>No data available</div>;

    return (
        <div>
            <div ref={formRef} className="booking-info-form">
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
            <div className="download-button-container">
                <button
                    className="download-button"
                    onClick={downloadAsPDF}
                >
                    Tải biểu mẫu
                </button>
            </div>
        </div>
    );
}