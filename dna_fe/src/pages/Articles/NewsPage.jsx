import React, { useEffect } from 'react';
import '../../styles/customer/NewsPage.css';
import tet2024 from '../../assets/NghiTet.jpg';
import bongda from '../../assets/BongDa.jpg';
import covid from '../../assets/Viruss.jpg';
import xetnghiem from '../../assets/XetNghiem.png';
import khoahoc from '../../assets/KhoaHoc.jpg';
import hoinghi from '../../assets/HoiNghi.jpg';

const NewsPage = () => {
  console.log('NewsPage is rendering');
  
  const newsItems = [
    {
      id: 1,
      image: tet2024,
      title: 'ADNVietNam Thông báo lịch Nghỉ Tết Nguyên Đán 2024',
      description: 'Thư thông báo lịch Nghỉ Tết Nguyên Đán năm 2024 kính gửi Quý khách'
    },
    {
      id: 2,
      image: bongda,
      title: 'Giải bóng đá 7 - lứa tuổi trên 35 tại ADNVIETNAM',
      description: 'Giải bóng đá trên 7 lứa tuổi trên 35 diễn ra tại sân FPT...'
    },
    {
      id: 3,
      image: covid,
      title: 'Virus Corona là gì? Hướng Dẫn Cách phòng chống Virus',
      description: 'Virus Corona là gì? Theo tổ chức Y tế Thế giới, Coronavirus là một...'
    },
    {
      id: 4,
      image: xetnghiem,
      title: 'Bảng Giá Xét Nghiệm Y Tế',
      description: 'Bảng giá xem chi tiết xét nghiệm y tế tại ADNVIETNAM năm 2024'
    },
    {
      id: 5,
      image: khoahoc,
      title: 'Xét nghiệm gen hỗ trợ điều trị chứng tuyến khối Tiền phân liệu ngừa 2019',
      description: 'Hội nghị tại ngày hành trình 2019 diễn ra ngày 15/10/2019 tại khoa...'
    },
    {
      id: 6,
      image: hoinghi,
      title: 'Hội nghị khoa học lần thứ III của Hiệp hội Y học sinh sản Hoa Kỳ ASRM',
      description: 'Hội nghị khoa học lần thứ III ASRM được diễn ra tại thành phố New...'
    }
  ];

  useEffect(() => {
    console.log('NewsPage mounted');
    console.log('News items:', newsItems);
  }, []);

  return (
    <div className="news-container">
      <h1>Tin tức và Sự kiện</h1>
      <div className="news-grid">
        {newsItems.map((item) => (
          <div key={item.id} className="news-item">
            <div className="news-image">
              <img src={item.image} alt={item.title} />
            </div>
            <div className="news-content">
              <h3>{item.title}</h3>
              <p>{item.description}</p>
              <button className="read-more">Xem thêm</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NewsPage;