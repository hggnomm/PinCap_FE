import React from "react";

import { useNavigate } from "react-router-dom";

import { Edit, Mail, Phone, User, MapPin, Calendar, Star } from "lucide-react";

import BackButton from "@/components/BackButton/BackButton";
import InstagramAccountCard from "@/components/ConnectedAccounts/InstagramAccountCard";
import Loading from "@/components/Loading/Loading";
import { ROUTES } from "@/constants/routes";
import { useAuth } from "@/react-query/useAuth";

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

const Profile = () => {
  const { user, isLoadingUser } = useAuth();
  const navigate = useNavigate();

  const handleEditProfile = () => {
    navigate(ROUTES.EDIT_PROFILE);
  };

  return (
    <Loading isLoading={isLoadingUser}>
      <div className="min-h-screen p-4 md:p-8">
        <div className="max-w-4xl mx-auto relative">
          <BackButton />
          {user && (
            <div className="bg-card rounded-3xl shadow-2xl overflow-hidden">
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
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                  {[
                    {
                      value: user.followers_count?.toLocaleString() || 0,
                      label: "Followers",
                      gradientColors:
                        "bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900/20 dark:to-gray-800/20",
                      borderColor: "border-gray-200 dark:border-gray-800",
                      textColor: "text-gray-700 dark:text-gray-300",
                    },
                    {
                      value: user.followees_count?.toLocaleString() || 0,
                      label: "Following",
                      gradientColors:
                        "bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900/20 dark:to-gray-800/20",
                      borderColor: "border-gray-200 dark:border-gray-800",
                      textColor: "text-gray-700 dark:text-gray-300",
                    },
                    {
                      value: user.reaction_media_count?.toLocaleString() || 0,
                      label: "Reaction",
                      icon: <Star className="w-3 h-3 fill-current" />,
                      gradientColors:
                        "bg-gradient-to-br from-pink-50 to-pink-100 dark:from-pink-900/20 dark:to-pink-800/20",
                      borderColor: "border-pink-200 dark:border-pink-800",
                      textColor: "text-pink-600 dark:text-pink-400",
                    },
                    {
                      value: user.medias_count?.toLocaleString() || 0,
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
                    Passionate developer and designer creating beautiful digital
                    experiences. Love working with modern technologies and
                    building user-friendly applications.
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
          )}
        </div>
      </div>
    </Loading>
  );
};

export default Profile;
