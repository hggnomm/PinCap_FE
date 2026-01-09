import React, { useEffect, useRef, useState } from "react";

import Markdown from "react-markdown";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { toast } from "react-toastify";

import { useQueryClient } from "@tanstack/react-query";
import { clsx } from "clsx";
import { motion } from "framer-motion";
import { Send } from "lucide-react";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";

import { CloseCircleOutlined } from "@ant-design/icons";

import { addMediasToAlbum } from "@/api/album";
import { getDetailMedia } from "@/api/media";
import ModalComponent from "@/components/Modal/ModalComponent";
import { useAlbumToast } from "@/contexts/AlbumToastContext";
import { useAlbum } from "@/react-query/useAlbum";
import type { Message } from "@/store/chatSlice";
import { sendMessageToBot } from "@/store/chatSlice";
import { AppDispatch, RootState } from "@/store/store";
import type { MediaItem } from "@/types/api/chat";
import "./index.less";

interface ChatbotProps {
  toggleChatbot: () => void;
  isOpen: boolean;
}

const Chatbot: React.FC<ChatbotProps> = ({ toggleChatbot }) => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const messages = useSelector((state: RootState) => state.chat.messages);
  const isTyping = useSelector((state: RootState) => state.chat.isTyping);
  const [input, setInput] = useState<string>("");
  const messageEndRef = useRef<HTMLDivElement | null>(null);
  const [confirmModalVisible, setConfirmModalVisible] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const { createAlbum, createAlbumLoading } = useAlbum();
  const { showToast: showAlbumToast } = useAlbumToast();

  const scrollToBottom = () => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!input.trim() || isTyping) return;

    const messageText = input.trim();
    setInput("");

    // Dispatch the async thunk - it will handle adding user message and calling API
    dispatch(
      sendMessageToBot({
        message: messageText,
        // file_url: null, // Not needed for now
      })
    );
  };

  const handleCreateAlbumClick = (message: Message) => {
    setSelectedMessage(message);
    setConfirmModalVisible(true);
  };

  const handleConfirmCreateAlbum = async () => {
    if (!selectedMessage) return;

    // Get media_ids from message.media array
    const mediaIds =
      selectedMessage.media?.map((item: MediaItem) => item.id) || [];

    // Get album name from album.name if exists, otherwise use default
    const albumName = selectedMessage.album?.name || "New Album";

    if (mediaIds.length === 0) {
      toast.error("No media items to add to album");
      return;
    }

    try {
      const albumResponse = await createAlbum({
        album_name: albumName,
        privacy: "0", // Default to private
      });

      // Add medias to album if album was created successfully
      if (albumResponse?.id) {
        try {
          await addMediasToAlbum({
            album_id: albumResponse.id,
            medias_id: mediaIds,
          });
        } catch (addMediaError: unknown) {
          console.error("Failed to add medias to album:", addMediaError);

          // Type guard for error object
          const isErrorWithStatus = (
            err: unknown
          ): err is { status?: number; message?: string } => {
            return (
              typeof err === "object" &&
              err !== null &&
              ("status" in err || "message" in err)
            );
          };

          const isErrorWithResponse = (
            err: unknown
          ): err is {
            response?: {
              status?: number;
              data?: { error?: string; message?: string };
            };
            message?: string;
          } => {
            return (
              typeof err === "object" &&
              err !== null &&
              ("response" in err || "message" in err)
            );
          };

          // Get error status
          let errorStatus: number | undefined;
          if (isErrorWithStatus(addMediaError)) {
            errorStatus = addMediaError.status;
          } else if (isErrorWithResponse(addMediaError)) {
            errorStatus = addMediaError.response?.status;
          }

          // Show error message if it's a permission error (403)
          if (errorStatus === 403) {
            let errorMessage =
              "You do not have permission to add media to this album";
            if (isErrorWithResponse(addMediaError)) {
              errorMessage =
                addMediaError.response?.data?.error ||
                addMediaError.response?.data?.message ||
                addMediaError.message ||
                errorMessage;
            } else if (isErrorWithStatus(addMediaError)) {
              errorMessage = addMediaError.message || errorMessage;
            }
            toast.error(errorMessage);
          } else if (errorStatus === 422) {
            toast.warning("Some media items may already be in the album");
          } else {
            // For other errors, show a warning but don't fail the whole operation
            let errorMessage = "Failed to add some media to album";
            if (isErrorWithResponse(addMediaError)) {
              errorMessage =
                addMediaError.response?.data?.error ||
                addMediaError.response?.data?.message ||
                addMediaError.message ||
                errorMessage;
            } else if (isErrorWithStatus(addMediaError)) {
              errorMessage = addMediaError.message || errorMessage;
            }
            toast.warning(errorMessage);
          }
          // Still show success if album was created
        }

        // Show album toast after successful creation
        showAlbumToast({
          id: albumResponse.id,
          album_name: albumResponse.album_name || albumName,
          image_cover: null,
          privacy: albumResponse.privacy || "PRIVATE",
          medias_count: mediaIds.length,
        });

        // Invalidate albums query to refetch MyAlbum data
        queryClient.invalidateQueries({ queryKey: ["albums"] });
        queryClient.invalidateQueries({ queryKey: ["album-members"] });
      }

      setConfirmModalVisible(false);
      setSelectedMessage(null);
    } catch (error) {
      toast.error("Failed to create album. Please try again.");
      console.error("Create album failed:", error);
    }
  };

  const handleCancelCreateAlbum = () => {
    setConfirmModalVisible(false);
    setSelectedMessage(null);
  };

  const handleViewMedia = async (message: Message) => {
    if (message.media && message.media.length > 0) {
      const mediaId = message.media[0].id;

      try {
        const mediaDetail = await getDetailMedia(mediaId, true);

        if (mediaDetail) {
          if (
            mediaDetail.is_created === 0 ||
            mediaDetail.is_created === false
          ) {
            navigate(`/create-media?draft_id=${mediaId}`);
          } else {
            navigate(`/media/${mediaId}`);
          }
        } else {
          toast.error("Failed to load media details");
        }
      } catch (error) {
        console.error("Error fetching media details:", error);
        toast.error("Failed to load media details");
      }
    }
  };

  const renderMediaItems = (
    mediaItems: MediaItem[],
    isDraft: boolean = false
  ) => {
    if (!mediaItems || mediaItems.length === 0) return null;

    return (
      <div className="grid grid-cols-[repeat(auto-fill,minmax(150px,1fr))] gap-3 mt-3">
        {mediaItems.map((item) => {
          // Use media_url from response, fallback to url for backward compatibility
          const imageUrl = item.media_url || item.url;
          const mediaLink = `/media/${item.id}`;

          // If it's a draft, render as non-clickable div
          if (isDraft) {
            return (
              <div
                key={item.id}
                className="block rounded-lg overflow-hidden no-underline text-inherit cursor-default"
              >
                <div className="relative w-full pt-[100%] bg-gray-100">
                  {imageUrl ? (
                    <img
                      src={imageUrl}
                      alt="Media"
                      className="absolute top-0 left-0 w-full h-full object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = "none";
                        const parent = target.parentElement;
                        if (parent) {
                          parent.innerHTML = `<div class="flex items-center justify-center h-full text-gray-400">No Image</div>`;
                        }
                      }}
                    />
                  ) : (
                    <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center text-gray-400 text-sm text-center p-2">
                      Media
                    </div>
                  )}
                </div>
              </div>
            );
          }

          // Normal media item - clickable
          return (
            <a
              key={item.id}
              href={mediaLink}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => {
                // Always open in new tab
                e.preventDefault();
                window.open(mediaLink, "_blank", "noopener,noreferrer");
              }}
              className="block rounded-lg overflow-hidden no-underline text-inherit transition-all duration-300 ease-in-out hover:scale-[1.02] cursor-pointer"
            >
              <div className="relative w-full pt-[100%] bg-gray-100">
                {imageUrl ? (
                  <img
                    src={imageUrl}
                    alt="Media"
                    className="absolute top-0 left-0 w-full h-full object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = "none";
                      const parent = target.parentElement;
                      if (parent) {
                        parent.innerHTML = `<div class="flex items-center justify-center h-full text-gray-400">No Image</div>`;
                      }
                    }}
                  />
                ) : (
                  <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center text-gray-400 text-sm text-center p-2">
                    Media
                  </div>
                )}
              </div>
            </a>
          );
        })}
      </div>
    );
  };

  const MarkdownComponent = {
    code({
      inline,
      className,
      children,
      ...props
    }: {
      inline?: boolean;
      className?: string;
      children: React.ReactNode;
    }) {
      const match = /language-(\w+)/.exec(className || "");
      return !inline && match ? (
        <SyntaxHighlighter style={vscDarkPlus} language={match[1]} PreTag="div">
          {String(children).replace(/\n$/, "")}
        </SyntaxHighlighter>
      ) : (
        <code className={className} {...props}>
          {children}
        </code>
      );
    },
    h1: ({ ...props }: { children: React.ReactNode }) => (
      <h1 className="text-[2em] font-bold" {...props} />
    ),
    h2: ({ ...props }: { children: React.ReactNode }) => (
      <h2 className="text-[1.5em] font-bold" {...props} />
    ),
    h3: ({ ...props }: { children: React.ReactNode }) => (
      <h3 className="text-[1.17em] font-bold" {...props} />
    ),
    li: ({ children, ...props }: { children: React.ReactNode }) => (
      <li className="list-none mb-2" {...props}>
        {children}
      </li>
    ),
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 100 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 100 }}
      transition={{ duration: 0.5 }}
      className="chatbot-window z-10"
    >
      <div className="chatbot-header">
        <span className="font-medium">Pinbot: Virtual Assistant</span>
        <button className="close-btn" onClick={toggleChatbot}>
          <CloseCircleOutlined />
        </button>
      </div>
      <div className="chatbot-body">
        <div className="messages-container">
          {messages.map((message) => (
            <div
              key={message.id}
              className={clsx("message", {
                "user-message": message.sender === "user",
                "ai-message": message.sender === "ai",
              })}
            >
              <div
                className={clsx("message-box", {
                  "user-box": message.sender === "user",
                  "ai-box": message.sender === "ai",
                })}
              >
                {message.sender === "user" ? (
                  <div className="break-words whitespace-pre-wrap">
                    {message.text}
                  </div>
                ) : (
                  <>
                    <Markdown
                      className={clsx("markdown", {
                        "typing-animation": message.isGenerating,
                      })}
                      components={
                        MarkdownComponent as Parameters<
                          typeof Markdown
                        >[0]["components"]
                      }
                    >
                      {message.text || "Đang suy nghĩ..."}
                    </Markdown>
                    {message.media && message.media.length > 0 && (
                      <>
                        {renderMediaItems(
                          message.media,
                          message.intent === "CREATE_MEDIA_FROM_INPUT"
                        )}
                      </>
                    )}
                    {message.ask_confirmation &&
                      message.ask_confirmation.action === "CREATE_ALBUM" && (
                        <div className="mt-3 flex justify-center">
                          <button
                            onClick={() => handleCreateAlbumClick(message)}
                            className="px-4 py-2 bg-rose-600 text-white border-none rounded-lg cursor-pointer text-sm font-medium transition-colors duration-200 hover:bg-rose-700"
                          >
                            Create Album
                          </button>
                        </div>
                      )}
                    {message.intent === "CREATE_MEDIA_FROM_INPUT" &&
                      message.media &&
                      message.media.length > 0 && (
                        <div className="mt-3 flex justify-center">
                          <button
                            onClick={() => handleViewMedia(message)}
                            className="px-4 py-2 bg-rose-600 text-white border-none rounded-lg cursor-pointer text-sm font-medium transition-colors duration-200 hover:bg-rose-700"
                          >
                            View Media
                          </button>
                        </div>
                      )}
                  </>
                )}
              </div>
            </div>
          ))}

          {/* Show typing indicator */}
          {isTyping && (
            <div className="message ai-message">
              <div className="message-box ai-box">
                <div className="typing-indicator">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
            </div>
          )}

          <div ref={messageEndRef} />
        </div>

        <form onSubmit={handleSubmit} className="message-form">
          <div className="input-container">
            <input
              type="text"
              className="input-field"
              value={input}
              placeholder="Nhập tin nhắn..."
              onChange={(e) => setInput(e.target.value)}
              disabled={isTyping}
            />
            <button
              className="send-btn"
              type="submit"
              disabled={isTyping || !input.trim()}
            >
              <Send size={20} />
            </button>
          </div>
        </form>
      </div>

      <ModalComponent
        titleDefault="Confirm Create Album"
        visible={confirmModalVisible}
        onConfirm={handleConfirmCreateAlbum}
        onCancel={handleCancelCreateAlbum}
        confirmLoading={createAlbumLoading}
        buttonLabels={{
          confirmLabel: "Create",
          cancelLabel: "Cancel",
        }}
      >
        <p>Bạn có muốn tạo album dựa theo các ảnh trên?</p>
        {selectedMessage && (
          <div className="mt-3">
            {selectedMessage.album?.name && (
              <p>
                <strong>Album name:</strong> {selectedMessage.album.name}
              </p>
            )}
            {selectedMessage.album?.description && (
              <p>
                <strong>Description:</strong>{" "}
                {selectedMessage.album.description}
              </p>
            )}
            <p>
              <strong>Number of media:</strong>{" "}
              {selectedMessage.media?.length || 0}
            </p>
          </div>
        )}
      </ModalComponent>
    </motion.div>
  );
};

export default Chatbot;
