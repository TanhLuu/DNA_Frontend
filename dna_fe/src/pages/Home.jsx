import React, { useState, useEffect, useRef } from 'react';
import '../styles/Home.css';

import * as asset from '../assets';
import AdnBooking from '../components/UI/AdnBooking';



const Home = () => {
    const [hoveredBox, setHoveredBox] = useState(null);
    const scrollToSection = () => {
        document.querySelector('.adn-container').scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        const elements = document.querySelectorAll('.process-column, .process-image');
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('animated-in');
                    }
                });
            },
            { threshold: 0.1 }
        );

        elements.forEach((el) => observer.observe(el));

        // Cleanup observer on component unmount
        return () => observer.disconnect();
    }, []);

    useEffect(() => {
        const doctorItems = document.querySelectorAll('.fade-in-up');
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('visible');
                    }
                });
            },
            { threshold: 0.2 }
        );

        doctorItems.forEach((el) => observer.observe(el));

        return () => observer.disconnect();
    }, []);

    const bookingRef = useRef(null);
    const scrollToBooking = () => {
        bookingRef.current?.scrollIntoView({ behavior: 'smooth' });
    };
    return (
        <div>
            <div className="hero-section">
                <div className="hero-overlay">
                    <div className="hero-content">
                        <h1 className="text-4xl font-medium text-white mb-5">DỊCH VỤ XÉT NGHIỆM ADN</h1>
                        <p className="text-lg text-white mb-5">Xét nghiệm ADN uy tín tại Việt Nam</p>
                        <p className="text-lg text-white mb-5 half-width">
                            <strong>Giải pháp DNA đáng tin cậy từ MedLab</strong>
                            <br />
                            Khám phá dịch vụ xét nghiệm ADN pháp lý, dân sự cùng với công nghệ tiên tiến và đội ngũ chuyên gia chất lượng cao, MedLab cam kết mang đến kết quả chính xác và bảo mật tuyệt đối cho khách hàng tại Việt Nam.
                        </p>
                        <button onClick={scrollToSection} className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700">
                            Tìm Hiểu Thêm
                        </button>
                    </div>
                </div>
            </div>
            <div className="adn-container">
                <h2 className="adn-title">THÔNG TIN CÁC LOẠI XÉT NGHIỆM ADN</h2>
                <div className="adn-box-container">
                    <a href="/paternity-testing/" className="adn-box">
                        <div className="image-container">
                            <img src={asset.ChaCon} alt="Cha – con" />
                        </div>
                        <div className="adn-content">
                            <h5 className="service-title">Xét nghiệm ADN Cha – con</h5>
                        </div>
                    </a>
                    <a href="/prenatal-testing/" className="adn-box">
                        <div className="image-container">
                            <img src={asset.MeCon} alt="Mẹ – con" />
                        </div>
                        <div className="adn-content">
                            <h5 className="service-title">Xét nghiệm ADN Mẹ – con</h5>
                        </div>
                    </a>
                    <a href="/sibling-testing/" className="adn-box">
                        <div className="image-container">
                            <img src={asset.AnhChiEm} alt="Anh/chị – em" />
                        </div>
                        <div className="adn-content">
                            <h5 className="service-title">Xét nghiệm ADN Anh/chị – em</h5>
                        </div>
                    </a>
                    <a href="/grandparent-testing/" className="adn-box">
                        <div className="image-container">
                            <img src={asset.OngBaChau} alt="Ông/bà – cháu" />
                        </div>
                        <div className="adn-content">
                            <h5 className="service-title">Xét nghiệm ADN Ông/bà – cháu</h5>
                        </div>
                    </a>
                </div>
            </div>

            <div className="process-container">
                <h2 className="process-title">QUY TRÌNH THỰC HIỆN XÉT NGHIỆM ADN</h2>
                <p className="process-subtitle">Quy trình tiêu chuẩn quốc tế, chính xác và bảo mật</p>

                {/* Step 1 */}
                <div className="process-row">
                    <div className="process-image parallax-enabled">
                        <div
                            className="process-image-bg"
                            style={{ backgroundImage: `url(${asset.step1})` }}
                        ></div>
                    </div>
                    <div className="process-column">
                        <div className="process-content">
                            <div className="process-number">01</div>
                            <h4 className="process-heading">Đăng ký & Đặt lịch hẹn</h4>
                            <p className="process-desc">
                                Khách hàng điền thông tin đăng ký trên website hoặc gọi hotline để đặt lịch lấy mẫu phù hợp.
                            </p>
                            <a className="nectar-button" onClick={scrollToBooking}>
                                ĐẶT LỊCH NGAY
                            </a>
                            <div className="divider"></div>
                        </div>
                    </div>
                </div>

                {/* Step 2 */}
                <div className="process-row reverse-columns">
                    <div className="process-column">
                        <div className="process-content">
                            <div className="process-number">02</div>
                            <h4 className="process-heading">Thu mẫu</h4>
                            <p className="process-desc">Thu mẫu tại trung tâm hoặc Tự thu và gửi mẫu theo yêu cầu.</p>
                            <div className="divider"></div>
                        </div>
                    </div>
                    <div className="process-image parallax-enabled">
                        <div
                            className="process-image-bg"
                            style={{ backgroundImage: `url(${asset.step2})` }}
                        ></div>
                    </div>
                </div>

                {/* Step 3 */}
                <div className="process-row">
                    <div className="process-image parallax-enabled">
                        <div
                            className="process-image-bg"
                            style={{ backgroundImage: `url(${asset.step3})` }}
                        ></div>
                    </div>
                    <div className="process-column">
                        <div className="process-content">
                            <div className="process-number">03</div>
                            <h4 className="process-heading">Phân tích</h4>
                            <p className="process-desc">Mẫu được xử lý trong phòng Lab hiện đại, đạt chuẩn quốc tế vói những chuyê gia có trình độ cao, đảm bảo chất lượng xét nghiệm có độ chính xác cao nhất.</p>
                            <div className="divider"></div>
                        </div>
                    </div>
                </div>

                {/* Step 4 */}
                <div className="process-row reverse-columns">
                    <div className="process-column">
                        <div className="process-content">
                            <div className="process-number">04</div>
                            <h4 className="process-heading">Trả kết quả</h4>
                            <p className="process-desc">Kết quả được trả qua email, gửi về nhà hoặc bản cứng tại trung tâm.</p>
                            <div className="divider"></div>
                        </div>
                    </div>
                    <div className="process-image parallax-enabled">
                        <div
                            className="process-image-bg"
                            style={{ backgroundImage: `url(${asset.step4})` }}
                        ></div>
                    </div>
                </div>
            </div>

            <div className="doctor-container">
                <h2 className="doctor-title">ĐỘI NGŨ CHUYÊN GIA Y TẾ</h2>
                <div className="doctor-description">
                    <div className="doctor-info fade-in-up">
                        <img src={asset.doctor1} alt="Doctor 1" />
                        <h4>PGS.TS.BSCC Nguyễn Quốc Dũng</h4>
                        <p>Chuyên gia xét nghiệm ADN</p>
                        <p>
                            Phó Chủ tịch hội Điện quang và Y học hạt nhân Việt Nam, Phó Chủ tịch Hội đồng Khoa học công nghệ và đào tạo.
                        </p>
                    </div>
                    <div className="doctor-info fade-in-up">
                        <img src={asset.doctor2} alt="Doctor 2" />
                        <h4>TTND.PGS.TS.BSCKII.BSCC Đoàn Hữu Nghị</h4>
                        <p>Chuyên gia xét nghiệm ADN</p>
                        <p>
                            Nguyên Giám đốc Bệnh viện E, Nguyên Phó Giám đốc Bệnh viện K, Phó Chủ tịch Hội Ung thư Hà Nội.
                        </p>
                    </div>
                    <div className="doctor-info fade-in-up">
                        <img src={asset.doctor3} alt="Doctor 3" />
                        <h4>PGS.TS Trịnh Thị Ngọc</h4>
                        <p>Chuyên gia xét nghiệm ADN</p>
                        <p>
                            Nguyên Trưởng khoa Xét nghiệm Bệnh viện Bạch Mai, Nguyên Phó Chủ tịch Hội Xét nghiệm Y học Việt Nam.
                        </p>
                    </div>
                </div>
            </div>

            <div className="favilities-container">
                <h2 className="favilities-title">CƠ SỞ VẬT CHẤT VÀ TRANG THIẾT BỊ</h2>
                <div className="favilities-description">
                    <p>
                        MedLab tự hào sở hữu hệ thống cơ sở vật chất hiện đại, trang thiết bị tiên tiến nhất phục vụ cho công tác xét nghiệm ADN.
                    </p>
                    <div className="favilities-images">
                        <img src={asset.favilities1} alt="Facilities 1" />
                        <img src={asset.favilities2} alt="Facilities 2" />
                        <img src={asset.favilities3} alt="Facilities 3" />
                    </div>
                </div>
            </div>

            <div ref={bookingRef}>
                <AdnBooking />
            </div>


            <div className="partners-container">
                <h2 className="partners-title">ĐỐI TÁC CỦA CHÚNG TÔI</h2>
                <p className="partners-description">Hợp tác cùng các bệnh viện và phòng khám hàng đầu</p>
                <div className="partners-logos">
                    <img src={asset.partner1} alt="Partner 1" />
                    <img src={asset.partner2} alt="Partner 2" />
                    <img src={asset.partner3} alt="Partner 3" />
                    <img src={asset.partner4} alt="Partner 4" />
                    <img src={asset.partner5} alt="Partner 5" />
                </div>
            </div>
        </div>
    );
};

export default Home;