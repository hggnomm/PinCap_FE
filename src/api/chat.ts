import type { ChatRequest, ChatResponse } from "@/types/api/chat";

import apiClient from "./apiClient";

/**
 * Chat Service for handling chatbot API calls
 */
export const ChatService = {
  /**
   * Send a message to the chatbot API
   * @param payload - Chat request payload
   * @returns Promise<ChatResponse>
   */
  sendMessage: async (payload: ChatRequest): Promise<ChatResponse> => {
    try {
      const response = await apiClient.post<ChatResponse>(
        "/api/chatbot",
        payload
      );
      return response.data;
    } catch (error) {
      console.error("Chat API Error:", error);
      throw error;
    }
  },
};
