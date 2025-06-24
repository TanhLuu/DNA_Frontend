import React, { useState, useEffect } from 'react';
import '../styles/Home.css';
import * as asset from '../assets';
import BlogList from './BlogList';
const images = [asset.banner001, asset.banner002, asset.banner003];

const Home = () => {
    const [currentIndex, setCurrentIndex] = useState(0);

    const goToSlide = (index) => {
        setCurrentIndex(index);
    };

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentIndex(prev =>
                prev === images.length - 1 ? 0 : prev + 1
            );
        }, 5000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div>
            <div className="slider-container">
                <img
                    src={images[currentIndex]}
                    alt={`slide ${currentIndex}`}
                    className="slider-image"
                />
                <div className="dots">
                    {images.map((_, index) => (
                        <span
                            key={index}
                            className={`dot ${index === currentIndex ? 'active' : ''}`}
                            onClick={() => goToSlide(index)}
                        />
                    ))}
                </div>
            </div>

            <div class="adn-container">
                <h2 class="adn-title">
                    Dịch Vụ Xét Nghiệm Tại MedLab
                </h2>
                <p class="adn-description">
                    Tại đây cung cấp nhiều nội dung xét nghiệm ADN khác nhau để đáp ứng nhu cầu của bạn.
                    Tất cả các kết quả xét nghiệm chúng tôi đều cam kết đạt độ tin cậy và chính xác cao nhất.
                    Những dịch vụ chính mà chúng tôi cung cấp sẽ được mô tả ngắn gọn trong từng mục sau đây:
                </p>
                <div className='adn-box-container'>
                    <div class="adn-box">

                        <div class="adn-left">
                            <img src={asset.logo} />
                        </div>

                        <div>
                            <div class="adn-right">
                                <div class="adn-option">
                                    <span>Cha – con</span>
                                    <a href="/"><button>Chi tiết</button></a>
                                </div>
                                <div class="adn-option">
                                    <span>Mẹ – con</span>
                                    <a href="/"><button>Chi tiết</button></a>
                                </div>
                                <div class="adn-option">
                                    <span>Anh/chị – em</span>
                                    <a href="/"><button>Chi tiết</button></a>
                                </div>
                                <div class="adn-option">
                                    <span>Ông/bà – cháu</span>
                                    <a href="/"><button>Chi tiết</button></a>
                                </div>
                                <div class="adn-option">
                                    <span>Họ hàng</span>
                                    <a href="/"><button>Chi tiết</button></a>
                                </div>
                            </div>


                            <div class="adn-booking">
                                <div class="adn-card">
                                    <h3>Xét nghiệm ADN Dân sự</h3>
                                    <ul>
                                        <li>✔ Dành cho mục đích cá nhân</li>
                                        <li>✔ Không yêu cầu giấy tờ pháp lý</li>
                                        <li>✔ Thông tin được bảo mật</li>
                                    </ul>
                                    <a href="/"><button>Đặt lịch</button></a>
                                </div>
                                <div class="adn-card">
                                    <h3>Xét nghiệm ADN Hành chính</h3>
                                    <ul>
                                        <li>✔ Dùng trong các thủ tục pháp lý</li>
                                        <li>✔ Yêu cầu CMND/Khai sinh</li>
                                        <li>✔ Có giá trị pháp lý</li>
                                    </ul>
                                    <a href="/"><button>Đặt lịch</button></a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>


            <div className='doctor-container'>
                <h2 className='doctor-title'>ĐỘI NGŨ CHUYÊN GIA Y TẾ</h2>
                <div className='doctor-description'>
                    <div className='doctor-info'>
                        <img src={asset.doctor1} alt="Doctor 1" />
                        <h4>PGS.TS.BSCC Nguyễn Quốc Dũng</h4>
                        <p>Chuyên gia xét nghiệm ADN</p>
                        <p> Phó Chủ tịch hội Điện quang và Y học hạt nhân Việt Nam,
                            Phó Chủ tịch Hội đồng Khoa học công nghệ và đào tạo.</p>
                    </div>

                    <div className='doctor-info'>
                        <img src={asset.doctor2} alt="Doctor 2" />
                        <h4>TTND.PGS.TS.BSCKII.BSCC Đoàn Hữu Nghị</h4>
                        <p>Chuyên gia xét nghiệm ADN</p>
                        <p> Nguyên Giám đốc Bệnh viện E,
                            Nguyên Phó Giám đốc Bệnh viện K,
                            Phó Chủ tịch Hội Ung thư Hà Nội.</p>
                    </div>

                    <div className='doctor-info'>
                        <img src={asset.doctor3} alt="Doctor 3" />
                        <h4>PGS.TS Trịnh Thị Ngọc</h4>
                        <p>Chuyên gia xét nghiệm ADN</p>
                        <p> Nguyên Trưởng khoa Xét nghiệm Bệnh viện Bạch Mai,
                            Nguyên Phó Chủ tịch Hội Xét nghiệm Y học Việt Nam.</p>
                    </div>
                </div>
            </div>

            <div className='favilities-container'>
                <h2 className='favilities-title'>CƠ SỞ VẬT CHẤT VÀ TRANG THIẾT BỊ</h2>
                <div className='favilities-description'>
                    <p>MedLab tự hào sở hữu hệ thống cơ sở vật chất hiện đại,
                        trang thiết bị tiên tiến nhất phục vụ cho công tác xét nghiệm ADN.</p>
                    <div className='favilities-images'>
                        <img src={asset.favilities1} alt="Facilities 1" />
                        <img src={asset.favilities2} alt="Facilities 2" />
                        <img src={asset.favilities3} alt="Facilities 3" />
                    </div>

                </div>
            </div>

            <div class="process-container">
                <h2 class="process-title">Quy trình thực hiện xét nghiệm ADN</h2>
                <p class="process-subtitle">Quy trình tiêu chuẩn quốc tế, chính xác và bảo mật</p>

                <div class="process-steps">
                    <div class="process-card">
                        <h3 class="process-number">1</h3>
                        <h4 class="process-heading">Đăng ký & Đặt lịch hẹn</h4>
                        <p class="process-desc">
                            Khách hàng điền thông tin đăng ký trên website hoặc gọi hotline để đặt lịch lấy mẫu phù hợp.
                        </p>
                    </div>
                    <div class="process-card">
                        <h3 class="process-number">2</h3>
                        <h4 class="process-heading">Thu mẫu</h4>
                        <p class="process-desc">
                            Thu mẫu tại trung tâm hoặc tận nơi theo yêu cầu.
                        </p>
                    </div>
                    <div class="process-card">
                        <h3 class="process-number">3</h3>
                        <h4 class="process-heading">Phân tích</h4>
                        <p class="process-desc">
                            Mẫu được xử lý trong phòng Lab hiện đại, đạt chuẩn quốc tế.
                        </p>
                    </div>
                    <div class="process-card">
                        <h3 class="process-number">4</h3>
                        <h4 class="process-heading">Trả kết quả</h4>
                        <p class="process-desc">
                            Kết quả được trả qua email, Zalo, hoặc bản cứng tại trung tâm.
                        </p>
                    </div>
                </div>
            </div>

            <div className='news-container'>
                <h2 className='news-title'>TIN TỨC</h2>
                {/* viết phần này sau */}
{/* thêm phần này*/}
                 <BlogList />







                <a className='news-button' href="/news">XEM THÊM</a>
            </div>

            <div className='partners-container'></div>
            <h2 className='partners-title'>ĐỐI TÁC CỦA CHÚNG TÔI</h2>
            <p className='partners-description'>Hợp tác cùng các bệnh viện và phòng khám hàng đầu</p>
            <div className='partners-logos'>
                <img src={asset.partner1} alt="Partner 1" />
                <img src={asset.partner2} alt="Partner 2" />
                <img src={asset.partner3} alt="Partner 3" />
                <img src={asset.partner4} alt="Partner 4" />
                <img src={asset.partner5} alt="Partner 5" />
            </div>

        </div>
    );
};

export default Home;
