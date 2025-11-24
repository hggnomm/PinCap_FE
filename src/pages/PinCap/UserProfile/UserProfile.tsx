import React, { useState, useEffect } from "react";

import { useParams, Navigate } from "react-router-dom";
import { toast } from "react-toastify";

import {
  Mail,
  Phone,
  User,
  MapPin,
  Calendar,
  Star,
  Instagram,
  ArrowRight,
} from "lucide-react";

import { MoreOutlined } from "@ant-design/icons/lib";

import BackButton from "@/components/BackButton/BackButton";
import ButtonCircle from "@/components/ButtonCircle/ButtonCircle";
import FollowButton from "@/components/FollowButton";
import Loading from "@/components/Loading/Loading";
import ReportUserModal from "@/components/Modal/user/ReportUserModal";
import { ROUTES } from "@/constants/routes";
import { useAuth } from "@/react-query/useAuth";
import { useUser } from "@/react-query/useUser";

// Reusable StatCard component
interface StatCardProps {
  value: string | number;
  label: string;
  icon?: React.ReactNode;
  gradientColors: string;
  borderColor: string;
  textColor: string;
}

const StatCard: React.FC<StatCardProps> = ({
  value,
  label,
  icon,
  gradientColors,
  borderColor,
  textColor,
}) => (
  <div className={`${gradientColors} p-4 rounded-2xl border ${borderColor}`}>
    <div className={`text-2xl font-bold ${textColor}`}>{value}</div>
    <div className={`text-sm ${textColor}/70 flex items-center gap-1`}>
      {icon}
      {label}
    </div>
  </div>
);

// Reusable InfoItem component
interface InfoItemProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  bgColor: string;
  iconColor: string;
}

const InfoItem: React.FC<InfoItemProps> = ({
  icon,
  label,
  value,
  bgColor,
  iconColor,
}) => (
  <div className="flex items-center gap-4 p-3 rounded-xl bg-muted/50 hover:bg-muted transition-colors">
    <div
      className={`w-10 h-10 ${bgColor} rounded-full flex items-center justify-center`}
    >
      <div className={iconColor}>{icon}</div>
    </div>
    <div>
      <div className="text-sm text-muted-foreground">{label}</div>
      <div className="font-medium text-foreground">{value}</div>
    </div>
  </div>
);

