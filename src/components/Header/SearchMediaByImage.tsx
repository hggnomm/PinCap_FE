import { useRef, useState } from "react";

import { useNavigate } from "react-router-dom";

import { clsx } from "clsx";

import { UploadOutlined } from "@ant-design/icons";

import { ROUTES } from "@/constants/routes";

interface SearchMediaByImageProps {
  onClose?: () => void;
}

const SearchMediaByImage = ({ onClose }: SearchMediaByImageProps) => {
  const navigate = useNavigate();
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const processImage = (file: File) => {
    if (!file.type.startsWith("image/")) {
      return;
    }

    navigate(ROUTES.SEARCH, {
      state: { searchImage: file },
    });
    onClose?.();
  };

  const handleFileSelect = (file: File) => {
    processImage(file);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-8">
      <div className="w-full max-w-2xl">
        <div
          className={clsx(
            "border-2 border-dashed rounded-lg p-12 text-center transition-colors cursor-pointer",
            isDragging
              ? "border-rose-600 bg-rose-50"
              : "border-gray-300 hover:border-rose-600"
          )}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleInputChange}
            className="hidden"
          />
          <UploadOutlined className="text-5xl text-gray-400 mb-4" />
          <p className="text-gray-600 mb-2">
            Drag and drop an image here, or click to browse
          </p>
          <p className="text-gray-500 text-sm">
            Upload an image to search for similar content
          </p>
        </div>
      </div>
    </div>
  );
};

export default SearchMediaByImage;
