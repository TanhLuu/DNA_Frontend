import React, { useState } from 'react';
import axios from 'axios';
import '../styles/components/shared/gemini-chat.css';

const GeminiChatPopup = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [chatHistory, setChatHistory] = useState([]);

  const togglePopup = () => setIsOpen(!isOpen);

  const sendMessage = async () => {
    if (!message.trim()) return;

    const userMsg = { role: 'user', content: message };
    setChatHistory([...chatHistory, userMsg]);
    setMessage('');

    try {
      const response = await axios.post('http://localhost:8080/api/gemini', {
        message: message,
      });

      const reply = { role: 'gemini', content: response.data };
      setChatHistory(prev => [...prev, reply]);
    } catch (err) {
      console.error(err);
      setChatHistory(prev => [...prev, { role: 'gemini', content: 'Lỗi khi gửi yêu cầu.' }]);
    }
  };

  return (
    <div className="gemini-popup-container">
      {!isOpen && (
        <button onClick={togglePopup} className="gemini-toggle-button">
          Cần hỗ trợ? Chat ngay!
        </button>
      )}

      {isOpen && (
        <div className="gemini-chatbox">
          <div className="gemini-chatbox-header">
            <span>Trò chuyện cùng trợ lý</span>
            <button className="gemini-close-button" onClick={togglePopup}>×</button>
          </div>
          <div className="gemini-chatbox-body">
            {chatHistory.map((chat, i) => (
              <div
                key={i}
                className={`gemini-message ${chat.role === 'user' ? 'gemini-message-user' : 'gemini-message-bot'}`}
              >
                {chat.content}
              </div>
            ))}
          </div>
          <div className="gemini-chatbox-input">
            <input
              type="text"
              className="gemini-input-field"
              value={message}
              placeholder="Nhập tin nhắn..."
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
            />
            <button className="gemini-send-button" onClick={sendMessage}>
              Gửi
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default GeminiChatPopup;
