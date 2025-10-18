import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/store/store';
import { toggleChatbot } from '@/store/chatSlice';
import Chatbot from './index';

const ChatbotProvider: React.FC = () => {
  const dispatch = useDispatch();
  const isOpen = useSelector((state: RootState) => state.chat.isOpen);

  const handleToggleChatbot = () => {
    dispatch(toggleChatbot());
  };

  return (
    <>
      {isOpen && (
        <Chatbot 
          toggleChatbot={handleToggleChatbot} 
          isOpen={isOpen} 
        />
      )}
    </>
  );
};

export default ChatbotProvider;
