"use client"

import React, { useState } from "react"
import ModalComponent from "@/components/modal/ModalComponent"
import type { Media } from "@/types/type"
import clsx from "clsx"

interface MediaThumbnailSelectorProps {
  visible: boolean
  medias: Media[]
  selectedMediaUrl?: string
  onCancel: () => void
  onConfirm: (mediaUrl: string) => void
  title?: string
}

const MediaThumbnailSelector: React.FC<MediaThumbnailSelectorProps> = ({
  visible,
  medias,
  selectedMediaUrl,
  onCancel,
  onConfirm,
  title = "Select Album Thumbnail",
}) => {
  const [tempSelectedUrl, setTempSelectedUrl] = useState<string>(selectedMediaUrl || "")

  // Reset temp selection when modal opens/closes
  React.useEffect(() => {
    if (visible) {
      setTempSelectedUrl(selectedMediaUrl || "")
    }
  }, [visible, selectedMediaUrl])

  const handleConfirm = () => {
    if (tempSelectedUrl) {
      onConfirm(tempSelectedUrl)
    }
    onCancel() // Close modal
  }

  const handleMediaClick = (mediaUrl: string) => {
    setTempSelectedUrl(mediaUrl)
  }

  // Filter only image medias
  const imageMedias = medias.filter((media) => media.type === "IMAGE")

  return (
    <ModalComponent
      title={title}
      visible={visible}
      onCancel={onCancel}
      onConfirm={handleConfirm}
      buttonLabels={{
        confirmLabel: "Select Thumbnail",
        cancelLabel: "Cancel",
      }}
      className="!w-[800px]"
    >
      <div
        className="media-thumbnail-selector"
        style={{
          background: "hsl(var(--background))",
          color: "hsl(var(--foreground))",
        }}
      >
        {imageMedias.length === 0 ? (
          <div
            className="text-center py-12"
            style={{
              background: "linear-gradient(135deg, hsl(var(--card)) 0%, hsl(var(--muted)) 100%)",
              borderRadius: "var(--radius)",
              border: "1px solid hsl(var(--border))",
            }}
          >
            <div className="text-6xl mb-4 opacity-40" style={{ color: "hsl(var(--muted-foreground))" }}>
              📷
            </div>
            <h3 className="text-xl font-semibold mb-2" style={{ color: "hsl(var(--foreground))" }}>
              No images available
            </h3>
            <p className="text-sm opacity-70" style={{ color: "hsl(var(--muted-foreground))" }}>
              Add some images to this album to set as thumbnail
            </p>
          </div>
        ) : (
          <>
            <div className="mb-6">
              <p className="text-sm font-medium mb-2" style={{ color: "hsl(var(--foreground))" }}>
                Choose your album thumbnail
              </p>
              <p className="text-xs opacity-70" style={{ color: "hsl(var(--muted-foreground))" }}>
                Select an image that best represents your album
              </p>
            </div>

            <div
              className="grid grid-cols-4 gap-4 max-h-96 overflow-y-auto pr-2"
              style={{
                scrollbarWidth: "thin",
                scrollbarColor: "hsl(var(--border)) transparent",
              }}
            >
              {imageMedias.map((media) => (
                <div
                  key={media.id}
                  className={clsx(
                    "relative cursor-pointer rounded-xl overflow-hidden transition-all duration-300",
                  )}
                  onClick={() => handleMediaClick(media.media_url)}
                  style={{
                    border:
                      tempSelectedUrl === media.media_url
                        ? "2px solid hsl(var(--primary))"
                        : "2px solid hsl(var(--border))",
                    boxShadow:
                      tempSelectedUrl === media.media_url
                        ? "0 0 20px hsla(var(--primary), 0.3)"
                        : "0 4px 12px hsla(0, 0%, 0%, 0.1)",
                    background: "hsl(var(--card))",
                  }}
                >
                  <div className="aspect-square relative">
                    <img
                      src={media.media_url || "/placeholder.svg"}
                      alt={media.media_name}
                      className="w-full h-full object-cover"
                      style={{
                        filter: tempSelectedUrl === media.media_url ? "brightness(1.1)" : "brightness(0.95)",
                      }}
                    />

                    {/* Hover overlay */}
                    <div
                      className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                      style={{
                        background:
                          "linear-gradient(135deg, hsla(var(--primary), 0.1) 0%, hsla(var(--accent), 0.1) 100%)",
                      }}
                    />
                  </div>

                  {/* Selection indicator */}
                  {tempSelectedUrl === media.media_url && (
                    <div
                      className="absolute inset-0 flex items-center justify-center"
                      style={{
                        background: "hsla(var(--primary), 0.15)",
                      }}
                    >
                      <div
                        className="rounded-full w-10 h-10 flex items-center justify-center shadow-lg"
                        style={{
                          background: "linear-gradient(135deg, hsl(var(--primary)) 0%, hsl(var(--accent)) 100%)",
                          color: "hsl(var(--primary-foreground))",
                        }}
                      >
                        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                    </div>
                  )}

                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </ModalComponent>
  )
}

export default MediaThumbnailSelector
