import React from "react";

import { useSelector, useDispatch } from "react-redux";

import Chatbot from "@/components/Chatbot/index";
import { toggleChatbot } from "@/store/chatSlice";
import { RootState } from "@/store/store";

const ChatbotProvider: React.FC = () => {
  const dispatch = useDispatch();
  const isOpen = useSelector((state: RootState) => state.chat.isOpen);

  const handleToggleChatbot = () => {
    dispatch(toggleChatbot());
  };

  return (
    <>
      {isOpen && (
        <Chatbot toggleChatbot={handleToggleChatbot} isOpen={isOpen} />
      )}
    </>
  );
};

export default ChatbotProvider;
