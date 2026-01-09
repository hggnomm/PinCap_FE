import React, { useEffect } from "react";

import { useNavigate } from "react-router-dom";

import { motion, AnimatePresence } from "framer-motion";
import { Eye } from "lucide-react";

import { AlbumData } from "@/contexts/AlbumToastContext";

interface AlbumSuccessToastProps {
  isVisible: boolean;
  onClose: () => void;
  albumData: AlbumData;
}

const AlbumSuccessToast: React.FC<AlbumSuccessToastProps> = ({
  isVisible,
  onClose,
  albumData,
}) => {
  const navigate = useNavigate();

  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        onClose();
      }, 7000);

      return () => clearTimeout(timer);
    }
  }, [isVisible, onClose]);

  const handleViewAlbum = () => {
    navigate(`/album/${albumData.id}`);
    onClose();
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 100, opacity: 0, scale: 0.8 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          exit={{
            y: 100,
            opacity: 0,
            scale: 0.8,
            transition: {
              duration: 0.4,
              ease: "easeInOut",
            },
          }}
          transition={{
            type: "spring",
            stiffness: 300,
            damping: 25,
            duration: 0.6,
          }}
          className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[199] max-w-[450px] w-[90%] sm:w-[95%]"
        >
          <div className="bg-[#1a1a1a] rounded-xl p-4 shadow-[0_8px_32px_rgba(0,0,0,0.3)] border border-white/10 flex items-center gap-4">
            <div className="flex-1 min-w-0">
              <div className="text-gray-50 text-base font-normal sm:text-base">
                Album Created Successfully
              </div>
              <div className="text-gray-400 text-sm mt-0.5 truncate">
                {albumData.album_name}
              </div>
            </div>
            <motion.div
              className="bg-white cursor-pointer text-black px-3 py-1.5 rounded-md text-sm font-medium hover:bg-gray-100 transition-colors duration-200 flex items-center gap-1.5"
              onClick={handleViewAlbum}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Eye size={14} />
              View
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AlbumSuccessToast;
