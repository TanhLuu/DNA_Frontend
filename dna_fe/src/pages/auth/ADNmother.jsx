import React from 'react';
import '../../styles/auth/Guide.css';

const ADNmother = () => {
  return (
    <div className="guide-container">
      <h1 className="guide-title">Xét nghiệm ADN Mẹ Con – Những điều cần biết</h1>

      <section className="guide-section">
        <h2 className="section-title">1. Xét nghiệm ADN mẹ con là gì?</h2>
        <p>
          Xét nghiệm ADN mẹ con là phương pháp được sử dụng để xác định mối quan hệ huyết thống giữa người 
          mẹ giả định và người con.
        </p>
        <p>
          Về cơ sở khoa học cũng tương tự như xét nghiệm ADN cha con. Bản chất, mỗi người được sinh ra đều được thừa 
          hưởng một nửa gen từ cha và một nửa gen từ mẹ theo nguyên tắc di truyền. Vì vậy, so sánh ADN của người mẹ giả 
          định và người con, có thể xác định được mối quan hệ huyết thống giữa hai người.
        </p>

        <h3>Những trường hợp cần xét nghiệm ADN mẹ - con:</h3>
        <ul>
          <li>Mẹ con thất lạc nhìn nhận nhau sau thời gian xa cách.</li>
          <li>Xét nghiệm ADN mẹ con cho mục đích pháp lý như làm giấy khai sinh cho con, nhập tịch, xác nhận quyền thừa kế, tranh chấp tại tòa án, ...</li>
          <li>Trường hợp người mẹ không thể mang thai, người con được sinh ra bởi người mang thai hộ, nên cần kiểm tra lại chính xác huyết thống ruột thịt.</li>
          <li>Mang thai qua phương pháp thụ tinh trong ống nghiệm (IVF), cần xét nghiệm để xác nhận.</li>
          <li>Các trường hợp nghi ngờ việc trao nhầm con trong bệnh viện.</li>
        </ul>
      </section>

      <section className="guide-section">
        <h2 className="section-title">2. Độ chính xác của xét nghiệm ADN mẹ con</h2>
        <p>
          Xét nghiệm ADN mẹ con có kết quả chính xác rất cao lên đến 99,9999%, thể hiện qua hai trường hợp:
        </p>
        <ul>
          <li><strong>Không có quan hệ huyết thống:</strong> Nếu không xuất hiện việc cho nhận alen trong các Locus gen phân tích thì 
          người mẹ giả định và người con không có quan hệ huyết thống ruột thịt, độ chính xác 100%.</li>
          <li><strong>Có quan hệ huyết thống:</strong> Nếu có sự cho nhận alen hoàn toàn ở các Locus gen thì kết luận người mẹ 
          giả định và người con có quan hệ huyết thống với tỉ lệ chính xác 99,9999%.</li>
        </ul>
      </section>

      <section className="guide-section">
        <h2 className="section-title">3. Làm thế nào để xét nghiệm ADN mẹ con?</h2>

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

export default ADNmother;