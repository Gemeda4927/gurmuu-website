// app/blog/[slug]/page.tsx
"use client";

import {
  useState,
  useEffect,
  useRef,
} from "react";
import {
  useParams,
  useRouter,
} from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { toast, Toaster } from "react-hot-toast";
import {
  ArrowLeft,
  Calendar,
  User,
  Eye,
  Clock,
  Tag,
  BookOpen,
  Share2,
  Heart,
  Bookmark,
  ChevronRight,
  Facebook,
  Twitter,
  Linkedin,
  Mail,
  CheckCircle,
  Sparkles,
  Layers,
  Printer,
  ChevronUp,
  ExternalLink,
  Stars,
  Zap,
  Palette,
  Type,
  Moon,
  Sunrise,
  Feather,
  PenTool,
  Brush,
  PaintBucket,
  GraduationCap,
  Brain,
  Lightbulb,
  Target,
  Award,
  TrendingUp,
  Rocket,
  Crown,
  Gem,
  Diamond,
  Star,
  TargetIcon,
  Leaf,
  Trees,
  Flower,
  Mountain,
  Droplets,
  Wind,
  Cloud,
  Sun,
  CloudRain,
  CloudSnow,
  CloudLightning,
  Thermometer,
  Waves,
  Quote,
} from "lucide-react";
import {
  motion,
  AnimatePresence,
} from "framer-motion";
import { useBlogs } from "@/lib/hooks/useBlogs";
import { useAuthStore } from "@/lib/store/auth.store";
import { Blog } from "@/lib/types/blog.types";

// Beautiful green-based color palettes - Fresh, vibrant, and eye-catching
const CATEGORY_COLORS: Record<
  string,
  {
    gradient: string;
    bg: string;
    text: string;
    iconBg: string;
    lightBg: string;
    darkBg: string;
    accent: string;
  }
> = {
  Technology: {
    gradient:
      "from-emerald-500 via-teal-400 to-cyan-500",
    bg: "bg-gradient-to-r from-emerald-500 to-cyan-500",
    text: "text-emerald-600",
    iconBg:
      "bg-gradient-to-br from-emerald-500 to-teal-500",
    lightBg: "bg-emerald-50",
    darkBg: "bg-emerald-900",
    accent: "text-cyan-500",
  },
  Health: {
    gradient:
      "from-green-500 via-lime-400 to-emerald-500",
    bg: "bg-gradient-to-r from-green-500 to-emerald-500",
    text: "text-green-600",
    iconBg:
      "bg-gradient-to-br from-green-500 to-lime-500",
    lightBg: "bg-green-50",
    darkBg: "bg-green-900",
    accent: "text-lime-500",
  },
  Education: {
    gradient:
      "from-teal-500 via-emerald-400 to-green-500",
    bg: "bg-gradient-to-r from-teal-500 to-green-500",
    text: "text-teal-600",
    iconBg:
      "bg-gradient-to-br from-teal-500 to-emerald-500",
    lightBg: "bg-teal-50",
    darkBg: "bg-teal-900",
    accent: "text-emerald-500",
  },
  Community: {
    gradient:
      "from-cyan-500 via-sky-400 to-blue-500",
    bg: "bg-gradient-to-r from-cyan-500 to-blue-500",
    text: "text-cyan-600",
    iconBg:
      "bg-gradient-to-br from-cyan-500 to-sky-500",
    lightBg: "bg-cyan-50",
    darkBg: "bg-cyan-900",
    accent: "text-sky-500",
  },
  Lifestyle: {
    gradient:
      "from-lime-500 via-yellow-400 to-amber-500",
    bg: "bg-gradient-to-r from-lime-500 to-amber-500",
    text: "text-lime-600",
    iconBg:
      "bg-gradient-to-br from-lime-500 to-yellow-500",
    lightBg: "bg-lime-50",
    darkBg: "bg-lime-900",
    accent: "text-yellow-500",
  },
  News: {
    gradient:
      "from-emerald-600 via-teal-500 to-cyan-400",
    bg: "bg-gradient-to-r from-emerald-600 to-cyan-400",
    text: "text-emerald-700",
    iconBg:
      "bg-gradient-to-br from-emerald-600 to-teal-600",
    lightBg: "bg-emerald-50",
    darkBg: "bg-emerald-950",
    accent: "text-teal-500",
  },
};

// Nature-inspired category icons
const CATEGORY_ICONS: Record<
  string,
  JSX.Element
> = {
  Technology: <Zap className="w-5 h-5" />,
  Health: <Sun className="w-5 h-5" />,
  Education: <Brain className="w-5 h-5" />,
  Community: <Trees className="w-5 h-5" />,
  Lifestyle: <Flower className="w-5 h-5" />,
  News: <Waves className="w-5 h-5" />,
};

