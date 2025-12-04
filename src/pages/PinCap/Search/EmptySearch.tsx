import React from "react";

import { Search as SearchIcon, Image, Sparkles } from "lucide-react";

const EmptySearch: React.FC = () => {
  const featureItems = [
    {
      icon: Image,
      label: "Image Search",
      className: "bg-rose-50 border-rose-200 text-rose-600",
    },
    {
      icon: SearchIcon,
      label: "Keyword Search",
      className: "bg-pink-50 border-pink-200 text-pink-600",
    },
    {
      icon: Sparkles,
      label: "AI Powered",
      className: "bg-purple-50 border-purple-200 text-purple-600",
    },
  ];

  return (
    <div className="flex items-center justify-center min-h-[500px] px-4">
      <div className="text-center max-w-md">
        <div className="relative mb-6 flex justify-center">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-32 h-32 rounded-full bg-gradient-to-br from-rose-100 to-pink-100 opacity-50 blur-2xl"></div>
          </div>
          <div className="relative flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-br from-rose-50 to-pink-50 border-2 border-rose-200">
            <div className="flex items-center gap-2">
              <SearchIcon className="w-8 h-8 text-rose-600" strokeWidth={2} />
              <Image className="w-6 h-6 text-pink-500" strokeWidth={2} />
            </div>
          </div>
        </div>

        <h2 className="text-2xl font-bold text-gray-900 mb-3">
          Start Your Search
        </h2>

        <p className="text-gray-600 text-base mb-6 leading-relaxed">
          Search for images by uploading a photo or typing keywords to discover
          amazing content
        </p>

        <div className="flex items-center justify-center gap-6 mt-8">
          {featureItems.map((item, index) => {
            const Icon = item.icon;
            return (
              <React.Fragment key={item.label}>
                {index > 0 && <div className="w-px h-12 bg-gray-200"></div>}
                <div className="flex flex-col items-center gap-2">
                  <div
                    className={`w-12 h-12 rounded-lg flex items-center justify-center border ${item.className}`}
                  >
                    <Icon className="w-5 h-5" strokeWidth={2} />
                  </div>
                  <span className="text-xs text-gray-500 font-medium">
                    {item.label}
                  </span>
                </div>
              </React.Fragment>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default EmptySearch;
