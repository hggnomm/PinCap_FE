import { AnimatePresence, motion } from "framer-motion";

import SearchMediaByImage from "./SearchMediaByImage";
import SearchMediaManual from "./SearchMediaManual";

interface SearchDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  showImageSearch?: boolean;
}

const SearchDrawer = ({
  isOpen,
  onClose,
  showImageSearch = false,
}: SearchDrawerProps) => {
  const handleOverlayClick = (e: React.MouseEvent) => {
    if (showImageSearch) {
      return;
    }
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed top-[70px] left-0 right-0 bottom-0 bg-black/60 z-40"
            onClick={handleOverlayClick}
            onKeyDown={handleKeyDown}
            tabIndex={-1}
          />

          {/* Drawer */}
          <motion.div
            initial={{ y: -400, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -400, opacity: 0 }}
            transition={{
              type: "spring",
              damping: 25,
              stiffness: 200,
              duration: 0.4,
            }}
            className="fixed top-[70px] left-0 right-0 bg-white shadow-lg z-50"
            style={{ height: "400px" }}
          >
            <div className="!py-6 h-full x-container relative">
              {/* Search Content */}
              {showImageSearch && <SearchMediaByImage onClose={onClose} />}
              {!showImageSearch && <SearchMediaManual onClose={onClose} />}

              {/* Close Button */}
              <div className="absolute top-4 right-4">
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <svg
                    className="w-5 h-5 text-gray-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default SearchDrawer;
