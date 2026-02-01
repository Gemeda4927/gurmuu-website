"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast, Toaster } from "react-hot-toast";
import {
  Users,
  Star,
  ChevronRight,
  Search,
  Menu,
  X,
  User,
  LogIn,
  Sparkles,
  Award,
  CheckCircle,
  Globe,
  Target,
  Quote,
  Play,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Mail,
  Phone,
  MapPin,
  GraduationCap,
  HeartHandshake,
  Scale,
  BookOpen,
  Brain,
  UsersRound,
  CalendarDays,
  ArrowRight,
  Sparkle,
  ChevronUp,
  BookCheck,
  Award as AwardIcon,
  Target as TargetIcon,
  Users as UsersIcon,
  Map,
  Book,
  Lightbulb,
  Shield,
  Clock,
  Trophy,
  TrendingUp,
  Heart,
  Home,
  Info,
  MessageCircle,
  Video,
  Music,
  Coffee,
  Dumbbell,
  Palette,
  Code,
  Briefcase,
  Mic,
  Camera,
  Cloud,
  Zap,
  Rocket,
  Sun,
  Moon,
  Gift,
  Bell,
  Download,
  Upload,
  Settings,
  HelpCircle,
  Globe as GlobeIcon,
  PhoneCall,
  Mail as MailIcon,
  Map as MapIcon,
  UserPlus,
  Lock,
  Eye,
  EyeOff,
  Calendar,
  Clock as ClockIcon,
  Check,
  X as XIcon,
  Plus,
  Minus,
  Filter,
  Grid,
  List,
  Share2,
  Bookmark,
  Eye as EyeIcon,
  MessageSquare,
  ThumbsUp,
  DownloadCloud,
  UploadCloud,
  BarChart3,
  PieChart,
  LineChart,
  Activity,
  Target as TargetIcon2,
  Users as UsersIcon2,
  Book as BookIcon,
  Award as AwardIcon2,
  GraduationCap as GraduationCapIcon,
  Briefcase as BriefcaseIcon,
  Heart as HeartIcon,
  Leaf,
  Wind,
  Waves,
  Mountain,
  Trees,
  Flower,
  Sunrise,
  Sunset,
  CloudRain,
  CloudSnow,
  CloudLightning,
  Droplets,
  Thermometer,
  Wind as WindIcon,
  Waves as WavesIcon,
  Mountain as MountainIcon,
  Trees as TreesIcon,
  Flower as FlowerIcon,
  LogOut,
  UserCircle,
} from "lucide-react";
import {
  motion,
  AnimatePresence,
} from "framer-motion";
import { useEvents } from "@/lib/hooks/useEvents";
import { EventData } from "@/lib/types/event";
import { useAuthStore } from "@/lib/store/auth.store";
import Image from "next/image";

// Enhanced content data
const heroData = {
  title:
    "Empowering Communities Through Volunteerism",
  subtitle:
    "Building a Stronger and More Inclusive Society",
  description:
    "Nutii Organization is dedicated to empowering youth and communities through training, guidance, and impactful volunteer programs that create lasting social change.",
  cta: {
    primary: "Join as a Volunteer",
    secondary: "Learn More",
  },
  stats: [
    {
      icon: <Users className="w-6 h-6" />,
      value: "10+",
      label: "Years of Service",
    },
    {
      icon: (
        <HeartHandshake className="w-6 h-6" />
      ),
      value: "5,000+",
      label: "Youth Mentored",
    },
    {
      icon: <GraduationCap className="w-6 h-6" />,
      value: "50+",
      label: "Special Trainings",
    },
    {
      icon: <Globe className="w-6 h-6" />,
      value: "All Regions",
      label: "Nationwide Reach",
    },
  ],
};

// Core Values
const coreValues = [
  {
    title: "Dhaloota Gorsuu",
    description:
      "Woggaa saddeen darbaan dhaloota kana gorsaa ture. Barataan, qotee bulaan, horiissee bulan hundaaf.",
    icon: <GraduationCap className="w-8 h-8" />,
    color: "from-blue-600 to-cyan-500",
    benefits: [
      "Gorsaa Addummaa",
      "Leenjii Qabatamaa",
      "Hordoffii Dheeressaa",
    ],
  },
  {
    title: "Oltummaa",
    description:
      "Nama amantaa fi gosaan nama gargar hin baanyee. Oromiyaa keessatti bakka kamiiyyuu deeme.",
    icon: <UsersRound className="w-8 h-8" />,
    color: "from-green-600 to-emerald-500",
    benefits: [
      "Wal-simannaa",
      "Hawaasa",
      "Gosoota Hundaa",
    ],
  },
  {
    title: "Kaayyoo Qabatamaa",
    description:
      "Kaayyoo isaanirratti dammaqanii socho'an. Dhaloota ijjeessuu waan jirtan dhiifama gaafanna.",
    icon: <Target className="w-8 h-8" />,
    color: "from-purple-600 to-pink-500",
    benefits: [
      "Kaayyoo Qulqulluu",
      "Socho'ina",
      "Gumaa Mul'ataa",
    ],
  },
  {
    title: "Sirna fi Hawaasa",
    description:
      "Hojjataan mootummaa fi kkf waliin hojjachuun dhalootaf gargaaruuf.",
    icon: <Scale className="w-8 h-8" />,
    color: "from-orange-600 to-amber-500",
    benefits: [
      "Waliigaltee",
      "Hojii Waliin",
      "Misooma Hawaasaa",
    ],
  },
];

