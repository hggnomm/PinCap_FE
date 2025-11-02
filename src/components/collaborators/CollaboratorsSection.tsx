import type React from "react";
import { useMemo } from "react";

import { clsx } from "clsx";
import { ExternalLink } from "lucide-react";

import { CustomTooltip } from "@/components/Tooltip";
import { ALBUM_INVITATION_STATUS } from "@/constants/constants";

interface Collaborator {
  id: string;
  name?: string;
  first_name?: string;
  last_name?: string;
  avatar?: string;
  status?: string;
}

interface CollaboratorsSectionProps {
  collaborators?: Collaborator[];
  maxDisplay?: number;
  showAddButton?: boolean;
  onAddCollaborator?: () => void;
  onViewAllCollaborators?: () => void;
  className?: string;
  isOwner?: boolean;
  titleClassName?: string;
}

const CollaboratorsSection: React.FC<CollaboratorsSectionProps> = ({
  collaborators = [],
  maxDisplay = 5,
  showAddButton = true,
  onAddCollaborator,
  onViewAllCollaborators,
  className = "",
  isOwner = true,
  titleClassName = "",
}) => {
  const acceptedCollaborators = useMemo(
    () =>
      collaborators.filter(
        (collaborator) =>
          collaborator.status === ALBUM_INVITATION_STATUS.ACCEPTED
      ),
    [collaborators]
  );

  const displayCollaborators = useMemo(
    () => acceptedCollaborators.slice(0, maxDisplay),
    [acceptedCollaborators, maxDisplay]
  );

  if (acceptedCollaborators.length === 0) {
    return null;
  }

  const getCollaboratorName = (collaborator: Collaborator) => {
    if (collaborator.name) return collaborator.name;
    if (collaborator.first_name && collaborator.last_name) {
      return `${collaborator.first_name} ${collaborator.last_name}`;
    }
    return collaborator.first_name || collaborator.last_name || "Unknown";
  };

  return (
    <div className={clsx("my-8", className)}>
      <div className="flex items-center justify-between mb-3 gap-2 w-fit">
        <div className="flex items-center gap-3">
          <h3
            className={clsx(
              "text-xl font-semibold text-gray-900 tracking-tight",
              titleClassName
            )}
          >
            Collaborators
          </h3>
        </div>

        {onViewAllCollaborators && (
          <CustomTooltip title="View all collaborators" placement="top">
            <div
              onClick={onViewAllCollaborators}
              className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100 cursor-pointer transition-colors duration-200"
            >
              <ExternalLink className="w-5 h-5 text-gray-600" />
            </div>
          </CustomTooltip>
        )}
      </div>

      <div className="flex items-center gap-6">
        <div
          className="flex items-center cursor-pointer"
          onClick={onViewAllCollaborators}
        >
          {displayCollaborators.map((collaborator, index) => (
            <CustomTooltip
              key={collaborator.id}
              title={getCollaboratorName(collaborator)}
              placement="top"
            >
              <div
                className={clsx("relative group", {
                  "-ml-3": index > 0,
                })}
              >
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-rose-400 via-pink-500 to-rose-600 p-0.5 shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110">
                  <div className="w-full h-full rounded-full bg-white flex items-center justify-center overflow-hidden">
                    {collaborator.avatar && (
                      <img
                        src={collaborator.avatar || "/placeholder.svg"}
                        alt={getCollaboratorName(collaborator)}
                        className="w-full h-full object-cover"
                      />
                    )}
                    {!collaborator.avatar && (
                      <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                        <svg
                          className="w-6 h-6 text-gray-500"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </CustomTooltip>
          ))}
        </div>

        {showAddButton && (
          <CustomTooltip
            title={
              isOwner
                ? "Add collaborator"
                : "Only album owner can add collaborators"
            }
            placement="top"
          >
            <button
              onClick={isOwner ? onAddCollaborator : undefined}
              disabled={!isOwner}
              className={clsx(
                "group relative !min-w-12 h-12 !p-0 rounded-full !border-2 !border-dashed transition-all duration-300",
                isOwner
                  ? "!border-gray-300 !bg-gray-50 hover:!bg-rose-50 hover:!border-rose-400 hover:!scale-105 cursor-pointer"
                  : "!border-gray-200 !bg-gray-100 cursor-not-allowed opacity-50"
              )}
            >
              <div className="flex items-center justify-center">
                <svg
                  className={clsx(
                    "w-5 h-5 transition-colors duration-200",
                    isOwner
                      ? "text-gray-400 group-hover:text-rose-500"
                      : "text-gray-300"
                  )}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                  />
                </svg>
              </div>
            </button>
          </CustomTooltip>
        )}
      </div>
    </div>
  );
};

export default CollaboratorsSection;
