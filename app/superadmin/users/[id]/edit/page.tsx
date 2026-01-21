"use client";

import { useState, useEffect, useRef, ChangeEvent } from "react";
import { useRouter, useParams } from "next/navigation";
import Image from "next/image";
import {
  ArrowLeft,
  Save,
  User,
  Mail,
  Phone,
  Shield,
  Globe,
  Briefcase,
  Camera,
  Upload,
  AlertCircle,
  CheckCircle,
  X,
  Image as ImageIcon,
  Loader2,
  Palette,
  MapPin,
  Twitter,
  Linkedin,
  Type,
  Smartphone,
  Globe as GlobeIcon,
  Building,
  Flag,
  FileText,
  Calendar,
  Clock,
} from "lucide-react";
import { useGetUserById, useUpdateUser } from "@/lib/hooks/useSuperadmin";
import useAuthStore from "@/lib/store/auth.store";
import { useSuperadminStatus } from "@/lib/hooks/useSuperadmin";

interface FormData {
  name: string;
  email: string;
  phone: string;
  bio: string;
  avatar: string;
  social: {
    twitter: string;
    linkedin: string;
  };
  address: {
    street: string;
    city: string;
    country: string;
  };
}

export default function EditUserPage() {
  const router = useRouter();
  const params = useParams();
  const userId = params.id as string;
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const { isAuthenticated, isLoading: authLoading } = useAuthStore();
  const { isSuperadmin } = useSuperadminStatus();
  
  // Queries
  const {
    data: userData,
    isLoading: userLoading,
    error: userError,
  } = useGetUserById(userId);
  
  // Mutation
  const updateUserMutation = useUpdateUser();
  
  // Form state
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    phone: "",
    bio: "",
    avatar: "",
    social: {
      twitter: "",
      linkedin: "",
    },
    address: {
      street: "",
      city: "",
      country: "Ethiopia",
    },
  });
  
  const [previewImage, setPreviewImage] = useState<string>("");
  const [uploading, setUploading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [isImageChanged, setIsImageChanged] = useState(false);

  // Redirect if not authenticated or not superadmin
  useEffect(() => {
    if (!authLoading) {
      if (!isAuthenticated) {
        router.push("/login");
      } else if (!isSuperadmin) {
        router.push("/dashboard");
      }
    }
  }, [isAuthenticated, authLoading, isSuperadmin, router]);

  // Populate form when user data loads
  useEffect(() => {
    if (userData?.user) {
      const user = userData.user;
      setFormData({
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
        bio: user.bio || "",
        avatar: user.avatar || "",
        social: user.social || { twitter: "", linkedin: "" },
        address: user.address || { street: "", city: "", country: "Ethiopia" },
      });
      setPreviewImage(user.avatar || "");
    }
  }, [userData]);

  // Handle file upload
  const handleImageUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setErrors(prev => ({ ...prev, avatar: 'Please upload an image file' }));
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setErrors(prev => ({ ...prev, avatar: 'Image size should be less than 5MB' }));
      return;
    }

    setUploading(true);
    setIsImageChanged(true);

    try {
      // Create preview URL
      const previewUrl = URL.createObjectURL(file);
      setPreviewImage(previewUrl);
      
      // In a real app, you would upload to your server here
      // For now, we'll simulate upload and use the preview URL
      // await uploadImageToServer(file);
      
      // Simulate upload delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // For demo, we'll use a placeholder URL
      const demoUploadUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(formData.name)}&background=random&bold=true&size=256`;
      setFormData(prev => ({ ...prev, avatar: demoUploadUrl }));
      setSuccessMessage("Image uploaded successfully!");
      
      setTimeout(() => setSuccessMessage(""), 3000);
      
    } catch (error) {
      setErrors(prev => ({ ...prev, avatar: 'Failed to upload image' }));
    } finally {
      setUploading(false);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const removeImage = () => {
    setPreviewImage("");
    setFormData(prev => ({ ...prev, avatar: "" }));
    setIsImageChanged(true);
  };

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    // Handle nested objects
    if (name.startsWith("social.")) {
      const field = name.split(".")[1];
      setFormData(prev => ({
        ...prev,
        social: {
          ...prev.social,
          [field]: value,
        },
      }));
    } else if (name.startsWith("address.")) {
      const field = name.split(".")[1];
      setFormData(prev => ({
        ...prev,
        address: {
          ...prev.address,
          [field]: value,
        },
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value,
      }));
    }
    
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  // Validate form
  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    } else if (formData.name.length < 2) {
      newErrors.name = "Name must be at least 2 characters";
    }
    
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email";
    }
    
    if (formData.phone && !/^[\+]?[1-9][\d]{0,15}$/.test(formData.phone.replace(/\D/g, ''))) {
      newErrors.phone = "Please enter a valid phone number";
    }
    
    if (formData.bio && formData.bio.length > 500) {
      newErrors.bio = "Bio cannot exceed 500 characters";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    setSuccessMessage("");
    
    try {
      await updateUserMutation.mutateAsync({
        userId,
        data: formData,
      });
      
      setSuccessMessage("User updated successfully!");
      setTimeout(() => {
        router.push(`/superadmin/users/${userId}`);
      }, 1500);
    } catch (error: any) {
      setErrors({ submit: error.message || "Failed to update user" });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Loading states
  if (authLoading || userLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-gray-200 rounded-full"></div>
            <div className="absolute top-0 left-0 w-16 h-16 border-4 border-gray-800 rounded-full animate-spin border-t-transparent"></div>
          </div>
          <p className="mt-4 text-gray-600 font-medium">
            Loading user data...
          </p>
        </div>
      </div>
    );
  }

  // Error state
  if (userError) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="relative w-20 h-20 mx-auto mb-6">
            <div className="absolute inset-0 bg-red-100 rounded-full animate-ping"></div>
            <AlertCircle className="w-20 h-20 text-red-500 relative" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-2">
            Failed to load user
          </h3>
          <p className="text-gray-600 mb-6">
            {userError.message || "User not found or you don't have permission"}
          </p>
          <button
            onClick={() => router.push("/superadmin/users")}
            className="px-6 py-3 bg-gradient-to-r from-gray-900 to-gray-800 text-white rounded-xl hover:opacity-90 transition-all shadow-lg hover:shadow-xl font-medium"
          >
            Back to Users
          </button>
        </div>
      </div>
    );
  }

  const user = userData?.user;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-6xl mx-auto p-4 md:p-6">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => router.push(`/superadmin/users/${userId}`)}
            className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-4 group"
          >
            <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" />
            Back to User Profile
          </button>
          
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                Edit User Profile
              </h1>
              <p className="text-gray-600 mt-2">
                Update user information, profile picture, and contact details
              </p>
            </div>
            
            <div className="flex items-center gap-3">
              <div className={`px-4 py-2 rounded-xl text-sm font-medium shadow-sm ${
                user?.role === "superadmin"
                  ? "bg-gradient-to-r from-purple-500 to-pink-600 text-white"
                  : user?.role === "admin"
                    ? "bg-gradient-to-r from-blue-500 to-cyan-600 text-white"
                    : "bg-gradient-to-r from-gray-500 to-gray-600 text-white"
              }`}>
                {user?.role?.charAt(0).toUpperCase() + user?.role?.slice(1)}
              </div>
            </div>
          </div>
        </div>

        {/* Success Message */}
        {successMessage && (
          <div className="mb-6 p-4 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl flex items-center gap-3 animate-in slide-in-from-top duration-300">
            <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
            <div className="text-green-800 font-medium">{successMessage}</div>
          </div>
        )}

        {/* Error Message */}
        {errors.submit && (
          <div className="mb-6 p-4 bg-gradient-to-r from-red-50 to-rose-50 border border-red-200 rounded-xl flex items-center gap-3 animate-in slide-in-from-top duration-300">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
            <div className="text-red-800 font-medium">{errors.submit}</div>
          </div>
        )}

        {/* Main Content */}
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Profile Picture & Quick Actions */}
            <div className="lg:col-span-1 space-y-6">
              {/* Profile Picture Card */}
              <div className="bg-white rounded-2xl border border-gray-200 shadow-lg p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-bold text-gray-900">Profile Picture</h2>
                  <div className="p-2 bg-gradient-to-r from-blue-100 to-cyan-100 rounded-xl">
                    <Palette className="w-5 h-5 text-blue-600" />
                  </div>
                </div>

                {/* Image Preview & Upload */}
                <div className="text-center">
                  <div className="relative inline-block group">
                    <div className="relative h-40 w-40 rounded-2xl overflow-hidden mx-auto mb-4 shadow-lg">
                      {previewImage ? (
                        <img
                          src={previewImage}
                          alt="Profile preview"
                          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                      ) : (
                        <div className="h-full w-full bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center">
                          <User className="w-16 h-16 text-white/80" />
                        </div>
                      )}
                      
                      {/* Upload Overlay */}
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                        <Camera className="w-8 h-8 text-white" />
                      </div>
                    </div>

                    {/* Remove Image Button */}
                    {previewImage && (
                      <button
                        type="button"
                        onClick={removeImage}
                        className="absolute -top-2 -right-2 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 shadow-lg transition-all duration-200 z-10"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )}

                    {/* Image Status Indicator */}
                    {isImageChanged && (
                      <div className="absolute -bottom-2 -right-2 p-2 bg-amber-500 text-white rounded-full shadow-lg z-10">
                        <div className="w-3 h-3 animate-ping bg-amber-400 rounded-full absolute inset-0"></div>
                        <div className="w-3 h-3 bg-amber-500 rounded-full relative"></div>
                      </div>
                    )}
                  </div>

                  {/* Upload Button */}
                  <button
                    type="button"
                    onClick={triggerFileInput}
                    disabled={uploading}
                    className="w-full py-3 px-4 bg-gradient-to-r from-blue-50 to-cyan-50 border-2 border-blue-200 border-dashed rounded-xl hover:from-blue-100 hover:to-cyan-100 transition-all duration-200 group"
                  >
                    <div className="flex flex-col items-center">
                      {uploading ? (
                        <Loader2 className="w-6 h-6 text-blue-600 animate-spin mb-2" />
                      ) : (
                        <Upload className="w-6 h-6 text-blue-600 mb-2 group-hover:scale-110 transition-transform" />
                      )}
                      <span className="text-sm font-medium text-blue-700">
                        {uploading ? "Uploading..." : "Upload New Photo"}
                      </span>
                      <span className="text-xs text-gray-500 mt-1">
                        PNG, JPG up to 5MB
                      </span>
                    </div>
                  </button>

                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleImageUpload}
                    accept="image/*"
                    className="hidden"
                  />

                  {errors.avatar && (
                    <p className="mt-2 text-sm text-red-600">{errors.avatar}</p>
                  )}

                  {/* Image Tips */}
                  <div className="mt-4 p-3 bg-gradient-to-r from-gray-50 to-gray-100 border border-gray-200 rounded-lg">
                    <div className="text-xs text-gray-600">
                      <div className="font-medium mb-1">Tips for best results:</div>
                      <ul className="space-y-1">
                        <li className="flex items-center">
                          <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mr-2"></div>
                          Use square images for best fit
                        </li>
                        <li className="flex items-center">
                          <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mr-2"></div>
                          Ensure good lighting and clarity
                        </li>
                        <li className="flex items-center">
                          <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mr-2"></div>
                          File size should be under 5MB
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Stats */}
              <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl shadow-xl p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Profile Stats</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center text-gray-300">
                      <Calendar className="w-4 h-4 mr-2" />
                      <span className="text-sm">Member Since</span>
                    </div>
                    <div className="font-medium text-white">
                      {user?.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', { 
                        month: 'short', 
                        year: 'numeric' 
                      }) : 'N/A'}
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center text-gray-300">
                      <Clock className="w-4 h-4 mr-2" />
                      <span className="text-sm">Last Updated</span>
                    </div>
                    <div className="font-medium text-white">
                      {user?.updatedAt ? new Date(user.updatedAt).toLocaleDateString('en-US', { 
                        month: 'short', 
                        day: 'numeric' 
                      }) : 'N/A'}
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center text-gray-300">
                      <Shield className="w-4 h-4 mr-2" />
                      <span className="text-sm">Status</span>
                    </div>
                    <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                      user?.isActive
                        ? 'bg-green-500 text-white'
                        : 'bg-red-500 text-white'
                    }`}>
                      {user?.isActive ? 'Active' : 'Inactive'}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Form Sections */}
            <div className="lg:col-span-2 space-y-6">
              {/* Personal Information */}
              <div className="bg-white rounded-2xl border border-gray-200 shadow-lg overflow-hidden">
                <div className="p-6 border-b border-gray-100">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 bg-gradient-to-r from-blue-100 to-cyan-100 rounded-xl">
                      <User className="w-5 h-5 text-blue-600" />
                    </div>
                    <h2 className="text-xl font-bold text-gray-900">
                      Personal Information
                    </h2>
                  </div>
                  <p className="text-sm text-gray-600">
                    Update user's basic personal details
                  </p>
                </div>
                
                <div className="p-6 space-y-6">
                  {/* Name & Email */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Name */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                        <Type className="w-4 h-4 mr-2 text-gray-400" />
                        Full Name *
                      </label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          className={`w-full pl-10 pr-4 py-3.5 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                            errors.name ? 'border-red-300 bg-red-50' : 'border-gray-300 hover:border-gray-400'
                          }`}
                          placeholder="Enter full name"
                        />
                      </div>
                      {errors.name && (
                        <p className="mt-1 text-sm text-red-600 flex items-center">
                          <AlertCircle className="w-3 h-3 mr-1" />
                          {errors.name}
                        </p>
                      )}
                    </div>
                    
                    {/* Email */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                        <Mail className="w-4 h-4 mr-2 text-gray-400" />
                        Email Address *
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          className={`w-full pl-10 pr-4 py-3.5 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                            errors.email ? 'border-red-300 bg-red-50' : 'border-gray-300 hover:border-gray-400'
                          }`}
                          placeholder="Enter email address"
                        />
                      </div>
                      {errors.email && (
                        <p className="mt-1 text-sm text-red-600 flex items-center">
                          <AlertCircle className="w-3 h-3 mr-1" />
                          {errors.email}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Phone & Bio */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Phone */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                        <Smartphone className="w-4 h-4 mr-2 text-gray-400" />
                        Phone Number
                      </label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                          className={`w-full pl-10 pr-4 py-3.5 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                            errors.phone ? 'border-red-300 bg-red-50' : 'border-gray-300 hover:border-gray-400'
                          }`}
                          placeholder="+251 911 234 567"
                        />
                      </div>
                      {errors.phone && (
                        <p className="mt-1 text-sm text-red-600 flex items-center">
                          <AlertCircle className="w-3 h-3 mr-1" />
                          {errors.phone}
                        </p>
                      )}
                    </div>
                    
                    {/* Bio */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                        <FileText className="w-4 h-4 mr-2 text-gray-400" />
                        Bio
                        <span className="ml-auto text-xs text-gray-500">
                          {formData.bio.length}/500
                        </span>
                      </label>
                      <div className="relative">
                        <textarea
                          name="bio"
                          value={formData.bio}
                          onChange={handleInputChange}
                          rows={3}
                          className={`w-full px-4 py-3.5 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none ${
                            errors.bio ? 'border-red-300 bg-red-50' : 'border-gray-300 hover:border-gray-400'
                          }`}
                          placeholder="Tell us about yourself..."
                        />
                      </div>
                      {errors.bio && (
                        <p className="mt-1 text-sm text-red-600 flex items-center">
                          <AlertCircle className="w-3 h-3 mr-1" />
                          {errors.bio}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Social Media */}
              <div className="bg-white rounded-2xl border border-gray-200 shadow-lg overflow-hidden">
                <div className="p-6 border-b border-gray-100">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 bg-gradient-to-r from-purple-100 to-pink-100 rounded-xl">
                      <GlobeIcon className="w-5 h-5 text-purple-600" />
                    </div>
                    <h2 className="text-xl font-bold text-gray-900">
                      Social Media Profiles
                    </h2>
                  </div>
                  <p className="text-sm text-gray-600">
                    Connect user's social media accounts
                  </p>
                </div>
                
                <div className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Twitter */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                        <Twitter className="w-4 h-4 mr-2 text-blue-400" />
                        Twitter Profile
                      </label>
                      <div className="relative">
                        <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-400">
                          @
                        </div>
                        <input
                          type="text"
                          name="social.twitter"
                          value={formData.social.twitter}
                          onChange={handleInputChange}
                          className="w-full pl-8 pr-4 py-3.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all hover:border-gray-400"
                          placeholder="username"
                        />
                      </div>
                    </div>
                    
                    {/* LinkedIn */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                        <Linkedin className="w-4 h-4 mr-2 text-blue-600" />
                        LinkedIn Profile
                      </label>
                      <div className="relative">
                        <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-600">
                          in/
                        </div>
                        <input
                          type="text"
                          name="social.linkedin"
                          value={formData.social.linkedin}
                          onChange={handleInputChange}
                          className="w-full pl-8 pr-4 py-3.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all hover:border-gray-400"
                          placeholder="username"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Address Information */}
              <div className="bg-white rounded-2xl border border-gray-200 shadow-lg overflow-hidden">
                <div className="p-6 border-b border-gray-100">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 bg-gradient-to-r from-green-100 to-emerald-100 rounded-xl">
                      <MapPin className="w-5 h-5 text-green-600" />
                    </div>
                    <h2 className="text-xl font-bold text-gray-900">
                      Address Information
                    </h2>
                  </div>
                  <p className="text-sm text-gray-600">
                    Update user's location details
                  </p>
                </div>
                
                <div className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Street */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                        <MapPin className="w-4 h-4 mr-2 text-gray-400" />
                        Street Address
                      </label>
                      <input
                        type="text"
                        name="address.street"
                        value={formData.address.street}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all hover:border-gray-400"
                        placeholder="123 Main Street"
                      />
                    </div>
                    
                    {/* City */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                        <Building className="w-4 h-4 mr-2 text-gray-400" />
                        City
                      </label>
                      <input
                        type="text"
                        name="address.city"
                        value={formData.address.city}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all hover:border-gray-400"
                        placeholder="Addis Ababa"
                      />
                    </div>
                    
                    {/* Country */}
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                        <Flag className="w-4 h-4 mr-2 text-gray-400" />
                        Country
                      </label>
                      <select
                        name="address.country"
                        value={formData.address.country}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white hover:border-gray-400 appearance-none cursor-pointer"
                      >
                        <option value="Ethiopia">🇪🇹 Ethiopia</option>
                        <option value="Kenya">🇰🇪 Kenya</option>
                        <option value="Uganda">🇺🇬 Uganda</option>
                        <option value="Tanzania">🇹🇿 Tanzania</option>
                        <option value="Rwanda">🇷🇼 Rwanda</option>
                        <option value="Other">🌍 Other Country</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              {/* Form Actions */}
              <div className="bg-white rounded-2xl border border-gray-200 shadow-lg p-6">
                <div className="flex flex-col sm:flex-row gap-4">
                  <button
                    type="button"
                    onClick={() => router.push(`/superadmin/users/${userId}`)}
                    className="flex-1 px-6 py-3.5 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 hover:border-gray-400 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting || updateUserMutation.isPending}
                    className="flex-1 px-6 py-3.5 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-xl hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl font-medium relative overflow-hidden group"
                  >
                    {isSubmitting || updateUserMutation.isPending ? (
                      <>
                        <span className="opacity-0">Saving Changes...</span>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        </div>
                      </>
                    ) : (
                      <>
                        <span className="relative z-10 flex items-center justify-center">
                          <Save className="w-5 h-5 mr-2" />
                          Save Changes
                        </span>
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-700 to-cyan-700 opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
                      </>
                    )}
                  </button>
                </div>
                
                <div className="mt-4 text-center">
                  <p className="text-sm text-gray-500 flex items-center justify-center">
                    <AlertCircle className="w-4 h-4 mr-2" />
                    Fields marked with * are required
                  </p>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}