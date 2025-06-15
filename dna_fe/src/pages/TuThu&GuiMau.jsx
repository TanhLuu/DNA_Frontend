import React, { useEffect, useState } from "react";
import axios from "axios";
import "../styles/tuthu&guimau.css";

const TuThuGuiMau = () => {
    const [customer, setCustomer] = useState(null);
    const [kitInfo, setKitInfo] = useState({
        tenBoKit: "",
        maBoKit: "",
        tenKhachHang: "",
        soDienThoai: "",
        diaChiNhan: "",
        ngayGui: "",
    });
    const [confirmed, setConfirmed] = useState(false); // Thêm state này
    //Lấy dữ liệu từ DB 
    useEffect(() => {
        //Gọi API lấy dữ liệu khách hàng
        axios.get("/api/customer/1")
            .then(res => setCustomer(res.data))
            .catch(console.error);

        //Gọi API lấy thông tin bộ kit
        axios.get("/api/kit/1")
            .then(res => setKitInfo(prev => ({
                ...prev,
                ...res.data
            })))
            .catch(console.error);

    }, []);

    //Xử lý thay đổi input
    const handleChange = (e) => {
        setKitInfo({
            ...kitInfo,
            [e.target.name]: e.target.value
        })
    };

    //Xử lý submit form
    const handleSubmit = (e) => {
        e.preventDefault(); // Quan trọng!
        axios.post("/api/send-sample", kitInfo)
            .then(res => setConfirmed(true))
            .catch(console.error);
    };

    return (
        <div className="container">
            {/*Thông tin Khách hàng */}
            <div className="customer-info">
                <h3>Thông tin Khách hàng</h3>
                {customer ? (
                    <div>
                        <div><b>Họ và tên:</b> {customer.name}</div>
                        <div><b>Ngày sinh:</b> {customer.dob}</div>
                        <div><b>Giới tính:</b> {customer.gender}</div>
                        <div><b>Số điện thoại:</b> {customer.phone}</div>
                        <div><b>Địa chỉ:</b> {customer.address}</div>
                        <div><b>Email:</b> {customer.email}</div>
                        <div><b>Mã đơn:</b> {customer.orderCode}</div>
                        <div><b>Ngày đặt lịch:</b> {customer.bookingDate}</div>
                    </div>
                ) : <div>Loading......</div>}
            </div>

            {/*Form lấy mẫu*/}
            <form className="form-section" onSubmit={handleSubmit}>
                <h2 className="form-title">Chuẩn bị lấy mẫu</h2>
                <div className="form-row">
                    <label><b>Tên bộ kit:</b></label>
                    <input
                        name="tenBoKit"
                        value={kitInfo.tenBoKit}
                        onChange={handleChange}
                        className="form-input"
                    />
                </div>
                <div className="form-row">
                    <label><b>Mã bộ kit:</b></label>
                    <input
                        name="maBoKit"
                        value={kitInfo.maBoKit}
                        onChange={handleChange}
                        className="form-input"
                    />
                </div>
                <div className="form-row">
                    <label><b>Tên khách hàng:</b></label>
                    <input
                        name="tenKhachHang"
                        value={kitInfo.tenKhachHang}
                        onChange={handleChange}
                        className="form-input"
                    />
                </div>
                <div className="form-row">
                    <label><b>Số điện thoại:</b></label>
                    <input
                        name="soDienThoai"
                        value={kitInfo.soDienThoai}
                        onChange={handleChange}
                        className="form-input"
                    />
                </div>
                <div className="form-row">
                    <label><b>Địa chỉ nhận:</b></label>
                    <input
                        name="diaChiNhan"
                        value={kitInfo.diaChiNhan}
                        onChange={handleChange}
                        className="form-input"
                    />
                </div>
                <div className="form-row">
                    <label><b>Ngày gửi:</b></label>
                    <input
                        type="date"
                        name="ngayGui"
                        value={kitInfo.ngayGui}
                        onChange={handleChange}
                        className="form-input"
                    />
                </div>
                <div className="form-actions">
                    {!confirmed ? (
                        <>
                            <button type="submit" className="btn btn-primary">Xác nhận gửi</button>
                            <button type="button" className="btn btn-cancel">Hủy</button>
                        </>
                    ) : (
                        <button type="button" className="btn btn-primary">Xác nhận</button>
                    )}
                </div>
                {confirmed && (
                    <div className="confirm-message">
                        <b>
                            Xác nhận trung tâm đã nhận lại thành công bộ kit<br />
                            có mẫu xét nghiệm của khách gửi lại
                        </b>
                    </div>
                )}
            </form>
        </div>
    );
};

export default TuThuGuiMau;
