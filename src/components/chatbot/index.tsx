import React, { useEffect, useRef, useState } from "react";
import { Send } from "lucide-react";
import { GoogleGenerativeAI, ChatSession } from "@google/generative-ai";
import Markdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import { motion } from "framer-motion";
import "./index.less";

interface Message {
  sender: "user" | "ai";
  text: string;
  isGenerating?: boolean;
}

// Props cho Chatbot
interface ChatbotProps {
  toggleChatbot: () => void;
  isOpen: boolean;
}

// Tạo kết nối với Google Generative AI
const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

const Chatbot: React.FC<ChatbotProps> = ({ toggleChatbot, isOpen }) => {
  const [messages, setMessages] = useState<Message[]>([
    // { sender: "user", text: "" },
    {
      sender: "ai",
      text: "Describe more clearly what you would like them to do to help you create a high-quality photo prompt?",
    },
  ]);
  const [input, setInput] = useState<string>("");
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const messageEndRef = useRef<HTMLDivElement | null>(null);
  const chatSessionRef = useRef<ChatSession | null>(null);

  // Cuộn xuống cuối mỗi khi có tin nhắn mới
  const scrollToBottom = () => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();

    // Khởi tạo session chat nếu chưa có
    if (!chatSessionRef.current) {
      chatSessionRef.current = model.startChat({
        generationConfig: {
          temperature: 0.9,
          topK: 1,
          topP: 1,
          maxOutputTokens: 2048,
        },
        history: [],
      });
    }
  }, [messages]);

  // Hàm gửi tin nhắn
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!input.trim()) return;

    setMessages((prev) => [...prev, { sender: "user", text: input }]);
    setInput("");
    setIsTyping(true);

    try {
      let fullResponse = "";
      const result = await chatSessionRef.current!.sendMessageStream(input);

      // Cập nhật tin nhắn "AI đang xử lý"
      setMessages((prev) => [
        ...prev,
        { sender: "ai", text: "", isGenerating: true },
      ]);

      // Xử lý stream trả về và cập nhật tin nhắn AI
      for await (const chunk of result.stream) {
        const chunkText = chunk.text();
        fullResponse += chunkText;

        setMessages((prev) => [
          ...prev.slice(0, -1),
          { sender: "ai", text: fullResponse, isGenerating: true },
        ]);
      }

      setMessages((prev) => [
        ...prev.slice(0, -1),
        { sender: "ai", text: fullResponse, isGenerating: false },
      ]);
      setIsTyping(false);
    } catch (error) {
      console.error(error);
      setIsTyping(false);
      setMessages((prev) => [
        ...prev,
        {
          sender: "ai",
          text: "Sorry, there was an error",
          isGenerating: false,
        },
      ]);
    }
  };

  const MarkdownComponent = {
    code({
      node,
      inline,
      className,
      children,
      ...props
    }: {
      node?: any;
      inline?: boolean;
      className?: string;
      children: React.ReactNode;
    }) {
      const match = /language-(\w+)/.exec(className || "");
      return !inline && match ? (
        <SyntaxHighlighter style={vscDarkPlus} language={match[1]} PreTag="div">
          {String(children).replace(/\n$/, "")}
        </SyntaxHighlighter>
      ) : (
        <code className={className} {...props}>
          {children}
        </code>
      );
    },
    h1: ({ node, ...props }: any) => (
      <h1 style={{ fontSize: "2em", fontWeight: "bold" }} {...props} />
    ),
    h2: ({ node, ...props }: any) => (
      <h2 style={{ fontSize: "1.5em", fontWeight: "bold" }} {...props} />
    ),
    h3: ({ node, ...props }: any) => (
      <h3 style={{ fontSize: "1.17em", fontWeight: "bold" }} {...props} />
    ),

  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 100 }} // Đặt vị trí ban đầu ở dưới và ẩn
      animate={{ opacity: 1, y: 0 }} // Kéo lên vị trí ban đầu và hiển thị
      exit={{ opacity: 0, y: 100 }} // Đẩy ra ngoài khi đóng
      transition={{ duration: 0.3 }} // Thời gian hiệu ứng
      className="chatbot-window"
    >
      <div className="chatbot-header">
        <span>Pinbot</span>
        <button className="close-btn" onClick={toggleChatbot}>
          X
        </button>
      </div>
      <div className="chatbot-body">
        <div className="messages-container">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`message ${
                message.sender === "user" ? "user-message" : "ai-message"
              }`}
            >
              <div
                className={`message-box ${
                  message.sender === "user" ? "user-box" : "ai-box"
                }`}
              >
                {message.sender === "user" ? (
                  message.text
                ) : (
                  <Markdown
                    className={`markdown ${
                      message.isGenerating ? "typing-animation" : ""
                    }`}
                    components={MarkdownComponent}
                  >
                    {message.text || "Thinking..."}
                  </Markdown>
                )}
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="message ai-message">
              <div className="message-box ai-box">Typing...</div>
            </div>
          )}
          <div ref={messageEndRef} />
        </div>

        <form onSubmit={handleSubmit} className="message-form">
          <div className="input-container">
            <input
              type="text"
              className="input-field"
              value={input}
              placeholder="Type a message..."
              onChange={(e) => setInput(e.target.value)}
            />
            <button className="send-btn">
              <Send size={16} />
            </button>
          </div>
        </form>
      </div>
    </motion.div>
  );
};

export default Chatbot;
