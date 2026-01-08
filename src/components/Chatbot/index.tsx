import React, { useEffect, useRef, useState } from "react";

import Markdown from "react-markdown";
import { useDispatch, useSelector } from "react-redux";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { toast } from "react-toastify";

import { motion } from "framer-motion";
import { Send } from "lucide-react";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";

import { CloseCircleOutlined } from "@ant-design/icons";

import { Modal } from "antd";

import { addMediasToAlbum } from "@/api/album";
import { useAlbum } from "@/react-query/useAlbum";
import type { Message } from "@/store/chatSlice";
import { sendMessageToBot } from "@/store/chatSlice";
import { AppDispatch, RootState } from "@/store/store";
import type { MediaItem } from "@/types/api/chat";
import "./index.less";

interface ChatbotProps {
  toggleChatbot: () => void;
  isOpen: boolean;
}

const Chatbot: React.FC<ChatbotProps> = ({ toggleChatbot }) => {
  const dispatch = useDispatch<AppDispatch>();
  const messages = useSelector((state: RootState) => state.chat.messages);
  const isTyping = useSelector((state: RootState) => state.chat.isTyping);
  const [input, setInput] = useState<string>("");
  const messageEndRef = useRef<HTMLDivElement | null>(null);
  const [confirmModalVisible, setConfirmModalVisible] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState<{
    album?: { name: string; description: string; media_ids: string[] };
  } | null>(null);
  const { createAlbum, createAlbumLoading } = useAlbum();

  const scrollToBottom = () => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!input.trim() || isTyping) return;

    const messageText = input.trim();
    setInput("");

    // Dispatch the async thunk - it will handle adding user message and calling API
    dispatch(
      sendMessageToBot({
        message: messageText,
        // file_url: null, // Not needed for now
      })
    );
  };

  const handleCreateAlbumClick = (message: Message) => {
    setSelectedMessage(message);
    setConfirmModalVisible(true);
  };

  const handleConfirmCreateAlbum = async () => {
    if (!selectedMessage?.album) return;

    try {
      const albumResponse = await createAlbum({
        album_name: selectedMessage.album.name,
        privacy: "0", // Default to private
      });

      // Add medias to album if media_ids exist
      if (
        selectedMessage.album.media_ids.length > 0 &&
        albumResponse?.album?.id
      ) {
        try {
          await addMediasToAlbum({
            album_id: albumResponse.album.id,
            media_ids: selectedMessage.album.media_ids,
          });
        } catch (addMediaError) {
          console.error("Failed to add medias to album:", addMediaError);
          // Still show success if album was created
        }
      }

      toast.success("Album created successfully!");
      setConfirmModalVisible(false);
      setSelectedMessage(null);
    } catch (error) {
      toast.error("Failed to create album. Please try again.");
      console.error("Create album failed:", error);
    }
  };

  const handleCancelCreateAlbum = () => {
    setConfirmModalVisible(false);
    setSelectedMessage(null);
  };

  const renderMediaItems = (mediaItems: MediaItem[]) => {
    if (!mediaItems || mediaItems.length === 0) return null;

    return (
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))",
          gap: "12px",
          marginTop: "12px",
        }}
      >
        {mediaItems.map((item) => {
          // Create link to media detail page if no URL provided
          const mediaLink = item.url || `/media/${item.id}`;
          const hasImageUrl = !!item.url;

          return (
            <a
              key={item.id}
              href={mediaLink}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => {
                // Always open in new tab
                e.preventDefault();
                window.open(mediaLink, "_blank", "noopener,noreferrer");
              }}
              style={{
                display: "block",
                borderRadius: "8px",
                overflow: "hidden",
                textDecoration: "none",
                color: "inherit",
                transition: "transform 0.2s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "scale(1.05)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "scale(1)";
              }}
            >
              <div
                style={{
                  position: "relative",
                  width: "100%",
                  paddingTop: "100%", // Square aspect ratio
                  backgroundColor: "#f0f0f0",
                }}
              >
                {hasImageUrl ? (
                  <img
                    src={item.url}
                    alt={item.title || "Media"}
                    style={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = "none";
                      const parent = target.parentElement;
                      if (parent) {
                        parent.innerHTML = `<div style="display: flex; align-items: center; justify-content: center; height: 100%; color: #999;">No Image</div>`;
                      }
                    }}
                  />
                ) : (
                  <div
                    style={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      width: "100%",
                      height: "100%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "#999",
                      fontSize: "14px",
                      textAlign: "center",
                      padding: "8px",
                    }}
                  >
                    {item.title || "Media"}
                  </div>
                )}
              </div>
              {item.title && hasImageUrl && (
                <div
                  style={{
                    padding: "8px",
                    fontSize: "12px",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {item.title}
                </div>
              )}
              {item.description && (
                <div
                  style={{
                    padding: "4px 8px",
                    fontSize: "11px",
                    color: "#666",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {item.description}
                </div>
              )}
            </a>
          );
        })}
      </div>
    );
  };

  const MarkdownComponent = {
    code({
      inline,
      className,
      children,
      ...props
    }: {
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
    h1: ({ ...props }: { children: React.ReactNode }) => (
      <h1 style={{ fontSize: "2em", fontWeight: "bold" }} {...props} />
    ),
    h2: ({ ...props }: { children: React.ReactNode }) => (
      <h2 style={{ fontSize: "1.5em", fontWeight: "bold" }} {...props} />
    ),
    h3: ({ ...props }: { children: React.ReactNode }) => (
      <h3 style={{ fontSize: "1.17em", fontWeight: "bold" }} {...props} />
    ),
    li: ({ children, ...props }: { children: React.ReactNode }) => (
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
      className="chatbot-window z-10"
    >
      <div className="chatbot-header">
        <span style={{ fontWeight: 500 }}>Pinbot: Virtual Assistant</span>
        <button className="close-btn" onClick={toggleChatbot}>
          <CloseCircleOutlined />
        </button>
      </div>
      <div className="chatbot-body">
        <div className="messages-container">
          {messages.map((message) => (
            <div
              key={message.id}
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
                  <>
                    <Markdown
                      className={`markdown ${
                        message.isGenerating ? "typing-animation" : ""
                      }`}
                      components={MarkdownComponent as any}
                    >
                      {message.text || "Đang suy nghĩ..."}
                    </Markdown>
                    {message.media && message.media.length > 0 && (
                      <>{renderMediaItems(message.media)}</>
                    )}
                    {message.ask_confirmation &&
                      message.ask_confirmation.action === "CREATE_ALBUM" && (
                        <div style={{ marginTop: "12px" }}>
                          <button
                            onClick={() => handleCreateAlbumClick(message)}
                            style={{
                              padding: "8px 16px",
                              backgroundColor: "#a25772",
                              color: "#fff",
                              border: "none",
                              borderRadius: "8px",
                              cursor: "pointer",
                              fontSize: "14px",
                              fontWeight: 500,
                              transition: "background-color 0.2s",
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.backgroundColor = "#902a55";
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.backgroundColor = "#a25772";
                            }}
                          >
                            Create Album
                          </button>
                        </div>
                      )}
                  </>
                )}
              </div>
            </div>
          ))}

          {/* Show typing indicator */}
          {isTyping && (
            <div className="message ai-message">
              <div className="message-box ai-box">
                <div className="typing-indicator">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
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
              placeholder="Nhập tin nhắn..."
              onChange={(e) => setInput(e.target.value)}
              disabled={isTyping}
            />
            <button
              className="send-btn"
              type="submit"
              disabled={isTyping || !input.trim()}
            >
              <Send size={20} />
            </button>
          </div>
        </form>
      </div>

      <Modal
        title="Confirm Create Album"
        open={confirmModalVisible}
        onOk={handleConfirmCreateAlbum}
        onCancel={handleCancelCreateAlbum}
        confirmLoading={createAlbumLoading}
        okText="Create"
        cancelText="Cancel"
      >
        <p>Bạn có muốn tạo album dựa theo các ảnh trên?</p>
        {selectedMessage?.album && (
          <div style={{ marginTop: "12px" }}>
            <p>
              <strong>Album name:</strong> {selectedMessage.album.name}
            </p>
            {selectedMessage.album.description && (
              <p>
                <strong>Description:</strong>{" "}
                {selectedMessage.album.description}
              </p>
            )}
            <p>
              <strong>Number of media:</strong>{" "}
              {selectedMessage.album.media_ids.length}
            </p>
          </div>
        )}
      </Modal>
    </motion.div>
  );
};

export default Chatbot;
