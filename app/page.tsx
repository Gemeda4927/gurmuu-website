"use client";

import {
  useState,
  useEffect,
  useCallback,
} from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  format,
  isToday,
  isTomorrow,
  isPast,
  isFuture,
} from "date-fns";
import { toast, Toaster } from "react-hot-toast";
import {
  Calendar,
  MapPin,
  Users,
  Star,
  AlertCircle,
  Eye,
  Search,
  Filter,
  ChevronRight,
  ChevronLeft,
  ArrowLeft,
  Share2,
  Globe,
  Clock,
  Tag,
  Users as UsersIcon,
  Activity,
  Image as ImageIcon,
  Copy,
  Check,
  Home,
  Menu,
  LogOut,
  User,
  Bell,
  Grid,
  List,
  Heart,
  Bookmark,
  Share,
  MoreVertical,
  ChevronDown,
  CalendarDays,
  MapPin as MapPinIcon,
  Ticket,
  Phone,
  Mail,
  Map,
  Navigation,
  UsersRound,
  CalendarCheck,
  MapPinned,
  Clock3,
  Sparkles,
  TrendingUp,
  Award,
  Shield,
  CheckCircle,
  BadgePercent,
  LogIn,
  UserPlus,
  Settings,
  EyeOff,
  BookOpen,
  Hash,
  Building,
  Target,
  Mic,
  Music,
  Coffee,
  Dumbbell,
  Palette,
  Code,
  GraduationCap,
  Briefcase,
  HeartHandshake,
  Leaf,
} from "lucide-react";
import { useEventStore } from "@/lib/store/events.store";
import {
  useAuthStore,
  isAuthenticated,
  getUserRole,
} from "@/lib/store/auth.store";
import { EventData } from "@/lib/types/event";

