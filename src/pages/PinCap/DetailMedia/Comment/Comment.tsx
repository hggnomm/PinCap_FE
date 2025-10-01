import React, { useState, useRef, useEffect } from "react";
import "./Comment.less";
import Picker from "@emoji-mart/react";
import data from "@emoji-mart/data";
import {
  SmileOutlined,
  SendOutlined,
  FileImageOutlined,
} from "@ant-design/icons";
import { useComment } from "@/hooks/useComment";
import { notification } from "antd";

interface CommentProps {
  mediaId: string;
}

const Comment: React.FC<CommentProps> = ({ mediaId }) => {
  const [inputValue, setInputValue] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const pickerRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { createComment, createCommentLoading } = useComment();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      sendMessage();
    }
  };

  const sendMessage = async () => {
    if (inputValue.trim() === "" && !selectedImage) return;
    
    const content = inputValue.trim() || "";

    try {
      await createComment({
        media_id: mediaId,
        content: content,
        image: selectedImage || undefined,
      });

      // Reset form
      setInputValue("");
      setSelectedImage(null);
      setShowEmojiPicker(false);

      notification.success({
        message: "Comment posted successfully!",
        duration: 2,
      });
    } catch (error: any) {
      console.error("Error posting comment:", error);
      
      const errorMessage = error?.response?.data?.message || error?.message || "Failed to post comment";
      
      notification.error({
        message: "Failed to post comment",
        description: errorMessage,
        duration: 3,
      });
    }
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedImage(file);
    }
  };

  const handleEmojiSelect = (emoji: any) => {
    setInputValue((prevInput) => prevInput + emoji.native);
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (pickerRef.current && !pickerRef.current.contains(e.target as Node)) {
        setShowEmojiPicker(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="comment">
      <p>What do you think?</p>

      {selectedImage && (
        <div className="mb-3 relative inline-block">
          <img
            src={URL.createObjectURL(selectedImage)}
            alt="Selected"
            className="w-auto h-auto max-h-60 object-cover rounded-lg border border-gray-300"
          />
          <button
            onClick={() => setSelectedImage(null)}
            className="absolute -top-2 -right-2 w-5 h-5 !bg-red-500 hover:!bg-red-600 text-white border-none rounded-full leading-none text-sm cursor-pointer flex items-center justify-center transition-colors duration-200"
          >
            <span className="text-white pb-0.5 ">×</span>
          </button>
        </div>
      )}

      <div>
        <form className="msg-form" onSubmit={(e) => e.preventDefault()}>
          <input
            placeholder="Add a comment"
            type="text"
            className="msg-input"
            value={inputValue}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            onFocus={() => setShowEmojiPicker(false)}
            disabled={createCommentLoading}
          />

          <SmileOutlined
            className="emoji"
            onClick={() => setShowEmojiPicker((prev) => !prev)}
            style={{
              opacity: createCommentLoading ? 0.5 : 1,
              cursor: createCommentLoading ? "not-allowed" : "pointer",
            }}
          />

          <input
            type="file"
            accept="image/*"
            onChange={handleImageSelect}
            ref={fileInputRef}
            style={{ display: "none" }}
          />

          <FileImageOutlined
            className="emoji"
            onClick={() =>
              !createCommentLoading && fileInputRef.current?.click()
            }
            style={{
              opacity: createCommentLoading ? 0.5 : 1,
              cursor: createCommentLoading ? "not-allowed" : "pointer",
              color: selectedImage ? "#1890ff" : undefined,
            }}
          />

          {showEmojiPicker && (
            <div className="picker" ref={pickerRef}>
              <Picker
                data={data}
                onEmojiSelect={handleEmojiSelect}
                theme="auto"
              />
            </div>
          )}

          <SendOutlined
            className="send-icon"
            onClick={sendMessage}
            style={{
              opacity:
                createCommentLoading ||
                (inputValue.trim() === "" && !selectedImage)
                  ? 0.5
                  : 1,
              cursor:
                createCommentLoading ||
                (inputValue.trim() === "" && !selectedImage)
                  ? "not-allowed"
                  : "pointer",
            }}
          />
        </form>
      </div>
    </div>
  );
};

export default Comment;
