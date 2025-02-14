import React from "react";
import { Modal } from "antd";
import "./ModalComponent.less";

interface ModalComponentProps {
  titleDefault?: string;
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
  titleDefault,
  title,
  visible,
  onCancel,
  onConfirm,
  buttonLabels = { confirmLabel: "Confirm", cancelLabel: "Close" },
  children,
}) => {
  return (
    <Modal
      title={titleDefault}
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
      {title && (
        <div className="title">
          <span>{title}</span>
        </div>
      )}

      <div className="modal-body">{children}</div>
    </Modal>
  );
};

export default ModalComponent;
