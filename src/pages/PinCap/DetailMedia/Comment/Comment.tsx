import React, { useState, useRef, useEffect } from "react";

import "./Comment.less";
import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";
import { clsx } from "clsx";

import {
  SmileOutlined,
  SendOutlined,
  FileImageOutlined,
  CloseCircleFilled,
} from "@ant-design/icons";

import { notification } from "antd";

import { useComment } from "@/react-query/useComment";

interface CommentProps {
  mediaId: string;
  onCommentAdded?: () => void;
}

const Comment: React.FC<CommentProps> = ({ mediaId, onCommentAdded }) => {
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
      onCommentAdded?.();
    } catch (error: unknown) {
      console.error("Error posting comment:", error);

      const err = error as {
        response?: { data?: { message?: string } };
        message?: string;
      };
      const errorMessage =
        err?.response?.data?.message ||
        err?.message ||
        "Failed to post comment";

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

  const handleEmojiSelect = (emoji: { native: string }) => {
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
          <div
            onClick={() => setSelectedImage(null)}
            className={clsx(
              "absolute -top-2 -right-2",
              "flex items-center justify-center",
              "cursor-pointer transition-colors"
            )}
          >
            <CloseCircleFilled
              style={{
                fontSize: "20px",
                color: "#a25772",
              }}
              onMouseEnter={(e) => {
                (e.target as HTMLElement).style.color = "#8a4760";
              }}
              onMouseLeave={(e) => {
                (e.target as HTMLElement).style.color = "#a25772";
              }}
            />
          </div>
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
