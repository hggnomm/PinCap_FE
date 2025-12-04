import { useNavigate } from "react-router-dom";

import { motion } from "framer-motion";

import { ROUTES } from "@/constants/routes";
import { usePopularSearches } from "@/react-query/useSearchMedia";

interface SearchMediaManualProps {
  searchQuery?: string;
  onClose: () => void;
}

const SearchMediaManual = ({
  searchQuery = "",
  onClose,
}: SearchMediaManualProps) => {
  const navigate = useNavigate();
  const { data: popularSearches = [] } = usePopularSearches();

  const handleSearchResultClick = (query: string) => {
    navigate(`${ROUTES.SEARCH}?search=${encodeURIComponent(query)}`);
    onClose();
  };

  return (
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
                View all results for &quot;{searchQuery}&quot;
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
          <div className="text-lg font-semibold mb-4">Popular Searches</div>
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
  );
};

export default SearchMediaManual;

