import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../../styles/admin/RatingFeedbackList.css';

const RatingFeedbackList = () => {
  const [ratingFeedbacks, setRatingFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRatingFeedbacks = async () => {
      try {
        // Lấy danh sách rating feedback
        const feedbackResponse = await axios.get('http://localhost:8080/api/rating-feedbacks');
        const feedbacks = feedbackResponse.data;
        console.log('Danh sách feedback:', feedbacks);

        // Lấy thông tin TestOrder và Service cho mỗi feedback
        const enrichedFeedbacks = await Promise.all(
          feedbacks.map(async (feedback) => {
            try {
              // Gọi API để lấy TestOrder, chuyển testOrderId thành String
              const orderResponse = await axios.get(
                `http://localhost:8080/api/testorders/${feedback.testOrderId.toString()}`
              );
              const testOrder = orderResponse.data;
              console.log(`TestOrder cho ID ${feedback.testOrderId}:`, testOrder);

              // Gọi API để lấy Service, chuyển serviceId thành String
              const serviceResponse = await axios.get(
                `http://localhost:8080/api/services/${testOrder.serviceId.toString()}`
              );
              const service = serviceResponse.data;
              console.log(`Service cho ID ${testOrder.serviceId}:`, service);

              return {
                ...feedback,
                testOrder: {
                  ...testOrder,
                  service,
                },
              };
            } catch (err) {
              console.error(
                `Lỗi khi lấy dữ liệu cho testOrderId ${feedback.testOrderId}:`,
                err.response?.status,
                err.message
              );
              return {
                ...feedback,
                testOrder: null,
              };
            }
          })
        );

        setRatingFeedbacks(enrichedFeedbacks);
        setLoading(false);
      } catch (err) {
        console.error('Lỗi khi lấy danh sách feedback:', err.response?.status, err.message);
        setError('Không thể tải danh sách đánh giá. Vui lòng kiểm tra API.');
        setLoading(false);
      }
    };

    fetchRatingFeedbacks();
  }, []);

  if (loading) return <div>Đang tải...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="rating-feedback-container">
      <h2><strong>Danh Sách Đánh Giá và Phản Hồi</strong></h2>
      {ratingFeedbacks.length === 0 ? (
        <p>Không có đánh giá nào.</p>
      ) : (
        <table className="rating-feedback-table">
          <thead>
            <tr>
              
              <th>Mã Đơn Hàng</th>
              <th>Tên Dịch Vụ</th>
              <th>Loại Dịch Vụ</th>
              <th>Điểm Đánh Giá</th>
              <th>Bình Luận</th>
              <th>Ngày</th>
            </tr>
          </thead>
          <tbody>
            {ratingFeedbacks.map((feedback) => (
              <tr key={feedback.ratingFeedbackId}>
                
                <td>{feedback.testOrderId || 'Không có'}</td>
                <td>
                  {feedback.testOrder && feedback.testOrder.service
                    ? feedback.testOrder.service.serviceName || 'Không có tên dịch vụ'
                    : 'Không có dữ liệu đơn hàng'}
                </td>
                <td>
                  {feedback.testOrder && feedback.testOrder.service
                    ? feedback.testOrder.service.serviceType || 'Không có loại dịch vụ'
                    : 'Không có dữ liệu đơn hàng'}
                </td>
                <td>{feedback.rating || 'Không có'}</td>
                <td>{feedback.comment || 'Không có bình luận'}</td>
                <td>{feedback.date || 'Không có'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default RatingFeedbackList;