// Success Stories
const successStories = [
  {
    id: 1,
    name: "Tolasa Bekele",
    role: "Software Engineer @ Google",
    story:
      "Dhaabbata kanaa keessatti leenjii irra deebi'anii barnoota Computer Science kootti guddaa na gargaare. Amma Silicon Valley keessatti hojjachaa jira.",
    year: "2018",
    achievement: "Tech Career",
    icon: <Code className="w-6 h-6" />,
  },
  {
    id: 2,
    name: "Hirut Abebe",
    role: "Social Entrepreneur",
    story:
      "Gorsaa fi gargaarsa dhaabbata kanaa irra deebi'anii dhaabbata NGO guddaa ijare. Har'a dhaloota 500 ol gargaara.",
    year: "2019",
    achievement: "Social Impact",
    icon: <HeartHandshake className="w-6 h-6" />,
  },
  {
    id: 3,
    name: "Kebede Hailu",
    role: "Public Servant",
    story:
      "Leenjii hojjataa mootummaa irra deebi'anii ministeera keessatti hojii argadhe. Amma dhaloota biraaf gargaara.",
    year: "2020",
    achievement: "Leadership",
    icon: <Award className="w-6 h-6" />,
  },
  {
    id: 4,
    name: "Mekdes Tadesse",
    role: "University Professor",
    story:
      "Gorsaa fi leenjii dhaabbata kanaa irra deebi'anii PhD argadhe. Amma university keessatti barsiisaa jira.",
    year: "2021",
    achievement: "Education",
    icon: <GraduationCap className="w-6 h-6" />,
  },
];

// Partners
const partners = [
  {
    name: "Ministry of Education",
    logo: "ME",
    type: "Government",
  },
  {
    name: "Ethiopian Universities",
    logo: "EU",
    type: "Education",
  },
  {
    name: "Local NGOs",
    logo: "NGO",
    type: "Non-profit",
  },
  {
    name: "Community Leaders",
    logo: "CL",
    type: "Community",
  },
  {
    name: "Private Sector",
    logo: "PS",
    type: "Business",
  },
  {
    name: "International Donors",
    logo: "ID",
    type: "Funding",
  },
];

// Testimonials
const testimonials = [
  {
    id: 1,
    name: "Obbo Mi'eessaa Goollo",
    role: "Hojjataa Mootummaa",
    content:
      "Dhaabbanni kun dhaloota kanaaf gorsaa addaa fi leenjii kennuu isaa bayyee guddaadha. Woggaa saddeen darbaan oolchaa ture.",
    avatar: "MG",
  },
  {
    id: 2,
    name: "Dr. Alemayehu Teklu",
    role: "University President",
    content:
      "Dhaabbata kana waliin hojjachuun barataan keenyaaf guddaa ta'e. Leenjii isaanii barataan hundaa naannoo keenyaa keessatti mul'ata.",
    avatar: "AT",
  },
  {
    id: 3,
    name: "W/ro Selamawit Bekele",
    role: "Community Leader",
    content:
      "Oltummaa fi wal-simannaa dhaabbata kanaa naannoo keenyaa keessatti bareedha. Gosoota hundaa waliin hojjachuu danda'an.",
    avatar: "SB",
  },
];

// FAQ Section
const faqs = [
  {
    question: "Dhaabbanni kun maalii?",
    answer:
      "Nutii Dhaabbati Gurmuu Tola Oltummaa dha. Dhaloota kana gorsuu, leenjii kennuu fi wal-simachuuf kaayyoo qabna.",
  },
  {
    question:
      "Maaliif makkana keessatti hirmaadhu?",
    answer:
      "Hirmaachuun sirratti guddaadha: leenjii argatta, hiriyyaa argatta, kaayyoo qabachuuf gargaarsa argatta.",
  },
  {
    question: "Kessatti maalii argatta?",
    answer:
      "Leenjii addaa, gorsaa, hiriyyaa, iddoo hojii, internship, fi gargaarsa qabatamaa argattu.",
  },
  {
    question: "Maaliif kan dhaloota qofa?",
    answer:
      "Dhaloota kana gorsuuf kaayyoo qabna, garuu hawaasa hundaa waliin hojjachuu danda'anna.",
  },
];

