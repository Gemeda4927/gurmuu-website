"use client";

import { X, User, Mail, Key, Phone, Shield, Globe, MessageSquare, Sparkles, Loader2, Eye, EyeOff } from "lucide-react";
import { useState, useEffect } from "react";
import { useCreateUser } from "@/lib/hooks/useSuperadmin";
import { toast } from "sonner";

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
    password: "",
    role: "user" as "user" | "admin" | "superadmin",
    phone: "",
    bio: "",
    avatar: "https://i.pravatar.cc/150?img=1",
    address: {
      street: "",
      city: "",
      country: ""
    },
    social: {
      twitter: "",
      linkedin: ""
    }
  });

  const [showPassword, setShowPassword] = useState(false);
  const [selectedAvatar, setSelectedAvatar] = useState(1);
  const [step, setStep] = useState(1);

  const createUserMutation = useCreateUser();

  const avatars = [
    "https://i.pravatar.cc/150?img=1",
    "https://i.pravatar.cc/150?img=5",
    "https://i.pravatar.cc/150?img=8",
    "https://i.pravatar.cc/150?img=11",
    "https://i.pravatar.cc/150?img=15",
    "https://i.pravatar.cc/150?img=20",
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (step < 2) {
      setStep(2);
      return;
    }

    const userData = {
      ...formData,
      avatar: avatars[selectedAvatar],
      social: {
        twitter: formData.social.twitter || `@${formData.name.split(' ')[0].toLowerCase()}`,
        linkedin: formData.social.linkedin || `linkedin.com/in/${formData.name.split(' ').join('-').toLowerCase()}`
      }
    };

    createUserMutation.mutate(userData, {
      onSuccess: () => {
        toast.success("User created successfully!", {
          description: `${formData.name} has been added to the system.`,
          icon: <Sparkles className="w-4 h-4" />,
        });
        onSuccess();
        resetForm();
      },
      onError: (error) => {
        toast.error("Failed to create user", {
          description: error.message,
        });
      },
    });
  };

  const resetForm = () => {
    setFormData({
      name: "",
      email: "",
      password: "",
      role: "user",
      phone: "",
      bio: "",
      avatar: "https://i.pravatar.cc/150?img=1",
      address: {
        street: "",
        city: "",
        country: ""
      },
      social: {
        twitter: "",
        linkedin: ""
      }
    });
    setSelectedAvatar(1);
    setStep(1);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleAvatarSelect = (index: number) => {
    setSelectedAvatar(index);
    setFormData({ ...formData, avatar: avatars[index] });
  };

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 z-50 bg-gray-900/70 backdrop-blur-sm transition-opacity" onClick={handleClose} />
      
      {/* Modal */}
      <div className="fixed inset-0 z-50 overflow-y-auto">
        <div className="flex min-h-full items-center justify-center p-4">
          <div className="relative bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden border border-gray-200">
            
            {/* Header */}
            <div className="relative bg-gradient-to-r from-gray-900 to-gray-800 p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-xl">
                    <User className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-white">
                      Create New User
                    </h2>
                    <p className="text-gray-300 text-sm mt-1">
                      {step === 1 ? "Basic Information" : "Additional Details"}
                    </p>
                  </div>
                </div>
                <button
                  onClick={handleClose}
                  className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-gray-300 hover:text-white" />
                </button>
              </div>
              
              {/* Progress Steps */}
              <div className="mt-6 flex items-center">
                {[1, 2].map((stepNumber) => (
                  <div key={stepNumber} className="flex items-center">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      step === stepNumber 
                        ? 'bg-gradient-to-r from-blue-500 to-cyan-600 text-white' 
                        : step > stepNumber 
                        ? 'bg-green-500 text-white' 
                        : 'bg-gray-700 text-gray-300'
                    }`}>
                      {step > stepNumber ? (
                        <Sparkles className="w-4 h-4" />
                      ) : (
                        stepNumber
                      )}
                    </div>
                    {stepNumber < 2 && (
                      <div className={`w-16 h-1 mx-2 ${
                        step > stepNumber ? 'bg-green-500' : 'bg-gray-700'
                      }`} />
                    )}
                  </div>
                ))}
                <span className="ml-4 text-sm text-gray-300">
                  Step {step} of 2
                </span>
              </div>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="p-6 max-h-[60vh] overflow-y-auto">
                {step === 1 ? (
                  <div className="space-y-6">
                    {/* Avatar Selection */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-3">
                        Select Avatar
                      </label>
                      <div className="flex gap-3 flex-wrap">
                        {avatars.map((avatar, index) => (
                          <button
                            key={index}
                            type="button"
                            onClick={() => handleAvatarSelect(index)}
                            className={`relative w-16 h-16 rounded-xl overflow-hidden border-2 transition-all ${
                              selectedAvatar === index
                                ? 'border-blue-500 ring-4 ring-blue-100'
                                : 'border-gray-200 hover:border-gray-300'
                            }`}
                          >
                            <img
                              src={avatar}
                              alt={`Avatar ${index + 1}`}
                              className="w-full h-full object-cover"
                            />
                            {selectedAvatar === index && (
                              <div className="absolute inset-0 bg-blue-500/20 flex items-center justify-center">
                                <Sparkles className="w-5 h-5 text-blue-600" />
                              </div>
                            )}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Basic Info */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Full Name *
                        </label>
                        <div className="relative">
                          <User className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                          <input
                            type="text"
                            required
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all"
                            placeholder="John Doe"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Email Address *
                        </label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                          <input
                            type="email"
                            required
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all"
                            placeholder="john@example.com"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Password *
                        </label>
                        <div className="relative">
                          <Key className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                          <input
                            type={showPassword ? "text" : "password"}
                            required
                            minLength={8}
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all"
                            placeholder="••••••••"
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                          >
                            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                          </button>
                        </div>
                        <p className="text-xs text-gray-500 mt-2">Minimum 8 characters</p>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Role *
                        </label>
                        <div className="relative">
                          <Shield className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                          <select
                            value={formData.role}
                            onChange={(e) => setFormData({ ...formData, role: e.target.value as any })}
                            className="w-full pl-10 pr-3 py-3 appearance-none border border-gray-300 rounded-xl focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all bg-white"
                          >
                            <option value="user">Regular User</option>
                            <option value="admin">Administrator</option>
                            <option value="superadmin">Super Administrator</option>
                          </select>
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Phone Number
                      </label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                        <input
                          type="tel"
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all"
                          placeholder="+1 (555) 123-4567"
                        />
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {/* Bio */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Bio
                      </label>
                      <div className="relative">
                        <MessageSquare className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                        <textarea
                          value={formData.bio}
                          onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                          rows={3}
                          className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all"
                          placeholder="A short bio about the user..."
                        />
                      </div>
                    </div>

                    {/* Address */}
                    <div className="space-y-4">
                      <h3 className="text-sm font-semibold text-gray-700">Address Information</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Street
                          </label>
                          <input
                            type="text"
                            value={formData.address.street}
                            onChange={(e) => setFormData({
                              ...formData,
                              address: { ...formData.address, street: e.target.value }
                            })}
                            className="w-full px-3 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all"
                            placeholder="123 Main St"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            City
                          </label>
                          <input
                            type="text"
                            value={formData.address.city}
                            onChange={(e) => setFormData({
                              ...formData,
                              address: { ...formData.address, city: e.target.value }
                            })}
                            className="w-full px-3 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all"
                            placeholder="Addis Ababa"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Country
                        </label>
                        <input
                          type="text"
                          value={formData.address.country}
                          onChange={(e) => setFormData({
                            ...formData,
                            address: { ...formData.address, country: e.target.value }
                          })}
                          className="w-full px-3 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all"
                          placeholder="Ethiopia"
                        />
                      </div>
                    </div>

                    {/* Social Links */}
                    <div className="space-y-4">
                      <h3 className="text-sm font-semibold text-gray-700">Social Media (Optional)</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Twitter
                          </label>
                          <input
                            type="text"
                            value={formData.social.twitter}
                            onChange={(e) => setFormData({
                              ...formData,
                              social: { ...formData.social, twitter: e.target.value }
                            })}
                            className="w-full px-3 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all"
                            placeholder="@username"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            LinkedIn
                          </label>
                          <input
                            type="text"
                            value={formData.social.linkedin}
                            onChange={(e) => setFormData({
                              ...formData,
                              social: { ...formData.social, linkedin: e.target.value }
                            })}
                            className="w-full px-3 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all"
                            placeholder="linkedin.com/in/username"
                          />
                        </div>
                      </div>
                    </div>

                    {/* User Preview */}
                    <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-4 border border-gray-200">
                      <h3 className="text-sm font-semibold text-gray-700 mb-3">Preview</h3>
                      <div className="flex items-center gap-3">
                        <img
                          src={avatars[selectedAvatar]}
                          alt="Preview"
                          className="w-12 h-12 rounded-xl"
                        />
                        <div>
                          <div className="font-medium text-gray-900">{formData.name || "John Doe"}</div>
                          <div className="text-sm text-gray-600">{formData.email || "john@example.com"}</div>
                          <div className={`text-xs px-2 py-0.5 rounded-full inline-block mt-1 ${
                            formData.role === 'superadmin'
                              ? 'bg-purple-100 text-purple-800'
                              : formData.role === 'admin'
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}>
                            {formData.role || "user"}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
                <div className="flex items-center justify-between">
                  <button
                    type="button"
                    onClick={step === 1 ? handleClose : () => setStep(1)}
                    className="px-5 py-2.5 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 font-medium transition-all hover:shadow-sm"
                  >
                    {step === 1 ? "Cancel" : "Back"}
                  </button>
                  
                  <div className="flex items-center gap-3">
                    {step === 2 && (
                      <button
                        type="button"
                        onClick={() => setStep(1)}
                        className="px-4 py-2 text-gray-600 hover:text-gray-900 font-medium"
                      >
                        Edit Details
                      </button>
                    )}
                    <button
                      type="submit"
                      disabled={createUserMutation.isPending}
                      className="px-6 py-2.5 bg-gradient-to-r from-gray-900 to-gray-800 text-white rounded-xl hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed font-medium shadow-lg hover:shadow-xl transition-all flex items-center gap-2"
                    >
                      {createUserMutation.isPending ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Creating...
                        </>
                      ) : step === 1 ? (
                        <>
                          Continue
                          <Sparkles className="w-4 h-4" />
                        </>
                      ) : (
                        <>
                          Create User
                          <User className="w-4 h-4" />
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}