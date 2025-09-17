import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { addMediasToAlbum } from "@/api/album";
import clsx from "clsx";
import { CreateAlbumModal } from "@/components/modal/album";
import { useAlbum } from "@/hooks/useAlbum";
import { CreateAlbumFormData } from "@/validation";

// Global state to track which dropdown is open
let currentOpenDropdown: string | null = null;
const dropdownListeners: Map<string, () => void> = new Map();

interface Album {
  id: string;
  album_name: string;
  thumbnail_url?: string;
  image_cover?: string;
  media_count?: number;
}

interface AlbumDropdownProps {
  mediaId: string;
  componentId?: string;
  trigger: React.ReactNode;
  className?: string;
  position?: "bottom-left" | "bottom-right" | "top-left" | "top-right";
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
  
  // Create album modal states
  const [showCreateModal, setShowCreateModal] = useState(false);
  
  // Use React Query for albums
  const { getAlbumList, createAlbum, createAlbumLoading } = useAlbum();
  const { data: albumsResponse, isLoading: loading, refetch } = getAlbumList();
  const albums = albumsResponse?.data || [];
  
  // Generate unique component ID
  const componentId = providedId || `album-dropdown-${mediaId}-${Math.random().toString(36).substr(2, 9)}`;
  
  // Filter albums based on search term
  const filteredAlbums = albums.filter((album: Album) =>
    album.album_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Register close function and handle global dropdown management
  useEffect(() => {
    const closeDropdown = () => {
      setShowDropdown(false);
      setSearchTerm("");
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
        
        // Check if click is inside dropdown menu
        const dropdownMenuElements = document.querySelectorAll('.album-dropdown-menu');
        const isInsideDropdown = Array.from(dropdownMenuElements).some(menu => menu.contains(target));
        
        // Only close if click is outside both trigger and dropdown
        if (!isInsideTrigger && !isInsideDropdown) {
          setShowDropdown(false);
          setSearchTerm("");
          currentOpenDropdown = null;
          onClose?.();
        }
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [showDropdown, componentId]);


  const handleSaveToAlbum = async (albumId: string, albumName: string) => {
    try {
      const response = await addMediasToAlbum({
        album_id: albumId,
        medias_id: [mediaId]
      });
      
      if (response) {
        toast.success(`Media saved to "${albumName}" successfully!`);
        setShowDropdown(false);
        setSearchTerm("");
        currentOpenDropdown = null;
        onClose?.();
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

  const calculateDropdownPosition = (triggerElement: HTMLElement) => {
    const rect = triggerElement.getBoundingClientRect();
    const dropdownWidth = 350; // Based on the original design
    const dropdownHeight = 400; // Approximate max height
    const margin = 8;
    
    let top = rect.bottom + margin;
    let left = rect.left;
    
    // Position based on prop
    switch (position) {
      case "bottom-right":
        left = rect.right - dropdownWidth;
        break;
      case "bottom-left":
        left = rect.left;
        break;
      case "top-right":
        top = rect.top - dropdownHeight - margin;
        left = rect.right - dropdownWidth;
        break;
      case "top-left":
        top = rect.top - dropdownHeight - margin;
        left = rect.left;
        break;
    }
    
    // Adjust if dropdown would go off screen
    if (left < margin) {
      left = margin;
    }
    if (left + dropdownWidth > window.innerWidth - margin) {
      left = window.innerWidth - dropdownWidth - margin;
    }
    
    if (top + dropdownHeight > window.innerHeight - margin) {
      top = rect.top - dropdownHeight - margin;
    }
    if (top < margin) {
      top = rect.bottom + margin;
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
      const position = calculateDropdownPosition(triggerElement);
      setDropdownPosition(position);
      
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

      {showDropdown && (
        <div 
          className="album-dropdown-menu fixed w-80 bg-white border border-gray-200 rounded-lg shadow-xl z-[9999] max-h-96 flex flex-col"
          style={{
            top: `${dropdownPosition.top}px`,
            left: `${dropdownPosition.left}px`,
            width: '350px', // Match original design
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
          
          {/* Content */}
          <div className="flex-1 overflow-y-auto">
            {loading && (
              <div className="p-4 text-center">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-rose-600 mx-auto"></div>
                <p className="text-sm text-gray-500 mt-2">Loading albums...</p>
              </div>
            )}
            
            {!loading && filteredAlbums.length > 0 && (
              <div className="py-2">
                {filteredAlbums.map((album: Album) => (
                  <div
                    key={album.id}
                    className="px-4 py-3 hover:bg-gray-50 cursor-pointer transition-colors duration-150 flex items-center justify-between"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSaveToAlbum(album.id, album.album_name);
                    }}
                  >
                    <div className="flex items-center space-x-3 flex-1 min-w-0">
                      {(album.thumbnail_url || album.image_cover) && (
                        <img
                          src={album.thumbnail_url || album.image_cover}
                          alt={album.album_name}
                          className="w-12 h-12 rounded-lg object-cover flex-shrink-0"
                        />
                      )}
                      {!(album.thumbnail_url || album.image_cover) && (
                        <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center flex-shrink-0">
                          <span className="text-center text-gray-400 text-xs">No Image</span>
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {album.album_name}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSaveToAlbum(album.id, album.album_name);
                      }}
                      className="px-3 py-1.5 bg-rose-600 text-white text-sm rounded-md hover:bg-rose-700 transition-colors duration-150 flex-shrink-0"
                    >
                      Save
                    </button>
                  </div>
                ))}
              </div>
            )}
            
            {!loading && filteredAlbums.length === 0 && (
              <div className="p-4 text-center">
                {searchTerm && (
                  <>
                    <p className="text-sm text-gray-500">No albums found for "{searchTerm}"</p>
                  </>
                )}
                {!searchTerm && (
                  <>
                    <p className="text-sm text-gray-500">No albums found</p>
                    <p className="text-xs text-gray-400 mt-1">Create an album first to save media</p>
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
                currentOpenDropdown = null;
                onClose?.();
                onModalOpen?.();
              }}
              className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-gray-50 hover:bg-gray-100 text-gray-700 rounded-md transition-colors duration-150"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              <span className="text-sm font-medium">Create Album</span>
            </button>
          </div>
        </div>
      )}
      
      {/* Create Album Modal */}
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
