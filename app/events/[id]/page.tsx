"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { toast, Toaster } from "react-hot-toast";
import {
  Calendar,
  Clock,
  MapPin,
  Users,
  ChevronLeft,
  Share2,
  Bookmark,
  Star,
  Heart,
  MessageCircle,
  Award,
  ArrowRight,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Mail,
  Globe,
  Map,
  Download,
  Printer,
  Eye,
  Users as UsersIcon,
  CalendarDays,
  Target,
  Trophy,
  TrendingUp,
  BarChart3,
  PieChart,
  Activity,
  Heart as HeartIcon,
  Shield,
  Bell,
  Coffee,
  Music,
  Video,
  Camera,
  Code,
  Palette,
  Dumbbell,
  BookOpen,
  GraduationCap,
  Briefcase,
  Mic,
  Cloud,
  Zap,
  Rocket,
  Sun,
  Moon,
  Leaf,
  Wind,
  Waves,
  Mountain,
  Trees,
  Flower,
  Thermometer,
  CloudRain,
  CloudSnow,
  CloudLightning,
  Droplets,
  Sunrise,
  Sunset,
  X,
  ChevronDown,
  ChevronUp,
  Maximize2,
  ExternalLink,
  Users as Users2,
  Flag,
  Building,
  Home,
  Navigation,
  Compass,
  Package,
  Tag,
  Hash,
  Gift as GiftIcon,
  Coffee as CoffeeIcon,
  Music as MusicIcon,
  Video as VideoIcon,
  Camera as CameraIcon,
  Code as CodeIcon,
  Palette as PaletteIcon,
  Dumbbell as DumbbellIcon,
  BookOpen as BookOpenIcon,
  GraduationCap as GraduationCapIcon,
  Briefcase as BriefcaseIcon,
  Mic as MicIcon,
  Cloud as CloudIcon,
  Zap as ZapIcon,
  Rocket as RocketIcon,
  Sun as SunIcon,
  Moon as MoonIcon,
  Leaf as LeafIcon,
  Wind as WindIcon,
  Waves as WavesIcon,
  Mountain as MountainIcon,
  Trees as TreesIcon,
  Flower as FlowerIcon,
  Thermometer as ThermometerIcon,
  CloudRain as CloudRainIcon,
  CloudSnow as CloudSnowIcon,
  CloudLightning as CloudLightningIcon,
  Droplets as DropletsIcon,
  Sunrise as SunriseIcon,
  Sunset as SunsetIcon,
  CornerUpRight,
  ArrowUpRight,
  Expand,
  ZoomIn,
  RotateCw,
  Eye as EyeIcon,
  Check,
  X as XIcon,
  Info,
  HelpCircle,
  ThumbsUp,
  MessageSquare,
  Filter,
  Search,
  Package as PackageIcon,
  Headphones,
  LifeBuoy,
  Volume2,
  BellRing,
  Clock as ClockIcon,
  Watch,
  Calendar as CalendarIcon,
  ChevronRight,
  RefreshCcw,
  Grid,
  Sparkles,
  Target as TargetIcon,
  TrendingUp as TrendingUpIcon,
  BarChart as BarChartIcon,
  Activity as ActivityIcon,
  Globe as GlobeIcon,
} from "lucide-react";
import {
  motion,
  AnimatePresence,
} from "framer-motion";
import { useEvents } from "@/lib/hooks/useEvents";
import { EventData } from "@/lib/types/event";

// Theme icons mapping with beautiful colors
const themeIcons: Record<
  string,
  { icon: React.ReactNode; color: string }
> = {
  technology: {
    icon: <Code className="w-6 h-6" />,
    color: "from-blue-500 to-cyan-500",
  },
  education: {
    icon: <GraduationCap className="w-6 h-6" />,
    color: "from-purple-500 to-pink-500",
  },
  business: {
    icon: <Briefcase className="w-6 h-6" />,
    color: "from-emerald-500 to-teal-500",
  },
  health: {
    icon: <Activity className="w-6 h-6" />,
    color: "from-red-500 to-rose-500",
  },
  arts: {
    icon: <Palette className="w-6 h-6" />,
    color: "from-pink-500 to-rose-500",
  },
  sports: {
    icon: <Dumbbell className="w-6 h-6" />,
    color: "from-orange-500 to-amber-500",
  },
  music: {
    icon: <Music className="w-6 h-6" />,
    color: "from-violet-500 to-purple-500",
  },
  food: {
    icon: <Coffee className="w-6 h-6" />,
    color: "from-amber-500 to-yellow-500",
  },
  environment: {
    icon: <Leaf className="w-6 h-6" />,
    color: "from-green-500 to-emerald-500",
  },
  community: {
    icon: <Users2 className="w-6 h-6" />,
    color: "from-indigo-500 to-blue-500",
  },
  default: {
    icon: <Calendar className="w-6 h-6" />,
    color: "from-gray-500 to-gray-700",
  },
};

// Status colors mapping
const statusColors: Record<string, string> = {
  published:
    "bg-gradient-to-r from-emerald-100 to-green-100 text-emerald-800 border-emerald-200",
  draft:
    "bg-gradient-to-r from-amber-100 to-yellow-100 text-amber-800 border-amber-200",
  cancelled:
    "bg-gradient-to-r from-rose-100 to-pink-100 text-rose-800 border-rose-200",
};

