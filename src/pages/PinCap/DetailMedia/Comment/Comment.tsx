import React, { useState } from "react";
import "./Comment.less";
import Picker from "@emoji-mart/react";
import data from "@emoji-mart/data";
import { SmileOutlined, SendOutlined } from "@ant-design/icons";

const Comment = () => {
  const [inputValue, setInputValue] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

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

  return (
    <div className="comment">
      <form className="msg-form" onSubmit={(e) => e.preventDefault()}>
        <input
          placeholder="Type a message..."
          type="text"
          className="msg-input"
          value={inputValue}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={() => setShowEmojiPicker(false)}
        />
        <SmileOutlined
          className="emoji"
          onClick={() => setShowEmojiPicker((prev) => !prev)}
        />
        {showEmojiPicker && (
          <div className="picker">
            <Picker data={data} onEmojiSelect={handleEmojiSelect} />
          </div>
        )}
        <SendOutlined className="send-icon" onClick={sendMessage} />
      </form>
    </div>
  );
};

export default Comment;
