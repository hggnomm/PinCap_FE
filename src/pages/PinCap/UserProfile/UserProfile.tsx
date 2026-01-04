import { useState, useEffect } from "react";

import { useParams, Navigate } from "react-router-dom";
import { toast } from "react-toastify";

import { Mail, Phone, User, MapPin, Calendar } from "lucide-react";

import { MoreOutlined } from "@ant-design/icons/lib";

import { getMediasByUserId } from "@/api/media";
import BackButton from "@/components/BackButton/BackButton";
import ButtonCircle from "@/components/ButtonCircle/ButtonCircle";
import InstagramAccountCard from "@/components/ConnectedAccounts/InstagramAccountCard";
import FollowButton from "@/components/FollowButton";
import Loading from "@/components/Loading/Loading";
import ReportUserModal from "@/components/Modal/user/ReportUserModal";
import { InfoItem, ProfileStats } from "@/components/Profile";
import MediaList from "@/components/ViewPin/ViewPinComponent";
import { ROUTES } from "@/constants/routes";
import { useAuth } from "@/react-query/useAuth";
import { useUser } from "@/react-query/useUser";
import { PaginatedMediaResponse } from "@/types/Media/MediaResponse";
import { Media } from "@/types/type";

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

  // Query function for fetching user medias
  const userMediasQueryFn = (pageParam: number) => {
    if (!id) {
      return Promise.resolve({
        current_page: 1,
        last_page: 1,
        per_page: 15,
        total: 0,
        data: [],
      } as PaginatedMediaResponse<Media>);
    }

    return getMediasByUserId({
      user_id: id,
      page: pageParam,
      per_page: 15,
    }) as Promise<PaginatedMediaResponse<Media>>;
  };

  return (
    <>
      <Loading isLoading={isLoading}>
        <div className="relative">
          <BackButton />
          {userProfile && (
            <div className="p-4 md:p-8">
              <div className="max-w-4xl mx-auto">
                <div className="bg-card rounded-3xl shadow-md bg-white overflow-hidden">
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
                                toast.info(
                                  "Block user functionality coming soon!"
                                );
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
                    <ProfileStats
                      user={userProfile}
                      followersCount={followersCount}
                      userId={id || userProfile.id}
                    />

                    {userProfile.social_instagram && (
                      <InstagramAccountCard
                        account={userProfile.social_instagram}
                      />
                    )}

                    {/* About Section */}
                    <div className="mb-8">
                      <h3 className="text-xl font-semibold text-foreground mb-4">
                        About
                      </h3>
                      <p className="text-muted-foreground leading-relaxed">
                        {userProfile.bio || "No bio available yet."}
                      </p>
                    </div>

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
                                    iconColor:
                                      "text-gray-600 dark:text-gray-400",
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
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* User Media List - Full Width */}
          {userProfile && id && (
            <div className="w-full pb-8">
              <MediaList
                queryKey={["userMedias", id]}
                queryFn={userMediasQueryFn}
                isEditMedia={false}
                isSaveMedia={true}
                enabled={!!id}
              />
            </div>
          )}
        </div>
      </Loading>

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
    </>
  );
};

export default UserProfile;
