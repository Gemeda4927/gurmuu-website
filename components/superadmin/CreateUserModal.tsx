"use client";

import {
  X,
  User,
  Mail,
  Key,
  Phone,
  MessageSquare,
  Twitter,
  Linkedin,
  MapPin,
  Globe,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import api from "@/lib/api/api"; // Import your API client

interface CreateUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function CreateUserModal({
  isOpen,
  onClose,
  onSuccess,
}: CreateUserModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "123456",
    phone: "",
    avatar: "https://i.pravatar.cc/150?img=1",
    bio: "",
    social: {
      twitter: "",
      linkedin: "",
    },
    address: {
      street: "",
      city: "",
      country: "",
    },
  });

  const [isLoading, setIsLoading] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Prepare data for admin endpoint
    const userData = {
      name: formData.name.trim(),
      email: formData.email.trim().toLowerCase(),
      password: formData.password,
      phone: formData.phone || undefined,
      avatar: formData.avatar || "https://i.pravatar.cc/150?img=1",
      bio: formData.bio || undefined,
      role: "user",
      social: formData.social.twitter || formData.social.linkedin ? {
        twitter: formData.social.twitter || undefined,
        linkedin: formData.social.linkedin || undefined,
      } : undefined,
      address: formData.address.street || formData.address.city || formData.address.country ? {
        street: formData.address.street || undefined,
        city: formData.address.city || undefined,
        country: formData.address.country || undefined,
      } : undefined,
    };

    console.log("📤 Creating user with data:", userData);

    setIsLoading(true);

    try {
      // Use your API client instead of direct fetch
      const response = await api.post("/admin/users", userData);
      
      console.log("✅ User created successfully:", response.data);
      toast.success("✨ User Created!", {
        description: `${formData.name} has been added to the system.`,
        duration: 3000,
      });

      resetForm();
      onSuccess();
    } catch (error: any) {
      console.error("❌ Create user error:", error);
      
      // Get error message from Axios response
      const errorMessage = error.response?.data?.message || 
                          error.response?.data?.error || 
                          error.message || 
                          "Please check the form and try again.";
      
      toast.error("Failed to create user", {
        description: errorMessage,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      email: "",
      password: "123456",
      phone: "",
      avatar: "https://i.pravatar.cc/150?img=1",
      bio: "",
      social: { twitter: "", linkedin: "" },
      address: {
        street: "",
        city: "",
        country: "",
      },
    });
    setShowAdvanced(false);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 animate-fadeIn"
        onClick={handleClose}
      />

      {/* Modal Container */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div
          className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden animate-scaleIn"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="bg-gradient-to-br from-purple-600 via-violet-500 to-pink-500 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-white/20 rounded-xl backdrop-blur-sm border border-white/30">
                  <User className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white tracking-tight">
                    Create New User
                  </h2>
                  <p className="text-white/90 text-sm">
                    Add a new member to the system
                  </p>
                </div>
              </div>
              <button
                onClick={handleClose}
                className="p-2 hover:bg-white/15 rounded-xl transition-all duration-200 hover:rotate-90"
              >
                <X className="w-5 h-5 text-white" />
              </button>
            </div>
          </div>

          {/* Form Content */}
          <div className="p-6 max-h-[65vh] overflow-y-auto">
            <form
              onSubmit={handleSubmit}
              className="space-y-5"
            >
              {/* Name Field */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="block text-sm font-semibold text-gray-900">
                    Full Name
                  </label>
                  <span className="text-xs text-rose-500">
                    *Required
                  </span>
                </div>
                <div className="relative group">
                  <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                    <User className="w-5 h-5 text-gray-400 group-hover:text-purple-500 transition-colors" />
                  </div>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        name: e.target.value,
                      })
                    }
                    className="w-full pl-11 pr-4 py-3.5 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-400 transition-all duration-300 placeholder:text-gray-500 text-gray-900"
                    placeholder="Enter full name"
                  />
                </div>
              </div>

              {/* Email Field */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="block text-sm font-semibold text-gray-900">
                    Email Address
                  </label>
                  <span className="text-xs text-rose-500">
                    *Required
                  </span>
                </div>
                <div className="relative group">
                  <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                    <Mail className="w-5 h-5 text-gray-400 group-hover:text-purple-500 transition-colors" />
                  </div>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        email: e.target.value,
                      })
                    }
                    className="w-full pl-11 pr-4 py-3.5 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-400 transition-all duration-300 placeholder:text-gray-500 text-gray-900"
                    placeholder="user@example.com"
                  />
                </div>
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-900">
                  Password
                </label>
                <div className="relative group">
                  <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                    <Key className="w-5 h-5 text-gray-400 group-hover:text-purple-500 transition-colors" />
                  </div>
                  <input
                    type="text" // Changed from password to text for visibility
                    required
                    value={formData.password}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        password: e.target.value,
                      })
                    }
                    className="w-full pl-11 pr-4 py-3.5 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-400 transition-all duration-300 placeholder:text-gray-500 text-gray-900"
                    placeholder="Enter password"
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Default: 123456 (user can change later)
                </p>
              </div>

              {/* Role Information */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-900">
                  User Role
                </label>
                <div className="py-3.5 bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl flex flex-col items-center justify-center gap-1.5">
                  <User className="w-5 h-5 text-gray-600" />
                  <span className="text-sm font-medium text-gray-700">
                    Regular User
                  </span>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  All new users are created as regular users
                </p>
              </div>

              {/* Optional Fields Toggle */}
              <div className="pt-2">
                <button
                  type="button"
                  onClick={() =>
                    setShowAdvanced(!showAdvanced)
                  }
                  className="w-full py-3 bg-gradient-to-r from-gray-50 to-gray-100 border border-gray-200 rounded-xl hover:from-gray-100 hover:to-gray-200 transition-all duration-300 group"
                >
                  <div className="flex items-center justify-center gap-2">
                    <Globe
                      className={`w-4 h-4 text-gray-600 transition-transform duration-300 ${showAdvanced ? "rotate-180" : ""}`}
                    />
                    <span className="text-sm font-medium text-gray-700">
                      {showAdvanced ? "Hide" : "Show"} Additional Details
                    </span>
                  </div>
                </button>
              </div>

              {/* Optional Fields */}
              {showAdvanced && (
                <div className="space-y-5 animate-slideDown">
                  {/* Phone */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Phone Number
                    </label>
                    <div className="relative group">
                      <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            phone: e.target.value,
                          })
                        }
                        className="w-full pl-11 pr-4 py-3 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-400 transition-all duration-300 placeholder:text-gray-500 text-gray-900"
                        placeholder="+1 (555) 123-4567"
                      />
                    </div>
                  </div>

                  {/* Bio */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Bio
                    </label>
                    <div className="relative group">
                      <MessageSquare className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                      <textarea
                        value={formData.bio}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            bio: e.target.value,
                          })
                        }
                        rows={3}
                        className="w-full pl-11 pr-4 py-3 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-400 resize-none transition-all duration-300 placeholder:text-gray-500 text-gray-900"
                        placeholder="A short bio about the user..."
                      />
                    </div>
                  </div>

                  {/* Social Media */}
                  <div className="space-y-3">
                    <label className="block text-sm font-medium text-gray-700">
                      Social Media Links
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="relative group">
                        <Twitter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                          type="text"
                          value={formData.social.twitter}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              social: {
                                ...formData.social,
                                twitter: e.target.value,
                              },
                            })
                          }
                          className="w-full pl-10 pr-4 py-3 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-400 placeholder:text-gray-500 text-gray-900"
                          placeholder="@username"
                        />
                      </div>
                      <div className="relative group">
                        <Linkedin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                          type="text"
                          value={formData.social.linkedin}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              social: {
                                ...formData.social,
                                linkedin: e.target.value,
                              },
                            })
                          }
                          className="w-full pl-10 pr-4 py-3 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-400 placeholder:text-gray-500 text-gray-900"
                          placeholder="linkedin.com/in/username"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Address */}
                  <div className="space-y-3">
                    <label className="block text-sm font-medium text-gray-700">
                      Address Information
                    </label>
                    <div className="relative group">
                      <MapPin className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                      <input
                        type="text"
                        value={formData.address.street}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            address: {
                              ...formData.address,
                              street: e.target.value,
                            },
                          })
                        }
                        className="w-full pl-11 pr-4 py-3 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-400 placeholder:text-gray-500 text-gray-900 mb-2"
                        placeholder="Street Address"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <input
                        type="text"
                        value={formData.address.city}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            address: {
                              ...formData.address,
                              city: e.target.value,
                            },
                          })
                        }
                        className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-400 placeholder:text-gray-500 text-gray-900"
                        placeholder="City"
                      />
                      <input
                        type="text"
                        value={formData.address.country}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            address: {
                              ...formData.address,
                              country: e.target.value,
                            },
                          })
                        }
                        className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-400 placeholder:text-gray-500 text-gray-900"
                        placeholder="Country"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={handleClose}
                  className="px-5 py-2.5 text-gray-700 hover:text-gray-900 font-medium transition-colors rounded-xl hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={
                    isLoading ||
                    !formData.name ||
                    !formData.email ||
                    !formData.password
                  }
                  className="px-6 py-2.5 bg-gradient-to-r from-purple-600 to-pink-500 text-white font-medium rounded-xl hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 min-w-[120px] justify-center"
                >
                  {isLoading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Creating...
                    </>
                  ) : (
                    "Create User"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Animation Styles */}
      <style jsx global>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        @keyframes scaleIn {
          from {
            opacity: 0;
            transform: scale(0.9);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-8px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.15s ease-out;
        }
        .animate-scaleIn {
          animation: scaleIn 0.2s ease-out;
        }
        .animate-slideDown {
          animation: slideDown 0.25s ease-out;
        }
      `}</style>
    </>
  );
}