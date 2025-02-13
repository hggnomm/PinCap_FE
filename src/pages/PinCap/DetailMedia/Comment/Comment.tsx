import React, { useState, useRef, useEffect } from "react";
import "./Comment.less";
import Picker from "@emoji-mart/react";
import data from "@emoji-mart/data";
import { SmileOutlined, SendOutlined } from "@ant-design/icons";

const Comment = () => {
  const [inputValue, setInputValue] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const pickerRef = useRef(null);

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      sendMessage();
    }
  };

  const sendMessage = async () => {
    if (inputValue.trim() === "") return;
    // Logic gửi tin nhắn
  };

  const handleEmojiSelect = (emoji) => {
    setInputValue((prevInput) => prevInput + emoji.native);
  };

  // Close emoji picker when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (pickerRef.current && !pickerRef.current.contains(e.target)) {
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
      <div>
        <form className="msg-form" onSubmit={(e) => e.preventDefault()}>
          <input
            placeholder="Add a comment"
            type="text"
            className="msg-input"
            value={inputValue}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            onFocus={() => setShowEmojiPicker(false)} // Close emoji picker when input is focused
          />
          <SmileOutlined
            className="emoji"
            onClick={() => setShowEmojiPicker((prev) => !prev)}
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
          <SendOutlined className="send-icon" onClick={sendMessage} />
        </form>
      </div>
    </div>
  );
};

export default Comment;
