import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface Message {
  sender: "user" | "ai";
  text: string;
  isGenerating?: boolean;
}

interface ChatState {
  messages: Message[];
  isTyping: boolean;
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
  },
});

export const { addMessage, setTyping } = chatSlice.actions;

export default chatSlice.reducer;
