import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { toast } from "react-toastify";
import { addMediasToAlbum } from "@/api/album";
import clsx from "clsx";
import { CreateAlbumModal } from "@/components/modal/album";
import { useAlbum } from "@/react-query/useAlbum";
import { CreateAlbumFormData } from "@/validation";
import { BaseTabs } from "@/components/baseTabs";
import { ALBUM_TABS } from "@/constants/constants";
import { useQueryClient } from "@tanstack/react-query";

// Global state to track which dropdown is open
let currentOpenDropdown: string | null = null;
const dropdownListeners: Map<string, () => void> = new Map();

interface Album {
  id: string;
  album_name: string;
  thumbnail_url?: string;
  image_cover?: string;
  media_count?: number;
  is_media_in_album?: boolean; 
}

interface AlbumDropdownProps {
  mediaId: string;
  componentId?: string;
  trigger: React.ReactNode;
  className?: string;
  position?: "bottom-left" | "bottom-right" | "top-left" | "top-right" | "click";
  onSuccess?: () => void;
  onOpen?: () => void;
  onClose?: () => void;
  onModalOpen?: () => void;
  onModalClose?: () => void;
}

const AlbumDropdown: React.FC<AlbumDropdownProps> = ({
  mediaId,
  componentId: providedId,
  trigger,
  className,
  position = "bottom-right",
  onSuccess,
  onOpen,
  onClose,
  onModalOpen,
  onModalClose,
}) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 });
  const [searchTerm, setSearchTerm] = useState("");
  const [originalClickPosition, setOriginalClickPosition] = useState<{ x: number; y: number } | null>(null);
  const [initialScrollPosition, setInitialScrollPosition] = useState({ x: 0, y: 0 });
  
  // Create album modal states
  const [showCreateModal, setShowCreateModal] = useState(false);
  
  // Use React Query for albums - only fetch when dropdown is open
  const queryClient = useQueryClient();
  const { getAlbumList, getAlbumMemberList, createAlbum, createAlbumLoading } = useAlbum();
  const { data: myAlbumsResponse, isLoading: myAlbumsLoading } = getAlbumList(mediaId, showDropdown);
  const { data: sharedAlbumsResponse, isLoading: sharedAlbumsLoading } = getAlbumMemberList(mediaId, showDropdown);
  
  const myAlbums = myAlbumsResponse?.data ?? [];
  const sharedAlbums = sharedAlbumsResponse?.data ?? [];
  
  const [activeTab, setActiveTab] = useState<string>(ALBUM_TABS.MY_ALBUMS);
  
  // Generate unique component ID
  const componentId = providedId ?? `album-dropdown-${mediaId}-${Math.random().toString(36).substr(2, 9)}`;
  
  const filteredMyAlbums = myAlbums.filter((album: Album) =>
    album.album_name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const filteredSharedAlbums = sharedAlbums.filter((album: Album) =>
    album.album_name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const currentAlbums = activeTab === ALBUM_TABS.MY_ALBUMS ? filteredMyAlbums : filteredSharedAlbums;
  const currentLoading = activeTab === ALBUM_TABS.MY_ALBUMS ? myAlbumsLoading : sharedAlbumsLoading;

  // Register close function and handle global dropdown management
  useEffect(() => {
    const closeDropdown = () => {
      setShowDropdown(false);
      setSearchTerm("");
      setOriginalClickPosition(null);
      setInitialScrollPosition({ x: 0, y: 0 });
      onClose?.();
    };
    
    dropdownListeners.set(componentId, closeDropdown);
    
    return () => {
      dropdownListeners.delete(componentId);
      if (currentOpenDropdown === componentId) {
        currentOpenDropdown = null;
      }
    };
  }, [componentId]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (showDropdown) {
        const target = event.target as HTMLElement;
        
        // Check if click is inside trigger element
        const triggerElement = document.querySelector(`.album-dropdown-trigger-${componentId}`);
        const isInsideTrigger = triggerElement && triggerElement.contains(target);
        
        // Check if click is inside dropdown menu (now rendered in portal)
        const dropdownMenuElements = document.querySelectorAll('.album-dropdown-menu');
        const isInsideDropdown = Array.from(dropdownMenuElements).some(menu => menu.contains(target));
        
        // Check if click is inside any modal (to prevent closing when modal opens)
        const isInsideModal = target.closest('.ant-modal') || target.closest('[role="dialog"]');
        
        // Only close if click is outside both trigger, dropdown, and modals
        if (!isInsideTrigger && !isInsideDropdown && !isInsideModal) {
          // Prevent event from bubbling to other elements
          event.stopPropagation();
          event.preventDefault();
          
          setShowDropdown(false);
          setSearchTerm("");
          setOriginalClickPosition(null);
          setInitialScrollPosition({ x: 0, y: 0 });
          currentOpenDropdown = null;
          onClose?.();
        }
      }
    };

    // Add event listener to document for portal-rendered dropdown
    document.addEventListener('click', handleClickOutside, true);
    return () => {
      document.removeEventListener('click', handleClickOutside, true);
    };
  }, [showDropdown, componentId]);

  // Handle scroll events to reposition dropdown
  useEffect(() => {
    const handleScroll = () => {
      if (showDropdown && originalClickPosition && position === "click") {
        // For click position, maintain the original click position relative to scroll
        const currentScrollX = window.scrollX || document.documentElement.scrollLeft;
        const currentScrollY = window.scrollY || document.documentElement.scrollTop;
        
        const scrollDeltaX = currentScrollX - initialScrollPosition.x;
        const scrollDeltaY = currentScrollY - initialScrollPosition.y;
        
        setDropdownPosition(prev => ({
          top: prev.top + scrollDeltaY,
          left: prev.left + scrollDeltaX
        }));
        
        // Update initial scroll position for next calculation
        setInitialScrollPosition({ x: currentScrollX, y: currentScrollY });
      } else if (showDropdown && position !== "click") {
        // For non-click positions, recalculate based on trigger element
        const triggerElement = document.querySelector(`.album-dropdown-trigger-${componentId}`) as HTMLElement;
        if (triggerElement) {
          const newPosition = calculateDropdownPosition(triggerElement);
          setDropdownPosition(newPosition);
        }
      }
    };

    const handleResize = () => {
      if (showDropdown) {
        const triggerElement = document.querySelector(`.album-dropdown-trigger-${componentId}`) as HTMLElement;
        if (triggerElement) {
          const newPosition = calculateDropdownPosition(triggerElement, 
            position === "click" && originalClickPosition ? 
            { pageX: originalClickPosition.x, pageY: originalClickPosition.y } as React.MouseEvent : 
            undefined
          );
          setDropdownPosition(newPosition);
        }
      }
    };

    if (showDropdown) {
      window.addEventListener('scroll', handleScroll, true);
      window.addEventListener('resize', handleResize);
      
      return () => {
        window.removeEventListener('scroll', handleScroll, true);
        window.removeEventListener('resize', handleResize);
      };
    }
  }, [showDropdown, componentId, position, originalClickPosition, initialScrollPosition]);

  const handleSaveToAlbum = async (albumId: string, albumName: string) => {
    try {
      const response = await addMediasToAlbum({
        album_id: albumId,
        medias_id: [mediaId]
      });
      
      if (response) {
        toast.success(`Media saved to "${albumName}" successfully!`);
        
        queryClient.invalidateQueries({ queryKey: ['albums', mediaId] });
        queryClient.invalidateQueries({ queryKey: ['album-members', mediaId] });
        queryClient.invalidateQueries({ queryKey: ['album', albumId] });
        
        onSuccess?.();
      } else {
        toast.error("Failed to save media to album");
      }
    } catch (error: any) {
      console.error("Error saving media to album:", error);
      
      // Handle specific error cases
      if (error?.response?.status === 422) {
        toast.warning(`Media is already in "${albumName}" album`);
      } else if (error?.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Error saving media to album");
      }
    }
  };

  const handleCreateAlbum = async (data: { album_name: string; privacy: string }) => {
    try {
      const formData: CreateAlbumFormData = {
        album_name: data.album_name,
        privacy: data.privacy as "0" | "1"
      };
      await createAlbum(formData);
      toast.success("Album created successfully!");
      setShowCreateModal(false);
      onModalClose?.();
      // React Query will automatically invalidate and refetch
    } catch (error) {
      console.error("Error creating album:", error);
      toast.error("Error creating album");
    }
  };

  const handleCreateModalCancel = () => {
    setShowCreateModal(false);
    onModalClose?.();
  };

  const calculateDropdownPosition = (triggerElement: HTMLElement, clickEvent?: React.MouseEvent) => {
    const rect = triggerElement.getBoundingClientRect();
    const dropdownWidth = 350;
    const dropdownHeight = 400;
    const margin = 8;
    const scrollY = window.scrollY || document.documentElement.scrollTop;
    const scrollX = window.scrollX || document.documentElement.scrollLeft;
    
    let top: number;
    let left: number;
    
    // If position is "click", use click coordinates
    if (position === "click" && clickEvent) {
      // Use page coordinates (including scroll)
      top = clickEvent.pageY + margin;
      left = clickEvent.pageX - dropdownWidth / 2; // Center dropdown on click
    } else {
      // Default positioning based on trigger element (convert to page coordinates)
      top = rect.bottom + scrollY + margin;
      left = rect.left + scrollX;
      
      // Position based on prop
      switch (position) {
        case "bottom-right":
          left = rect.right + scrollX - dropdownWidth;
          break;
        case "bottom-left":
          left = rect.left + scrollX;
          break;
        case "top-right":
          top = rect.top + scrollY - dropdownHeight - margin;
          left = rect.right + scrollX - dropdownWidth;
          break;
        case "top-left":
          top = rect.top + scrollY - dropdownHeight - margin;
          left = rect.left + scrollX;
          break;
      }
    }
    
    // Adjust if dropdown would go off screen horizontally
    if (left < margin + scrollX) {
      left = margin + scrollX;
    }
    if (left + dropdownWidth > window.innerWidth + scrollX - margin) {
      left = window.innerWidth + scrollX - dropdownWidth - margin;
    }
    
    // Adjust if dropdown would go off screen vertically
    if (top + dropdownHeight > window.innerHeight + scrollY - margin) {
      // Try to position above the trigger or click point
      if (position === "click" && clickEvent) {
        top = clickEvent.pageY - dropdownHeight - margin;
      } else {
        top = rect.top + scrollY - dropdownHeight - margin;
      }
    }
    
    // Ensure dropdown doesn't go above viewport
    if (top < margin + scrollY) {
      if (position === "click" && clickEvent) {
        top = clickEvent.pageY + margin;
      } else {
        top = rect.bottom + scrollY + margin;
      }
    }
    
    return { top, left };
  };

  const handleTriggerClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    
    // Close any other open dropdowns first
    if (currentOpenDropdown && currentOpenDropdown !== componentId) {
      const closeFunction = dropdownListeners.get(currentOpenDropdown);
      if (closeFunction) {
        closeFunction();
      }
    }
    
    // Only open dropdown if it's not already open
    if (!showDropdown) {
      const triggerElement = e.currentTarget as HTMLElement;
      
      // Store original click position and scroll position for click positioning
      if (position === "click") {
        setOriginalClickPosition({ x: e.pageX, y: e.pageY });
        setInitialScrollPosition({ 
          x: window.scrollX || document.documentElement.scrollLeft,
          y: window.scrollY || document.documentElement.scrollTop
        });
      }
      
      // Pass the click event only if position is "click"
      const calculatedPosition = calculateDropdownPosition(
        triggerElement, 
        position === "click" ? e : undefined
      );
      setDropdownPosition(calculatedPosition);
      
      // React Query will handle the data fetching automatically
      setShowDropdown(true);
      currentOpenDropdown = componentId;
      onOpen?.();
    }
    // Note: We don't close the dropdown here when it's already open
    // It will only close when clicking outside both trigger and dropdown
  };

  return (
    <>
      <div 
        className={clsx(`album-dropdown-trigger-${componentId}`, className)}
        onClick={handleTriggerClick}
      >
        {trigger}
      </div>

      {showDropdown && createPortal(
        <div 
          className="album-dropdown-menu min-h-[430px] absolute w-80 bg-white border border-gray-200 rounded-lg shadow-xl z-[9999] max-h-96 flex flex-col"
          style={{
            top: `${dropdownPosition.top}px`,
            left: `${dropdownPosition.left}px`,
            width: '350px', // Match original design
            position: 'absolute',
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="p-4 border-b border-gray-100 flex-shrink-0">
            <h3 className="text-base font-semibold text-gray-900 text-center">Album</h3>
          </div>
          
          {/* Search */}
          <div className="p-3 border-b border-gray-100 flex-shrink-0">
            <input
              type="text"
              placeholder="Search album..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onClick={(e) => e.stopPropagation()}
              onFocus={(e) => e.stopPropagation()}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent"
            />
          </div>
          
          <div className="flex-shrink-0 border-b border-gray-100">
            <BaseTabs
              activeKey={activeTab}
              onChange={setActiveTab}
              items={[
                {
                  key: ALBUM_TABS.MY_ALBUMS,
                  label: ALBUM_TABS.MY_ALBUMS,
                },
                {
                  key: ALBUM_TABS.SHARED_ALBUMS,
                  label: ALBUM_TABS.SHARED_ALBUMS,
                },
              ]}
            />
          </div>
          
          {/* Content */}
          <div className="flex-1 overflow-y-auto custom-scroll-bar">
            {currentLoading && (
              <div className="p-4 text-center">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-rose-600 mx-auto"></div>
                <p className="text-sm text-gray-500 mt-2">Loading albums...</p>
              </div>
            )}
            
            {!currentLoading && currentAlbums.length > 0 && (
              <div className="py-2">
                {currentAlbums.map((album: Album) => (
                  <div
                    key={album.id}
                    className={clsx(
                      "px-3 py-3 transition-colors duration-150 flex items-center justify-between",
                      album.is_media_in_album 
                        ? "bg-gray-50 cursor-default" 
                        : "hover:bg-gray-50 cursor-pointer"
                    )}
                    onClick={(e) => {
                      e.stopPropagation();
                      if (!album.is_media_in_album) {
                        handleSaveToAlbum(album.id, album.album_name);
                      }
                    }}
                  >
                    <div className="flex items-center space-x-3 flex-1 min-w-0">
                      {(album.thumbnail_url || album.image_cover) && (
                        <img
                          src={album.thumbnail_url || album.image_cover}
                          alt={album.album_name}
                          className="w-14 h-14 !rounded-md object-cover flex-shrink-0"
                        />
                      )}
                      {!(album.thumbnail_url || album.image_cover) && (
                        <div className="w-14 h-14 bg-gray-200 rounded-md flex items-center justify-center flex-shrink-0">
                          <span className="text-center text-gray-400 text-xs">No Image</span>
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {album.album_name}
                        </p>
                      </div>
                    </div>
                    {album.is_media_in_album ? (
                      <div className="flex items-center space-x-1 text-green-600 flex-shrink-0">
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                      </div>
                    ) : (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSaveToAlbum(album.id, album.album_name);
                        }}
                        className="px-3 py-1.5 bg-rose-600 text-white text-sm rounded-md hover:bg-rose-700 transition-colors duration-150 flex-shrink-0"
                      >
                        Save
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
            
            {!currentLoading && currentAlbums.length === 0 && (
              <div className="p-4 text-center">
                {searchTerm && (
                  <>
                    <p className="text-sm text-gray-500">No albums found for "{searchTerm}"</p>
                  </>
                )}
                {!searchTerm && activeTab === ALBUM_TABS.MY_ALBUMS && (
                  <>
                    <p className="text-sm text-gray-500">No albums found</p>
                    <p className="text-xs text-gray-400 mt-1">Create an album first to save media</p>
                  </>
                )}
                {!searchTerm && activeTab === ALBUM_TABS.SHARED_ALBUMS && (
                  <>
                    <p className="text-sm text-gray-500">No shared albums</p>
                    <p className="text-xs text-gray-400 mt-1">Albums shared with you will appear here</p>
                  </>
                )}
              </div>
            )}
          </div>
          
          {/* Create Album Button */}
          <div className="p-3 border-t border-gray-100 flex-shrink-0">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowCreateModal(true);
                // Hide dropdown when opening create modal
                setShowDropdown(false);
                setSearchTerm("");
                setOriginalClickPosition(null);
                setInitialScrollPosition({ x: 0, y: 0 });
                currentOpenDropdown = null;
                onClose?.();
                onModalOpen?.();
              }}
              className="w-full flex items-center justify-center space-x-2 !px-4 !py-3 !bg-gray-50 hover:!bg-blue-500 text-gray-700 hover:!text-white rounded-md transition-colors duration-300"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              <span className="text-sm font-medium">Create Album</span>
            </button>
          </div>
        </div>,
        document.body
      )}
      
      <CreateAlbumModal
        visible={showCreateModal}
        onCancel={handleCreateModalCancel}
        onConfirm={handleCreateAlbum}
        loading={createAlbumLoading}
      />
    </>
  );
};

export default AlbumDropdown;

