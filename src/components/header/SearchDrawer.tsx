import { AnimatePresence, motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "../../constants/routes";
import { usePopularSearches } from "../../react-query";

interface SearchDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

const SearchDrawer = ({
  isOpen,
  onClose,
  searchQuery,
  onSearchChange,
}: SearchDrawerProps) => {
  const navigate = useNavigate();
  const { data: popularSearches = [] } = usePopularSearches();

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      onClose();
    }
  };

  const handleSearchResultClick = (query: string) => {
    // Navigate to search page with query
    navigate(`${ROUTES.SEARCH}?search=${encodeURIComponent(query)}`);
    onClose();
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
            <div className="!py-6 h-full x-container">
              {/* Search Content */}
              <div className="flex-1">
                {searchQuery && (
                  <div>
                    <div className="text-lg font-semibold mb-4">
                      Search results for &quot;{searchQuery}&quot;
                    </div>
                    <div className="space-y-3">
                      {/* Mock search results */}
                      <div
                        className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer"
                        onClick={() => handleSearchResultClick(searchQuery)}
                      >
                        <div className="font-medium">
                          View all results for "{searchQuery}"
                        </div>
                        <p className="text-gray-600 text-sm">
                          Click to see all search results for this query.
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {!searchQuery && (
                  <div>
                    <div className="text-lg font-semibold mb-4">
                      Popular Searches
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      {popularSearches.map((item, index) => (
                        <motion.div
                          key={item}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer text-center"
                          onClick={() => handleSearchResultClick(item)}
                        >
                          <span className="text-sm font-medium">{item}</span>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

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
