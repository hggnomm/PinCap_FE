import React, { useCallback, useState } from "react";

import { toast } from "react-toastify";

import { clsx } from "clsx";
import { AlertTriangle } from "lucide-react";

import { Input } from "antd";

const { TextArea } = Input;

import FieldItem from "@/components/Form/fieldItem/FieldItem";
import ModalComponent from "@/components/Modal/ModalComponent";
import { ReportReason } from "@/types/type";

interface ReportMediaModalProps {
  visible: boolean;
  onCancel: () => void;
  onConfirm: (reasonId?: string, otherReasons?: string) => void;
  reportReasons: ReportReason[];
  mediaName?: string;
}

const ReportMediaModal: React.FC<ReportMediaModalProps> = ({
  visible,
  onCancel,
  onConfirm,
  reportReasons,
  mediaName,
}) => {
  const [selectedReason, setSelectedReason] = useState<string>("");
  const [otherReasons, setOtherReasons] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleReasonSelect = useCallback((reasonId: string) => {
    setSelectedReason(reasonId);
  }, []);

  const handleSubmit = useCallback(async () => {
    if (!selectedReason) {
      toast.error("Please select a reason for reporting");
      return;
    }

    setIsSubmitting(true);
    try {
      await onConfirm(selectedReason, otherReasons.trim() || undefined);
      setSelectedReason("");
      setOtherReasons("");
    } catch (error) {
      console.error("Error submitting report:", error);
    } finally {
      setIsSubmitting(false);
    }
  }, [selectedReason, otherReasons, onConfirm]);

  const isSubmitDisabled = !selectedReason || isSubmitting;

  const handleCancel = useCallback(() => {
    setSelectedReason("");
    setOtherReasons("");
    onCancel();
  }, [onCancel]);

  const renderReasonItem = useCallback(
    (reason: ReportReason) => {
      const isSelected = selectedReason === reason.id;

      return (
        <div
          key={reason.id}
          className={clsx(
            "flex items-center justify-between p-4 border rounded-lg transition-colors cursor-pointer",
            isSelected
              ? "border-red-300 bg-red-50 hover:bg-red-100"
              : "border-gray-200 hover:bg-gray-50"
          )}
          onClick={() => handleReasonSelect(reason.id)}
        >
          <div className="flex-1">
            <h4 className="font-medium text-gray-900 mb-1">{reason.title}</h4>
            {reason.description && (
              <p className="text-sm text-gray-600">{reason.description}</p>
            )}
          </div>

          {/* Selection Indicator */}
          <div className="flex-shrink-0">
            <div
              className={clsx(
                "w-5 h-5 rounded-full border-2 flex items-center justify-center",
                isSelected ? "border-red-500 bg-red-500" : "border-gray-300"
              )}
            >
              {isSelected && (
                <div className="w-2 h-2 bg-white rounded-full"></div>
              )}
            </div>
          </div>
        </div>
      );
    },
    [selectedReason, handleReasonSelect]
  );

  return (
    <ModalComponent
      titleDefault="Report Media"
      visible={visible}
      onCancel={handleCancel}
      onConfirm={isSubmitDisabled ? undefined : handleSubmit}
      buttonLabels={{
        confirmLabel: isSubmitting ? "Reporting..." : "Submit Report",
        cancelLabel: "Cancel",
      }}
      className="!w-[600px]"
      confirmLoading={isSubmitting}
    >
      <div className="py-2">
        <div className="mb-6">
          <div className="space-y-3">
            {reportReasons.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <AlertTriangle className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p>No report reasons available</p>
              </div>
            ) : (
              reportReasons.map((reason) => renderReasonItem(reason))
            )}
          </div>
        </div>

        <div className="mb-6">
          <FieldItem
            label="Additional Comments (Optional)"
            help={`${otherReasons.length}/500 characters`}
          >
            <TextArea
              value={otherReasons}
              onChange={(e) => setOtherReasons(e.target.value)}
              placeholder="Please provide any additional details about this report..."
              rows={3}
              maxLength={500}
            />
          </FieldItem>
        </div>
      </div>
    </ModalComponent>
  );
};

export default ReportMediaModal;

