"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import {
  BookOpen,
  Users,
  Award,
  Clock,
  Star,
  ChevronRight,
  Sparkles,
  Target,
  TrendingUp,
  BarChart3,
  Code,
  Palette,
  Globe,
  Zap,
  Shield,
  Heart,
  MessageSquare,
  Calendar,
  MapPin,
  CheckCircle,
  PlayCircle,
  Download,
  Share2,
  Bookmark,
  ArrowRight,
  GraduationCap,
  Briefcase,
  Brain,
  Rocket,
  Coffee,
  Video,
  Headphones,
  FileText,
  Calculator,
  Target as TargetIcon,
  Users as UsersIcon,
  Clock as ClockIcon,
  DollarSign,
  Trophy,
  Heart as HeartIcon,
  Shield as ShieldIcon,
  Zap as ZapIcon,
  Leaf,
  Cloud,
  Database,
  Cpu,
  Smartphone,
  Wifi,
  Server,
  Lock,
  Unlock,
  Eye,
  EyeOff,
  Fingerprint,
  Key,
  QrCode,
  Bell,
  BellOff,
  Mail,
  Phone,
  Map,
  Navigation,
  Compass,
  Home,
  Building,
  Factory,
  Store,
  ShoppingCart,
  Package,
  Truck,
  Plane,
  Ship,
  Bike,
  Car,
  Train,
  Bus,
  Camera,
  Mic,
  Music,
  Film,
  Gamepad2,
  Paintbrush,
  PenTool,
  Scissors,
  Ruler,
  Hammer,
  Wrench,
  Cog,
  Settings,
  Filter,
  Search,
  Menu,
  X,
  Plus,
  Minus,
  Maximize2,
  Minimize2,
  RotateCcw,
  RefreshCw,
  Power,
  Battery,
  BatteryCharging,
  Cpu as CpuIcon,
  HardDrive,
  MemoryStick,
  Monitor,
  Printer,
  Keyboard,
  Mouse,
  Headphones as HeadphonesIcon,
  Speaker,
  Tv,
  Smartphone as SmartphoneIcon,
  Tablet,
  Laptop,
  Watch,
  Cloud as CloudIcon,
  Database as DatabaseIcon,
  Server as ServerIcon,
  Wifi as WifiIcon,
  Bluetooth,
  Radio,
  Satellite,
  WifiOff,
  Bluetooth as BluetoothIcon,
  Radio as RadioIcon,
  Satellite as SatelliteIcon,
} from "lucide-react";
import { useState } from "react";
import Header from "@/components/home/Header";
import Footer from "@/components/home/Footer";
import { useAuthStore } from "@/lib/store/auth.store";
import { useRouter } from "next/navigation";

// Training categories with icons and colors
const trainingCategories = [
  {
    id: "technology",
    name: "Technology",
    icon: <Code className="w-6 h-6" />,
    color: "from-blue-500 to-cyan-500",
    bgColor: "bg-blue-50",
    count: 12,
    description: "Modern tech stack and development"
  },
  {
    id: "business",
    name: "Business",
    icon: <Briefcase className="w-6 h-6" />,
    color: "from-purple-500 to-pink-500",
    bgColor: "bg-purple-50",
    count: 8,
    description: "Entrepreneurship and management"
  },
  {
    id: "design",
    name: "Design",
    icon: <Palette className="w-6 h-6" />,
    color: "from-pink-500 to-rose-500",
    bgColor: "bg-pink-50",
    count: 6,
    description: "UI/UX and creative design"
  },
  {
    id: "marketing",
    name: "Marketing",
    icon: <TrendingUp className="w-6 h-6" />,
    color: "from-green-500 to-emerald-500",
    bgColor: "bg-green-50",
    count: 10,
    description: "Digital marketing strategies"
  },
  {
    id: "finance",
    name: "Finance",
    icon: <DollarSign className="w-6 h-6" />,
    color: "from-amber-500 to-orange-500",
    bgColor: "bg-amber-50",
    count: 7,
    description: "Financial planning and analysis"
  },
  {
    id: "leadership",
    name: "Leadership",
    icon: <UsersIcon className="w-6 h-6" />,
    color: "from-indigo-500 to-blue-500",
    bgColor: "bg-indigo-50",
    count: 5,
    description: "Team management skills"
  }
];

