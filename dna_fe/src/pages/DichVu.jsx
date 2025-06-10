import React from "react";  
import  '../styles/dichvu.css';
import * as assets from '../assets';
function DichVu() {
    const dichvuADN=[
        "Xét Nghiệm ADN Cha - Con",
        "Xét Nghiệm ADN Mẹ - Con",
        "Xét Nghiệm ADN Ông/Bà - Cháu",
        "Xét Nghiệm ADN Anh/Chị - Em",
    ]
    return (
        <div>
            <div className="Top">
                <p className="Top-content">Dịch vụ xét nghiệm ADN huyết thống</p>
            </div>
            <div className="mid">
                <div className="midd-left">
                    <h3 className="midd-title">Xét Nghiệm ADN Hành Chính</h3>
                    <p className="midd-content">Sử dụng để chứng minh mối quan hệ huyết thống cho
                        các thủ tục pháp lý như làm giấy khai sinh, thủ tục nhập
                        quốc tịch, hồ sơ visa, hộ tịch...</p>
                    <div><img src={assets.hanhchinh} alt="Xét Nghiệm ADN Hành Chính" /></div>
                </div>
                <div className="midd-right">
                    <h3 className="midd-title">Xét Nghiệm ADN Dân Sự</h3>
                    <p className="midd-content">Dành cho các trường hợp cần xác minh mối quan hệ
                        huyết thống không sử dụng cho mục đích pháp lý. Độ
                        chính xác lên đến 100%.</p>
                    <div><img src={assets.dansu} alt="Xét Nghiệm ADN Dân Sự" /></div>
                </div>
            </div>
            <div className="bottom">
                {dichvuADN.map((item, index) => (
                    <div className="bottom-item" key={index}>
                        <span className="arrow">▶</span> {item}
                    </div>
                ))}
            </div>
        </div>
    );
}

export default DichVu;