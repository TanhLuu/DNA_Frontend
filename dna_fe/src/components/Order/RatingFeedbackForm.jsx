import React, { useState } from "react";
import axios from "axios";
import "../../styles/customer/RatingFeedbackForm.css";

const RatingFeedbackForm = ({ orderId, onClose, onSubmit, feedback }) => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (rating < 1 || rating > 5) {
      setError("Vui lòng chọn đánh giá từ 1 đến 5 sao.");
      return;
    }
    if (!comment.trim()) {
      setError("Vui lòng nhập bình luận.");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        "http://localhost:8080/api/rating-feedbacks",
        {
          testOrderId: orderId,
          rating,
          comment,
          date: new Date().toISOString().split("T")[0],
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setSuccess(true);
      setError(null);
      onSubmit(response.data); // Gọi callback với dữ liệu feedback mới
      setTimeout(() => onClose(), 1500);
    } catch (err) {
      setError("Lỗi khi gửi phản hồi: " + (err.response?.data || err.message));
    }
  };

  return (
    <div className="rating-feedback-modal">
      <div className="rating-feedback-content">
        <h2>Đánh giá và phản hồi</h2>
        {feedback ? (
          <div className="feedback-view">
            <h3>Phản hồi của bạn</h3>
            <p>
              <strong>Đánh giá:</strong>{" "}
              {[...Array(feedback.rating)].map((_, i) => (
                <span key={i} className="star filled">★</span>
              ))}
            </p>
            <p>
              <strong>Bình luận:</strong> {feedback.comment}
            </p>
            <p>
              <strong>Ngày gửi:</strong>{" "}
              {new Date(feedback.date).toLocaleDateString("vi-VN")}
            </p>
            <div className="rating-buttons">
              <button type="button" className="cancel-button" onClick={onClose}>
                Đóng
              </button>
            </div>
          </div>
        ) : (
          <>
            {error && <div className="rating-error">{error}</div>}
            {success && (
              <div className="rating-success">Gửi phản hồi thành công!</div>
            )}
            {!success && (
              <form onSubmit={handleSubmit}>
                <div className="rating-stars">
                  <label>Đánh giá:</label>
                  <div>
                    {[1, 2, 3, 4, 5].map((star) => (
                      <span
                        key={star}
                        className={`star ${rating >= star ? "filled" : ""}`}
                        onClick={() => setRating(star)}
                      >
                        ★
                      </span>
                    ))}
                  </div>
                </div>
                <div className="comment-section">
                  <label>Bình luận:</label>
                  <textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Nhập bình luận của bạn..."
                    required
                  />
                </div>
                <div className="rating-buttons">
                  <button type="submit" className="submit-button">
                    Gửi phản hồi
                  </button>
                  <button
                    type="button"
                    className="cancel-button"
                    onClick={onClose}
                  >
                    Hủy
                  </button>
                </div>
              </form>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default RatingFeedbackForm;