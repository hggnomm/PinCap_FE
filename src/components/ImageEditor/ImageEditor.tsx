import React, { useState, useRef, useEffect } from "react";

import { clsx } from "clsx";
import ImageEditor from "tui-image-editor";

import { CloseOutlined } from "@ant-design/icons";

import { Button } from "antd";

import "tui-image-editor/dist/tui-image-editor.css";

// Custom CSS to hide download button
const customStyles = `
  .tui-image-editor-download-btn,
  .tie-btn-download,
  .tui-image-editor-header-buttons .tui-image-editor-download,
  [title="Download"] {
    display: none !important;
  }
`;

interface ImageEditorProps {
  isVisible: boolean;
  imageSrc: string;
  onClose: () => void;
  onImageEdited: (editedImageBlob: Blob) => void;
}

const ImageEditorComponent: React.FC<ImageEditorProps> = ({
  isVisible,
  imageSrc,
  onClose,
  onImageEdited,
}) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const editorRef = useRef<HTMLDivElement>(null);
  const tuiEditorRef = useRef<ImageEditor | null>(null);

  useEffect(() => {
    // Block body scroll when modal is open
    if (isVisible) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    // Only add keyboard handler when editor is NOT visible to prevent conflicts
    if (!isVisible) {
      const handleGlobalKeyDown = (e: KeyboardEvent) => {
        if (e.key === "Enter") {
          const target = e.target as HTMLElement;

          // Block Enter for empty input fields to prevent image editor opening
          if (target.tagName === "INPUT" || target.tagName === "TEXTAREA") {
            const inputValue = (target as HTMLInputElement).value?.trim();
            if (!inputValue) {
              e.preventDefault();
              e.stopPropagation();
              return false;
            }
          }
        }
      };

      document.addEventListener("keydown", handleGlobalKeyDown, true);

      return () => {
        document.removeEventListener("keydown", handleGlobalKeyDown, true);
      };
    }

    // Inject custom CSS to hide download button
    if (isVisible) {
      const styleElement = document.createElement("style");
      styleElement.textContent = customStyles;
      styleElement.id = "tui-editor-custom-styles";
      if (!document.getElementById("tui-editor-custom-styles")) {
        document.head.appendChild(styleElement);
      }
    }

    if (isVisible && editorRef.current && !tuiEditorRef.current) {
      tuiEditorRef.current = new ImageEditor(editorRef.current as Element, {
        includeUI: {
          loadImage: {
            path: imageSrc,
            name: "image",
          },
          theme: {
            "common.bi.image": "",
            "common.bisize.width": "0px",
            "common.bisize.height": "0px",
            "common.backgroundImage": "none",
            "common.backgroundColor": "#f3f4f6",
            "common.border": "1px solid #e5e7eb",
          },
          initMenu: "filter",
          menuBarPosition: "bottom",
        },
        cssMaxWidth: 500,
        cssMaxHeight: 400,
        selectionStyle: {
          cornerSize: 20,
          rotatingPointOffset: 70,
        },
      });

      // Hide download button after editor is created
      setTimeout(() => {
        const downloadBtn = document.querySelector(
          ".tui-image-editor-header-buttons .tui-image-editor-download-btn"
        );
        if (downloadBtn) {
          (downloadBtn as HTMLElement).style.display = "none";
        }

        // Also try alternative selectors
        const downloadBtns = document.querySelectorAll(
          '[title="Download"], .tie-btn-download, .tui-image-editor-download'
        );
        downloadBtns.forEach((btn) => {
          (btn as HTMLElement).style.display = "none";
        });
      }, 100);
    }

    return () => {
      document.body.style.overflow = "unset";

      if (tuiEditorRef.current) {
        tuiEditorRef.current.destroy();
        tuiEditorRef.current = null;
      }

      // Clean up custom styles
      const styleElement = document.getElementById("tui-editor-custom-styles");
      if (styleElement) {
        styleElement.remove();
      }
    };
  }, [isVisible, imageSrc]);

  const handleSave = async () => {
    if (!tuiEditorRef.current) return;

    setIsProcessing(true);

    try {
      const dataURL = tuiEditorRef.current.toDataURL();

      // Convert dataURL to blob
      const response = await fetch(dataURL);
      const blob = await response.blob();

      onImageEdited(blob);
      onClose();
    } catch (error) {
      console.error("Error saving image:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  if (!isVisible) return null;

  return (
    <div
      className={clsx(
        "fixed inset-0 z-50 flex items-center justify-center",
        "bg-black/80 bg-opacity-50 "
      )}
    >
      {/* Editor Container */}
      <div
        className={clsx(
          "relative w-full h-full max-w-screen-xl max-h-[95vh]",
          "bg-white rounded-lg shadow-2xl",
          "m-4"
        )}
      >
        {/* Header with Close Button and Save */}
        <div
          className={clsx(
            "absolute top-0 left-0 right-0 z-10",
            "flex justify-between items-center",
            "p-4 bg-white border-b border-gray-200 rounded-t-lg"
          )}
        >
          <h3 className="text-lg font-semibold text-gray-800">Edit Image</h3>
          <div className="flex items-center gap-2">
            <Button
              type="primary"
              onClick={handleSave}
              disabled={isProcessing}
              className={clsx(
                "!bg-rose-600 hover:!bg-rose-700 !border-rose-600",
                "disabled:bg-gray-400 disabled:border-gray-400"
              )}
            >
              Save
            </Button>
            <Button
              type="text"
              icon={<CloseOutlined />}
              onClick={onClose}
              className={clsx(
                "flex items-center justify-center",
                "w-8 h-8 rounded-full",
                "hover:!bg-gray-100 transition-colors"
              )}
            />
          </div>
        </div>

        {/* Editor Content */}
        <div
          className={clsx(
            "w-full h-full pt-16",
            "rounded-b-lg overflow-hidden"
          )}
        >
          <div ref={editorRef} className="w-full h-full" />
        </div>

        {/* Loading Overlay */}
        {isProcessing && (
          <div
            className={clsx(
              "absolute inset-0 z-20",
              "flex items-center justify-center",
              "bg-white bg-opacity-80 rounded-lg"
            )}
          >
            <div className="text-center">
              <div
                className={clsx(
                  "w-8 h-8 border-4 border-rose-600 border-t-transparent",
                  "rounded-full animate-spin mx-auto mb-2"
                )}
              ></div>
              <p className="text-gray-600">Processing image...</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageEditorComponent;
