"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useSignup } from "@/lib/hooks/useAuth";
import useAuthStore from "@/lib/store/auth.store";
import {
  User,
  Mail,
  Lock,
  Phone,
  Image as ImageIcon,
  MessageSquare,
  Twitter,
  Linkedin,
  MapPin,
  CheckCircle,
  ArrowRight,
  Loader2,
  Eye,
  EyeOff,
  Rocket,
  PartyPopper,
  KeyRound,
  ShieldCheck,
  Users,
  Sparkles,
  Calendar,
  Globe,
  Briefcase,
  Award,
  Zap,
  ChevronRight,
  X,
} from "lucide-react";

export default function SignupPage() {
  const router = useRouter();
  const signupMutation = useSignup();
  const { isAuthenticated, hasHydrated } = useAuthStore();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
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

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [activeStep, setActiveStep] = useState(1);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showSuccess, setShowSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Check if already authenticated
  useEffect(() => {
    if (hasHydrated && isAuthenticated) {
      router.push("/dashboard");
    }
  }, [hasHydrated, isAuthenticated, router]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    if (name.startsWith("social.")) {
      const field = name.split(".")[1];
      setFormData((prev) => ({
        ...prev,
        social: {
          ...prev.social,
          [field]: value,
        },
      }));
    } else if (name.startsWith("address.")) {
      const field = name.split(".")[1];
      setFormData((prev) => ({
        ...prev,
        address: {
          ...prev.address,
          [field]: value,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }

    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validateStep = () => {
    const newErrors: Record<string, string> = {};

    if (activeStep === 1) {
      if (!formData.name.trim()) newErrors.name = "Name is required";
      if (!formData.email.trim()) newErrors.email = "Email is required";
      else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Invalid email";

      if (!formData.password) newErrors.password = "Password is required";
      else if (formData.password.length < 8) newErrors.password = "Minimum 8 characters";
      else if (!/(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
        newErrors.password = "Include uppercase and number";
      }

      if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = "Passwords do not match";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const nextStep = () => {
    if (validateStep()) {
      setActiveStep((prev) => Math.min(prev + 1, 3));
    }
  };

  const prevStep = () => {
    setActiveStep((prev) => Math.max(prev - 1, 1));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateStep()) return;
    
    setIsSubmitting(true);

    const apiData = {
      name: formData.name,
      email: formData.email.toLowerCase(),
      password: formData.password,
      phone: formData.phone || undefined,
      avatar: formData.avatar,
      bio: formData.bio || undefined,
      social:
        formData.social.twitter || formData.social.linkedin
          ? {
              twitter: formData.social.twitter || undefined,
              linkedin: formData.social.linkedin || undefined,
            }
          : undefined,
      address:
        formData.address.street || formData.address.city || formData.address.country
          ? {
              street: formData.address.street || undefined,
              city: formData.address.city || undefined,
              country: formData.address.country || undefined,
            }
          : undefined,
    };

    try {
      await signupMutation.mutateAsync(apiData);
      setShowSuccess(true);
      setTimeout(() => {
        router.push("/dashboard");
      }, 3000);
    } catch (error) {
      console.error("Signup failed:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!hasHydrated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-white to-gray-100">
        <div className="text-center">
          <div className="relative w-24 h-24">
            <div className="absolute inset-0 border-4 border-gray-200 rounded-full"></div>
            <div className="absolute inset-0 border-4 border-blue-500 rounded-full animate-spin border-t-transparent"></div>
          </div>
          <p className="mt-6 text-gray-600 font-medium">Loading...</p>
        </div>
      </div>
    );
  }

  const steps = [
    { number: 1, title: "Account", icon: <User className="w-5 h-5" /> },
    { number: 2, title: "Profile", icon: <User className="w-5 h-5" /> },
    { number: 3, title: "Social", icon: <Users className="w-5 h-5" /> },
  ];

  const features = [
    {
      icon: <ShieldCheck className="w-6 h-6" />,
      title: "Enterprise Security",
      description: "Bank-level encryption for your data",
      color: "from-blue-500 to-cyan-500",
    },
    {
      icon: <Zap className="w-6 h-6" />,
      title: "Lightning Fast",
      description: "Optimized for maximum performance",
      color: "from-purple-500 to-pink-500",
    },
    {
      icon: <Award className="w-6 h-6" />,
      title: "Premium Features",
      description: "Access to exclusive tools",
      color: "from-orange-500 to-yellow-500",
    },
    {
      icon: <Globe className="w-6 h-6" />,
      title: "Global Access",
      description: "Available anywhere, anytime",
      color: "from-green-500 to-emerald-500",
    },
  ];

  return (
    <>
      {/* Circular Loading Modal */}
      {isSubmitting && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="relative">
            {/* Outer ring */}
            <div className="w-48 h-48 border-4 border-white/10 rounded-full animate-pulse"></div>
            
            {/* Middle ring */}
            <div className="absolute inset-8 border-4 border-white/20 rounded-full animate-spin"></div>
            
            {/* Inner ring */}
            <div className="absolute inset-16 border-4 border-blue-500 rounded-full animate-spin border-t-transparent border-r-transparent">
              <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-blue-500 rounded-full"></div>
            </div>
            
            {/* Content */}
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mb-4">
                <KeyRound className="w-8 h-8 text-white" />
              </div>
              <p className="text-white font-semibold text-lg">Creating Account</p>
              <p className="text-white/70 text-sm mt-2">Please wait a moment...</p>
            </div>
          </div>
        </div>
      )}

      {/* Success Modal */}
      {showSuccess && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="bg-white rounded-3xl p-12 max-w-md text-center animate-scaleIn">
            <div className="relative mb-8">
              <div className="w-32 h-32 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center mx-auto">
                <PartyPopper className="w-16 h-16 text-white" />
              </div>
              <div className="absolute -top-2 -right-2 w-12 h-12 bg-yellow-400 rounded-full flex items-center justify-center animate-bounce">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
            </div>
            <h3 className="text-3xl font-bold text-gray-900 mb-4">Welcome Aboard!</h3>
            <p className="text-gray-600 mb-8">
              Your account has been created successfully. Redirecting you to the dashboard...
            </p>
            <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-green-400 to-emerald-500 animate-progress"></div>
            </div>
          </div>
        </div>
      )}

      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
        {/* Floating Background Elements */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute w-96 h-96 rounded-full mix-blend-multiply filter blur-3xl opacity-5 animate-float"
              style={{
                background: `linear-gradient(45deg, 
                  ${i % 3 === 0 ? '#3b82f6' : i % 3 === 1 ? '#8b5cf6' : '#10b981'})`,
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 5}s`,
              }}
            />
          ))}
        </div>

        <div className="relative container mx-auto px-4 py-12">
          {/* Header */}
          <header className="flex justify-between items-center mb-20">
            <div className="flex items-center space-x-4">
              <div className="w-14 h-14 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-xl shadow-blue-500/20">
                <KeyRound className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Nexus
                </h1>
                <p className="text-gray-500 font-medium">Enterprise Platform</p>
              </div>
            </div>
            <div className="hidden md:flex items-center space-x-6">
              <Link
                href="/login"
                className="text-gray-600 hover:text-blue-600 font-medium transition-colors"
              >
                Sign In
              </Link>
              <Link
                href="/login"
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold hover:shadow-xl hover:shadow-blue-500/25 transition-all"
              >
                Get Started
              </Link>
            </div>
          </header>

          <div className="max-w-7xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              {/* Left Column */}
              <div className="space-y-12">
                <div>
                  <div className="inline-flex items-center px-5 py-2.5 rounded-full bg-gradient-to-r from-blue-100 to-purple-100 text-blue-700 mb-8">
                    <Sparkles className="w-5 h-5 mr-2" />
                    <span className="font-semibold">Join Thousands of Teams</span>
                  </div>

                  <h1 className="text-6xl font-bold text-gray-900 mb-8 leading-tight">
                    Build Something
                    <span className="block bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                      Extraordinary
                    </span>
                  </h1>

                  <p className="text-xl text-gray-600 mb-12 max-w-lg">
                    Join our platform trusted by industry leaders worldwide. 
                    Create secure accounts with advanced role-based access control.
                  </p>
                </div>

                {/* Features Grid */}
                <div className="grid md:grid-cols-2 gap-6">
                  {features.map((feature, idx) => (
                    <div
                      key={idx}
                      className="group bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:border-blue-200/50 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/10"
                    >
                      <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                        {feature.icon}
                      </div>
                      <h3 className="text-lg font-bold text-gray-900 mb-2">
                        {feature.title}
                      </h3>
                      <p className="text-gray-600 text-sm">
                        {feature.description}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-8">
                  <div className="text-center">
                    <div className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                      10K+
                    </div>
                    <div className="text-gray-500 font-medium mt-2">Active Users</div>
                  </div>
                  <div className="text-center">
                    <div className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                      99.9%
                    </div>
                    <div className="text-gray-500 font-medium mt-2">Uptime</div>
                  </div>
                  <div className="text-center">
                    <div className="text-4xl font-bold bg-gradient-to-r from-pink-600 to-orange-600 bg-clip-text text-transparent">
                      24/7
                    </div>
                    <div className="text-gray-500 font-medium mt-2">Support</div>
                  </div>
                </div>
              </div>

              {/* Right Column - Form */}
              <div className="relative">
                <div className="absolute -inset-4 bg-gradient-to-r from-blue-500 to-purple-600 rounded-3xl blur-2xl opacity-20"></div>
                <div className="relative bg-white rounded-3xl shadow-2xl p-10 border border-white/20 backdrop-blur-sm">
                  {/* Steps Indicator */}
                  <div className="flex items-center justify-between mb-12">
                    {steps.map((step, index) => (
                      <div key={step.number} className="flex items-center">
                        <div className="flex flex-col items-center">
                          <div className={`w-14 h-14 rounded-full flex items-center justify-center transition-all duration-300 ${activeStep >= step.number
                              ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg shadow-blue-500/30"
                              : "bg-gray-100 text-gray-400"
                            }`}>
                            {activeStep > step.number ? (
                              <CheckCircle className="w-6 h-6" />
                            ) : (
                              step.icon
                            )}
                          </div>
                          <span className={`mt-3 text-sm font-medium ${activeStep >= step.number ? "text-blue-600" : "text-gray-400"}`}>
                            {step.title}
                          </span>
                        </div>
                        {index < steps.length - 1 && (
                          <div className="w-12 h-1 mx-4 bg-gray-200">
                            <div
                              className={`h-full transition-all duration-500 ${activeStep > step.number ? "w-full bg-gradient-to-r from-blue-600 to-purple-600" : "w-0"}`}
                            ></div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>

                  <h2 className="text-3xl font-bold text-gray-900 mb-2">
                    Create Your Account
                  </h2>
                  <p className="text-gray-500 mb-10">
                    Step {activeStep} of 3 • Join our exclusive platform
                  </p>

                  <form onSubmit={handleSubmit} className="space-y-8">
                    {/* Step 1 */}
                    {activeStep === 1 && (
                      <div className="space-y-6 animate-fadeIn">
                        <div className="grid md:grid-cols-2 gap-6">
                          <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                              Full Name
                            </label>
                            <input
                              type="text"
                              name="name"
                              value={formData.name}
                              onChange={handleChange}
                              className="w-full px-5 py-4 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                              placeholder="John Doe"
                            />
                            {errors.name && (
                              <p className="text-red-500 text-sm mt-2">{errors.name}</p>
                            )}
                          </div>

                          <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                              Email Address
                            </label>
                            <input
                              type="email"
                              name="email"
                              value={formData.email}
                              onChange={handleChange}
                              className="w-full px-5 py-4 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                              placeholder="john@example.com"
                            />
                            {errors.email && (
                              <p className="text-red-500 text-sm mt-2">{errors.email}</p>
                            )}
                          </div>
                        </div>

                        <div className="grid md:grid-cols-2 gap-6">
                          <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                              Password
                            </label>
                            <div className="relative">
                              <input
                                type={showPassword ? "text" : "password"}
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                className="w-full px-5 py-4 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all pr-12"
                                placeholder="••••••••"
                              />
                              <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-blue-600"
                              >
                                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                              </button>
                            </div>
                            {errors.password && (
                              <p className="text-red-500 text-sm mt-2">{errors.password}</p>
                            )}
                          </div>

                          <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                              Confirm Password
                            </label>
                            <div className="relative">
                              <input
                                type={showConfirmPassword ? "text" : "password"}
                                name="confirmPassword"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                className="w-full px-5 py-4 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all pr-12"
                                placeholder="••••••••"
                              />
                              <button
                                type="button"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-blue-600"
                              >
                                {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                              </button>
                            </div>
                            {errors.confirmPassword && (
                              <p className="text-red-500 text-sm mt-2">{errors.confirmPassword}</p>
                            )}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Step 2 */}
                    {activeStep === 2 && (
                      <div className="space-y-6 animate-fadeIn">
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Phone Number
                          </label>
                          <input
                            type="tel"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            className="w-full px-5 py-4 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                            placeholder="+1 (555) 123-4567"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Bio
                          </label>
                          <textarea
                            name="bio"
                            value={formData.bio}
                            onChange={handleChange}
                            className="w-full px-5 py-4 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                            rows={3}
                            placeholder="Tell us about yourself..."
                          />
                        </div>
                      </div>
                    )}

                    {/* Step 3 */}
                    {activeStep === 3 && (
                      <div className="space-y-6 animate-fadeIn">
                        <div className="grid md:grid-cols-2 gap-6">
                          <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                              Twitter
                            </label>
                            <input
                              type="text"
                              name="social.twitter"
                              value={formData.social.twitter}
                              onChange={handleChange}
                              className="w-full px-5 py-4 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                              placeholder="@username"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                              LinkedIn
                            </label>
                            <input
                              type="text"
                              name="social.linkedin"
                              value={formData.social.linkedin}
                              onChange={handleChange}
                              className="w-full px-5 py-4 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                              placeholder="linkedin.com/in/username"
                            />
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Navigation */}
                    <div className="flex justify-between items-center pt-10">
                      {activeStep > 1 ? (
                        <button
                          type="button"
                          onClick={prevStep}
                          className="px-8 py-4 rounded-xl border border-gray-300 text-gray-700 hover:bg-gray-50 transition-all font-medium flex items-center group"
                        >
                          <ChevronRight className="w-5 h-5 mr-2 transform rotate-180 group-hover:-translate-x-1 transition-transform" />
                          Back
                        </button>
                      ) : (
                        <div></div>
                      )}

                      {activeStep < 3 ? (
                        <button
                          type="button"
                          onClick={nextStep}
                          className="px-10 py-4 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold hover:shadow-xl hover:shadow-blue-500/25 transition-all flex items-center group"
                        >
                          Continue
                          <ChevronRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                        </button>
                      ) : (
                        <button
                          type="submit"
                          disabled={isSubmitting}
                          className="px-10 py-4 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold hover:shadow-xl hover:shadow-purple-500/25 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center group"
                        >
                          <Rocket className="w-5 h-5 mr-2 group-hover:-translate-y-1 transition-transform" />
                          Create Account
                        </button>
                      )}
                    </div>
                  </form>

                  <div className="mt-12 pt-8 border-t border-gray-100">
                    <p className="text-center text-gray-500 text-sm">
                      By signing up, you agree to our{" "}
                      <a href="#" className="text-blue-600 hover:text-blue-500 font-medium">
                        Terms of Service
                      </a>{" "}
                      and{" "}
                      <a href="#" className="text-blue-600 hover:text-blue-500 font-medium">
                        Privacy Policy
                      </a>
                    </p>
                    <p className="text-center text-gray-500 text-sm mt-4">
                      Already have an account?{" "}
                      <Link href="/login" className="text-blue-600 hover:text-blue-500 font-semibold">
                        Sign in here
                      </Link>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-20 text-center">
          <p className="text-gray-400 text-sm">
            © {new Date().getFullYear()} Nexus Platform. All rights reserved.
          </p>
        </div>
      </div>

      <style jsx global>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0) rotate(0deg);
          }
          33% {
            transform: translateY(-30px) rotate(120deg);
          }
          66% {
            transform: translateY(15px) rotate(240deg);
          }
        }
        
        @keyframes scaleIn {
          from {
            transform: scale(0.9);
            opacity: 0;
          }
          to {
            transform: scale(1);
            opacity: 1;
          }
        }
        
        @keyframes progress {
          from {
            width: 100%;
          }
          to {
            width: 0%;
          }
        }
        
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-float {
          animation: float 20s infinite linear;
        }
        
        .animate-scaleIn {
          animation: scaleIn 0.3s ease-out;
        }
        
        .animate-progress {
          animation: progress 3s linear forwards;
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out;
        }
      `}</style>
    </>
  );
}