import React from 'react';
import '../../styles/customer/Guide.css';

const ADNsibling = () => {
  return (
    <div className="guide-container">
      <h1 className="guide-title">Xét nghiệm ADN anh chị em – Những vấn đề quan trọng cần biết</h1>

      <section className="guide-section">
        <h2 className="section-title">1. Tổng quan về xét nghiệm ADN anh chị em</h2>
        <p>
          Xét nghiệm ADN anh chị em giúp xác định mối quan hệ huyết thống giữa những người anh chị em 
          giả định, bao gồm anh chị em cùng cha mẹ, cùng cha khác mẹ, cùng mẹ khác cha. Với độ 
          chính xác lên đến 99,9%.
        </p>
        
        <h3>Lý do xét nghiệm:</h3>
        <ul>
          <li>Tìm lại anh chị em thất lạc khi cha mẹ, ông bà không còn hoặc vắng mặt.</li>
          <li>Xác minh mối quan hệ huyết thống trong gia đình khi có nghi ngờ.</li>
          <li>Làm cơ sở pháp lý để nhập tịch, phân chia tài sản, hoặc giải quyết tranh chấp thừa kế.</li>
          <li>Thực hiện theo yêu cầu của cơ quan pháp lý như Tòa án.</li>
        </ul>
      </section>

      <section className="guide-section">
        <h2 className="section-title">2. Các nguyên lý được sử dụng trong xét nghiệm ADN anh chị em</h2>
        <p>Xét nghiệm ADN anh chị em dựa trên phân tích di truyền để xác định mối quan hệ huyết thống:</p>
        <ul>
          <li>Phân tích NST Y: Áp dụng cho anh em trai, xác định quan hệ qua cha (dòng nội) dựa trên NST Y di truyền từ cha.</li>
          <li>Phân tích NST X: Áp dụng cho chị em gái, xác định quan hệ qua cha hoặc mẹ bằng NST X (nguồn gốc từ cha/mẹ).</li>
          <li>Phân tích ADN ti thể: Xác định quan hệ qua mẹ (dòng ngoại) giữa anh chị em, do ADN ti thể chỉ di truyền từ mẹ qua các thế hệ.</li>
          <li>Fullsibling và Halfsibling: Phân biệt anh chị em cùng cha mẹ (Fullsibling) hoặc chỉ cùng cha/mẹ (Halfsibling), bằng phân tích các cặp STR trên nhiễm sắc thể thường, kết hợp với các phương pháp trên để tăng độ chính xác, đặc biệt khi không có mẫu cha/mẹ.</li>
        </ul>
      </section>

      <section className="guide-section">
        <h2 className="section-title">4. Làm thế nào xét nghiệm ADN anh chị em?</h2>

        <h3 className="section-title">3.1. Xét nghiệm tự nguyện (dân sự):</h3>
        <p className="process-note">
          Đây là xét nghiệm với mục đích cá nhân. Kết quả không có tính pháp lý, vì vậy, thủ tục và quy trình đơn giản hơn.
        </p>

        <div className="sample-types">
          <h3>Loại mẫu sử dụng:</h3>
          <p>Nếu khách hàng tự thu mẫu, có thể lựa chọn một trong các loại mẫu sau: Mẫu máu, móc móng tay, móng chân, mẫu tóc có chân, mẫu cường rốn, mẫu niêm mạc miệng,...</p>
        </div>

        <div className="process-steps">
          <h3>Quy trình xét nghiệm:</h3>
          <ul>
            <li>Bước 1: Tư vấn về gói dịch vụ, hướng dẫn thu mẫu và bảo quản đúng cách</li>
            <li>Bước 2: Khách hàng tự thu mẫu, điền đơn yêu cầu xét nghiệm và gửi về trung tâm sau đó sẽ nhận bộ kit trung tâm gửi về (nếu tự thu mẫu tại nhà). Trường hợp đến trung tâm, nhân viên sẽ trực tiếp thu mẫu của khách hàng</li>
            <li>Bước 3: Kiểm tra mẫu và chuyển mẫu để trung tâm xét nghiệm để tiến hành phân tích</li>
            <li>Bước 4: Trả kết quả: Khách hàng có thể chọn hình thức trả kết quả online, đến trung tâm nhận kết quả hoặc gửi kết quả về nhà</li>
          </ul>
        </div>

        <h3 className="section-title">3.2. Xét nghiệm ADN hành chính:</h3>
        <p>
          Kết quả xét nghiệm được sử dụng tại các cơ quan pháp lý trong và ngoài nước. Vì vậy, quy trình và thủ tục đòi hỏi 
          phức tạp hơn và được thực hiện công khai minh bạch.
        </p>
        <div className="process-steps">
          <ul>
            <li>Bước 1: Tư vấn gói xét nghiệm phù hợp với nhu cầu khách hàng, đặt lịch hẹn thu mẫu tại nhà hoặc lịch thu mẫu tại trung tâm</li>
            <li>Bước 2: Khách hàng điền đầy đủ thông tin trên phiếu yêu cầu xét nghiệm. Mọi thông tin trong đơn phải đúng với thông tin trên giấy tờ tùy thân</li>
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

export default ADNsibling;