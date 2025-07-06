import React, { useState } from 'react';
import axios from 'axios';

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
    <div className="fixed bottom-6 right-6 z-50">
      <button
        onClick={togglePopup}
        className="bg-purple-600 text-white px-4 py-2 rounded-full shadow-md hover:bg-purple-700"
      >
        {isOpen ? 'Đóng Chat' : 'AI Tư vấn khách hàng'}
      </button>

      {isOpen && (
        <div className="bg-white border w-80 h-96 rounded-lg shadow-lg mt-2 flex flex-col">
          <div className="p-2 border-b bg-purple-100 font-bold text-center">AI Tư vấn khách hàng</div>
          <div className="flex-1 overflow-y-auto p-2 text-sm space-y-1">
            {chatHistory.map((chat, i) => (
              <div
                key={i}
                className={`p-2 rounded ${
                  chat.role === 'user' ? 'bg-purple-100 text-right' : 'bg-gray-100 text-left'
                }`}
              >
                {chat.content}
              </div>
            ))}
          </div>
          <div className="p-2 border-t flex items-center gap-2">
            <input
              type="text"
              className="flex-1 border rounded px-2 py-1 text-sm"
              value={message}
              placeholder="Nhập tin nhắn..."
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
            />
            <button
              className="bg-purple-500 text-white px-3 py-1 rounded text-sm"
              onClick={sendMessage}
            >
              Gửi
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default GeminiChatPopup;
