"use client"

import type React from "react"
import { useState } from "react"
import { useAuth } from "@/hooks/useAuth"
import { useUser } from "@/hooks/useUser"
import * as users from "@/api/users"
import { useNavigate } from "react-router-dom"
import Loading from "@/components/loading/Loading"
import FieldItem from "@/components/form/fieldItem/FieldItem"
import { ArrowLeft, Save, Upload, X } from "lucide-react"
import { ROUTES } from "@/constants/routes"
import { Form, Input } from "antd"
import { toast } from "react-toastify"

const { TextArea } = Input

const EditProfile = () => {
  const { user, isLoadingUser } = useAuth()
  const { getMyProfile, updateMyProfile, updateMyProfileLoading, updateMyProfileError } = useUser()
  const navigate = useNavigate()
  const [form] = Form.useForm()
  
  // Get user profile data
  const { data: profileData, isLoading: isLoadingProfile } = getMyProfile()

  const handleSubmit = async (values: any) => {
    try {
      await updateMyProfile(values)
      toast.success("Profile updated successfully!")
      navigate(ROUTES.PROFILE)
      
    } catch (error: any) {
      console.error("Error updating profile:", error)
      toast.error("Failed to update profile. Please try again.")
    }
  }

  const handleCancel = () => {
    navigate(ROUTES.PROFILE)
  }

  // Use profile data if available, fallback to user data
  const userData = profileData || user
  const isLoading = isLoadingUser || isLoadingProfile

  return (
    <Loading isLoading={isLoading} error={null}>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-4 md:p-8">
        <div className="max-w-2xl mx-auto">
          {userData && (
            <div className="bg-white rounded-2xl shadow-xl border border-slate-200/60 overflow-hidden backdrop-blur-sm">
              <div className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500/80 p-8 relative overflow-hidden">
                <div className="absolute inset-0 bg-black/10"></div>
                <div className="relative flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <button
                      onClick={handleCancel}
                      className="!p-3 rounded-xl !bg-white/20 hover:!bg-white/30 transition-all duration-200 backdrop-blur-sm border !border-white/20"
                    >
                      <ArrowLeft className="w-5 h-5 text-white" />
                    </button>
                    <div>
                      <h1 className="text-3xl font-bold text-white mb-1">Edit Profile</h1>
                      <p className="text-white/80 text-sm">Update your personal information</p>
                    </div>
                  </div>
                   <button
                     type="submit"
                     form="edit-profile-form"
                     disabled={updateMyProfileLoading}
                     className="flex items-center gap-2 !px-6 !py-3 !bg-white/20 hover:!bg-white/30 disabled:opacity-50 text-white rounded-xl transition-all duration-200 backdrop-blur-sm !border !border-white/20 font-medium"
                   >
                     <Save className="w-4 h-4" />
                     <span>{updateMyProfileLoading ? "Saving..." : "Save"}</span>
                   </button>
                </div>
              </div>

              <Form 
                id="edit-profile-form"
                form={form}
                onFinish={handleSubmit}
                layout="vertical"
                initialValues={{
                  first_name: userData?.first_name || "",
                  last_name: userData?.last_name || "",
                  email: userData?.email || "",
                  phone: userData?.phone || "",
                  bio: userData?.bio || "Passionate developer and designer creating beautiful digital experiences. Love working with modern technologies and building user-friendly applications.",
                }}
                className="!p-8 space-y-10"
              >
                <div className="flex flex-col lg:flex-row gap-8 items-start">
                  <div className="flex flex-col items-center space-y-4">
                    <div className="relative group">
                      <div className="w-36 h-36 rounded-full overflow-hidden bg-gradient-to-br from-indigo-500 to-purple-600 border-4 border-white shadow-xl">
                        {userData.avatar ? (
                          <img
                            src={userData.avatar || "/placeholder.svg"}
                            alt="Profile"
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <span className="text-white text-3xl font-bold">
                              {userData.first_name?.[0]}
                              {userData.last_name?.[0]}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                    <button
                      type="button"
                      className="text-sm text-indigo-600 hover:text-indigo-700 transition-colors font-medium"
                    >
                      Change Profile Photo
                    </button>
                  </div>

                  <div className="flex-1">
                    <label className="block text-sm font-semibold text-slate-700 mb-3">Cover Photo</label>
                    <div className="border-2 border-dashed border-slate-300 rounded-xl p-8 text-center hover:border-indigo-400 hover:bg-indigo-50/50 transition-all duration-200 group cursor-pointer">
                      <Upload className="w-10 h-10 text-slate-400 group-hover:text-indigo-500 mx-auto mb-3 transition-colors" />
                      <p className="text-sm text-slate-600 font-medium mb-1">Click to upload or drag and drop</p>
                      <p className="text-xs text-slate-500">SVG, PNG, JPG or GIF (max. 800x400px)</p>
                    </div>
                  </div>
                </div>

                 <div className="space-y-6">
                   <h3 className="text-lg font-semibold text-slate-800 border-b border-slate-200 pb-2">
                     Personal Information
                   </h3>

                   <div className="space-y-6">
                     <FieldItem 
                       label="First Name"
                       name="first_name"
                       placeholder="Enter your first name"
                       rules={[{ required: true, message: 'Please input your first name!' }]}
                     >
                       <Input size="large" />
                     </FieldItem>

                     <FieldItem 
                       label="Last Name"
                       name="last_name"
                       placeholder="Enter your last name"
                       rules={[{ required: true, message: 'Please input your last name!' }]}
                     >
                       <Input size="large" />
                     </FieldItem>

                    <FieldItem 
                      label="Email Address"
                      name="email"
                      placeholder="Enter your email"
                      rules={[
                        { required: true, message: 'Please input your email!' },
                        { type: 'email', message: 'Please enter a valid email!' }
                      ]}
                    >
                      <Input size="large" disabled />
                    </FieldItem>

                     <FieldItem 
                       label="Phone Number"
                       name="phone"
                       placeholder="Enter your phone number"
                     >
                       <Input size="large" />
                     </FieldItem>
                   </div>
                 </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-slate-800 border-b border-slate-200 pb-2">About You</h3>
                  <FieldItem 
                    label="Bio"
                    name="bio"
                    placeholder="Tell us about yourself..."
                    help="Brief description for your profile. URLs are hyperlinked."
                  >
                    <TextArea rows={4} size="large" />
                  </FieldItem>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 pt-8 border-t border-slate-200">
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="flex items-center justify-center gap-2 !px-8 !py-4 !border-2 !border-slate-300 text-slate-700 rounded-xl hover:!bg-slate-50 hover:!border-slate-400 transition-all duration-200 font-medium"
                  >
                    <X className="w-4 h-4" />
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={updateMyProfileLoading}
                    className="flex items-center justify-center gap-2 !px-8 !py-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:!from-indigo-700 hover:!to-purple-700 disabled:opacity-50 text-white rounded-xl transition-all duration-200 font-medium shadow-lg hover:shadow-xl"
                  >
                    <Save className="w-4 h-4" />
                    {updateMyProfileLoading ? "Saving Changes..." : "Save Changes"}
                  </button>
                </div>
              </Form>
            </div>
          )}
        </div>
      </div>
    </Loading>
  )
}

export default EditProfile