// Featured training programs
const featuredTrainings = [
  {
    id: 1,
    title: "Full-Stack Web Development Bootcamp",
    description: "Master modern web development with React, Next.js, Node.js, and databases",
    category: "Technology",
    level: "Intermediate",
    duration: "12 weeks",
    rating: 4.8,
    students: 2450,
    price: "$299",
    originalPrice: "$499",
    instructor: "Alex Johnson",
    instructorRole: "Senior Developer",
    image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c",
    featured: true,
    badges: ["Hot", "New"],
    skills: ["React", "Next.js", "Node.js", "MongoDB", "TypeScript"]
  },
  {
    id: 2,
    title: "Digital Marketing Mastery",
    description: "Complete guide to digital marketing, SEO, social media, and analytics",
    category: "Marketing",
    level: "Beginner",
    duration: "8 weeks",
    rating: 4.7,
    students: 1800,
    price: "$199",
    originalPrice: "$349",
    instructor: "Sarah Williams",
    instructorRole: "Marketing Director",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f",
    featured: true,
    badges: ["Popular"],
    skills: ["SEO", "Social Media", "Google Ads", "Analytics"]
  },
  {
    id: 3,
    title: "UI/UX Design Fundamentals",
    description: "Learn user-centered design principles and create stunning interfaces",
    category: "Design",
    level: "Beginner",
    duration: "6 weeks",
    rating: 4.9,
    students: 3200,
    price: "$249",
    originalPrice: "$399",
    instructor: "Michael Chen",
    instructorRole: "Lead Designer",
    image: "https://images.unsplash.com/photo-1551650975-87deedd944c3",
    featured: true,
    badges: ["Best Seller"],
    skills: ["Figma", "User Research", "Prototyping", "Wireframing"]
  },
  {
    id: 4,
    title: "Data Science & Machine Learning",
    description: "Comprehensive data analysis, visualization, and machine learning techniques",
    category: "Technology",
    level: "Advanced",
    duration: "16 weeks",
    rating: 4.6,
    students: 1500,
    price: "$399",
    originalPrice: "$599",
    instructor: "Dr. David Kim",
    instructorRole: "Data Scientist",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71",
    featured: true,
    badges: ["Advanced"],
    skills: ["Python", "TensorFlow", "Pandas", "Data Visualization"]
  }
];

// Upcoming workshops
const upcomingWorkshops = [
  {
    id: 1,
    title: "AI for Business Workshop",
    date: "2024-03-15",
    time: "10:00 AM - 2:00 PM",
    type: "Live Workshop",
    price: "Free",
    seats: 50,
    registered: 42,
    instructor: "Dr. Emma Wilson",
    topic: "Artificial Intelligence"
  },
  {
    id: 2,
    title: "Web3 & Blockchain Fundamentals",
    date: "2024-03-20",
    time: "2:00 PM - 5:00 PM",
    type: "Virtual Session",
    price: "$49",
    seats: 100,
    registered: 78,
    instructor: "Robert Martinez",
    topic: "Blockchain"
  },
  {
    id: 3,
    title: "Personal Finance Planning",
    date: "2024-03-25",
    time: "6:00 PM - 8:00 PM",
    type: "Interactive Webinar",
    price: "Free",
    seats: 200,
    registered: 165,
    instructor: "Lisa Thompson",
    topic: "Finance"
  }
];

// Testimonials
const testimonials = [
  {
    id: 1,
    name: "John Anderson",
    role: "Software Engineer",
    company: "TechCorp",
    content: "The Full-Stack Development course transformed my career. I landed a job at a top tech company within 2 months of completing the program!",
    rating: 5,
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d"
  },
  {
    id: 2,
    name: "Maria Garcia",
    role: "Marketing Manager",
    company: "GrowthLab",
    content: "The Digital Marketing Mastery course provided practical strategies that I immediately implemented at work. Our campaign performance improved by 300%!",
    rating: 5,
    image: "https://images.unsplash.com/photo-1494790108755-2616b612b786"
  },
  {
    id: 3,
    name: "David Park",
    role: "UX Designer",
    company: "DesignStudio",
    content: "As a beginner in design, the UI/UX Fundamentals course gave me the confidence and skills to start my career. The projects were incredibly helpful.",
    rating: 4,
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e"
  }
];

