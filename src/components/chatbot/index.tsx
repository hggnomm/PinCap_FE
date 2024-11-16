import React, { useEffect, useRef, useState } from "react";
import { Send } from "lucide-react";
import { GoogleGenerativeAI, ChatSession } from "@google/generative-ai";
import Markdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import { motion } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store/store";
import { addMessage, setTyping } from "../../store/chatSlice";
import "./index.less";
import { CloseCircleOutlined } from "@ant-design/icons";

interface ChatbotProps {
  toggleChatbot: () => void;
  isOpen: boolean;
}

// Initialize connection with Google Generative AI
const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

const Chatbot: React.FC<ChatbotProps> = ({ toggleChatbot, isOpen }) => {
  const dispatch = useDispatch();
  const messages = useSelector((state: RootState) => state.chat.messages);
  const isTyping = useSelector((state: RootState) => state.chat.isTyping);
  const [input, setInput] = useState<string>("");
  const [currentResponse, setCurrentResponse] = useState<string>(""); // Local state for intermediate stream
  const messageEndRef = useRef<HTMLDivElement | null>(null);
  const chatSessionRef = useRef<ChatSession | null>(null);

  const scrollToBottom = () => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();

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
  }, [messages, currentResponse]); // Trigger scroll when messages or currentResponse updates

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!input.trim()) return;

    // Dispatch the user's message immediately to Redux
    dispatch(addMessage({ sender: "user", text: input }));
    setInput("");
    dispatch(setTyping(true));

    try {
      let fullResponse = "";
      const result = await chatSessionRef.current!.sendMessageStream(input);

      setCurrentResponse(""); // Reset current streaming response

      // Process the stream and update local state, only saving final response to Redux
      for await (const chunk of result.stream) {
        const chunkText = chunk.text();
        fullResponse += chunkText;
        setCurrentResponse(fullResponse); // Update local state to display stream
      }

      // When streaming is done, dispatch the final message to Redux
      dispatch(
        addMessage({
          sender: "ai",
          text: fullResponse,
          isGenerating: false,
        })
      );
      setCurrentResponse(""); // Clear the local state
      dispatch(setTyping(false));
    } catch (error) {
      console.error(error);
      dispatch(setTyping(false));
      dispatch(
        addMessage({
          sender: "ai",
          text: "Sorry, there was an error",
          isGenerating: false,
        })
      );
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
    li: ({ node, children, ...props }: any) => (
      <li style={{ listStyleType: "none", marginBottom: "0.5em" }} {...props}>
        {children}
      </li>
    ),
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 100 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 100 }}
      transition={{ duration: 0.5 }}
      className="chatbot-window"
    >
      <div className="chatbot-header">
        <span style={{ fontWeight: 500 }}>Pinbot: Virtual Assistant</span>
        <button className="close-btn" onClick={toggleChatbot}>
          <CloseCircleOutlined />{" "}
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

          {/* Render the streaming response if AI is typing */}
          {isTyping && currentResponse && (
            <div className="message ai-message">
              <div className="message-box ai-box">
                <Markdown
                  className="markdown typing-animation"
                  components={MarkdownComponent}
                >
                  {currentResponse}
                </Markdown>
              </div>
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
              <Send size={20} />
            </button>
          </div>
        </form>
      </div>
    </motion.div>
  );
};

export default Chatbot;
