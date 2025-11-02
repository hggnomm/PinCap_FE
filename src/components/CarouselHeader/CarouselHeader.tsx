import React from "react";

import { clsx } from "clsx";
import { Autoplay, Pagination, Navigation } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

export interface CarouselBanner {
  id: string | number;
  image: string;
  alt?: string;
  link?: string;
}

interface CarouselHeaderProps {
  banners: CarouselBanner[];
  className?: string;
  itemClassName?: string;
  onBannerClick?: (banner: CarouselBanner) => void;
}

const CarouselHeader: React.FC<CarouselHeaderProps> = ({
  banners,
  className,
  itemClassName,
  onBannerClick,
}) => {
  const handleSlideClick = (banner: CarouselBanner) => {
    if (onBannerClick) {
      onBannerClick(banner);
    } else if (banner.link) {
      window.open(banner.link, "_blank");
    }
  };

  if (!banners || banners.length === 0) {
    return null;
  }

  return (
    <div
      className={clsx(
        "w-full relative mb-6 md:mb-6 carousel-header-container",
        className
      )}
    >
      <Swiper
        modules={[Autoplay, Pagination, Navigation]}
        slidesPerView={1}
        spaceBetween={16}
        autoplay={{
          delay: 4000,
          disableOnInteraction: false,
          pauseOnMouseEnter: true,
        }}
        pagination={{
          clickable: true,
          dynamicBullets: false,
        }}
        navigation={false}
        loop={banners.length > 1}
        style={
          {
            "--swiper-pagination-color": "#ffffff",
            "--swiper-theme-color": "#ffffff",
          } as React.CSSProperties
        }
        className={clsx(
          "w-full overflow-hidden",
          "carousel-header-swiper",
          itemClassName
        )}
      >
        {banners.map((banner) => (
          <SwiperSlide
            key={banner.id}
            className={clsx(
              "w-full flex items-center justify-center",
              itemClassName
            )}
            style={{
              transform: "translateZ(0)",
              willChange: "transform",
              backfaceVisibility: "hidden",
            }}
          >
            <div
              className={clsx(
                "w-full h-full cursor-pointer relative overflow-hidden",
                "hover:opacity-95 transition-opacity duration-300",
                "focus:outline-none focus:ring-2 focus:ring-[rgba(158,184,217,0.6)] focus:ring-offset-2"
              )}
              onClick={() => handleSlideClick(banner)}
              role={banner.link || onBannerClick ? "button" : undefined}
              tabIndex={banner.link || onBannerClick ? 0 : undefined}
              onKeyDown={(e) => {
                if (
                  (e.key === "Enter" || e.key === " ") &&
                  (banner.link || onBannerClick)
                ) {
                  e.preventDefault();
                  handleSlideClick(banner);
                }
              }}
            >
              <img
                src={banner.image}
                alt={banner.alt || `Banner ${banner.id}`}
                className="w-full h-full block object-cover rounded-[10px]"
                loading="lazy"
                style={{
                  transform: "translateZ(0)",
                  willChange: "transform",
                  backfaceVisibility: "hidden",
                  WebkitFontSmoothing: "antialiased",
                  imageRendering: "auto",
                }}
              />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default CarouselHeader;