export default function TrainingPage() {
  const router = useRouter();
  const { user, isAuthenticated, logout } = useAuthStore();
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("popular");
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);
  const [selectedTraining, setSelectedTraining] = useState<number | null>(null);

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
    router.push("/");
  };

  // Handle dashboard navigation
  const handleDashboard = () => {
    if (isAuthenticated && user) {
      if (user.role === "admin" || user.role === "superadmin") {
        router.push("/admin/dashboard");
      } else {
        router.push("/dashboard");
      }
    }
  };

  // Filter trainings based on category and search
  const filteredTrainings = featuredTrainings.filter(training => {
    if (activeCategory !== "all" && training.category !== activeCategory) return false;
    if (searchQuery && !training.title.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  // Sort trainings
  const sortedTrainings = [...filteredTrainings].sort((a, b) => {
    switch (sortBy) {
      case "popular":
        return b.students - a.students;
      case "rating":
        return b.rating - a.rating;
      case "price-low":
        return parseFloat(a.price.replace('$', '')) - parseFloat(b.price.replace('$', ''));
      case "price-high":
        return parseFloat(b.price.replace('$', '')) - parseFloat(a.price.replace('$', ''));
      default:
        return 0;
    }
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 via-white to-blue-50/30">
      {/* Header Component */}
      <Header
        onLoginClick={handleLoginRedirect}
        onRegisterClick={handleRegisterRedirect}
        onDashboardClick={handleDashboard}
        onLogoutClick={handleLogout}
      />

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50/40 via-white to-purple-50/30" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-200/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-200/10 rounded-full blur-3xl" />
        
        <div className="container relative mx-auto px-4 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-blue-500/10 to-purple-500/10 backdrop-blur-sm rounded-2xl border border-blue-100 mb-8"
            >
              <div className="flex items-center gap-2">
                <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg">
                  <GraduationCap className="w-5 h-5 text-white" />
                </div>
                <span className="text-sm font-semibold text-blue-700">
                  Professional Training Programs
                </span>
              </div>
              <Sparkles className="w-5 h-5 text-yellow-500" />
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-5xl lg:text-7xl font-bold text-gray-900 mb-6 leading-tight"
            >
              Unlock Your{" "}
              <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                Potential
              </span>
              <br />
              <span className="text-4xl lg:text-6xl">Transform Your{" "}
              <span className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                Career
              </span></span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-xl lg:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed"
            >
              Master in-demand skills with industry-expert instructors. 
              Join thousands of professionals who have accelerated their careers with our training programs.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4"
            >
              <Link
                href="#featured"
                className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-2xl hover:shadow-2xl hover:scale-105 transition-all duration-300 shadow-lg flex items-center gap-3"
              >
                <BookOpen className="w-5 h-5" />
                Explore Courses
                <ArrowRight className="w-5 h-5" />
              </Link>
              <button className="px-8 py-4 bg-white text-gray-700 font-semibold rounded-2xl border border-gray-200 hover:shadow-xl hover:border-blue-200 transition-all duration-300 flex items-center gap-3">
                <PlayCircle className="w-5 h-5" />
                Watch Demo
              </button>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-12"
            >
              {[
                { value: "10K+", label: "Students Trained", icon: <Users className="w-5 h-5" /> },
                { value: "50+", label: "Expert Instructors", icon: <Award className="w-5 h-5" /> },
                { value: "98%", label: "Satisfaction Rate", icon: <Heart className="w-5 h-5" /> },
                { value: "500+", label: "Hours of Content", icon: <Clock className="w-5 h-5" /> },
              ].map((stat, idx) => (
                <div key={idx} className="text-center">
                  <div className="text-3xl font-bold text-gray-900 mb-2">{stat.value}</div>
                  <div className="text-gray-600 text-sm">{stat.label}</div>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              <span className="bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                Browse by Category
              </span>
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Discover training programs tailored to your career goals and interests
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {trainingCategories.map((category) => (
              <motion.button
                key={category.id}
                whileHover={{ scale: 1.05, y: -5 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setActiveCategory(category.id)}
                className={`p-4 rounded-2xl border transition-all duration-300 ${
                  activeCategory === category.id
                    ? `border-transparent bg-gradient-to-br ${category.color} text-white shadow-xl`
                    : `${category.bgColor} border-gray-200 hover:shadow-lg`
                }`}
              >
                <div className={`p-3 rounded-xl mb-3 ${activeCategory === category.id ? 'bg-white/20' : 'bg-white'}`}>
                  <div className={activeCategory === category.id ? 'text-white' : `text-gradient ${category.color}`}>
                    {category.icon}
                  </div>
                </div>
                <div className="text-sm font-semibold">{category.name}</div>
                <div className="text-xs text-gray-500 mt-1">{category.count} courses</div>
              </motion.button>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Trainings */}
      <section id="featured" className="py-16 bg-gradient-to-b from-white to-gray-50">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between mb-12">
            <div>
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                <span className="bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                  Featured Training Programs
                </span>
              </h2>
              <p className="text-gray-600">Handpicked courses for maximum career impact</p>
            </div>
            <div className="flex items-center gap-4 mt-4 lg:mt-0">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search courses..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="popular">Most Popular</option>
                <option value="rating">Highest Rated</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
              </select>
            </div>
          </div>

          {sortedTrainings.length === 0 ? (
            <div className="text-center py-12">
              <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-2xl font-semibold text-gray-700 mb-2">No courses found</h3>
              <p className="text-gray-500">Try adjusting your search or filter criteria</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {sortedTrainings.map((training) => (
                <motion.div
                  key={training.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  whileHover={{ y: -8 }}
                  onMouseEnter={() => setHoveredCard(training.id)}
                  onMouseLeave={() => setHoveredCard(null)}
                  className="group relative bg-white rounded-3xl border border-gray-200 overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500"
                >
                  {/* Badges */}
                  <div className="absolute top-4 left-4 z-10 flex gap-2">
                    {training.badges.map((badge, idx) => (
                      <span
                        key={idx}
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          badge === "Hot"
                            ? "bg-red-500 text-white"
                            : badge === "New"
                            ? "bg-blue-500 text-white"
                            : badge === "Popular"
                            ? "bg-green-500 text-white"
                            : badge === "Best Seller"
                            ? "bg-amber-500 text-white"
                            : "bg-purple-500 text-white"
                        }`}
                      >
                        {badge}
                      </span>
                    ))}
                  </div>

                  {/* Image */}
                  <div className="relative h-48 overflow-hidden">
                    <Image
                      src={training.image}
                      alt={training.title}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-3">
                      <span className="px-3 py-1 bg-blue-50 text-blue-600 text-xs font-semibold rounded-full">
                        {training.category}
                      </span>
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                        <span className="text-sm font-semibold text-gray-900">{training.rating}</span>
                      </div>
                    </div>

                    <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-blue-600 transition-colors">
                      {training.title}
                    </h3>

                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                      {training.description}
                    </p>

                    {/* Skills */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      {training.skills.map((skill, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>

                    {/* Instructor */}
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full" />
                      <div>
                        <div className="text-sm font-semibold text-gray-900">{training.instructor}</div>
                        <div className="text-xs text-gray-500">{training.instructorRole}</div>
                      </div>
                    </div>

                    {/* Footer */}
                    <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <div className="text-2xl font-bold text-gray-900">{training.price}</div>
                          {training.originalPrice && (
                            <div className="text-sm text-gray-400 line-through">{training.originalPrice}</div>
                          )}
                        </div>
                        <div className="flex items-center gap-4 text-xs text-gray-500">
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {training.duration}
                          </span>
                          <span className="flex items-center gap-1">
                            <Users className="w-3 h-3" />
                            {training.students.toLocaleString()}
                          </span>
                        </div>
                      </div>

                      <motion.button
                        animate={{ x: hoveredCard === training.id ? 5 : 0 }}
                        className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-sm font-semibold rounded-xl hover:shadow-lg transition-all duration-300"
                      >
                        Enroll Now
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-16 bg-gradient-to-br from-gray-900 to-slate-900 text-white">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">
              <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                Why Choose Our Training?
              </span>
            </h2>
            <p className="text-gray-300 max-w-2xl mx-auto">
              We're committed to providing the best learning experience with measurable results
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: <Target className="w-8 h-8" />,
                title: "Industry-Relevant Curriculum",
                description: "Courses designed with input from industry leaders and updated regularly"
              },
              {
                icon: <Users className="w-8 h-8" />,
                title: "Expert Instructors",
                description: "Learn from professionals with real-world experience and proven track records"
              },
              {
                icon: <Briefcase className="w-8 h-8" />,
                title: "Career Support",
                description: "Resume reviews, interview prep, and job placement assistance"
              },
              {
                icon: <Clock className="w-8 h-8" />,
                title: "Flexible Learning",
                description: "Self-paced courses with lifetime access to materials and updates"
              }
            ].map((feature, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="p-6 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 hover:border-white/20 transition-all duration-300"
              >
                <div className="p-3 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl w-fit mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                <p className="text-gray-300">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Upcoming Workshops */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  Upcoming Workshops
                </span>
              </h2>
              <p className="text-gray-600">Join our live interactive sessions with industry experts</p>
            </div>
            <Link
              href="/workshops"
              className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold rounded-xl hover:shadow-xl hover:scale-105 transition-all duration-300"
            >
              View All
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {upcomingWorkshops.map((workshop) => (
              <motion.div
                key={workshop.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="group bg-gradient-to-br from-white to-gray-50 rounded-2xl border border-gray-200 p-6 hover:shadow-xl hover:border-purple-200 transition-all duration-300"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <Calendar className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <div className="text-sm text-purple-600 font-semibold">{workshop.type}</div>
                    <div className="text-lg font-bold text-gray-900">{workshop.title}</div>
                  </div>
                </div>

                <div className="space-y-3 mb-6">
                  <div className="flex items-center gap-2 text-gray-600">
                    <Calendar className="w-4 h-4" />
                    <span>{new Date(workshop.date).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <Clock className="w-4 h-4" />
                    <span>{workshop.time}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <Users className="w-4 h-4" />
                    <span>{workshop.instructor}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between mb-4">
                  <div className="text-2xl font-bold text-gray-900">{workshop.price}</div>
                  <div className="text-sm text-gray-600">
                    {workshop.registered}/{workshop.seats} seats
                  </div>
                </div>

                <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
                  <div
                    className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${(workshop.registered / workshop.seats) * 100}%` }}
                  />
                </div>

                <button className="w-full py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold rounded-xl hover:shadow-lg transition-all duration-300">
                  Register Now
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              <span className="bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
                Student Success Stories
              </span>
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              See how our training programs have transformed careers and opened new opportunities
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial) => (
              <motion.div
                key={testimonial.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="group bg-white rounded-2xl border border-gray-200 p-6 hover:shadow-xl hover:border-amber-200 transition-all duration-300"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="relative">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-amber-500 to-orange-500" />
                    <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                      <CheckCircle className="w-4 h-4 text-white" />
                    </div>
                  </div>
                  <div>
                    <div className="font-bold text-gray-900">{testimonial.name}</div>
                    <div className="text-sm text-gray-600">{testimonial.role} at {testimonial.company}</div>
                  </div>
                </div>

                <div className="flex items-center gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${i < testimonial.rating ? 'text-amber-500 fill-amber-500' : 'text-gray-300'}`}
                    />
                  ))}
                </div>

                <p className="text-gray-700 italic mb-4">"{testimonial.content}"</p>

                <div className="flex items-center justify-between text-sm text-gray-500">
                  <span>Verified Graduate</span>
                  <span>Course Completed</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true }}
              className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mx-auto mb-6"
            >
              <Rocket className="w-10 h-10 text-white" />
            </motion.div>

            <h2 className="text-3xl lg:text-5xl font-bold text-white mb-6">
              Ready to Transform Your Career?
            </h2>

            <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
              Join thousands of successful professionals who have accelerated their careers with our training programs.
              Start your learning journey today!
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/courses"
                className="px-8 py-4 bg-white text-blue-600 font-bold rounded-2xl hover:bg-gray-100 hover:scale-105 transition-all duration-300 shadow-2xl"
              >
                Browse All Courses
              </Link>
              <Link
                href="/contact"
                className="px-8 py-4 bg-transparent border-2 border-white text-white font-bold rounded-2xl hover:bg-white/10 hover:scale-105 transition-all duration-300"
              >
                Get Free Consultation
              </Link>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-6 mt-8 text-white/80 text-sm">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4" />
                <span>30-Day Money-Back Guarantee</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4" />
                <span>Lifetime Access</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4" />
                <span>Certificate of Completion</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer Component */}
      <Footer />
    </div>
  );
}