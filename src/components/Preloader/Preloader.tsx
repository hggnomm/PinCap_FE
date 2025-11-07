import React, { useEffect, useRef } from "react";
import "./Preloader.less";

const Preloader: React.FC = () => {
  const preloaderRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const preload = preloaderRef.current;

    const timer1 = setTimeout(() => {
      if (preload) {
        preload.style.opacity = "0";
        const timer2 = setTimeout(() => {
          if (preload) {
            preload.style.display = "none";
          }
        }, 1000);

        return () => {
          clearTimeout(timer2);
        };
      }
    }, 1500);

    return () => {
      clearTimeout(timer1);
    };
  }, []);

  return (
    <div className="preloader" ref={preloaderRef}>
      <div className="spinner_wrap">
        <div className="spinner" />
      </div>
    </div>
  );
};

export default Preloader;
