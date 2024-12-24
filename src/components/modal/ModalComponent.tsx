import React from "react";
import { Modal } from "antd";
import "./ModalComponent.less";

interface ModalComponentProps {
  title?: string;
  visible: boolean; // Hoặc open nếu bạn dùng phiên bản Ant Design mới
  onCancel: () => void;
  onConfirm: () => void;
  buttonLabels?: {
    confirmLabel?: string;
    cancelLabel?: string;
  };
  children: React.ReactNode;
}

const ModalComponent: React.FC<ModalComponentProps> = ({
  title,
  visible,
  onCancel,
  onConfirm,
  buttonLabels = { confirmLabel: "Confirm", cancelLabel: "Close" },
  children,
}) => {
  return (
    <Modal
      className="modal-component"
      centered
      open={visible}
      onCancel={onCancel}
      transitionName=""
      maskTransitionName=""
      footer={[
        <button className="cancel" key="cancel" onClick={onCancel}>
          {buttonLabels.cancelLabel}
        </button>,
        <button className="confirm" key="confirm" onClick={onConfirm}>
          {buttonLabels.confirmLabel}
        </button>,
      ]}
    >
      <div className="title">
        <span>{title}</span>
      </div>
      {children}
    </Modal>
  );
};

export default ModalComponent;
