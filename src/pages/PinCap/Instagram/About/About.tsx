import React from "react";

import { Link } from "react-router-dom";

import { clsx } from "clsx";

import CarouselHeader, { CarouselBanner } from "@/components/CarouselHeader";
import { ROUTES } from "@/constants/routes";

// Banner image from public folder - Vite serves public files at root path
const banner1 = "/instagram/banner-1.jpg";
const banner2 = "/instagram/banner-2.jpg";
const banner3 = "/instagram/banner-3.jpg";

const About: React.FC = () => {
  const banners: CarouselBanner[] = [
    {
      id: 1,
      image: banner1,
      alt: "Instagram Integration Feature 1",
      link: "#feature1",
    },
    {
      id: 2,
      image: banner2,
      alt: "Instagram Integration Feature 2",
      link: "#feature2",
    },
    {
      id: 3,
      image: banner3,
      alt: "Instagram Integration Feature 3",
      link: "#feature3",
    },
  ];

  const handleBannerClick = (banner: CarouselBanner) => {
    console.log("Banner clicked:", banner);
    // Handle banner click logic here
  };

  const handleLinkClick = () => {
    window.scrollTo(0, 0);
  };

  const syncButtonClassName = clsx(
    "inline-block !bg-primary !text-white !no-underline",
    "font-semibold rounded-lg shadow-md hover:shadow-lg",
    "transition-all duration-200 hover:-translate-y-0.5",
    "md:px-8 md:py-4 px-6 py-3 text-base md:text-lg",
    "hover:!bg-primary/90 cursor-pointer text-center"
  );

  return (
    <div className="">
      <div className="w-full px-4 md:px-6 xl:px-[8.28vw] xl:pt-[3.28vw] py-6">
        {/* Carousel Banner */}
        <CarouselHeader
          banners={banners}
          onBannerClick={handleBannerClick}
          itemClassName="aspect-[1152/300]"
        />

        {/* Sync Button - Top */}
        <div className="w-full md:mt-16 xl:mt-20 flex justify-center">
          <Link
            to={ROUTES.INSTAGRAM_SYNC}
            onClick={handleLinkClick}
            className={syncButtonClassName}
          >
            Go to Sync Page
          </Link>
        </div>

        {/* Content Section */}
        <div className="w-full mt-12">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 md:p-10 lg:p-12">
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-8 md:mb-10">
                About Instagram Integration
              </h1>

              <div className="space-y-10 md:space-y-12">
                <section className="border-b border-gray-100 pb-8 md:pb-10 last:border-b-0">
                  <h2 className="text-2xl md:text-3xl font-semibold text-gray-900 mb-4 md:mb-6">
                    Welcome to Instagram Integration
                  </h2>
                  <p className="text-gray-600 leading-relaxed text-base md:text-lg">
                    Connect your Instagram account and seamlessly sync your
                    photos and videos to PinCap. Our integration makes it easy
                    to import your Instagram content and manage it alongside
                    your other media.
                  </p>
                </section>

                <section className="border-b border-gray-100 pb-8 md:pb-10 last:border-b-0">
                  <h2 className="text-2xl md:text-3xl font-semibold text-gray-900 mb-4 md:mb-6">
                    Features
                  </h2>
                  <ul className="space-y-3 md:space-y-4">
                    <li className="flex items-baseline text-gray-700 text-base md:text-lg">
                      <span className="text-primary mr-3 font-semibold leading-none">
                        •
                      </span>
                      <span className="leading-relaxed">
                        Sync photos and videos from your Instagram account
                      </span>
                    </li>
                    <li className="flex items-baseline text-gray-700 text-base md:text-lg">
                      <span className="text-primary mr-3 font-semibold leading-none">
                        •
                      </span>
                      <span className="leading-relaxed">
                        Automatic organization of imported content
                      </span>
                    </li>
                    <li className="flex items-baseline text-gray-700 text-base md:text-lg">
                      <span className="text-primary mr-3 font-semibold leading-none">
                        •
                      </span>
                      <span className="leading-relaxed">
                        Preserve Instagram metadata and captions
                      </span>
                    </li>
                    <li className="flex items-baseline text-gray-700 text-base md:text-lg">
                      <span className="text-primary mr-3 font-semibold leading-none">
                        •
                      </span>
                      <span className="leading-relaxed">
                        Easy access to all your media in one place
                      </span>
                    </li>
                  </ul>
                </section>

                <section className="border-b border-gray-100 pb-8 md:pb-10 last:border-b-0">
                  <h2 className="text-2xl md:text-3xl font-semibold text-gray-900 mb-4 md:mb-6">
                    How It Works
                  </h2>
                  <div className="space-y-5 md:space-y-6">
                    <div className="flex gap-4 md:gap-5">
                      <span className="flex-shrink-0 w-8 h-8 md:w-10 md:h-10 rounded-full bg-primary/10 text-primary font-bold text-base md:text-lg flex items-center justify-center">
                        1
                      </span>
                      <p className="text-gray-600 leading-relaxed text-base md:text-lg pt-1">
                        Connect your Instagram account through our secure
                        authentication system.
                      </p>
                    </div>
                    <div className="flex gap-4 md:gap-5">
                      <span className="flex-shrink-0 w-8 h-8 md:w-10 md:h-10 rounded-full bg-primary/10 text-primary font-bold text-base md:text-lg flex items-center justify-center">
                        2
                      </span>
                      <p className="text-gray-600 leading-relaxed text-base md:text-lg pt-1">
                        Choose which photos and videos you want to sync to
                        PinCap.
                      </p>
                    </div>
                    <div className="flex gap-4 md:gap-5">
                      <span className="flex-shrink-0 w-8 h-8 md:w-10 md:h-10 rounded-full bg-primary/10 text-primary font-bold text-base md:text-lg flex items-center justify-center">
                        3
                      </span>
                      <p className="text-gray-600 leading-relaxed text-base md:text-lg pt-1">
                        Your content will be automatically imported and
                        organized.
                      </p>
                    </div>
                    <div className="flex gap-4 md:gap-5">
                      <span className="flex-shrink-0 w-8 h-8 md:w-10 md:h-10 rounded-full bg-primary/10 text-primary font-bold text-base md:text-lg flex items-center justify-center">
                        4
                      </span>
                      <p className="text-gray-600 leading-relaxed text-base md:text-lg pt-1">
                        Manage all your media from Instagram and other sources
                        in one unified platform.
                      </p>
                    </div>
                  </div>
                </section>

                <section>
                  <h2 className="text-2xl md:text-3xl font-semibold text-gray-900 mb-4 md:mb-6">
                    Get Started
                  </h2>
                  <p className="text-gray-600 leading-relaxed text-base md:text-lg mb-6">
                    Ready to sync your Instagram content? Connect your account
                    and start importing your media.
                  </p>
                  <Link
                    to={ROUTES.INSTAGRAM_SYNC}
                    onClick={handleLinkClick}
                    className={syncButtonClassName}
                  >
                    Go to Sync Page
                  </Link>
                </section>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