const UserProfile = () => {
  const { id } = useParams<{ id: string }>();
  const { user: currentUser } = useAuth();
  const { getUserProfile, reportUser, getReportReasons } = useUser();

  const [followersCount, setFollowersCount] = useState(0);
  const [isFollowing, setIsFollowing] = useState(false);
  const [reportModalVisible, setReportModalVisible] = useState(false);

  const reportReasonsQuery = getReportReasons();
  const reportReasons = Array.isArray(reportReasonsQuery.data)
    ? reportReasonsQuery.data
    : [];

  if (id && currentUser && id === currentUser.id) {
    return <Navigate to={ROUTES.PROFILE} replace />;
  }

  // Fetch user profile
  const { data: userProfile, isLoading } = getUserProfile(id || "");

  useEffect(() => {
    if (userProfile) {
      setFollowersCount(userProfile.followers_count ?? 0);
      setIsFollowing(userProfile.isFollowing ?? false);
    }
  }, [userProfile]);

  const handleFollowChange = (
    newIsFollowing: boolean,
    newFollowersCount: number
  ) => {
    setIsFollowing(newIsFollowing);
    setFollowersCount(newFollowersCount);
  };

  const handleReportUser = async (reasonId?: string, otherReasons?: string) => {
    if (!id) return;

    try {
      await reportUser({
        user_id: id,
        reason_report_id: reasonId,
        other_reasons: otherReasons,
      });
      toast.success("User reported successfully!");
      setReportModalVisible(false);
    } catch (error) {
      console.error("Error reporting user:", error);
      toast.error("Failed to report user. Please try again.");
    }
  };

  const handleOpenReportModal = () => {
    setReportModalVisible(true);
  };

  const handleCloseReportModal = () => {
    setReportModalVisible(false);
  };

  return (
    <Loading isLoading={isLoading}>
      <div className="min-h-screen p-4 md:p-8">
        <div className="max-w-4xl mx-auto relative">
          <BackButton />
          {userProfile && (
            <div className="bg-card rounded-3xl shadow-2xl overflow-hidden">
              {/* Cover Photo with improved gradient */}
              <div
                className="h-56 md:h-64 bg-gradient-to-r from-rose-400 to-pink-500 relative bg-cover bg-center"
                style={{
                  backgroundImage: userProfile.background
                    ? `url(${userProfile.background})`
                    : undefined,
                }}
              >
                {/* Overlay for better text contrast */}
                <div className="absolute inset-0 bg-black/20"></div>

                {/* Profile Avatar with enhanced styling */}
                <div className="absolute -bottom-16 left-8">
                  <div className="relative">
                    <div className="w-32 h-32 rounded-full border-4 border-white dark:border-slate-800 shadow-2xl overflow-hidden">
                      {userProfile.avatar ? (
                        <img
                          src={userProfile.avatar || "/placeholder.svg"}
                          alt="Profile"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <User className="w-16 h-16 text-white" />
                        </div>
                      )}
                    </div>
                    {/* Online status indicator */}
                    <div className="absolute bottom-2 right-2 w-6 h-6 bg-green-500 rounded-full border-3 border-white dark:border-slate-800"></div>
                  </div>
                </div>
              </div>

              {/* Profile Content */}
              <div className="pt-20 pb-8 px-8">
                {/* Name and Username with Follow Button */}
                <div className="mb-6 flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
                      {userProfile.first_name} {userProfile.last_name}
                    </h1>
                    <p className="text-muted-foreground text-lg">
                      @{userProfile.first_name?.toLowerCase()}
                      {userProfile.last_name?.toLowerCase()}
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    {/* Follow Button */}
                    <FollowButton
                      userId={id || ""}
                      initialIsFollowing={isFollowing}
                      initialFollowersCount={followersCount}
                      onFollowChange={handleFollowChange}
                      variant="profile"
                    />

                    <ButtonCircle
                      text="More"
                      paddingClass="p-2.5"
                      icon={
                        <MoreOutlined
                          style={{
                            fontSize: "26px",
                            strokeWidth: "40",
                            stroke: "black",
                          }}
                        />
                      }
                      dropdownMenu={[
                        {
                          key: "report",
                          title: "Report User",
                          onClick: handleOpenReportModal,
                        },
                        {
                          key: "block",
                          title: "Block User",
                          onClick: () => {
                            // TODO: Implement block user functionality
                            toast.info("Block user functionality coming soon!");
                          },
                        },
                        {
                          key: "share",
                          title: "Share Profile",
                          onClick: () => {
                            // TODO: Implement share profile functionality
                            toast.info(
                              "Share profile functionality coming soon!"
                            );
                          },
                        },
                      ]}
                    />
                  </div>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                  {[
                    {
                      value: followersCount.toLocaleString(),
                      label: "Followers",
                      gradientColors:
                        "bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900/20 dark:to-gray-800/20",
                      borderColor: "border-gray-200 dark:border-gray-800",
                      textColor: "text-gray-700 dark:text-gray-300",
                    },
                    {
                      value: userProfile.followees_count?.toLocaleString() || 0,
                      label: "Following",
                      gradientColors:
                        "bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900/20 dark:to-gray-800/20",
                      borderColor: "border-gray-200 dark:border-gray-800",
                      textColor: "text-gray-700 dark:text-gray-300",
                    },
                    {
                      value:
                        userProfile.reaction_media_count?.toLocaleString() || 0,
                      label: "Reaction",
                      icon: <Star className="w-3 h-3 fill-current" />,
                      gradientColors:
                        "bg-gradient-to-br from-pink-50 to-pink-100 dark:from-pink-900/20 dark:to-pink-800/20",
                      borderColor: "border-pink-200 dark:border-pink-800",
                      textColor: "text-pink-600 dark:text-pink-400",
                    },
                    {
                      value: userProfile.medias_count?.toLocaleString() || 0,
                      label: "Pin",
                      gradientColors:
                        "bg-gradient-to-br from-rose-50 to-rose-100 dark:from-rose-900/20 dark:to-rose-800/20",
                      borderColor: "border-rose-200 dark:border-rose-800",
                      textColor: "text-rose-600 dark:text-rose-400",
                    },
                  ].map((stat, index) => (
                    <StatCard key={index} {...stat} />
                  ))}
                </div>

                {/* Connected Accounts Section */}
                {userProfile.social_instagram && (
                  <div className="mb-8">
                    <h3 className="text-xl font-semibold text-foreground mb-4">
                      Connected Accounts
                    </h3>
                    <a
                      href={userProfile.social_instagram.permalink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-4 p-4 rounded-xl bg-gray-50 dark:bg-gray-900/20 border border-gray-200 dark:border-gray-800 hover:border-pink-300 dark:hover:border-pink-700 transition-all group"
                    >
                      <div className="relative w-12 h-12 rounded-full overflow-hidden shadow-md ring-2 ring-gray-200 dark:ring-gray-700 group-hover:ring-pink-400 dark:group-hover:ring-pink-600 transition-all">
                        <img
                          src={userProfile.social_instagram.avatar}
                          alt={userProfile.social_instagram.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <div className="text-sm font-medium text-gray-600 dark:text-gray-400 flex items-center gap-2 group-hover:text-pink-600 dark:group-hover:text-pink-400 transition-colors">
                          <Instagram className="w-4 h-4" />
                          Instagram
                        </div>
                        <div className="font-semibold text-foreground group-hover:text-pink-600 dark:group-hover:text-pink-400 transition-colors">
                          @{userProfile.social_instagram.name}
                        </div>
                      </div>
                      <div className="text-gray-400 dark:text-gray-600 group-hover:text-pink-600 dark:group-hover:text-pink-400 transition-colors">
                        <ArrowRight className="w-5 h-5" />
                      </div>
                    </a>
                  </div>
                )}

                {/* Contact Information */}
                <div className="grid md:grid-cols-2 gap-8">
                  <div className="space-y-6">
                    <h3 className="text-xl font-semibold text-foreground mb-4">
                      Contact Information
                    </h3>

                    <div className="space-y-4">
                      {[
                        {
                          icon: <Mail className="w-5 h-5" />,
                          label: "Email",
                          value: userProfile.email,
                          bgColor: "bg-gray-100 dark:bg-gray-800/50",
                          iconColor: "text-gray-600 dark:text-gray-400",
                        },
                        ...(userProfile.phone
                          ? [
                              {
                                icon: <Phone className="w-5 h-5" />,
                                label: "Phone",
                                value: userProfile.phone,
                                bgColor: "bg-gray-100 dark:bg-gray-800/50",
                                iconColor: "text-gray-600 dark:text-gray-400",
                              },
                            ]
                          : []),
                      ].map((item, index) => (
                        <InfoItem key={index} {...item} />
                      ))}
                    </div>
                  </div>

                  <div className="space-y-6">
                    <h3 className="text-xl font-semibold text-foreground mb-4">
                      Additional Info
                    </h3>

                    <div className="space-y-4">
                      {[
                        {
                          icon: <MapPin className="w-5 h-5" />,
                          label: "Location",
                          value: "San Francisco, CA",
                          bgColor: "bg-gray-100 dark:bg-gray-800/50",
                          iconColor: "text-gray-600 dark:text-gray-400",
                        },
                        {
                          icon: <Calendar className="w-5 h-5" />,
                          label: "Joined",
                          value: "March 2023",
                          bgColor: "bg-gray-100 dark:bg-gray-800/50",
                          iconColor: "text-gray-600 dark:text-gray-400",
                        },
                      ].map((item, index) => (
                        <InfoItem key={index} {...item} />
                      ))}
                    </div>

                    {/* Bio Section */}
                    <div className="mt-6">
                      <h4 className="text-lg font-medium text-foreground mb-3">
                        About
                      </h4>
                      <p className="text-muted-foreground leading-relaxed">
                        {userProfile.bio || "No bio available yet."}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <ReportUserModal
        visible={reportModalVisible}
        onCancel={handleCloseReportModal}
        onConfirm={handleReportUser}
        reportReasons={reportReasons}
        userName={
          userProfile
            ? `${userProfile.first_name} ${userProfile.last_name}`
            : ""
        }
      />
    </Loading>
  );
};

export default UserProfile;
