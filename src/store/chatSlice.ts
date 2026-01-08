import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";

import { ChatService } from "@/api/chat";
import type { MediaItem, ChatIntent } from "@/types/api/chat";

/**
 * Generate a unique ID for messages
 */
const generateMessageId = (): string => {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

export interface Message {
  id: string;
  sender: "user" | "ai";
  text: string;
  isGenerating?: boolean;
  media?: MediaItem[];
  intent?: ChatIntent;
  action?: string;
  isInitial?: boolean; // Flag to mark static welcome messages
}

interface ChatState {
  messages: Message[];
  isTyping: boolean;
  isOpen: boolean;
}

const initialState: ChatState = {
  messages: [
    {
      id: generateMessageId(),
      sender: "ai",
      text: "Pinbot đã được nâng cấp! Giờ bạn cứ mô tả ảnh cần tìm, mình sẽ lục trong hệ thống và lấy ra cho bạn ngay. 😃🔍",
      isInitial: true, // Mark as initial static message
    },
    {
      id: generateMessageId(),
      sender: "ai",
      text: "Ví dụ: 'Tìm ảnh idol IU', 'Hình mèo cute', 'Ảnh chụp màn hình game', hay đơn giản là 'Hình đi du lịch Đà Nẵng'...",
      isInitial: true, // Mark as initial static message
    },
  ],
  isTyping: false,
  isOpen: false,
};

/**
 * Async thunk to send message to chatbot
 */
export const sendMessageToBot = createAsyncThunk(
  "chat/sendMessageToBot",
  async (
    payload: {
      message: string;
      conversation_history?: Message[];
      suggested_media_ids?: string[];
      file_url?: string | null;
    },
    { getState }
  ) => {
    const state = getState() as { chat: ChatState; auth: { id: string } };
    const messages = state.chat.messages;
    // const userId = state.auth.id; // Not needed - backend will get from auth token

    // if (!userId) {
    //   throw new Error("User ID is required. Please login first.");
    // }

    // Build conversation history from previous messages (excluding initial static welcome messages)
    // Convert format from {sender, text} to {role, content}
    const conversationHistory = messages
      .filter(
        (msg) => msg.id && !msg.isGenerating && !msg.isInitial // Exclude initial static messages
      )
      .map((msg) => ({
        role:
          msg.sender === "user" ? ("user" as const) : ("assistant" as const),
        content: msg.text,
      }));

    // Prepare request payload
    const requestPayload = {
      // user_id: userId, // Not needed - backend will get from auth token
      message: payload.message,
      conversation_history:
        conversationHistory.length > 0 ? conversationHistory : undefined,
      suggested_media_ids: payload.suggested_media_ids || undefined,
      file_url: payload.file_url || undefined,
    };

    // Call the API
    const response = await ChatService.sendMessage(requestPayload);
    return response;
  }
);

const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    addMessage: (state, action: PayloadAction<Omit<Message, "id">>) => {
      state.messages.push({
        ...action.payload,
        id: generateMessageId(),
      });
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
  extraReducers: (builder) => {
    builder
      // Handle pending state
      .addCase(sendMessageToBot.pending, (state, action) => {
        // Add user message immediately
        const userMessage: Message = {
          id: generateMessageId(),
          sender: "user",
          text: action.meta.arg.message,
        };
        state.messages.push(userMessage);
        state.isTyping = true;
      })
      // Handle fulfilled state
      .addCase(sendMessageToBot.fulfilled, (state, action) => {
        state.isTyping = false;

        const response = action.payload;

        // Handle error response
        if (response.error) {
          const errorMessage: Message = {
            id: generateMessageId(),
            sender: "ai",
            text: response.error,
          };
          state.messages.push(errorMessage);
          return;
        }

        // Create AI message from response
        const aiMessage: Message = {
          id: generateMessageId(),
          sender: "ai",
          text:
            response.answer || "Xin lỗi, tôi không thể trả lời câu hỏi này.",
          media: response.media || undefined,
          intent: response.intent,
          action: response.action || undefined,
        };

        state.messages.push(aiMessage);
      })
      // Handle rejected state
      .addCase(sendMessageToBot.rejected, (state, action) => {
        state.isTyping = false;

        // Add error message
        const errorMessage: Message = {
          id: generateMessageId(),
          sender: "ai",
          text:
            action.error.message ||
            "Xin lỗi, đã có lỗi xảy ra khi xử lý tin nhắn của bạn. Vui lòng thử lại sau.",
        };

        state.messages.push(errorMessage);
      });
  },
});

export const {
  addMessage,
  setTyping,
  toggleChatbot,
  openChatbot,
  closeChatbot,
} = chatSlice.actions;

export default chatSlice.reducer;
