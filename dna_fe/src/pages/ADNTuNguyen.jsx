import React from 'react';
//import AdnBooking from '../components/UI/AdnBooking';
import '../styles/adntunguyen.css';


const AdnTuNguyen = () => {
  return (
    <div className="dna-test-container">
      <h1 className="main-title">Xét nghiệm ADN cha con</h1>
      
      <section className="dna-section">
        <h2 className="section-title">1. Xét nghiệm ADN Cha Con là gì?</h2>
        <p>
          Xét nghiệm ADN cha con là phương pháp được sử dụng để xác định mối quan hệ huyết thống giữa người
          cha giả định và người con.
        </p>
        <p>
          Về cơ sở khoa học cũng tương tự như xét nghiệm ADN cha con. Bản chất, mỗi người được sinh ra đều được thừa
          hưởng một nửa gen từ cha và một nửa gen từ mẹ theo nguyên tắc di truyền. Vì vậy, so sánh ADN của người cha giả
          định và người con, có thể xác định được mối quan hệ huyết thống giữa hai người.
        </p>

        <div className="purpose-box">
          <h3>Mục đích của xét nghiệm ADN Huyết Thống cha con?</h3>
          <p>
            Xét nghiệm ADN cha con có ý nghĩa rất quan trọng, giúp nhiều người thân thật tạo có thể <strong>tìm thấy nhau, nhận cha
            con, giúp đoàn tụ gia đình</strong>. Bên cạnh đó, kết quả xét nghiệm ADN huyết thống cha con còn sử dụng cho các thủ
            tục hành chính pháp lý như:
          </p>
          
          <ul className="purpose-list">
            <li>Làm giấy khai sinh cho con nếu cha mẹ chưa có giấy đăng ký kết hôn.</li>
            <li>Thêm tên cha vào giấy khai sinh của con, nếu trước đây giấy khai sinh chỉ có tên mẹ.</li>
            <li>Mẹ bỏ đi, chỉ có người cha làm giấy khai sinh cho con.</li>
            <li>Làm giấy khai sinh cho con trong trường hợp người cha là người nước ngoài.</li>
            <li>Bổ sung hồ sơ nhập tịch, visa bảo lãnh con ra nước ngoài.</li>
            <li>Làm cơ sở pháp nhận quyền thừa kế cha - con.</li>
            <li>Làm hồ sơ pháp lý trong các trường hợp tranh chấp tại Tòa án.</li>
          </ul>
        </div>
      </section>
      
      <section className="dna-section">
        <h2 className="section-title">2. Độ chính xác của xét nghiệm ADN Cha Con</h2>
        <p>
          Trải qua quá trình phát triển, tính đến hiện tại thì xét nghiệm ADN là phương pháp có độ chính xác cao nhất trong
          các phương pháp xác định huyết thống. <strong>Gồm 2 trường hợp sau:</strong>
        </p>
        
        <ul className="accuracy-list">
          <li>
            <strong>Có quan hệ huyết thống:</strong> Nếu kết quả phân tích xuất hiện sự cho - nhận alen ở tất cả các Locus gen khảo sát
            giữa người cha giả định và người con thì có thể kết luận 2 người có quan hệ huyết thống cha con với độ chính
            xác lên đến 99.9999%.
          </li>
          <li>
            <strong>Không có quan hệ huyết thống:</strong> Trường hợp kết quả không có sự cho nhận giữa các alen thì kết quả không có
            mối quan hệ huyết thống cha con với tỉ lệ chính xác 100%.
          </li>
        </ul>
      </section>
      
      <section className="dna-section">
        <h2 className="section-title">3. Làm thế nào để xét nghiệm ADN cha con?</h2>
        
        <div className="testing-method">
          <h3 className="sub-title">3.1. Xét nghiệm tự nguyện (dân sự):</h3>
          <p>
            Đây là xét nghiệm với mục đích cá nhân. Kết quả không có tính pháp lý, vì vậy, thủ tục và quy trình đơn giản hơn.
          </p>
          
          <div className="sample-types">
            <p><strong>Loại mẫu sử dụng:</strong> Nếu khách hàng tự thu mẫu, có thể lựa chọn một trong các loại mẫu sau: Mẫu máu, móc 
            miệng tay, móng chân, máu khô cổ chân, máu cuống rốn, tóc...</p>
          </div>
          
          <div className="process">
            <p><strong>Quy trình xét nghiệm:</strong></p>
            <ul>
              <li>Bước 1: Tư vấn về gói dịch vụ, hướng dẫn thu mẫu và bảo quản đúng cách.</li>
              <li>Bước 2: Khách hàng tự thu mẫu, điền đơn yêu cầu xét nghiệm và gửi về trung tâm sau đó sẽ nhận bộ kit trung tâm 
              gửi về (nếu tự thu mẫu tại nhà). Trường hợp đến trung tâm, nhân viên sẽ trực tiếp thu mẫu máu của khách hàng.</li>
              <li>Bước 3: Kiểm tra mẫu và chuyển mẫu để trung tâm xét nghiệm để tiến hành phân tích.</li>
              <li>Bước 4: Trả kết quả. Khách hàng có thể chọn nhận trực tiếp tại trung tâm nhận kết quả hoặc gửi 
              kết quả về nhà.</li>
            </ul>
          </div>
        </div>
        
        <div className="testing-method">
          <h3 className="sub-title">3.2. Xét nghiệm ADN hành chính:</h3>
          <p>
            Kết quả xét nghiệm được sử dụng tại các cơ quan pháp lý trong và ngoài nước. Vì vậy, quy định và thủ tục cần hồi 
            phục tạp hơn và được thực hiện công khai hóa danh tính.
          </p>
          
          <ul>
            <li>Bước 1: Tư vấn gói xét nghiệm phù hợp với nhu cầu khách hàng, đặt lịch hẹn thu mẫu tại nhà hoặc lịch thu mẫu 
            tại trung tâm.</li>
            <li>Bước 2: Khách hàng điền đầy đủ thông tin trên phiếu yêu cầu xét nghiệm. Mọi thông tin trong phải đồng với 
            thông tin trên giấy tờ tùy thân.</li>
            <li>Bước 3: Xác minh danh tính: người làm xét nghiệm trên 18 tuổi cần có giấy tờ túy thân như Căn cước công dân 
            hoặc hộ chiếu. Trẻ em dưới 18 tuổi cần có người giám hộ ký xác nhận.</li>
            <li>Bước 4: Chụp hình và lấy tay những người làm xét nghiệm.</li>
            <li>Bước 5: Tiến hành thu mẫu những người làm xét nghiệm. Mẫu được thu bởi nhân viên của trung tâm, người làm 
            xét nghiệm không được tự thu mẫu.</li>
            <li>Bước 6: Chuyển mẫu đến trung tâm và tiến hành phân tích.</li>
            <li>Bước 7: Trả kết quả cho khách hàng.</li>
          </ul>
        </div>
      </section>
      
    </div>
  );
};

export default AdnTuNguyen;