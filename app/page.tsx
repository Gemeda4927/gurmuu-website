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
} from "lucide-react";
import {
  motion,
  AnimatePresence,
} from "framer-motion";

// Enhanced content data
const heroData = {
  title: "Nutii Dhaabbati Gurmuu Tola Oltummaa",
  subtitle: "Abbooti Muldhataa Dammassitu",
  description:
    "Woggaa saddeen darbaan keessatti dhaloota kana gorsaa ture. Baroota 2014 hanga ammatti dhaloota barsiisuu, qotee bulaan, horiissee bulan, hojjataan mootummaa fi kkf kaayyoo isaanirratti dammaqanii socho'an.",
  cta: {
    primary: "Makkana Keessatti Hirmaadhaa",
    secondary: "Waa'ee Keenya Beekuuf",
  },
  stats: [
    {
      value: "10+",
      label: "Woggaa Oolcha",
      icon: <CalendarDays className="w-5 h-5" />,
    },
    {
      value: "5000+",
      label: "Dhaloota Gorsame",
      icon: <Users className="w-5 h-5" />,
    },
    {
      value: "100+",
      label: "Leenjii Addaa",
      icon: <BookOpen className="w-5 h-5" />,
    },
    {
      value: "All",
      label: "Magaalaa Oromiyaa",
      icon: <MapPin className="w-5 h-5" />,
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

// Programs
const programs = [
  {
    title: "Leenjii Barataa",
    description:
      "Barataan barnootaa fi kaayyoo qabachuuf leenjii addaa kenna. Baroota 10 ol oolchaa ture.",
    icon: <Brain className="w-10 h-10" />,
    stats: "10,000+ Students",
    color: "bg-blue-500/10",
    duration: "12 Months",
    features: [
      "Online Courses",
      "Mentorship",
      "Career Guidance",
    ],
  },
  {
    title: "Horsiisaa Qotee Bulaa",
    description:
      "Qotee bulaan, horsiissee bulan hundaaf gargaarsa qabatamaa fi leenjii kenna.",
    icon: (
      <HeartHandshake className="w-10 h-10" />
    ),
    stats: "5,000+ Helped",
    color: "bg-green-500/10",
    duration: "Ongoing",
    features: [
      "Financial Aid",
      "Counseling",
      "Skill Training",
    ],
  },
  {
    title: "Hojjataa Mootummaa",
    description:
      "Hojjataan mootummaa waliin hojjachuun dhalootaf gargaarsa sirnaa fi malaawwan kenna.",
    icon: <AwardIcon className="w-10 h-10" />,
    stats: "50+ Partners",
    color: "bg-purple-500/10",
    duration: "Continuous",
    features: [
      "Government Partnerships",
      "Policy Advocacy",
      "Community Programs",
    ],
  },
  {
    title: "Oltummaa fi Wal-simatu",
    description:
      "Nama amantaa fi gosaan nama gargar hin baanyee. Oromiyaa keessatti hunda wal-simachuuf.",
    icon: <Globe className="w-10 h-10" />,
    stats: "All Regions",
    color: "bg-amber-500/10",
    duration: "Year-round",
    features: [
      "Cultural Events",
      "Interfaith Dialogue",
      "Community Building",
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

// Upcoming Events
const upcomingEvents = [
  {
    id: 1,
    title: "Leenjii Tech for Youth",
    date: "December 15, 2024",
    time: "9:00 AM - 4:00 PM",
    location: "Addis Ababa",
    description:
      "Dhalootaaf leenjii technology fi programming. Barataan university fi high school hundaaf.",
    seats: "150/200",
    category: "Technology",
    price: "Free",
  },
  {
    id: 2,
    title: "Wal-gahii Oltummaa",
    date: "December 20, 2024",
    time: "10:00 AM - 2:00 PM",
    location: "Jimma",
    description:
      "Gosoota, amantoota fi hawaasa hundaa wal-simachuuf wal-gahii guddaa.",
    seats: "300/500",
    category: "Community",
    price: "Free",
  },
  {
    id: 3,
    title: "Career Fair 2024",
    date: "January 10, 2025",
    time: "8:00 AM - 6:00 PM",
    location: "Adama",
    description:
      "Dhalootaaf iddoo hojii fi internship argachuuf karriira faayya.",
    seats: "50/100",
    category: "Business",
    price: "$10",
  },
  {
    id: 4,
    title: "Leadership Training",
    date: "January 25, 2025",
    time: "9:00 AM - 5:00 PM",
    location: "Hawassa",
    description:
      "Dhalootaaf leenjii leadership fi management qabatamaa.",
    seats: "75/100",
    category: "Education",
    price: "$25",
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
  const [hoveredProgram, setHoveredProgram] =
    useState<number | null>(null);
  const [showLoginModal, setShowLoginModal] =
    useState(false);
  const [
    showRegisterModal,
    setShowRegisterModal,
  ] = useState(false);
  const [activeFaq, setActiveFaq] = useState<
    number | null
  >(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] =
    useState(false);

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

  // Handle login
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success(
      "Welcome back! Redirecting to dashboard..."
    );
    setTimeout(() => {
      router.push("/dashboard");
    }, 1500);
    setShowLoginModal(false);
  };

  // Handle register
  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success(
      "Account created successfully! Welcome aboard!"
    );
    setTimeout(() => {
      router.push("/dashboard");
    }, 1500);
    setShowRegisterModal(false);
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
                  Nutii Dhaabbati
                </h1>
                <p className="text-xs text-gray-500 font-medium">
                  Gurmuu Tola Oltummaa
                </p>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-1">
              {[
                "Makkana",
                "Kaayyoo",
                "Leenjii",
                "Oolcha",
                "Wal-simatu",
                "Qabsiina",
                "Events",
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
              <button
                onClick={() =>
                  setShowLoginModal(true)
                }
                className="hidden md:inline-flex items-center gap-2 px-5 py-2.5 text-gray-700 font-medium rounded-xl hover:bg-gray-50/50 transition-all duration-300"
              >
                <LogIn className="w-4 h-4" />
                Seeni
              </button>
              <button
                onClick={() =>
                  setShowRegisterModal(true)
                }
                className="hidden md:inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-600 to-green-600 text-white font-semibold rounded-xl hover:shadow-xl hover:shadow-blue-500/25 transition-all duration-300"
              >
                <UserPlus className="w-4 h-4" />
                Galmaa'i
              </button>

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
                  "Makkana",
                  "Kaayyoo",
                  "Leenjii",
                  "Oolcha",
                  "Wal-simatu",
                  "Qabsiina",
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
                  <button
                    onClick={() => {
                      setShowLoginModal(true);
                      setMobileMenuOpen(false);
                    }}
                    className="block w-full py-3 text-center text-gray-700 font-medium rounded-xl border border-gray-200 hover:bg-gray-50"
                  >
                    Seeni
                  </button>
                  <button
                    onClick={() => {
                      setShowRegisterModal(true);
                      setMobileMenuOpen(false);
                    }}
                    className="block w-full py-3 text-center bg-gradient-to-r from-blue-600 to-green-600 text-white font-semibold rounded-xl hover:shadow-lg"
                  >
                    Galmaa'i
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 lg:py-32">
        {/* Background elements */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 via-green-50/30 to-purple-50/50" />
        <div className="absolute top-20 left-10 w-72 h-72 bg-gradient-to-br from-blue-400/10 to-green-400/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-gradient-to-br from-purple-400/10 to-blue-400/10 rounded-full blur-3xl" />

        <div className="container mx-auto px-4 lg:px-8 relative">
          <div className="max-w-6xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              {/* Left Column */}
              <div>
                {/* Badge */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full border border-gray-200/50 mb-8 shadow-lg"
                >
                  <Sparkle className="w-4 h-4 text-blue-500" />
                  <span className="text-sm font-semibold text-gray-700">
                    Woggaa 10 Oolcha
                  </span>
                </motion.div>

                {/* Main Title */}
                <motion.h1
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="text-5xl lg:text-6xl font-bold mb-6"
                >
                  <span className="bg-gradient-to-r from-blue-600 via-green-600 to-purple-600 bg-clip-text text-transparent">
                    {heroData.title}
                  </span>
                </motion.h1>

                {/* Subtitle */}
                <motion.h2
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="text-2xl lg:text-3xl text-gray-800 mb-8 font-semibold"
                >
                  {heroData.subtitle}
                </motion.h2>

                {/* Description */}
                <motion.p
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="text-lg text-gray-600 mb-8 leading-relaxed"
                >
                  {heroData.description}
                </motion.p>

                {/* CTA Buttons */}
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="flex flex-wrap gap-4"
                >
                  <button
                    onClick={() =>
                      setShowRegisterModal(true)
                    }
                    className="group px-8 py-4 bg-gradient-to-r from-blue-600 to-green-600 text-white font-semibold rounded-xl hover:shadow-2xl hover:shadow-blue-500/25 transition-all duration-300 flex items-center gap-3"
                  >
                    {heroData.cta.primary}
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
                  </button>
                  <button
                    onClick={() =>
                      document
                        .getElementById("about")
                        ?.scrollIntoView({
                          behavior: "smooth",
                        })
                    }
                    className="px-8 py-4 bg-white text-gray-700 font-semibold rounded-xl border border-gray-200 hover:border-blue-300 hover:shadow-lg transition-all duration-300"
                  >
                    {heroData.cta.secondary}
                  </button>
                </motion.div>
              </div>

              {/* Right Column - Stats */}
              <div className="grid grid-cols-2 gap-6">
                {heroData.stats.map(
                  (stat, index) => (
                    <motion.div
                      key={stat.label}
                      initial={{
                        opacity: 0,
                        y: 30,
                      }}
                      animate={{
                        opacity: 1,
                        y: 0,
                      }}
                      transition={{
                        delay: 0.5 + index * 0.1,
                      }}
                      className="bg-white/50 backdrop-blur-sm rounded-2xl border border-gray-200/50 p-6 hover:shadow-xl hover:border-blue-200/50 transition-all duration-300"
                    >
                      <div className="inline-flex p-3 bg-gradient-to-br from-blue-100 to-green-100 rounded-xl mb-4">
                        <div className="text-blue-600">
                          {stat.icon}
                        </div>
                      </div>
                      <div className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent mb-2">
                        {stat.value}
                      </div>
                      <div className="text-gray-700 font-medium">
                        {stat.label}
                      </div>
                    </motion.div>
                  )
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section
        id="about"
        className="py-20 bg-white"
      >
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-50 to-green-50 rounded-full mb-6"
            >
              <Info className="w-4 h-4 text-blue-600" />
              <span className="text-sm font-semibold text-blue-700">
                Waa'ee Keenya
              </span>
            </motion.div>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6"
            >
              Maaliif Nuti?
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="text-lg text-gray-600"
            >
              Woggaa saddeen darbaan dhaloota kana
              keessatti baroota 2014 hanga ammatti
              kaayyoo addaa waliin oolchaa ture.
              Dhaloota ijjeessuu waan jirtan
              dhiifama gaafanna.
            </motion.p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            {coreValues.map((value, index) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{
                  delay: index * 0.1,
                }}
                className="group relative"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-white to-gray-50 rounded-3xl border border-gray-200/50 group-hover:border-blue-200/50 transition-all duration-500" />
                <div className="relative p-8">
                  <div
                    className={`inline-flex p-4 bg-gradient-to-br ${value.color} rounded-2xl mb-6 group-hover:scale-110 transition-transform duration-300`}
                  >
                    <div className="text-white">
                      {value.icon}
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4">
                    {value.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed mb-4">
                    {value.description}
                  </p>
                  <ul className="space-y-2">
                    {value.benefits.map(
                      (benefit, i) => (
                        <li
                          key={i}
                          className="flex items-center gap-2 text-sm text-gray-500"
                        >
                          <Check className="w-4 h-4 text-green-500" />
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
        className="py-20 bg-gradient-to-b from-gray-50 to-white"
      >
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-50 to-blue-50 rounded-full mb-6"
            >
              <BookOpen className="w-4 h-4 text-green-600" />
              <span className="text-sm font-semibold text-green-700">
                Leenjii fi Gorsa
              </span>
            </motion.div>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6"
            >
              Leenjii Addaa fi Gorsa
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-lg text-gray-600"
            >
              Baroota 10 ol oolchaa ture. Dhaloota
              kana keessatti leenjii addaa fi
              gorsaa kennuu keenya irra
              deddeebi'anii socho'aa jirra.
            </motion.p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            {programs.map((program, index) => (
              <motion.div
                key={program.title}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                whileHover={{ y: -10 }}
                viewport={{ once: true }}
                transition={{
                  delay: index * 0.1,
                }}
                onMouseEnter={() =>
                  setHoveredProgram(index)
                }
                onMouseLeave={() =>
                  setHoveredProgram(null)
                }
                className="relative group"
              >
                <div className="absolute inset-0 bg-white rounded-3xl border border-gray-200/50 shadow-lg group-hover:shadow-2xl group-hover:border-blue-300/50 transition-all duration-500" />
                <div className="relative p-8 h-full flex flex-col">
                  <div
                    className={`inline-flex p-4 ${program.color} rounded-2xl mb-6 group-hover:scale-110 transition-transform duration-300 self-start`}
                  >
                    {program.icon}
                  </div>
                  <div className="mb-4">
                    <div className="text-sm font-semibold text-gray-500 mb-2">
                      {program.duration}
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-4">
                      {program.title}
                    </h3>
                    <p className="text-gray-600 leading-relaxed mb-6">
                      {program.description}
                    </p>
                  </div>

                  <div className="mt-auto">
                    <div className="text-lg font-bold text-gray-900 mb-4">
                      {program.stats}
                    </div>
                    <div className="space-y-2">
                      {program.features.map(
                        (feature, i) => (
                          <div
                            key={i}
                            className="flex items-center gap-2 text-sm text-gray-500"
                          >
                            <CheckCircle className="w-4 h-4 text-green-500" />
                            {feature}
                          </div>
                        )
                      )}
                    </div>
                  </div>

                  {hoveredProgram === index && (
                    <motion.div
                      initial={{
                        opacity: 0,
                        scale: 0.8,
                      }}
                      animate={{
                        opacity: 1,
                        scale: 1,
                      }}
                      className="absolute bottom-6 right-6"
                    >
                      <ChevronRight className="w-6 h-6 text-blue-500" />
                    </motion.div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Success Stories */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-amber-50 to-orange-50 rounded-full mb-6"
            >
              <Trophy className="w-4 h-4 text-amber-600" />
              <span className="text-sm font-semibold text-amber-700">
                Milkaa'inaa
              </span>
            </motion.div>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6"
            >
              Ijoo Dhalootaa
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-lg text-gray-600"
            >
              Dhaloota keenya irra deebi'anii maal
              hojjachaa jiran? Akkaataa leenjii
              keenyaan jireenya isaanii
              jijjiirran.
            </motion.p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
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
                  className="group"
                >
                  <div className="bg-gradient-to-br from-white to-gray-50 rounded-3xl border border-gray-200/50 p-8 hover:shadow-xl hover:border-blue-200/50 transition-all duration-500 h-full">
                    <div className="flex items-center justify-between mb-6">
                      <div className="p-3 bg-gradient-to-br from-blue-100 to-green-100 rounded-xl">
                        {story.icon}
                      </div>
                      <span className="text-sm font-semibold text-gray-500">
                        {story.year}
                      </span>
                    </div>
                    <div className="mb-6">
                      <div className="text-lg font-bold text-gray-900 mb-1">
                        {story.name}
                      </div>
                      <div className="text-sm text-gray-600 mb-4">
                        {story.role}
                      </div>
                      <p className="text-gray-700 italic">
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

      {/* Upcoming Events */}
      <section
        id="events"
        className="py-20 bg-gradient-to-b from-gray-50 to-white"
      >
        <div className="container mx-auto px-4 lg:px-8">
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
              Oolcha Dhihoo
            </motion.h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 mb-12">
            {upcomingEvents.map(
              (event, index) => (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, y: 40 }}
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
                  <div className="bg-white rounded-3xl border border-gray-200/50 p-6 hover:shadow-xl hover:border-blue-200/50 transition-all duration-500 h-full">
                    <div className="flex items-center justify-between mb-4">
                      <span className="px-3 py-1 bg-gradient-to-r from-blue-50 to-green-50 rounded-full text-sm font-semibold text-blue-700">
                        {event.category}
                      </span>
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-semibold ${
                          event.price === "Free"
                            ? "bg-green-50 text-green-700"
                            : "bg-amber-50 text-amber-700"
                        }`}
                      >
                        {event.price}
                      </span>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-4">
                      {event.title}
                    </h3>
                    <p className="text-gray-600 mb-6">
                      {event.description}
                    </p>

                    <div className="space-y-3 mb-6">
                      <div className="flex items-center gap-2 text-gray-500">
                        <Calendar className="w-4 h-4" />
                        <span className="text-sm">
                          {event.date}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-500">
                        <Clock className="w-4 h-4" />
                        <span className="text-sm">
                          {event.time}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-500">
                        <MapPin className="w-4 h-4" />
                        <span className="text-sm">
                          {event.location}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="text-sm text-gray-600">
                        {event.seats} seats
                      </div>
                      <button
                        onClick={() =>
                          setShowRegisterModal(
                            true
                          )
                        }
                        className="px-4 py-2 bg-gradient-to-r from-blue-600 to-green-600 text-white text-sm font-semibold rounded-lg hover:shadow-lg transition-all"
                      >
                        Register
                      </button>
                    </div>
                  </div>
                </motion.div>
              )
            )}
          </div>

          <div className="text-center">
            <button className="inline-flex items-center gap-2 px-8 py-4 bg-white text-gray-700 font-semibold rounded-xl border border-gray-200 hover:border-blue-300 hover:shadow-lg transition-all duration-300">
              <Calendar className="w-5 h-5" />
              Oolcha Hundaa Ilaaluuf
            </button>
          </div>
        </div>
      </section>

      {/* Partners */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center mb-12">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6"
            >
              Hiriyaa fi Waliigaltee
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-gray-600 max-w-2xl mx-auto"
            >
              Waliin hojjachuun dhalootaf
              gargaaruuf hiriyaa fi waliigaltee
              hedduu waliin hojjachaa jirra.
            </motion.p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
            {partners.map((partner, index) => (
              <motion.div
                key={partner.name}
                initial={{
                  opacity: 0,
                  scale: 0.8,
                }}
                whileInView={{
                  opacity: 1,
                  scale: 1,
                }}
                viewport={{ once: true }}
                transition={{
                  delay: index * 0.1,
                }}
                className="group"
              >
                <div className="bg-gradient-to-br from-gray-50 to-white rounded-2xl border border-gray-200/50 p-6 hover:shadow-lg hover:border-blue-200/50 transition-all duration-300">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-green-500 rounded-xl flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">
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

      {/* Testimonials */}
      <section
        id="testimonials"
        className="py-20 bg-gradient-to-b from-white to-gray-50"
      >
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-rose-50 to-pink-50 rounded-full mb-6"
            >
              <Quote className="w-4 h-4 text-rose-600" />
              <span className="text-sm font-semibold text-rose-700">
                Ijoo fi Madaala
              </span>
            </motion.div>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6"
            >
              Namootni Maal Jettu
            </motion.h2>
          </div>

          <div className="relative max-w-4xl mx-auto">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTestimonial}
                initial={{ opacity: 0, x: 100 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -100 }}
                className="bg-gradient-to-br from-white to-gray-50 rounded-3xl border border-gray-200/50 p-8 lg:p-12 shadow-xl"
              >
                <div className="flex flex-col lg:flex-row items-center gap-8">
                  <div className="lg:w-1/4">
                    <div className="relative">
                      <div className="w-32 h-32 bg-gradient-to-br from-blue-500 to-green-500 rounded-full flex items-center justify-center text-white text-3xl font-bold shadow-lg">
                        {
                          testimonials[
                            activeTestimonial
                          ].avatar
                        }
                      </div>
                      <div className="absolute -bottom-2 -right-2 w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold shadow-lg">
                        <Quote className="w-6 h-6" />
                      </div>
                    </div>
                  </div>
                  <div className="lg:w-3/4">
                    <div className="flex items-center gap-1 mb-6">
                      {[...Array(5)].map(
                        (_, i) => (
                          <Star
                            key={i}
                            className="w-5 h-5 text-amber-500 fill-amber-500"
                          />
                        )
                      )}
                    </div>
                    <p className="text-lg lg:text-xl text-gray-700 italic mb-8 leading-relaxed">
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

            <div className="flex justify-center items-center gap-3 mt-8">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() =>
                    setActiveTestimonial(index)
                  }
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    index === activeTestimonial
                      ? "bg-gradient-to-r from-blue-600 to-green-600 w-8"
                      : "bg-gray-300 hover:bg-gray-400"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-50 to-blue-50 rounded-full mb-6"
              >
                <HelpCircle className="w-4 h-4 text-indigo-600" />
                <span className="text-sm font-semibold text-indigo-700">
                  Gaaffii fi Deebii
                </span>
              </motion.div>
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6"
              >
                Gaaffiiwwan Dhihoo
              </motion.h2>
            </div>

            <div className="space-y-4">
              {faqs.map((faq, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{
                    opacity: 1,
                    y: 0,
                  }}
                  viewport={{ once: true }}
                  transition={{
                    delay: index * 0.1,
                  }}
                  className="border border-gray-200/50 rounded-2xl overflow-hidden"
                >
                  <button
                    onClick={() =>
                      setActiveFaq(
                        activeFaq === index
                          ? null
                          : index
                      )
                    }
                    className="w-full px-6 py-4 flex items-center justify-between bg-white hover:bg-gray-50 transition-colors"
                  >
                    <span className="text-lg font-semibold text-gray-900 text-left">
                      {faq.question}
                    </span>
                    <ChevronRight
                      className={`w-5 h-5 text-gray-500 transition-transform ${
                        activeFaq === index
                          ? "rotate-90"
                          : ""
                      }`}
                    />
                  </button>
                  <AnimatePresence>
                    {activeFaq === index && (
                      <motion.div
                        initial={{
                          height: 0,
                          opacity: 0,
                        }}
                        animate={{
                          height: "auto",
                          opacity: 1,
                        }}
                        exit={{
                          height: 0,
                          opacity: 0,
                        }}
                        className="overflow-hidden"
                      >
                        <div className="px-6 py-4 bg-gray-50/50 border-t border-gray-200/50">
                          <p className="text-gray-700">
                            {faq.answer}
                          </p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-20 bg-gradient-to-br from-blue-600 via-green-600 to-purple-600">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-4xl mx-auto text-center text-white">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full mb-8"
            >
              <Mail className="w-4 h-4" />
              <span className="text-sm font-semibold">
                Oduu fi Oolcha
              </span>
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-4xl lg:text-5xl font-bold mb-6"
            >
              Oduu fi Oolcha Argadhu
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-xl text-blue-100 mb-12 max-w-2xl mx-auto"
            >
              Oduu dhihoo, oolcha fi leenjii addaa
              email keessanitti argadhaa.
            </motion.p>

            <motion.form
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              onSubmit={handleNewsletter}
              className="flex flex-col sm:flex-row gap-4 justify-center max-w-2xl mx-auto"
            >
              <input
                type="email"
                value={email}
                onChange={(e) =>
                  setEmail(e.target.value)
                }
                placeholder="Email keessan galchaa..."
                className="flex-1 px-6 py-4 bg-white/20 backdrop-blur-sm border-2 border-white/30 rounded-xl text-white placeholder-white/70 focus:outline-none focus:border-white/50"
                required
              />
              <button
                type="submit"
                className="px-8 py-4 bg-white text-blue-600 font-semibold rounded-xl hover:bg-gray-50 hover:shadow-2xl transition-all duration-300 whitespace-nowrap"
              >
                Galchaa
              </button>
            </motion.form>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 bg-gradient-to-b from-white to-gray-50">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{
                opacity: 1,
                scale: 1,
              }}
              viewport={{ once: true }}
              className="inline-flex p-4 bg-gradient-to-br from-blue-100 to-green-100 rounded-2xl mb-8"
            >
              <Rocket className="w-12 h-12 text-blue-600" />
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6"
            >
              Har'a Eegaluu!
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto"
            >
              Dhaloota kana keessatti hiriyaa
              ta'i. Leenjii argadhaa, hiriyyaa
              argadhaa, jireenya keessan
              jijjiradhaa.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <button
                onClick={() =>
                  setShowRegisterModal(true)
                }
                className="group px-8 py-4 bg-gradient-to-r from-blue-600 to-green-600 text-white font-semibold rounded-xl hover:shadow-2xl hover:shadow-blue-500/25 transition-all duration-300 flex items-center justify-center gap-3"
              >
                Har'a Galmaa'i
                <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
              </button>
              <button
                onClick={() =>
                  setShowLoginModal(true)
                }
                className="px-8 py-4 bg-white text-gray-700 font-semibold rounded-xl border border-gray-200 hover:border-blue-300 hover:shadow-lg transition-all duration-300"
              >
                Seeni
              </button>
            </motion.div>
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

      {/* Login Modal */}
      <AnimatePresence>
        {showLoginModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white rounded-2xl shadow-2xl max-w-md w-full"
            >
              <div className="p-8">
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900">
                      Seeni
                    </h3>
                    <p className="text-gray-600">
                      Account keessan seenaa
                    </p>
                  </div>
                  <button
                    onClick={() =>
                      setShowLoginModal(false)
                    }
                    className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-xl transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <form
                  onSubmit={handleLogin}
                  className="space-y-6"
                >
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) =>
                        setEmail(e.target.value)
                      }
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                      placeholder="email@example.com"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Password
                    </label>
                    <div className="relative">
                      <input
                        type={
                          showPassword
                            ? "text"
                            : "password"
                        }
                        value={password}
                        onChange={(e) =>
                          setPassword(
                            e.target.value
                          )
                        }
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all pr-12"
                        placeholder="••••••••"
                        required
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setShowPassword(
                            !showPassword
                          )
                        }
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                      >
                        {showPassword ? (
                          <EyeOff className="w-5 h-5" />
                        ) : (
                          <Eye className="w-5 h-5" />
                        )}
                      </button>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3.5 bg-gradient-to-r from-blue-600 to-green-600 text-white font-semibold rounded-xl hover:shadow-lg transition-all"
                  >
                    Seeni
                  </button>

                  <div className="text-center">
                    <button
                      type="button"
                      onClick={() => {
                        setShowLoginModal(false);
                        setShowRegisterModal(
                          true
                        );
                      }}
                      className="text-blue-600 hover:text-blue-700 font-medium"
                    >
                      Account hin qabduu? Galmaa'i
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Register Modal */}
      <AnimatePresence>
        {showRegisterModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white rounded-2xl shadow-2xl max-w-md w-full"
            >
              <div className="p-8">
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900">
                      Galmaa'i
                    </h3>
                    <p className="text-gray-600">
                      Account haaraa uumaa
                    </p>
                  </div>
                  <button
                    onClick={() =>
                      setShowRegisterModal(false)
                    }
                    className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-xl transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <form
                  onSubmit={handleRegister}
                  className="space-y-6"
                >
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Maqaa
                      </label>
                      <input
                        type="text"
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                        placeholder="Maqaa"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Maqaa Abbaa
                      </label>
                      <input
                        type="text"
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                        placeholder="Maqaa Abbaa"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) =>
                        setEmail(e.target.value)
                      }
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                      placeholder="email@example.com"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Password
                    </label>
                    <div className="relative">
                      <input
                        type={
                          showPassword
                            ? "text"
                            : "password"
                        }
                        value={password}
                        onChange={(e) =>
                          setPassword(
                            e.target.value
                          )
                        }
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all pr-12"
                        placeholder="••••••••"
                        required
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setShowPassword(
                            !showPassword
                          )
                        }
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                      >
                        {showPassword ? (
                          <EyeOff className="w-5 h-5" />
                        ) : (
                          <Eye className="w-5 h-5" />
                        )}
                      </button>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3.5 bg-gradient-to-r from-blue-600 to-green-600 text-white font-semibold rounded-xl hover:shadow-lg transition-all"
                  >
                    Galmaa'i
                  </button>

                  <div className="text-center">
                    <button
                      type="button"
                      onClick={() => {
                        setShowRegisterModal(
                          false
                        );
                        setShowLoginModal(true);
                      }}
                      className="text-blue-600 hover:text-blue-700 font-medium"
                    >
                      Account qabduu? Seeni
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

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
