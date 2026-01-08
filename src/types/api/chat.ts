/**
 * Chat API Type Definitions
 */

export type ChatIntent =
  | "SEARCH_MEDIA"
  | "SUGGEST_MEDIA"
  | "CONFIRM_CREATE_ALBUM"
  | "CREATE_MEDIA_FROM_INPUT"
  | "GENERAL_QA";

export interface MediaItem {
  id: string;
  title: string;
  description?: string;
  tags?: string[];
  popularity_score?: number;
  user_id?: string;
  url?: string; // For backward compatibility with UI
}

export interface ConversationHistoryItem {
  role: "user" | "model";
  content: string;
}

export interface ChatRequest {
  // user_id: string; // Not needed - backend will get from auth token
  message: string;
  conversation_history?: ConversationHistoryItem[];
  suggested_media_ids?: string[];
  file_url?: string;
}

export interface AskConfirmation {
  action: string;
  message: string;
}

export interface AlbumData {
  name: string;
  description: string;
  media_ids: string[];
}

export interface ChatResponse {
  intent: ChatIntent;
  answer?: string;
  media?: MediaItem[];
  ask_confirmation?: AskConfirmation;
  action?: string;
  album?: AlbumData;
  frontend_link?: string;
  error?: string;
}