export default function UserHomePage() {
  const router = useRouter();
  const {
    events,
    loading,
    error,
    fetchEvents,
    clearError,
  } = useEventStore();
  const {
    user,
    isAuthenticated: isUserAuthenticated,
    clearAuthData,
  } = useAuthStore();

  // State
  const [selectedEvent, setSelectedEvent] =
    useState<EventData | null>(null);
  const [viewMode, setViewMode] = useState<
    "list" | "details"
  >("list");
  const [layoutMode, setLayoutMode] = useState<
    "grid" | "list"
  >("grid");
  const [searchTerm, setSearchTerm] =
    useState("");
  const [filterCategory, setFilterCategory] =
    useState("all");
  const [filterDate, setFilterDate] =
    useState("all");
  const [mobileMenuOpen, setMobileMenuOpen] =
    useState(false);
  const [userMenuOpen, setUserMenuOpen] =
    useState(false);
  const [activeTab, setActiveTab] =
    useState("upcoming");
  const [bookmarkedEvents, setBookmarkedEvents] =
    useState<string[]>([]);
  const [likedEvents, setLikedEvents] = useState<
    string[]
  >([]);
  const [copiedLink, setCopiedLink] =
    useState(false);
  const [isClient, setIsClient] = useState(false);

  // Check authentication and fetch events
  useEffect(() => {
    setIsClient(true);

    if (!isUserAuthenticated || !user) {
      toast.error("Please login to view events");
      router.push("/login");
      return;
    }

    fetchEvents();
  }, [
    isUserAuthenticated,
    user,
    fetchEvents,
    router,
  ]);

  // Handle errors
  useEffect(() => {
    if (error) {
      toast.error(error);
      clearError();
    }
  }, [error, clearError]);

  // Load user preferences from localStorage
  useEffect(() => {
    if (isClient && user) {
      const savedBookmarks = localStorage.getItem(
        `bookmarks_${user.id}`
      );
      const savedLikes = localStorage.getItem(
        `likes_${user.id}`
      );

      if (savedBookmarks) {
        setBookmarkedEvents(
          JSON.parse(savedBookmarks)
        );
      }
      if (savedLikes) {
        setLikedEvents(JSON.parse(savedLikes));
      }
    }
  }, [isClient, user]);

  // Save user preferences to localStorage
  const saveBookmarks = useCallback(
    (bookmarks: string[]) => {
      if (user) {
        localStorage.setItem(
          `bookmarks_${user.id}`,
          JSON.stringify(bookmarks)
        );
      }
    },
    [user]
  );

  const saveLikes = useCallback(
    (likes: string[]) => {
      if (user) {
        localStorage.setItem(
          `likes_${user.id}`,
          JSON.stringify(likes)
        );
      }
    },
    [user]
  );

  // Filter events based on active tab
  const filteredEvents = events.filter(
    (event) => {
      // Only show published events to users
      if (event.status !== "published")
        return false;

      // Filter by search term
      const matchesSearch =
        event.title
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        event.description
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        event.location
          .toLowerCase()
          .includes(searchTerm.toLowerCase());

      // Filter by category
      const matchesCategory =
        filterCategory === "all" ||
        event.category === filterCategory;

      // Filter by date
      const eventDate = new Date(event.date);
      const now = new Date();
      let matchesDate = true;

      if (filterDate === "upcoming") {
        matchesDate = eventDate >= now;
      } else if (filterDate === "past") {
        matchesDate = eventDate < now;
      } else if (filterDate === "today") {
        matchesDate = isToday(eventDate);
      } else if (filterDate === "tomorrow") {
        matchesDate = isTomorrow(eventDate);
      }

      // Filter by tab
      let matchesTab = true;
      const today = new Date();

      if (activeTab === "upcoming") {
        matchesTab =
          isFuture(eventDate) ||
          isToday(eventDate);
      } else if (activeTab === "featured") {
        matchesTab = event.isFeatured;
      } else if (activeTab === "bookmarked") {
        matchesTab = bookmarkedEvents.includes(
          event._id
        );
      } else if (activeTab === "nearby") {
        matchesTab = true; // For demo, show all events as nearby
      } else if (activeTab === "today") {
        matchesTab = isToday(eventDate);
      } else if (activeTab === "weekend") {
        const day = eventDate.getDay();
        matchesTab = day === 0 || day === 6; // Saturday or Sunday
      }

      return (
        matchesSearch &&
        matchesCategory &&
        matchesDate &&
        matchesTab
      );
    }
  );

  // Get category icon
  const getCategoryIcon = (category: string) => {
    const icons: Record<string, React.ReactNode> =
      {
        Education: (
          <GraduationCap
            size={16}
            className="text-blue-600"
          />
        ),
        Technology: (
          <Code
            size={16}
            className="text-purple-600"
          />
        ),
        Business: (
          <Briefcase
            size={16}
            className="text-indigo-600"
          />
        ),
        Health: (
          <HeartHandshake
            size={16}
            className="text-pink-600"
          />
        ),
        Arts: (
          <Palette
            size={16}
            className="text-rose-600"
          />
        ),
        Sports: (
          <Dumbbell
            size={16}
            className="text-orange-600"
          />
        ),
        Community: (
          <UsersRound
            size={16}
            className="text-teal-600"
          />
        ),
        Environment: (
          <Leaf
            size={16}
            className="text-emerald-600"
          />
        ),
        Charity: (
          <Award
            size={16}
            className="text-amber-600"
          />
        ),
        Music: (
          <Music
            size={16}
            className="text-red-600"
          />
        ),
        Food: (
          <Coffee
            size={16}
            className="text-yellow-600"
          />
        ),
        Conference: (
          <Mic
            size={16}
            className="text-blue-600"
          />
        ),
      };
    return (
      icons[category] || (
        <Tag
          size={16}
          className="text-gray-600"
        />
      )
    );
  };

  // Get category color
  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      Education:
        "bg-blue-50 text-blue-700 border-blue-200",
      Technology:
        "bg-purple-50 text-purple-700 border-purple-200",
      Business:
        "bg-indigo-50 text-indigo-700 border-indigo-200",
      Health:
        "bg-pink-50 text-pink-700 border-pink-200",
      Arts: "bg-rose-50 text-rose-700 border-rose-200",
      Sports:
        "bg-orange-50 text-orange-700 border-orange-200",
      Community:
        "bg-teal-50 text-teal-700 border-teal-200",
      Environment:
        "bg-emerald-50 text-emerald-700 border-emerald-200",
      Charity:
        "bg-amber-50 text-amber-700 border-amber-200",
      Music:
        "bg-red-50 text-red-700 border-red-200",
      Food: "bg-yellow-50 text-yellow-700 border-yellow-200",
      Conference:
        "bg-blue-50 text-blue-700 border-blue-200",
    };
    return (
      colors[category] ||
      "bg-gray-50 text-gray-700 border-gray-200"
    );
  };

  // Format date display
  const formatDateDisplay = (
    dateString: string
  ) => {
    const date = new Date(dateString);
    const now = new Date();

    if (isToday(date)) {
      return "Today";
    } else if (isTomorrow(date)) {
      return "Tomorrow";
    } else if (
      date.getTime() - now.getTime() <
      7 * 24 * 60 * 60 * 1000
    ) {
      return format(date, "EEEE");
    } else {
      return format(date, "MMM dd, yyyy");
    }
  };

  // Format time display
  const formatTimeDisplay = (
    dateString: string
  ) => {
    return format(new Date(dateString), "h:mm a");
  };

  // Handle bookmark toggle
  const handleBookmarkToggle = (
    eventId: string
  ) => {
    setBookmarkedEvents((prev) => {
      const newBookmarks = prev.includes(eventId)
        ? prev.filter((id) => id !== eventId)
        : [...prev, eventId];
      saveBookmarks(newBookmarks);

      toast.success(
        prev.includes(eventId)
          ? "Removed from bookmarks"
          : "Added to bookmarks"
      );
      return newBookmarks;
    });
  };

  // Handle like toggle
  const handleLikeToggle = (eventId: string) => {
    setLikedEvents((prev) => {
      const newLikes = prev.includes(eventId)
        ? prev.filter((id) => id !== eventId)
        : [...prev, eventId];
      saveLikes(newLikes);

      toast.success(
        prev.includes(eventId)
          ? "Unliked event"
          : "Liked event"
      );
      return newLikes;
    });
  };

  // Handle share
  const handleShare = (event: EventData) => {
    if (navigator.share) {
      navigator.share({
        title: event.title,
        text: event.description.substring(0, 100),
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(
        window.location.href
      );
      setCopiedLink(true);
      toast.success("Link copied to clipboard!");
      setTimeout(
        () => setCopiedLink(false),
        2000
      );
    }
  };

  // Handle logout
  const handleLogout = () => {
    clearAuthData();
    toast.success("Logged out successfully");
    router.push("/login");
  };

  // Get user initials for avatar
  const getUserInitials = () => {
    if (!user?.name) return "U";
    return user.name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  // Categories for filter
  const categories = [
    "all",
    "Education",
    "Technology",
    "Business",
    "Health",
    "Arts",
    "Sports",
    "Community",
    "Environment",
    "Charity",
    "Music",
    "Food",
    "Conference",
  ];

  // Date filters
  const dateFilters = [
    { value: "all", label: "All Dates" },
    { value: "upcoming", label: "Upcoming" },
    { value: "today", label: "Today" },
    { value: "tomorrow", label: "Tomorrow" },
    { value: "weekend", label: "This Weekend" },
    { value: "past", label: "Past Events" },
  ];

  // Tabs
  const tabs = [
    {
      id: "upcoming",
      label: "Upcoming",
      icon: <Calendar size={18} />,
      count: filteredEvents.filter(
        (e) =>
          isFuture(new Date(e.date)) ||
          isToday(new Date(e.date))
      ).length,
    },
    {
      id: "featured",
      label: "Featured",
      icon: <Star size={18} />,
      count: events.filter(
        (e) =>
          e.isFeatured && e.status === "published"
      ).length,
    },
    {
      id: "today",
      label: "Today",
      icon: <CalendarDays size={18} />,
      count: events.filter(
        (e) =>
          isToday(new Date(e.date)) &&
          e.status === "published"
      ).length,
    },
    {
      id: "bookmarked",
      label: "Saved",
      icon: <Bookmark size={18} />,
      count: bookmarkedEvents.length,
    },
    {
      id: "nearby",
      label: "Nearby",
      icon: <MapPin size={18} />,
      count: events.filter(
        (e) => e.status === "published"
      ).length,
    },
  ];

  // If not authenticated, show loading
  if (!isUserAuthenticated || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">
            Checking authentication...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: "#1f2937",
            color: "#f9fafb",
          },
        }}
      />

      {/* Header */}
      <header className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link
              href="/"
              className="flex items-center space-x-3"
            >
              <div className="bg-blue-600 p-2 rounded-lg">
                <Calendar className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">
                EventHub
              </span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() =>
                    setActiveTab(tab.id)
                  }
                  className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
                    activeTab === tab.id
                      ? "bg-blue-50 text-blue-600"
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                  }`}
                >
                  {tab.icon}
                  <span className="font-medium">
                    {tab.label}
                  </span>
                  {tab.count > 0 && (
                    <span
                      className={`px-2 py-0.5 text-xs rounded-full ${
                        activeTab === tab.id
                          ? "bg-blue-100 text-blue-700"
                          : "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {tab.count}
                    </span>
                  )}
                </button>
              ))}
            </nav>

            {/* User Menu */}
            <div className="flex items-center space-x-4">
              <button className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
                <Bell size={20} />
              </button>

              <div className="relative">
                <button
                  onClick={() =>
                    setUserMenuOpen(!userMenuOpen)
                  }
                  className="flex items-center space-x-3 p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-medium">
                    {getUserInitials()}
                  </div>
                  <div className="hidden md:block text-left">
                    <p className="text-sm font-medium text-gray-900">
                      {user.name}
                    </p>
                    <p className="text-xs text-gray-500 capitalize">
                      {user.role}
                    </p>
                  </div>
                  <ChevronDown
                    size={16}
                    className="text-gray-500"
                  />
                </button>

                {userMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
                    <Link
                      href="/profile"
                      className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-50"
                    >
                      <User
                        size={16}
                        className="mr-3"
                      />
                      Profile
                    </Link>
                    <Link
                      href="/settings"
                      className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-50"
                    >
                      <Settings
                        size={16}
                        className="mr-3"
                      />
                      Settings
                    </Link>
                    <div className="border-t border-gray-200 my-1"></div>
                    <button
                      onClick={handleLogout}
                      className="flex items-center w-full px-4 py-2 text-red-600 hover:bg-red-50"
                    >
                      <LogOut
                        size={16}
                        className="mr-3"
                      />
                      Logout
                    </button>
                  </div>
                )}
              </div>

              {/* Mobile Menu Button */}
              <button
                onClick={() =>
                  setMobileMenuOpen(
                    !mobileMenuOpen
                  )
                }
                className="md:hidden p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <Menu size={24} />
              </button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {mobileMenuOpen && (
            <div className="md:hidden py-4 border-t border-gray-200">
              <div className="grid grid-cols-2 gap-2">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => {
                      setActiveTab(tab.id);
                      setMobileMenuOpen(false);
                    }}
                    className={`flex items-center justify-center space-x-2 px-4 py-3 rounded-lg transition-colors ${
                      activeTab === tab.id
                        ? "bg-blue-50 text-blue-600 border border-blue-200"
                        : "text-gray-600 hover:text-gray-900 hover:bg-gray-50 border border-gray-200"
                    }`}
                  >
                    {tab.icon}
                    <span className="font-medium">
                      {tab.label}
                    </span>
                    {tab.count > 0 && (
                      <span
                        className={`px-2 py-0.5 text-xs rounded-full ${
                          activeTab === tab.id
                            ? "bg-blue-100 text-blue-700"
                            : "bg-gray-100 text-gray-700"
                        }`}
                      >
                        {tab.count}
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Search and Filter Bar */}
      <div className="sticky top-16 z-40 bg-white border-b border-gray-200 py-4 shadow-sm">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <Search
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"
                  size={20}
                />
                <input
                  type="text"
                  placeholder="Search events by title, location, or description..."
                  value={searchTerm}
                  onChange={(e) =>
                    setSearchTerm(e.target.value)
                  }
                  className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
              </div>
            </div>

            {/* Filters */}
            <div className="flex gap-3">
              <div className="relative">
                <Filter
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  size={18}
                />
                <select
                  value={filterCategory}
                  onChange={(e) =>
                    setFilterCategory(
                      e.target.value
                    )
                  }
                  className="pl-10 pr-8 py-3 bg-gray-50 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none min-w-[160px]"
                >
                  <option value="all">
                    All Categories
                  </option>
                  {categories
                    .filter((c) => c !== "all")
                    .map((cat) => (
                      <option
                        key={cat}
                        value={cat}
                      >
                        {cat}
                      </option>
                    ))}
                </select>
              </div>

              <div className="relative">
                <Calendar
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  size={18}
                />
                <select
                  value={filterDate}
                  onChange={(e) =>
                    setFilterDate(e.target.value)
                  }
                  className="pl-10 pr-8 py-3 bg-gray-50 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none min-w-[160px]"
                >
                  {dateFilters.map((filter) => (
                    <option
                      key={filter.value}
                      value={filter.value}
                    >
                      {filter.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center bg-gray-100 rounded-xl p-1">
                <button
                  onClick={() =>
                    setLayoutMode("grid")
                  }
                  className={`p-2 rounded-lg transition-all ${
                    layoutMode === "grid"
                      ? "bg-white shadow-sm text-blue-600"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  <Grid size={20} />
                </button>
                <button
                  onClick={() =>
                    setLayoutMode("list")
                  }
                  className={`p-2 rounded-lg transition-all ${
                    layoutMode === "list"
                      ? "bg-white shadow-sm text-blue-600"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  <List size={20} />
                </button>
              </div>
            </div>
          </div>

          {/* Active filters */}
          {(searchTerm ||
            filterCategory !== "all" ||
            filterDate !== "all") && (
            <div className="flex items-center gap-2 mt-4">
              <span className="text-sm text-gray-600">
                Active filters:
              </span>
              {searchTerm && (
                <span className="inline-flex items-center px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-sm">
                  Search: {searchTerm}
                  <button
                    onClick={() =>
                      setSearchTerm("")
                    }
                    className="ml-2 text-blue-500 hover:text-blue-700"
                  >
                    <X size={14} />
                  </button>
                </span>
              )}
              {filterCategory !== "all" && (
                <span className="inline-flex items-center px-3 py-1 rounded-full bg-purple-50 text-purple-700 text-sm">
                  {filterCategory}
                  <button
                    onClick={() =>
                      setFilterCategory("all")
                    }
                    className="ml-2 text-purple-500 hover:text-purple-700"
                  >
                    <X size={14} />
                  </button>
                </span>
              )}
              {filterDate !== "all" && (
                <span className="inline-flex items-center px-3 py-1 rounded-full bg-green-50 text-green-700 text-sm">
                  {
                    dateFilters.find(
                      (f) =>
                        f.value === filterDate
                    )?.label
                  }
                  <button
                    onClick={() =>
                      setFilterDate("all")
                    }
                    className="ml-2 text-green-500 hover:text-green-700"
                  >
                    <X size={14} />
                  </button>
                </span>
              )}
              <button
                onClick={() => {
                  setSearchTerm("");
                  setFilterCategory("all");
                  setFilterDate("all");
                }}
                className="text-sm text-blue-600 hover:text-blue-700 font-medium"
              >
                Clear all
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {loading ? (
          <div className="flex justify-center items-center h-96">
            <div className="text-center">
              <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">
                Loading events...
              </p>
            </div>
          </div>
        ) : viewMode === "details" &&
          selectedEvent ? (
          // Event Details View
          <div className="animate-fadeIn">
            <div className="mb-6">
              <button
                onClick={() =>
                  setViewMode("list")
                }
                className="inline-flex items-center text-gray-600 hover:text-gray-900 hover:bg-gray-100 px-4 py-2 rounded-lg transition-colors"
              >
                <ArrowLeft
                  size={20}
                  className="mr-2"
                />
                Back to Events
              </button>
            </div>

            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
              {/* Hero Image */}
              <div className="relative h-96">
                {selectedEvent.files &&
                selectedEvent.files.length > 0 ? (
                  <Image
                    src={
                      selectedEvent.files[0].url
                    }
                    alt={selectedEvent.title}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                    <Calendar className="h-24 w-24 text-white/30" />
                  </div>
                )}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-8">
                  <div className="flex flex-wrap items-center gap-3 mb-4">
                    <span
                      className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium ${getCategoryColor(selectedEvent.category)}`}
                    >
                      {getCategoryIcon(
                        selectedEvent.category
                      )}
                      {selectedEvent.category}
                    </span>
                    {selectedEvent.isFeatured && (
                      <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 text-white text-sm font-semibold">
                        <Star size={14} />
                        Featured
                      </span>
                    )}
                    {selectedEvent.isUrgent && (
                      <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gradient-to-r from-red-500 to-pink-500 text-white text-sm font-semibold">
                        <AlertCircle size={14} />
                        Urgent
                      </span>
                    )}
                  </div>
                  <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
                    {selectedEvent.title}
                  </h1>
                  <p className="text-white/90 max-w-3xl">
                    {selectedEvent.description.substring(
                      0,
                      200
                    )}
                    ...
                  </p>
                </div>

                {/* Action Buttons */}
                <div className="absolute top-6 right-6 flex items-center gap-3">
                  <button
                    onClick={() =>
                      handleBookmarkToggle(
                        selectedEvent._id
                      )
                    }
                    className={`p-3 rounded-full backdrop-blur-sm ${
                      bookmarkedEvents.includes(
                        selectedEvent._id
                      )
                        ? "bg-red-500/20 text-red-500 hover:bg-red-500/30"
                        : "bg-white/20 text-white hover:bg-white/30"
                    } transition-colors`}
                  >
                    <Bookmark
                      size={20}
                      fill={
                        bookmarkedEvents.includes(
                          selectedEvent._id
                        )
                          ? "currentColor"
                          : "none"
                      }
                    />
                  </button>
                  <button
                    onClick={() =>
                      handleShare(selectedEvent)
                    }
                    className="p-3 rounded-full backdrop-blur-sm bg-white/20 text-white hover:bg-white/30 transition-colors"
                  >
                    <Share size={20} />
                  </button>
                  <button
                    onClick={() =>
                      handleLikeToggle(
                        selectedEvent._id
                      )
                    }
                    className={`p-3 rounded-full backdrop-blur-sm ${
                      likedEvents.includes(
                        selectedEvent._id
                      )
                        ? "bg-pink-500/20 text-pink-500 hover:bg-pink-500/30"
                        : "bg-white/20 text-white hover:bg-white/30"
                    } transition-colors`}
                  >
                    <Heart
                      size={20}
                      fill={
                        likedEvents.includes(
                          selectedEvent._id
                        )
                          ? "currentColor"
                          : "none"
                      }
                    />
                  </button>
                </div>
              </div>

              {/* Event Content */}
              <div className="p-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  {/* Left Column */}
                  <div className="lg:col-span-2 space-y-8">
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900 mb-4">
                        Event Details
                      </h2>
                      <p className="text-gray-700 whitespace-pre-line leading-relaxed">
                        {
                          selectedEvent.description
                        }
                      </p>
                    </div>

                    {selectedEvent.theme && (
                      <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                          Theme
                        </h3>
                        <p className="text-gray-700">
                          {selectedEvent.theme}
                        </p>
                      </div>
                    )}

                    {/* Gallery */}
                    {selectedEvent.files &&
                      selectedEvent.files.length >
                        1 && (
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900 mb-4">
                            Gallery
                          </h3>
                          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                            {selectedEvent.files
                              .slice(1)
                              .map(
                                (file, index) => (
                                  <div
                                    key={index}
                                    className="relative aspect-square rounded-xl overflow-hidden"
                                  >
                                    <Image
                                      src={
                                        file.url
                                      }
                                      alt={`${selectedEvent.title} ${index + 2}`}
                                      fill
                                      className="object-cover hover:scale-105 transition-transform duration-300"
                                    />
                                  </div>
                                )
                              )}
                          </div>
                        </div>
                      )}
                  </div>

                  {/* Right Column - Info Sidebar */}
                  <div className="space-y-6">
                    {/* Quick Info */}
                    <div className="bg-white border border-gray-200 rounded-xl p-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">
                        Event Information
                      </h3>

                      <div className="space-y-4">
                        <div className="flex items-start gap-3">
                          <div className="p-2 bg-blue-100 rounded-lg">
                            <Calendar
                              className="text-blue-600"
                              size={20}
                            />
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">
                              Date & Time
                            </p>
                            <p className="font-medium text-gray-900">
                              {format(
                                new Date(
                                  selectedEvent.date
                                ),
                                "EEEE, MMMM dd, yyyy"
                              )}
                            </p>
                            <p className="text-sm text-gray-500">
                              {format(
                                new Date(
                                  selectedEvent.date
                                ),
                                "h:mm a"
                              )}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-start gap-3">
                          <div className="p-2 bg-red-100 rounded-lg">
                            <MapPin
                              className="text-red-600"
                              size={20}
                            />
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">
                              Location
                            </p>
                            <p className="font-medium text-gray-900">
                              {
                                selectedEvent.location
                              }
                            </p>
                          </div>
                        </div>

                        <div className="flex items-start gap-3">
                          <div className="p-2 bg-green-100 rounded-lg">
                            <Users
                              className="text-green-600"
                              size={20}
                            />
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">
                              Capacity
                            </p>
                            <p className="font-medium text-gray-900">
                              {
                                selectedEvent.maxParticipants
                              }{" "}
                              participants
                            </p>
                          </div>
                        </div>

                        {selectedEvent.donationDeadline && (
                          <div className="flex items-start gap-3">
                            <div className="p-2 bg-purple-100 rounded-lg">
                              <Clock
                                className="text-purple-600"
                                size={20}
                              />
                            </div>
                            <div>
                              <p className="text-sm text-gray-600">
                                Registration
                                Deadline
                              </p>
                              <p className="font-medium text-gray-900">
                                {format(
                                  new Date(
                                    selectedEvent.donationDeadline
                                  ),
                                  "MMM dd, yyyy"
                                )}
                              </p>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="space-y-3">
                      <button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3.5 rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl">
                        Register Now
                      </button>
                      <button className="w-full bg-white border border-gray-300 text-gray-700 py-3.5 rounded-xl font-medium hover:bg-gray-50 transition-colors">
                        Add to Calendar
                      </button>
                      <button className="w-full bg-white border border-gray-300 text-gray-700 py-3.5 rounded-xl font-medium hover:bg-gray-50 transition-colors">
                        Get Directions
                      </button>
                    </div>

                    {/* Share Event */}
                    <div className="bg-gray-50 border border-gray-200 rounded-xl p-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">
                        Share Event
                      </h3>
                      <div className="flex gap-3">
                        <button className="flex-1 flex items-center justify-center gap-2 bg-blue-500 text-white py-2.5 rounded-lg hover:bg-blue-600 transition-colors">
                          <svg
                            className="w-5 h-5"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                          </svg>
                          Facebook
                        </button>
                        <button className="flex-1 flex items-center justify-center gap-2 bg-blue-400 text-white py-2.5 rounded-lg hover:bg-blue-500 transition-colors">
                          <svg
                            className="w-5 h-5"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.213c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                          </svg>
                          Twitter
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          // Events List View
          <div>
            {/* Results Count */}
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Discover Events
                </h1>
                <p className="text-gray-600">
                  {filteredEvents.length}{" "}
                  {filteredEvents.length === 1
                    ? "event"
                    : "events"}{" "}
                  found
                </p>
              </div>
              <div className="text-sm text-gray-600">
                Showing{" "}
                {Math.min(
                  filteredEvents.length,
                  12
                )}{" "}
                of {filteredEvents.length}
              </div>
            </div>

            {/* Events Grid/List */}
            {filteredEvents.length === 0 ? (
              <div className="text-center py-20 bg-white rounded-2xl border border-gray-200">
                <div className="inline-flex p-4 bg-gray-100 rounded-2xl mb-6">
                  <Calendar
                    size={48}
                    className="text-gray-400"
                  />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">
                  No events found
                </h3>
                <p className="text-gray-600 mb-8 max-w-md mx-auto">
                  Try adjusting your search
                  filters or check back later for
                  new events.
                </p>
                <button
                  onClick={() => {
                    setSearchTerm("");
                    setFilterCategory("all");
                    setFilterDate("all");
                  }}
                  className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-xl font-semibold shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all"
                >
                  <Search size={20} />
                  Clear All Filters
                </button>
              </div>
            ) : (
              <>
                <div
                  className={`gap-6 ${layoutMode === "grid" ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3" : "flex flex-col"}`}
                >
                  {filteredEvents
                    .slice(0, 12)
                    .map((event) => (
                      <div
                        key={event._id}
                        className={`bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden hover:shadow-2xl hover:border-blue-200 transition-all duration-500 ${
                          layoutMode === "list"
                            ? "flex"
                            : ""
                        }`}
                      >
                        {/* Event Image */}
                        <div
                          className={`relative ${layoutMode === "list" ? "w-48 flex-shrink-0" : "h-48"}`}
                        >
                          {event.files &&
                          event.files.length >
                            0 ? (
                            <Image
                              src={
                                event.files[0].url
                              }
                              alt={event.title}
                              fill
                              className="object-cover"
                            />
                          ) : (
                            <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                              <Calendar
                                size={48}
                                className="text-white/30"
                              />
                            </div>
                          )}

                          {/* Category Badge */}
                          <div className="absolute top-4 left-4">
                            <span
                              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold ${getCategoryColor(event.category)}`}
                            >
                              {getCategoryIcon(
                                event.category
                              )}
                              {event.category}
                            </span>
                          </div>

                          {/* Featured Badge */}
                          {event.isFeatured && (
                            <div className="absolute top-4 right-4">
                              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 text-white text-xs font-semibold shadow-lg">
                                <Star size={12} />
                                Featured
                              </span>
                            </div>
                          )}

                          {/* Date Badge */}
                          <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-lg">
                            <div className="text-sm font-bold text-gray-900">
                              {formatDateDisplay(
                                event.date
                              )}
                            </div>
                            <div className="text-xs text-gray-600">
                              {formatTimeDisplay(
                                event.date
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Event Content */}
                        <div
                          className={`p-6 ${layoutMode === "list" ? "flex-1" : ""}`}
                        >
                          <div className="flex justify-between items-start mb-4">
                            <div>
                              <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2">
                                {event.title}
                              </h3>
                              <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                                {
                                  event.description
                                }
                              </p>
                            </div>
                            {layoutMode ===
                              "list" && (
                              <div className="flex items-center gap-2">
                                <button
                                  onClick={() =>
                                    handleBookmarkToggle(
                                      event._id
                                    )
                                  }
                                  className={`p-2 rounded-lg transition-colors ${
                                    bookmarkedEvents.includes(
                                      event._id
                                    )
                                      ? "text-red-600 bg-red-50 hover:bg-red-100"
                                      : "text-gray-500 hover:text-gray-700 hover:bg-gray-100"
                                  }`}
                                >
                                  <Bookmark
                                    size={18}
                                    fill={
                                      bookmarkedEvents.includes(
                                        event._id
                                      )
                                        ? "currentColor"
                                        : "none"
                                    }
                                  />
                                </button>
                                <button
                                  onClick={() => {
                                    setSelectedEvent(
                                      event
                                    );
                                    setViewMode(
                                      "details"
                                    );
                                  }}
                                  className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                >
                                  <Eye
                                    size={18}
                                  />
                                </button>
                              </div>
                            )}
                          </div>

                          {/* Details Grid */}
                          <div className="grid grid-cols-2 gap-4 mb-6">
                            <div className="flex items-center gap-3">
                              <div className="p-2 bg-blue-50 rounded-lg">
                                <MapPin
                                  size={16}
                                  className="text-blue-600"
                                />
                              </div>
                              <div>
                                <p className="text-xs text-gray-500">
                                  Location
                                </p>
                                <p className="text-sm font-medium text-gray-900 line-clamp-1">
                                  {event.location}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center gap-3">
                              <div className="p-2 bg-green-50 rounded-lg">
                                <Users
                                  size={16}
                                  className="text-green-600"
                                />
                              </div>
                              <div>
                                <p className="text-xs text-gray-500">
                                  Capacity
                                </p>
                                <p className="text-sm font-medium text-gray-900">
                                  {
                                    event.maxParticipants
                                  }
                                </p>
                              </div>
                            </div>
                          </div>

                          {/* Action Buttons */}
                          <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                            <div className="flex items-center gap-3">
                              <button
                                onClick={() => {
                                  setSelectedEvent(
                                    event
                                  );
                                  setViewMode(
                                    "details"
                                  );
                                }}
                                className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 text-sm font-medium hover:underline"
                              >
                                <Eye size={16} />
                                View Details
                              </button>
                            </div>

                            <div className="flex items-center gap-2">
                              <button
                                onClick={() =>
                                  handleBookmarkToggle(
                                    event._id
                                  )
                                }
                                className={`p-2 rounded-lg transition-colors ${
                                  bookmarkedEvents.includes(
                                    event._id
                                  )
                                    ? "text-red-600 hover:text-red-700 hover:bg-red-50"
                                    : "text-gray-500 hover:text-gray-700 hover:bg-gray-100"
                                }`}
                                title={
                                  bookmarkedEvents.includes(
                                    event._id
                                  )
                                    ? "Remove bookmark"
                                    : "Save event"
                                }
                              >
                                <Bookmark
                                  size={18}
                                  fill={
                                    bookmarkedEvents.includes(
                                      event._id
                                    )
                                      ? "currentColor"
                                      : "none"
                                  }
                                />
                              </button>
                              <button
                                onClick={() =>
                                  handleLikeToggle(
                                    event._id
                                  )
                                }
                                className={`p-2 rounded-lg transition-colors ${
                                  likedEvents.includes(
                                    event._id
                                  )
                                    ? "text-pink-600 hover:text-pink-700 hover:bg-pink-50"
                                    : "text-gray-500 hover:text-gray-700 hover:bg-gray-100"
                                }`}
                                title={
                                  likedEvents.includes(
                                    event._id
                                  )
                                    ? "Unlike"
                                    : "Like"
                                }
                              >
                                <Heart
                                  size={18}
                                  fill={
                                    likedEvents.includes(
                                      event._id
                                    )
                                      ? "currentColor"
                                      : "none"
                                  }
                                />
                              </button>
                              <button
                                onClick={() =>
                                  handleShare(
                                    event
                                  )
                                }
                                className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                title="Share"
                              >
                                <Share
                                  size={18}
                                />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>

                {/* Pagination */}
                {filteredEvents.length > 12 && (
                  <div className="flex justify-center items-center gap-4 mt-10">
                    <button className="flex items-center gap-2 px-5 py-3 border border-gray-300 rounded-xl hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
                      <ChevronLeft size={20} />
                      Previous
                    </button>

                    <div className="flex items-center gap-2">
                      {[1, 2, 3].map((page) => (
                        <button
                          key={page}
                          className={`w-12 h-12 rounded-xl transition-all duration-300 ${
                            page === 1
                              ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg"
                              : "border border-gray-300 hover:bg-gray-50"
                          }`}
                        >
                          {page}
                        </button>
                      ))}
                      <span className="text-gray-400">
                        ...
                      </span>
                      <button className="w-12 h-12 rounded-xl border border-gray-300 hover:bg-gray-50 transition-colors">
                        5
                      </button>
                    </div>

                    <button className="flex items-center gap-2 px-5 py-3 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors">
                      Next
                      <ChevronRight size={20} />
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-2 rounded-lg">
                  <Calendar className="h-6 w-6 text-white" />
                </div>
                <span className="text-xl font-bold text-gray-900">
                  EventHub
                </span>
              </div>
              <p className="text-gray-600">
                Discover and join amazing events
                in your community.
              </p>
            </div>

            <div>
              <h4 className="font-semibold text-gray-800 mb-4">
                Categories
              </h4>
              <ul className="space-y-2">
                {categories
                  .slice(1, 6)
                  .map((cat) => (
                    <li key={cat}>
                      <button
                        onClick={() =>
                          setFilterCategory(cat)
                        }
                        className="text-gray-600 hover:text-blue-600 transition-colors"
                      >
                        {cat}
                      </button>
                    </li>
                  ))}
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-gray-800 mb-4">
                Quick Links
              </h4>
              <ul className="space-y-2">
                <li>
                  <Link
                    href="/about"
                    className="text-gray-600 hover:text-blue-600 transition-colors"
                  >
                    About Us
                  </Link>
                </li>
                <li>
                  <Link
                    href="/contact"
                    className="text-gray-600 hover:text-blue-600 transition-colors"
                  >
                    Contact
                  </Link>
                </li>
                <li>
                  <Link
                    href="/faq"
                    className="text-gray-600 hover:text-blue-600 transition-colors"
                  >
                    FAQ
                  </Link>
                </li>
                <li>
                  <Link
                    href="/privacy"
                    className="text-gray-600 hover:text-blue-600 transition-colors"
                  >
                    Privacy Policy
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-gray-800 mb-4">
                Follow Us
              </h4>
              <div className="flex space-x-4">
                <a
                  href="#"
                  className="text-gray-600 hover:text-blue-600 transition-colors"
                >
                  Facebook
                </a>
                <a
                  href="#"
                  className="text-gray-600 hover:text-blue-600 transition-colors"
                >
                  Twitter
                </a>
                <a
                  href="#"
                  className="text-gray-600 hover:text-blue-600 transition-colors"
                >
                  Instagram
                </a>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-200 pt-8 text-center">
            <p className="text-gray-600">
              © {new Date().getFullYear()}{" "}
              EventHub. All rights reserved.
            </p>
          </div>
        </div>
      </footer>

      {/* Mobile Bottom Navigation */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 py-3 px-4">
        <div className="grid grid-cols-5">
          {tabs.slice(0, 5).map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex flex-col items-center justify-center p-2 rounded-lg transition-colors ${
                activeTab === tab.id
                  ? "text-blue-600 bg-blue-50"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              {tab.icon}
              <span className="text-xs mt-1">
                {tab.label}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
