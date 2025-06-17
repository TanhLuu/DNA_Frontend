import React, {useEffect, useState } from "react";
import axios from "axios";
import "../styles/tuthu&guimautt.css";

const TuThuGuiMauTT = () => {
    const [customer, setCustomer] = useState(null);
    const [examInfo, setExamInfo] = useState({
        loaiXetNghiem: "",
        mucDich: "",
        nguoiThamGia: [],
        loaiMau: "",
        hinhThucMau: "",
        trangThai: "",
    });

    //Lấy dữ liệu từ DB 
    useEffect(() => {
        //Gọi API lấy dữ liệu khách hàng
        axios.get("/api/customer/1")
            .then(res => setCustomer(res.data))
            .catch(console.error);

        //Gọi API lấy thông tin xét nghiệm
        axios.get("/api/exam/1")
            .then(res => setExamInfo(res.data))
            .catch(console.error);
    }, []);

    const handleConfirm = () => {
        // Gửi xác nhận lên server nếu cần
        alert("Đã xác nhận khách hàng đến trung tâm thực hiện lấy mẫu!");
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

            <div className="confirm-form-section">
                <h2 className="form-title">Chuẩn bị lấy mẫu</h2>
                <table className="confirm-table">
                    <tbody>
                        <tr>
                            <td className="label">Loại xét nghiệm:</td>
                            <td>{examInfo.loaiXetNghiem}</td>
                        </tr>
                        <tr>
                            <td className="label">Mục đích&nbsp;:</td>
                            <td>{examInfo.mucDich}</td>
                        </tr>
                        <tr>
                            <td className="label" style={{ verticalAlign: "top" }}>Người tham gia:</td>
                            <td>
                                <ul className="participants-list">
                                    {examInfo.nguoiThamGia && examInfo.nguoiThamGia.map((p, idx) => (
                                        <li key={idx}>{p}</li>
                                    ))}
                                </ul>
                            </td>
                        </tr>
                        <tr>
                            <td className="label">Loại mẫu:</td>
                            <td>{examInfo.loaiMau}</td>
                        </tr>
                        <tr>
                            <td className="label">Hình thức mẫu:</td>
                            <td>{examInfo.hinhThucMau}</td>
                        </tr>
                        <tr>
                            <td className="label">Trạng thái&nbsp;:</td>
                            <td>{examInfo.trangThai}</td>
                        </tr>
                    </tbody>
                </table>
                <div className="confirm-bottom">
                    <div className="confirm-note">
                        <b>Xác nhận khách hàng đã đến trung tâm<br />để thực hiện lấy mẫu</b>
                    </div>
                    <button className="btn btn-primary" onClick={handleConfirm}>
                        Xác nhận
                    </button>
                </div>
            </div>
        </div>
    );
};

export default TuThuGuiMauTT;
