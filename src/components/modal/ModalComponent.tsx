import React from "react";
import { Modal } from "antd";
import clsx from "clsx";
import "./ModalComponent.less";

interface ModalComponentProps {
  titleDefault?: string;
  title?: string;
  visible: boolean; // Hoặc open nếu bạn dùng phiên bản Ant Design mới
  onCancel?: () => void;
  onConfirm?: () => void;
  buttonLabels?: {
    confirmLabel?: string;
    cancelLabel?: string;
  };
  children: React.ReactNode;
  className?: string;
  bodyClassName?: string;
  confirmLoading?: boolean;
  showFooter?: boolean;
}

const ModalComponent: React.FC<ModalComponentProps> = ({
  titleDefault,
  title,
  visible,
  onCancel,
  onConfirm,
  buttonLabels = { confirmLabel: "Confirm", cancelLabel: "Close" },
  children,
  className,
  bodyClassName,
  confirmLoading = false,
  showFooter = true,
}) => {
  return (
    <Modal
      title={titleDefault}
      className={clsx("modal-component", className)}
      centered
      open={visible}
      onCancel={onCancel}
      transitionName=""
      maskTransitionName=""
      footer={
        showFooter && [
          <button
            className="cancel"
            key="cancel"
            onClick={onCancel}
            disabled={confirmLoading}
          >
            {buttonLabels.cancelLabel}
          </button>,
          <button
            className={clsx("confirm", {
              "opacity-50 cursor-not-allowed": confirmLoading,
            })}
            key="confirm"
            onClick={onConfirm}
            disabled={confirmLoading}
          >
            {buttonLabels.confirmLabel}
          </button>,
        ]
      }
      width="auto"
    >
      {title && (
        <div className="title">
          <span>{title}</span>
        </div>
      )}

      <div className={clsx("modal-body", bodyClassName)}>{children}</div>
    </Modal>
  );
};

export default ModalComponent;
