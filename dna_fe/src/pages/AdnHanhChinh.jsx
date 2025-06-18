import React from 'react';
import '../styles/adnhanhchinh.css';

const AdnHanhChinh = () => {
    return (
        <div className="dna-test-container">
            <h1 className="main-title">Xét Nghiệm ADN Hành Chính Pháp Lý</h1>

            <section className="intro-section">
                <p>
                    Xét nghiệm ADN làm thủ tục hành chính, pháp lý với nhiều
                    mục đích khác nhau như làm khai sinh, nhập tịch, tranh
                    chấp,... Vậy các Trường hợp nào áp dụng?, thủ tục, quy trình
                    và chi phí thực hiện như thế nào?
                </p>

                <p>
                    Trong bài viết này <strong>trung tâm xét nghiệm MedLab</strong> sẽ chia sẻ pháp lý này để cho bạn hiểu về loại dịch vụ xét
                    nghiệm ADN hành chính
                </p>
            </section>

            <section className="definition-section">
                <h2 className="section-title">Xét nghiệm ADN hành chính là gì?</h2>

                <p>
                    Xét nghiệm ADN hành chính là xét nghiệm ADN được thực hiện nhằm mục đích phục vụ cho các công việc hành
                    chính pháp luật, chúng hạn như <strong>làm giấy khai sinh, xác định quyền nuôi con vụ của pháp lý sau ly hôn, làm cơ sở phân chia tài sản, tiếp nhận quyền thừa kế, làm thủ tục visa, nhập tịch,...</strong>
                </p>
            </section>

            <section className="process-section">
                <h2 className="section-title">Quy trình thực hiện xét nghiệm ADN hành chính</h2>

                <div className="sample-types">
                    <p><strong>Loại mẫu sử dụng:</strong> Nếu khách hàng tự thu mẫu, có thể lựa chọn một trong các loại mẫu sau: Mẫu máu, móng tay, móng chân, máu tóc có chân, máu cuống rốn, máu niêm mạc miệng,...</p>
                </div>

                <p className="process-intro">
                    Kết quả xét nghiệm được sử dụng tại các cơ quan pháp lý trong và ngoài nước. Vì vậy, quy trình và thủ tục đòi hỏi phức tạp hơn và được thực hiện công khai minh bạch.
                </p>

                <ul className="bullet-steps">
                    <li>
                        <span className="step-bullet">Bước 1:</span> Tư vấn gói xét nghiệm phù hợp với nhu cầu khách hàng, đặt lịch hẹn thu mẫu tại nhà hoặc lịch thu mẫu tại trung tâm
                    </li>

                    <li>
                        <span className="step-bullet">Bước 2:</span> Khách hàng điền đầy đủ thông tin trên phiếu yêu cầu xét nghiệm. Mọi thông tin trong đơn phải đúng với thông tin trên giấy tờ tùy thân
                    </li>

                    <li>
                        <span className="step-bullet">Bước 3:</span> Xác minh danh tính: người làm xét nghiệm trên 18 tuổi cần có giấy tờ tùy thân như Căn cước công dân hoặc Hộ chiếu. Trẻ em dưới 18 tuổi cần có người giám hộ ký xác nhận.
                    </li>

                    <li>
                        <span className="step-bullet">Bước 4:</span> Chụp hình và lấy tay những người làm xét nghiệm.
                    </li>

                    <li>
                        <span className="step-bullet">Bước 5:</span> Tiến hành thu mẫu những người làm xét nghiệm. Mẫu được thu bởi nhân viên của trung tâm, người làm xét nghiệm không được tự thu mẫu
                    </li>

                    <li>
                        <span className="step-bullet">Bước 6:</span> Chuyển mẫu đến trung tâm và tiến hành phân tích
                    </li>

                    <li>
                        <span className="step-bullet">Bước 7:</span> Trả kết quả cho khách hàng.
                    </li>
                </ul>
            </section>
        </div>
    );
};

export default AdnHanhChinh;