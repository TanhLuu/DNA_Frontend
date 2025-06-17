import React, { useState, useEffect, useRef } from "react";
import axios from "axios";

export default function FormStep5({ bookingId }) {
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