import { useEffect, useState } from "react";

import { useLocation, useNavigate } from "react-router-dom";

import {
  CameraOutlined,
  CloseCircleFilled,
  SearchOutlined,
} from "@ant-design/icons";

import { Input } from "antd";

import InfoTooltip from "@/components/Tooltip/InfoTooltip";
import { ROUTES } from "@/constants/routes";

interface HeaderSearchBarProps {
  onSearchDrawerOpen: () => void;
  onImageSearchOpen: () => void;
  onSearchDrawerClose: () => void;
}

export default function HeaderSearchBar({
  onSearchDrawerOpen,
  onImageSearchOpen,
  onSearchDrawerClose,
}: HeaderSearchBarProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState("");

  // Clear search query when navigating to home
  useEffect(() => {
    if (location.pathname === ROUTES.PINCAP_HOME) {
      setSearchQuery("");
    }
  }, [location.pathname]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleSearchFocus = () => {
    onSearchDrawerOpen();
  };

  const handleSearchEnter = () => {
    if (searchQuery.trim()) {
      navigate(
        `${ROUTES.SEARCH}?search=${encodeURIComponent(searchQuery.trim())}`
      );
      onSearchDrawerClose();
    }
  };

  const handleClearSearch = () => {
    setSearchQuery("");
  };

  const handleImageSearchClick = () => {
    onImageSearchOpen();
  };

  const handleSearchIconClick = () => {
    if (searchQuery.trim()) {
      navigate(
        `${ROUTES.SEARCH}?search=${encodeURIComponent(searchQuery.trim())}`
      );
    } else {
      navigate(ROUTES.SEARCH);
    }
    onSearchDrawerClose();
  };
  return (
    <div className="search-bar">
      <Input
        placeholder="Search..."
        suffix={
          <div className="flex items-center gap-4">
            {searchQuery && (
              <CloseCircleFilled
                onClick={handleClearSearch}
                className="cursor-pointer text-[18px] text-rose-600 hover:!text-rose-700 transition-all duration-300"
              />
            )}
            <SearchOutlined
              onClick={handleSearchIconClick}
              className="cursor-pointer text-[18px] text-rose-600 hover:!text-rose-700 transition-all duration-300"
            />
            <InfoTooltip
              title="Search by uploading an image"
              placement="bottom"
              className="cursor-pointer !m-0"
            >
              <CameraOutlined
                onClick={handleImageSearchClick}
                className="text-[18px] text-rose-600 hover:!text-rose-700 transition-all duration-300"
              />
            </InfoTooltip>
          </div>
        }
        value={searchQuery}
        onChange={handleSearchChange}
        onFocus={handleSearchFocus}
        onPressEnter={handleSearchEnter}
        className="cursor-pointer header-search-input"
      />
    </div>
  );
}
