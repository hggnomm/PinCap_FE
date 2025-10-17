import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "@/constants/routes";
import clsx from "clsx";
import "./NotFound.less";

export default function NotFound() {
  const navigate = useNavigate();
  const [isHoveringHome, setIsHoveringHome] = useState(false);
  const [isHoveringSupport, setIsHoveringSupport] = useState(false);

  return (
    <div className="min-h-screen flex items-center justify-center !p-4 bg-[var(--background)]">
      <div className="w-full max-w-2xl">
        <div className="flex flex-col items-center justify-center text-center space-y-8">
          
          {/* 404 Image Section */}
          <div className="w-full !mb-4 animate-float">
            <img
              src="/404-error-page-not-found-illustration.jpg"
              alt="404 Page Not Found"
              className="w-full max-w-sm mx-auto object-contain rounded-2xl shadow-[0_0_30px_rgba(236,72,153,0.2)]"
            />
          </div>

          {/* Error Code */}
          <div className="text-[120px] font-black leading-none bg-gradient-to-br from-[var(--primary)] to-[var(--secondary)] bg-clip-text text-transparent">
            404
          </div>

          {/* Title */}
          <div className="space-y-3">
            <h1 className="text-4xl md:text-5xl font-bold text-[var(--foreground)]">
              Page Not Found
            </h1>
            <p className="text-lg md:text-xl text-[var(--foreground)] opacity-80">
              Oops! The page you're looking for doesn't exist or has been moved.
            </p>
          </div>

          {/* Description */}
          <p className="text-base md:text-lg max-w-md text-[var(--foreground)] opacity-70">
            Don't worry, we'll help you get back on track. Use the buttons below to navigate to a better place.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 !pt-4">
            <button
              onClick={() => navigate(ROUTES.HOME)}
              onMouseEnter={() => setIsHoveringHome(true)}
              onMouseLeave={() => setIsHoveringHome(false)}
              className={clsx(
                "!px-8 !py-3 !rounded-lg !font-semibold !text-base !transition-all !duration-300 !text-white !bg-[var(--primary)] !border-0 !outline-none hover:!bg-[var(--secondary)]",
                {
                  "-translate-y-0.5 shadow-[0_8px_16px_rgba(212,35,100,0.3)]": isHoveringHome,
                }
              )}
            >
              Go Home
            </button>
            
            <button
              onClick={() => navigate(ROUTES.LOGIN)}
              onMouseEnter={() => setIsHoveringSupport(true)}
              onMouseLeave={() => setIsHoveringSupport(false)}
              className={clsx(
                "!px-8 !py-3 !rounded-lg !font-semibold !text-base !transition-all !duration-300 !border-2 !border-[var(--accent)] !text-[var(--accent)] !bg-transparent !outline-none hover:!bg-[var(--accent)] hover:!text-white",
                {
                  "-translate-y-0.5": isHoveringSupport,
                }
              )}
            >
              Contact Support
            </button>
          </div>

          {/* Additional Info */}
          <div className="!pt-8 border-t border-[var(--primary)] border-opacity-20 w-full">
            <p className="text-sm text-[var(--foreground)] opacity-60">
              Error Code: <span className="font-mono font-semibold">404</span> | {" "}
              <button 
                onClick={() => navigate(ROUTES.HOME)}
                className="!underline hover:!no-underline text-[var(--accent)] !bg-transparent !border-0 !p-0"
              >
                Back to Home
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