export default function EventDetailsPage() {
  const params = useParams();
  const eventId = params.id as string;

  const { getEvent, loading, error, getEvents } =
    useEvents();

  const [event, setEvent] =
    useState<EventData | null>(null);
  const [similarEvents, setSimilarEvents] =
    useState<EventData[]>([]);
  const [selectedImage, setSelectedImage] =
    useState<number>(0);
  const [activeTab, setActiveTab] = useState<
    | "details"
    | "highlights"
    | "gallery"
    | "reviews"
  >("details");
  const [
    expandedDescription,
    setExpandedDescription,
  ] = useState(false);
  const [imageModalOpen, setImageModalOpen] =
    useState(false);
  const [scrollProgress, setScrollProgress] =
    useState(0);
  const [loadingSimilar, setLoadingSimilar] =
    useState(false);

  // Fetch event details and similar events
  useEffect(() => {
    const fetchEventData = async () => {
      try {
        const response = await getEvent(eventId);
        if (response.event) {
          const eventData =
            response.event as EventData;
          setEvent(eventData);

          if (eventData.category) {
            setLoadingSimilar(true);
            try {
              const similarResponse =
                await getEvents({
                  category: eventData.category,
                  limit: 4,
                  excludeId: eventData._id,
                });

              if (similarResponse.events) {
                setSimilarEvents(
                  similarResponse.events
                );
              }
            } catch (similarErr) {
              console.error(
                "Failed to fetch similar events:",
                similarErr
              );
            } finally {
              setLoadingSimilar(false);
            }
          }
        }
      } catch (err) {
        console.error(
          "Failed to fetch event:",
          err
        );
      }
    };

    if (eventId) {
      fetchEventData();
    }
  }, [eventId, getEvent, getEvents]);

  // Track scroll progress
  useEffect(() => {
    const handleScroll = () => {
      const totalHeight =
        document.documentElement.scrollHeight -
        window.innerHeight;
      const scrollPosition = window.scrollY;
      setScrollProgress(
        (scrollPosition / totalHeight) * 100
      );
    };

    window.addEventListener(
      "scroll",
      handleScroll
    );
    return () =>
      window.removeEventListener(
        "scroll",
        handleScroll
      );
  }, []);

  // Format date safely
  const formatDate = (
    dateString: string | undefined
  ) => {
    if (!dateString) return "Date TBA";
    try {
      return new Date(
        dateString
      ).toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch (error) {
      return "Invalid Date";
    }
  };

  // Format time
  const formatTime = (
    dateString: string | undefined
  ) => {
    if (!dateString) return "Time TBA";
    try {
      return new Date(
        dateString
      ).toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      });
    } catch (error) {
      return "Invalid Time";
    }
  };

  // Format currency
  const formatCurrency = (
    amount: number | undefined,
    currency: string = "ETB"
  ) => {
    if (!amount) return `0 ${currency}`;
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency:
        currency === "ETB" ? "ETB" : "USD",
      minimumFractionDigits: 0,
    })
      .format(amount)
      .replace("ETB", "ETB ");
  };

  // Get days remaining
  const getDaysRemaining = () => {
    if (!event?.donationDeadline) return null;
    try {
      const deadline = new Date(
        event.donationDeadline
      );
      const today = new Date();
      const diffTime =
        deadline.getTime() - today.getTime();
      const diffDays = Math.ceil(
        diffTime / (1000 * 60 * 60 * 24)
      );
      return diffDays > 0 ? diffDays : 0;
    } catch (error) {
      return null;
    }
  };

  // Get theme icon and color
  const getThemeConfig = (
    theme: string | undefined
  ) => {
    if (!theme) return themeIcons.default;
    const config =
      themeIcons[theme.toLowerCase()];
    return config || themeIcons.default;
  };

  // Handle share
  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: event?.title || "Event",
        text: `Check out this event: ${event?.title}`,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(
        window.location.href
      );
      toast.success("Link copied to clipboard!");
    }
  };

  // Calculate average rating
  const calculateAverageRating = () => {
    if (
      !event?.feedbacks ||
      event.feedbacks.length === 0
    )
      return 0;
    const total = event.feedbacks.reduce(
      (sum, feedback) => sum + feedback.rating,
      0
    );
    return (
      total / event.feedbacks.length
    ).toFixed(1);
  };

  // Get readable date difference
  const getDateDifference = () => {
    if (!event?.date) return "";
    try {
      const eventDate = new Date(event.date);
      const today = new Date();
      const diffTime =
        eventDate.getTime() - today.getTime();
      const diffDays = Math.ceil(
        diffTime / (1000 * 60 * 60 * 24)
      );

      if (diffDays === 0) return "Today";
      if (diffDays === 1) return "Tomorrow";
      if (diffDays > 0)
        return `In ${diffDays} days`;
      if (diffDays === -1) return "Yesterday";
      return `${Math.abs(diffDays)} days ago`;
    } catch {
      return "";
    }
  };

  // Render loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="text-center p-8 rounded-3xl shadow-xl bg-white/80 backdrop-blur-md">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{
              duration: 1.2,
              repeat: Infinity,
              ease: "linear",
            }}
            className="w-24 h-24 border-4 border-gray-200 border-t-blue-500 rounded-full mx-auto mb-6 shadow-md"
          />
          <h3 className="text-3xl font-extrabold text-gray-800 mb-2 animate-pulse">
            Loading Event Details
          </h3>
          <p className="text-gray-600 text-lg">
            Hang tight! We're fetching the latest
            event information...
          </p>
          <div className="mt-6 flex justify-center space-x-2">
            <span className="w-3 h-3 bg-blue-400 rounded-full animate-bounce"></span>
            <span className="w-3 h-3 bg-purple-400 rounded-full animate-bounce delay-150"></span>
            <span className="w-3 h-3 bg-pink-400 rounded-full animate-bounce delay-300"></span>
          </div>
        </div>
      </div>
    );
  }

  // Render error state
  if (error || !event) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 via-white to-red-50/30 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="w-24 h-24 bg-gradient-to-br from-red-100 to-pink-100 rounded-full flex items-center justify-center mx-auto mb-8 shadow-lg"
          >
            <XIcon className="w-12 h-12 text-red-600" />
          </motion.div>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Event Not Found
          </h2>
          <p className="text-gray-600 mb-8 text-lg">
            {error ||
              "The event you're looking for doesn't exist or has been removed."}
          </p>
          <div className="space-y-4">
            <Link
              href="/"
              className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-semibold rounded-xl hover:shadow-xl hover:scale-105 transition-all duration-300 shadow-lg"
            >
              <ChevronLeft className="w-5 h-5" />
              <span>Back to Home</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const themeConfig = getThemeConfig(event.theme);
  const avgRating = calculateAverageRating();
  const dateDifference = getDateDifference();

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 via-white to-blue-50/30">
      <Toaster position="top-right" />

      {/* Progress Bar */}
      <div className="fixed top-0 left-0 right-0 h-1 bg-gray-200 z-50">
        <motion.div
          className="h-full bg-gradient-to-r from-blue-600 via-cyan-500 to-emerald-500"
          initial={{ width: 0 }}
          animate={{
            width: `${scrollProgress}%`,
          }}
          transition={{
            type: "spring",
            stiffness: 100,
          }}
        />
      </div>

      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-xl border-b border-gray-200 shadow-lg">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link
              href="/"
              className="group flex items-center gap-3 px-4 py-2 text-gray-700 hover:text-blue-600 font-semibold rounded-xl hover:bg-gray-100/50 transition-all duration-300"
            >
              <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
              <span>Back to Home</span>
            </Link>

            <div className="flex items-center gap-3">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleShare}
                className="p-3 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all duration-300"
                title="Share Event"
              >
                <Share2 className="w-5 h-5" />
              </motion.button>
              <button
                className="p-3 text-gray-600 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all duration-300"
                title="Save Event"
              >
                <Bookmark className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 lg:px-8 py-8">
        {/* Event Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-12"
        >
          {/* Badges */}
          <div className="flex flex-wrap items-center gap-3 mb-6">
            <span
              className={`px-4 py-2 rounded-full text-sm font-semibold border ${statusColors[event.status]}`}
            >
              {event.status
                .charAt(0)
                .toUpperCase() +
                event.status.slice(1)}
            </span>
            {event.isFeatured && (
              <span className="px-4 py-2 bg-gradient-to-r from-amber-100 to-yellow-100 text-amber-800 border border-amber-200 rounded-full text-sm font-semibold flex items-center gap-2">
                <Award className="w-4 h-4" />
                Featured
              </span>
            )}
            {event.isUrgent && (
              <span className="px-4 py-2 bg-gradient-to-r from-rose-100 to-pink-100 text-rose-800 border border-rose-200 rounded-full text-sm font-semibold flex items-center gap-2">
                <Bell className="w-4 h-4" />
                Urgent
              </span>
            )}
          </div>

          {/* Title */}
          <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-8 leading-tight tracking-tight">
            {event.title}
          </h1>

          {/* Event Info Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
            <motion.div
              whileHover={{ y: -5 }}
              className="bg-gradient-to-br from-blue-50/80 to-cyan-50/80 backdrop-blur-sm border border-blue-100/50 rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-500 group"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center text-white group-hover:scale-110 transition-transform duration-300">
                  <Calendar className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm text-blue-600 font-medium mb-1">
                    Date & Time
                  </p>
                  <p className="font-bold text-gray-900">
                    {formatDate(event.date)}
                  </p>
                  <p className="text-sm text-gray-600">
                    {formatTime(event.date)}
                  </p>
                  {dateDifference && (
                    <p className="text-xs text-blue-500 font-medium mt-1">
                      {dateDifference}
                    </p>
                  )}
                </div>
              </div>
            </motion.div>

            <motion.div
              whileHover={{ y: -5 }}
              className="bg-gradient-to-br from-emerald-50/80 to-green-50/80 backdrop-blur-sm border border-emerald-100/50 rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-500 group"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-green-500 rounded-xl flex items-center justify-center text-white group-hover:scale-110 transition-transform duration-300">
                  <MapPin className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm text-emerald-600 font-medium mb-1">
                    Location
                  </p>
                  <p className="font-bold text-gray-900">
                    {event.location ||
                      "To Be Announced"}
                  </p>
                  <button className="text-sm text-emerald-600 hover:text-emerald-700 font-medium mt-1 flex items-center gap-1 group/link">
                    View Directions{" "}
                    <ExternalLink className="w-3 h-3 group-hover/link:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
            </motion.div>

            <motion.div
              whileHover={{ y: -5 }}
              className="bg-gradient-to-br from-purple-50/80 to-pink-50/80 backdrop-blur-sm border border-purple-100/50 rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-500 group"
            >
              <div className="flex items-center gap-4">
                <div
                  className={`w-12 h-12 bg-gradient-to-br ${themeConfig.color} rounded-xl flex items-center justify-center text-white group-hover:scale-110 transition-transform duration-300`}
                >
                  {themeConfig.icon}
                </div>
                <div>
                  <p className="text-sm text-purple-600 font-medium mb-1">
                    Category & Theme
                  </p>
                  <p className="font-bold text-gray-900 capitalize">
                    {event.category ||
                      "General Event"}
                  </p>
                  {event.theme && (
                    <p className="text-sm text-gray-600 capitalize">
                      {event.theme} Theme
                    </p>
                  )}
                </div>
              </div>
            </motion.div>

            <motion.div
              whileHover={{ y: -5 }}
              className="bg-gradient-to-br from-amber-50/80 to-orange-50/80 backdrop-blur-sm border border-amber-100/50 rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-500 group"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-orange-500 rounded-xl flex items-center justify-center text-white group-hover:scale-110 transition-transform duration-300">
                  <Users className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm text-amber-600 font-medium mb-1">
                    Capacity
                  </p>
                  <p className="font-bold text-gray-900">
                    {event.maxParticipants ||
                      "Unlimited"}{" "}
                    spots
                  </p>
                  <p className="text-sm text-gray-600">
                    Open to everyone
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-3 gap-12">
          {/* Left Column - Images & Details */}
          <div className="lg:col-span-2">
            {/* Image Gallery */}
            {event.files &&
            event.files.length > 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="mb-12"
              >
                <div className="relative h-[500px] w-full rounded-3xl overflow-hidden shadow-2xl mb-6 group">
                  {/* Improved overlay */}
                  <div className="relative w-full h-full">
                    <Image
                      src={
                        event.files[selectedImage]
                          ?.url ||
                        "/placeholder-event.jpg"
                      }
                      alt={event.title}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                      priority
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                    {/* Gradient overlay for better text visibility */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    {/* Subtle pattern overlay */}
                    <div
                      className="absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-500"
                      style={{
                        backgroundImage: `radial-gradient(circle at 25% 25%, rgba(255,255,255,0.1) 2px, transparent 2px)`,
                        backgroundSize:
                          "30px 30px",
                      }}
                    />
                  </div>

                  <button
                    onClick={() =>
                      setImageModalOpen(true)
                    }
                    className="absolute top-6 right-6 p-3 bg-white/90 backdrop-blur-md text-gray-700 rounded-xl hover:bg-white hover:scale-110 hover:shadow-2xl transition-all duration-300 shadow-lg z-10"
                  >
                    <Maximize2 className="w-5 h-5" />
                  </button>

                  <div className="absolute bottom-6 left-6 flex items-center gap-2">
                    {event.files.map(
                      (_, index) => (
                        <button
                          key={index}
                          onClick={() =>
                            setSelectedImage(
                              index
                            )
                          }
                          className={`w-2.5 h-2.5 rounded-full transition-all duration-300 hover:scale-125 ${
                            selectedImage ===
                            index
                              ? "bg-white scale-125"
                              : "bg-white/60 hover:bg-white/80"
                          }`}
                        />
                      )
                    )}
                  </div>
                </div>

                {/* Thumbnails Grid */}
                {event.files.length > 1 && (
                  <div className="grid grid-cols-4 gap-3">
                    {event.files.map(
                      (file, index) => (
                        <motion.button
                          key={file._id}
                          whileHover={{
                            scale: 1.05,
                            y: -2,
                          }}
                          whileTap={{
                            scale: 0.95,
                          }}
                          onClick={() =>
                            setSelectedImage(
                              index
                            )
                          }
                          className={`relative h-28 rounded-xl overflow-hidden border-2 transition-all duration-300 group/thumbnail ${
                            selectedImage ===
                            index
                              ? "border-blue-500 ring-2 ring-blue-300 ring-opacity-50 shadow-lg"
                              : "border-gray-200 hover:border-gray-300"
                          }`}
                        >
                          <Image
                            src={file.url}
                            alt={`${event.title} - Image ${index + 1}`}
                            fill
                            className="object-cover group-hover/thumbnail:scale-110 transition-transform duration-300"
                          />
                          <div
                            className={`absolute inset-0 transition-opacity duration-300 ${
                              selectedImage ===
                              index
                                ? "bg-blue-500/20"
                                : "bg-black/0 group-hover/thumbnail:bg-black/20"
                            }`}
                          />
                        </motion.button>
                      )
                    )}
                  </div>
                )}
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="h-[400px] w-full bg-gradient-to-br from-blue-50 to-cyan-50 rounded-3xl flex flex-col items-center justify-center mb-12 shadow-xl border border-blue-100"
              >
                <div className="relative">
                  <Calendar className="w-32 h-32 text-blue-200 mb-6" />
                  <Sparkles className="w-8 h-8 text-blue-300 absolute -top-2 -right-2 animate-pulse" />
                </div>
                <p className="text-2xl font-bold text-blue-600 mb-2">
                  Visual Content Coming Soon
                </p>
                <p className="text-blue-400">
                  Stay tuned for amazing photos!
                </p>
              </motion.div>
            )}

            {/* Tabs Navigation */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="mb-8"
            >
              <div className="flex overflow-x-auto pb-2 gap-1 scrollbar-hide">
                {[
                  {
                    id: "details",
                    label: "Event Details",
                    icon: (
                      <Info className="w-5 h-5" />
                    ),
                    color:
                      "from-blue-500 to-cyan-500",
                  },
                  {
                    id: "highlights",
                    label: "Key Highlights",
                    icon: (
                      <Award className="w-5 h-5" />
                    ),
                    color:
                      "from-amber-500 to-orange-500",
                  },
                  {
                    id: "gallery",
                    label: "Photo Gallery",
                    icon: (
                      <Camera className="w-5 h-5" />
                    ),
                    color:
                      "from-purple-500 to-pink-500",
                  },
                  {
                    id: "reviews",
                    label: "Attendee Reviews",
                    icon: (
                      <Star className="w-5 h-5" />
                    ),
                    color:
                      "from-rose-500 to-red-500",
                  },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() =>
                      setActiveTab(tab.id as any)
                    }
                    className={`flex items-center gap-3 px-6 py-4 font-medium capitalize transition-all duration-300 whitespace-nowrap rounded-2xl border ${
                      activeTab === tab.id
                        ? `bg-gradient-to-r ${tab.color} text-white shadow-xl border-transparent`
                        : "text-gray-600 hover:text-gray-900 hover:bg-gray-50 border-gray-200"
                    }`}
                  >
                    {tab.icon}
                    {tab.label}
                  </button>
                ))}
              </div>
            </motion.div>

            {/* Tab Content */}
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-white/80 backdrop-blur-sm rounded-3xl border border-gray-200/50 shadow-xl p-8"
            >
              {activeTab === "details" && (
                <div className="space-y-8">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                      <div className="p-2 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg">
                        <Info className="w-6 h-6 text-white" />
                      </div>
                      <span className="bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                        Event Details
                      </span>
                    </h2>
                    <div className="prose prose-lg max-w-none">
                      <div className="relative">
                        <div
                          className={`text-gray-700 leading-relaxed text-lg mb-6 transition-all duration-500 ${expandedDescription ? "" : "line-clamp-4"}`}
                        >
                          {event.description ||
                            "No description available for this event. More details coming soon!"}
                        </div>
                        {event.description &&
                          event.description
                            .length > 300 && (
                            <button
                              onClick={() =>
                                setExpandedDescription(
                                  !expandedDescription
                                )
                              }
                              className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-50 to-cyan-50 text-blue-600 hover:text-blue-700 font-medium rounded-xl hover:shadow-md transition-all duration-300"
                            >
                              {expandedDescription ? (
                                <>
                                  Show Less{" "}
                                  <ChevronUp className="w-4 h-4" />
                                </>
                              ) : (
                                <>
                                  Read More{" "}
                                  <ChevronDown className="w-4 h-4" />
                                </>
                              )}
                            </button>
                          )}
                      </div>
                    </div>
                  </div>

                  {/* Event Stats - Beautiful Card Design */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    {[
                      {
                        label: "Max Participants",
                        value:
                          event.maxParticipants ||
                          "∞",
                        icon: (
                          <Users className="w-6 h-6" />
                        ),
                        color:
                          "from-blue-500 to-cyan-500",
                        textColor:
                          "text-blue-600",
                      },
                      {
                        label: "Total Reviews",
                        value:
                          event.feedbacks
                            ?.length || 0,
                        icon: (
                          <MessageSquare className="w-6 h-6" />
                        ),
                        color:
                          "from-purple-500 to-pink-500",
                        textColor:
                          "text-purple-600",
                      },
                      {
                        label: "Avg Rating",
                        value: avgRating,
                        icon: (
                          <Star className="w-6 h-6" />
                        ),
                        color:
                          "from-amber-500 to-orange-500",
                        textColor:
                          "text-amber-600",
                      },
                      {
                        label: "Event Status",
                        value:
                          event.status
                            .charAt(0)
                            .toUpperCase() +
                          event.status.slice(1),
                        icon: (
                          <Activity className="w-6 h-6" />
                        ),
                        color:
                          event.status ===
                          "published"
                            ? "from-emerald-500 to-green-500"
                            : event.status ===
                                "draft"
                              ? "from-amber-500 to-yellow-500"
                              : "from-rose-500 to-red-500",
                        textColor:
                          event.status ===
                          "published"
                            ? "text-emerald-600"
                            : event.status ===
                                "draft"
                              ? "text-amber-600"
                              : "text-rose-600",
                      },
                    ].map((stat, index) => (
                      <motion.div
                        key={index}
                        whileHover={{
                          scale: 1.05,
                          y: -3,
                        }}
                        className={`bg-gradient-to-br ${stat.color} bg-opacity-10 p-6 rounded-2xl border border-opacity-20 border-current`}
                      >
                        <div className="flex items-center gap-4">
                          <div
                            className={`p-3 bg-gradient-to-br ${stat.color} rounded-xl text-white`}
                          >
                            {stat.icon}
                          </div>
                          <div>
                            <div
                              className={`text-2xl font-bold ${stat.textColor} mb-1`}
                            >
                              {stat.value}
                            </div>
                            <p className="text-sm text-gray-600">
                              {stat.label}
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === "highlights" && (
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                    <div className="p-2 bg-gradient-to-r from-amber-500 to-orange-500 rounded-lg">
                      <Award className="w-6 h-6 text-white" />
                    </div>
                    <span className="bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
                      Key Highlights
                    </span>
                  </h2>
                  <div className="space-y-4">
                    <div className="flex items-start gap-4 p-6 bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl border border-amber-100">
                      <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-orange-500 rounded-xl flex items-center justify-center text-white flex-shrink-0">
                        <Target className="w-6 h-6" />
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-900 mb-2 text-lg">
                          Main Objective & Vision
                        </h3>
                        <p className="text-gray-700 leading-relaxed">
                          {event.description
                            ? event.description.substring(
                                0,
                                200
                              ) +
                              (event.description
                                .length > 200
                                ? "..."
                                : "")
                            : "This event aims to bring people together for meaningful connections and shared experiences."}
                        </p>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl border border-blue-100">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="p-2 bg-blue-100 rounded-lg">
                            <Users className="w-4 h-4 text-blue-600" />
                          </div>
                          <h4 className="font-semibold text-gray-900">
                            Community Focus
                          </h4>
                        </div>
                        <p className="text-sm text-gray-600">
                          Open to all community
                          members
                        </p>
                      </div>
                      <div className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border border-purple-100">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="p-2 bg-purple-100 rounded-lg">
                            <Calendar className="w-4 h-4 text-purple-600" />
                          </div>
                          <h4 className="font-semibold text-gray-900">
                            Flexible Schedule
                          </h4>
                        </div>
                        <p className="text-sm text-gray-600">
                          Multiple sessions
                          available
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "gallery" && (
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                    <div className="p-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg">
                      <Camera className="w-6 h-6 text-white" />
                    </div>
                    <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                      Photo Gallery
                    </span>
                  </h2>
                  {event.files &&
                  event.files.length > 0 ? (
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {event.files.map(
                        (file, index) => (
                          <motion.div
                            key={file._id}
                            whileHover={{
                              scale: 1.05,
                              rotate: 1,
                            }}
                            className="relative h-48 rounded-xl overflow-hidden cursor-pointer group/gallery"
                            onClick={() => {
                              setSelectedImage(
                                index
                              );
                              setImageModalOpen(
                                true
                              );
                            }}
                          >
                            <Image
                              src={file.url}
                              alt={`Gallery image ${index + 1}`}
                              fill
                              className="object-cover group-hover/gallery:scale-110 transition-transform duration-500"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover/gallery:opacity-100 transition-opacity duration-300 flex items-end p-4">
                              <EyeIcon className="w-6 h-6 text-white mb-1" />
                            </div>
                          </motion.div>
                        )
                      )}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <Camera className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">
                        No Photos Yet
                      </h3>
                      <p className="text-gray-600">
                        Check back soon for event
                        photos!
                      </p>
                    </div>
                  )}
                </div>
              )}

              {activeTab === "reviews" && (
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                    <div className="p-2 bg-gradient-to-r from-rose-500 to-red-500 rounded-lg">
                      <Star className="w-6 h-6 text-white" />
                    </div>
                    <span className="bg-gradient-to-r from-rose-600 to-red-600 bg-clip-text text-transparent">
                      Attendee Reviews
                    </span>
                  </h2>
                  {event.feedbacks &&
                  event.feedbacks.length > 0 ? (
                    <div className="space-y-6">
                      {/* Average Rating */}
                      <div className="bg-gradient-to-r from-amber-50 to-yellow-50 p-6 rounded-2xl border border-amber-100">
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="text-3xl font-bold text-gray-900 mb-1">
                              {avgRating}/5
                            </div>
                            <div className="flex items-center gap-1 mb-2">
                              {[...Array(5)].map(
                                (_, i) => (
                                  <Star
                                    key={i}
                                    className={`w-6 h-6 ${
                                      i <
                                      Math.floor(
                                        parseFloat(
                                          avgRating
                                        )
                                      )
                                        ? "text-amber-500 fill-amber-500"
                                        : "text-gray-300"
                                    }`}
                                  />
                                )
                              )}
                            </div>
                            <p className="text-sm text-gray-600">
                              Based on{" "}
                              {
                                event.feedbacks
                                  .length
                              }{" "}
                              reviews
                            </p>
                          </div>
                          <div className="text-right">
                            <div className="text-6xl text-amber-500 mb-2">
                              "
                            </div>
                            <p className="text-lg font-semibold text-gray-900">
                              Overall Experience
                            </p>
                            <p className="text-sm text-gray-600">
                              Rated by our
                              community
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Reviews List */}
                      <div className="space-y-4">
                        {event.feedbacks
                          .slice(0, 5)
                          .map((feedback) => (
                            <motion.div
                              key={feedback._id}
                              initial={{
                                opacity: 0,
                                y: 20,
                              }}
                              animate={{
                                opacity: 1,
                                y: 0,
                              }}
                              className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-300 group/feedback"
                            >
                              <div className="flex items-start justify-between mb-4">
                                <div className="flex items-center gap-3">
                                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                                    {feedback.userId?.charAt(
                                      0
                                    ) || "A"}
                                  </div>
                                  <div>
                                    <h4 className="font-bold text-gray-900">
                                      {feedback.userId ||
                                        "Anonymous Attendee"}
                                    </h4>
                                    <p className="text-sm text-gray-500">
                                      {new Date(
                                        feedback.createdAt
                                      ).toLocaleDateString(
                                        "en-US",
                                        {
                                          month:
                                            "long",
                                          day: "numeric",
                                          year: "numeric",
                                        }
                                      )}
                                    </p>
                                  </div>
                                </div>
                                <div className="flex items-center gap-1">
                                  {[
                                    ...Array(5),
                                  ].map(
                                    (_, i) => (
                                      <Star
                                        key={i}
                                        className={`w-4 h-4 ${
                                          i <
                                          feedback.rating
                                            ? "text-amber-500 fill-amber-500"
                                            : "text-gray-300"
                                        }`}
                                      />
                                    )
                                  )}
                                </div>
                              </div>
                              <p className="text-gray-700 leading-relaxed italic">
                                "
                                {feedback.comment}
                                "
                              </p>
                            </motion.div>
                          ))}
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <MessageSquare className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">
                        No Reviews Yet
                      </h3>
                      <p className="text-gray-600">
                        Be the first to share your
                        experience!
                      </p>
                      <button className="mt-4 px-6 py-2 bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-medium rounded-xl hover:shadow-lg transition-all duration-300">
                        Share Your Thoughts
                      </button>
                    </div>
                  )}
                </div>
              )}
            </motion.div>
          </div>

          {/* Right Column - Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-8">
              {/* Event Summary Card - Beautiful Design */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-gradient-to-br from-slate-900 to-gray-900 text-white rounded-3xl shadow-2xl p-8 border border-slate-800"
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <h3 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                    Event Summary
                  </h3>
                </div>

                <div className="space-y-6">
                  {[
                    {
                      label: "Event Status",
                      value:
                        event.status
                          .charAt(0)
                          .toUpperCase() +
                        event.status.slice(1),
                      icon: (
                        <Activity className="w-4 h-4" />
                      ),
                      color:
                        event.status ===
                        "published"
                          ? "text-emerald-400"
                          : "text-amber-400",
                    },
                    {
                      label: "Created On",
                      value: formatDate(
                        event.createdAt
                      ),
                      icon: (
                        <Calendar className="w-4 h-4" />
                      ),
                      color: "text-blue-400",
                    },
                    {
                      label: "Last Updated",
                      value: formatDate(
                        event.updatedAt
                      ),
                      icon: (
                        <RefreshCcw className="w-4 h-4" />
                      ),
                      color: "text-cyan-400",
                    },
                    {
                      label: "Event ID",
                      value: `#${event._id.slice(-8)}`,
                      icon: (
                        <Hash className="w-4 h-4" />
                      ),
                      color: "text-purple-400",
                    },
                  ].map((item, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-3 p-4 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 hover:border-white/20 transition-all duration-300 group/item"
                    >
                      <div className="p-2 bg-white/10 rounded-lg group-hover/item:bg-white/20 transition-colors duration-300">
                        <div
                          className={item.color}
                        >
                          {item.icon}
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-center">
                          <span className="text-slate-300 text-sm font-medium">
                            {item.label}
                          </span>
                          <span
                            className={`font-semibold truncate max-w-[120px] ${item.color}`}
                          >
                            {item.value}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Quick Actions */}
                <div className="mt-8 pt-8 border-t border-white/10 space-y-4">
                  <button
                    onClick={handleShare}
                    className="w-full py-3.5 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white font-semibold rounded-2xl transition-all duration-300 flex items-center justify-center gap-3 shadow-lg hover:shadow-xl hover:scale-105"
                  >
                    <Share2 className="w-5 h-5" />
                    Share This Event
                  </button>
                  <button
                    onClick={() => window.print()}
                    className="w-full py-3 bg-white/10 hover:bg-white/20 text-white font-medium rounded-2xl transition-all duration-300 flex items-center justify-center gap-3 backdrop-blur-sm"
                  >
                    <Printer className="w-5 h-5" />
                    Print Details
                  </button>
                  <button
                    onClick={() =>
                      toast.success(
                        "Event saved to your favorites!"
                      )
                    }
                    className="w-full py-3 bg-white/10 hover:bg-rose-500/20 hover:text-rose-300 text-white font-medium rounded-2xl transition-all duration-300 flex items-center justify-center gap-3 backdrop-blur-sm"
                  >
                    <Heart className="w-5 h-5" />
                    Save for Later
                  </button>
                </div>
              </motion.div>

              {/* Stay Connected Card */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 }}
                className="bg-gradient-to-br from-white to-gray-50 rounded-3xl border border-gray-200 shadow-xl p-6"
              >
                <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Users className="w-5 h-5 text-blue-500" />
                  <span className="bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                    Stay Connected
                  </span>
                </h3>

                <div className="space-y-4">
                  {/* Email Updates */}
                  <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl border border-blue-100 hover:border-blue-200 transition-all duration-300 cursor-pointer group/email">
                    <div className="p-2 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg group-hover/email:scale-110 transition-transform duration-300">
                      <Mail className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">
                        Get Email Updates
                      </p>
                      <p className="text-sm text-blue-600">
                        Stay informed about event
                        changes
                      </p>
                    </div>
                  </div>

                  {/* Social Share */}
                  <div>
                    <p className="text-sm text-gray-600 font-medium mb-3">
                      Share with Friends
                    </p>
                    <div className="flex gap-3">
                      {[
                        {
                          platform: "facebook",
                          icon: Facebook,
                          color:
                            "bg-blue-600 hover:bg-blue-700",
                        },
                        {
                          platform: "twitter",
                          icon: Twitter,
                          color:
                            "bg-cyan-500 hover:bg-cyan-600",
                        },
                        {
                          platform: "linkedin",
                          icon: Linkedin,
                          color:
                            "bg-blue-700 hover:bg-blue-800",
                        },
                        {
                          platform: "instagram",
                          icon: Instagram,
                          color:
                            "bg-pink-600 hover:bg-pink-700",
                        },
                      ].map((social) => (
                        <button
                          key={social.platform}
                          onClick={() =>
                            window.open(
                              social.platform ===
                                "facebook"
                                ? `https://facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`
                                : social.platform ===
                                    "twitter"
                                  ? `https://twitter.com/intent/tweet?url=${encodeURIComponent(window.location.href)}&text=${encodeURIComponent(event.title)}`
                                  : social.platform ===
                                      "linkedin"
                                    ? `https://linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}`
                                    : "#",
                              "_blank"
                            )
                          }
                          className={`flex-1 p-3 ${social.color} text-white rounded-xl hover:scale-105 transition-all duration-300 flex items-center justify-center shadow-md hover:shadow-lg`}
                        >
                          <social.icon className="w-5 h-5" />
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Similar Events Card */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 }}
                className="bg-gradient-to-br from-white to-gray-50 rounded-3xl border border-gray-200 shadow-xl p-6"
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                    <Grid className="w-5 h-5 text-indigo-500" />
                    <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                      Similar Events
                    </span>
                  </h3>
                  <Link
                    href="/events"
                    className="text-blue-500 hover:text-blue-600 text-sm font-medium flex items-center gap-1 group/link"
                  >
                    View All{" "}
                    <ArrowRight className="w-4 h-4 group-hover/link:translate-x-1 transition-transform" />
                  </Link>
                </div>

                {loadingSimilar ? (
                  <div className="space-y-3">
                    {[...Array(3)].map((_, i) => (
                      <div
                        key={i}
                        className="animate-pulse h-20 bg-gradient-to-r from-gray-100 to-gray-200 rounded-xl"
                      ></div>
                    ))}
                  </div>
                ) : similarEvents.length > 0 ? (
                  <div className="space-y-3">
                    {similarEvents
                      .slice(0, 3)
                      .map((ev) => (
                        <Link
                          key={ev._id}
                          href={`/events/${ev._id}`}
                          className="group block"
                        >
                          <div className="flex items-center gap-3 p-3 border border-gray-200 rounded-xl hover:shadow-xl hover:border-indigo-300 transition-all duration-300 group-hover:bg-gradient-to-r group-hover:from-indigo-50 group-hover:to-purple-50">
                            <div className="p-3 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                              {
                                getThemeConfig(
                                  ev.theme
                                ).icon
                              }
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 className="text-gray-900 font-semibold truncate group-hover:text-indigo-600 transition-colors">
                                {ev.title}
                              </h4>
                              <p className="text-sm text-gray-500 flex items-center gap-1">
                                <Calendar className="w-3 h-3" />
                                {formatDate(
                                  ev.date
                                )}
                              </p>
                            </div>
                          </div>
                        </Link>
                      ))}
                  </div>
                ) : (
                  <div className="text-center py-6">
                    <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-2" />
                    <p className="text-gray-500 text-sm">
                      No similar events found
                    </p>
                  </div>
                )}
              </motion.div>
            </div>
          </div>
        </div>
      </main>

      {/* Enhanced Image Modal */}
      <AnimatePresence>
        {imageModalOpen &&
          event.files &&
          event.files.length > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/95 backdrop-blur-lg z-50 flex items-center justify-center p-4"
              onClick={() =>
                setImageModalOpen(false)
              }
            >
              <motion.div
                initial={{
                  scale: 0.9,
                  rotate: -2,
                }}
                animate={{ scale: 1, rotate: 0 }}
                exit={{ scale: 0.9, rotate: 2 }}
                className="relative max-w-6xl w-full h-full md:h-[90vh] rounded-3xl overflow-hidden shadow-3xl"
                onClick={(e) =>
                  e.stopPropagation()
                }
              >
                {/* Enhanced overlay for better image display */}
                <div className="relative w-full h-full bg-gradient-to-br from-black/80 to-gray-900/80 flex items-center justify-center">
                  <Image
                    src={
                      event.files[selectedImage]
                        .url
                    }
                    alt={`${event.title} - Image ${selectedImage + 1}`}
                    width={1200}
                    height={800}
                    className="object-contain max-w-full max-h-full rounded-lg shadow-2xl"
                    priority
                  />
                </div>

                {/* Close Button */}
                <button
                  onClick={() =>
                    setImageModalOpen(false)
                  }
                  className="absolute top-6 right-6 p-3 bg-white/20 backdrop-blur-md text-white rounded-full hover:bg-white/30 hover:scale-110 transition-all duration-300 z-10 shadow-xl"
                >
                  <X className="w-6 h-6" />
                </button>

                {/* Image Counter */}
                <div className="absolute top-6 left-6 px-4 py-2 bg-black/50 backdrop-blur-md text-white rounded-full text-sm font-medium z-10">
                  {selectedImage + 1} /{" "}
                  {event.files.length}
                </div>

                {/* Image Title */}
                <div className="absolute bottom-6 left-6 right-6 bg-gradient-to-t from-black/80 via-black/50 to-transparent p-6">
                  <h3 className="text-white text-xl font-bold mb-2">
                    {event.title}
                  </h3>
                  <p className="text-gray-300 text-sm">
                    Image {selectedImage + 1} of{" "}
                    {event.files.length}
                  </p>
                </div>

                {/* Navigation Arrows */}
                {event.files.length > 1 && (
                  <>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedImage(
                          (prev) =>
                            prev === 0
                              ? event.files
                                  .length - 1
                              : prev - 1
                        );
                      }}
                      className="absolute left-6 top-1/2 -translate-y-1/2 p-4 bg-white/20 backdrop-blur-md text-white rounded-full hover:bg-white/30 hover:scale-110 transition-all duration-300 z-10"
                    >
                      <ChevronLeft className="w-6 h-6" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedImage(
                          (prev) =>
                            prev ===
                            event.files.length - 1
                              ? 0
                              : prev + 1
                        );
                      }}
                      className="absolute right-6 top-1/2 -translate-y-1/2 p-4 bg-white/20 backdrop-blur-md text-white rounded-full hover:bg-white/30 hover:scale-110 transition-all duration-300 z-10"
                    >
                      <ChevronRight className="w-6 h-6" />
                    </button>
                  </>
                )}

                {/* Thumbnail Strip */}
                {event.files.length > 1 && (
                  <div className="absolute bottom-24 left-1/2 transform -translate-x-1/2 flex gap-2 max-w-[80%] overflow-x-auto py-2 scrollbar-hide">
                    {event.files.map(
                      (file, index) => (
                        <button
                          key={file._id}
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedImage(
                              index
                            );
                          }}
                          className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all duration-300 hover:scale-110 ${
                            selectedImage ===
                            index
                              ? "border-white ring-2 ring-white ring-opacity-50"
                              : "border-white/30 hover:border-white/50"
                          }`}
                        >
                          <div className="relative w-full h-full">
                            <Image
                              src={file.url}
                              alt={`Thumbnail ${index + 1}`}
                              fill
                              className="object-cover"
                            />
                          </div>
                        </button>
                      )
                    )}
                  </div>
                )}
              </motion.div>
            </motion.div>
          )}
      </AnimatePresence>

      {/* Footer */}
      <footer className="mt-20 py-12 bg-gradient-to-b from-gray-50 to-gray-100 border-t border-gray-200">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
              <Calendar className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Public Event Information
            </h3>
            <p className="text-gray-600 max-w-2xl mx-auto mb-8 text-lg">
              This event page is publicly
              accessible. All information
              displayed here is available to
              everyone. For questions or
              clarifications, please reach out
              through official channels.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 text-sm text-gray-500">
              <span>
                Event ID:{" "}
                <span className="font-mono text-blue-600">
                  #{event._id.slice(-8)}
                </span>
              </span>
              <span className="hidden sm:inline">
                •
              </span>
              <span>
                Last Updated:{" "}
                <span className="font-medium">
                  {formatDate(event.updatedAt)}
                </span>
              </span>
              <span className="hidden sm:inline">
                •
              </span>
              <span>
                Category:{" "}
                <span className="font-medium capitalize">
                  {event.category}
                </span>
              </span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
