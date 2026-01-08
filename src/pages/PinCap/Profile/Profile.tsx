import { useNavigate } from "react-router-dom";

import { Edit, Mail, Phone, User, MapPin, Calendar } from "lucide-react";

import { getMyMedias } from "@/api/media";
import BackButton from "@/components/BackButton/BackButton";
import InstagramAccountCard from "@/components/ConnectedAccounts/InstagramAccountCard";
import Loading from "@/components/Loading/Loading";
import { InfoItem, ProfileStats } from "@/components/Profile";
import MediaList from "@/components/ViewPin/ViewPinComponent";
import { ROUTES } from "@/constants/routes";
import { useAuth } from "@/react-query/useAuth";

const Profile = () => {
  const { user, isLoadingUser } = useAuth();
  const navigate = useNavigate();

  const handleEditProfile = () => {
    navigate(ROUTES.EDIT_PROFILE);
  };

  // Query function for fetching my medias
  const myMediasQueryFn = (pageParam: number) => {
    return getMyMedias({
      pageParam,
      is_created: true,
    });
  };

  return (
    <Loading isLoading={isLoadingUser}>
      <div className="relative">
        <BackButton />
        {user && (
          <div className="p-4 md:p-8">
            <div className="max-w-4xl mx-auto">
              <div className="bg-card rounded-3xl shadow-md bg-white overflow-hidden">
                {/* Cover Photo with improved gradient */}
                <div
                  className="h-56 md:h-64 bg-gradient-to-r from-rose-400 to-pink-500 relative"
                  style={{
                    backgroundImage: user.background
                      ? `url(${user.background})`
                      : undefined,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }}
                >
                  {/* Overlay for better text contrast */}
                  <div className="absolute inset-0 bg-black/20"></div>

                  {/* Profile Avatar with enhanced styling */}
                  <div className="absolute -bottom-16 left-8">
                    <div className="relative">
                      <div className="w-32 h-32 rounded-full border-4 border-white dark:border-slate-800 shadow-2xl overflow-hidden">
                        {user.avatar ? (
                          <img
                            src={user.avatar || "/placeholder.svg"}
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

                  {/* Edit Button - repositioned */}
                  <div className="absolute top-6 right-6">
                    <button
                      onClick={handleEditProfile}
                      className="!bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white !px-4 !py-2 !rounded-full flex items-center gap-2 transition-all duration-200 hover:scale-105"
                    >
                      <Edit className="w-4 h-4" />
                      <span className="hidden sm:inline">Edit Profile</span>
                    </button>
                  </div>
                </div>

                {/* Profile Content */}
                <div className="pt-20 pb-8 px-8">
                  {/* Name and Username */}
                  <div className="mb-6">
                    <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
                      {user.first_name} {user.last_name}
                    </h1>
                    <p className="text-muted-foreground text-lg">
                      @{user.first_name?.toLowerCase()}
                      {user.last_name?.toLowerCase()}
                    </p>
                  </div>

                  {/* Stats Cards */}
                  <ProfileStats user={user} userId={user.id} />

                  {user.social_instagram && (
                    <InstagramAccountCard
                      account={user.social_instagram}
                      showTitle={false}
                    />
                  )}

                  {/* About Section */}
                  <div className="mb-8">
                    <h3 className="text-xl font-semibold text-foreground mb-4">
                      About
                    </h3>
                    <p className="text-muted-foreground leading-relaxed">
                      Passionate developer and designer creating beautiful
                      digital experiences. Love working with modern technologies
                      and building user-friendly applications.
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
                            value: user.email,
                            bgColor: "bg-gray-100 dark:bg-gray-800/50",
                            iconColor: "text-gray-600 dark:text-gray-400",
                          },
                          ...(user.phone
                            ? [
                                {
                                  icon: <Phone className="w-5 h-5" />,
                                  label: "Phone",
                                  value: user.phone,
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
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* User Media List - Full Width */}
        {user && (
          <div className="w-full pb-8">
            <MediaList
              queryKey={["myMedias"]}
              queryFn={myMediasQueryFn}
              isEditMedia={false}
              isSaveMedia={true}
              enabled={!!user}
            />
          </div>
        )}
      </div>
    </Loading>
  );
};

export default Profile;
