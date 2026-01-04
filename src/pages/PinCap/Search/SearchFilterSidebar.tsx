import React from "react";

import { clsx } from "clsx";

import { Button } from "antd";

import { SearchFilterType } from "@/hooks/useSearch";

interface SearchFilterSidebarProps {
  selectedFilter: SearchFilterType;
  onFilterChange: (filter: SearchFilterType) => void;
  onApply: () => void;
  onReset: () => void;
}

const SearchFilterSidebar: React.FC<SearchFilterSidebarProps> = ({
  selectedFilter,
  onFilterChange,
  onApply,
  onReset,
}) => {
  const filterOptions: { value: SearchFilterType; label: string }[] = [
    { value: "all_media", label: "All Medias" },
    { value: "albums", label: "Albums" },
    { value: "profiles", label: "Profiles" },
  ];

  return (
    <div className="w-[300px] bg-transparent h-[calc(100vh-100px)] flex flex-col sticky top-4 self-start">
      <div>
        <h2 className="text-lg font-bold text-gray-900 mb-4">Filters</h2>

        <div className="space-y-3">
          {filterOptions.map((option) => (
            <label
              key={option.value}
              className={clsx(
                "flex items-center cursor-pointer p-2 rounded-md transition-colors",
                "hover:bg-gray-50",
                selectedFilter === option.value && "bg-rose-50"
              )}
            >
              <input
                type="radio"
                name="searchFilter"
                value={option.value}
                checked={selectedFilter === option.value}
                onChange={() => onFilterChange(option.value)}
                className="w-4 h-4 text-rose-600 border-gray-300 cursor-pointer"
              />
              <span
                className={clsx(
                  "ml-3 text-base font-medium",
                  selectedFilter === option.value
                    ? "text-rose-600"
                    : "text-gray-700"
                )}
              >
                {option.label}
              </span>
            </label>
          ))}
        </div>
      </div>

      <div className="flex gap-2 pt-4 border-t border-gray-200 mt-auto">
        <Button
          onClick={onReset}
          className="flex-1 !rounded-[25px] !px-4 !py-4 !h-auto !border-2 !border-gray-300 !text-gray-900 !font-semibold hover:!border-rose-600 hover:!text-rose-600"
          size="large"
        >
          Reset
        </Button>
        <Button
          onClick={onApply}
          className="flex-1 !rounded-[25px] !px-4 !py-4 !h-auto !border-2 !text-white !font-semibold !bg-[#a25772] !border-[#a25772] hover:!bg-[#8b4a63] hover:!border-[#8b4a63]"
          size="large"
        >
          Apply
        </Button>
      </div>
    </div>
  );
};

export default SearchFilterSidebar;
