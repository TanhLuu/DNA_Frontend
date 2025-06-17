import React from 'react';
import '../../styles/auth/Guide.css';

const ADNfather = () => {
  return (
   <div className="guide-container">
      <h1 className="guide-title">Xét nghiệm ADN cha con</h1>

      <p className="guide-intro">
        Xét nghiệm ADN cha con là phương pháp được sử dụng để xác định mối quan hệ huyết thống giữa người 
        cha giả định và người con. Về cơ sở khoa học cũng tương tự như xét nghiệm ADN cha con. Bản chất, mỗi người được sinh ra đều được thừa 
        hưởng một nửa gen từ cha và một nửa gen từ mẹ theo nguyên tắc di truyền. Vì vậy, so sánh ADN của người cha giả 
        định và người con, có thể xác định được mối quan hệ huyết thống giữa hai người.
      </p>

      <section className="guide-section">
        <h2 className="section-title">1. Xét nghiệm ADN Cha Con là gì?</h2>
        <p>
          Xét nghiệm ADN cha con có ý nghĩa rất quan trọng, giúp nhiều người thật thà cứ tìm <strong>thấy nhau, nhận cha 
          con, giúp đoàn tụ gia đình</strong>. Bên cạnh đó, kết quả xét nghiệm ADN huyết thống cha con còn sử dụng cho các thủ 
          tục hành chính pháp lý như:
        </p>
        <ul>
          <li>Làm giấy khai sinh cho con nếu cha mẹ chưa có giấy đăng ký kết hôn</li>
          <li>Thêm tên cha vào giấy khai sinh của con, nếu trước đây giấy khai sinh chỉ có tên mẹ</li>
          <li>Mẹ bỏ đi, chỉ có người cha làm giấy khai sinh cho con</li>
          <li>Làm giấy khai sinh cho con trong trường hợp người cha là người nước ngoài</li>
          <li>Bổ sung tờ sơ nhập tịch, visa bảo lãnh con ra nước ngoài</li>
          <li>Làm cơ sở liên quan đến quyền thừa kế cha - con</li>
          <li>Làm hồ sơ pháp lý trong các trường hợp tranh chấp tại Tòa án</li>
        </ul>
      </section>

      <section className="guide-section">
        <h2 className="section-title">2. Độ chính xác của xét nghiệm ADN Cha Con</h2>
        <p>
          Trải qua quá trình phát triển, tính đến hiện tại thì xét nghiệm ADN là phương pháp có độ chính xác cao nhất trong 
          các phương pháp xác định huyết thống. Gồm 2 trường hợp sau:
        </p>
        <ul>
          <li><strong>Có quan hệ huyết thống:</strong> Nếu kết quả phân tích xuất hiện sự cha – nhận allên ở tất cả các Locus gen khảo sát 
          giữa người cha giả định với người con thì có thể kết luận 2 người có quan hệ huyết thống cha con với độ chính 
          xác lên đến 99,9999%.</li>
          <li><strong>Không có quan hệ huyết thống:</strong> Trường hợp kết quả không có sự cho nhận giữa các allên thì kết quả không có 
          mối quan hệ huyết thống cha con với tỷ lệ chính xác 100%.</li>
        </ul>
      </section>

      <section className="guide-section">
        <h2 className="section-title">3. Làm thế nào để xét nghiệm ADN cha con?</h2>

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
            <li>Bước 2: Khách hàng tự thu mẫu, điền đơn yêu cầu xét nghiệm và gửi về trung tâm sau đó sẽ nhận bộ kết trung tâm gửi về (nếu tự thu mẫu tại nhà). Trường hợp đến trung tâm, nhân viên sẽ trực tiếp thu mẫu của khách hàng</li>
            <li>Bước 3: Kiểm tra mẫu và chuyển mẫu đến trung tâm xét nghiệm để tiến hành phân tích</li>
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

export default ADNfather;