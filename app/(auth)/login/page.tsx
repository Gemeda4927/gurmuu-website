"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useLogin } from "@/lib/hooks/useAuth";
import { useAuthStore } from "@/lib/store/auth.store";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  Loader2,
  Shield,
  KeyRound,
  Sparkles,
  CheckCircle,
  AlertCircle,
  ShieldCheck,
  LogIn,
  Users,
  Zap,
  Star,
  Building,
  Target,
  Layers,
  ArrowLeft,
  User as UserIcon,
  Crown,
  Key,
  Rocket,
  Globe,
  Fingerprint,
  SparklesIcon,
  PartyPopper,
  ChevronRight,
  Cpu,
  Server,
} from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const loginMutation = useLogin();

  const { user, isAuthenticated, hasHydrated } =
    useAuthStore();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] =
    useState(false);
  const [errors, setErrors] = useState<
    Record<string, string>
  >({});
  const [rememberMe, setRememberMe] =
    useState(false);
  const [showSuccess, setShowSuccess] =
    useState(false);
  const [isSubmitting, setIsSubmitting] =
    useState(false);

  useEffect(() => {
    if (!hasHydrated || !isAuthenticated || !user)
      return;

    console.log(user.role);
    switch (user.role) {
      case "superadmin":
        router.push("/superadmin");
        break;
      case "admin":
        router.push("/admin");
        break;
      case "user":
      default:
        router.push("/dashboard");
        break;
    }
  }, [
    hasHydrated,
    isAuthenticated,
    user,
    router,
  ]);

  // Show success message
  useEffect(() => {
    if (loginMutation.isSuccess) {
      setShowSuccess(true);
      const timer = setTimeout(() => {
        setShowSuccess(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [loginMutation.isSuccess]);

  // Handle submission loading state
  useEffect(() => {
    if (loginMutation.isPending) {
      setIsSubmitting(true);
    } else {
      setIsSubmitting(false);
    }
  }, [loginMutation.isPending]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (
      !/\S+@\S+\.\S+/.test(formData.email)
    ) {
      newErrors.email = "Invalid email format";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password =
        "Password must be at least 6 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    if (!validateForm() || isSubmitting) return;

    const credentials = {
      email: formData.email.toLowerCase(),
      password: formData.password,
    };

    try {
      await loginMutation.mutateAsync(
        credentials
      );
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  const handleDemoLogin = (
    role: "user" | "admin" | "superadmin"
  ) => {
    if (isSubmitting) return;

    const demoCredentials = {
      email: `${role}@demo.com`,
      password: "demopassword123",
    };

    setFormData(demoCredentials);

    // Auto submit after a short delay
    setTimeout(() => {
      const formEvent = new Event("submit", {
        bubbles: true,
        cancelable: true,
      });
      const form = document.querySelector("form");
      if (form) {
        form.dispatchEvent(formEvent);
      }
    }, 500);
  };

  if (!hasHydrated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-white to-gray-100">
        <div className="text-center">
          <div className="relative w-24 h-24">
            <div className="absolute inset-0 border-4 border-gray-200 rounded-full"></div>
            <div className="absolute inset-0 border-4 border-blue-500 rounded-full animate-spin border-t-transparent"></div>
          </div>
          <p className="mt-6 text-gray-600 font-medium">
            Loading authentication...
          </p>
        </div>
      </div>
    );
  }

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
              <p className="text-white font-semibold text-lg">
                Authenticating
              </p>
              <p className="text-white/70 text-sm mt-2">
                Please wait a moment...
              </p>
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
            <h3 className="text-3xl font-bold text-gray-900 mb-4">
              Login Successful!
            </h3>
            <p className="text-gray-600 mb-8">
              Redirecting you to the dashboard...
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
                  ${i % 3 === 0 ? "#3b82f6" : i % 3 === 1 ? "#8b5cf6" : "#10b981"})`,
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
                <p className="text-gray-500 font-medium">
                  Enterprise Platform
                </p>
              </div>
            </div>
            <div className="hidden md:flex items-center space-x-6">
              <Link
                href="/signup"
                className="text-gray-600 hover:text-blue-600 font-medium transition-colors"
              >
                Sign Up
              </Link>
              <Link
                href="/signup"
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
                    <span className="font-semibold">
                      Welcome Back
                    </span>
                  </div>

                  <h1 className="text-6xl font-bold text-gray-900 mb-8 leading-tight">
                    Secure Access to
                    <span className="block bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                      Your Workspace
                    </span>
                  </h1>

                  <p className="text-xl text-gray-600 mb-12 max-w-lg">
                    Access your personalized
                    dashboard with advanced
                    security features and
                    role-based control systems.
                  </p>
                </div>

                {/* Features Grid */}
                <div className="grid md:grid-cols-2 gap-6">
                  {[
                    {
                      icon: (
                        <ShieldCheck className="w-6 h-6" />
                      ),
                      title:
                        "Enterprise Security",
                      description:
                        "Bank-level encryption for your data",
                      color:
                        "from-blue-500 to-cyan-500",
                    },
                    {
                      icon: (
                        <Zap className="w-6 h-6" />
                      ),
                      title: "Lightning Fast",
                      description:
                        "Optimized for maximum performance",
                      color:
                        "from-purple-500 to-pink-500",
                    },
                    {
                      icon: (
                        <Cpu className="w-6 h-6" />
                      ),
                      title: "Advanced Tools",
                      description:
                        "Access to premium features",
                      color:
                        "from-orange-500 to-yellow-500",
                    },
                    {
                      icon: (
                        <Globe className="w-6 h-6" />
                      ),
                      title: "Global Access",
                      description:
                        "Available anywhere, anytime",
                      color:
                        "from-green-500 to-emerald-500",
                    },
                  ].map((feature, idx) => (
                    <div
                      key={idx}
                      className="group bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:border-blue-200/50 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/10"
                    >
                      <div
                        className={`w-14 h-14 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}
                      >
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

                {/* Demo Login Section */}
                <div className="pt-8">
                  <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                    <Key className="w-5 h-5 mr-2 text-blue-600" />
                    Quick Test Drive
                  </h3>
                  <div className="grid grid-cols-3 gap-4">
                    <button
                      onClick={() =>
                        handleDemoLogin("user")
                      }
                      disabled={isSubmitting}
                      className="p-4 rounded-xl border-2 border-gray-200 hover:border-blue-400 hover:bg-gradient-to-br hover:from-blue-50 hover:to-cyan-50 transition-all duration-300 flex flex-col items-center group disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <div className="w-12 h-12 bg-gradient-to-r from-blue-100 to-cyan-100 rounded-lg flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                        <UserIcon className="w-6 h-6 text-blue-600" />
                      </div>
                      <span className="text-sm font-semibold text-gray-900">
                        User Demo
                      </span>
                      <span className="text-xs text-gray-500 mt-1">
                        Standard access
                      </span>
                    </button>

                    <button
                      onClick={() =>
                        handleDemoLogin("admin")
                      }
                      disabled={isSubmitting}
                      className="p-4 rounded-xl border-2 border-gray-200 hover:border-purple-400 hover:bg-gradient-to-br hover:from-purple-50 hover:to-pink-50 transition-all duration-300 flex flex-col items-center group disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <div className="w-12 h-12 bg-gradient-to-r from-purple-100 to-pink-100 rounded-lg flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                        <Shield className="w-6 h-6 text-purple-600" />
                      </div>
                      <span className="text-sm font-semibold text-gray-900">
                        Admin Demo
                      </span>
                      <span className="text-xs text-gray-500 mt-1">
                        Elevated access
                      </span>
                    </button>

                    <button
                      onClick={() =>
                        handleDemoLogin(
                          "superadmin"
                        )
                      }
                      disabled={isSubmitting}
                      className="p-4 rounded-xl border-2 border-gray-200 hover:border-green-400 hover:bg-gradient-to-br hover:from-green-50 hover:to-emerald-50 transition-all duration-300 flex flex-col items-center group disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <div className="w-12 h-12 bg-gradient-to-r from-green-100 to-emerald-100 rounded-lg flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                        <Crown className="w-6 h-6 text-green-600" />
                      </div>
                      <span className="text-sm font-semibold text-gray-900">
                        Super Admin
                      </span>
                      <span className="text-xs text-gray-500 mt-1">
                        Full control
                      </span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Right Column - Form */}
              <div className="relative">
                <div className="absolute -inset-4 bg-gradient-to-r from-blue-500 to-purple-600 rounded-3xl blur-2xl opacity-20"></div>
                <div className="relative bg-white rounded-3xl shadow-2xl p-10 border border-white/20 backdrop-blur-sm">
                  <div className="text-center mb-10">
                    <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/30">
                      <KeyRound className="w-10 h-10 text-white" />
                    </div>
                    <h2 className="text-3xl font-bold text-gray-900 mb-3">
                      Secure Login Portal
                    </h2>
                    <p className="text-gray-600">
                      Enter your credentials to
                      access your secure workspace
                    </p>
                  </div>

                  {/* Error Message */}
                  {loginMutation.isError && (
                    <div className="mb-6 p-5 rounded-xl bg-gradient-to-r from-red-50 to-pink-50 border border-red-200 shadow-sm animate-shake">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-gradient-to-r from-red-100 to-pink-100 rounded-full flex items-center justify-center mr-4">
                          <AlertCircle className="w-5 h-5 text-red-600" />
                        </div>
                        <div>
                          <p className="text-red-700 font-bold">
                            Authentication Failed
                          </p>
                          <p className="text-red-600 text-sm mt-1">
                            {loginMutation.error
                              ?.message ||
                              "Invalid credentials. Please try again."}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  <form
                    onSubmit={handleSubmit}
                    className="space-y-7"
                  >
                    {/* Email Input */}
                    <div className="space-y-3">
                      <label className="flex items-center text-sm font-semibold text-gray-700">
                        <Mail className="w-5 h-5 mr-2 text-blue-600" />
                        Email Address
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        disabled={isSubmitting}
                        className="w-full px-5 py-4 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all text-gray-900 placeholder-gray-500 disabled:opacity-70"
                        placeholder="Enter your work email"
                        style={{
                          fontSize: "16px",
                        }}
                      />
                      {errors.email && (
                        <p className="text-red-500 text-sm font-medium animate-fadeIn">
                          {errors.email}
                        </p>
                      )}
                    </div>

                    {/* Password Input */}
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <label className="flex items-center text-sm font-semibold text-gray-700">
                          <Lock className="w-5 h-5 mr-2 text-blue-600" />
                          Password
                        </label>
                        <Link
                          href="/forgot-password"
                          className="text-sm font-medium text-blue-600 hover:text-blue-500 transition-colors"
                        >
                          Forgot password?
                        </Link>
                      </div>
                      <div className="relative">
                        <input
                          type={
                            showPassword
                              ? "text"
                              : "password"
                          }
                          name="password"
                          value={
                            formData.password
                          }
                          onChange={handleChange}
                          disabled={isSubmitting}
                          className="w-full px-5 py-4 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all text-gray-900 placeholder-gray-500 disabled:opacity-70 pr-12"
                          placeholder="Enter your secure password"
                          style={{
                            fontSize: "16px",
                          }}
                        />
                        <button
                          type="button"
                          onClick={() =>
                            setShowPassword(
                              !showPassword
                            )
                          }
                          disabled={isSubmitting}
                          className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-blue-600"
                        >
                          {showPassword ? (
                            <EyeOff className="w-5 h-5" />
                          ) : (
                            <Eye className="w-5 h-5" />
                          )}
                        </button>
                      </div>
                      {errors.password && (
                        <p className="text-red-500 text-sm font-medium animate-fadeIn">
                          {errors.password}
                        </p>
                      )}

                      {/* Password Strength Indicator */}
                      {formData.password.length >
                        0 && (
                        <div className="mt-2">
                          <div className="flex justify-between text-xs mb-1">
                            <span className="font-medium text-gray-700">
                              Password strength
                            </span>
                            <span
                              className={`font-bold ${
                                formData.password
                                  .length >= 8
                                  ? "text-green-600"
                                  : formData
                                        .password
                                        .length >=
                                      6
                                    ? "text-yellow-600"
                                    : "text-red-600"
                              }`}
                            >
                              {formData.password
                                .length >= 8
                                ? "Strong"
                                : formData
                                      .password
                                      .length >= 6
                                  ? "Medium"
                                  : "Weak"}
                            </span>
                          </div>
                          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div
                              className={`h-full transition-all duration-500 ${
                                formData.password
                                  .length >= 8
                                  ? "bg-green-500"
                                  : formData
                                        .password
                                        .length >=
                                      6
                                    ? "bg-yellow-500"
                                    : "bg-red-500"
                              }`}
                              style={{
                                width: `${Math.min((formData.password.length / 12) * 100, 100)}%`,
                              }}
                            ></div>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Remember Me */}
                    <div className="flex items-center space-x-3">
                      <div className="relative">
                        <input
                          type="checkbox"
                          id="remember"
                          checked={rememberMe}
                          onChange={(e) =>
                            setRememberMe(
                              e.target.checked
                            )
                          }
                          disabled={isSubmitting}
                          className="w-5 h-5 text-blue-600 rounded border border-gray-300 focus:ring-2 focus:ring-blue-200 focus:ring-offset-2 transition-all disabled:opacity-50"
                        />
                      </div>
                      <label
                        htmlFor="remember"
                        className="text-sm font-medium text-gray-700 cursor-pointer"
                      >
                        Remember this device for
                        30 days
                      </label>
                    </div>

                    {/* Submit Button */}
                    <button
                      type="submit"
                      disabled={
                        isSubmitting ||
                        loginMutation.isPending
                      }
                      className="w-full py-4 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold text-lg hover:shadow-xl hover:shadow-blue-500/25 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed group"
                    >
                      <div className="flex items-center justify-center">
                        {isSubmitting ? (
                          <>
                            <Loader2 className="w-6 h-6 mr-3 animate-spin" />
                            Securing Your Login...
                          </>
                        ) : (
                          <>
                            <LogIn className="w-6 h-6 mr-3" />
                            Sign In to Dashboard
                            <ArrowRight className="w-5 h-5 ml-3 group-hover:translate-x-2 transition-transform" />
                          </>
                        )}
                      </div>
                    </button>

                    {/* Divider */}
                    <div className="relative py-4">
                      <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-gray-300"></div>
                      </div>
                      <div className="relative flex justify-center">
                        <span className="px-4 bg-white text-sm font-medium text-gray-500">
                          Or continue with
                        </span>
                      </div>
                    </div>

                    {/* Social Login Buttons */}
                    <div className="grid grid-cols-2 gap-4">
                      <button
                        type="button"
                        disabled={isSubmitting}
                        className="py-3 px-4 border-2 border-gray-300 rounded-xl hover:border-blue-400 hover:bg-blue-50 transition-all duration-300 flex items-center justify-center group disabled:opacity-50"
                      >
                        <svg
                          className="w-5 h-5 mr-3 text-gray-600 group-hover:text-blue-600"
                          viewBox="0 0 24 24"
                        >
                          <path
                            fill="currentColor"
                            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                          />
                          <path
                            fill="currentColor"
                            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                          />
                          <path
                            fill="currentColor"
                            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                          />
                          <path
                            fill="currentColor"
                            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                          />
                        </svg>
                        Google
                      </button>
                      <button
                        type="button"
                        disabled={isSubmitting}
                        className="py-3 px-4 border-2 border-gray-300 rounded-xl hover:border-blue-600 hover:bg-blue-50 transition-all duration-300 flex items-center justify-center group disabled:opacity-50"
                      >
                        <svg
                          className="w-5 h-5 mr-3 text-gray-600 group-hover:text-blue-600"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                        </svg>
                        Facebook
                      </button>
                    </div>
                  </form>

                  <div className="mt-12 pt-8 border-t border-gray-100">
                    <p className="text-center text-gray-500 text-sm">
                      Don't have an account?{" "}
                      <Link
                        href="/signup"
                        className="text-blue-600 hover:text-blue-500 font-semibold"
                      >
                        Sign up here
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
            © {new Date().getFullYear()} Nexus
            Platform. All rights reserved.
          </p>
        </div>
      </div>

      <style jsx global>{`
        @keyframes float {
          0%,
          100% {
            transform: translateY(0) rotate(0deg);
          }
          33% {
            transform: translateY(-30px)
              rotate(120deg);
          }
          66% {
            transform: translateY(15px)
              rotate(240deg);
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

        @keyframes shake {
          0%,
          100% {
            transform: translateX(0);
          }
          10%,
          30%,
          50%,
          70%,
          90% {
            transform: translateX(-5px);
          }
          20%,
          40%,
          60%,
          80% {
            transform: translateX(5px);
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

        .animate-shake {
          animation: shake 0.5s ease-in-out;
        }
      `}</style>
    </>
  );
}
