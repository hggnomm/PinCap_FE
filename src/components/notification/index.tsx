import React, { useEffect, useRef, useState } from "react";
import IconNotification from "../../assets/img/PinCap/icon_notification.svg";
import "./index.less";

const useComponentVisible = (initialIsVisible: boolean) => {
    const ref = useRef<any>(null);
    const [isComponentVisible, setIsComponentVisible] = useState(
        initialIsVisible
    );

    const handleHideDropdown = (event: KeyboardEvent) => {
        if (event.key === "Escape") {
            setIsComponentVisible(false);
        }
    };

    const handleClickOutside = (event: any) => {
        if (ref.current && !ref.current.contains(event.target)) {
            setIsComponentVisible(false);
        }
    };

    useEffect(() => {
        document.addEventListener("keydown", handleHideDropdown, true);
        document.addEventListener("click", handleClickOutside, true);
        return () => {
            document.removeEventListener("keydown", handleHideDropdown, true);
            document.removeEventListener("click", handleClickOutside, true);
        };
    });

    return { ref, isComponentVisible, setIsComponentVisible, handleClickOutside };
}

const Notification = () => {
    const {
        ref,
        isComponentVisible,
        setIsComponentVisible,
        handleClickOutside
    } = useComponentVisible(false);

    const onShowDropdown = () => {
        setIsComponentVisible(!isComponentVisible);
      };
    return (
        <div className="menu-notification" onClick={onShowDropdown} >
            <img src={IconNotification} alt="notification" />

            {
                isComponentVisible &&
                <>
                    <div>hehe</div>
                </>
            }
        </div>


    );
};

export default Notification;