export default function BlogDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { slug } = params;
  const { blogsQuery } = useBlogs();
  const { user } = useAuthStore();
  const contentRef = useRef<HTMLDivElement>(null);

  const [blog, setBlog] = useState<Blog | null>(
    null
  );
  const [relatedBlogs, setRelatedBlogs] =
    useState<Blog[]>([]);
  const [isLiked, setIsLiked] = useState(false);
  const [isBookmarked, setIsBookmarked] =
    useState(false);
  const [readingProgress, setReadingProgress] =
    useState(0);
  const [
    showTableOfContents,
    setShowTableOfContents,
  ] = useState(false);
  const [tocItems, setTocItems] = useState<
    string[]
  >([]);
  const [activeTocItem, setActiveTocItem] =
    useState<string>("");
  const [
    estimatedReadTime,
    setEstimatedReadTime,
  ] = useState("");

  const categoryColors = blog
    ? CATEGORY_COLORS[blog.category] ||
      CATEGORY_COLORS.Technology
    : CATEGORY_COLORS.Technology;

  // Extract headings from content for table of contents
  useEffect(() => {
    if (blog?.content) {
      const parser = new DOMParser();
      const doc = parser.parseFromString(
        blog.content,
        "text/html"
      );
      const headings = Array.from(
        doc.querySelectorAll("h1, h2, h3")
      )
        .map((h) => h.textContent?.trim())
        .filter(Boolean) as string[];
      setTocItems(headings);
    }
  }, [blog]);

  // Track reading progress and active section
  useEffect(() => {
    const handleScroll = () => {
      const windowHeight = window.innerHeight;
      const documentHeight =
        document.documentElement.scrollHeight -
        windowHeight;
      const scrolled = window.scrollY;
      const progress =
        (scrolled / documentHeight) * 100;
      setReadingProgress(Math.min(100, progress));

      if (
        contentRef.current &&
        tocItems.length > 0
      ) {
        const headings =
          contentRef.current.querySelectorAll(
            "h1, h2, h3"
          );
        let currentActive = "";

        headings.forEach((heading, index) => {
          const rect =
            heading.getBoundingClientRect();
          if (
            rect.top <= 100 &&
            rect.bottom >= 100
          ) {
            currentActive = tocItems[index];
          }
        });

        if (currentActive) {
          setActiveTocItem(currentActive);
        }
      }
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
  }, [tocItems]);

  // Find blog by slug
  useEffect(() => {
    if (blogsQuery.data && slug) {
      const foundBlog = blogsQuery.data.find(
        (b) =>
          b.slug === slug &&
          b.status === "published" &&
          !b.isDeleted
      );

      if (foundBlog) {
        setBlog(foundBlog);

        // Calculate reading time with nature-themed text
        const words = foundBlog.content
          .trim()
          .split(/\s+/).length;
        const minutes = Math.ceil(words / 200);
        const readingThemes = [
          "🌱 Fresh read",
          "🌿 Deep dive",
          "🌳 Extended journey",
          "🍃 Quick insight",
        ];
        const theme =
          readingThemes[
            minutes % readingThemes.length
          ];
        setEstimatedReadTime(
          `${minutes} min • ${theme}`
        );

        // Find related blogs with natural relevance
        const related = blogsQuery.data
          .filter((b) => {
            if (b._id === foundBlog._id)
              return false;
            if (
              b.status !== "published" ||
              b.isDeleted
            )
              return false;
            return (
              b.category === foundBlog.category ||
              (b.tags &&
                foundBlog.tags &&
                b.tags.some((tag) =>
                  foundBlog.tags.includes(tag)
                ))
            );
          })
          .slice(0, 3);

        setRelatedBlogs(related);
      } else {
        toast.error(
          "This article has returned to the forest...",
          {
            icon: "🍃",
            duration: 3000,
            style: {
              borderRadius: "16px",
              background:
                "linear-gradient(135deg, #48bb78 0%, #38a169 100%)",
              color: "white",
              padding: "16px",
              fontWeight: "500",
            },
          }
        );
        router.push("/blog");
      }
    }
  }, [blogsQuery.data, slug, router]);

  // Nature-inspired interactions
  const handleLike = () => {
    setIsLiked(!isLiked);
    toast.success(
      isLiked
        ? "🌿 Removed from garden"
        : "🌺 Planted in your garden!",
      {
        duration: 2000,
        style: {
          borderRadius: "16px",
          background:
            "linear-gradient(135deg, #68d391 0%, #38a169 100%)",
          color: "white",
          padding: "14px",
          fontWeight: "500",
        },
      }
    );
  };

  const handleBookmark = () => {
    setIsBookmarked(!isBookmarked);
    toast.success(
      isBookmarked
        ? "📚 Removed from forest"
        : "🌳 Saved to your forest!",
      {
        duration: 2000,
        style: {
          borderRadius: "16px",
          background:
            "linear-gradient(135deg, #4fd1c5 0%, #319795 100%)",
          color: "white",
          padding: "14px",
          fontWeight: "500",
        },
      }
    );
  };

  const handleShare = (platform: string) => {
    const url = window.location.href;
    const title = blog?.title || "";
    const excerpt = blog?.excerpt || "";

    const shareData = {
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
      twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}&hashtags=nature,blog`,
      linkedin: `https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(url)}&title=${encodeURIComponent(title)}`,
    };

    if (platform === "mail") {
      window.location.href = `mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(`🌿 Discover this wonderful article:\n\n${title}\n\n${excerpt}\n\nRead more: ${url}`)}`;
    } else if (
      shareData[
        platform as keyof typeof shareData
      ]
    ) {
      window.open(
        shareData[
          platform as keyof typeof shareData
        ],
        "_blank",
        "width=600,height=400"
      );
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(
      window.location.href
    );
    toast.success(
      "🌱 Link copied to clipboard!",
      {
        style: {
          borderRadius: "16px",
          background:
            "linear-gradient(135deg, #9ae6b4 0%, #68d391 100%)",
          color: "#1a202c",
          padding: "14px",
          fontWeight: "500",
        },
      }
    );
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "Freshly published";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  const scrollToSection = (index: number) => {
    if (contentRef.current) {
      const headings =
        contentRef.current.querySelectorAll(
          "h1, h2, h3"
        );
      if (headings[index]) {
        headings[index].scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    }
  };

  // Loading state with nature theme
  if (blogsQuery.isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 flex items-center justify-center">
        <div className="text-center">
          <motion.div
            animate={{
              rotate: 360,
              scale: [1, 1.1, 1],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="w-24 h-24 mx-auto mb-8 relative"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-full opacity-20" />
            <div className="absolute inset-4 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center">
              <Leaf className="w-12 h-12 text-white animate-pulse" />
            </div>
          </motion.div>
          <p className="text-xl font-semibold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
            Growing your article...
          </p>
        </div>
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 flex flex-col items-center justify-center p-8">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center max-w-md"
        >
          <div className="w-40 h-40 bg-gradient-to-br from-emerald-200/30 to-teal-200/30 rounded-full flex items-center justify-center mx-auto mb-8">
            <div className="relative">
              <Trees className="w-20 h-20 text-emerald-400" />
              <Cloud className="w-12 h-12 text-cyan-300 absolute -top-6 -right-6" />
            </div>
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent mb-4">
            Article Has Blossomed Away
          </h1>
          <p className="text-gray-600 mb-8">
            This story has returned to the digital
            forest. Perhaps it's growing elsewhere
            or being nurtured for a better bloom.
          </p>
          <Link
            href="/blog"
            className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-semibold rounded-2xl hover:shadow-2xl hover:scale-105 transition-all duration-300 group shadow-lg"
          >
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            Return to the Garden
          </Link>
        </motion.div>
      </div>
    );
  }

  const isAdmin =
    user?.role === "admin" ||
    user?.role === "superadmin";
  const isAuthor = user?._id === blog.author._id;

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50/40 via-teal-50/20 to-cyan-50/20">
      <Toaster position="top-right" />

      {/* Nature-inspired Reading Progress Bar */}
      <div className="fixed top-0 left-0 right-0 h-2 z-50">
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-300 via-teal-400 to-cyan-400 opacity-40" />
        <motion.div
          className="h-full bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500"
          initial={{ scaleX: 0 }}
          animate={{
            scaleX: readingProgress / 100,
          }}
          transition={{
            type: "spring",
            stiffness: 200,
            damping: 30,
          }}
        />
        <div className="absolute right-4 top-1/2 -translate-y-1/2">
          <motion.div
            animate={{ y: [0, -2, 0] }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
            }}
          >
            <Leaf className="w-4 h-4 text-white" />
          </motion.div>
        </div>
      </div>

      {/* Floating Nature Menu */}
      <div className="fixed right-6 top-1/2 -translate-y-1/2 z-40 hidden lg:block">
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white/90 backdrop-blur-xl rounded-2xl shadow-2xl border border-emerald-100/50 p-3 space-y-3"
        >
          <motion.button
            whileHover={{ scale: 1.1, rotate: 5 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleLike}
            className={`p-3 rounded-xl transition-all ${
              isLiked
                ? "bg-gradient-to-br from-emerald-500 to-teal-500 text-white shadow-lg"
                : "bg-gradient-to-br from-emerald-50 to-teal-50 text-emerald-700 hover:from-emerald-100 hover:to-teal-100 border border-emerald-100"
            }`}
            title={
              isLiked
                ? "Liked"
                : "Plant in garden"
            }
          >
            <Heart
              className={`w-5 h-5 ${isLiked ? "fill-current" : ""}`}
            />
          </motion.button>

          <motion.button
            whileHover={{
              scale: 1.1,
              rotate: -5,
            }}
            whileTap={{ scale: 0.95 }}
            onClick={handleBookmark}
            className={`p-3 rounded-xl transition-all ${
              isBookmarked
                ? "bg-gradient-to-br from-teal-500 to-cyan-500 text-white shadow-lg"
                : "bg-gradient-to-br from-teal-50 to-cyan-50 text-teal-700 hover:from-teal-100 hover:to-cyan-100 border border-teal-100"
            }`}
            title={
              isBookmarked
                ? "Bookmarked"
                : "Save to forest"
            }
          >
            <Bookmark
              className={`w-5 h-5 ${isBookmarked ? "fill-current" : ""}`}
            />
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() =>
              setShowTableOfContents(
                !showTableOfContents
              )
            }
            className="p-3 bg-gradient-to-br from-emerald-50 to-teal-50 text-emerald-700 hover:from-emerald-100 hover:to-teal-100 rounded-xl transition-all border border-emerald-100"
            title="Table of Contents"
          >
            <Layers className="w-5 h-5" />
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => window.print()}
            className="p-3 bg-gradient-to-br from-cyan-50 to-blue-50 text-cyan-700 hover:from-cyan-100 hover:to-blue-100 rounded-xl transition-all border border-cyan-100"
            title="Print"
          >
            <Printer className="w-5 h-5" />
          </motion.button>
        </motion.div>
      </div>

      {/* Table of Contents - Nature Theme */}
      <AnimatePresence>
        {showTableOfContents &&
          tocItems.length > 0 && (
            <motion.div
              initial={{ opacity: 0, x: 300 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 300 }}
              className="fixed right-6 top-24 z-40 hidden lg:block"
            >
              <div className="w-72 bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-emerald-100/50 p-6">
                <div className="flex items-center justify-between mb-5">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-lg">
                      <Trees className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900">
                        Path Through the Forest
                      </h3>
                      <p className="text-xs text-emerald-600">
                        Table of Contents
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() =>
                      setShowTableOfContents(
                        false
                      )
                    }
                    className="p-2 hover:bg-emerald-50 rounded-lg transition"
                  >
                    <span className="text-xl text-emerald-500 hover:text-emerald-700">
                      ×
                    </span>
                  </button>
                </div>
                <div className="space-y-2 max-h-96 overflow-y-auto pr-2">
                  {tocItems.map((item, index) => (
                    <motion.button
                      key={index}
                      whileHover={{ x: 4 }}
                      onClick={() =>
                        scrollToSection(index)
                      }
                      className={`block w-full text-left px-4 py-3 rounded-xl transition-all duration-300 ${
                        activeTocItem === item
                          ? "bg-gradient-to-r from-emerald-50 to-teal-50 text-emerald-700 font-semibold shadow-sm border border-emerald-100"
                          : "text-gray-600 hover:text-emerald-700 hover:bg-emerald-50/50"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-2 h-2 rounded-full ${
                            activeTocItem === item
                              ? "bg-gradient-to-r from-emerald-500 to-teal-500"
                              : "bg-emerald-200"
                          }`}
                        />
                        <span className="text-sm truncate">
                          {item}
                        </span>
                        {activeTocItem ===
                          item && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="ml-auto"
                          >
                            <Leaf className="w-3 h-3 text-emerald-500" />
                          </motion.div>
                        )}
                      </div>
                    </motion.button>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
      </AnimatePresence>

      <div className="container mx-auto px-4 lg:px-8 max-w-4xl">
        {/* Back Navigation - Nature Theme */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="py-8"
        >
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/80 backdrop-blur-sm rounded-full text-emerald-700 hover:text-emerald-800 hover:bg-white transition-all duration-300 border border-emerald-100 hover:border-emerald-200 shadow-sm hover:shadow-md group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span className="font-medium">
              Return to Garden
            </span>
            <Cloud className="w-4 h-4 text-emerald-300 ml-2" />
          </Link>
        </motion.div>

        {/* Article Header - Fresh & Vibrant */}
        <motion.header
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          {/* Category Badge with Nature */}
          <div className="flex items-center justify-between mb-8">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="inline-flex items-center gap-3 px-4 py-2.5 bg-white/80 backdrop-blur-sm rounded-full border border-emerald-100 shadow-sm"
            >
              <div
                className={`p-2 ${categoryColors.iconBg} rounded-full shadow-md`}
              >
                {CATEGORY_ICONS[
                  blog.category
                ] || (
                  <Leaf className="w-5 h-5 text-white" />
                )}
              </div>
              <div>
                <span
                  className={`font-bold ${categoryColors.text} tracking-wide`}
                >
                  {blog.category}
                </span>
                <div className="flex items-center gap-1 mt-1">
                  {[...Array(3)].map((_, i) => (
                    <motion.div
                      key={i}
                      animate={{
                        scale: [1, 1.2, 1],
                      }}
                      transition={{
                        delay: i * 0.1,
                        duration: 1.5,
                        repeat: Infinity,
                      }}
                      className="w-1 h-1 rounded-full bg-emerald-400"
                    />
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Featured Badge */}
            {blog.isFeatured && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-400 to-teal-500 text-white font-bold rounded-full text-sm shadow-lg"
              >
                <Sparkles className="w-4 h-4" />
                Featured Bloom
              </motion.div>
            )}
          </div>

          {/* Title with Fresh Gradient */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-5xl lg:text-6xl font-bold mb-8 leading-tight tracking-tight"
          >
            <span
              className={`bg-gradient-to-r ${categoryColors.gradient} bg-clip-text text-transparent`}
            >
              {blog.title}
            </span>
          </motion.h1>

          {/* Excerpt with Nature Accent */}
          {blog.excerpt && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="relative pl-10 mb-10"
            >
              <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-emerald-400 via-teal-400 to-cyan-400 rounded-full" />
              <div className="absolute -left-6 top-1/2 -translate-y-1/2">
                <Quote className="w-8 h-8 text-emerald-300" />
              </div>
              <p className="text-2xl text-gray-700 italic leading-relaxed">
                "{blog.excerpt}"
              </p>
            </motion.div>
          )}

          {/* Author & Meta Info - Fresh Design */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="p-6 bg-gradient-to-r from-white/60 to-emerald-50/30 backdrop-blur-sm rounded-2xl border border-emerald-100/50 shadow-lg"
          >
            <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
              {/* Author */}
              <div className="flex items-center gap-4">
                <div className="relative">
                  <div className="w-20 h-20 bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-500 rounded-full flex items-center justify-center text-white text-2xl font-bold shadow-xl">
                    {blog.author.name.charAt(0)}
                  </div>
                  <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-gradient-to-br from-lime-400 to-green-500 rounded-full flex items-center justify-center text-white shadow-lg">
                    <CheckCircle className="w-5 h-5" />
                  </div>
                </div>
                <div>
                  <p className="font-bold text-gray-900 text-lg">
                    {blog.author.name}
                  </p>
                  <p className="text-gray-600 text-sm">
                    {blog.author.email}
                  </p>
                  <div className="flex items-center gap-2 mt-2">
                    <div className="flex">
                      {[...Array(5)].map(
                        (_, i) => (
                          <Star
                            key={i}
                            className="w-4 h-4 text-amber-400 fill-amber-400"
                          />
                        )
                      )}
                    </div>
                    <span className="text-xs text-emerald-600 font-medium">
                      Expert Writer
                    </span>
                  </div>
                </div>
              </div>

              {/* Stats with Nature Icons */}
              <div className="flex flex-wrap gap-6">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-gradient-to-br from-emerald-100 to-emerald-50 rounded-xl">
                    <Calendar className="w-5 h-5 text-emerald-600" />
                  </div>
                  <div>
                    <p className="text-sm text-emerald-700">
                      Published
                    </p>
                    <p className="font-semibold text-gray-900">
                      {formatDate(
                        blog.publishedAt ||
                          blog.createdAt
                      )}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-gradient-to-br from-teal-100 to-teal-50 rounded-xl">
                    <Eye className="w-5 h-5 text-teal-600" />
                  </div>
                  <div>
                    <p className="text-sm text-teal-700">
                      Views
                    </p>
                    <p className="font-semibold text-gray-900">
                      {(
                        blog.views || 0
                      ).toLocaleString()}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-gradient-to-br from-cyan-100 to-cyan-50 rounded-xl">
                    <Clock className="w-5 h-5 text-cyan-600" />
                  </div>
                  <div>
                    <p className="text-sm text-cyan-700">
                      Read Time
                    </p>
                    <p className="font-semibold text-gray-900">
                      {estimatedReadTime}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.header>

        {/* Cover Image with Nature Overlay */}
        {blog.coverImage?.url && (
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5 }}
            className="relative h-80 lg:h-[450px] rounded-3xl overflow-hidden mb-12 shadow-2xl group"
          >
            <Image
              src={blog.coverImage.url}
              alt={blog.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-700"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-emerald-900/40 via-transparent to-transparent" />
            <div className="absolute bottom-6 left-6 flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-white/20 to-white/10 backdrop-blur-sm rounded-full flex items-center justify-center">
                <Feather className="w-6 h-6 text-white" />
              </div>
              <p className="text-white/90 text-sm font-medium">
                Scroll to wander through the story
              </p>
            </div>
            {/* Floating leaves */}
            <motion.div
              animate={{
                y: [0, -10, 0],
                rotate: [0, 5, 0],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
              }}
              className="absolute top-4 right-4"
            >
              <Leaf className="w-8 h-8 text-emerald-300/60" />
            </motion.div>
          </motion.div>
        )}

        {/* Tags - Fresh Garden Style */}
        {blog.tags && blog.tags.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="flex flex-wrap gap-3 mb-12"
          >
            {blog.tags
              .slice(0, 8)
              .map((tag, index) => (
                <motion.span
                  key={tag}
                  initial={{
                    opacity: 0,
                    scale: 0.9,
                  }}
                  animate={{
                    opacity: 1,
                    scale: 1,
                  }}
                  transition={{
                    delay: 0.6 + index * 0.05,
                  }}
                  className="px-4 py-2.5 bg-gradient-to-r from-emerald-50 to-teal-50 text-emerald-700 rounded-xl text-sm font-medium hover:from-emerald-100 hover:to-teal-100 hover:text-emerald-800 transition-all duration-300 border border-emerald-100 hover:border-emerald-200 cursor-pointer shadow-sm hover:shadow-md flex items-center gap-2"
                >
                  <Tag className="w-3.5 h-3.5" />#
                  {tag}
                </motion.span>
              ))}
          </motion.div>
        )}

        {/* Article Content - Fresh Reading Experience */}
        <motion.article
          ref={contentRef}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="relative mb-16"
        >
          {/* Decorative nature sidebar */}
          <div className="absolute -left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-emerald-300 via-teal-300 to-cyan-300 hidden lg:block" />

          {/* Content container with fresh background */}
          <div className="bg-white/60 backdrop-blur-sm rounded-3xl p-8 lg:p-10 border border-emerald-100/50 shadow-lg">
            <div
              className="prose prose-lg lg:prose-xl max-w-none text-gray-800 leading-relaxed"
              dangerouslySetInnerHTML={{
                __html: blog.content,
              }}
              style={{
                fontFamily:
                  "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
                lineHeight: "1.8",
              }}
            />
          </div>
        </motion.article>

        {/* Share & Actions - Fresh Garden Theme */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-white/60 to-emerald-50/40 backdrop-blur-sm rounded-2xl p-8 mb-16 border border-emerald-100/50 shadow-xl"
        >
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
            <div className="text-center lg:text-left">
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Enjoyed this journey?
              </h3>
              <p className="text-gray-600">
                Share the beauty with others
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-6">
              <div className="flex items-center gap-3">
                <span className="text-gray-600 font-medium">
                  Share:
                </span>
                <div className="flex items-center gap-2">
                  {[
                    "facebook",
                    "twitter",
                    "linkedin",
                    "mail",
                  ].map((platform) => (
                    <motion.button
                      key={platform}
                      whileHover={{
                        scale: 1.1,
                        y: -2,
                      }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() =>
                        handleShare(platform)
                      }
                      className="p-2.5 bg-gradient-to-br from-emerald-50 to-teal-50 text-emerald-700 hover:text-white rounded-xl transition-all duration-300 hover:shadow-md border border-emerald-100"
                      style={{
                        ...(platform ===
                          "facebook" && {
                          background:
                            "linear-gradient(135deg, #48bb78, #38a169)",
                        }),
                        ...(platform ===
                          "twitter" && {
                          background:
                            "linear-gradient(135deg, #68d391, #48bb78)",
                        }),
                        ...(platform ===
                          "linkedin" && {
                          background:
                            "linear-gradient(135deg, #4fd1c5, #319795)",
                        }),
                        ...(platform ===
                          "mail" && {
                          background:
                            "linear-gradient(135deg, #9ae6b4, #68d391)",
                        }),
                      }}
                      title={`Share on ${platform}`}
                    >
                      {platform ===
                        "facebook" && (
                        <Facebook className="w-5 h-5" />
                      )}
                      {platform === "twitter" && (
                        <Twitter className="w-5 h-5" />
                      )}
                      {platform ===
                        "linkedin" && (
                        <Linkedin className="w-5 h-5" />
                      )}
                      {platform === "mail" && (
                        <Mail className="w-5 h-5" />
                      )}
                    </motion.button>
                  ))}
                  <motion.button
                    whileHover={{
                      scale: 1.1,
                      y: -2,
                    }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleCopyLink}
                    className="p-2.5 bg-gradient-to-br from-emerald-50 to-teal-50 text-emerald-700 hover:from-emerald-100 hover:to-teal-100 hover:text-emerald-800 rounded-xl transition-all duration-300 hover:shadow-md border border-emerald-100"
                    title="Copy link"
                  >
                    <Share2 className="w-5 h-5" />
                  </motion.button>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleLike}
                  className={`px-5 py-2.5 rounded-xl font-medium transition-all flex items-center gap-2 ${
                    isLiked
                      ? "bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg"
                      : "bg-gradient-to-r from-emerald-50 to-teal-50 text-emerald-700 hover:from-emerald-100 hover:to-teal-100 border border-emerald-100"
                  }`}
                >
                  <Heart
                    className={`w-5 h-5 ${isLiked ? "fill-current" : ""}`}
                  />
                  {isLiked ? "Planted" : "Plant"}
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleBookmark}
                  className={`px-5 py-2.5 rounded-xl font-medium transition-all flex items-center gap-2 ${
                    isBookmarked
                      ? "bg-gradient-to-r from-teal-500 to-cyan-500 text-white shadow-lg"
                      : "bg-gradient-to-r from-teal-50 to-cyan-50 text-teal-700 hover:from-teal-100 hover:to-cyan-100 border border-teal-100"
                  }`}
                >
                  <Bookmark
                    className={`w-5 h-5 ${isBookmarked ? "fill-current" : ""}`}
                  />
                  {isBookmarked
                    ? "Saved"
                    : "Save"}
                </motion.button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Author Spotlight - Garden Theme */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-20"
        >
          <div className="bg-gradient-to-br from-white to-emerald-50/40 rounded-3xl overflow-hidden border border-emerald-100/50 shadow-2xl">
            <div className="p-10">
              <div className="flex flex-col lg:flex-row items-center gap-10">
                <div className="relative">
                  <div className="w-44 h-44 bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-500 rounded-full flex items-center justify-center text-white text-5xl font-bold shadow-2xl">
                    {blog.author.name.charAt(0)}
                  </div>
                  <div className="absolute -bottom-6 -right-6 w-20 h-20 bg-gradient-to-br from-lime-400 to-green-500 rounded-full flex items-center justify-center text-white shadow-xl">
                    <Award className="w-10 h-10" />
                  </div>
                  <motion.div
                    animate={{
                      rotate: [0, 10, 0],
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                    }}
                    className="absolute -top-4 -left-4"
                  >
                    <Flower className="w-10 h-10 text-emerald-300" />
                  </motion.div>
                </div>

                <div className="flex-1">
                  <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-500/10 to-teal-500/10 rounded-full mb-6">
                    <Sparkles className="w-4 h-4 text-emerald-500" />
                    <span className="text-sm font-bold text-emerald-700">
                      Garden Guide
                    </span>
                  </div>

                  <h3 className="text-3xl font-bold text-gray-900 mb-4">
                    Meet{" "}
                    {
                      blog.author.name.split(
                        " "
                      )[0]
                    }
                  </h3>

                  <p className="text-gray-600 text-lg leading-relaxed mb-6">
                    A passionate storyteller who
                    cultivates knowledge in{" "}
                    {blog.category.toLowerCase()}{" "}
                    topics. With a green thumb for
                    words and a deep connection to
                    nature,{" "}
                    {
                      blog.author.name.split(
                        " "
                      )[0]
                    }
                    grows content that inspires
                    readers to blossom in their
                    understanding.
                  </p>

                  <div className="flex flex-wrap gap-3">
                    <div className="px-4 py-2.5 bg-gradient-to-r from-emerald-50 to-emerald-100 text-emerald-700 rounded-full text-sm font-medium">
                      ✍️{" "}
                      {Math.ceil(
                        blog.content.length / 1000
                      )}
                      k Words Sown
                    </div>
                    <div className="px-4 py-2.5 bg-gradient-to-r from-teal-50 to-teal-100 text-teal-700 rounded-full text-sm font-medium">
                      🌱 Expert Cultivator
                    </div>
                    <div className="px-4 py-2.5 bg-gradient-to-r from-cyan-50 to-cyan-100 text-cyan-700 rounded-full text-sm font-medium">
                      💧{" "}
                      {blog.views?.toLocaleString() ||
                        "0"}{" "}
                      Readers Watered
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.section>

        {/* Related Articles - Forest Path */}
        {relatedBlogs.length > 0 && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-20"
          >
            <div className="flex items-center justify-between mb-10">
              <div>
                <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
                  Continue Your Forest Walk
                </h2>
                <p className="text-gray-600">
                  Discover more blooms in the
                  garden of knowledge
                </p>
              </div>
              <Link
                href="/blog"
                className="inline-flex items-center gap-2 px-6 py-3 text-emerald-600 hover:text-emerald-700 font-medium group"
              >
                Explore Garden
                <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {relatedBlogs.map(
                (relatedBlog, index) => {
                  const relatedColors =
                    CATEGORY_COLORS[
                      relatedBlog.category
                    ] ||
                    CATEGORY_COLORS.Technology;
                  return (
                    <motion.article
                      key={relatedBlog._id}
                      initial={{
                        opacity: 0,
                        y: 20,
                      }}
                      animate={{
                        opacity: 1,
                        y: 0,
                      }}
                      transition={{
                        delay: index * 0.1,
                      }}
                      whileHover={{ y: -8 }}
                      className="group"
                    >
                      <Link
                        href={`/blog/${relatedBlog.slug}`}
                      >
                        <div className="bg-white rounded-2xl overflow-hidden border border-emerald-100 hover:border-emerald-200 hover:shadow-2xl transition-all duration-500 h-full">
                          {relatedBlog.coverImage
                            ?.url && (
                            <div className="relative h-48 overflow-hidden">
                              <Image
                                src={
                                  relatedBlog
                                    .coverImage
                                    .url
                                }
                                alt={
                                  relatedBlog.title
                                }
                                fill
                                className="object-cover group-hover:scale-110 transition-transform duration-700"
                              />
                              <div className="absolute inset-0 bg-gradient-to-t from-emerald-900/30 to-transparent" />
                            </div>
                          )}
                          <div className="p-6">
                            <div className="flex items-center justify-between mb-4">
                              <span
                                className={`px-3 py-1 ${relatedColors.bg} text-white rounded-full text-xs font-bold`}
                              >
                                {
                                  relatedBlog.category
                                }
                              </span>
                              <span className="text-xs text-emerald-600 flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                {Math.ceil(
                                  relatedBlog
                                    .content
                                    .length / 200
                                )}{" "}
                                min
                              </span>
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-emerald-600 transition line-clamp-2 leading-tight">
                              {relatedBlog.title}
                            </h3>
                            <div className="flex items-center justify-between pt-4 border-t border-emerald-100">
                              <div className="flex items-center gap-2">
                                <div className="w-8 h-8 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-full flex items-center justify-center text-white text-xs">
                                  {relatedBlog.author.name.charAt(
                                    0
                                  )}
                                </div>
                                <span className="text-sm text-gray-600">
                                  {
                                    relatedBlog
                                      .author.name
                                  }
                                </span>
                              </div>
                              <ChevronRight className="w-5 h-5 text-emerald-400 group-hover:text-emerald-500 group-hover:translate-x-1 transition-transform" />
                            </div>
                          </div>
                        </div>
                      </Link>
                    </motion.article>
                  );
                }
              )}
            </div>
          </motion.section>
        )}

        {/* Newsletter - Fresh Garden */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative overflow-hidden rounded-3xl mb-16"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500" />
          <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width=%2260%22%20height=%2260%22%20viewBox=%220%200%2060%2060%22%20xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cg%20fill=%22none%22%20fill-rule=%22evenodd%22%3E%3Cg%20fill=%22%23ffffff%22%20fill-opacity=%220.1%22%3E%3Cpath%20d=%22M36%2034v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6%2034v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6%204V0H4v4H0v2h4v4h2V6h4V4H6z%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')]" />

          <div className="relative p-10 lg:p-12 text-center text-white">
            <div className="inline-flex p-4 bg-gradient-to-br from-white/20 to-white/10 backdrop-blur-sm rounded-2xl mb-6">
              <Trees className="w-10 h-10" />
            </div>
            <h3 className="text-3xl font-bold mb-4">
              Join Our Growing Community
            </h3>
            <p className="text-lg text-white/90 mb-8 max-w-2xl mx-auto">
              Subscribe to receive fresh insights,
              blooming stories, and
              nature-inspired content that will
              help your knowledge grow.
            </p>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                toast.success(
                  "🌱 Welcome to the garden! Check your email for a special seedling.",
                  {
                    duration: 5000,
                    style: {
                      borderRadius: "16px",
                      background:
                        "linear-gradient(135deg, #48bb78 0%, #38a169 100%)",
                      color: "white",
                      padding: "16px",
                      fontWeight: "500",
                    },
                  }
                );
              }}
              className="max-w-md mx-auto flex flex-col sm:flex-row gap-4"
            >
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-6 py-4 rounded-xl text-gray-900 placeholder-emerald-500 focus:outline-none focus:ring-4 focus:ring-white/30 shadow-lg"
                required
              />
              <button
                type="submit"
                className="px-8 py-4 bg-white text-emerald-600 font-bold rounded-xl hover:bg-emerald-50 transition-all shadow-lg hover:shadow-xl"
              >
                Grow With Us
              </button>
            </form>
            <p className="text-sm text-white/75 mt-6">
              Join 10,000+ readers cultivating
              knowledge. No spam, just natural
              growth.
            </p>
          </div>
        </motion.div>
      </div>

      {/* Back to Top - Leaf Button */}
      <AnimatePresence>
        {readingProgress > 20 && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            onClick={() =>
              window.scrollTo({
                top: 0,
                behavior: "smooth",
              })
            }
            className="fixed bottom-6 right-6 w-14 h-14 bg-gradient-to-br from-emerald-500 to-teal-500 text-white rounded-2xl shadow-2xl hover:shadow-3xl transition-all duration-300 z-50 flex items-center justify-center hover:scale-110 group"
          >
            <motion.div
              animate={{ y: [0, -3, 0] }}
              transition={{
                duration: 2,
                repeat: Infinity,
              }}
            >
              <ChevronUp className="w-6 h-6 group-hover:-translate-y-1 transition-transform" />
            </motion.div>
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}
