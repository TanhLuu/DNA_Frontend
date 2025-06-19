import React from "react";
import * as assets from '../../assets';
import '../../styles/customer/banggia.css';
function BangGia() {
    return (
        <div className="top">
            <div className="top-header">
                <h2 className="h2"><b>Bảng giá xét nghiệm ADN huyết thống?</b></h2>
                <div className="top-content">
                    <p>Giá xét nghiệm ADN huyết thống phụ thuộc vào nhiều yếu tố như loại xét nghiệm, phương pháp thực hiện và địa điểm xét nghiệm.
                        Dưới đây là bảng giá tham khảo cho một số loại xét nghiệm ADN huyết thống phổ biến:</p>
                    <p><b>Loại xét nghiệm:</b> Mỗi loại xét nghiệm ADN có mục đích và độ phức tạp khác nhau, dẫn đến mức giá khác nhau. Ví dụ, xét nghiệm ADN cha con thường rẻ hơn so với xét nghiệm ADN di truyền.</p>
                    <p><b>Phương pháp xét nghiệm:</b> Một số phương pháp xét nghiệm hiện đại hơn có thể có giá cao hơn.</p>
                </div>
            </div>
            <h3 className="h3">BẢNG GIÁ XÉT NGHIỆM ADN HUYẾT THỐNG</h3>
            <div className="mid">
                <div className="mid-left">
                    <h4>Xét nghiệm ADN Tự nguyện</h4>
                    <p>Giám định Cha/Con,<br />Mẹ/Con dân sự, chỉ để biết kết quả</p>
                    <button className="button">Xem thêm</button>
                </div>
                <div className="mid-right">
                    <h4>Xét nghiệm ADN Pháp lý</h4>
                    <p>Giám định Cha/Con,<br />Mẹ/Con, để làm thủ tục hành chính</p>
                    <button className="button">Xem thêm</button>
                </div>
            </div>
            <h2 className="h2"><b>Quy trình xét nghiệm ADN huyết thống tại ADN Việt Nam</b></h2>
            <div className="bottom-content">
                <p>Quy trình thu thập mẫu xét nghiệm ADN tại Vietcare được thực hiện một cách chuyên nghiệp và nhanh chóng. Khách hàng có thể lựa chọn các phương pháp thu thập mẫu như máu, nước bọt, hoặc tóc.</p>
                <h5><b>Dưới đây là Quy trình sau khi lấy mẫu:</b></h5>
                <h5><b>+ Bước 1: Tiếp nhận thông tin và tư vấn</b></h5>
                <p>Đội ngũ chuyên gia sau khi tiếp nhận thông tin sẽ gọi điện tư vấn và đưa ra giải pháp phù hợp với nhu cầu của khách hàng.</p>
                <h5><b>+ Bước 2: Thu mẫu</b></h5>
                <p>Khách hàng gửi mẫu qua bưu điện hoặc chuyên viên sẽ đến nhà trực tiếp thu mẫu.</p>
                <h5><b>+ Bước 3: Phân tích mẫu</b></h5>
                <p>Mẫu sẽ được phân tích tại phòng thí nghiệm. Mọi thông tin sẽ được mã hoá và kiểm chứng độc lập bởi các chuyên gia nhằm đảm bảo độ chính xác tuyệt đối.</p>
                <h5><b>+ Bước 4: Trả kết quả:</b></h5>
                <p>Kết quả sẽ được gửi trả theo đường bưu điện, qua email và qua điện thoại.</p>
            </div>
            <div className="bottom-image">
                <img src={assets.bonbuoc} alt="Quy trình xét nghiệm ADN" />
            </div>
        </div>

    );
}
export default BangGia;