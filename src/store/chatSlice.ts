import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface Message {
  sender: "user" | "ai";
  text: string;
  isGenerating?: boolean;
}

interface ChatState {
  messages: Message[];
  isTyping: boolean;
  isOpen: boolean;
}

const initialState: ChatState = {
  messages: [
    {
      sender: "ai",
      text: "Describe more clearly what you would like them to do to help you create a high-quality photo prompt? 😃😉",
    },
    {
      sender: "ai",
      text: "For example: A dog sitting in a park on a sunny day, looking at the camera with its tongue out, surrounded by green grass and a few trees in the background.",
    },
  ],
  isTyping: false,
  isOpen: false,
};

const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    addMessage: (state, action: PayloadAction<Message>) => {
      state.messages.push(action.payload);
    },
    setTyping: (state, action: PayloadAction<boolean>) => {
      state.isTyping = action.payload;
    },
    toggleChatbot: (state) => {
      state.isOpen = !state.isOpen;
    },
    openChatbot: (state) => {
      state.isOpen = true;
    },
    closeChatbot: (state) => {
      state.isOpen = false;
    },
  },
});

export const { addMessage, setTyping, toggleChatbot, openChatbot, closeChatbot } = chatSlice.actions;

export default chatSlice.reducer;
