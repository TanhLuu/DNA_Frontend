import React from 'react';
import '../../styles/customer/Guide.css';


const LegalADNGuide = () => {
  return (
    <div className="guide-container">
      <h1 className="guide-title">Xét Nghiệm ADN Hành Chính Pháp Lý</h1>
      
      <p className="guide-intro">
        Xét nghiệm ADN làm thủ tục hành chính, pháp lý với nhiều mục đích khác nhau như làm khai sinh, nhập tịch, tạm trú/định cư... Vậy các Trường hợp nào áp dụng?, thủ tục, quy trình và chi phí thực hiện như thế nào?
      </p>

      <p>Trong bài viết này <strong>trung tâm xét nghiệm MedLab</strong> sẽ chia sẻ pháp lý này để cho bạn hiểu về loại dịch vụ xét nghiệm ADN hành chính</p>

      <section className="guide-section">
        <h2 className="section-title">Xét nghiệm ADN hành chính là gì?</h2>
        <p>
          Xét nghiệm ADN hành chính là xét nghiệm ADN được thực hiện nhằm mục đích phục vụ cho các công việc hành chính pháp luật, chẳng hạn như <strong>làm giấy khai sinh, xác định quyền lợi và nghĩa vụ của cha mẹ con cái sau ly hôn, làm cơ sở phân chia tài sản, tiếp nhận quyền thừa kế, làm thủ tục visa, nhập tịch,...</strong>
        </p>
      </section>

      <section className="guide-section">
        <h2 className="section-title">Quy trình thực hiện xét nghiệm ADN hành chính</h2>
        
        <div className="sample-types">
          <h3>Loại mẫu sử dụng:</h3>
          <p>Nếu khách hàng tự thu mẫu, có thể lựa chọn một trong các loại mẫu sau: Mẫu máu, móng tay, móng chân, mẫu tóc có chân, mẫu cường rốn, mẫu niêm mạc miệng,...</p>
        </div>

        <div className="process-steps">
          <h3>Các bước thực hiện:</h3>
          <ul>
            <li>Bước 1: Tư vấn gói xét nghiệm phù hợp với nhu cầu khách hàng, đặt lịch hẹn thu mẫu tại nhà hoặc lịch thu mẫu tại trung tâm</li>
            <li>Bước 2: Khách hàng điền đầy đủ thông tin trên phiếu yêu cầu xét nghiệm. Mọi thông tin trong quá trình đăng ký thông tin trên giấy tờ tùy thân</li>
            <li>Bước 3: Xác minh danh tính người làm xét nghiệm trên 18 tuổi cần có giấy tờ tùy thân như Căn cước công dân hoặc Hộ chiếu. Trẻ em dưới 18 tuổi cần có người giám hộ ký xác nhận</li>
            <li>Bước 4: Chụp hình và lấy tay những người làm xét nghiệm</li>
            <li>Bước 5: Tiến hành thu mẫu những người làm xét nghiệm. Mẫu được thu bởi nhân viên của trung tâm, người làm xét nghiệm không được tự thu mẫu</li>
            <li>Bước 6: Chuyển mẫu đến trung tâm và tiến hành phân tích</li>
            <li>Bước 7: Trả kết quả cho khách hàng</li>
          </ul>
        </div>
      </section>
    </div>
  );
};

export default LegalADNGuide;