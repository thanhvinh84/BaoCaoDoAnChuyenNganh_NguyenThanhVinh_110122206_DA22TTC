import React, { useState, useEffect } from "react";
import "./chat.css";
import axios from 'axios';

const ChatAIApp = () => {
//Tạo usestate lưu message của AI và User
  const [chats, setChats] = useState(() => {
    const savedChats = localStorage.getItem("ai-saved-chats");
    return savedChats ? JSON.parse(savedChats) : [];
  });

    const [data,setData] = useState([]);
    console.log("Dữ liệu sản phẩm cho AI:", data);

    const loadData = async() =>{
        try {
            const response = await axios.get("http://localhost:5000/api/getallsp");
            console.log("API trả về:", response.data);
            setData(response.data);
        } catch (error) {
            console.error("Lỗi khi load dữ liệu cho AI:", error);
        }
    };

const generateContextText = (data) => {
  if (!Array.isArray(data) || data.length === 0) return "Không có sản phẩm nào.";

  // Map danh mục
  const categoryMap = {
    1: "Bếp điện từ",
    2: "Máy rửa chén", 
    3: "Máy hút mùi",
    4: "Khóa điện tử",
    5: "Lò nướng"
  };

  // Giới hạn 30 sản phẩm để tránh context quá dài
  const limitedData = data.slice(0, 30);

  return limitedData.map((product) => {
    const name = product.ten_san_pham || "Sản phẩm";
    const category = categoryMap[product.ma_danh_muc] || "Khác";
    const price = product.gia ? `${Number(product.gia).toLocaleString("vi-VN")} VND` : "Liên hệ";
    const color = product.mau_sac || "";
    const quantity = product.soluong || 0;
    
    return `- ${name}: ${category}, Giá: ${price}, ${color}, Còn: ${quantity}`;
  }).join("\n");
};

  
// Tạo ustate chứa theme màu
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem("ai-themeColor") || "dark_mode";
    
  });

  const [userMessage, setUserMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(true); // Trạng thái hiển thị danh sách gợi ý

  // Thay API key mới tại đây nếu cần
  // Tạo key mới tại: https://aistudio.google.com/app/apikey
  const API_KEY = "AIzaSyBtYScIQ1E9-l5KnDoWg4opDOU9_B2I5vM";
  // Dùng gemini-2.5-flash (model mới nhất có trong danh sách)
  const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${API_KEY}`;


  useEffect(() => {
    loadData();
  }, []);


//Mỗi lần message thay đổi sẽ lưu thêm
  useEffect(() => {
    localStorage.setItem("ai-saved-chats", JSON.stringify(chats));
  }, [chats]);

//Set màu cho theme nếu người dùng lựa chọn
  useEffect(() => {
    localStorage.setItem("ai-themeColor", theme);
    document.body.classList.toggle("light_mode", theme === "light_mode");
  }, [theme]);


//Hàm submit message
const handleSendMessage = async (message) => {
  if (!message.trim() || isLoading) return;

  setChats((prevChats) => [
    ...prevChats,
    { text: message, type: "outgoing" },
  ]);
  setUserMessage("");
  setIsLoading(true);

  const contextText = generateContextText(data);
  console.log("Context text:", contextText);
  console.log("API URL:", API_URL);

  // Gộp context và câu hỏi vào 1 message duy nhất
  const fullMessage = `Bạn là nhân viên tư vấn bán hàng của cửa hàng thiết bị nhà bếp và khóa điện tử. 
Dưới đây là danh sách các sản phẩm hiện có trong cửa hàng:

${contextText}

Câu hỏi của khách hàng: ${message}

Hãy trả lời ngắn gọn dựa trên thông tin sản phẩm ở trên.`;

  // Hàm gọi API với retry
  const callGeminiAPI = async (retries = 2) => {
    for (let i = 0; i <= retries; i++) {
      try {
        console.log(`Sending request to Gemini... (attempt ${i + 1})`);
        const response = await fetch(API_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [
              {
                role: "user",
                parts: [{ text: fullMessage }]
              }
            ],
            generationConfig: {
              temperature: 0.7,
              maxOutputTokens: 1024,
            }
          }),
        });
        
        console.log("Response status:", response.status);

        // Nếu bị rate limit, đợi và thử lại
        if (response.status === 429 && i < retries) {
          console.log("Rate limited, waiting 2 seconds...");
          await new Promise(resolve => setTimeout(resolve, 2000));
          continue;
        }

        const resData = await response.json();
        console.log("Gemini response:", resData);
        
        if (resData?.candidates?.[0]?.content?.parts?.[0]?.text) {
          return { success: true, text: resData.candidates[0].content.parts[0].text };
        } else if (resData?.error) {
          console.error("Gemini API error:", resData.error);
          if (resData.error.message?.includes("quota") || resData.error.code === 429) {
            if (i < retries) {
              await new Promise(resolve => setTimeout(resolve, 2000));
              continue;
            }
            return { success: false, text: "API đã hết quota. Vui lòng tạo API key mới tại: https://aistudio.google.com/app/apikey" };
          }
          return { success: false, text: `Lỗi: ${resData.error.message || "Không xác định"}` };
        }
        return { success: false, text: "Không nhận được phản hồi từ AI." };
      } catch (error) {
        console.error("Fetch error:", error);
        if (i < retries) {
          await new Promise(resolve => setTimeout(resolve, 1000));
          continue;
        }
        return { success: false, text: "Lỗi kết nối, vui lòng kiểm tra mạng và thử lại." };
      }
    }
    return { success: false, text: "Không thể kết nối đến AI sau nhiều lần thử." };
  };

  try {
    const result = await callGeminiAPI();
    const aiMessage = removeAsterisks(result.text);
    setChats((prevChats) => [
      ...prevChats,
      { text: aiMessage, type: "incoming" },
    ]);
  } catch (error) {
    console.error("Unexpected error:", error);
    setChats((prevChats) => [
      ...prevChats,
      { text: "Đã xảy ra lỗi không mong muốn.", type: "incoming" },
    ]);
  } finally {
    setIsLoading(false);
  }
};

  
//Hàm gửi text gợi ý đến api gemini
  const handleSuggestionClick = (text) => {
    setUserMessage(text);
    handleSendMessage(text);
    setShowSuggestions(false); // Ẩn danh sách gợi ý
  };

//Hàm xử lý đổi màu
  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === "dark_mode" ? "light_mode" : "dark_mode"));
  };

//Hàm xóa nội dung chat cùng AI
  const deleteAllChats = () => {
    if (window.confirm("Bạn có chắc chắn muốn xóa toàn bộ lịch sử chat?")) {
      setShowSuggestions(true);
      setChats([]);
      localStorage.removeItem("ai-saved-chats");
    }
  };

//Hàm cắt chuỗi message AI
  function removeAsterisks(text) {
    return text.replace(/\*/g, "").trim(); // Loại bỏ dấu * và cắt khoảng trắng thừa
  }
 
  return (
    <div id="ai-chat">
      <div className="ai-all">
        {/* AI Suggestion List */}
        {showSuggestions && ( // Hiển thị gợi ý nếu `showSuggestions` là true
          <ul className="ai-suggestion-list">
            {[
              "Tôi đang quan tâm đến các loại bếp điện tử, bạn có thể tư vấn giúp tôi?",
  
              "Nếu bếp bị chập điện hoặc phát ra mùi khét, tôi nên xử lý thế nào?",
              
              "Bạn có thể tư vấn giúp tôi hiện tại cửa hàng đang có những mẫu bếp nào?",
              
              "Tư vấn thói quen sử dụng và vệ sinh bếp đúng cách để bếp hoạt động bền bỉ và tiết kiệm điện năng hơn."
            ].map((suggestion, index) => (
              <li
                key={index}
                className="ai-suggestion"
                onClick={() => handleSuggestionClick(suggestion)}
              >
                <h4 className="ai-text">{suggestion}</h4>
                <span className="ai-icon material-symbols-rounded">draw</span>
              </li>
            ))}
          </ul>
        )}

        {/* AI Chat List */}
        <div className="ai-chat-list">
          <div className="ai-chat-grid">
            {chats.map((chat, index) => (
              <div
                key={index}
                className={`ai-message ${chat.type === "outgoing" ? "outgoing" : "incoming"}`}
              >
                <div className="ai-message-content">
                  <img
                    className="ai-avatar"
                    src={
                      chat.type === "outgoing"
                        ? "https://img.icons8.com/?size=100&id=ScJCfhkd77yD&format=png&color=000000"
                        : "https://img.icons8.com/?size=100&id=kTuxVYRKeKEY&format=png&color=000000"
                    }
                    alt={chat.type === "outgoing" ? "User avatar" : "AI avatar"}
                  />
                  <p className="ai-text">{chat.text}</p>
                </div>
                {chat.type === "incoming" && (
                  <span
                    onClick={() => navigator.clipboard.writeText(chat.text)}
                    className="ai-icon material-symbols-rounded"
                  >
                    content_copy
                  </span>
                )}
              </div>
            ))}
            {/* Hiển thị trạng thái đang tải */}
            {isLoading && (
              <div className="ai-message incoming">
                <div className="ai-message-content">
                  <img
                    className="ai-avatar"
                    src="https://img.icons8.com/?size=100&id=kTuxVYRKeKEY&format=png&color=000000"
                    alt="AI avatar"
                  />
                  <p className="ai-text">AI đang phản hồi...</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* AI Typing Area */}
        <div className="ai-typing-area">
          <form
            className="ai-typing-form"
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage(userMessage);
            }}
          >
            <div className="ai-input-wrapper">
              <input
                type="text"
                placeholder="Nhập câu hỏi của bạn tại đây..."
                className="ai-typing-input"
                value={userMessage}
                onChange={(e) => setUserMessage(e.target.value)}
                required
              />
              <button
                type="submit"
                id="send-ai-message-button"
                className="ai-icon material-symbols-rounded"
              >
                send
              </button>
            </div>
            <div className="ai-action-buttons">
              <span
                id="theme-ai-toggle-button"
                className="ai-icon material-symbols-rounded"
                onClick={toggleTheme}
              >
                {theme}
              </span>
              <span
                id="delete-ai-chat-button"
                className="ai-icon material-symbols-rounded"
                onClick={deleteAllChats}
              >
                delete
              </span>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ChatAIApp;
