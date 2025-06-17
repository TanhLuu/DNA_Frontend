import React from 'react';
import '../../styles/auth/Guide.css';

const CivilADNGuide = () => {
  return (
    <div className="guide-container">
      <h1 className="guide-title">Xét Nghiệm ADN Tự Nguyện (ADN dân sự)</h1>

      <p className="guide-intro">
        Với <strong>xét nghiệm ADN tự nguyện</strong> hay còn gọi là xét nghiệm adn dân sự, bạn có thể xác minh hoặc phủ nhận những nghi ngờ của mình, cho phép bạn đưa ra quyết định đúng đắn sáng suốt nhằm đạt được mục tiêu diễn ra trong tâm. Đó chính xác cũng chính là nghiệm huyết thống này, là bằng chứng không thể chối cãi đối với những ai muốn che dấy sự thật, giúp bạn có thể chọn con đường phù hợp cho mình trong mối quan hệ đó.
      </p>

      <section className="guide-section">
        <h2 className="section-title">Xét nghiệm ADN tự nguyện là gì?</h2>
        <p>
          Xét nghiệm ADN tự nguyện nhằm mục đích giải tỏa nghi ngờ cá nhân cho các mối quan hệ như: Cha / mẹ – con, anh /chị – em, Ông / bà – cháu, họ hàng nội ngoại
        </p>
        <p className="note"><em>* Lưu ý: Loại dịch vụ này không có giá trị pháp lý</em></p>
      </section>

      <section className="guide-section">
        <h2 className="section-title">Có thể làm xét nghiệm ADN giải tỏa nghi ngờ cho những mối quan hệ nào?</h2>
        <ul className="relationship-types">
          <li>Xét nghiệm ADN Cha Con / mẹ - con</li>
          <li>Xét nghiệm ADN thai nhi trước sinh không xâm lấn tìm cha</li>
          <li>Xét nghiệm ADN Anh/chị - em</li>
          <li>Xét nghiệm ADN Ông Bà và Cháu (Ông nội-cháu Gái; Bà nội-cháu Gái)</li>
          <li>Xét nghiệm ADN Họ Hàng ( nội ngoại, có di chữ bác,...)</li>
        </ul>
      </section>

      <section className="guide-section">
        <h2 className="section-title">Các bước ước thực hiện xét nghiệm ADN tự nguyện</h2>
        <p className="process-note">
          Đây là xét nghiệm vì mục đích cá nhân. Kết quả không có tính pháp lý, vì vậy thủ tục và quy trình đơn giản hơn.
        </p>

        <div className="sample-types">
          <h3>Loại mẫu sử dụng:</h3>
          <p>Nếu khách hàng tự thu mẫu, có thể lựa chọn một trong các loại mẫu sau: Mẫu máu, móng tay, móng chân, mẫu tóc có chân, mẫu cường rốn, mẫu niêm mạc miệng,...</p>
        </div>

        <div className="process-steps">
          <h3>Quy trình xét nghiệm:</h3>
          <ul>
            <li>Bước 1: Tư vấn về gói dịch vụ, hướng dẫn thu mẫu và bảo quản đúng cách.</li>
            <li>Bước 2: Khách hàng tự thu mẫu, điền đơn yêu cầu xét nghiệm và gửi về trung tâm sau đó sẽ mang bộ kết trung tâm gửi về (nếu tự thu mẫu tại nhà). Trường hợp đến trung tâm, nhân viên sẽ trực tiếp thu mẫu của quý khách hàng.</li>
            <li>Bước 3: Kiểm tra mẫu và chuyển mẫu đến trung tâm xét nghiệm để tiến hành phân tích.</li>
            <li>Bước 4: Trả kết quả: Khách hàng có thể chọn hình thức trả kết quả online, đến trung tâm nhận kết quả hoặc gửi kết quả về nhà.</li>
          </ul>
        </div>
      </section>
    </div>
  );
};

export default CivilADNGuide;