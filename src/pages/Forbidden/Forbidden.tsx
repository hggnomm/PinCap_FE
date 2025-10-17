import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "@/constants/routes";
import clsx from "clsx";
import "./Forbidden.less";

export default function Forbidden() {
  const navigate = useNavigate();
  const [isHoveringHome, setIsHoveringHome] = useState(false);
  const [isHoveringSupport, setIsHoveringSupport] = useState(false);

  return (
    <div className="min-h-screen flex items-center justify-center !p-4 bg-[var(--background)]">
      <div className="w-full max-w-2xl">
        <div className="flex flex-col items-center justify-center text-center space-y-8">
          {/* 403 Image Section */}
          <div className="w-full !mb-4 animate-float">
            <div className="w-full max-w-sm mx-auto rounded-2xl shadow-[0_0_30px_rgba(236,72,153,0.2)]">
            <svg
              viewBox="0 0 800 600"
              className="w-full h-full"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Background circles */}
              <circle cx="400" cy="300" r="200" fill="#fee2e2" opacity="0.5" />
              <circle cx="350" cy="250" r="150" fill="#fecaca" opacity="0.3" />
              <circle cx="450" cy="350" r="180" fill="#fca5a5" opacity="0.2" />

              {/* Lock Icon */}
              <g transform="translate(400, 220)">
                {/* Lock body */}
                <rect
                  x="-50"
                  y="20"
                  width="100"
                  height="90"
                  rx="10"
                  fill="#a25772"
                  opacity="0.9"
                />
                
                {/* Lock shackle */}
                <path
                  d="M -40 20 L -40 -10 Q -40 -40 0 -40 Q 40 -40 40 -10 L 40 20"
                  stroke="#a25772"
                  strokeWidth="12"
                  fill="none"
                  strokeLinecap="round"
                />
                
                {/* Keyhole */}
                <circle cx="0" cy="50" r="12" fill="#ffffff" opacity="0.8" />
                <rect
                  x="-6"
                  y="55"
                  width="12"
                  height="30"
                  rx="2"
                  fill="#ffffff"
                  opacity="0.8"
                />
              </g>

              {/* 403 Text */}
              <text
                x="400"
                y="430"
                fontSize="100"
                fontWeight="bold"
                textAnchor="middle"
                className="fill-rose-600"
              >
                403
              </text>

              {/* Warning sign */}
              <g transform="translate(600, 180)">
                <polygon
                  points="0,-25 22,20 -22,20"
                  fill="#fbbf24"
                  opacity="0.8"
                />
                <text
                  x="0"
                  y="12"
                  fontSize="28"
                  fontWeight="bold"
                  textAnchor="middle"
                  fill="#78350f"
                >
                  !
                </text>
              </g>
            </svg>
            </div>
          </div>

          {/* Error Code */}
          <div className="text-[120px] font-black leading-none bg-gradient-to-br from-[var(--primary)] to-[var(--secondary)] bg-clip-text text-transparent">
            403
          </div>

          {/* Title */}
          <div className="space-y-3">
            <h1 className="text-4xl md:text-5xl font-bold text-[var(--foreground)]">
              Access Forbidden
            </h1>
            <p className="text-lg md:text-xl text-[var(--foreground)] opacity-80">
              Sorry, you don't have permission to access this resource.
            </p>
          </div>

          {/* Description */}
          <p className="text-base md:text-lg max-w-md text-[var(--foreground)] opacity-70">
            If you believe this is an error, please contact your administrator. Use the buttons below to navigate back.
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
              Error Code: <span className="font-mono font-semibold">403</span> | {" "}
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