export default function ComprehensiveHomePage() {
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] =
    useState(false);
  const [
    activeTestimonial,
    setActiveTestimonial,
  ] = useState(0);
  const [showScrollTop, setShowScrollTop] =
    useState(false);
  const [activeFaq, setActiveFaq] = useState<
    number | null
  >(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] =
    useState(false);
  const [selectedProgram, setSelectedProgram] =
    useState<EventData | null>(null);

  // Auth state
  const {
    user,
    isAuthenticated,
    isLoading: authLoading,
    logout,
  } = useAuthStore();

  // Events data
  const {
    getEvents,
    loading: eventsLoading,
    error: eventsError,
  } = useEvents();
  const [programs, setPrograms] = useState<
    EventData[]
  >([]);
  const [upcomingEvents, setUpcomingEvents] =
    useState<EventData[]>([]);

  // Fetch programs and events
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch featured programs
        const programsResponse = await getEvents({
          isFeatured: true,
          limit: 4,
        });
        if (programsResponse.events) {
          setPrograms(programsResponse.events);
        }

        // Fetch upcoming events
        const eventsResponse = await getEvents({
          upcoming: true,
          limit: 4,
        });
        if (eventsResponse.events) {
          setUpcomingEvents(
            eventsResponse.events
          );
        }
      } catch (err) {
        console.error(
          "Failed to fetch data:",
          err
        );
      }
    };

    fetchData();
  }, [getEvents]);

  // Handle scroll
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 500);
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

  // Auto-rotate testimonials
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveTestimonial(
        (prev) => (prev + 1) % testimonials.length
      );
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // Scroll to top
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // Handle login redirect
  const handleLoginRedirect = () => {
    router.push("/login");
  };

  // Handle register redirect
  const handleRegisterRedirect = () => {
    router.push("/register");
  };

  // Handle logout
  const handleLogout = () => {
    logout();
    toast.success("Logged out successfully!");
    router.push("/");
  };

  // Handle dashboard navigation
  const handleDashboard = () => {
    if (isAuthenticated && user) {
      if (
        user.role === "admin" ||
        user.role === "superadmin"
      ) {
        router.push("/admin/dashboard");
      } else {
        router.push("/dashboard");
      }
    }
  };

  // Newsletter subscription
  const handleNewsletter = (
    e: React.FormEvent
  ) => {
    e.preventDefault();
    toast.success(
      "Thank you for subscribing! Welcome to our community!"
    );
    setEmail("");
  };

  // Register for event
  const handleEventRegister = (
    eventId: string
  ) => {
    if (!isAuthenticated) {
      toast.error(
        "Please login to register for events"
      );
      handleLoginRedirect();
      return;
    }
    toast.success(
      "Successfully registered for event!"
    );
    // TODO: Implement actual event registration
  };

  // Format date safely
  const formatDate = (
    dateString: string | undefined
  ) => {
    if (!dateString) return "Date TBA";
    try {
      return new Date(
        dateString
      ).toLocaleDateString();
    } catch (error) {
      return "Invalid Date";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-gray-50 to-white">
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            borderRadius: "16px",
            background: "#1f2937",
            color: "#f9fafb",
            border: "1px solid #374151",
          },
        }}
      />

      {/* Progress bar */}
      <div className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-green-500 to-purple-500 z-50">
        <motion.div
          className="h-full bg-white"
          style={{ width: "100%" }}
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{
            duration: 0.5,
            ease: "easeInOut",
          }}
        />
      </div>

      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-xl border-b border-gray-100/50">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <Link
              href="/"
              className="flex items-center space-x-3 group"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{
                  type: "spring",
                  stiffness: 200,
                }}
                className="relative"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-green-500 rounded-2xl blur-xl opacity-30 group-hover:opacity-50 transition-opacity" />
                <div className="relative w-12 h-12 bg-gradient-to-br from-blue-600 to-green-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <Users className="w-7 h-7 text-white" />
                </div>
              </motion.div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 via-green-600 to-purple-600 bg-clip-text text-transparent">
                  Nutii Organization
                </h1>
                <p className="text-xs text-gray-500 font-medium">
                  Gurmuu Volunteer Association
                </p>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-1">
              {[
                "Home",
                "Training",
                "Services",
                "Partners",
                "Projects",
                "Blog",
              ].map((item) => (
                <Link
                  key={item}
                  href={`#${item.toLowerCase()}`}
                  className="px-4 py-2.5 text-gray-700 hover:text-blue-600 font-medium rounded-xl hover:bg-gray-50/50 transition-all duration-300 text-sm"
                >
                  {item}
                </Link>
              ))}
            </nav>

            {/* Action Buttons */}
            <div className="flex items-center space-x-3">
              {isAuthenticated ? (
                <>
                  <div className="hidden md:flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                      <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-green-500 rounded-full flex items-center justify-center text-white font-semibold">
                        {user?.name?.charAt(0) ||
                          "U"}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {user?.name}
                        </p>
                        <p className="text-xs text-gray-500 capitalize">
                          {user?.role}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={handleDashboard}
                      className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-green-600 text-white font-semibold rounded-xl hover:shadow-xl hover:shadow-blue-500/25 transition-all duration-300"
                    >
                      Dashboard
                    </button>
                    <button
                      onClick={handleLogout}
                      className="px-5 py-2.5 text-gray-700 font-medium rounded-xl hover:bg-gray-50/50 transition-all duration-300 flex items-center gap-2"
                    >
                      <LogOut className="w-4 h-4" />
                      Logout
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <button
                    onClick={handleLoginRedirect}
                    className="hidden md:inline-flex items-center gap-2 px-5 py-2.5 text-gray-700 font-medium rounded-xl hover:bg-gray-50/50 transition-all duration-300"
                  >
                    <LogIn className="w-4 h-4" />
                    Login
                  </button>
                  <button
                    onClick={
                      handleRegisterRedirect
                    }
                    className="hidden md:inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-600 to-green-600 text-white font-semibold rounded-xl hover:shadow-xl hover:shadow-blue-500/25 transition-all duration-300"
                  >
                    <UserPlus className="w-4 h-4" />
                    Register
                  </button>
                </>
              )}

              {/* Mobile Menu Button */}
              <button
                onClick={() =>
                  setMobileMenuOpen(
                    !mobileMenuOpen
                  )
                }
                className="lg:hidden p-2.5 text-gray-700 hover:text-blue-600 hover:bg-gray-50/50 rounded-xl transition-colors"
              >
                {mobileMenuOpen ? (
                  <X className="w-6 h-6" />
                ) : (
                  <Menu className="w-6 h-6" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{
                opacity: 1,
                height: "auto",
              }}
              exit={{ opacity: 0, height: 0 }}
              className="lg:hidden border-t border-gray-100/50 bg-white/95 backdrop-blur-xl overflow-hidden"
            >
              <div className="container mx-auto px-4 py-6 space-y-2">
                {[
                  "Home",
                  "Mission",
                  "Training",
                  "Services",
                  "Partners",
                  "Projects",
                  "Events",
                  "Blog",
                ].map((item) => (
                  <Link
                    key={item}
                    href={`#${item.toLowerCase()}`}
                    className="block py-3 text-gray-700 hover:text-blue-600 font-medium hover:bg-gray-50/50 rounded-xl px-4 transition-colors text-sm"
                    onClick={() =>
                      setMobileMenuOpen(false)
                    }
                  >
                    {item}
                  </Link>
                ))}

                <div className="pt-4 border-t border-gray-100/50 space-y-3">
                  {isAuthenticated ? (
                    <>
                      <div className="px-4 py-3 bg-gray-50 rounded-xl">
                        <p className="font-medium text-gray-900">
                          {user?.name}
                        </p>
                        <p className="text-sm text-gray-500 capitalize">
                          {user?.role}
                        </p>
                      </div>
                      <button
                        onClick={() => {
                          handleDashboard();
                          setMobileMenuOpen(
                            false
                          );
                        }}
                        className="block w-full py-3 text-center bg-gradient-to-r from-blue-600 to-green-600 text-white font-semibold rounded-xl hover:shadow-lg"
                      >
                        Dashboard
                      </button>
                      <button
                        onClick={() => {
                          handleLogout();
                          setMobileMenuOpen(
                            false
                          );
                        }}
                        className="block w-full py-3 text-center text-gray-700 font-medium rounded-xl border border-gray-200 hover:bg-gray-50"
                      >
                        Logout
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => {
                          handleLoginRedirect();
                          setMobileMenuOpen(
                            false
                          );
                        }}
                        className="block w-full py-3 text-center text-gray-700 font-medium rounded-xl border border-gray-200 hover:bg-gray-50"
                      >
                        Login
                      </button>
                      <button
                        onClick={() => {
                          handleRegisterRedirect();
                          setMobileMenuOpen(
                            false
                          );
                        }}
                        className="block w-full py-3 text-center bg-gradient-to-r from-blue-600 to-green-600 text-white font-semibold rounded-xl hover:shadow-lg"
                      >
                        Register
                      </button>
                    </>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden py-28 lg:py-40">
        {/* Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50/70 via-green-50/40 to-purple-50/70" />

        {/* Floating glow blobs */}
        <div className="absolute -top-24 -left-24 w-[28rem] h-[28rem] bg-blue-400/10 rounded-full blur-[120px] animate-[pulse_8s_ease-in-out_infinite]" />
        <div className="absolute top-1/3 -right-24 w-[30rem] h-[30rem] bg-green-400/10 rounded-full blur-[140px] animate-[pulse_10s_ease-in-out_infinite]" />
        <div className="absolute -bottom-24 left-1/4 w-[32rem] h-[32rem] bg-purple-400/10 rounded-full blur-[160px] animate-[pulse_12s_ease-in-out_infinite]" />

        <div className="container mx-auto px-4 lg:px-8 relative">
          <div className="max-w-5xl mx-auto text-center">
            {/* Accent Line */}
            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 0.8 }}
              className="mx-auto mb-10 h-1 w-24 rounded-full bg-gradient-to-r from-blue-600 via-green-600 to-purple-600"
            />

            {/* Main Title */}
            <motion.h1
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-5xl lg:text-7xl font-extrabold mb-8 leading-tight tracking-tight"
            >
              <span className="bg-gradient-to-r from-blue-600 via-green-600 to-purple-600 bg-clip-text text-transparent drop-shadow-md">
                Empowering Communities
              </span>
              <br />
              <span className="text-gray-900">
                Through Volunteerism
              </span>
            </motion.h1>

            {/* Subtitle */}
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-2xl lg:text-3xl text-gray-700 mb-10 font-semibold"
            >
              Building a Stronger and More
              Inclusive Society
            </motion.h2>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-lg lg:text-xl text-gray-600 mb-14 leading-relaxed max-w-4xl mx-auto"
            >
              Nutii Organization is dedicated to
              empowering youth and communities
              through training, guidance, and
              impactful volunteer programs that
              create lasting social change.
            </motion.p>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12 max-w-4xl mx-auto"
            >
              {heroData.stats.map(
                (stat, index) => (
                  <div
                    key={index}
                    className="text-center"
                  >
                    <div className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                      {stat.value}
                    </div>
                    <div className="text-sm text-gray-600">
                      {stat.label}
                    </div>
                  </div>
                )
              )}
            </motion.div>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="flex flex-wrap justify-center gap-8"
            >
              {isAuthenticated ? (
                <button
                  onClick={handleDashboard}
                  className="group relative px-10 py-4 rounded-2xl font-semibold text-white
            bg-gradient-to-r from-blue-600 to-green-600
            hover:shadow-2xl hover:shadow-blue-500/40
            transition-all duration-300 overflow-hidden"
                >
                  <span className="relative z-10 flex items-center gap-3">
                    Go to Dashboard
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
                  </span>
                  <span className="absolute inset-0 bg-gradient-to-r from-green-600 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                </button>
              ) : (
                <button
                  onClick={handleRegisterRedirect}
                  className="group relative px-10 py-4 rounded-2xl font-semibold text-white
            bg-gradient-to-r from-blue-600 to-green-600
            hover:shadow-2xl hover:shadow-blue-500/40
            transition-all duration-300 overflow-hidden"
                >
                  <span className="relative z-10 flex items-center gap-3">
                    Join as a Volunteer
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
                  </span>
                  <span className="absolute inset-0 bg-gradient-to-r from-green-600 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                </button>
              )}

              <button
                onClick={() =>
                  document
                    .getElementById("about")
                    ?.scrollIntoView({
                      behavior: "smooth",
                    })
                }
                className="px-10 py-4 rounded-2xl font-semibold text-gray-800
            bg-white/80 backdrop-blur-md border border-gray-200
            hover:bg-white hover:border-blue-300 hover:shadow-xl transition-all duration-300"
              >
                Learn More
              </button>
            </motion.div>

            {/* Scroll Hint */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="mt-16 flex justify-center"
            >
              <div className="flex flex-col items-center text-gray-400 text-sm">
                <span>Scroll</span>
                <div className="mt-2 h-6 w-0.5 bg-gray-300 rounded-full animate-bounce" />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section
        id="about"
        className="relative py-24 lg:py-32 bg-white overflow-hidden"
      >
        {/* Soft background accents */}
        <div className="absolute -top-32 -left-32 w-[28rem] h-[28rem] bg-blue-100/40 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 -right-32 w-[30rem] h-[30rem] bg-green-100/40 rounded-full blur-[140px]" />

        <div className="container mx-auto px-4 lg:px-8 relative">
          {/* Section Header */}
          <div className="text-center max-w-3xl mx-auto mb-20">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 px-5 py-2.5
          bg-gradient-to-r from-blue-50 to-green-50
          rounded-full mb-8 shadow-sm"
            >
              <Info className="w-4 h-4 text-blue-600" />
              <span className="text-sm font-semibold text-blue-700 tracking-wide">
                Waa'ee Keenya
              </span>
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-4xl lg:text-5xl font-extrabold text-gray-900 mb-8"
            >
              Maaliif Nuti?
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="text-lg lg:text-xl text-gray-600 leading-relaxed"
            >
              Woggaa saddeen darbaan dhaloota kana
              keessatti baroota 2014 hanga ammatti
              kaayyoo addaa waliin oolchaa ture.
              Dhaloota ijjeessuu waan jirtan
              dhiifama gaafanna.
            </motion.p>
          </div>

          {/* Core Values */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {coreValues.map((value, index) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{
                  delay: index * 0.12,
                }}
                className="group relative"
              >
                {/* Card Glow */}
                <div
                  className="absolute inset-0 rounded-3xl bg-gradient-to-br
              from-blue-100/20 via-white to-green-100/20
              opacity-0 group-hover:opacity-100
              blur-xl transition-opacity duration-500"
                />

                {/* Card */}
                <div
                  className="relative h-full p-8 rounded-3xl
              bg-white/80 backdrop-blur-sm border border-gray-200/60
              shadow-sm group-hover:shadow-2xl group-hover:border-blue-200/60
              transition-all duration-500"
                >
                  {/* Icon */}
                  <div
                    className={`inline-flex p-4 bg-gradient-to-br ${value.color}
                rounded-2xl mb-6 group-hover:scale-110 group-hover:rotate-3
                transition-transform duration-300`}
                  >
                    <div className="text-white">
                      {value.icon}
                    </div>
                  </div>

                  {/* Title */}
                  <h3 className="text-xl font-bold text-gray-900 mb-4">
                    {value.title}
                  </h3>

                  {/* Description */}
                  <p className="text-gray-600 leading-relaxed mb-5">
                    {value.description}
                  </p>

                  {/* Benefits */}
                  <ul className="space-y-3">
                    {value.benefits.map(
                      (benefit, i) => (
                        <li
                          key={i}
                          className="flex items-start gap-2 text-sm text-gray-600"
                        >
                          <Check className="w-4 h-4 mt-0.5 text-green-500 shrink-0" />
                          {benefit}
                        </li>
                      )
                    )}
                  </ul>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Programs Section */}
      <section
        id="programs"
        className="py-28 bg-gradient-to-b from-gray-50 to-white"
      >
        <div className="container mx-auto px-4 lg:px-8">
          {/* Header */}
          <div className="text-center max-w-3xl mx-auto mb-24">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-3 px-5 py-2 bg-gradient-to-r from-green-50 to-blue-50 rounded-full mb-6 shadow-sm"
            >
              <BookOpen className="w-5 h-5 text-green-600" />
              <span className="text-sm font-semibold text-green-700 uppercase tracking-wider">
                Leenjii fi Gorsa
              </span>
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-5xl lg:text-6xl font-extrabold text-gray-900 mb-6 leading-tight tracking-tight"
            >
              Leenjii Addaa{" "}
              <span className="bg-gradient-to-r from-green-500 to-blue-500 bg-clip-text text-transparent">
                fi Gorsa
              </span>
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-lg lg:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed"
            >
              Baroota 10 ol oolchaa ture. Dhaloota
              kana keessatti leenjii addaa fi
              gorsaa kennuu keenya irra
              deddeebi'anii socho'aa jirra.
              Jijjiirama ifaa fi milkaa’ina dhala
              namaa fiduuf.
            </motion.p>
          </div>

          {/* Programs Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-10">
            {programs.map((program, index) => (
              <motion.div
                key={program._id}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                whileHover={{
                  y: -8,
                  scale: 1.03,
                }}
                viewport={{ once: true }}
                transition={{
                  delay: index * 0.1,
                }}
                onClick={() =>
                  setSelectedProgram(program)
                }
                className="relative cursor-pointer group"
              >
                <div className="absolute inset-0 bg-white rounded-3xl border border-gray-200 shadow-lg group-hover:shadow-2xl group-hover:border-blue-300 transition-all duration-500" />

                <div className="relative p-8 h-full flex flex-col">
                  <div className="inline-flex p-5 bg-gradient-to-br from-blue-500 to-green-400 rounded-2xl mb-6 shadow-md text-white text-xl">
                    <BookOpen className="w-6 h-6" />
                  </div>

                  <div className="mb-6 flex-1">
                    <div className="text-sm font-semibold text-gray-500 mb-2 tracking-wide uppercase">
                      {formatDate(program.date)} -{" "}
                      {program.location || "TBA"}
                    </div>

                    <h3 className="text-xl lg:text-2xl font-bold text-gray-900 mb-3 leading-snug group-hover:text-blue-600 transition-colors">
                      {program.title}
                    </h3>

                    <p className="text-gray-600 text-sm lg:text-base leading-relaxed">
                      {program.description?.substring(
                        0,
                        120
                      ) ||
                        "No description available"}
                      ...
                    </p>
                  </div>

                  <div className="flex items-center justify-between mt-auto">
                    <span className="px-3 py-1 bg-blue-50 text-blue-700 text-sm font-semibold rounded-full tracking-wide">
                      {program.category ||
                        "General"}
                    </span>
                    <ChevronRight className="w-5 h-5 text-blue-500 group-hover:translate-x-2 transition-transform" />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Success Stories */}
      <section className="py-28 bg-white">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-24">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-3 px-5 py-2 bg-gradient-to-r from-amber-50 to-orange-50 rounded-full mb-6 shadow-sm"
            >
              <Trophy className="w-5 h-5 text-amber-600" />
              <span className="text-sm font-semibold text-amber-700 uppercase tracking-wider">
                Milkaa'inaa
              </span>
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-5xl lg:text-6xl font-extrabold text-gray-900 mb-6 leading-tight tracking-tight"
            >
              Ijoo{" "}
              <span className="bg-gradient-to-r from-amber-500 to-orange-500 bg-clip-text text-transparent">
                Dhalootaa
              </span>
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-lg lg:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed"
            >
              Dhaloota keenya irra deebi'anii maal
              hojjachaa jiran? Akkaataa leenjii
              keenyaan jireenya isaanii jijjiirran
              fi milkaa'ina argatan.
            </motion.p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-10">
            {successStories.map(
              (story, index) => (
                <motion.div
                  key={story.id}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{
                    opacity: 1,
                    y: 0,
                  }}
                  viewport={{ once: true }}
                  transition={{
                    delay: index * 0.1,
                  }}
                  className="group cursor-pointer"
                >
                  <div className="bg-white rounded-3xl border border-gray-200 shadow-lg p-8 hover:shadow-2xl transition-all duration-500 h-full flex flex-col">
                    <div className="flex items-center justify-between mb-6">
                      <div className="p-4 bg-gradient-to-br from-blue-100 to-green-100 rounded-2xl shadow-sm">
                        {story.icon}
                      </div>
                      <span className="text-sm font-semibold text-gray-500 tracking-wide">
                        {story.year}
                      </span>
                    </div>

                    <div className="mb-6 flex-1">
                      <div className="text-lg lg:text-xl font-bold text-gray-900 mb-1 leading-snug">
                        {story.name}
                      </div>
                      <div className="text-sm text-gray-600 mb-3">
                        {story.role}
                      </div>
                      <p className="text-gray-700 italic text-sm lg:text-base leading-relaxed">
                        "{story.story}"
                      </p>
                    </div>

                    <div className="px-4 py-2 bg-gradient-to-r from-blue-50 to-green-50 rounded-full inline-block">
                      <span className="text-sm font-semibold text-blue-700">
                        {story.achievement}
                      </span>
                    </div>
                  </div>
                </motion.div>
              )
            )}
          </div>
        </div>
      </section>

      {/* Upcoming Events Section - FIXED */}
      <section
        id="events"
        className="py-20 bg-gradient-to-b from-gray-50 to-white"
      >
        <div className="container mx-auto px-4 lg:px-8">
          {/* Section Header */}
          <div className="text-center max-w-3xl mx-auto mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-50 to-pink-50 rounded-full mb-6"
            >
              <Calendar className="w-4 h-4 text-purple-600" />
              <span className="text-sm font-semibold text-purple-700">
                Oolcha Dhihoo
              </span>
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6"
            >
              Upcoming Events
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-lg text-gray-600"
            >
              Explore our latest events,
              workshops, and conferences. Don't
              miss the chance to participate and
              connect with the community.
            </motion.p>
          </div>

          {/* Loading/Error States */}
          {eventsLoading && (
            <p className="text-center text-gray-500 text-lg font-medium">
              Loading events...
            </p>
          )}
          {eventsError && (
            <p className="text-center text-red-500 text-lg font-medium">
              Error loading events
            </p>
          )}

          {/* Events Grid */}
          {upcomingEvents.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
              {upcomingEvents.map(
                (event, index) => (
                  <motion.div
                    key={event._id}
                    initial={{
                      opacity: 0,
                      y: 40,
                    }}
                    whileInView={{
                      opacity: 1,
                      y: 0,
                    }}
                    viewport={{ once: true }}
                    transition={{
                      delay: index * 0.1,
                    }}
                    className="group"
                  >
                    <div className="bg-white rounded-3xl shadow-lg overflow-hidden border border-gray-200 transition-all hover:shadow-2xl hover:scale-105 duration-500 h-full flex flex-col">
                      {/* Image */}
                      <div className="h-40 w-full bg-gray-100 flex items-center justify-center">
                        {event.files &&
                        event.files.length > 0 ? (
                          <div className="relative w-full h-full">
                            <Image
                              src={
                                event.files[0].url
                              }
                              alt={event.title}
                              fill
                              className="object-cover"
                            />
                          </div>
                        ) : (
                          <Calendar className="w-12 h-12 text-gray-300" />
                        )}
                      </div>

                      {/* Content */}
                      <div className="p-6 flex-1 flex flex-col justify-between">
                        <div>
                          <div className="flex items-center justify-between mb-3">
                            <span className="px-3 py-1 rounded-full text-sm font-semibold bg-gradient-to-r from-blue-50 to-green-50 text-blue-700">
                              {event.category ||
                                "Event"}
                            </span>
                            <span className="px-3 py-1 rounded-full text-sm font-semibold bg-green-50 text-green-700">
                              Free
                            </span>
                          </div>

                          <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2">
                            {event.title}
                          </h3>
                          <p className="text-gray-600 text-sm mb-6 line-clamp-3">
                            {event.description ||
                              "No description available."}
                          </p>

                          <div className="space-y-2 mb-4 text-gray-500 text-sm">
                            <div className="flex items-center gap-2">
                              <Calendar className="w-4 h-4" />
                              {formatDate(
                                event.date
                              )}
                            </div>
                            <div className="flex items-center gap-2">
                              <Clock className="w-4 h-4" />
                              {event.time ||
                                "All day"}
                            </div>
                            <div className="flex items-center gap-2">
                              <MapPin className="w-4 h-4" />
                              {event.location ||
                                "Location TBA"}
                            </div>
                          </div>
                        </div>

                        {/* Conditional Button */}
                        {isAuthenticated ? (
                          <Link
                            href={`/events/${event._id}`}
                            className="mt-auto w-full px-4 py-3 bg-gradient-to-r from-blue-600 to-green-600 text-white font-semibold rounded-xl hover:shadow-lg hover:scale-105 transition-all duration-300 text-center"
                          >
                            View Details
                          </Link>
                        ) : (
                          <Link
                            href="/login"
                            className="mt-auto w-full px-4 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-xl hover:shadow-lg hover:scale-105 transition-all duration-300 text-center"
                          >
                            Login to Register
                          </Link>
                        )}
                      </div>
                    </div>
                  </motion.div>
                )
              )}
            </div>
          ) : (
            !eventsLoading && (
              <p className="text-center text-gray-500 text-lg font-medium">
                No upcoming events at the moment.
              </p>
            )
          )}

          {/* View All Button */}
          <div className="text-center">
            <Link
              href="/events"
              className="inline-flex items-center gap-2 px-8 py-4 bg-white text-gray-700 font-semibold rounded-xl border border-gray-200 hover:border-blue-300 hover:shadow-lg transition-all duration-300"
            >
              <Calendar className="w-5 h-5" />
              View All Events
            </Link>
          </div>
        </div>
      </section>

      {/* Partners Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4 lg:px-8">
          {/* Header */}
          <div className="text-center mb-16">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-4xl lg:text-5xl font-extrabold text-gray-900 mb-4 leading-tight"
            >
              Hiriyaa fi{" "}
              <span className="bg-gradient-to-r from-blue-500 to-green-500 bg-clip-text text-transparent">
                Waliigaltee
              </span>
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-gray-600 max-w-2xl mx-auto text-lg"
            >
              Waliin hojjachuun dhalootaf
              gargaaruuf hiriyaa fi waliigaltee
              hedduu waliin hojjachaa jirra.
            </motion.p>
          </div>

          {/* Partners Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-8">
            {partners.map((partner, index) => (
              <motion.div
                key={partner.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{
                  delay: index * 0.1,
                }}
                className="group"
              >
                <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 hover:shadow-lg hover:scale-105 transition-transform duration-300 flex flex-col items-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-green-500 rounded-xl flex items-center justify-center text-white text-2xl font-bold mb-4 shadow-sm group-hover:shadow-md transition-shadow duration-300">
                    {partner.logo}
                  </div>
                  <div className="text-center">
                    <div className="font-semibold text-gray-900 mb-1">
                      {partner.name}
                    </div>
                    <div className="text-xs text-gray-500">
                      {partner.type}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section
        id="testimonials"
        className="py-24 bg-gradient-to-b from-white to-gray-50"
      >
        <div className="container mx-auto px-4 lg:px-8">
          {/* Header */}
          <div className="text-center max-w-3xl mx-auto mb-16 relative">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-3 px-5 py-2 bg-gradient-to-r from-rose-50 to-pink-50 rounded-full mb-6 shadow-md"
            >
              <Quote className="w-5 h-5 text-rose-600" />
              <span className="text-sm font-semibold text-rose-700 tracking-wide">
                Ijoo fi Madaala
              </span>
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-4xl lg:text-5xl font-extrabold text-gray-900 mb-6 leading-tight"
            >
              Namootni{" "}
              <span className="bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 bg-clip-text text-transparent animate-pulse">
                Maal Jettu
              </span>
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-gray-600 max-w-2xl mx-auto text-lg"
            >
              Dhaloota keenya irraa dhugaa fi
              madaala: namootni maal jedhani fi
              jireenya isaanii akkamitti
              jijjiirran.
            </motion.p>
          </div>

          {/* Testimonial Card */}
          <div className="relative max-w-4xl mx-auto">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTestimonial}
                initial={{
                  opacity: 0,
                  x: 100,
                  scale: 0.95,
                }}
                animate={{
                  opacity: 1,
                  x: 0,
                  scale: 1,
                }}
                exit={{
                  opacity: 0,
                  x: -100,
                  scale: 0.95,
                }}
                transition={{ duration: 0.5 }}
                className="bg-white rounded-3xl border border-gray-200/30 p-8 lg:p-12 shadow-xl hover:shadow-2xl transition-all duration-500"
              >
                <div className="flex flex-col lg:flex-row items-center gap-8">
                  {/* Avatar */}
                  <div className="lg:w-1/4 flex justify-center lg:justify-start">
                    <div className="relative">
                      <div className="w-32 h-32 bg-gradient-to-br from-blue-500 to-green-500 rounded-full flex items-center justify-center text-white text-3xl font-bold shadow-lg transform hover:scale-105 transition-transform duration-500">
                        {
                          testimonials[
                            activeTestimonial
                          ].avatar
                        }
                      </div>
                      <div className="absolute -bottom-3 -right-3 w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold shadow-lg animate-bounce">
                        <Quote className="w-6 h-6" />
                      </div>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="lg:w-3/4">
                    <div className="flex items-center gap-2 mb-6">
                      {[...Array(5)].map(
                        (_, i) => (
                          <Star
                            key={i}
                            className="w-5 h-5 text-amber-500 fill-amber-500 animate-pulse"
                          />
                        )
                      )}
                    </div>
                    <p className="text-lg lg:text-xl text-gray-700 italic mb-8 leading-relaxed tracking-wide">
                      "
                      {
                        testimonials[
                          activeTestimonial
                        ].content
                      }
                      "
                    </p>
                    <div>
                      <div className="font-bold text-gray-900 text-lg">
                        {
                          testimonials[
                            activeTestimonial
                          ].name
                        }
                      </div>
                      <div className="text-gray-600">
                        {
                          testimonials[
                            activeTestimonial
                          ].role
                        }
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Navigation Dots */}
            <div className="flex justify-center items-center gap-4 mt-10">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() =>
                    setActiveTestimonial(index)
                  }
                  className={`rounded-full transition-all duration-500 ${
                    index === activeTestimonial
                      ? "w-8 h-3 bg-gradient-to-r from-blue-600 to-green-500 shadow-lg"
                      : "w-3 h-3 bg-gray-300 hover:bg-gray-400"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>


{/* FAQ Section */}
<section className="py-24 bg-gray-50">
  <div className="container mx-auto px-4 lg:px-8">
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="text-center mb-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="inline-flex items-center gap-2 px-5 py-2 bg-gradient-to-r from-indigo-50 to-blue-50 rounded-full mb-6 shadow-sm"
        >
          <HelpCircle className="w-5 h-5 text-indigo-600" />
          <span className="text-sm font-semibold text-indigo-700 tracking-wide">
            Gaaffii fi Deebii
          </span>
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-4xl lg:text-5xl font-extrabold text-gray-900 mb-6 leading-tight"
        >
          Gaaffiiwwan <span className="text-blue-600">Dhihoo fi Barbaachisaa</span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-gray-600 text-lg"
        >
          Gaaffilee yeroo hedduu ka’aman fi deebii isaanii sirrii fi ifaa ta’e argachuuf.
        </motion.p>
      </div>

      {/* FAQ Items */}
      <div className="space-y-5">
        {faqs.map((faq, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-3xl shadow-md border border-gray-200 hover:shadow-xl transition-shadow duration-300 overflow-hidden"
          >
            <button
              onClick={() => setActiveFaq(activeFaq === index ? null : index)}
              className="w-full px-6 py-5 flex items-center justify-between text-left bg-white hover:bg-gray-50 transition-colors"
            >
              <span className="text-lg font-semibold text-gray-900">
                {faq.question}
              </span>
              <motion.div
                animate={{ rotate: activeFaq === index ? 90 : 0 }}
                transition={{ duration: 0.3 }}
              >
                <ChevronRight className="w-5 h-5 text-gray-500" />
              </motion.div>
            </button>

            <AnimatePresence>
              {activeFaq === index && (
                <motion.div
                  initial={{ height: 0, opacity: 0, paddingTop: 0, paddingBottom: 0 }}
                  animate={{ height: "auto", opacity: 1, paddingTop: 20, paddingBottom: 20 }}
                  exit={{ height: 0, opacity: 0, paddingTop: 0, paddingBottom: 0 }}
                  className="px-6 bg-blue-50/20 border-t border-gray-200"
                >
                  <p className="text-gray-700 leading-relaxed">{faq.answer}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>
    </div>
  </div>
</section>

    




     {/* Final CTA */}
<section className="relative py-28 bg-gradient-to-br from-white to-blue-50 overflow-hidden">
  {/* Decorative floating shapes */}
  <div className="absolute -top-24 -left-24 w-80 h-80 bg-blue-200/20 rounded-full filter blur-3xl animate-blob"></div>
  <div className="absolute -bottom-24 -right-24 w-80 h-80 bg-green-200/20 rounded-full filter blur-3xl animate-blob animation-delay-2000"></div>
  <div className="absolute top-1/2 left-1/2 w-72 h-72 bg-purple-200/20 rounded-full filter blur-2xl animate-blob animation-delay-4000"></div>

  <div className="container mx-auto px-4 lg:px-8 relative z-10">
    <div className="max-w-4xl mx-auto text-center">
      {/* Icon Badge */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8, rotate: -10 }}
        whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
        viewport={{ once: true }}
        transition={{ type: "spring", stiffness: 120 }}
        className="inline-flex p-5 bg-gradient-to-br from-blue-400 to-green-400 rounded-3xl mb-8 shadow-2xl"
      >
        <Rocket className="w-16 h-16 text-white animate-bounce" />
      </motion.div>

      {/* Main Title */}
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-5xl lg:text-6xl font-extrabold text-gray-900 mb-6 leading-tight tracking-tight"
      >
        Har'a <span className="text-gradient bg-gradient-to-r from-blue-500 to-green-500 bg-clip-text text-transparent">Eegaluu!</span>
      </motion.h2>

      {/* Subtitle */}
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-xl lg:text-2xl text-gray-700 mb-12 max-w-3xl mx-auto leading-relaxed"
      >
        Dhaloota kana keessatti <span className="font-bold text-blue-600">hiriyaa ta'i</span>, 
        leenjii <span className="font-bold text-green-600">argadhaa</span>, 
        hiriyyaa <span className="font-bold text-purple-600">argadhaa</span>, 
        fi jireenya keessan <span className="font-extrabold text-gradient bg-gradient-to-r from-blue-500 to-green-500 bg-clip-text text-transparent">jijjiradhaa</span>.
      </motion.p>

      {/* Buttons */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="flex flex-col sm:flex-row gap-6 justify-center"
      >
        {isAuthenticated ? (
          <button
            onClick={handleDashboard}
            className="group px-12 py-4 bg-gradient-to-r from-blue-600 to-green-600 text-white font-semibold rounded-3xl hover:scale-105 hover:shadow-2xl transition-all duration-300 flex items-center justify-center gap-3 shadow-lg"
          >
            Go to Dashboard
            <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
          </button>
        ) : (
          <>
            <button
              onClick={handleRegisterRedirect}
              className="group px-12 py-4 bg-gradient-to-r from-blue-600 to-green-600 text-white font-semibold rounded-3xl hover:scale-105 hover:shadow-2xl transition-all duration-300 flex items-center justify-center gap-3 shadow-lg"
            >
              Register Now
              <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
            </button>
            <button
              onClick={handleLoginRedirect}
              className="px-12 py-4 bg-white text-gray-700 font-semibold rounded-3xl border border-gray-200 hover:border-blue-300 hover:shadow-lg transition-all duration-300"
            >
              Login
            </button>
          </>
        )}
      </motion.div>

      {/* Extra Note */}
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mt-10 text-sm text-gray-500 italic"
      >
        Hiriyaa fi leenjii argachuuf qophii guutuu ta'uu kee mirkaneessi.
      </motion.p>
    </div>
  </div>
</section>

      {/* Footer */}
      <footer className="bg-gradient-to-b from-gray-900 to-black text-white pt-16 pb-8">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12 mb-12">
            <div>
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-green-500 rounded-2xl flex items-center justify-center">
                  <Users className="w-7 h-7 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold">
                    Nutii Dhaabbati
                  </h3>
                  <p className="text-sm text-gray-400">
                    Gurmuu Tola Oltummaa
                  </p>
                </div>
              </div>
              <p className="text-gray-400 mb-6 text-sm leading-relaxed">
                Woggaa saddeen darbaan dhaloota
                kana keessatti baroota 2014 hanga
                ammatti kaayyoo addaa waliin
                oolchaa ture. Dhaloota ijjeessuu
                waan jirtan dhiifama gaafanna.
              </p>
              <div className="flex gap-4">
                {[
                  Facebook,
                  Twitter,
                  Instagram,
                  Linkedin,
                ].map((Icon, i) => (
                  <a
                    key={i}
                    href="#"
                    className="w-10 h-10 bg-gray-800 hover:bg-gray-700 rounded-xl flex items-center justify-center transition-colors"
                  >
                    <Icon className="w-5 h-5" />
                  </a>
                ))}
              </div>
            </div>

            {[
              {
                title: "Leenjii",
                links: [
                  "Barataa",
                  "Qotee Bulaa",
                  "Horsiisaa",
                  "Hojjataa",
                  "Technology",
                  "Business",
                ],
              },
              {
                title: "Kaayyoo",
                links: [
                  "Dhaloota Gorsuu",
                  "Oltummaa",
                  "Wal-simatu",
                  "Hawaasa",
                  "Sirna",
                  "Misooma",
                ],
              },
              {
                title: "Qabsiina",
                links: [
                  "Natti Bilbilaa",
                  "Email",
                  "Magaalaa",
                  "Facebook",
                  "Twitter",
                  "Office",
                ],
              },
            ].map((section) => (
              <div key={section.title}>
                <h4 className="font-bold text-lg mb-6">
                  {section.title}
                </h4>
                <ul className="space-y-3">
                  {section.links.map((link) => (
                    <li key={link}>
                      <Link
                        href="#"
                        className="text-gray-400 hover:text-white transition-colors text-sm"
                      >
                        {link}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="border-t border-gray-800 pt-8 text-center">
            <p className="text-gray-400 text-sm">
              © {new Date().getFullYear()} Nutii
              Dhaabbati Gurmuu Tola Oltummaa.
              Hundumtuu mirga ofii isaati.
            </p>
            <p className="text-gray-500 text-xs mt-2 italic">
              "Nami maqaa isaa xureessitan
              dhaloota ijjeesa waan jirtanuuf
              dhiifama gaafanna"
            </p>
          </div>
        </div>
      </footer>

      {/* Scroll to Top Button */}
      <AnimatePresence>
        {showScrollTop && (
          <motion.button
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            onClick={scrollToTop}
            className="fixed bottom-8 right-8 w-14 h-14 bg-gradient-to-br from-blue-600 to-green-600 text-white rounded-2xl shadow-2xl hover:shadow-3xl transition-all duration-300 z-50 flex items-center justify-center hover:scale-110"
          >
            <ChevronUp className="w-6 h-6" />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}
